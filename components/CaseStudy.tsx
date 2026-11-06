import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { CASE_STUDIES, SITE, type CaseStudyMeta } from "@/lib/site";
import type { WPProject, WPTestimonial } from "@/lib/types";

// Case-study layout for the four focal projects. Structured facts come from
// lib/site.ts; the narrative body comes from the WordPress project so Sam can
// keep expanding it in the CMS. Fields with null values are hidden until
// confirmed, so nothing unverified ships.

interface Props {
  meta: CaseStudyMeta;
  project: WPProject;
  testimonials: WPTestimonial[];
}

function stripTags(html: string) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function CaseStudy({ meta, project, testimonials }: Props) {
  const hero =
    project.featuredImage?.node?.sourceUrl ?? `/images/work/${meta.slug}.png`;
  const results = meta.results.filter((r) => r.value);
  const related = CASE_STUDIES.filter((c) => c.slug !== meta.slug).slice(0, 3);
  // Match a testimonial to this client by name, if one exists in WP
  const clientFirstWord = meta.client.split(" ")[0].toLowerCase();
  const quote = testimonials.find((t) =>
    t.title.toLowerCase().includes(clientFirstWord),
  );

  return (
    <div id="content" className="case mt-40 mb-24 relative z-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: `${meta.client} — case study`,
          url: `${SITE.url}/projects/${meta.slug}/`,
          about: { "@type": "Organization", name: meta.client, url: meta.url },
          creator: { "@type": "Organization", name: SITE.name, url: SITE.url },
          description: meta.summary,
          keywords: [...meta.services, ...meta.stack].join(", "),
        }}
      />

      <div className="home-wrap">
        <Link href="/projects/" className="case__back">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
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
            <a href={meta.url} target="_blank" rel="noreferrer" className="btn">
              Visit {meta.url.replace(/^https?:\/\//, "")}
            </a>
            <Link href="/contact/" className="btn btn--accent">
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
            <p className="eyebrow">What we did</p>
            <ul className="case__list">
              {meta.whatWeDid.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <p className="eyebrow">How we did it</p>
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
              className="project-panel__content"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </Reveal>
        )}

        {quote && (
          <Reveal>
            <blockquote className="quote-lead case__quote">
              <p>“{stripTags(quote.content)}”</p>
              <footer>— {quote.title}</footer>
            </blockquote>
          </Reveal>
        )}

        <section aria-labelledby="related-h" className="case__related">
          <p className="eyebrow">More work</p>
          <h2 id="related-h" className="display case__related-title">
            Other projects.
          </h2>
          <Reveal className="work-grid work-grid--3" as="ul">
            {related.map((r) => (
              <li
                key={r.slug}
                className={`work-card ${r.ownBusiness ? "work-card--own" : ""}`}
              >
                <Link href={`/projects/${r.slug}/`} className="work-card__link">
                  <div className="work-card__media">
                    <Image
                      src={`/images/work/${r.slug}.png`}
                      alt={`${r.client} website`}
                      fill
                      sizes="(max-width: 760px) 100vw, 33vw"
                      className="work-card__img"
                    />
                  </div>
                  <div className="work-card__body">
                    <span className="work-card__sector">{r.sector}</span>
                    <h3>{r.client}</h3>
                    <p>{r.summary}</p>
                  </div>
                </Link>
              </li>
            ))}
          </Reveal>
        </section>
      </div>
      <Footer />
    </div>
  );
}
