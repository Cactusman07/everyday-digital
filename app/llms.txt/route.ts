// /llms.txt — a plain-text summary of the site for generative engines, in the
// emerging llms.txt convention (https://llmstxt.org). Generated from lib/site.ts
// so it can never drift from the published offer.

import {
  SITE,
  FOCUS_AREAS,
  PACKAGES,
  HOSTING,
  CASE_STUDIES,
  FAQ,
} from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
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
    `Pricing model: fixed-price packages, otherwise $${SITE.hourlyRate}/hour or quoted per project. No retainers.`,
  );
  lines.push("");
  lines.push("## Services");
  for (const f of FOCUS_AREAS) {
    lines.push(`- ${f.title}: ${f.body} (${SITE.url}${f.href})`);
  }
  lines.push("");
  lines.push("## Packages (NZD, excluding GST)");
  for (const p of PACKAGES) {
    lines.push(
      `- ${p.name} — ${p.priceLabel}: ${p.tagline} Includes: ${p.includes.join("; ")}.${p.fineprint ? " " + p.fineprint : ""}`,
    );
  }
  lines.push(
    `- Hosting — shared $${HOSTING.shared.monthly}/month or $${HOSTING.shared.annual}/year; private from $${HOSTING.private.from}/month. Includes ${HOSTING.includes.join(", ").toLowerCase()}.`,
  );
  lines.push("");
  lines.push("## Selected work");
  for (const c of CASE_STUDIES) {
    lines.push(
      `- ${c.client} (${c.sector}): ${c.summary} Built with ${c.stack.join(", ")}. ${SITE.url}/projects/${c.slug}/`,
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
  lines.push(`- Projects: ${SITE.url}/projects/`);
  lines.push(`- Contact: ${SITE.url}/contact/`);
  lines.push(`- Sitemap: ${SITE.url}/sitemap.xml`);

  return new Response(lines.join("\n") + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
