// Social share images (Open Graph / LinkedIn / Facebook previews), drawn in
// the site's style: black-to-colour gradient, Anton headline, site address.
// Used by the home page and by every blog post, project and service, so each
// one gets its own preview image with its title on it.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };

const COLOURS = [
  "#e34beb",
  "#834beb",
  "#4b6ceb",
  "#4bafeb",
  "#9deb4b",
  "#ebe74b",
  "#eb4b4b",
];

// Same title always gets the same colour
function colourFor(text: string) {
  let h = 0;
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return COLOURS[h % COLOURS.length];
}

let anton: Promise<Buffer> | null = null;
const loadAnton = () =>
  (anton ??= readFile(join(process.cwd(), "public/fonts/Anton-Regular.woff")));

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
  const c = colour ?? colourFor(title);
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
        <span style={{ fontWeight: 700 }}>Every Day Digital</span>
        <span style={{ opacity: 0.85 }}>
          {footer ?? SITE.url.replace(/^https?:\/\//, "")}
        </span>
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
