// Facts for the four featured case studies, keyed by WordPress project slug.
// The narrative body still comes from the WordPress project; these are the
// structured facts shown around it. Results with a null value are hidden
// until there's a real number to show, so nothing unverified ships.

export interface CaseStudyMeta {
  slug: string;
  client: string;
  /** The client's public website. Omitted when there isn't one to visit. */
  url?: string;
  sector: string;
  summary: string;
  services: string[];
  stack: string[];
  timeline: string | null;
  results: { label: string; value: string | null }[];
  whatWeDid: string[];
  howWeDidIt: string[];
  ownBusiness?: boolean;
}

export const CASE_STUDIES: CaseStudyMeta[] = [
  {
    slug: "nz-in-pictures",
    client: "NZ In Pictures",
    url: "https://nzinpictures.co.nz",
    sector: "Photography · Print sales",
    summary:
      "A WooCommerce store selling New Zealand landscape prints and digital images, with variable products for sizes and formats.",
    services: ["Web design", "WooCommerce development", "Hosting"],
    stack: ["WordPress", "WooCommerce", "Elementor"],
    timeline: null,
    results: [
      { label: "Print orders", value: null },
      { label: "Page load", value: null },
      { label: "Product variations", value: null },
    ],
    whatWeDid: [
      "Designed and built the store around the photography — large imagery, minimal chrome",
      "Variable products for print size, finish and digital download",
      "Checkout, shipping and NZ tax set up",
      "Hosted on our managed WordPress hosting, set up for speed",
      "2026 tune-up: FAQs with schema, page-by-page SEO and AI search fixes, Google Merchant Center",
    ],
    howWeDidIt: [
      "Elementor for the layout so the client can update pages without a developer",
      "Performance tuning, with custom server-side jobs that run the store's scheduled tasks in the background so pages stay fast for shoppers",
      "Ongoing updates and new products added on request",
    ],
  },
  {
    slug: "ride-rotorua-store-website",
    client: "Ride Rotorua Store",
    url: "https://riderotoruastore.co.nz",
    sector: "Bike retail · Tourism",
    summary:
      "A new WooCommerce store for a Rotorua bike shop, synced with its Lightspeed point-of-sale so products and stock are managed in one place.",
    services: [
      "Web design",
      "WooCommerce development",
      "Integration",
      "Hosting",
    ],
    stack: ["WordPress", "WooCommerce", "Lightspeed"],
    timeline: null,
    results: [
      { label: "Conversion", value: null },
      { label: "Load time", value: null },
    ],
    whatWeDid: [
      "Every page designed as a mockup first: hire and demos, brands, servicing, about, contact and blog",
      "Products, images and stock synced from Lightspeed, with rules that keep parts and inactive items offline",
      "Card and Afterpay checkout, standard and rural freight, Google Shopping, NZ returns policy and terms",
    ],
    howWeDidIt: [
      "Built on a staging copy the team could test, then moved to the live domain in one step",
      "Hosted on our managed WordPress hosting, set up to handle a large catalogue",
    ],
  },
  {
    slug: "plow-foods-operations-portal",
    client: "Plow Foods",
    sector: "Food manufacturing · FMCG",
    summary:
      "An operations portal on top of MYOB for a New Zealand snack maker: orders, stock, production and deliveries in one place. We work inside the business, so we use it every day.",
    services: ["Custom development", "Automation", "AI"],
    stack: [
      "React",
      "Azure Logic Apps",
      "Azure Functions",
      "Azure API Management",
      "MYOB AccountRight",
    ],
    timeline: null,
    results: [
      { label: "Hours saved per month", value: null },
      { label: "Spec sheets automated", value: null },
    ],
    whatWeDid: [
      "Orders, customers and invoices flow straight into MYOB, with no double entry",
      "Production scheduling, stocktakes and inventory in one place",
      "Delivery route planning, low-stock alerts and AI-assisted order review",
    ],
    howWeDidIt: [
      "Built in-house as the operating team, not as an outside agency — which means the automations are shaped by the actual workflow",
      "React front end, with Azure handling the MYOB integration and automations",
    ],
    ownBusiness: true,
  },
  {
    slug: "home-office-space",
    client: "Home Office Space",
    url: "https://homeofficespace.co.nz",
    sector: "Ecommerce · Furniture",
    summary:
      "Our own Shopify store. Real products, real freight, real stock — so when we build a store for you, we know what breaks.",
    services: ["Shopify development", "Automation", "Social media automation"],
    stack: ["Shopify", "Azure Logic Apps", "Meta Graph API"],
    timeline: null,
    results: [
      { label: "Orders", value: null },
      { label: "Social posts automated", value: null },
    ],
    whatWeDid: [
      "Shopify store setup, theme customisation and product catalogue",
      "Daily Instagram and Facebook posting automated end to end",
      "Supplier orders, invoices and packing slips handled automatically",
    ],
    howWeDidIt: [
      "Azure Logic Apps pick a product, Claude writes the caption, and the post goes to Instagram and Facebook on its own",
      "We run this store ourselves, which is the point: it's the test bed for everything we recommend to store clients",
    ],
    ownBusiness: true,
  },
];

export function getCaseStudy(slug: string): CaseStudyMeta | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

/**
 * A case study's image everywhere it appears (hero, work tiles, cards): a
 * screenshot of the client's site, from scripts/capture-screenshots.mjs, so
 * each one shows the website itself rather than whatever the WordPress
 * featured image happens to be (a logo, say).
 */
export const caseStudyImage = (slug: string) => `/images/work/${slug}.png`;
