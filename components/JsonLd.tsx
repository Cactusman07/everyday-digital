// JSON-LD (Linked Data) components — output structured data that search engines
// and answer engines use for rich results, knowledge panels and citations.
// Each component renders an invisible <script type="application/ld+json">.

import { SITE, PACKAGES } from "@/lib/site";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const sameAs = Object.values(SITE.social).filter(Boolean);

// Rendered in the root layout on every page. ProfessionalService is a
// LocalBusiness subtype — it gets local-pack eligibility plus the service
// vocabulary. @id lets other schema on the site reference this node.
export function OrganizationJsonLd() {
  const prices = PACKAGES.filter((p) => p.price !== null).map((p) => p.price!);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": ["ProfessionalService", "LocalBusiness", "Organization"],
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        legalName: SITE.legalName,
        url: SITE.url,
        logo: `${SITE.url}/images/EveryDayDigital_Logo.png`,
        image: `${SITE.url}/opengraph-image`,
        description: SITE.description,
        slogan: SITE.tagline,
        telephone: SITE.phoneIntl,
        email: SITE.email,
        founder: { "@type": "Person", name: SITE.founder },
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
        priceRange: `NZ$${Math.min(...prices).toLocaleString()}–$${Math.max(...prices).toLocaleString()}`,
        currenciesAccepted: "NZD",
        knowsAbout: [
          "Web design",
          "WordPress development",
          "Shopify development",
          "WooCommerce",
          "Web hosting",
          "Business automation",
          "Xero integration",
          "Azure",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: SITE.phoneIntl,
          email: SITE.email,
          contactType: "sales",
          areaServed: "NZ",
          availableLanguage: "en",
        },
        sameAs,
      }}
    />
  );
}

// Kept for backwards compatibility — the root layout now emits LocalBusiness
// as part of OrganizationJsonLd, so this is a no-op alias.
export function LocalBusinessJsonLd() {
  return null;
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        publisher: { "@id": `${SITE.url}/#organization` },
        inLanguage: "en-NZ",
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: it.url.startsWith("http") ? it.url : `${SITE.url}${it.url}`,
        })),
      }}
    />
  );
}

// Rendered on blog post pages — enables rich article cards in search results
export function ArticleJsonLd({
  title,
  description,
  datePublished,
  image,
  url,
}: {
  title: string;
  description?: string;
  datePublished?: string;
  image?: string;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        datePublished,
        image: image ? [image] : undefined,
        url,
        mainEntityOfPage: url,
        inLanguage: "en-NZ",
        author: { "@type": "Person", name: SITE.founder },
        publisher: { "@id": `${SITE.url}/#organization` },
      }}
    />
  );
}

// Rendered on service detail pages
export function ServiceJsonLd({
  name,
  description,
  url,
  price,
}: {
  name: string;
  description?: string;
  url: string;
  price?: number;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        url,
        serviceType: name,
        areaServed: { "@type": "Country", name: "New Zealand" },
        provider: { "@id": `${SITE.url}/#organization` },
        ...(price
          ? {
              offers: {
                "@type": "Offer",
                price,
                priceCurrency: "NZD",
                url,
              },
            }
          : {}),
      }}
    />
  );
}
