// /sitemap.xml, built from WordPress content. Every entry carries the date it
// last changed (listing pages take their newest item's date) and the main
// image, which is what Google and Bing use. changefreq and priority are left
// out because both ignore them.

import type { MetadataRoute } from "next";
import { gmt, latest } from "@/lib/dates";
import { absoluteUrl } from "@/lib/site";
import {
  getPages,
  getPosts,
  getProjects,
  getServices,
  pageSlug,
  type WPEntry,
} from "@/lib/wordpress";
import {
  itemPath,
  sectionOf,
  type RoutedType,
} from "@/lib/wordpress/content-types";

const images = (url?: string) => (url ? [url] : undefined);

/** Entries for one routed type, plus the date the newest of them changed. */
function entriesFor(
  type: RoutedType,
  items: (WPEntry & { dateGmt?: string })[],
) {
  const entries = items.map((item) => ({
    url: absoluteUrl(itemPath(type, item.slug)),
    lastModified: gmt(item.modifiedGmt) ?? gmt(item.dateGmt),
    images: images(item.featuredImage?.node.sourceUrl),
  }));
  return {
    path: sectionOf(type).path,
    entries,
    newest: latest(entries.map((e) => e.lastModified)),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [pages, posts, projects, services] = await Promise.all([
      getPages(),
      getPosts(),
      getProjects(),
      getServices(),
    ]);
    const sections = [
      entriesFor("post", posts),
      entriesFor("project", projects),
      entriesFor("service", services),
    ];
    /** The newest change listed on a page, if the page is a section index. */
    const newestIn = (path: string) =>
      sections.find((s) => s.path === path)?.newest;

    return [
      {
        url: absoluteUrl("/"),
        lastModified: latest(sections.map((s) => s.newest)),
      },
      // A listing page changed when it, or anything listed on it, changed
      ...pages
        .filter((p) => !p.isFrontPage)
        .map((p) => {
          const path = `/${pageSlug(p)}`;
          return {
            url: absoluteUrl(path),
            lastModified: latest([gmt(p.modifiedGmt), newestIn(path)]),
          };
        }),
      ...sections.flatMap((s) => s.entries),
    ];
  } catch {
    // WordPress may not be reachable during a build
    return [{ url: absoluteUrl("/") }];
  }
}
