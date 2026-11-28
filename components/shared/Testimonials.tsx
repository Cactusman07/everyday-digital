// Client testimonials from WordPress, as quote cards with a header (initials,
// name, business) and a link to the client's case study where there is one.
//
// Two layouts share the same cards:
//   "home" — the home page section: heading, sub-line, cards revealed on scroll
//            and the client's web address.
//   "band" — the band near the foot of inner pages: heading and a card grid.

import Link from "next/link";
import type { CSSProperties } from "react";
import { accentAt } from "@/lib/brand";
import { displayUrl } from "@/lib/site";
import { parseTestimonial, type Testimonial } from "@/lib/testimonials";
import type { WPTestimonial } from "@/lib/wordpress";

function TestimonialCard({
  t,
  accent,
  home,
}: {
  t: Testimonial;
  accent: string;
  home: boolean;
}) {
  return (
    <figure
      className="tst"
      data-reveal={home || undefined}
      style={{ "--k": accent } as CSSProperties}
    >
      <figcaption className="tst__who">
        <span className="tst__av" aria-hidden="true">
          {t.initials}
        </span>
        <span>
          <span className="tst__name">{t.name}</span>
          <span className="tst__co">
            {t.company}
            {home && t.url && (
              <>
                {" · "}
                <a href={t.url} target="_blank" rel="noreferrer">
                  {displayUrl(t.url)}
                </a>
              </>
            )}
          </span>
        </span>
      </figcaption>
      <blockquote className="tst__q">
        <p className="tst__lead">{t.lead}</p>
        {t.rest && <p>{t.rest}</p>}
      </blockquote>
      {t.projectPath && (
        <Link href={t.projectPath} className="tst__more">
          {t.isCaseStudy
            ? `Read the ${t.company} case study →`
            : `See the ${t.company} project →`}
        </Link>
      )}
    </figure>
  );
}

export default function Testimonials({
  testimonials,
  variant = "band",
}: {
  testimonials: WPTestimonial[];
  variant?: "home" | "band";
}) {
  if (!testimonials.length) return null;
  const home = variant === "home";
  const cards = testimonials
    .map(parseTestimonial)
    .map((t, i) => (
      <TestimonialCard
        key={`${t.name}-${i}`}
        t={t}
        accent={accentAt(i)}
        home={home}
      />
    ));

  if (home)
    return (
      <section className="home-testimonials" aria-labelledby="testimonials-h">
        <div className="home-testimonials__head">
          <p className="eyebrow">Testimonials</p>
          <h2 id="testimonials-h" className="home-testimonials__title">
            <span>In their</span>
            <span className="home-testimonials__script">own words.</span>
          </h2>
          <p className="home-testimonials__sub">
            What the people we build for say, unedited.
          </p>
        </div>
        <div className="home-testimonials__list">{cards}</div>
      </section>
    );

  return (
    <section
      id="testimonials"
      className="tst-band"
      aria-labelledby="testimonials-h"
    >
      <h2 id="testimonials-h" className="tst-band__title">
        <span>In their</span>{" "}
        <span className="tst-band__script">own words.</span>
      </h2>
      <div className="tst-band__grid">{cards}</div>
    </section>
  );
}
