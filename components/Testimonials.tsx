// Client testimonials for inner pages: full quotes, each with a clear header
// (initials, name, business). Shares its card styles with the home page.

import Link from "next/link";
import type { CSSProperties } from "react";
import { parseTestimonial } from "@/lib/content";
import type { WPTestimonial } from "@/lib/types";

const AVATAR = [
  "#e34beb",
  "#4bafeb",
  "#9deb4b",
  "#ebe74b",
  "#834beb",
  "#eb4b4b",
];

export default function Testimonials({ data }: { data: WPTestimonial[] }) {
  if (!data?.length) return null;
  const items = data.map(parseTestimonial);
  return (
    <section
      id="testimonials"
      className="tst-band"
      aria-labelledby="tst-band-h"
    >
      <h2 id="tst-band-h" className="tst-band__title">
        <span>In their</span>{" "}
        <span className="tst-band__script">own words.</span>
      </h2>
      <div className="tst-band__grid">
        {items.map((t, i) => (
          <figure
            key={t.name + i}
            className="tst"
            style={{ "--k": AVATAR[i % AVATAR.length] } as CSSProperties}
          >
            <figcaption className="tst__who">
              <span className="tst__av" aria-hidden="true">
                {t.initials}
              </span>
              <span>
                <span className="tst__name">{t.name}</span>
                <span className="tst__co">{t.company}</span>
              </span>
            </figcaption>
            <blockquote className="tst__q">
              <p className="tst__lead">{t.lead}</p>
              {t.rest.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </blockquote>
            {t.caseStudy && (
              <Link href={t.caseStudy} className="tst__more">
                Read the {t.company} case study →
              </Link>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
