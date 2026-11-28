// Structured data (JSON-LD) for search engines and AI answer engines. Each
// component renders an invisible <script type="application/ld+json">. Nodes
// that appear on every page (the business, its founder and the website) have
// an @id, so page-level schema can point at them instead of repeating them.

import type { FaqItem } from "@/lib/faq";
import { HOSTING_ANNUAL, PRICES, dollars } from "@/lib/pricing";
import { SERVICES, servicePricing } from "@/lib/services";
import { FOUNDER, SITE, absoluteUrl } from "@/lib/site";
import { itemPath, sectionOf } from "@/lib/wordpress/content-types";

export const ORG_ID = `${SITE.url}/#organization`;
export const FOUNDER_ID = `${SITE.url}/#founder`;
const WEBSITE_ID = `${SITE.url}/#website`;
const CATALOG_ID = `${SITE.url}/services#catalog`;
const BLOG_ID = `${SITE.url}/blog#blog`;

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Renders one JSON-LD block, adding the schema.org `@context`. `<` is escaped
 * so WordPress text can never close the script tag early.
 */
export default function JsonLd({ data }: JsonLdProps) {
  const json = { "@context": "https://schema.org", ...data };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(json).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/**
 * A landing page's published starting price, as an Offer (GST exclusive).
 *
 * @param price - NZD, excluding GST.
 */
export function LandingOfferJsonLd({
  name,
  description,
  price,
  path,
}: {
  name: string;
  description: string;
  price: number;
  path: string;
}) {
  return (
    <JsonLd
      data={{
        "@type": "Offer",
        name,
        description,
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: price,
          priceCurrency: "NZD",
          valueAddedTaxIncluded: false,
        },
        url: absoluteUrl(path),
        seller: { "@id": ORG_ID },
      }}
    />
  );
}

// ---------------------------------------------------------------- site-wide

/**
 * Rendered in the root layout. ProfessionalService is a LocalBusiness subtype,
 * so the business is eligible for local results and gets the service vocabulary.
 */
export function SiteJsonLd() {
  const organization = {
    "@type": ["ProfessionalService", "LocalBusiness", "Organization"],
    "@id": ORG_ID,
    name: SITE.name,
    alternateName: SITE.alternateName,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/images/EveryDayDigital_Logo.png"),
      width: 500,
      height: 500,
      caption: SITE.name,
    },
    image: absoluteUrl("/opengraph-image"),
    description: SITE.description,
    slogan: SITE.tagline,
    telephone: SITE.phoneIntl,
    email: SITE.email,
    founder: { "@id": FOUNDER_ID },
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
    areaServed: [
      { "@type": "City", name: "Auckland" },
      { "@type": "Country", name: "New Zealand" },
    ],
    priceRange: `From NZ${dollars(PRICES.website)} + GST`,
    currenciesAccepted: "NZD",
    knowsAbout: [
      "Web design",
      "WordPress development",
      "Shopify development",
      "WooCommerce",
      "eCommerce",
      "Web hosting",
      "Technical SEO",
      "AI search optimisation",
      "Business automation",
      "Azure Logic Apps",
      "MYOB integration",
      "Lightspeed integration",
      "Xero integration",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phoneIntl,
      email: SITE.email,
      contactType: "sales",
      areaServed: "NZ",
      availableLanguage: "en",
    },
    hasOfferCatalog: { "@id": CATALOG_ID },
    sameAs: Object.values(SITE.social).filter(Boolean),
  };

  const founder = {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: FOUNDER.name,
    jobTitle: FOUNDER.jobTitle,
    url: absoluteUrl(FOUNDER.profilePath),
    worksFor: { "@id": ORG_ID },
    sameAs: FOUNDER.sameAs,
  };

  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    alternateName: SITE.alternateName,
    description: SITE.description,
    publisher: { "@id": ORG_ID },
    inLanguage: SITE.language,
  };

  return (
    <JsonLd
      data={{
        "@graph": [organization, founder, website],
      }}
    />
  );
}

// ---------------------------------------------------------------- pricing

/**
 * Published prices for a service, as schema.org Offers. Services without a
 * published price are quoted after a consultation, so they get none.
 */
export function serviceOffers(slug: string) {
  const url = absoluteUrl(itemPath("service", slug));
  const exGst = { priceCurrency: "NZD", valueAddedTaxIncluded: false };
  /** A recurring price: per month ("MON") or per year ("ANN"). */
  const recurring = (price: number, unit: "MON" | "ANN") => ({
    "@type": "UnitPriceSpecification",
    price,
    ...exGst,
    unitText: unit === "MON" ? "month" : "year",
    referenceQuantity: {
      "@type": "QuantitativeValue",
      value: 1,
      unitCode: unit,
    },
  });
  const pricing = servicePricing(slug);

  if (pricing === "website")
    return [
      {
        "@type": "Offer",
        name: "Simple WordPress website, designed and built",
        url,
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: PRICES.website,
          ...exGst,
        },
      },
    ];
  if (pricing === "hosting")
    return [
      {
        "@type": "Offer",
        name: "WordPress website hosting, including one hour of updates a month",
        url,
        priceSpecification: [
          recurring(PRICES.hostingMonthly, "MON"),
          recurring(HOSTING_ANNUAL, "ANN"),
        ],
      },
      {
        "@type": "Offer",
        name: "WordPress eCommerce hosting",
        url,
        priceSpecification: recurring(PRICES.ecommerceHostingMonthly, "MON"),
      },
    ];
  return [];
}

