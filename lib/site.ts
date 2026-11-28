// Who we are and how to reach us. The business identity used by metadata,
// schema, the footer, feeds and llms.txt. Prices live in ./pricing.ts,
// services in ./services.ts and case studies in ./case-studies.ts.

const url = process.env.NEXT_PUBLIC_SITE_URL || "https://everydaydigital.co.nz";

/** A URL without its scheme, for display: "https://x.nz/a" → "x.nz/a". */
export const displayUrl = (href: string) => href.replace(/^https?:\/\//, "");

export const SITE = {
  name: "Every Day Digital",
  alternateName: "Everyday Digital",
  legalName: "Every Day Digital Limited",
  /** Canonical origin, no trailing slash. Overridden per environment. */
  url,
  /** The origin without its scheme, e.g. "everydaydigital.co.nz". */
  domain: displayUrl(url),
  tagline: "We keep you running.",
  description:
    "Web design, development and hosting for New Zealand businesses — WordPress, Shopify and custom-built apps, plus automation and AI help. Auckland-based, working NZ-wide.",
  email: "hello@everydaydigital.co.nz",
  phone: "021 175 9457",
  phoneIntl: "+64-21-175-9457",
  city: "Auckland",
  region: "Auckland",
  country: "NZ",
  social: {
    linkedin: "https://www.linkedin.com/company/every-day-digital/",
    facebook: "https://www.facebook.com/every.day.digital.2023",
    instagram: "https://www.instagram.com/everydaydigitalnz/",
  },
} as const;

export const FOUNDER = {
  name: "Sam Muir",
  initials: "SM",
  jobTitle: "Founder",
  bio: "Sam runs Every Day Digital in Auckland. He designs and builds websites, online stores and business automation, and helps run two businesses of his own, so the advice comes from doing it every day.",
  /** Other profiles of the founder, so search engines can join them up. */
  sameAs: [
    "https://sammuir.co.nz",
    "https://www.linkedin.com/in/sam-muir-a6b54164/",
  ],
} as const;

/**
 * IndexNow key. Public by design: it only proves we own the domain. Bing,
 * Yandex, Seznam and others use it to pick up changed pages within minutes.
 * The verification file must be public/<key>.txt containing the key;
 * lib/site.test.ts fails if the two drift apart.
 */
export const INDEXNOW_KEY = "9fde70914894c907d453df0bc5778216";

/** Absolute URL for a site-relative path; absolute URLs pass through. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  if (path === "/" || path === "") return SITE.url;
  return `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** `tel:` link for a display phone number, e.g. "021 175 9457" → "tel:0211759457". */
export function telHref(phone: string = SITE.phone): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** "© 2026 Every Day Digital Limited", for footers. */
export function copyright(): string {
  return `© ${new Date().getFullYear()} ${SITE.legalName}`;
}
