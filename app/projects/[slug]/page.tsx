import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjects, getTestimonials } from "@/lib/wordpress";
import { getCaseStudy, SITE } from "@/lib/site";
import SingleItemContent from "@/components/SingleItemContent";
import CaseStudy from "@/components/CaseStudy";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = getCaseStudy(slug);
  try {
    const projects = await getProjects();
    const project = projects.find((p) => p.slug === slug);
    if (!project) return {};
    const description =
      meta?.summary ??
      (project.excerpt
        ? project.excerpt.replace(/<[^>]*>/g, "").slice(0, 160)
        : undefined);
    const title = meta
      ? `${meta.client} — ${meta.sector} case study`
      : project.title;
    const image =
      project.featuredImage?.node.sourceUrl ??
      (meta ? `${SITE.url}/images/work/${slug}.png` : undefined);
    return {
      title,
      description,
      alternates: { canonical: `/projects/${slug}/` },
      openGraph: {
        title,
        description,
        type: "article",
        url: `/projects/${slug}/`,
        images: image ? [{ url: image }] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  let projects, testimonials;
  try {
    [projects, testimonials] = await Promise.all([
      getProjects(),
      getTestimonials(),
    ]);
  } catch {
    notFound();
  }

  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  // The four focal clients get the full case-study layout; everything else
  // keeps the existing single-item page until its metadata is written.
  const meta = getCaseStudy(slug);
  if (meta) {
    return (
      <CaseStudy meta={meta} project={project} testimonials={testimonials} />
    );
  }

  return (
    <div className="inner-page">
      <SingleItemContent
        type="project"
        item={project}
        testimonials={testimonials}
      />
    </div>
  );
}
