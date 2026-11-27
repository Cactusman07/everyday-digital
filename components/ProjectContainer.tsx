// Projects page grid. Each card links to the project's own page; on hover the
// card lifts, the image zooms and a short summary slides up.

import Image from "next/image";
import Link from "next/link";
import { excerptText } from "@/lib/content";
import { getCaseStudy } from "@/lib/site";
import type { WPProject } from "@/lib/types";

export default function ProjectContainer({ data }: { data: WPProject[] }) {
  if (!data?.length) {
    return (
      <p className="mt-4 text-white/60">
        Your project could be here…{" "}
        <Link href="/contact" className="projects-cta-link">
          Get in touch →
        </Link>
      </p>
    );
  }

  // Featured case studies first, then everything else newest first
  const sorted = [...data].sort((a, b) => {
    const fa = getCaseStudy(a.slug) ? 0 : 1;
    const fb = getCaseStudy(b.slug) ? 0 : 1;
    if (fa !== fb) return fa - fb;
    return +new Date(b.date ?? 0) - +new Date(a.date ?? 0);
  });

  return (
    <ul className="proj-grid">
      {sorted.map((project, i) => {
        const img = project.featuredImage?.node;
        const cs = getCaseStudy(project.slug);
        return (
          <li
            key={project.slug}
            className={i < 2 ? "proj-grid__wide" : undefined}
          >
            <Link href={`/projects/${project.slug}`} className="proj-card">
              <div className="proj-card__img">
                {img?.sourceUrl && (
                  <Image
                    src={img.sourceUrl}
                    alt={img.altText || project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
              </div>
              <div className="proj-card__body">
                <span className="proj-card__kind">
                  {cs ? `Case study · ${cs.sector}` : "Project"}
                </span>
                <span className="proj-card__title">
                  {cs?.client ?? project.title}
                </span>
                <span className="proj-card__text">
                  {cs?.summary ??
                    excerptText(project.excerpt || project.content, 130)}
                </span>
                <span className="proj-card__go">View project →</span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
