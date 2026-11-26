// Home page ("/"). The hero (animated title, gradients, logo, nav) is rendered
// by the root layout for every route; this page supplies everything below it.
// Server Component: WordPress data is fetched here and degrades to empty
// sections if the CMS is unreachable, so the home page never 404s.

import type { Metadata } from "next";
import { getProjects, getTestimonials, safe } from "@/lib/wordpress";
import { SITE, FAQ, PRICING, SERVICES } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import FaqSection from "@/components/home/FaqSection";
import DiveEffects from "@/components/home/DiveEffects";
import {
  DiveIntro,
  Manifesto,
  ServiceStack,
  PriceCount,
  WorkTrack,
  Quotes,
  Outro,
} from "@/components/home/Dive";

export const metadata: Metadata = {
  title: "Web Design, Development & Hosting in Auckland | Every Day Digital",
  description:
    "WordPress and Shopify websites, online stores, hosting, AI and automation for New Zealand businesses. A simple WordPress website starts at $1500 + GST. Auckland, working NZ-wide.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Every Day Digital — We keep you running.",
    description:
      "Web design, development, hosting, and automation for New Zealand businesses. Fixed prices, agreed before we start.",
    url: "/",
  },
};

export default async function HomePage() {
  const [projects, testimonials] = await Promise.all([
    safe(getProjects),
    safe(getTestimonials),
  ]);

  return (
    <>
      <HomeJsonLd />

      <DiveEffects />
      <DiveIntro />
      <div className="dive-main">
        <Manifesto />
        <ServiceStack />
        <PriceCount />
        <WorkTrack projects={projects} />
        <Quotes data={testimonials} />
        <FaqSection />
      </div>
      <Outro />
    </>
  );
}

// Structured data for the home page: FAQPage (answer engines quote these
// directly), and an OfferCatalog so the published prices are machine-readable.
function HomeJsonLd() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const offers = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Every Day Digital services",
    url: `${SITE.url}/services/`,
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      name: s.title,
      description: s.summary,
      url: `${SITE.url}/services/${s.slug}/`,
      ...(s.slug === "website-design"
        ? {
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: PRICING.simpleSiteFrom,
              priceCurrency: "NZD",
              valueAddedTaxIncluded: false,
            },
          }
        : {}),
      seller: { "@type": "Organization", name: SITE.name, url: SITE.url },
      itemOffered: {
        "@type": "Service",
        name: s.title,
        provider: { "@type": "Organization", name: SITE.name },
      },
    })),
  };

  return (
    <>
      <JsonLd data={faq} />
      <JsonLd data={offers} />
    </>
  );
}
