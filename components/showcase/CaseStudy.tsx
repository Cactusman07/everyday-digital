// Case-study layout for the featured projects (lib/case-studies.ts).
// Structured facts come from the case-study entry; the narrative body comes
// from the WordPress project so it can keep growing in the CMS. Results with
// null values are hidden until confirmed, so nothing unverified ships.

import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";
import { ProjectJsonLd } from "@/components/seo/JsonLd";
import CaseStudyCards from "@/components/shared/CaseStudyCards";
import PullQuote from "@/components/shared/PullQuote";
import Reveal from "@/components/shared/Reveal";
import {
  CASE_STUDIES,
  caseStudyImage,
  type CaseStudyMeta,
} from "@/lib/case-studies";
import { gmt } from "@/lib/dates";
import { absoluteUrl, displayUrl } from "@/lib/site";
import { testimonialFor } from "@/lib/testimonials";
import type { WPProject, WPTestimonial } from "@/lib/wordpress";
import { itemPath, sectionOf } from "@/lib/wordpress/content-types";
import ReadingProgress from "@/components/shared/ReadingProgress";
import OutlineIcon from "@/components/shared/OutlineIcon";

/** How many other case studies to suggest at the foot of the page. */
const RELATED_COUNT = 3;

interface Props {
  meta: CaseStudyMeta;
  project: WPProject;
  projects: WPProject[];
  testimonials: WPTestimonial[];
}

export default function CaseStudy({
  meta,
  project,
  projects,
  testimonials,
}: Props) {
  const hero = caseStudyImage(meta.slug, projects);
  const results = meta.results.filter((r) => r.value);
  const related = CASE_STUDIES.filter((c) => c.slug !== meta.slug).slice(
    0,
    RELATED_COUNT,
  );
  const quote = testimonialFor(meta.slug, testimonials);

  return (
    <div id="content" className="case mt-40 mb-24 relative z-20">
      <ReadingProgress />
      <ProjectJsonLd
        name={`${meta.client} — case study`}
        description={meta.summary}
        url={absoluteUrl(itemPath("project", meta.slug))}
        image={hero}
        datePublished={gmt(project.dateGmt)}
        dateModified={gmt(project.modifiedGmt)}
        client={{ name: meta.client, url: meta.url }}
        keywords={[...meta.services, ...meta.stack]}
      />

      <div className="home-wrap">
        <Link href={sectionOf("project").path} className="case__back">
          <OutlineIcon>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </OutlineIcon>
          All projects
        </Link>

        <Reveal>
          <p className="eyebrow">
            Case study · {meta.sector}
            {meta.ownBusiness && (
              <span className="pill pill--own case__own">We run it</span>
            )}
          </p>
          <h1 className="display case__title">{meta.client}</h1>
          <p className="lede case__summary">{meta.summary}</p>
          <div className="section-actions">
            {meta.url && (
              <a
                href={meta.url}
                target="_blank"
                rel="noreferrer"
                className="btn"
              >
                Visit {displayUrl(meta.url)}
              </a>
            )}
            <Link href="/contact" className="btn btn--accent">
              Start a project like this
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="case__hero">
        <Image
          src={hero}
          alt={`${meta.client} website`}
          fill
          priority
          sizes="100vw"
          className="case__hero-img"
        />
      </div>

      <div className="home-wrap">
        <Reveal className="case__facts" as="ul">
          <li>
            <small>Services</small>
            <b>{meta.services.join(" · ")}</b>
          </li>
          <li>
            <small>Built with</small>
            <b>{meta.stack.join(" · ")}</b>
          </li>
          {meta.timeline && (
            <li>
              <small>Timeline</small>
              <b>{meta.timeline}</b>
            </li>
          )}
          {results.map((r) => (
            <li key={r.label} className="case__fact--result">
              <small>{r.label}</small>
              <b>{r.value}</b>
            </li>
          ))}
        </Reveal>

        <div className="case__cols">
          <Reveal>
            <h2 className="eyebrow">What we did</h2>
            <ul className="case__list">
              {meta.whatWeDid.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <h2 className="eyebrow">How we did it</h2>
            <ul className="case__list">
              {meta.howWeDidIt.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        {project.content && (
          <Reveal className="case__body">
            <div
              className="prose-edd"
              data-article
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </Reveal>
        )}

        {quote && (
          <Reveal>
            <PullQuote testimonial={quote} className="case__quote" />
          </Reveal>
        )}

        <section aria-labelledby="related-h" className="case__related">
          <p className="eyebrow">More work</p>
          <h2 id="related-h" className="display case__related-title">
            Other projects.
          </h2>
          <CaseStudyCards studies={related} projects={projects} columns={3} />
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
