// Posting to Facebook, Instagram and LinkedIn. Each channel is optional:
// without its environment variables it's skipped, not failed.

import { excerptText } from "../html";
import { isCmsMediaUrl } from "../wordpress/images";
import { env, type ChannelResult, type SharePayload } from "./types";

const graphUrl = () =>
  `https://graph.facebook.com/${env("META_GRAPH_VERSION") ?? "v23.0"}`;

const NOT_SET_UP: ChannelResult = { ok: false, skipped: "not set up" };

/** Posts a link post to the Facebook Page. */
export async function postFacebook(
  p: SharePayload,
  message: string,
): Promise<ChannelResult> {
  const page = env("FB_PAGE_ID");
  const token = env("FB_PAGE_TOKEN");
  if (!page || !token) return NOT_SET_UP;
  const res = await fetch(`${graphUrl()}/${page}/feed`, {
    method: "POST",
    body: new URLSearchParams({ message, link: p.url, access_token: token }),
  });
  const j = (await res.json()) as { id?: string; error?: { message: string } };
  return res.ok && j.id
    ? { ok: true, id: j.id }
    : { ok: false, error: j.error?.message ?? `HTTP ${res.status}` };
}

/**
 * Posts the featured image with a caption to Instagram: create a media
 * container, wait for Instagram to process the image, then publish it.
 */
export async function postInstagram(
  p: SharePayload,
  caption: string,
): Promise<ChannelResult> {
  const ig = env("IG_USER_ID");
  const token = env("FB_PAGE_TOKEN");
  if (!ig || !token) return NOT_SET_UP;
  // Instagram's publishing API only accepts JPEG images
  if (!p.image || !/\.jpe?g(\?|$)/i.test(p.image))
    return { ok: false, skipped: "needs a JPEG featured image" };

  const create = await fetch(`${graphUrl()}/${ig}/media`, {
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

  // Usually ready within a few seconds; give up after ~20s
  for (let i = 0; i < 10; i++) {
    const s = await fetch(
      `${graphUrl()}/${c.id}?fields=status_code&access_token=${encodeURIComponent(token)}`,
    );
    const status = ((await s.json()) as { status_code?: string }).status_code;
    if (status === "FINISHED") break;
    if (status === "ERROR")
      return { ok: false, error: "Instagram could not process the image" };
    await new Promise((r) => setTimeout(r, 2000));
  }

  const pub = await fetch(`${graphUrl()}/${ig}/media_publish`, {
    method: "POST",
    body: new URLSearchParams({ creation_id: c.id, access_token: token }),
  });
  const j = (await pub.json()) as { id?: string; error?: { message: string } };
  return j.id
    ? { ok: true, id: j.id }
    : { ok: false, error: j.error?.message ?? "publish failed" };
}

/** Characters LinkedIn's "little text format" treats as markup. */
const LINKEDIN_RESERVED = /[\\|{}@[\]()<>#*_~]/g;

/**
 * Formats text for LinkedIn post commentary. Reserved characters are
 * escaped so they show literally, and `#hashtags` become LinkedIn hashtag
 * markup (`{hashtag|\#|tag}`) so they're clickable instead of plain text.
 */
export function toLinkedInCommentary(text: string): string {
  return text
    .split(/(#[\p{L}\p{N}_]+)/u)
    .map((part, i) =>
      i % 2
        ? `{hashtag|\\#|${part.slice(1)}}`
        : part.replace(LINKEDIN_RESERVED, (c) => `\\${c}`),
    )
    .join("");
}

/**
 * Uploads an image to LinkedIn for the post's link preview. Only images on
 * our own CMS are fetched. Returns the image URN, or undefined on any failure
 * (the post still goes out, just without a thumbnail).
 */
async function linkedInThumbnail(
  image: string,
  org: string,
  headers: Record<string, string>,
): Promise<string | undefined> {
  if (!isCmsMediaUrl(image)) return undefined;
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
    const upload = (
      (await init.json()) as { value?: { uploadUrl: string; image: string } }
    ).value;
    if (!upload) return undefined;
    const img = await fetch(image, { signal: AbortSignal.timeout(10000) });
    const put = await fetch(upload.uploadUrl, {
      method: "PUT",
      headers: { Authorization: headers.Authorization },
      body: await img.arrayBuffer(),
    });
    return put.ok ? upload.image : undefined;
  } catch {
    return undefined;
  }
}

/** Posts an article share to the LinkedIn company page. */
export async function postLinkedIn(
  p: SharePayload,
  commentary: string,
): Promise<ChannelResult> {
  const org = env("LINKEDIN_ORG_ID");
  const token = env("LINKEDIN_TOKEN");
  if (!org || !token) return NOT_SET_UP;
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
      commentary: toLinkedInCommentary(commentary),
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
          description: p.excerpt && excerptText(p.excerpt, 250),
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
