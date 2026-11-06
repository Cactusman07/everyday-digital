// Landing page definitions for paid and social traffic. Each entry renders at
// /lp/<slug>. Pages are noindex by default (they exist to convert a specific
// ad or post, not to rank) and carry a single primary action.
//
// To add a landing page: add an object here. No new route or component needed.
// Three layouts:
//   "offer"     — one package, price up front, what's included, FAQ, form
//   "audit"     — problem-led, what you get, sample findings, form
//   "migration" — before/after, risks we remove, process, form

import { PACKAGES, type Package } from "./site";

export type LandingLayout = "offer" | "audit" | "migration";

export interface LandingPage {
  slug: string;
  layout: LandingLayout;
  title: string; // <title> and H1
  description: string; // meta description + sub-headline
  eyebrow: string;
  packageId?: Package["id"];
  proof: { value: string; label: string }[]; // 3 short proof points
  bullets: string[]; // what you get
  steps?: { title: string; body: string }[]; // process (migration/offer)
  faq: { q: string; a: string }[];
  cta: string;
  formService: string; // pre-selects the contact form's service dropdown
  indexable?: boolean; // default false
}

const pkg = (id: Package["id"]) => PACKAGES.find((p) => p.id === id)!;

export const LANDING_PAGES: LandingPage[] = [
  {
    slug: "website-2350",
    layout: "offer",
    eyebrow: "Business website · $2,350 + GST",
    title: "A custom-designed business website for $2,350",
    description:
      "Not a template. A website designed around your business, built fast, hosted from $30/month. Auckland-based, working NZ-wide.",
    packageId: "static-site",
    proof: [
      { value: "17", label: "sites hosted & maintained" },
      { value: "$2,350", label: "fixed price, no surprises" },
      { value: "Same day", label: "reply on every enquiry" },
    ],
    bullets: pkg("static-site").includes,
    steps: [
      {
        title: "Brief",
        body: "A 20-minute call. We write back the same day with what we heard and a start date.",
      },
      {
        title: "Design",
        body: "A custom concept for your home page. You see it before anything is built.",
      },
      {
        title: "Build",
        body: "Fast, mobile-first, accessible. You review on a staging link.",
      },
      {
        title: "Launch",
        body: "Domain, SSL, analytics, backups — handled. Your own login to edit content.",
      },
    ],
    faq: [
      {
        q: "What's the $2,350 for, exactly?",
        a: "A custom design concept and a quality static website — typically a home page with the sections your business needs, built to be fast. Multi-page sites with stores or integrations are the $4,750 package.",
      },
      {
        q: "What does hosting cost after launch?",
        a: "Shared hosting is $30/month or $300/year. Secure private hosting is from $200/month. Both include SSL, backups, updates and monitoring.",
      },
      {
        q: "Can I update it myself?",
        a: "Yes. You get your own login. If you'd rather we make changes, that's $140/hour — no retainer.",
      },
      {
        q: "How long does it take?",
        a: "Most business websites launch within three to four weeks of receiving your content.",
      },
    ],
    cta: "Start my website",
    formService: "Website design",
  },
  {
    slug: "seo-audit",
    layout: "audit",
    eyebrow: "SEO & website audit · $1,500 + GST",
    title: "Find out exactly what's holding your website back",
    description:
      "A one-off audit of your website's search visibility, speed and conversion — a written list of everything that needs fixing, with the first four hours of fixes done.",
    packageId: "seo-audit",
    proof: [
      { value: "4 hrs", label: "of fixes included" },
      { value: "1 list", label: "every issue, prioritised" },
      { value: "$140/hr", label: "for anything beyond that" },
    ],
    bullets: [
      "Search visibility: titles, descriptions, headings, schema, sitemap, indexing",
      "Speed: Core Web Vitals on mobile and desktop, image weight, scripts",
      "Conversion: calls to action, forms, mobile usability, trust signals",
      "Security and hosting: SSL, updates, backups, uptime",
      "Content: what's missing against what people actually search for",
      "A prioritised written report, then four hours of the fixes done directly",
    ],
    steps: [
      {
        title: "Access",
        body: "You give us read access to Search Console and Analytics (we'll show you how).",
      },
      {
        title: "Audit",
        body: "Five working days. We test, measure and write it up in plain English.",
      },
      {
        title: "Fix",
        body: "The four hours start with whatever moves the needle most. You get a before/after.",
      },
    ],
    faq: [
      {
        q: "Do I need to be hosted with you?",
        a: "No. We audit any site on any platform. If you'd like us to make the fixes, we need admin access to the site; otherwise we hand the list to your developer.",
      },
      {
        q: "Will you try to sell me a new website?",
        a: "Only if the audit says you need one, and we'll say so plainly. Most sites need fixing, not replacing.",
      },
      {
        q: "What if there's more than four hours of work?",
        a: "The report tells you what's left and what it costs. You decide. Anything further is $140/hour or quoted as a project.",
      },
    ],
    cta: "Book my audit",
    formService: "Other",
  },
  {
    slug: "shopify-6500",
    layout: "migration",
    eyebrow: "Full online store · $6,500 + GST",
    title: "A Shopify or WooCommerce store, built properly, for $6,500",
    description:
      "Full design concept, up to 30 products, payments, freight and tax set up. We run our own Shopify store, so we build yours knowing what breaks.",
    packageId: "ecommerce",
    proof: [
      { value: "30", label: "products built in" },
      { value: "2", label: "stores we run ourselves" },
      { value: "$6,500", label: "fixed, including design" },
    ],
    bullets: pkg("ecommerce").includes,
    steps: [
      {
        title: "Platform",
        body: "Shopify or WooCommerce — we'll recommend one based on your products, volumes and what else you run.",
      },
      {
        title: "Design",
        body: "A full concept rework. Your brand, your products, a checkout people finish.",
      },
      {
        title: "Build",
        body: "Products, variants, payments, freight rules, NZ GST. Tested with real orders.",
      },
      {
        title: "Launch & hand over",
        body: "Launch checklist, training, and you own everything. Hosting and support on request, no retainer.",
      },
    ],
    faq: [
      {
        q: "Moving from Wix, Squarespace or an old WooCommerce store?",
        a: "Yes — migration of products, customers and orders is scoped into the build. Redirects are set up so you don't lose search rankings.",
      },
      {
        q: "More than 30 products?",
        a: "Additional products are built at the standard hourly rate, or we set you up to bulk-import them yourself.",
      },
      {
        q: "Can you connect it to Xero?",
        a: "Yes. Store-to-Xero sync is one of our most common automation jobs. It's quoted separately so you only pay for it if you want it.",
      },
    ],
    cta: "Start my store",
    formService: "Development",
  },
];

export function getLandingPage(slug: string) {
  return LANDING_PAGES.find((l) => l.slug === slug);
}
