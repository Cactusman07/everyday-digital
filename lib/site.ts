// Site facts that the code relies on: contact details, the services and their
// colours, published prices, case-study facts and the FAQ. Kept in code because
// they change rarely and need to be exact. WordPress holds everything else:
// pages, projects, posts, services copy and testimonials.

// IndexNow key (public by design — it just proves we own the domain). The
// matching file is public/<key>.txt. Bing, Yandex, Seznam and others use it to
// pick up new and changed pages within minutes; ChatGPT search leans on Bing.
export const INDEXNOW_KEY = "9fde70914894c907d453df0bc5778216";

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
  social: {
    facebook: "https://www.facebook.com/every.day.digital.2023",
    linkedin: "https://www.linkedin.com/company/every-day-digital/",
    instagram: "https://www.instagram.com/everydaydigitalnz/",
  },
} as const;

export const HOSTING = {
  shared: { monthly: 40, annual: 400, label: "Website hosting" },
  ecommerce: { monthly: 50, label: "eCommerce hosting" },
  private: { from: 200, label: "Secure private hosting" },
  includes: [
    "SSL certificate",
    "Daily backups",
    "Core, plugin and theme updates",
    "Security and uptime monitoring",
    "Your own login to manage content",
  ],
  support:
    "Website hosting includes one hour of free updates each month. Pay annually and get two months free.",
} as const;

// Facts for the four featured case studies, keyed by WordPress project slug.
// Results with a null value are hidden until there's a real number to show.
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
      "2026 tune-up: FAQs with schema, page-by-page SEO and AI search fixes, Google Merchant Center",
    ],
    howWeDidIt: [
      "Elementor for the layout so the client can update pages without a developer",
      "Performance tuned with Breeze and Object Cache Pro; heartbeat throttled and cron moved to the server",
      "Ongoing updates and new products added on request",
    ],
  },
  {
    slug: "ride-rotorua-store-website",
    client: "Ride Rotorua Store",
    url: "https://riderotoruastore.co.nz",
    sector: "Bike retail · Tourism",
    summary:
      "A new WooCommerce store for a Rotorua bike shop, synced with its Lightspeed point-of-sale so products and stock are managed in one place.",
    services: [
      "Web design",
      "WooCommerce development",
      "Integration",
      "Hosting",
    ],
    stack: [
      "WordPress",
      "WooCommerce",
      "Lightspeed",
      "Google Merchant Center",
      "Cloudways",
    ],
    timeline: null,
    results: [
      { label: "Conversion", value: null },
      { label: "Load time", value: null },
    ],
    whatWeDid: [
      "Every page designed as a mockup first: hire and demos, brands, servicing, about, contact and blog",
      "Products, images and stock synced from Lightspeed, with rules that keep parts and inactive items offline",
      "Card and Afterpay checkout, standard and rural freight, Google Shopping, NZ returns policy and terms",
    ],
    howWeDidIt: [
      "Built on a staging copy the team could test, then moved to the live domain in one step",
      "Hosted on our managed Cloudways server, with server cron and background-task limits for a large catalogue",
    ],
  },
  {
    slug: "plow-foods-operations-portal",
    client: "Plow Foods",
    url: "https://plowfoods.co.nz",
    sector: "Food manufacturing · FMCG",
    summary:
      "An operations portal on top of MYOB for a New Zealand snack maker: orders, stock, production and deliveries in one place. We work inside the business, so we use it every day.",
    services: ["Custom development", "Automation", "AI"],
    stack: [
      "React",
      "Azure Logic Apps",
      "Azure Functions",
      "Azure API Management",
      "MYOB AccountRight",
    ],
    timeline: null,
    results: [
      { label: "Hours saved per month", value: null },
      { label: "Spec sheets automated", value: null },
    ],
    whatWeDid: [
      "Orders, customers and invoices flow straight into MYOB, with no double entry",
      "Production scheduling, stocktakes and inventory in one place",
      "Delivery route planning, low-stock alerts and AI-assisted order review",
    ],
    howWeDidIt: [
      "Built in-house as the operating team, not as an outside agency — which means the automations are shaped by the actual workflow",
      "React front end, with Azure handling the MYOB integration and automations",
    ],
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
      "Supplier orders, invoices and packing slips handled automatically",
    ],
    howWeDidIt: [
      "Azure Logic Apps pick a product, Claude writes the caption, and the post goes to Instagram and Facebook on its own",
      "We run this store ourselves, which is the point: it's the test bed for everything we recommend to store clients",
    ],
    ownBusiness: true,
  },
];

export const FEATURED_SLUGS = CASE_STUDIES.map((c) => c.slug);

export function getCaseStudy(slug: string): CaseStudyMeta | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
// FAQ — rendered on the home page and emitted as FAQPage schema so answer
// engines can quote it directly.
export const FAQ: { q: string; a: string }[] = [
  {
    q: "How much does a website cost?",
    a: "A simple website designed and developed in WordPress starts at $1500 + GST. Everything else is quoted at a fixed price after a free consultation and chat, so you know the cost before we start.",
  },
  {
    q: "What does hosting cost, and what's included?",
    a: "Website hosting is $40 a month, which includes one hour of free updates each month. Pay annually and you get two months free ($400 a year). eCommerce hosting is $50 a month. Every plan includes SSL, automated backups, a firewall, a staging site and monitoring. Prices exclude GST.",
  },
  {
    q: "Can you manage my website or online store for me?",
    a: "Yes. Digital Management is a fixed monthly fee to look after your website or eCommerce store: content and product updates, software updates, email, domains and hosting. We agree the scope with you first.",
  },
  {
    q: "Do you build on WordPress or Shopify?",
    a: "Both. We specialise in WordPress and Shopify, including WooCommerce stores, and we build custom web applications when off-the-shelf software stops fitting.",
  },
  {
    q: "Can you take over a site someone else built?",
    a: "Yes. We usually start with a website review, which gives you a plain-English list of what needs fixing in priority order, then a clear answer: fix it or rebuild it.",
  },
  {
    q: "What does AI and automation actually mean here?",
    a: "Looking at how work moves through your business, then connecting the systems that should already talk to each other, such as your store, accounting, point-of-sale and email, and adding AI where it saves real hours.",
  },
  {
    q: "Where are you based, and who do you work with?",
    a: "Auckland, working with businesses across New Zealand. Most of the work is remote; we meet in person for kickoffs when it helps.",
  },
];

