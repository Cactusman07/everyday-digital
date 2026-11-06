import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import { CASE_STUDIES } from "@/lib/site";
import type { WPProject } from "@/lib/types";

// Featured work — the four focal clients, in order. Pulls the screenshot from
// the WordPress project if one exists, otherwise from /public/images/work/<slug>.png
// (captured by scripts/capture-screenshots.mjs). Falls back to a styled tile.

export default function FeaturedWork({ projects }: { projects: WPProject[] }) {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));

  return (
    <section id="work" className="home-section" aria-labelledby="work-h">
      <div className="home-wrap">
        <p className="eyebrow">03 — Work</p>
        <h2 id="work-h" className="display">
          Built, shipped,
          <br />
          still running.
        </h2>
        <p className="lede">
          Client work, plus two businesses we run ourselves — so we know what
          it&apos;s like when orders, stock and marketing all have to work at
          once.
        </p>

        <Reveal className="work-grid" as="ul">
          {CASE_STUDIES.map((cs) => {
            const wp = bySlug.get(cs.slug);
            const wpImg = wp?.featuredImage?.node?.sourceUrl;
            const localImg = `/images/work/${cs.slug}.png`;
            const src = wpImg ?? localImg;
            const headline = cs.results.find((r) => r.value)?.value;
            return (
              <li
                key={cs.slug}
                className={`work-card ${cs.ownBusiness ? "work-card--own" : ""}`}
              >
                <Link
                  href={`/projects/${cs.slug}/`}
                  className="work-card__link"
                >
                  <div className="work-card__media">
                    <Image
                      src={src}
                      alt={`${cs.client} website`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="work-card__img"
                    />
                  </div>
                  <div className="work-card__body">
                    <span className="work-card__sector">{cs.sector}</span>
                    <h3>{cs.client}</h3>
                    <p>{cs.summary}</p>
                    <div className="work-card__meta">
                      {cs.ownBusiness && (
                        <span className="pill pill--own">We run it</span>
                      )}
                      {headline && <span className="pill">{headline}</span>}
                      <span className="work-card__more">
                        Case study
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </Reveal>

        <div className="section-actions">
          <Link href="/projects/" className="btn">
            All projects
          </Link>
          <Link href="/contact/" className="btn btn--accent">
            Start a project
          </Link>
        </div>
      </div>
    </section>
  );
}
