import type { MetadataRoute } from "next";
import { getPages, getPosts, getProjects, getServices } from "@/lib/wordpress";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://everydaydigital.co.nz";

// Next.js Sitemap API — exporting a default function from app/sitemap.ts automatically
// generates /sitemap.xml. Search engines use this to discover all pages on the site.
// This fetches all content from WordPress and builds the sitemap dynamically.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  try {
    const [pages, posts, projects, services] = await Promise.all([
      getPages(),
      getPosts(),
      getProjects(),
      getServices(),
    ]);

    for (const page of pages) {
      if (page.isFrontPage) continue;
      const slug = page.uri.replace(/^\/|\/$/g, "");
      entries.push({
        url: `${SITE_URL}/${slug}`,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.date ? new Date(post.date) : undefined,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    for (const project of projects) {
      entries.push({
        url: `${SITE_URL}/projects/${project.slug}`,
        lastModified: project.date ? new Date(project.date) : undefined,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    for (const service of services) {
      entries.push({
        url: `${SITE_URL}/services/${service.slug}`,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch {
    // WordPress may not be available during build
  }

  return entries;
}
