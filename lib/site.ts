// Static site content — the offer structure, pricing, focus areas and case-study
// metadata that define what Every Day Digital sells. This is deliberately NOT in
// WordPress: prices and packages change rarely, need to be exact, and should be
// version-controlled alongside the code that renders them. WordPress remains the
// source for projects, testimonials, blog posts and long-form page content.

export const SITE = {
  name: "Every Day Digital",
  legalName: "Every Day Digital Limited",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://everydaydigital.co.nz",
  tagline: "We keep you running.",
  description:
    "Web design, development and hosting for New Zealand businesses — WordPress, Shopify and custom-built apps, plus automation and AI help. Auckland-based, working NZ-wide.",
  email: "hello@everydaydigital.co.nz",
  phone: "021 175 9457",
  phoneIntl: "+64-21-175-9457",
  founder: "Sam Muir",
  city: "Auckland",
  region: "Auckland",
  country: "NZ",
  hourlyRate: 140,
  social: {
    facebook: "https://www.facebook.com/every.day.digital.2023",
    linkedin: "https://www.linkedin.com/company/every-day-digital/",
    instagram: "https://www.instagram.com/everydaydigitalnz/",
  },
} as const;

// The four things the business does. Order is the order they appear on the page.
export interface FocusArea {
  id: string;
  title: string;
  short: string;
  body: string;
  bullets: string[];
  href: string;
}

export const FOCUS_AREAS: FocusArea[] = [
  {
    id: "hosting",
    title: "Hosting",
    short: "Fast, secure, looked after.",
    body: "Managed cloud hosting on servers we run. Shared hosting for most sites, or a private server when your data needs to stay yours.",
    bullets: [
      "Shared hosting from $30/month or $300/year",
      "Secure private hosting from $200/month",
      "SSL, daily backups, updates and monitoring included",
      "Your own login — you manage your content",
    ],
    href: "/services/hosting/",
  },
  {
    id: "design",
    title: "Web design",
    short: "Designed for your business, not a template.",
    body: "Every site starts with a custom design concept. No themes bent out of shape — a layout built around what your customers need to see first.",
    bullets: [
      "Custom design concept for every project",
      "Mobile-first, fast, accessible",
      "Brand-true — your logo and colours, done properly",
      "Content guidance so the words match the design",
    ],
    href: "/services/web-design/",
  },
  {
    id: "development",
    title: "Web development",
    short: "WordPress, Shopify and custom-built apps.",
    body: "The right platform for the job: WordPress for content sites, Shopify or WooCommerce for stores, and custom-built applications when off-the-shelf stops fitting.",
    bullets: [
      "WordPress and WooCommerce",
      "Shopify stores and theme work",
      "Custom web apps in React and .NET on Azure",
      "Migrations and rescues of sites someone else built",
    ],
    href: "/services/development/",
  },
  {
    id: "automation",
    title: "Automation & AI help",
    short: "Stop re-keying. Start connecting.",
    body: "We look at how work actually moves through your business, then connect the systems that should already be talking — Xero, Shopify, email, spreadsheets — and add AI where it saves real hours.",
    bullets: [
      "Business process audit — what's manual, what it costs",
      "Store ↔ Xero, Stripe, Mailchimp and scheduled jobs",
      "AI-assisted content, data entry and reporting",
      "Quoted per project, no retainer required",
    ],
    href: "/services/automation/",
  },
];

// Priced packages — the "menu". These exact figures were set by Sam on 7 Nov 2026.
export interface Package {
  id: string;
  name: string;
  price: number | null; // null = quoted
  priceLabel: string;
  tagline: string;
  includes: string[];
  fineprint?: string;
  featured?: boolean;
  cta: string;
  ctaHref: string;
}

