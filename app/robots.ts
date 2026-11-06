import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://everydaydigital.co.nz";

// AI crawler policy. See docs/SEO-GEO-AEO-AUDIT.md §4 for the trade-offs.
// Current choice: allow all — a service business wants to be recommended.
// To allow answer-engine bots but block model training, use Option 2.
const AI_TRAINING_BOTS = ["GPTBot", "Google-Extended", "CCBot", "anthropic-ai"];
const AI_SEARCH_BOTS = [
  "OAI-SearchBot",
  "ClaudeBot",
  "PerplexityBot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // /api is machine-only; /lp are paid-traffic landing pages (noindex).
      { userAgent: "*", allow: "/", disallow: ["/api/", "/lp/"] },
      // Option 1 (current): allow all AI bots.
      { userAgent: [...AI_SEARCH_BOTS, ...AI_TRAINING_BOTS], allow: "/" },
      // Option 2: cited but not trained on — replace the line above with:
      // { userAgent: AI_SEARCH_BOTS, allow: "/" },
      // { userAgent: AI_TRAINING_BOTS, disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