// Headline pricing. The only published price points; everything else is
// quoted at a fixed price after a free consultation.
export const PRICING = {
  simpleSiteFrom: 1500,
  line: "A simple website designed & developed in WordPress starts at $1500 + GST.",
  rest: "Everything else is quoted at a fixed price after a free consultation and chat.",
} as const;

// The services, in display order. `slug` matches the WordPress service slug so
// cards can link to /services/<slug>/ and pick the right icon. `word` is the
// hero word each service is paired with, and `colour` is that word's gradient
// colour from the hero animation.
export interface ServiceMeta {
  slug: string;
  title: string;
  word: string;
  colour: string;
  summary: string;
  tags: string[];
}

export const SERVICES: ServiceMeta[] = [
  {
    slug: "website-design",
    title: "Website Design",
    word: "Design",
    colour: "#4b6ceb",
    summary:
      "Websites designed around your brand and your customers, and built so you can manage them yourself.",
    tags: ["WordPress", "Shopify", "Mobile-first"],
  },
  {
    slug: "development",
    title: "Website Development",
    word: "Digital",
    colour: "#e34beb",
    summary:
      "WordPress and Shopify builds, through to custom web apps and integrations.",
    tags: ["WordPress", "Shopify", "Custom apps"],
  },
  {
    slug: "ecommerce",
    title: "eCommerce",
    word: "Innovation",
    colour: "#9deb4b",
    summary:
      "Online stores set up properly, with payments, freight, GST and Google Shopping, and connected to the systems you already use.",
    tags: ["Shopify", "WooCommerce", "POS sync"],
  },
  {
    slug: "hosting",
    title: "Web Hosting",
    word: "Reliability",
    colour: "#4bafeb",
    summary:
      "Managed cloud hosting with backups, firewall, SSL and staging. Websites $40 a month with an hour of free updates. eCommerce $50 a month.",
    tags: ["Backups", "Firewall", "Staging"],
  },
  {
    slug: "automation",
    title: "AI & Automation Projects",
    word: "Automation",
    colour: "#834beb",
    summary:
      "We connect your systems, remove the manual steps, and put AI to work where it genuinely helps.",
    tags: ["Integrations", "AI content", "Workflows"],
  },
  {
    slug: "website-reviews",
    title: "Website Reviews",
    word: "Strategy",
    colour: "#eb4b4b",
    summary:
      "A plain-English review of speed, search, security and conversions, with a prioritised list of what to fix.",
    tags: ["SEO", "AI search", "Speed"],
  },
  {
    slug: "digital-consulting",
    title: "Digital Consulting",
    word: "Mentoring",
    colour: "#ebe74b",
    summary:
      "Independent, practical advice from someone who builds and runs online businesses every day.",
    tags: ["Platform advice", "Migrations", "Strategy"],
  },
  {
    slug: "digital-management",
    title: "Digital Management",
    word: "Support",
    colour: "#4bebc8",
    summary:
      "Your website or online store looked after for a fixed monthly fee. Content, products, updates, email and domains, all handled.",
    tags: ["Fixed monthly fee", "Websites", "Online stores"],
  },
];

// Search titles and descriptions for the main WordPress pages. The page body
// still comes from WordPress; these only set the <title>, meta description and
// social preview, which matter most for search and AI answers.
export const PAGE_SEO: Record<string, { title: string; description: string }> =
  {
    services: {
      title: "Website Design, Development, Hosting & Automation Services",
      description:
        "WordPress and Shopify website design and development, eCommerce, web hosting, website reviews, AI and automation, consulting and website management for New Zealand businesses.",
    },
    projects: {
      title: "Projects — Websites, Online Stores and Portals We've Built",
      description:
        "Recent work from Every Day Digital: WooCommerce and Shopify stores, WordPress websites and custom business portals for New Zealand businesses.",
    },
    blog: {
      title: "Blog — Websites, eCommerce and Automation in Plain English",
      description:
        "Practical articles on websites, online stores, hosting, AI and automation for small and growing New Zealand businesses.",
    },
    about: {
      title: "About Every Day Digital — Auckland Web Design & Development",
      description:
        "Every Day Digital is an Auckland web design, development and hosting business. We build and run websites, online stores and automation for New Zealand businesses.",
    },
    contact: {
      title: "Contact — Book a Free Consultation",
      description:
        "Get in touch with Every Day Digital for a free consultation and a fixed-price quote on your website, online store, hosting or automation project.",
    },
    terms: {
      title: "Terms & Conditions",
      description:
        "Terms and conditions for Every Day Digital's website design, development, hosting, automation and consulting services, and for using this website.",
    },
  };

export function getServiceMeta(slug: string): ServiceMeta | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
