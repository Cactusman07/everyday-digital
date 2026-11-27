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
import { PAGE_SEO } from "@/lib/site";

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

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Pre-render every WordPress page at build time; anything new renders on first visit.
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
    const seo = PAGE_SEO[slug];
    const description =
      seo?.description ??
      (page.content
        ? page.content
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 158)
        : undefined);
    const title = seo?.title ?? page.title;
    return {
      title,
      description,
      alternates: { canonical: `/${slug}` },
      openGraph: { title, description, url: `/${slug}` },
    };
  } catch {
    return {};
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  let pages;
  try {
    pages = await getPages();
  } catch {
    notFound();
  }

  const page = pages.find((p) => p.uri === `/${slug}/` || p.uri === `/${slug}`);
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
