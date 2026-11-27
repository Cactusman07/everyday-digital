// RSS feed of blog posts and projects, newest first.
// Feed readers, news aggregators, AI tools and social scheduling tools
// (Buffer, Make, Zapier, LinkedIn newsletters) can all watch this to pick up
// new content automatically.

import { getPosts, getProjects, safe } from "@/lib/wordpress";
import { excerptText, stripHtml } from "@/lib/content";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function GET() {
  const [posts, projects] = await Promise.all([
    safe(getPosts),
    safe(getProjects),
  ]);

  const items = [
    ...posts.map((p) => ({
      title: p.title,
      url: `${SITE.url}/blog/${p.slug}`,
      date: p.date,
      text: p.excerpt || p.content,
      category: "Blog",
      image: p.featuredImage?.node?.sourceUrl,
    })),
    ...projects.map((p) => ({
      title: p.title,
      url: `${SITE.url}/projects/${p.slug}`,
      date: p.date ?? "",
      text: p.excerpt || p.content,
      category: "Projects",
      image: p.featuredImage?.node?.sourceUrl,
    })),
  ]
    .filter((i) => i.date)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
<title>${esc(SITE.name)}</title>
<link>${SITE.url}</link>
<description>${esc("The latest digital trends, news and project updates from Every Day Digital — websites, online stores, AI search and automation for New Zealand businesses.")}</description>
<language>en-NZ</language>
<atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (i) => `<item>
<title>${esc(stripHtml(i.title))}</title>
<link>${i.url}</link>
<guid isPermaLink="true">${i.url}</guid>
<pubDate>${new Date(i.date).toUTCString()}</pubDate>
<category>${i.category}</category>
<description>${esc(excerptText(i.text, 300))}</description>${i.image ? `\n<media:content url="${esc(i.image)}" medium="image"/>` : ""}
</item>`,
  )
  .join("\n")}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
