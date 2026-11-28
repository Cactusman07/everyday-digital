// /llms-full.txt — the full text of the about page, every service, project
// and article as one Markdown file, so an AI assistant can read the whole
// site in one request. /llms.txt is the short version.

import { formatDate, newestFirst } from "@/lib/dates";
import { htmlToMarkdown } from "@/lib/html";
import { faqLines, introLines, pricingLines, textResponse } from "@/lib/llms";
import { sortByServiceOrder } from "@/lib/services";
import { FOUNDER, SITE, absoluteUrl } from "@/lib/site";
import {
  getPage,
  getPosts,
  getProjects,
  getServices,
  safe,
} from "@/lib/wordpress";
import { itemPath, type RoutedType } from "@/lib/wordpress/content-types";

export const revalidate = 3600;

/** One item as a "### Title" section with its source URL and full text. */
function section(
  type: RoutedType,
  item: { title: string; slug: string; content: string; excerpt: string },
  extra: string[] = [],
) {
  return [
    `### ${item.title}`,
    `Source: ${absoluteUrl(itemPath(type, item.slug))}`,
    ...extra,
    "",
    htmlToMarkdown(item.content || item.excerpt, 3, SITE.url),
    "",
  ];
}

export async function GET() {
  const [about, services, projects, posts] = await Promise.all([
    getPage("about").catch(() => undefined),
    safe(getServices),
    safe(getProjects),
    safe(getPosts),
  ]);

  const lines = [
    `# ${SITE.name}`,
    "",
    ...introLines(),
    "",
    `This is the full text of ${SITE.url}. A shorter summary with links is at ${absoluteUrl("/llms.txt")}.`,
    "",
  ];

  if (about?.content)
    lines.push(
      "## About",
      `Source: ${absoluteUrl("/about")}`,
      "",
      htmlToMarkdown(about.content, 2, SITE.url),
      "",
    );

  lines.push(...pricingLines(), "", ...faqLines(), "", "## Services", "");
  for (const s of sortByServiceOrder(services))
    lines.push(...section("service", s));

  lines.push("## Projects", "");
  for (const p of newestFirst(projects)) lines.push(...section("project", p));

  lines.push("## Articles", "");
  for (const p of newestFirst(posts))
    lines.push(
      ...section("post", p, [
        `Published: ${formatDate(p.date)}. Author: ${FOUNDER.name}.`,
      ]),
    );

  return textResponse(lines);
}
