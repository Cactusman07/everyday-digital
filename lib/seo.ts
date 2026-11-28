// Shared page metadata. A page's `openGraph` object replaces the root
// layout's rather than merging with it, so every page builds its metadata
// here to keep the site name, locale, type and a share image.

import type { Metadata } from "next";
import { FOUNDER, SITE, absoluteUrl } from "./site";

const DEFAULT_OG_IMAGE = "/opengraph-image";

/** Share card size, used by every generated Open Graph image. */
export const OG_SIZE = { width: 1200, height: 630 };

/** Alt text for the site-wide share card. */
export const DEFAULT_OG_ALT = `${SITE.name} — ${SITE.tagline}`;
export const OG_LOCALE = "en_NZ";

export interface PageMetaInput {
  title: string;
  description?: string;
  /** "/" or "/blog/slug", no trailing slash. Becomes the canonical URL. */
  path: string;
  /** Absolute or site-relative; defaults to the branded share card. */
  image?: string;
  /** Open Graph title, when it should differ from the <title>. */
  shareTitle?: string;
  shareDescription?: string;
  /** Marks the page as an Open Graph article. */
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
  noindex?: boolean;
}

/** Next.js metadata for a page: title, description, canonical and share card. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  shareTitle,
  shareDescription,
  article,
  noindex,
}: PageMetaInput): Metadata {
  const base = {
    title: shareTitle ?? title,
    description: shareDescription ?? description,
    url: path,
    siteName: SITE.name,
    locale: OG_LOCALE,
    images: [
      image
        ? { url: image, alt: shareTitle ?? title }
        : {
            url: DEFAULT_OG_IMAGE,
            ...OG_SIZE,
            alt: DEFAULT_OG_ALT,
          },
    ],
  };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: article
      ? {
          ...base,
          type: "article",
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime,
          authors: [absoluteUrl(FOUNDER.profilePath)],
          section: article.section,
          tags: article.tags,
        }
      : { ...base, type: "website" },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
