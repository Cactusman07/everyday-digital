// Landing pages for paid and social traffic, rendered at /lp/<slug>. They're
// noindex by default (they exist to convert one ad or post, not to rank) and
// have a single action. Add an entry here to add a page; no new route needed.
//
// Layouts:
//   "offer"     — price up front, what's included, steps, FAQ, form
//   "audit"     — problem-led, what we check, steps, FAQ, form
//   "migration" — platform choice, what's included, steps, FAQ, form

import type { FaqItem } from "./faq";
import { PRICES, PRICE_COPY, dollars } from "./pricing";
import type { ServiceSlug } from "./services";

export type LandingLayout = "offer" | "audit" | "migration";

export interface LandingPage {
  slug: string;
  layout: LandingLayout;
  /** <title> and H1. */
  title: string;
  /** Meta description and sub-headline. */
  description: string;
  eyebrow: string;
  /** NZD excl. GST, only when there's a published price. Emitted as an Offer. */
  price?: number;
  fineprint?: string;
  /** Three short proof points under the hero. */
  proof: { value: string; label: string }[];
  bullets: string[];
  steps?: { title: string; body: string }[];
  faq: FaqItem[];
  cta: string;
  /** Pre-selects this service in the contact form. */
  formService: ServiceSlug;
  /**
   * Lets search engines index the page. robots.txt doesn't block /lp/, so
   * the noindex tag on the rest stays visible to crawlers.
   */
  indexable?: boolean;
}

const HOSTING_FAQ: FaqItem = {
  q: "What does hosting cost after launch?",
  a: PRICE_COPY.hosting,
};

export const LANDING_PAGES: LandingPage[] = [
  {
    slug: "wordpress-website",
    layout: "offer",
    eyebrow: `WordPress website · from ${dollars(PRICES.website)} + GST`,
    title: `A simple WordPress website, designed and built, from ${dollars(PRICES.website)}`,
    description:
      "A website designed around your business, built in WordPress so you can update it yourself. Auckland-based, working NZ-wide.",
    price: PRICES.website,
    fineprint:
      "Bigger sites, online stores and integrations are quoted at a fixed price after a free consultation.",
    proof: [
      {
        value: dollars(PRICES.website),
        label: "+ GST for a simple WordPress site",
      },
      { value: "Fixed", label: "price, agreed before we start" },
      {
        value: `${dollars(PRICES.hostingMonthly)}/mo`,
        label: "hosting with an hour of updates",
      },
    ],
    bullets: [
      "A design built around your brand, not a stock template",
      "Mobile-first, fast and accessible",
      "Contact form, Google Maps and social links",
      "Search basics set up: titles, descriptions, sitemap, business schema",
      "Your own login to update pages and blog posts",
      "Launch, SSL and backups handled",
    ],
    steps: [
      {
        title: "Chat",
        body: "A free 20-minute call about your business and what the site needs to do.",
      },
      {
        title: "Design",
        body: "A design for your home page. You see it before anything is built.",
      },
      {
        title: "Build",
        body: "We build it on a private staging link so you can click through the real thing.",
      },
      {
        title: "Launch",
        body: "Domain, SSL, analytics and backups set up, and a quick walk-through of editing it yourself.",
      },
    ],
    faq: [
      {
        q: "What counts as a simple website?",
        a: "A handful of pages, such as home, about, services and contact, with your content and images. If you need a store, bookings or integrations, we'll quote a fixed price after a chat.",
      },
      HOSTING_FAQ,
      {
        q: "Can I update it myself?",
        a: "Yes. It's WordPress, so you get your own login and we show you how. Or use your free hour of updates each month.",
      },
      {
        q: "How long does it take?",
        a: "Most simple sites launch within three to four weeks of us receiving your content.",
      },
    ],
    cta: "Start my website",
    formService: "website-design",
  },
  {
    slug: "website-review",
    layout: "audit",
    eyebrow: "Website review · fixed price",
    title: "Find out exactly what's holding your website back",
    description:
      "A plain-English review of your website's search visibility, AI search readiness, speed and security, with every issue listed in the order to fix it.",
    proof: [
      { value: "1 list", label: "every issue, prioritised" },
      { value: "Plain", label: "English, no jargon" },
      { value: "Fixed", label: "price, agreed after a free chat" },
    ],
    bullets: [
      "Search visibility: titles, descriptions, headings, schema, sitemap, indexing",
      "AI search readiness: whether ChatGPT, Gemini and Google AI Overviews can find and understand you",
      "Speed: load times on mobile and desktop, images, scripts and hosting",
      "Security and upkeep: SSL, updates, backups and plugins",
      "Usability: navigation, mobile, forms and calls to action",
      "A written report, in priority order, that you can hand to any developer",
    ],
    steps: [
      {
        title: "Chat",
        body: "A free call about your site and what you want from it. We agree a fixed price.",
      },
      {
        title: "Review",
        body: "We test, measure and check the site, Search Console and your Google profile.",
      },
      {
        title: "Report",
        body: "You get the list in plain English. Fix it yourself, hand it on, or ask us to quote.",
      },
    ],
    faq: [
      {
        q: "Do I need to be hosted with you?",
        a: "No. We review any site on any platform, though WordPress and Shopify are what we know best.",
      },
      {
        q: "Will you try to sell me a new website?",
        a: "Only if the review says you need one, and we'll say so plainly. Most sites need fixing, not replacing.",
      },
      {
        q: "Can you make the fixes too?",
        a: "Yes. The report shows what each fix involves, and we can quote a fixed price for the lot or just the important ones.",
      },
    ],
    cta: "Book my review",
    formService: "website-reviews",
  },
  {
    slug: "online-store",
    layout: "migration",
    eyebrow: "Online store · Shopify or WooCommerce",
    title: "An online store, set up properly, at a fixed price",
    description:
      "Shopify or WooCommerce, with payments, freight, GST and Google Shopping sorted, and connected to the systems you already use. We run an online store ourselves.",
    proof: [
      { value: "2", label: "platforms we specialise in" },
      {
        value: `${dollars(PRICES.ecommerceHostingMonthly)}/mo`,
        label: "WordPress eCommerce hosting",
      },
      { value: "Fixed", label: "price, agreed after a free chat" },
    ],
    bullets: [
      "Store design built around your brand and products",
      "Products, variants, collections and brands set up or imported",
      "Payments, Afterpay, freight rules and NZ GST tested with real orders",
      "Google Merchant Center and free product listings",
      "Point-of-sale, accounting or inventory sync where you need it",
      "Training, so your team can run it day to day",
    ],
    steps: [
      {
        title: "Platform",
        body: "Shopify or WooCommerce: we'll recommend one based on your products, volumes and what else you run.",
      },
      {
        title: "Design",
        body: "Your brand, your products, and a checkout people actually finish.",
      },
      {
        title: "Build",
        body: "Built on a staging site, tested with real orders before launch.",
      },
      {
        title: "Launch",
        body: "Redirects from your old site, Google set up, and you own everything.",
      },
    ],
    faq: [
      {
        q: "Moving from Wix, Squarespace or an old store?",
        a: "Yes. Moving products, customers and orders is part of the quote, with redirects so you keep your search rankings.",
      },
      {
        q: "Can you connect it to Xero or our point-of-sale?",
        a: "Yes. Syncing a store with accounting, point-of-sale or inventory systems is one of our most common jobs.",
      },
      HOSTING_FAQ,
    ],
    cta: "Start my store",
    formService: "ecommerce",
  },
];

export function getLandingPage(slug: string) {
  return LANDING_PAGES.find((l) => l.slug === slug);
}
