// What the site adds around each WordPress page, keyed by page slug. The page
// body still comes from WordPress; this decides the search title, the intro
// line, which list (if any) follows the body, the call to action and the
// schema type. Pages not listed here render as plain content pages.

export type PageListing = "services" | "projects" | "posts" | "team";

export interface CallToAction {
  heading: string;
  text: string;
}

export interface PageConfig {
  /** <title> and meta description; these matter most for search and AI answers. */
  seo?: { title: string; description: string };
  /** Small label above the title. Defaults to the site name. */
  eyebrow?: string;
  /** Short line under the title. */
  intro?: string;
  /** The WordPress list rendered after the page body. */
  listing?: PageListing;
  cta?: CallToAction;
  /** Replaces the page body with the contact form. */
  contactForm?: boolean;
  /**
   * schema.org type for a page without a listing. Pages with a listing get
   * Blog or CollectionPage from components/seo/PageJsonLd.tsx.
   */
  schemaType?: "AboutPage" | "ContactPage";
}

const PAGES: Record<string, PageConfig> = {
  services: {
    seo: {
      title: "Web Design, Hosting & Automation Services",
      description:
        "Website design and development in WordPress and Shopify, eCommerce, hosting, website reviews, AI, automation and site management for New Zealand businesses.",
    },
    eyebrow: "What we do",
    listing: "services",
    cta: {
      heading: "Not sure which one you need?",
      text: "Most projects mix two or three of these. Tell us what you're trying to do and we'll come back with a fixed-price quote.",
    },
  },
  projects: {
    seo: {
      title: "Projects: Websites, Online Stores & Portals",
      description:
        "Recent work from Every Day Digital: WooCommerce and Shopify stores, WordPress websites and custom business portals for New Zealand businesses.",
    },
    eyebrow: "Our work",
    intro:
      "Websites, online stores and custom portals for New Zealand businesses — plus two businesses we run ourselves.",
    listing: "projects",
    cta: {
      heading: "Like what you see?",
      text: "We'd love to hear about your project. No commitment, just a conversation.",
    },
  },
  blog: {
    seo: {
      title: "Blog: Websites, eCommerce & Automation",
      description:
        "Practical articles on websites, online stores, hosting, AI and automation for small and growing New Zealand businesses.",
    },
    eyebrow: "The blog",
    intro:
      "The latest digital trends, news and project updates, in plain English. Websites, online stores, AI search and automation for small and growing NZ businesses.",
    listing: "posts",
    cta: {
      heading: "Ready to put these ideas into practice?",
      text: "We work with businesses across New Zealand to make digital less complicated and more effective.",
    },
  },
  about: {
    seo: {
      title: "About Us — Auckland Web Design & Development",
      description:
        "An Auckland web design, development and hosting business. We build and run websites, online stores and automation for New Zealand businesses.",
    },
    listing: "team",
    schemaType: "AboutPage",
  },
  contact: {
    seo: {
      title: "Contact — Book a Free Consultation",
      description:
        "Get in touch with Every Day Digital for a free consultation and a fixed-price quote on your website, online store, hosting or automation project.",
    },
    eyebrow: "Get in touch",
    intro:
      "Whether you've got a clear brief or just an idea, we're here to help. Book a free call straight into our calendar, or fill in the form and we'll get back to you within one business day.",
    contactForm: true,
    schemaType: "ContactPage",
  },
  terms: {
    seo: {
      title: "Terms & Conditions",
      description:
        "Terms and conditions for Every Day Digital's website design, development, hosting, automation and consulting services, and for using this website.",
    },
  },
};

export function getPageConfig(slug: string): PageConfig {
  return PAGES[slug] ?? {};
}
