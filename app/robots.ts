import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://everydaydigital.co.nz";

// Next.js Robots API — exporting a default function from app/robots.ts automatically
// generates /robots.txt. This tells search engine crawlers which paths they can index.
// We allow everything except the WordPress admin and uploads directories.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/wp-admin/", "/wp-content/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
