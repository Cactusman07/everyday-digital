// WordPress content is authored by trusted editors, but it is rendered with
// dangerouslySetInnerHTML. Sanitising once, where content leaves WordPress
// (./index.ts), means every render site gets safe HTML without having to
// remember to. `id` attributes are stripped; heading ids for the
// contents list are added afterwards by withHeadingIds() in lib/html.ts.
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
