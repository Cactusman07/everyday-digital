// Default Open Graph image for every page that doesn't set its own.
// Next.js renders this to a 1200×630 PNG at /opengraph-image and wires the
// og:image / twitter:image tags automatically. Uses the brand gradient so
// shares on LinkedIn, Facebook and Slack carry the same look as the hero.

import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(115deg, #000 40%, #834beb)",
        color: "#fff",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 22,
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: 0.75,
        }}
      >
        Auckland · Web design · Development · Hosting · Automation
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 112,
            fontWeight: 900,
            letterSpacing: -4,
            lineHeight: 0.95,
          }}
        >
          Every Day Digital
        </div>
        <div style={{ fontSize: 44, fontWeight: 700, marginTop: 22 }}>
          We keep you running.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          opacity: 0.85,
        }}
      >
        <span>everydaydigital.co.nz</span>
        <span>
          Websites from $2,350 · Stores from $6,500 · Hosting from $30/mo
        </span>
      </div>
    </div>,
    { ...size },
  );
}
