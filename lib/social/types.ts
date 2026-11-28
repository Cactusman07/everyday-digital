// Shapes shared by the /api/social route and its helpers.

import { toContentType } from "../wordpress/content-types";

/** The content types that get announced on social media. */
type ShareableType = "post" | "project";

/** What the WordPress "EDD Social Share" plugin sends. */
export interface SharePayload {
  type: ShareableType;
  title: string;
  excerpt?: string;
  /** The item's plain text, used for facts only. */
  text?: string;
  /** The published URL of the item. */
  url: string;
  /** Featured image URL. Instagram needs a JPEG. */
  image?: string;
  tags?: string[];
}

/** The channels a post goes to, in the order captions are written. */
export const CHANNELS = ["linkedin", "facebook", "instagram"] as const;
export type Channel = (typeof CHANNELS)[number];

/** One caption per channel. */
export type Captions = Record<Channel, string>;

export type ChannelResult =
  { ok: true; id?: string } | { ok: false; error?: string; skipped?: string };

/** Reads an environment variable, treating blank values as unset. */
export const env = (key: string) => process.env[key]?.trim() || undefined;

/**
 * Validates a request body as a {@link SharePayload}.
 *
 * @throws With a message suitable for a 400 response.
 */
export function parseSharePayload(body: unknown): SharePayload {
  if (!body || typeof body !== "object")
    throw new Error("expected a JSON object");
  const b = body as Record<string, unknown>;
  const type = toContentType(typeof b.type === "string" ? b.type : undefined);
  if (type !== "post" && type !== "project")
    throw new Error('type must be "post" or "project"');
  if (typeof b.title !== "string" || !b.title.trim())
    throw new Error("title is required");
  if (typeof b.url !== "string" || !/^https?:\/\//.test(b.url))
    throw new Error("url must be an absolute URL");
  const str = (v: unknown) => (typeof v === "string" ? v : undefined);
  return {
    type,
    title: b.title.trim(),
    excerpt: str(b.excerpt),
    text: str(b.text),
    url: b.url,
    image: str(b.image),
    tags: Array.isArray(b.tags)
      ? b.tags.filter((t): t is string => typeof t === "string")
      : undefined,
  };
}

/** How each shareable type is described in captions. */
export const SHARE_WORDING: Record<
  ShareableType,
  { headline: string; subject: string }
> = {
  post: { headline: "New on the blog", subject: "a new blog article" },
  project: {
    headline: "Project delivered",
    subject: "a project we've just delivered for a client",
  },
};
