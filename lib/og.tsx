// Social share images (Open Graph / LinkedIn / Facebook previews), drawn in
// the site's style: black-to-colour gradient, Anton headline, site address.
// Used by the home page and by every blog post, project and service, so each
// one gets its own preview image with its title on it.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { accentFor } from "./brand";
import { OG_SIZE } from "./seo";
import { SITE } from "./site";

export const OG_CONTENT_TYPE = "image/png";

let anton: Promise<Buffer> | null = null;
/** Anton as a .woff (Satori, which draws these images, can't read woff2). */
const loadAnton = () =>
  (anton ??= readFile(join(process.cwd(), "public/fonts/Anton-Regular.woff")));

/**
 * Renders a 1200×630 share card.
 *
 * @param title - Headline; long titles get a smaller font size.
 * @param kicker - Small uppercase line above the title.
 * @param footer - Right-hand footer text; defaults to the site domain.
 * @param colour - Gradient accent; defaults to a stable colour for the title.
 */
export async function ogImage({
  title,
  kicker,
  footer,
  colour,
}: {
  title: string;
  kicker: string;
  footer?: string;
  colour?: string;
}) {
  const font = await loadAnton().catch(() => null);
  const c = colour ?? accentFor(title);
  const size = title.length > 60 ? 70 : title.length > 36 ? 86 : 104;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: `linear-gradient(115deg, #000 42%, ${c})`,
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: 0.8,
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: font ? "Anton" : "system-ui",
          fontSize: size,
          lineHeight: 1,
          textTransform: "uppercase",
          maxWidth: 1000,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 24,
        }}
      >
        <span style={{ fontWeight: 700 }}>{SITE.name}</span>
        <span style={{ opacity: 0.85 }}>{footer ?? SITE.domain}</span>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: font
        ? [{ name: "Anton", data: font, weight: 400, style: "normal" }]
        : undefined,
    },
  );
}
