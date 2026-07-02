import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjects, getTestimonials } from "@/lib/wordpress";
import SingleItemContent from "@/components/SingleItemContent";

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
  try {
    const projects = await getProjects();
    const project = projects.find((p) => p.slug === slug);
    if (!project) return {};
    const description = project.excerpt
      ? project.excerpt.replace(/<[^>]*>/g, "").slice(0, 160)
      : undefined;
    return {
      title: project.title,
      description,
      openGraph: {
        title: project.title,
        description,
        images: project.featuredImage
          ? [{ url: project.featuredImage.node.sourceUrl }]
          : [],
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
