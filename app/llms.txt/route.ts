// /llms.txt — a short Markdown summary of the business and links to its
// content, for AI assistants and answer engines (https://llmstxt.org).
// /llms-full.txt has the full text.

import { CASE_STUDIES } from "@/lib/case-studies";
import { newestFirst } from "@/lib/dates";
import { excerptOf } from "@/lib/html";
import { faqLines, introLines, pricingLines, textResponse } from "@/lib/llms";
import { FOOTER_LINKS } from "@/lib/navigation";
import { SERVICES } from "@/lib/services";
import { SITE, absoluteUrl } from "@/lib/site";
import { getPosts, getProjects, safe } from "@/lib/wordpress";
import { itemPath } from "@/lib/wordpress/content-types";

export const revalidate = 3600;

/** How many recent articles to list. */
const LATEST_ARTICLES = 12;

const link = (text: string, path: string) => `[${text}](${absoluteUrl(path)})`;

export async function GET() {
  const [posts, projects] = await Promise.all([
    safe(getPosts),
    safe(getProjects),
  ]);

  return textResponse([
    `# ${SITE.name}`,
    "",
    ...introLines(),
    "",
    `The full text of every service, project and article is at ${absoluteUrl("/llms-full.txt")}.`,
    "",
    "## Services",
    ...SERVICES.map(
      (s) => `- ${link(s.title, itemPath("service", s.slug))}: ${s.summary}`,
    ),
    "",
    ...pricingLines(),
    "",
    "## Selected work",
    ...CASE_STUDIES.map(
      (c) =>
        `- ${link(c.client, itemPath("project", c.slug))} (${c.sector}): ${c.summary} Built with ${c.stack.join(", ")}.`,
    ),
    "",
    "## Latest articles",
    ...newestFirst(posts)
      .slice(0, LATEST_ARTICLES)
      .map(
        (p) =>
          `- ${link(p.title, itemPath("post", p.slug))} (${p.date.slice(0, 10)}): ${excerptOf(p, 200)}`,
      ),
    "",
    "## All projects",
    ...projects.map(
      (p) =>
        `- ${link(p.title, itemPath("project", p.slug))}: ${excerptOf(p, 160)}`,
    ),
    "",
    ...faqLines(),
    "",
    "## Links",
    `- ${link("Home", "/")}`,
    `- ${link("Pricing", "/#pricing")}`,
    ...FOOTER_LINKS.map((l) => `- ${link(l.label, l.href)}`),
    "",
    "## Optional",
    `- ${link("Full text of the site", "/llms-full.txt")}`,
    `- ${link("RSS feed", "/feed.xml")}`,
    `- ${link("Sitemap", "/sitemap.xml")}`,
  ]);
}
