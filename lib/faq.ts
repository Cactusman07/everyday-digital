// FAQ for the home page. Also emitted as FAQPage schema and in llms.txt so
// answer engines can quote it directly.

import { PRICE_COPY } from "./pricing";

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: FaqItem[] = [
  {
    q: "How much does a website cost?",
    a: `${PRICE_COPY.website} ${PRICE_COPY.quoted}`,
  },
  {
    q: "What does hosting cost, and what's included?",
    a: `${PRICE_COPY.hosting} Every plan includes SSL, automated backups, a firewall, a staging site and monitoring.`,
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
