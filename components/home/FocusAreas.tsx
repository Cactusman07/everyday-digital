import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import { FOCUS_AREAS } from "@/lib/site";

export default function FocusAreas() {
  return (
    <section
      id="what-we-do"
      className="home-section"
      aria-labelledby="what-we-do-h"
    >
      <div className="home-wrap">
        <p className="eyebrow">01 — What we do</p>
        <h2 id="what-we-do-h" className="display">
          Four things,
          <br />
          done properly.
        </h2>
        <Reveal className="focus-list" as="ul">
          {FOCUS_AREAS.map((f, i) => (
            <li key={f.id} className="focus-row">
              <span className="focus-row__n" aria-hidden="true">
                0{i + 1}
              </span>
              <div className="focus-row__head">
                <h3>{f.title}</h3>
                <p className="focus-row__short">{f.short}</p>
              </div>
              <div className="focus-row__body">
                <p>{f.body}</p>
                <ul>
                  {f.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
              <Link
                href={f.href}
                className="focus-row__link"
                aria-label={`More about ${f.title}`}
              >
                <span>More</span>
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
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
