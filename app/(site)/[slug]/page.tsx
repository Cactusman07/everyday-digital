// Top-level WordPress pages: /about, /services, /projects, /blog, /contact,
// /terms and any page added in WordPress later. lib/pages.ts decides what
// each page shows around its WordPress content.

import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import WordPressPage, {
  type PageListingData,
} from "@/components/pages/WordPressPage";
import PageJsonLd from "@/components/seo/PageJsonLd";
import { metaDescription } from "@/lib/html";
import { getPageConfig, type PageListing } from "@/lib/pages";
import { editorSeo, pageMetadata } from "@/lib/seo";
import type { SlugParams } from "@/lib/detail-routes";
import {
  getPage,
  getPages,
  getPosts,
  getProjects,
  getServices,
  getTeam,
  getTestimonials,
  pageSlug,
  safe,
} from "@/lib/wordpress";
import { itemPath, type RoutedType } from "@/lib/wordpress/content-types";

/** Fetches the one list a page shows, so other pages don't pay for it. */
async function fetchListing(
  kind: PageListing | undefined,
): Promise<PageListingData | undefined> {
  switch (kind) {
    case "services":
      return { kind, items: await getServices() };
    case "projects":
      return { kind, items: await getProjects() };
    case "posts":
      return { kind, items: await getPosts() };
    case "team":
      return { kind, items: await getTeam() };
    default:
      return undefined;
  }
}

/**
 * Old WordPress links put posts, projects and services at the top level
 * (/my-post/). Finds where such a slug lives now, so it can redirect.
 */
async function movedTo(slug: string): Promise<string | undefined> {
  const sources: [RoutedType, () => Promise<{ slug: string }[]>][] = [
    ["post", getPosts],
    ["project", getProjects],
    ["service", getServices],
  ];
  const found = await Promise.all(
    sources.map(async ([type, getAll]) =>
      (await safe(getAll)).some((i) => i.slug === slug) ? type : undefined,
    ),
  );
  const type = found.find(Boolean);
  return type && itemPath(type, slug);
}

/** Pre-renders every WordPress page; new ones render on first visit. */
export async function generateStaticParams() {
  return (await safe(getPages))
    .filter((p) => !p.isFrontPage)
    .map((p) => ({ slug: pageSlug(p) }));
}

export async function generateMetadata({
  params,
}: SlugParams): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug).catch(() => undefined);
  if (!page) return {};
  const { seo } = getPageConfig(slug);
  const editor = editorSeo(page);
  return pageMetadata({
    title: editor.title ?? seo?.title ?? page.title,
    description:
      editor.description ?? seo?.description ?? metaDescription(page),
    path: `/${slug}`,
  });
}

export default async function Page({ params }: SlugParams) {
  const { slug } = await params;
  // A WordPress outage throws here (rather than 404ing) so Next.js keeps
  // serving the last good version of the page.
  const page = await getPage(slug);
  if (!page) {
    const to = await movedTo(slug);
    if (to) permanentRedirect(to);
    notFound();
  }

  const config = getPageConfig(slug);
  const [listing, testimonials] = await Promise.all([
    fetchListing(config.listing),
    safe(getTestimonials),
  ]);

  return (
    <>
      <PageJsonLd
        path={`/${slug}`}
        title={page.title}
        content={page.content}
        config={config}
        listing={listing}
      />
      <WordPressPage
        page={page}
        config={config}
        listing={listing}
        testimonials={testimonials}
      />
    </>
  );
}
