// Turning WordPress HTML into the plain text and Markdown the site needs:
// excerpts, reading time, an "On this page" contents list, and the Markdown
// for /llms-full.txt. Pure functions, no WordPress access.

const NAMED_ENTITIES: [RegExp, string][] = [
  [/&nbsp;/g, " "],
  [/&amp;/g, "&"],
  [/&#0?39;|&#8217;|&rsquo;/g, "’"],
  [/&#8216;|&lsquo;/g, "‘"],
  [/&#8220;|&ldquo;/g, "“"],
  [/&#8221;|&rdquo;/g, "”"],
  [/&#8211;|&ndash;/g, "–"],
  [/&#8212;|&mdash;/g, "—"],
  [/&#8230;|&hellip;/g, "…"],
  [/&quot;/g, '"'],
  [/&lt;/g, "<"],
  [/&gt;/g, ">"],
];

/** Decodes the HTML entities WordPress emits, plus any numeric `&#123;`. */
export function decodeEntities(s: string): string {
  return NAMED_ENTITIES.reduce(
    (out, [re, ch]) => out.replace(re, ch),
    s,
  ).replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

/** HTML → single-line plain text, with scripts and styles dropped. */
export function stripHtml(html = ""): string {
  return decodeEntities(
    html
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]*>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

/** Length of a search-result meta description. */
const META_DESCRIPTION_LENGTH = 158;

/**
 * Plain-text excerpt of at most `max` characters, cut at a word boundary and
 * finished with an ellipsis when shortened.
 */
export function excerptText(html = "", max = 160): string {
  const text = stripHtml(html);
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return (
    (space > 0 ? cut.slice(0, space) : cut).replace(/[,.;:–—-]+$/, "") + "…"
  );
}

/**
 * Plain-text summary of a WordPress item: its hand-written excerpt if it has
 * one, otherwise the start of its content.
 */
export function excerptOf(
  item: { excerpt?: string; content?: string },
  max = META_DESCRIPTION_LENGTH,
) {
  return excerptText(item.excerpt || item.content, max);
}

/** An item's summary at search-result length, for meta descriptions. */
export const metaDescription = (item: { excerpt?: string; content?: string }) =>
  excerptOf(item);

/** Number of words in an HTML fragment's text. */
export function wordCount(html = ""): number {
  return stripHtml(html).split(" ").filter(Boolean).length;
}

/** Minutes to read at 220 words a minute, never less than 1. */
export function readingMinutes(html = ""): number {
  return Math.max(1, Math.round(wordCount(html) / 220));
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "section";

/**
 * Gives every h2/h3 a unique id (so it can be linked to) and returns the
 * headings as a contents list. Ids come from the heading text; WordPress ids
 * never reach here because sanitising strips them.
 */
export function withHeadingIds(html = ""): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const out = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level: string, attrs: string, inner: string) => {
      const text = stripHtml(inner);
      if (!text) return match;
      let id = slugify(text);
      while (used.has(id)) id += "-2";
      used.add(id);
      toc.push({ id, text, level: Number(level) as 2 | 3 });
      return `<h${level} id="${id}"${attrs}>${inner}</h${level}>`;
    },
  );
  return { html: out, toc };
}

/**
 * WordPress HTML as plain Markdown, for /llms-full.txt. Keeps headings,
 * lists, links, bold and italics; drops images, scripts and layout markup.
 *
 * @param headingOffset - Levels to push headings down, so they nest under the
 *   file's own headings.
 * @param base - Prefixed to links that start with "/".
 */
export function htmlToMarkdown(html = "", headingOffset = 0, base = "") {
  const inline = (t: string) => stripHtml(t);
  const wrap = (mark: string) => (_: string, __: string, t: string) =>
    inline(t) ? `${mark}${inline(t)}${mark}` : "";

  const markdown = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi,
      (_, href: string, t: string) =>
        inline(t)
          ? `[${inline(t)}](${href.startsWith("/") ? base + href : href})`
          : "",
    )
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, wrap("**"))
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, wrap("_"))
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(
      /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi,
      (_, n: string, t: string) =>
        `\n\n${"#".repeat(Math.min(6, Number(n) + headingOffset))} ${inline(t)}\n\n`,
    )
    .replace(
      /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
      (_, t: string) => `\n\n> ${inline(t)}\n\n`,
    )
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/(p|div|ul|ol|figure|figcaption|table|section)>/gi, "\n\n")
    .replace(/<\/(td|th)>/gi, " | ")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<[^>]+>/g, "");

  return decodeEntities(markdown)
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
