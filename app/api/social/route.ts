// POST /api/social — called by the WordPress "EDD Social Share" plugin the
// first time a blog post or project is published.
//
// 1. Checks the shared secret.
// 2. Asks Claude for three captions (LinkedIn, Facebook, Instagram) written
//    from the item's own text — no made-up facts.
// 3. Posts to the Facebook Page, Instagram (needs a JPEG featured image) and
//    the LinkedIn company page. Each channel is optional: leave its env vars
//    out and it's skipped.
// 4. Returns what happened; WordPress stores it on the item.
//
// Test mode is ON until SOCIAL_LIVE=1 is set: captions are written and
// returned, but nothing is posted. See docs/SOCIAL-AUTOMATION.md.

import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";

export const maxDuration = 60;

interface Payload {
  type: "post" | "project";
  id?: number;
  title: string;
  excerpt?: string;
  text?: string;
  url: string;
  image?: string;
  tags?: string[];
}

interface Captions {
  linkedin: string;
  facebook: string;
  instagram: string;
}

type ChannelResult =
  { ok: true; id?: string } | { ok: false; error?: string; skipped?: string };

const env = (k: string) => process.env[k]?.trim() || undefined;
const GRAPH = () =>
  `https://graph.facebook.com/${env("META_GRAPH_VERSION") ?? "v23.0"}`;

function authorised(req: NextRequest) {
  const expected = env("SOCIAL_WEBHOOK_SECRET");
  const got = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !got) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(got);
  return a.length === b.length && timingSafeEqual(a, b);
}

// ---------------------------------------------------------------- captions

const STYLE = `You write social media posts for Every Day Digital, a small Auckland web design, development, hosting and automation business run by Sam Muir.
Voice: friendly, plain New Zealand English (NZ spelling), confident but never salesy. Short sentences. No buzzwords, no hype words like "revolutionise", "game-changer", "unlock", "elevate", "seamless". At most one emoji per post, often none.
Only use facts that appear in the source text. Never invent numbers, results, quotes or client names.`;

function fallbackCaptions(p: Payload): Captions {
  const lead = p.excerpt || p.title;
  const what = p.type === "post" ? "New on the blog" : "Project delivered";
  return {
    linkedin: `${what}: ${p.title}\n\n${lead}\n\nRead it here: ${p.url}`,
    facebook: `${what}: ${p.title}\n\n${lead}\n\n${p.url}`,
    instagram: `${what}: ${p.title}\n\n${lead}\n\nLink in bio.\n\n#webdesign #nzbusiness #everydaydigital`,
  };
}

