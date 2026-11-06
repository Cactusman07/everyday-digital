import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import { PACKAGES, HOSTING, SITE } from "@/lib/site";

export default function Packages() {
  return (
    <section id="pricing" className="home-section" aria-labelledby="pricing-h">
      <div className="home-wrap">
        <p className="eyebrow">02 — Packages &amp; pricing</p>
        <h2 id="pricing-h" className="display">
          Priced up front.
          <br />
          No retainers.
        </h2>
        <p className="lede">
          Pick a package, or tell us what you need and we&apos;ll quote it. Work
          outside a package is ${SITE.hourlyRate}/hour or priced per project —
          you only pay for what you use.
        </p>

        <Reveal className="pkg-grid" as="ul">
          {PACKAGES.map((p) => (
            <li
              key={p.id}
              className={`pkg ${p.featured ? "pkg--featured" : ""}`}
            >
              <div className="pkg__top">
                <span className="pkg__name">{p.name}</span>
                <span
                  className={`pkg__price ${p.price === null ? "pkg__price--text" : ""}`}
                >
                  {p.priceLabel}
                  {p.price !== null && <small> + GST</small>}
                </span>
              </div>
              <p className="pkg__tagline">{p.tagline}</p>
              <ul className="pkg__includes">
                {p.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              {p.fineprint && <p className="pkg__fine">{p.fineprint}</p>}
              <Link
                href={p.ctaHref}
                className={`btn ${p.featured ? "btn--accent" : ""}`}
              >
                {p.cta}
              </Link>
            </li>
          ))}
        </Reveal>

        <div className="hosting-strip">
          <div>
            <p className="eyebrow">Hosting</p>
            <p className="hosting-strip__price">
              <b>${HOSTING.shared.monthly}</b>/month or{" "}
              <b>${HOSTING.shared.annual}</b>/year shared ·{" "}
              <b>from ${HOSTING.private.from}</b>/month private
            </p>
            <p className="hosting-strip__inc">{HOSTING.includes.join(" · ")}</p>
            <p className="hosting-strip__sup">{HOSTING.support}</p>
          </div>
          <Link href="/services/hosting/" className="btn">
            Hosting details
          </Link>
        </div>
      </div>
    </section>
  );
}
