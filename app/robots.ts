// robots.txt and the AI crawler policy. See docs/SEO-GEO-AEO-AUDIT.md §4 for
// the trade-offs. Current choice (Option 1): allow every AI crawler, because a
// service business wants to be recommended. /lp/ landing pages stay crawlable
// on purpose: they carry a noindex tag, and crawlers only see that tag on
// pages they may fetch.

import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/** Crawlers (or opt-out tokens) that collect pages to train AI models. */
const AI_TRAINING_BOTS = [
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "meta-externalagent",
];

/**
 * AI search and assistant crawlers: they fetch pages to answer someone's
 * question and cite the source.
 */
const AI_SEARCH_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot",
  "Bingbot",
  "DuckAssistBot",
];

const DISALLOW = "/api/";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      // Option 1 (current): an explicit "allowed" policy for every AI bot.
      {
        userAgent: [...AI_SEARCH_BOTS, ...AI_TRAINING_BOTS],
        allow: "/",
        disallow: DISALLOW,
      },
      // Option 2, cited but not trained on — replace the rule above with:
      // { userAgent: AI_SEARCH_BOTS, allow: "/", disallow: DISALLOW },
      // { userAgent: AI_TRAINING_BOTS, disallow: "/" },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
