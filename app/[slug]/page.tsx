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
import type { WPProject, WPTeam, WPService, WPPost } from "@/lib/types";
import PageContent from "@/components/PageContent";

// PageContent.tsx only renders one of projects/team/services/posts per page,
// picked by the WordPress page's title (Testimonials render on every page).
// This mirrors those same title checks so we only fetch the one dataset a
// given page actually needs, instead of all four on every single page load.
// Keep in sync with the title checks in PageContent.tsx.
type SecondaryContentType = "projects" | "team" | "posts" | "services" | null;

function getSecondaryContentType(title: string): SecondaryContentType {
  if (title === "Projects") return "projects";
  if (title.toLowerCase().includes("about")) return "team";
  if (title === "Blog") return "posts";
  if (title === "Services") return "services";
  return null;
}

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

  let pages;
  try {
    pages = await getPages();
  } catch {
    notFound();
  }

  const page = pages.find((p) => p.uri === `/${slug}/` || p.uri === `/${slug}`);
  // notFound() triggers the app/not-found.tsx page with a 404 status code
  if (!page) notFound();

  const secondaryType = getSecondaryContentType(page.title);

  let projects: WPProject[] = [];
  let team: WPTeam[] = [];
  let services: WPService[] = [];
  let posts: WPPost[] = [];
  let testimonials;

  try {
    // Testimonials are needed everywhere; the secondary dataset (if any) is
    // fetched alongside it in parallel, never all four at once.
    if (secondaryType === "projects") {
      [testimonials, projects] = await Promise.all([
        getTestimonials(),
        getProjects(),
      ]);
    } else if (secondaryType === "team") {
      [testimonials, team] = await Promise.all([getTestimonials(), getTeams()]);
    } else if (secondaryType === "posts") {
      [testimonials, posts] = await Promise.all([
        getTestimonials(),
        getPosts(),
      ]);
    } else if (secondaryType === "services") {
      [testimonials, services] = await Promise.all([
        getTestimonials(),
        getServices(),
      ]);
    } else {
      testimonials = await getTestimonials();
    }
  } catch {
    notFound();
  }

  return (
    <PageContent
      content={page.content}
      featuredImage={page.featuredImage}
      title={page.title}
      projects={projects}
      team={team}
      services={services}
      posts={posts}
      testimonials={testimonials}
    />
  );
}
