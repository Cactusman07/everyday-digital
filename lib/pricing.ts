// Published prices — the only three price points on the site. Every place
// that shows a price (FAQ, service pages, landing pages, schema, the default
// share image, llms.txt) is built from these numbers, so a price change is one
// edit.
//
// All prices are NZD excluding GST. Shopify stores are hosted by Shopify, so
// hosting prices are for WordPress sites only.

export const PRICES = {
  /** A simple WordPress website, designed and built. */
  website: 1500,
  /** WordPress website hosting, per month. Annual billing gets two months free. */
  hostingMonthly: 40,
  /** WordPress eCommerce (WooCommerce) hosting, per month. */
  ecommerceHostingMonthly: 50,
} as const;

/** Annual website hosting: ten months for twelve. */
export const HOSTING_ANNUAL = PRICES.hostingMonthly * 10;

/** "$1500" — whole dollars, no thousands separator, matching the site's style. */
export const dollars = (n: number) => `$${n}`;

export const PRICE_COPY = {
  website: `A simple website designed & developed in WordPress starts at ${dollars(PRICES.website)} + GST.`,
  quoted:
    "Everything else is quoted at a fixed price after a free consultation and chat, so you know the cost before we start.",
  /** For a service with no published price. */
  quotedService:
    "Quoted at a fixed price after a free consultation and chat, so you know the cost before we start.",
  hosting: `Website hosting is ${dollars(PRICES.hostingMonthly)} a month, including one hour of free updates each month. Pay annually and get two months free (${dollars(HOSTING_ANNUAL)} a year). WordPress eCommerce hosting is ${dollars(PRICES.ecommerceHostingMonthly)} a month. Prices exclude GST.`,
  /** Short form for cards and share images. */
  hostingShort: `Websites ${dollars(PRICES.hostingMonthly)} a month with an hour of free updates. WordPress eCommerce ${dollars(PRICES.ecommerceHostingMonthly)} a month.`,
} as const;
