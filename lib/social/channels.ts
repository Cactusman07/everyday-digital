// Posting to Facebook, Instagram and LinkedIn. Each channel is optional:
// without its environment variables it's skipped, not failed.

import { excerptText } from "../html";
import { isCmsMediaUrl } from "../wordpress/images";
import { env } from "../env";
import { type ChannelResult, type SharePayload } from "./types";

const graphUrl = () =>
  `https://graph.facebook.com/${env("META_GRAPH_VERSION") ?? "v23.0"}`;

const NOT_SET_UP: ChannelResult = { ok: false, skipped: "not set up" };

/** Each API call gets this long before it's abandoned (the route has 60s in all). */
const REQUEST_TIMEOUT_MS = 15_000;

/** Instagram image processing: poll every 2s, for up to 20s. */
const IG_POLL_MS = 2000;
const IG_POLL_TRIES = 10;

/**
 * POSTs form data to a Meta Graph API endpoint and turns the reply into a
 * ChannelResult: the created object's id, or Meta's error message.
 */
async function graphPost(
  path: string,
  params: Record<string, string>,
  fallbackError: string,
): Promise<ChannelResult> {
  const res = await fetch(`${graphUrl()}/${path}`, {
    method: "POST",
    body: new URLSearchParams(params),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const j = (await res.json()) as { id?: string; error?: { message: string } };
  return res.ok && j.id
    ? { ok: true, id: j.id }
    : {
        ok: false,
        error: j.error?.message ?? `${fallbackError} (HTTP ${res.status})`,
      };
}

/** Posts a link post to the Facebook Page. */
export async function postFacebook(
  p: SharePayload,
  message: string,
): Promise<ChannelResult> {
  const page = env("FB_PAGE_ID");
  const token = env("FB_PAGE_TOKEN");
  if (!page || !token) return NOT_SET_UP;
  return graphPost(
    `${page}/feed`,
    { message, link: p.url, access_token: token },
    "post failed",
  );
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

  const media = await graphPost(
    `${ig}/media`,
    { image_url: p.image, caption, access_token: token },
    "could not create media",
  );
  if (!media.ok || !media.id) return media;

  // Wait for Instagram to fetch and process the image before publishing
  let ready = false;
  for (let i = 0; i < IG_POLL_TRIES && !ready; i++) {
    const res = await fetch(
      `${graphUrl()}/${media.id}?fields=status_code&access_token=${encodeURIComponent(token)}`,
      { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) },
    );
    const status = ((await res.json()) as { status_code?: string }).status_code;
    if (status === "ERROR")
      return { ok: false, error: "Instagram could not process the image" };
    ready = status === "FINISHED";
    if (!ready) await new Promise((r) => setTimeout(r, IG_POLL_MS));
  }
  if (!ready)
    return {
      ok: false,
      error: "Instagram was still processing the image after 20s",
    };

  return graphPost(
    `${ig}/media_publish`,
    { creation_id: media.id, access_token: token },
    "publish failed",
  );
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
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
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
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
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
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
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
