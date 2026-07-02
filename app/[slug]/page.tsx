import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getPages,
  getProjects,
  getTeams,
  getServices,
  getPosts,
  getTestimonials,
} from "@/lib/wordpress";
import PageContent from "@/components/PageContent";

// Next.js 16 passes route params as a Promise (async dynamic APIs).
// For a URL like /about, params resolves to { slug: "about" }.
interface PageProps {
  params: Promise<{ slug: string }>;
}

// generateStaticParams — tells Next.js which [slug] values to pre-render at build time (SSG).
// At build, Next.js calls this, gets all WordPress page slugs, and generates static HTML
// for each one. Pages not listed here are still rendered on-demand (ISR) when first visited.
export async function generateStaticParams() {
  try {
    const pages = await getPages();
    return pages
      .filter((p) => !p.isFrontPage)
      .map((p) => ({
        slug: p.uri.replace(/^\/|\/$/g, ""),
      }));
  } catch {
    return [];
  }
}

// generateMetadata — Next.js calls this to set per-page <head> tags (title, description, OG).
// Because the root layout has title.template: "%s | Every Day Digital", returning
// { title: "About" } here produces <title>About | Every Day Digital</title>.
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const pages = await getPages();
    const page = pages.find(
      (p) => p.uri === `/${slug}/` || p.uri === `/${slug}`,
    );
    if (!page) return {};
    return {
      title: page.title,
    };
  } catch {
    return {};
  }
}

// This is a Server Component (no "use client") — it runs on the server, fetches all
// content types in parallel via Promise.all, and returns fully rendered HTML to the browser.
// The browser never sees the GraphQL queries or WordPress credentials.
export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  let pages, projects, teams, services, posts, testimonials;
  try {
    [pages, projects, teams, services, posts, testimonials] = await Promise.all(
      [getPages(), getProjects(), getTeams(), getServices(), getPosts(), getTestimonials()],
    );
  } catch {
    notFound();
  }

  const page = pages.find(
    (p) => p.uri === `/${slug}/` || p.uri === `/${slug}`,
  );
  // notFound() triggers the app/not-found.tsx page with a 404 status code
  if (!page) notFound();

  return (
    <PageContent
      content={page.content}
      featuredImage={page.featuredImage}
      title={page.title}
      projects={projects}
      team={teams}
      services={services}
      posts={posts}
      testimonials={testimonials}
    />
  );
}
