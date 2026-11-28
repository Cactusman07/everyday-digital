// Structured data for a WordPress page: breadcrumbs, plus what the page is —
// the blog, a list of projects or services, the about or contact page, or a
// plain web page (schema type from lib/pages.ts).

import type { PageListingData } from "@/components/pages/WordPressPage";
import { newestFirst, publishedAt } from "@/lib/dates";
import { metaDescription } from "@/lib/html";
import type { PageConfig } from "@/lib/pages";
import { absoluteUrl } from "@/lib/site";
import { itemPath } from "@/lib/wordpress/content-types";
import {
  BlogJsonLd,
  BreadcrumbJsonLd,
  WebPageJsonLd,
  offerCatalog,
} from "./JsonLd";

export default function PageJsonLd({
  path,
  title,
  content,
  config,
  listing,
}: {
  path: string;
  title: string;
  content: string;
  config: PageConfig;
  listing?: PageListingData;
}) {
  const name = title;
  const description =
    config.seo?.description ?? (metaDescription({ content }) || undefined);
  const page = { path, name, description };

  let schema;
  if (listing?.kind === "posts") {
    schema = (
      <BlogJsonLd
        description={description}
        posts={newestFirst(listing.items).map((p) => ({
          title: p.title,
          url: itemPath("post", p.slug),
          date: publishedAt(p),
          image: p.featuredImage?.node.sourceUrl,
        }))}
      />
    );
  } else if (listing?.kind === "projects") {
    schema = (
      <WebPageJsonLd
        type="CollectionPage"
        {...page}
        mainEntity={{
          "@type": "ItemList",
          itemListElement: listing.items.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.title,
            url: absoluteUrl(itemPath("project", p.slug)),
          })),
        }}
      />
    );
  } else if (listing?.kind === "services") {
    schema = (
      <WebPageJsonLd
        type="CollectionPage"
        {...page}
        mainEntity={offerCatalog()}
      />
    );
  } else {
    schema = <WebPageJsonLd type={config.schemaType ?? "WebPage"} {...page} />;
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name, url: path },
        ]}
      />
      {schema}
    </>
  );
}