async function writeCaptions(
  p: Payload,
): Promise<{ captions: Captions; ai: boolean }> {
  const key = env("ANTHROPIC_API_KEY");
  if (!key) return { captions: fallbackCaptions(p), ai: false };

  const kind =
    p.type === "post"
      ? "a new blog article"
      : "a project we've just delivered for a client";
  const prompt = `Write three posts announcing ${kind}.

Title: ${p.title}
Summary: ${p.excerpt ?? ""}
Tags: ${(p.tags ?? []).join(", ")}
Link: ${p.url}
Source text (for facts only):
"""
${(p.text ?? "").slice(0, 3500)}
"""

Rules per channel:
- linkedin: 600–1200 characters. Open with a specific, useful line (not "Excited to share"). 2–4 short paragraphs that give the reader one real takeaway, then the link on its own line. 2–3 hashtags at the end.
- facebook: 250–500 characters, conversational, end with the link.
- instagram: 300–600 characters, no link (say "Link in bio"), 5–8 relevant hashtags on the last line including #everydaydigital and #nzbusiness.

Reply with JSON only: {"linkedin": "...", "facebook": "...", "instagram": "..."}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: env("SOCIAL_MODEL") ?? "claude-sonnet-5-5",
        max_tokens: 1500,
        system: STYLE,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) throw new Error(`Claude API ${res.status}`);
    const data = (await res.json()) as { content?: { text?: string }[] };
    const text = data.content?.map((c) => c.text ?? "").join("") ?? "";
    const json = JSON.parse(
      text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1),
    );
    if (!json.linkedin || !json.facebook || !json.instagram)
      throw new Error("missing caption");
    return { captions: json as Captions, ai: true };
  } catch (e) {
    console.error("[social] caption fallback:", e);
    return { captions: fallbackCaptions(p), ai: false };
  }
}

// ---------------------------------------------------------------- channels

async function postFacebook(
  p: Payload,
  message: string,
): Promise<ChannelResult> {
  const page = env("FB_PAGE_ID");
  const token = env("FB_PAGE_TOKEN");
  if (!page || !token) return { ok: false, skipped: "not set up" };
  const body = new URLSearchParams({
    message,
    link: p.url,
    access_token: token,
  });
  const res = await fetch(`${GRAPH()}/${page}/feed`, { method: "POST", body });
  const j = (await res.json()) as { id?: string; error?: { message: string } };
  return res.ok && j.id
    ? { ok: true, id: j.id }
    : { ok: false, error: j.error?.message ?? `HTTP ${res.status}` };
}

async function postInstagram(
  p: Payload,
  caption: string,
): Promise<ChannelResult> {
  const ig = env("IG_USER_ID");
  const token = env("FB_PAGE_TOKEN");
  if (!ig || !token) return { ok: false, skipped: "not set up" };
  // Instagram's publishing API only accepts JPEG images
  if (!p.image || !/\.jpe?g(\?|$)/i.test(p.image))
    return { ok: false, skipped: "needs a JPEG featured image" };

  const create = await fetch(`${GRAPH()}/${ig}/media`, {
    method: "POST",
    body: new URLSearchParams({
      image_url: p.image,
      caption,
      access_token: token,
    }),
  });
  const c = (await create.json()) as {
    id?: string;
    error?: { message: string };
  };
  if (!c.id)
    return { ok: false, error: c.error?.message ?? "could not create media" };

  // Wait for Instagram to fetch and process the image (usually a few seconds)
  for (let i = 0; i < 10; i++) {
    const s = await fetch(
      `${GRAPH()}/${c.id}?fields=status_code&access_token=${encodeURIComponent(token)}`,
    );
    const status = ((await s.json()) as { status_code?: string }).status_code;
    if (status === "FINISHED") break;
    if (status === "ERROR")
      return { ok: false, error: "Instagram could not process the image" };
    await new Promise((r) => setTimeout(r, 2000));
  }

  const pub = await fetch(`${GRAPH()}/${ig}/media_publish`, {
    method: "POST",
    body: new URLSearchParams({ creation_id: c.id, access_token: token }),
  });
  const j = (await pub.json()) as { id?: string; error?: { message: string } };
  return j.id
    ? { ok: true, id: j.id }
    : { ok: false, error: j.error?.message ?? "publish failed" };
}

async function linkedInThumbnail(
  image: string,
  org: string,
  headers: Record<string, string>,
): Promise<string | undefined> {
  try {
    const init = await fetch(
      "https://api.linkedin.com/rest/images?action=initializeUpload",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          initializeUploadRequest: { owner: `urn:li:organization:${org}` },
        }),
      },
    );
    const v = (
      (await init.json()) as { value?: { uploadUrl: string; image: string } }
    ).value;
    if (!v) return undefined;
    // Only ever fetch from our own CMS
    const cms = new URL(
      env("WORDPRESS_GRAPHQL_URL") ?? "https://cms.everydaydigital.co.nz",
    ).host;
    if (new URL(image).host !== cms) return undefined;
    const img = await fetch(image, { signal: AbortSignal.timeout(10000) });
    const put = await fetch(v.uploadUrl, {
      method: "PUT",
      headers: { Authorization: headers.Authorization },
      body: await img.arrayBuffer(),
    });
    return put.ok ? v.image : undefined;
  } catch {
    return undefined;
  }
}

async function postLinkedIn(
  p: Payload,
  commentary: string,
): Promise<ChannelResult> {
  const org = env("LINKEDIN_ORG_ID");
  const token = env("LINKEDIN_TOKEN");
  if (!org || !token) return { ok: false, skipped: "not set up" };
  const headers = {
    Authorization: `Bearer ${token}`,
    "LinkedIn-Version": env("LINKEDIN_VERSION") ?? "202610",
    "X-Restli-Protocol-Version": "2.0.0",
    "Content-Type": "application/json",
  };
  const thumbnail = p.image
    ? await linkedInThumbnail(p.image, org, headers)
    : undefined;
  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers,
    body: JSON.stringify({
      author: `urn:li:organization:${org}`,
      // LinkedIn treats some characters as markup in commentary
      commentary: commentary.replace(/[\\(){}[\]<>@|~_*#]/g, (c) => `\\${c}`),
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      content: {
        article: {
          source: p.url,
          title: p.title,
          description: p.excerpt?.slice(0, 250),
          ...(thumbnail ? { thumbnail } : {}),
        },
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });
  if (res.status === 201)
    return { ok: true, id: res.headers.get("x-restli-id") ?? undefined };
  const t = await res.text();
  return { ok: false, error: `HTTP ${res.status} ${t.slice(0, 200)}` };
}

// ---------------------------------------------------------------- handler

export async function POST(req: NextRequest) {
  if (!authorised(req))
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );

  let p: Payload;
  try {
    p = (await req.json()) as Payload;
    if (!p.title || !p.url) throw new Error("title and url are required");
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "bad request" },
      { status: 400 },
    );
  }

  const { captions, ai } = await writeCaptions(p);
  const dryRun = env("SOCIAL_LIVE") !== "1";

  const results: Record<string, ChannelResult> = {};
  if (!dryRun) {
    const run = async (name: string, fn: () => Promise<ChannelResult>) => {
      try {
        results[name] = await fn();
      } catch (e) {
        results[name] = {
          ok: false,
          error: e instanceof Error ? e.message : "failed",
        };
      }
    };
    await Promise.all([
      run("facebook", () => postFacebook(p, captions.facebook)),
      run("instagram", () => postInstagram(p, captions.instagram)),
      run("linkedin", () => postLinkedIn(p, captions.linkedin)),
    ]);
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    aiCaptions: ai,
    captions,
    results,
    at: new Date().toISOString(),
  });
}
