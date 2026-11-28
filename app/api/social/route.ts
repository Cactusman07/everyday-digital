// POST /api/social — called by the WordPress "EDD Social Share" plugin the
// first time a blog post or project is published (wpTheme/mu-plugins/edd-social.php).
//
// 1. Checks the shared secret (SOCIAL_WEBHOOK_SECRET).
// 2. Validates the payload: `type` must be "post" or "project".
// 3. Writes three captions from the item's own text (lib/social/captions.ts).
// 4. Posts to Facebook, Instagram and LinkedIn (lib/social/channels.ts).
// 5. Returns what happened; WordPress stores it on the item.
//
// Test mode is on until SOCIAL_LIVE=1: captions are written and returned, but
// nothing is posted. See docs/SOCIAL-AUTOMATION.md.

import { NextResponse, type NextRequest } from "next/server";
import { hasBearerSecret } from "@/lib/auth";
import { env } from "@/lib/env";
import { writeCaptions } from "@/lib/social/captions";
import {
  postFacebook,
  postInstagram,
  postLinkedIn,
} from "@/lib/social/channels";
import {
  parseSharePayload,
  type ChannelResult,
  type SharePayload,
} from "@/lib/social/types";

export const maxDuration = 60;

/** Runs one channel, turning a thrown error into a failed result. */
async function attempt(
  fn: () => Promise<ChannelResult>,
): Promise<ChannelResult> {
  try {
    return await fn();
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "failed" };
  }
}

export async function POST(req: NextRequest) {
  const secret = env("SOCIAL_WEBHOOK_SECRET");
  if (!secret)
    return NextResponse.json(
      { ok: false, error: "SOCIAL_WEBHOOK_SECRET is not configured" },
      { status: 500 },
    );
  if (!hasBearerSecret(req, secret))
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );

  let payload: SharePayload;
  try {
    payload = parseSharePayload(await req.json());
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "bad request" },
      { status: 400 },
    );
  }

  const { captions, ai } = await writeCaptions(payload);
  const dryRun = env("SOCIAL_LIVE") !== "1";

  const results: Record<string, ChannelResult> = {};
  if (!dryRun) {
    const [facebook, instagram, linkedin] = await Promise.all([
      attempt(() => postFacebook(payload, captions.facebook)),
      attempt(() => postInstagram(payload, captions.instagram)),
      attempt(() => postLinkedIn(payload, captions.linkedin)),
    ]);
    Object.assign(results, { facebook, instagram, linkedin });
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
