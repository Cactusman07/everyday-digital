import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import { SITE } from "@/lib/site";

export default function FinalCta() {
  return (
    <section id="start" className="home-section" aria-labelledby="start-h">
      <div className="home-wrap">
        <Reveal className="final-cta">
          <div>
            <p className="eyebrow">06 — Start</p>
            <h2 id="start-h" className="display">
              Tell us what&apos;s slow,
              <br />
              broken or still
              <br />
              done by hand.
            </h2>
            <p className="lede">
              A reply the same day, a scope within the week, and a price before
              any work starts.
            </p>
          </div>
          <div className="final-cta__actions">
            <Link href="/contact/" className="btn btn--accent btn--lg">
              Start a project
            </Link>
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="btn btn--lg"
            >
              Call {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="final-cta__mail">
              {SITE.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