export const PACKAGES: Package[] = [
  {
    id: "static-site",
    name: "Business website",
    price: 2350,
    priceLabel: "$2,350",
    tagline: "Custom design and a quality static site.",
    includes: [
      "Custom design concept",
      "Quality static website, built to be fast",
      "Mobile-first and accessible",
      "SEO foundations and analytics",
      "Choice of shared or private hosting",
    ],
    fineprint:
      "Shared hosting $30/month or $300/year. Private hosting from $200/month.",
    cta: "Start a business website",
    ctaHref: "/contact/?package=static-site",
  },
  {
    id: "multi-page",
    name: "Multi-page website",
    price: 4750,
    priceLabel: "$4,750",
    tagline: "Custom design with room to grow.",
    includes: [
      "Everything in Business website",
      "Multi-page layout, customisable sections",
      "Store or integration functionality",
      "Content training so you can edit it yourself",
      "SEO foundations across every page",
    ],
    featured: true,
    cta: "Start a multi-page site",
    ctaHref: "/contact/?package=multi-page",
  },
  {
    id: "ecommerce",
    name: "Full online store",
    price: 6500,
    priceLabel: "$6,500",
    tagline: "Shopify or WooCommerce, fully customised.",
    includes: [
      "Full design concept rework",
      "Shopify or WooCommerce, fully customisable",
      "Up to 30 products built in",
      "Payments, freight and tax set up",
      "Launch checklist and training",
    ],
    fineprint:
      "Additional products beyond 30 are built at the standard hourly rate.",
    cta: "Start an online store",
    ctaHref: "/contact/?package=ecommerce",
  },
  {
    id: "seo-audit",
    name: "SEO & website audit",
    price: 1500,
    priceLabel: "$1,500",
    tagline: "One-off. Everything your site needs, and the first fixes done.",
    includes: [
      "Full SEO and website improvement audit",
      "A written list of everything that needs fixing",
      "Up to 4 hours of tuning and fixes done directly",
      "Performance, accessibility and search checks",
      "Clear next steps, priced",
    ],
    fineprint: "Fixes beyond the included 4 hours are charged at $140/hour.",
    cta: "Book an audit",
    ctaHref: "/contact/?package=seo-audit",
  },
  {
    id: "automation",
    name: "Automation & AI",
    price: null,
    priceLabel: "Quoted",
    tagline:
      "Audit into your processes, then specific automations built to order.",
    includes: [
      "Business process audit",
      "Specific automation tasks, scoped and quoted",
      "System integrations (Xero, Shopify, email, more)",
      "AI help where it saves real hours",
    ],
    cta: "Talk about automation",
    ctaHref: "/contact/?package=automation",
  },
  {
    id: "enterprise",
    name: "Enterprise sites & management",
    price: null,
    priceLabel: "For discussion",
    tagline: "Larger builds and ongoing management, scoped project by project.",
    includes: [
      "Custom-built applications",
      "Multi-site and multi-brand setups",
      "Private hosting and data residency",
      "Ongoing management by arrangement",
    ],
    cta: "Start a conversation",
    ctaHref: "/contact/?package=enterprise",
  },
];

export const HOSTING = {
  shared: { monthly: 30, annual: 300, label: "Shared hosting" },
  private: { from: 200, label: "Secure private hosting" },
  includes: [
    "SSL certificate",
    "Daily backups",
    "Core, plugin and theme updates",
    "Security and uptime monitoring",
    "Your own login to manage content",
  ],
  support: `Work done is charged at $${SITE.hourlyRate}/hour or quoted per project.`,
} as const;

// Case-study metadata for the four focal clients. Keyed by the WordPress project
// slug so the project page can enrich WP content with structured facts. Anything
// marked TODO needs Sam to confirm before it renders publicly — the page hides
// fields that are still null.
export interface CaseStudyMeta {
  slug: string;
  client: string;
  url: string;
  sector: string;
  summary: string;
  services: string[];
  stack: string[];
  timeline: string | null;
  results: { label: string; value: string | null }[];
  whatWeDid: string[];
  howWeDidIt: string[];
  featured: true;
  order: number;
  ownBusiness?: boolean;
}

