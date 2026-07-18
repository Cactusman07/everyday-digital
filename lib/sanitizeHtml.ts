// WordPress content is authored by trusted editors, but is still rendered via
// dangerouslySetInnerHTML across the site (PageContent, GeneralContentRenderer,
// SingleItemContent, DetailPanel, Testimonials). Sanitizing once here — right
// where content leaves WordPress — means every current and future render site
// gets safe HTML for free, instead of each component having to remember to.
import sanitizeHtml from "sanitize-html";

const options: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "br",
    "hr",
    "a",
    "ul",
    "ol",
    "li",
    "b",
    "i",
    "strong",
    "em",
    "u",
    "s",
    "blockquote",
    "code",
    "pre",
    "span",
    "div",
    "img",
    "figure",
    "figcaption",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel", "class"],
    img: ["src", "alt", "width", "height", "class", "loading"],
    "*": ["class"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
};

export function sanitize(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html, options);
}
