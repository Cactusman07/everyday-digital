// Captions for the three channels. Claude writes them from the item's own
// text when ANTHROPIC_API_KEY is set; otherwise (or if the call fails or is
// declined) simple template captions are used, so posting never depends on
// the AI call.

import Anthropic from "@anthropic-ai/sdk";
import { FOUNDER, SITE } from "../site";
import { env } from "../env";
import {
  CHANNELS,
  SHARE_WORDING,
  type Captions,
  type SharePayload,
} from "./types";

const DEFAULT_MODEL = "claude-sonnet-5-5";

const STYLE = `You write social media posts for ${SITE.name}, a small ${SITE.city} web design, development, hosting and automation business run by ${FOUNDER.name}.
Voice: friendly, plain New Zealand English (NZ spelling), confident but never salesy. Short sentences. No buzzwords, no hype words like "revolutionise", "game-changer", "unlock", "elevate", "seamless". At most one emoji per post, often none.
Only use facts that appear in the source text. Never invent numbers, results, quotes or client names.`;

/** JSON schema for Claude's reply, enforced by structured outputs. */
const CAPTIONS_SCHEMA = {
  type: "object",
  properties: Object.fromEntries(CHANNELS.map((c) => [c, { type: "string" }])),
  required: [...CHANNELS],
  additionalProperties: false,
} as const;

/** Template captions, used without an API key or when Claude's reply is unusable. */
export function fallbackCaptions(p: SharePayload): Captions {
  const lead = p.excerpt || p.title;
  const { headline } = SHARE_WORDING[p.type];
  return {
    linkedin: `${headline}: ${p.title}\n\n${lead}\n\nRead it here: ${p.url}`,
    facebook: `${headline}: ${p.title}\n\n${lead}\n\n${p.url}`,
    instagram: `${headline}: ${p.title}\n\n${lead}\n\nLink in bio.\n\n#webdesign #nzbusiness #everydaydigital`,
  };
}

function prompt(p: SharePayload) {
  return `Write three posts announcing ${SHARE_WORDING[p.type].subject}.

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
- instagram: 300–600 characters, no link (say "Link in bio"), 5–8 relevant hashtags on the last line including #everydaydigital and #nzbusiness.`;
}

/**
 * Checks Claude's structured reply has all three captions.
 *
 * @throws If the reply isn't JSON or a caption is missing or empty.
 */
export function parseCaptions(reply: string): Captions {
  const c = JSON.parse(reply) as Partial<Captions>;
  for (const k of CHANNELS)
    if (typeof c[k] !== "string" || !c[k])
      throw new Error(`missing ${k} caption`);
  return c as Captions;
}

/** Captions for an item, and whether Claude wrote them. */
export async function writeCaptions(
  p: SharePayload,
): Promise<{ captions: Captions; ai: boolean }> {
  const apiKey = env("ANTHROPIC_API_KEY");
  if (!apiKey) return { captions: fallbackCaptions(p), ai: false };

  try {
    const client = new Anthropic({ apiKey, timeout: 30_000 });
    const response = await client.beta.messages.create({
      model: env("SOCIAL_MODEL") ?? DEFAULT_MODEL,
      max_tokens: 16000,
      // Short, well-specified writing: low effort keeps it quick and cheap
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema: CAPTIONS_SCHEMA },
      },
      // If the model declines, the API retries on a fallback model in the same call
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: STYLE,
      messages: [{ role: "user", content: prompt(p) }],
    });
    if (response.stop_reason === "refusal")
      throw new Error(
        `declined (${response.stop_details?.category ?? "unknown"})`,
      );
    const text = response.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");
    return { captions: parseCaptions(text), ai: true };
  } catch (e) {
    console.error("[social] caption fallback:", e);
    return { captions: fallbackCaptions(p), ai: false };
  }
}
