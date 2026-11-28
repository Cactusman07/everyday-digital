// Shared sections for /llms.txt and /llms-full.txt (https://llmstxt.org).
// Generated from the site data so they never drift from the published offer.

import { FAQ } from "./faq";
import { PRICE_COPY } from "./pricing";
import { FOUNDER, SITE, absoluteUrl } from "./site";

/** The opening block: summary, location, founder, contact and pricing model. */
export function introLines() {
  return [
    `> ${SITE.description}`,
    "",
    `Location: ${SITE.city}, New Zealand. Works with businesses NZ-wide.`,
    `Founder: ${FOUNDER.name}. Contact: ${SITE.email}, ${SITE.phone}, ${absoluteUrl("/contact")}.`,
    `Pricing model: ${PRICE_COPY.website} ${PRICE_COPY.quoted} We specialise in WordPress and Shopify.`,
  ];
}

/** "## Pricing": every published price, from lib/pricing.ts. */
export function pricingLines() {
  return [
    "## Pricing (NZD, excluding GST)",
    `- ${PRICE_COPY.website}`,
    `- ${PRICE_COPY.quoted}`,
    `- ${PRICE_COPY.hosting}`,
  ];
}

/** "## Frequently asked questions": the home page FAQ as Q/A pairs. */
export function faqLines() {
  return [
    "## Frequently asked questions",
    ...FAQ.flatMap((f) => [`- Q: ${f.q}`, `  A: ${f.a}`]),
  ];
}

/** A plain-text response, one array entry per line. */
export function textResponse(lines: string[]) {
  return new Response(lines.join("\n") + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
