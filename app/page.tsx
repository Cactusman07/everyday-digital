// Home page ("/"). The hero (animated title, gradients, logo, nav) is rendered
// by the root layout for every route; this page supplies everything below it.
// Server Component: WordPress data is fetched here and degrades to empty
// sections if the CMS is unreachable, so the home page never 404s.

import type { Metadata } from "next";
import { getProjects, getTestimonials, safe } from "@/lib/wordpress";
import { SITE, FAQ, PACKAGES } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import Marquee from "@/components/motion/Marquee";
import FocusAreas from "@/components/home/FocusAreas";
import Packages from "@/components/home/Packages";
import FeaturedWork from "@/components/home/FeaturedWork";
import Standing from "@/components/home/Standing";
import TestimonialWall from "@/components/home/TestimonialWall";
import FaqSection from "@/components/home/FaqSection";
import FinalCta from "@/components/home/FinalCta";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Web Design, Development & Hosting in Auckland | Every Day Digital",
  description:
    "Custom web design from $2,350, online stores from $6,500, hosting from $30/month. WordPress, Shopify and custom-built apps, plus automation and AI help. Auckland, working NZ-wide.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Every Day Digital — We keep you running.",
    description:
      "Web design, development, hosting, and automation for New Zealand businesses. Priced up front, no retainers.",
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

      <Marquee
        items={[
          "Hosting",
          "Web design",
          "Web development",
          "Automation & AI",
        ].map((t, i) => (
          <span key={i} className={i % 2 ? "hi" : undefined}>
            {t}
          </span>
        ))}
        ariaLabel="What we do"
        className="marquee--hero"
      />

      <FocusAreas />
      <Packages />
      <FeaturedWork projects={projects} />
      <Standing />
      <TestimonialWall data={testimonials} />
      <FaqSection />
      <FinalCta />
      <Footer />
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
    name: "Every Day Digital packages",
    url: `${SITE.url}/#pricing`,
    itemListElement: PACKAGES.filter((p) => p.price !== null).map((p) => ({
      "@type": "Offer",
      name: p.name,
      description: p.tagline,
      price: p.price,
      priceCurrency: "NZD",
      url: `${SITE.url}${p.ctaHref}`,
      seller: { "@type": "Organization", name: SITE.name, url: SITE.url },
      itemOffered: {
        "@type": "Service",
        name: p.name,
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
