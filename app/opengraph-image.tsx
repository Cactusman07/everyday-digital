import { ogImage, OG_SIZE } from "@/lib/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return ogImage({
    title: "We keep you running.",
    kicker: "Auckland · Web design · Development · Hosting · AI & automation",
    footer: "WordPress websites from $1500 + GST · Hosting from $40/mo",
    colour: "#834beb",
  });
}
