// RSS feed of blog posts and projects, newest first. Feed readers, AI tools
// and social schedulers (Buffer, Make, Zapier, LinkedIn newsletters) can watch
// this to pick up new content automatically.

import { newestFirst, publishedAt } from "@/lib/dates";
import { excerptText } from "@/lib/html";
import { SITE, absoluteUrl } from "@/lib/site";
import {
  getPosts,
  getProjects,
  safe,
  type WPPost,
  type WPProject,
} from "@/lib/wordpress";
import {
  itemPath,
  sectionOf,
  type RoutedType,
} from "@/lib/wordpress/content-types";

export const revalidate = 3600;

const FEED_DESCRIPTION = `The latest digital trends, news and project updates from ${SITE.name} — websites, online stores, AI search and automation for New Zealand businesses.`;

/** Escapes text for XML element content and attribute values. */
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

interface FeedItem {
  title: string;
  url: string;
  date: string;
  text: string;
  category: string;
  image?: string;
}

function toItems(type: RoutedType, items: (WPPost | WPProject)[]): FeedItem[] {
  return items.map((i) => ({
    title: i.title,
    url: absoluteUrl(itemPath(type, i.slug)),
    date: publishedAt(i),
    text: i.excerpt || i.content,
    category: sectionOf(type).label,
    image: i.featuredImage?.node.sourceUrl,
  }));
}

function itemXml(i: FeedItem) {
  const media = i.image
    ? `\n<media:content url="${esc(i.image)}" medium="image"/>`
    : "";
  return `<item>
<title>${esc(i.title)}</title>
<link>${i.url}</link>
<guid isPermaLink="true">${i.url}</guid>
<pubDate>${new Date(i.date).toUTCString()}</pubDate>
<category>${i.category}</category>
<description>${esc(excerptText(i.text, 300))}</description>${media}
</item>`;
}

export async function GET() {
  const [posts, projects] = await Promise.all([
    safe(getPosts),
    safe(getProjects),
  ]);
  const items = newestFirst([
    ...toItems("post", posts),
    ...toItems("project", projects),
  ]).filter((i) => i.date);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
<title>${esc(SITE.name)}</title>
<link>${SITE.url}</link>
<description>${esc(FEED_DESCRIPTION)}</description>
<language>en-NZ</language>
<atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml"/>
${items.map(itemXml).join("\n")}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
