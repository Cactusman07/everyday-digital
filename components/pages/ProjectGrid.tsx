// The Projects page grid. Featured case studies come first, then everything
// else newest first. Each card links to the project's own page; on hover the
// card lifts, the image zooms and a short summary slides up.

import Image from "next/image";
import Link from "next/link";
import { caseStudyImage, getCaseStudy } from "@/lib/case-studies";
import { newestFirst } from "@/lib/dates";
import { excerptOf } from "@/lib/html";
import type { WPProject } from "@/lib/wordpress";
import { isCmsMediaUrl } from "@/lib/wordpress/images";
import { itemPath } from "@/lib/wordpress/content-types";

/** How many leading cards span two columns. */
const WIDE_CARDS = 2;

export default function ProjectGrid({ projects }: { projects: WPProject[] }) {
  if (!projects.length) {
    return (
      <p className="mt-4 text-white/60">
        Your project could be here…{" "}
        <Link href="/contact" className="text-link">
          Get in touch →
        </Link>
      </p>
    );
  }

  const cards = newestFirst(projects).map((project) => {
    const cs = getCaseStudy(project.slug);
    const img = project.featuredImage?.node;
    return {
      project,
      cs,
      // Case studies fall back to their screenshot; others show the CMS image
      src: cs
        ? caseStudyImage(project.slug)
        : isCmsMediaUrl(img?.sourceUrl)
          ? img.sourceUrl
          : undefined,
      alt: img?.altText || project.title,
    };
  });
  const ordered = [...cards.filter((c) => c.cs), ...cards.filter((c) => !c.cs)];

  return (
    <ul className="proj-grid">
      {ordered.map(({ project, cs, src, alt }, i) => {
        return (
          <li
            key={project.slug}
            className={i < WIDE_CARDS ? "proj-grid__wide" : undefined}
          >
            <Link
              href={itemPath("project", project.slug)}
              className="proj-card"
            >
              <div className="proj-card__img">
                {src && (
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    // The first card is the largest image above the fold (LCP)
                    priority={i === 0}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
              </div>
              <div className="proj-card__body">
                <span className="proj-card__kind">
                  {cs ? `Case study · ${cs.sector}` : "Project"}
                </span>
                <h2 className="proj-card__title">
                  {cs?.client ?? project.title}
                </h2>
                <span className="proj-card__text">
                  {cs?.summary ?? excerptOf(project, 130)}
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
