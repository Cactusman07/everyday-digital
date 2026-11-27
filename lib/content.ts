// Small helpers for presenting WordPress content: plain text, reading time,
// dates, a contents list built from headings, and testimonial parsing.

import { CASE_STUDIES } from "./site";
import type { WPTestimonial } from "./types";

export function decodeEntities(s: string) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;|&#8217;|&rsquo;/g, "’")
    .replace(/&#8216;|&lsquo;/g, "‘")
    .replace(/&#8220;|&ldquo;/g, "“")
    .replace(/&#8221;|&rdquo;/g, "”")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&#8230;|&hellip;/g, "…")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

export function stripHtml(html = "") {
  return decodeEntities(
    html
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]*>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

export function excerptText(html = "", max = 160) {
  const text = stripHtml(html);
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return (
    (space > 0 ? cut.slice(0, space) : cut).replace(/[,.;:–—-]+$/, "") + "…"
  );
}

// Minutes to read at 220 words a minute, never less than 1
export function readingMinutes(html = "") {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&[a-z#0-9]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "section";

// Gives every h2/h3 in the content an id (so it can be linked to) and returns
// the list of headings for an "On this page" contents list.
export function withHeadingIds(html = ""): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const out = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, lvl: string, attrs: string, inner: string) => {
      const text = stripHtml(inner);
      if (!text) return match;
      let id = /\sid="([^"]+)"/.exec(attrs)?.[1] ?? slugify(text);
      while (used.has(id)) id += "-2";
      used.add(id);
      toc.push({ id, text, level: Number(lvl) as 2 | 3 });
      const cleanAttrs = attrs.replace(/\sid="[^"]*"/, "");
      return `<h${lvl} id="${id}"${cleanAttrs}>${inner}</h${lvl}>`;
    },
  );
  return { html: out, toc };
}

export interface Testimonial {
  name: string;
  company: string;
  initials: string;
  lead: string;
  rest: string[];
  url?: string;
  caseStudy?: string;
}

// WordPress testimonial titles look like "David Kerr - NZ In Pictures". The
// body sometimes ends with a signature block (name, company, web address),
// which is dropped because the name and company are shown as a header.
export function parseTestimonial(t: WPTestimonial): Testimonial {
  const [name, ...companyParts] = t.title.split(/\s+[-–—]\s+/);
  const company = companyParts.join(" – ");
  const paras = (t.content.match(/<p[^>]*>[\s\S]*?<\/p>/gi) ?? [t.content])
    .map((p) => stripHtml(p))
    .filter(Boolean)
    .filter(
      (p) =>
        !(
          !!name.trim() &&
          p.includes(name.trim()) &&
          (/www\.|\.co\.nz|\.com/.test(p) || p.length < 80)
        ),
    );
  const text = paras.join(" ");
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [text];
  const lead = sentences[0].trim();
  const rest = paras.length
    ? [text.slice(sentences[0].length).trim()].filter(Boolean)
    : [];
  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const site = /(?:www\.)?[a-z0-9-]+\.(?:co\.nz|com|nz)/i.exec(t.content)?.[0];
  const cs = CASE_STUDIES.find(
    (c) => company && c.client.toLowerCase() === company.toLowerCase(),
  );
  return {
    name: name.trim(),
    company,
    initials:
      initials.length === 1 ? name.trim().slice(0, 2).toUpperCase() : initials,
    lead,
    rest,
    url:
      cs?.url ?? (site ? `https://${site.replace(/^www\./, "")}` : undefined),
    caseStudy: cs ? `/projects/${cs.slug}` : undefined,
  };
}
