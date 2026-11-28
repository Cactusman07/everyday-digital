import { BreadcrumbJsonLd, ProjectJsonLd } from "@/components/seo/JsonLd";
import CaseStudy from "@/components/showcase/CaseStudy";
import ItemShowcase from "@/components/showcase/ItemShowcase";
import { getCaseStudy } from "@/lib/case-studies";
import { projectRoute, type SlugParams } from "@/lib/detail-routes";
import { sectionOf } from "@/lib/wordpress/content-types";

export const generateStaticParams = projectRoute.generateStaticParams;
export const generateMetadata = projectRoute.generateMetadata;

export default async function ProjectPage(props: SlugParams) {
  const {
    item: project,
    items,
    testimonials,
    meta,
    path,
    url,
  } = await projectRoute.load(props);

  // Featured clients get the full case-study layout; other projects use the
  // standard showcase until their case-study facts are written.
  const caseStudy = getCaseStudy(project.slug);
  if (caseStudy) {
    return (
      <>
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "/" },
            { name: "Projects", url: sectionOf("project").path },
            { name: caseStudy.client, url: path },
          ]}
        />
        <CaseStudy
          meta={caseStudy}
          project={project}
          projects={items}
          testimonials={testimonials}
        />
      </>
    );
  }

  return (
    <>
      <ProjectJsonLd
        name={project.title}
        description={meta.description}
        url={url}
        image={meta.image}
        datePublished={meta.article?.publishedTime}
        dateModified={meta.article?.modifiedTime}
      />
      <ItemShowcase
        showcase={{ type: "project", item: project, siblings: items }}
        testimonials={testimonials}
      />
    </>
  );
}