export const CASE_STUDIES: CaseStudyMeta[] = [
  {
    slug: "nz-in-pictures",
    client: "NZ In Pictures",
    url: "https://nzinpictures.co.nz",
    sector: "Photography · Print sales",
    summary:
      "A WooCommerce store selling New Zealand landscape prints and digital images, with variable products for sizes and formats.",
    services: ["Web design", "WooCommerce development", "Hosting"],
    stack: [
      "WordPress",
      "WooCommerce",
      "Elementor",
      "Cloudways",
      "Breeze",
      "Object Cache Pro",
    ],
    timeline: null,
    results: [
      { label: "Print orders", value: null },
      { label: "Page load", value: null },
      { label: "Product variations", value: null },
    ],
    whatWeDid: [
      "Designed and built the store around the photography — large imagery, minimal chrome",
      "Variable products for print size, finish and digital download",
      "Checkout, shipping and NZ tax set up",
      "Hosted on our managed Cloudways server with full-page caching and object cache",
    ],
    howWeDidIt: [
      "Elementor for the layout so the client can update pages without a developer",
      "Performance tuned with Breeze and Object Cache Pro; heartbeat throttled and cron moved to the server",
      "Ongoing support on request at the standard hourly rate",
    ],
    featured: true,
    order: 1,
  },
  {
    slug: "ride-rotorua-store",
    client: "Ride Rotorua Store",
    url: "https://riderotoruastore.co.nz",
    sector: "Bike retail · Tourism",
    summary:
      "A WooCommerce store for a Rotorua bike retailer — products, bookings and NZ-compliant store policies.",
    services: ["Web design", "WooCommerce development", "Hosting"],
    stack: ["WordPress", "WooCommerce", "Cloudways"],
    timeline: null,
    results: [
      { label: "Conversion", value: null },
      { label: "Load time", value: null },
    ],
    whatWeDid: [
      "Store build with product catalogue and booking enquiry flows",
      "NZ-compliant returns, shipping and privacy policies",
      "Scheduled server-side jobs for store maintenance",
    ],
    howWeDidIt: [
      "WooCommerce on our managed hosting, with a server cron replacing WP-Cron for reliability",
      "Reusable setup we now apply to other client stores",
    ],
    featured: true,
    order: 2,
  },
  {
    slug: "plow-foods",
    client: "Plow Foods",
    url: "https://plowfoods.co.nz",
    sector: "Food manufacturing · FMCG",
    summary:
      "A New Zealand snack brand in supermarkets nationwide. We work inside the business, so the tools we build are the ones we use every day.",
    services: ["Custom development", "Automation", "Digital strategy"],
    stack: ["React", ".NET", "Azure", "MYOB", "Shopify"],
    timeline: null,
    results: [
      { label: "Hours saved per month", value: null },
      { label: "Spec sheets automated", value: null },
    ],
    whatWeDid: [
      "Product specification and compliance documentation generated from structured data",
      "Bills of materials and costing kept in sync with the accounting system",
      "Portal for product, customer and compliance information",
    ],
    howWeDidIt: [
      "Built in-house as the operating team, not as an outside agency — which means the automations are shaped by the actual workflow",
      "Azure-hosted, with a React front end and .NET services",
    ],
    featured: true,
    order: 3,
    ownBusiness: true,
  },
  {
    slug: "home-office-space",
    client: "Home Office Space",
    url: "https://homeofficespace.co.nz",
    sector: "Ecommerce · Furniture",
    summary:
      "Our own Shopify store. Real products, real freight, real stock — so when we build a store for you, we know what breaks.",
    services: ["Shopify development", "Automation", "Social media automation"],
    stack: ["Shopify", "Azure Logic Apps", "Meta Graph API"],
    timeline: null,
    results: [
      { label: "Orders", value: null },
      { label: "Social posts automated", value: null },
    ],
    whatWeDid: [
      "Shopify store setup, theme customisation and product catalogue",
      "Daily Instagram and Facebook posting automated end to end",
      "Customer statements and invoicing laid out consistently",
    ],
    howWeDidIt: [
      "Azure Logic App schedules and publishes product posts to Instagram and Facebook without manual work",
      "We run this store ourselves, which is the point: it's the test bed for everything we recommend to store clients",
    ],
    featured: true,
    order: 4,
    ownBusiness: true,
  },
];

export const FEATURED_SLUGS = CASE_STUDIES.map((c) => c.slug);

export function getCaseStudy(slug: string): CaseStudyMeta | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

// Credentials. Only HELD items render on the public site; the rest are a to-do
// list and are filtered out before rendering.
export interface Credential {
  name: string;
  held: boolean;
  url?: string;
}

export const CREDENTIALS: Credential[] = [
  { name: "Cloudways Agency Partner", held: true },
  { name: "Shopify Partner", held: false },
  { name: "Woo Partner", held: false },
  { name: "Microsoft Partner", held: false },
  { name: "Xero Developer", held: false },
  { name: "Mailchimp & Co", held: false },
  { name: "Buy NZ Made", held: false },
];

// FAQ — rendered on the home page and emitted as FAQPage schema so answer
// engines can quote it directly.
export const FAQ: { q: string; a: string }[] = [
  {
    q: "How much does a website cost?",
    a: "A custom-designed business website is $2,350. A multi-page site with store or integration functionality is $4,750. A full Shopify or WooCommerce store with up to 30 products is $6,500. Anything beyond those is quoted at $140/hour or per project.",
  },
  {
    q: "What does hosting cost, and what's included?",
    a: "Shared hosting is $30/month or $300/year. Secure private hosting is from $200/month. Both include SSL, daily backups, updates, monitoring and your own login to manage content. Changes you'd like us to make are charged at $140/hour.",
  },
  {
    q: "Do you offer ongoing website management?",
    a: "Not as a retainer. We host your site, keep it updated and secure, and you manage your own content. When you need work done, it's $140/hour or quoted per project — you only pay for what you use.",
  },
  {
    q: "Do you build on WordPress or Shopify?",
    a: "Both, plus custom-built apps. WordPress for content-led sites, Shopify or WooCommerce for stores, and React/.NET on Azure when off-the-shelf software stops fitting.",
  },
  {
    q: "Can you take over a site someone else built?",
    a: "Yes. We start with a $1,500 SEO and website audit, which gives you a written list of everything that needs fixing with up to four hours of fixes included, then a clear answer: fix it or rebuild it.",
  },
  {
    q: "What does automation actually mean here?",
    a: "Looking at how work moves through your business, then connecting the systems that should already talk — Xero, Shopify, email, spreadsheets — and adding AI where it saves real hours. We audit first, then quote specific tasks.",
  },
  {
    q: "Where are you based, and who do you work with?",
    a: "Auckland, working with businesses across New Zealand. Most of the work is remote; we meet in person for kickoffs when it helps.",
  },
];

export const STATS = [
  { value: 17, suffix: "", label: "sites hosted & maintained" },
  { value: 2, suffix: "", label: "businesses we run ourselves" },
  { value: 12, suffix: "+", label: "years building for the web" },
] as const;
