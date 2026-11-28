// The three WordPress detail routes — /blog/<slug>, /projects/<slug> and
// /services/<slug> — share one shape: pre-render every slug, build metadata
// from the item, load the item (or 404) for the page, and draw a share image.
// defineDetailRoute() implements that once; each route only says what's
// different. The page and opengraph-image files re-export these functions.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCaseStudy } from "./case-studies";
import { gmt, publishedAt } from "./dates";
import { metaDescription } from "./html";
import { ogImage } from "./og";
import { pageMetadata, type PageMetaInput } from "./seo";
import { getServiceMeta } from "./services";
import { SITE, absoluteUrl } from "./site";
import {
  getPosts,
  getProjects,
  getServices,
  getTestimonials,
  postTags,
  safe,
  type WPEntry,
} from "./wordpress";
import {
  itemPath,
  sectionOf,
  type RoutedType,
} from "./wordpress/content-types";

/** The props Next.js passes a `[slug]` page, metadata or image function. */
export interface SlugParams {
  params: Promise<{ slug: string }>;
}

interface DetailRouteOptions<T extends WPEntry> {
  type: RoutedType;
  /** Fetches every item of this type. */
  getAll: () => Promise<T[]>;
  /**
   * Page metadata for one item. `path` and the default share image (the
   * generated card at `<path>/opengraph-image`) are filled in already.
   */
  metadata: (
    item: T,
    defaults: { path: string; image: string },
  ) => PageMetaInput;
  /** Accent colour for the generated share card; default is per-title. */
  shareColour?: (item: T) => string | undefined;
}

function defineDetailRoute<T extends WPEntry>({
  type,
  getAll,
  metadata,
  shareColour,
}: DetailRouteOptions<T>) {
  const section = sectionOf(type);
  const find = (items: T[], slug: string) => items.find((i) => i.slug === slug);
  /** Page metadata input for one item, with its path and default share card. */
  const metaFor = (item: T) => {
    const path = itemPath(type, item.slug);
    return metadata(item, { path, image: `${path}/opengraph-image` });
  };

  return {
    /** Pre-renders every slug at build time; new ones render on first visit. */
    async generateStaticParams() {
      return (await safe(getAll)).map((i) => ({ slug: i.slug }));
    },

    async generateMetadata({ params }: SlugParams): Promise<Metadata> {
      const { slug } = await params;
      const item = find(await safe(getAll), slug);
      return item ? pageMetadata(metaFor(item)) : {};
    },

    /**
     * Loads one item plus its siblings and the testimonials, or 404s when the
     * slug doesn't exist. A WordPress outage throws instead of 404ing, so
     * Next.js keeps serving the last good version of the page. `meta` is the
     * same description, share image and dates the page's metadata uses, for
     * its structured data.
     */
    async load({ params }: SlugParams) {
      const { slug } = await params;
      const [items, testimonials] = await Promise.all([
        getAll(),
        safe(getTestimonials),
      ]);
      const item = find(items, slug);
      if (!item) notFound();
      const meta = metaFor(item);
      const url = absoluteUrl(meta.path);
      return { item, items, testimonials, meta, path: meta.path, url };
    },

    /** The share card for one item: its title on a gradient. */
    async ogImage({ params }: SlugParams) {
      const { slug } = await params;
      const item = find(await safe(getAll), slug);
      return ogImage({
        title: item?.title ?? SITE.name,
        kicker: `${section.kicker} · ${SITE.name}`,
        colour: item && shareColour?.(item),
      });
    },
  };
}

export const postRoute = defineDetailRoute({
  type: "post",
  getAll: getPosts,
  metadata: (post, { path, image }) => ({
    title: post.title,
    description: metaDescription(post),
    path,
    image: post.featuredImage?.node.sourceUrl ?? image,
    article: {
      publishedTime: publishedAt(post),
      modifiedTime: gmt(post.modifiedGmt),
      section: sectionOf("post").label,
      tags: postTags(post),
    },
  }),
});

export const projectRoute = defineDetailRoute({
  type: "project",
  getAll: getProjects,
  metadata: (project, { path, image }) => {
    const caseStudy = getCaseStudy(project.slug);
    return {
      title: caseStudy
        ? `${caseStudy.client} — ${caseStudy.sector} case study`
        : project.title,
      description: caseStudy?.summary ?? metaDescription(project),
      path,
      image: project.featuredImage?.node.sourceUrl ?? image,
      article: {
        publishedTime: gmt(project.dateGmt),
        modifiedTime: gmt(project.modifiedGmt),
        section: sectionOf("project").label,
      },
    };
  },
});

export const serviceRoute = defineDetailRoute({
  type: "service",
  getAll: getServices,
  // Always the generated card: WordPress service images are square icons.
  metadata: (service, { path, image }) => ({
    title: service.title,
    description: metaDescription(service),
    path,
    image,
  }),
  shareColour: (service) => getServiceMeta(service.slug)?.colour,
});
