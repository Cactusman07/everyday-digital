// Brand accent colours outside the per-service colours in ./services.ts.

/** The default accent ("Every Day Reliability" blue), used when nothing else applies. */
export const DEFAULT_ACCENT = "#4bafeb";

/** Rotating accents for avatars and generated share images. */
const ACCENT_PALETTE = [
  "#e34beb",
  "#834beb",
  "#4b6ceb",
  "#4bafeb",
  "#9deb4b",
  "#ebe74b",
  "#eb4b4b",
] as const;

/** A stable accent for any string: the same text always gets the same colour. */
export function accentFor(text: string): string {
  let h = 0;
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return ACCENT_PALETTE[h % ACCENT_PALETTE.length];
}

/** The accent at position `i`, cycling through the palette. */
export const accentAt = (i: number) =>
  ACCENT_PALETTE[i % ACCENT_PALETTE.length];

/**
 * Number of full-screen gradient layers behind the hero (#background1–6 in
 * app/layout.tsx, coloured in app/styles/layout/backgrounds.css) that
 * HeroWordCycle cross-fades.
 */
export const HERO_GRADIENT_LAYERS = 6;
