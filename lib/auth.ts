// Shared-secret checks for the webhook routes WordPress calls.

import { timingSafeEqual } from "node:crypto";

/**
 * True when the request's `Authorization: Bearer <token>` header matches
 * `expected`. Compared in constant time so the secret can't be guessed from
 * response timings.
 */
export function hasBearerSecret(
  req: Request,
  expected: string | undefined,
): boolean {
  const token = req.headers
    .get("authorization")
    ?.match(/^Bearer\s+(.+)$/i)?.[1]
    ?.trim();
  if (!expected || !token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