/**
 * Every service in one catalogue. Rendered on the home and services pages;
 * the organisation node points here with hasOfferCatalog.
 */
export function offerCatalog() {
  return {
    "@type": "OfferCatalog",
    "@id": CATALOG_ID,
    name: `${SITE.name} services`,
    url: absoluteUrl(sectionOf("service").path),
    // One entry per published price (hosting has two); unpriced services get one
    itemListElement: SERVICES.flatMap((s) => {
      const offers = serviceOffers(s.slug);
      return (offers.length ? offers : [undefined]).map((offer) => ({
        "@type": "Offer",
        ...(offer && {
          name: offer.name,
          priceSpecification: offer.priceSpecification,
        }),
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.summary,
          url: absoluteUrl(itemPath("service", s.slug)),
          provider: { "@id": ORG_ID },
        },
      }));
    }),
  };
}

// ---------------------------------------------------------------- pages

/** Breadcrumb trail; site-relative URLs are made absolute. */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: absoluteUrl(it.url),
        })),
      }}
    />
  );
}

/** A top-level page: WebPage, or a subtype such as AboutPage or CollectionPage. */
export function WebPageJsonLd({
  type = "WebPage",
  path,
  name,
  description,
  mainEntity,
}: {
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  path: string;
  name: string;
  description?: string;
  mainEntity?: Record<string, unknown>;
}) {
  const url = absoluteUrl(path);
  return (
    <JsonLd
      data={{
        "@type": type,
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: SITE.language,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORG_ID },
        mainEntity,
      }}
    />
  );
}

/** The blog index, listing every post */
export function BlogJsonLd({
  description,
  posts,
}: {
  description?: string;
  posts: { title: string; url: string; date?: string; image?: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@type": "Blog",
        "@id": BLOG_ID,
        url: absoluteUrl(sectionOf("post").path),
        name: `${SITE.name} blog`,
        description,
        inLanguage: SITE.language,
        publisher: { "@id": ORG_ID },
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          url: absoluteUrl(p.url),
          datePublished: p.date,
          image: p.image,
        })),
      }}
    />
  );
}

/** FAQPage schema, so answer engines can quote the answers directly. */
export function FaqJsonLd({ faq }: { faq: FaqItem[] }) {
  return (
    <JsonLd
      data={{
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }}
    />
  );
}

// ---------------------------------------------------------------- content

/**
 * A blog post. The author is the founder node from the layout, repeated with
 * a name and URL for parsers that don't follow @id references.
 */
export function ArticleJsonLd({
  title,
  description,
  datePublished,
  dateModified,
  image,
  url,
  keywords,
  wordCount,
}: {
  title: string;
  description?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  url: string;
  keywords?: string[];
  wordCount?: number;
}) {
  return (
    <JsonLd
      data={{
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: title,
        description,
        datePublished,
        dateModified: dateModified ?? datePublished,
        keywords: keywords?.length ? keywords.join(", ") : undefined,
        image: image ? [absoluteUrl(image)] : undefined,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        inLanguage: SITE.language,
        wordCount,
        isPartOf: { "@id": BLOG_ID },
        author: {
          "@type": "Person",
          "@id": FOUNDER_ID,
          name: FOUNDER.name,
          url: absoluteUrl(FOUNDER.profilePath),
        },
        publisher: { "@id": ORG_ID },
      }}
    />
  );
}

/** A service page, with prices where they're published */
export function ServiceJsonLd({
  slug,
  name,
  description,
  url,
  image,
}: {
  slug: string;
  name: string;
  description?: string;
  url: string;
  image?: string;
}) {
  const offers = serviceOffers(slug);
  return (
    <JsonLd
      data={{
        "@type": "Service",
        "@id": `${url}#service`,
        name,
        description,
        url,
        image: image ? absoluteUrl(image) : undefined,
        serviceType: name,
        areaServed: { "@type": "Country", name: "New Zealand" },
        provider: { "@id": ORG_ID },
        offers: offers.length ? offers : undefined,
      }}
    />
  );
}

/** A project or case study */
export function ProjectJsonLd({
  name,
  description,
  url,
  image,
  datePublished,
  dateModified,
  client,
  keywords,
}: {
  name: string;
  description?: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  client?: { name: string; url?: string };
  keywords?: string[];
}) {
  return (
    <JsonLd
      data={{
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name,
        description,
        url,
        image: image ? absoluteUrl(image) : undefined,
        datePublished,
        dateModified: dateModified ?? datePublished,
        inLanguage: SITE.language,
        creator: { "@id": ORG_ID },
        about: client
          ? { "@type": "Organization", name: client.name, url: client.url }
          : undefined,
        keywords: keywords?.length ? keywords.join(", ") : undefined,
      }}
    />
  );
}
