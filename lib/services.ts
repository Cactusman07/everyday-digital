// The services, in display order. `slug` matches the WordPress service slug,
// so cards link to /services/<slug> and pick the right icon. `word` is the
// hero word each service is paired with ("Every Day Design") and `colour` is
// that word's accent colour, used for its icon, cards and share image.

import { PRICE_COPY } from "./pricing";

export const SERVICES = [
  {
    slug: "website-design",
    title: "Website Design",
    word: "Design",
    colour: "#4b6ceb",
    summary:
      "Websites designed around your brand and your customers, and built so you can manage them yourself.",
    tags: ["WordPress", "Shopify", "Mobile-first"],
  },
  {
    slug: "development",
    title: "Website Development",
    word: "Digital",
    colour: "#e34beb",
    summary:
      "WordPress and Shopify builds: custom themes, plugins and the integrations that connect them.",
    tags: ["WordPress", "Shopify", "Integrations"],
  },
  {
    slug: "custom-application-development",
    title: "Custom Application Development",
    word: "Engineering",
    colour: "#eb9a4b",
    summary:
      "Web apps, portals and integrations built for how your business actually works, on whatever platform fits. Any platform, every day.",
    tags: ["Web apps", "Cloud", "AI"],
  },
  {
    slug: "ecommerce",
    title: "eCommerce",
    word: "Innovation",
    colour: "#9deb4b",
    summary:
      "Online stores set up properly, with payments, freight, GST and Google Shopping, and connected to the systems you already use.",
    tags: ["Shopify", "WooCommerce", "POS sync"],
  },
  {
    slug: "hosting",
    title: "Web Hosting",
    word: "Reliability",
    colour: "#4bafeb",
    summary: `Managed WordPress hosting with backups, firewall, SSL and staging. ${PRICE_COPY.hostingShort}`,
    tags: ["Backups", "Firewall", "Staging"],
  },
  {
    slug: "automation",
    title: "AI & Automation Projects",
    word: "Automation",
    colour: "#834beb",
    summary:
      "We connect your systems, remove the manual steps, and put AI to work where it genuinely helps.",
    tags: ["Integrations", "AI content", "Workflows"],
  },
  {
    slug: "website-reviews",
    title: "Website Reviews",
    word: "Strategy",
    colour: "#eb4b4b",
    summary:
      "A plain-English review of speed, search, security and conversions, with a prioritised list of what to fix.",
    tags: ["SEO", "AI search", "Speed"],
  },
  {
    slug: "digital-consulting",
    title: "Digital Consulting",
    word: "Mentoring",
    colour: "#ebe74b",
    summary:
      "Independent, practical advice from someone who builds and runs online businesses every day.",
    tags: ["Platform advice", "Migrations", "Strategy"],
  },
  {
    slug: "digital-management",
    title: "Digital Management",
    word: "Support",
    colour: "#4bebc8",
    summary:
      "Your website or online store looked after for a fixed monthly fee. Content, products, updates, email and domains, all handled.",
    tags: ["Fixed monthly fee", "Websites", "Online stores"],
  },
] as const;

export type Service = (typeof SERVICES)[number];
export type ServiceSlug = Service["slug"];

export function getServiceMeta(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

/** Sort key that puts services in {@link SERVICES} order; unknown slugs go last. */
function serviceOrder(slug: string): number {
  const i = SERVICES.findIndex((s) => s.slug === slug);
  return i === -1 ? SERVICES.length : i;
}

/** Sorts any slugged items into service display order (returns a new array). */
export function sortByServiceOrder<T extends { slug: string }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => serviceOrder(a.slug) - serviceOrder(b.slug));
}

/**
 * The words the home hero cycles through ("Every Day <word>"), in the order
 * they were designed for. There are seven words but six gradient layers
 * (HERO_GRADIENT_LAYERS): HeroWordCycle shows no gradient on every seventh
 * word, so the pairing of words and colours shifts each lap.
 */
export const HERO_WORDS: string[] = (
  [
    "development",
    "automation",
    "website-design",
    "hosting",
    "ecommerce",
    "digital-consulting",
    "website-reviews",
  ] satisfies ServiceSlug[]
).map((slug) => getServiceMeta(slug)!.word);

/**
 * The technical skills listed on a service's page, for services where the
 * platform is the point.
 */
const SERVICE_SKILLS: Partial<Record<ServiceSlug, readonly string[]>> = {
  "custom-application-development": [
    "Microsoft Azure",
    "AWS",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Python",
    "C# and .NET",
    "PHP",
    "AI and LLMs",
    "APIs and integrations",
    "Digital architecture",
  ],
};

/** The technical skills a service's page lists, if any. */
export function serviceSkills(slug: string): readonly string[] {
  return SERVICE_SKILLS[slug as ServiceSlug] ?? [];
}

/**
 * Which published price a service's page shows. Drives both the price note
 * on the page and the Offer in its structured data.
 */
export type ServicePricing = "website" | "hosting" | "monthly-fee";

const SERVICE_PRICING: Partial<Record<ServiceSlug, ServicePricing>> = {
  "website-design": "website",
  development: "website",
  hosting: "hosting",
  "digital-management": "monthly-fee",
};

/** The published price a service shows, if it has one. */
export function servicePricing(slug: string): ServicePricing | undefined {
  return SERVICE_PRICING[slug as ServiceSlug];
}

const PRICE_NOTES: Record<ServicePricing, string> = {
  website: `${PRICE_COPY.website} ${PRICE_COPY.quoted}`,
  hosting: PRICE_COPY.hosting,
  "monthly-fee":
    "A fixed monthly fee, with the scope agreed in a free chat first.",
};

/** One line on price for a service page. */
export function servicePriceNote(slug: string): string {
  const pricing = servicePricing(slug);
  return pricing ? PRICE_NOTES[pricing] : PRICE_COPY.quotedService;
}
