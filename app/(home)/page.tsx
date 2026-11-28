// Home page ("/"). The hero (animated title, gradients, logo, nav) is rendered
// by HomeHero in app/(home)/layout.tsx; this page supplies
// everything below it. WordPress sections degrade to nothing if the CMS is
// unreachable, so the home page always renders.

import FaqSection from "@/components/home/FaqSection";
import HomeScrollEffects from "@/components/home/HomeScrollEffects";
import {
  DiveChrome,
  DiveIntro,
  LatestPosts,
  Manifesto,
  Outro,
  PlatformMarquee,
  PriceCount,
  ServiceStack,
  WorkTrack,
} from "@/components/home/HomeSections";
import JsonLd, { FaqJsonLd, offerCatalog } from "@/components/seo/JsonLd";
import Testimonials from "@/components/shared/Testimonials";
import { FAQ } from "@/lib/faq";
import { PRICES, dollars } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { getPosts, getTestimonials, safe } from "@/lib/wordpress";

export const metadata = pageMetadata({
  // The root layout's title template adds " | Every Day Digital"
  title: "Web Design, Development & Hosting in Auckland",
  description: `WordPress and Shopify websites, online stores, hosting, AI and automation for NZ businesses. Simple WordPress sites from ${dollars(PRICES.website)} + GST. Auckland, NZ-wide.`,
  path: "/",
  shareTitle: `${SITE.name} — ${SITE.tagline}`,
  shareDescription:
    "Web design, development, hosting, and automation for New Zealand businesses. Fixed prices, agreed before we start.",
});

export default async function HomePage() {
  const [testimonials, posts] = await Promise.all([
    safe(getTestimonials),
    safe(getPosts),
  ]);

  return (
    <>
      {/* The FAQ (answer engines quote it) and the priced service catalogue */}
      <FaqJsonLd faq={FAQ} />
      <JsonLd data={offerCatalog()} />

      <HomeScrollEffects />
      <DiveChrome />
      <DiveIntro />
      <div className="dive-main">
        <Manifesto />
        <ServiceStack />
        <PlatformMarquee />
        <PriceCount />
        <WorkTrack />
        <Testimonials testimonials={testimonials} variant="home" />
        <LatestPosts posts={posts} />
        <FaqSection />
      </div>
      <Outro />
    </>
  );
}
