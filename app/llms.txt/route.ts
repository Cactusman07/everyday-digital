// /llms.txt — a plain-text summary of the site for generative engines, in the
// emerging llms.txt convention (https://llmstxt.org). Generated from lib/site.ts
// so it can never drift from the published offer.

import { getPosts, getProjects, safe } from "@/lib/wordpress";
import { excerptText, stripHtml } from "@/lib/content";
import {
  SITE,
  PRICING,
  SERVICES,
  HOSTING,
  CASE_STUDIES,
  FAQ,
} from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const lines: string[] = [];
  lines.push(`# ${SITE.name}`);
  lines.push("");
  lines.push(`> ${SITE.description}`);
  lines.push("");
  lines.push(
    `Location: ${SITE.city}, New Zealand. Works with businesses NZ-wide.`,
  );
  lines.push(
    `Founder: ${SITE.founder}. Contact: ${SITE.email}, ${SITE.phone}.`,
  );
  lines.push(
    `Pricing model: ${PRICING.line} ${PRICING.rest} We specialise in WordPress and Shopify.`,
  );
  lines.push("");
  lines.push("## Services");
  for (const sv of SERVICES) {
    lines.push(
      `- ${sv.title}: ${sv.summary} (${SITE.url}/services/${sv.slug}/)`,
    );
  }
  lines.push("");
  lines.push("## Pricing (NZD, excluding GST)");
  lines.push(`- ${PRICING.line}`);
  lines.push(`- ${PRICING.rest}`);
  lines.push(
    `- Website hosting: $${HOSTING.shared.monthly}/month or $${HOSTING.shared.annual}/year (two months free). ${HOSTING.support}`,
  );
  lines.push(`- eCommerce hosting: $${HOSTING.ecommerce.monthly}/month.`);
  lines.push("");
  lines.push("## Selected work");
  for (const c of CASE_STUDIES) {
    lines.push(
      `- ${c.client} (${c.sector}): ${c.summary} Built with ${c.stack.join(", ")}. ${SITE.url}/projects/${c.slug}`,
    );
  }
  lines.push("");
  const [posts, projects] = await Promise.all([
    safe(getPosts),
    safe(getProjects),
  ]);
  lines.push("## Latest articles");
  for (const p of [...posts]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 12)) {
    lines.push(
      `- [${stripHtml(p.title)}](${SITE.url}/blog/${p.slug}) (${p.date.slice(0, 10)}): ${excerptText(p.excerpt || p.content, 200)}`,
    );
  }
  lines.push("");
  lines.push("## All projects");
  for (const p of projects) {
    lines.push(
      `- [${stripHtml(p.title)}](${SITE.url}/projects/${p.slug}): ${excerptText(p.excerpt || p.content, 160)}`,
    );
  }
  lines.push("");
  lines.push("## Frequently asked questions");
  for (const f of FAQ) {
    lines.push(`- Q: ${f.q}`);
    lines.push(`  A: ${f.a}`);
  }
  lines.push("");
  lines.push("## Links");
  lines.push(`- Home: ${SITE.url}/`);
  lines.push(`- Pricing: ${SITE.url}/#pricing`);
  lines.push(`- Services: ${SITE.url}/services`);
  lines.push(`- Projects: ${SITE.url}/projects`);
  lines.push(`- Blog: ${SITE.url}/blog`);
  lines.push(`- RSS feed: ${SITE.url}/feed.xml`);
  lines.push(`- Contact: ${SITE.url}/contact`);
  lines.push(`- Sitemap: ${SITE.url}/sitemap.xml`);

  return new Response(lines.join("\n") + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
