// The site-wide share card, used by the home page and as the default for
// pages without their own image.

import { OG_CONTENT_TYPE, ogImage } from "@/lib/og";
import { DEFAULT_OG_ALT, OG_SIZE } from "@/lib/seo";
import { PRICES, dollars } from "@/lib/pricing";
import { getServiceMeta } from "@/lib/services";
import { SITE } from "@/lib/site";

export const alt = DEFAULT_OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpenGraphImage() {
  return ogImage({
    title: SITE.tagline,
    kicker: "Auckland · Web design · Development · Hosting · AI & automation",
    footer: `WordPress websites from ${dollars(PRICES.website)} + GST · Hosting from ${dollars(PRICES.hostingMonthly)}/mo`,
    colour: getServiceMeta("automation")?.colour,
  });
}
