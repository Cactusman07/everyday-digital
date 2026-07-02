// JSON-LD (Linked Data) components — output structured data that search engines use
// to create rich results (knowledge panels, breadcrumbs, article cards, etc.).
// Each component renders an invisible <script type="application/ld+json"> tag
// containing schema.org vocabulary that Google, Bing, etc. can parse.

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

// Rendered in the root layout — tells search engines about the business
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Every Day Digital",
        url: "https://everydaydigital.co.nz",
        description:
          "Every Day Digital is a digital studio that cares about you. We strive for quality every day.",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+64-21-175-9457",
          email: "hello@everydaydigital.co.nz",
          contactType: "customer service",
        },
        sameAs: [
          "https://www.facebook.com/every.day.digital.2023",
          "https://www.linkedin.com/company/every-day-digital/",
        ],
      }}
    />
  );
}

export function LocalBusinessJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Every Day Digital",
        url: "https://everydaydigital.co.nz",
        telephone: "+64-21-175-9457",
        email: "hello@everydaydigital.co.nz",
        address: {
          "@type": "PostalAddress",
          addressCountry: "NZ",
        },
        priceRange: "$$",
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
        author: {
          "@type": "Organization",
          name: "Every Day Digital",
        },
        publisher: {
          "@type": "Organization",
          name: "Every Day Digital",
        },
      }}
    />
  );
}

// Rendered on service detail pages
export function ServiceJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description?: string;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        url,
        provider: {
          "@type": "Organization",
          name: "Every Day Digital",
        },
      }}
    />
  );
}
