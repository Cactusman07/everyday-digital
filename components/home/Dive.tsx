// Home page sections for the "Dive" design. Server-rendered markup; the scroll
// behaviour is added by DiveEffects. The hero itself (animated title, gradient,
// NZ map, logo, nav) is still rendered by the root layout and is unchanged; on
// the home page it is pinned behind this content so the page can "dive" into it.

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import ServiceIcon from "@/components/ServiceIcon";
import { CASE_STUDIES, PRICING, SERVICES, SITE } from "@/lib/site";
import { preferWp } from "@/lib/images";
import type { WPProject, WPTestimonial } from "@/lib/types";

const MANIFESTO =
  "We design, build and host websites and online stores, then automate the busywork behind them. WordPress and Shopify specialists. Fixed prices, agreed before we start.";

export function DiveIntro() {
  return (
    <section className="dive-intro" data-dive-intro aria-hidden="true">
      <div className="dive-intro__stage">
        <p className="dive-intro__hint">Scroll to dive in ↓</p>
        <div className="dive-iris" data-dive-iris>
          <p>
            We keep
            <br />
            you running.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Manifesto() {
  return (
    <section className="dive-mani" data-dive-mani id="about-us">
      <div className="dive-mani__stick">
        <p>
          {MANIFESTO.split(" ").map((w, i) => (
            <span key={i} className="wd">
              {w}{" "}
            </span>
          ))}
          <span className="wd sc">Every </span>
          <span className="wd sc">Day.</span>
        </p>
      </div>
    </section>
  );
}

export function ServiceStack() {
  return (
    <section className="dive-svc" id="services" aria-labelledby="svc-h">
      <p className="eyebrow">What we do</p>
      <h2 id="svc-h" className="display dive-h">
        What we do.
        <br />
        Every day.
      </h2>
      <div>
        {SERVICES.map((s, i) => (
          <article
            key={s.slug}
            className="dive-card has-sicon"
            data-dive-card
            style={
              { "--k": s.colour, top: `${84 + i * 12}px` } as CSSProperties
            }
          >
            <div className="dive-card__l">
              <div>
                <span className="dive-card__n">
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(SERVICES.length).padStart(2, "0")}
                </span>
                <p className="dive-card__ed">
                  Every Day <b>{s.word}</b>
                </p>
              </div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.summary}</p>
                <div className="dive-card__tags">
                  {s.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
                <Link href={`/services/${s.slug}/`} className="dive-card__more">
                  More about {s.title.toLowerCase()} →
                </Link>
              </div>
            </div>
            <div className="dive-card__art">
              <ServiceIcon slug={s.slug} size={120} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PriceCount() {
  return (
    <section className="dive-price" data-dive-price id="pricing">
      <p className="eyebrow">A simple WordPress website starts at</p>
      <div
        className="dive-price__big"
        data-dive-num={PRICING.simpleSiteFrom}
        aria-label={`$${PRICING.simpleSiteFrom}`}
      >
        ${PRICING.simpleSiteFrom}
      </div>
      <div className="dive-price__gst">+ GST</div>
      <p className="dive-price__p">
        {PRICING.line} {PRICING.rest}
      </p>
      <div className="section-actions dive-center">
        <Link href="/contact/" className="btn btn--accent btn--lg">
          Book a free consultation
        </Link>
      </div>
    </section>
  );
}

export function WorkTrack({ projects }: { projects: WPProject[] }) {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  return (
    <section
      className="dive-hz"
      data-dive-hz
      id="work"
      aria-labelledby="work-h"
    >
      <div className="dive-hz__stage">
        <div className="dive-hz__head">
          <h2 id="work-h" className="display dive-h dive-h--sm">
            Built, shipped,
            <br />
            still running.
          </h2>
          <Link href="/projects/" className="btn">
            All projects
          </Link>
        </div>
        <ul className="dive-track" data-dive-track>
          {CASE_STUDIES.map((cs) => {
            const src = preferWp(
              bySlug.get(cs.slug)?.featuredImage?.node?.sourceUrl,
              `/images/work/${cs.slug}.png`,
            );
            return (
              <li key={cs.slug} className="dive-pan">
                <Link href={`/projects/${cs.slug}/`}>
                  <div className="dive-pan__shot">
                    <Image
                      src={src}
                      alt={`${cs.client} website`}
                      fill
                      sizes="(max-width: 760px) 82vw, 62vw"
                    />
                  </div>
                  <h3>{cs.client}</h3>
                  <small>{cs.sector}</small>
                  <p>{cs.summary}</p>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="dive-bar">
          <i data-dive-bar />
        </div>
      </div>
    </section>
  );
}

const strip = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// First sentence or two of each testimonial, kept short so it reads as a quote
function pull(text: string, max = 150) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  let out = "";
  for (const s of sentences) {
    if (out && (out + s).length > max) break;
    out += s;
  }
  return out.trim();
}

export function Quotes({ data }: { data: WPTestimonial[] }) {
  if (!data?.length) return null;
  return (
    <section className="dive-qs" aria-label="What clients say">
      {data.slice(0, 2).map((t) => (
        <blockquote key={t.title}>
          “{pull(strip(t.content))}”
          <footer>{t.title.replace(" - ", ", ")}</footer>
        </blockquote>
      ))}
    </section>
  );
}

export function Outro() {
  const year = new Date().getFullYear();
  return (
    <section className="dive-outro" id="contact">
      <p className="eyebrow">Ready when you are</p>
      <div>
        <p className="dive-outro__huge">Every Day.</p>
        <div className="section-actions">
          <Link href="/contact/" className="btn btn--accent btn--lg">
            Start with a free chat
          </Link>
          <a href={`mailto:${SITE.email}`} className="btn btn--lg">
            {SITE.email}
          </a>
        </div>
      </div>
      <footer className="dive-outro__foot">
        <span>
          © {year} {SITE.legalName} · {SITE.city}, New Zealand
        </span>
        <nav aria-label="Footer">
          <Link href="/services/">Services</Link>
          <Link href="/projects/">Projects</Link>
          <Link href="/blog/">Blog</Link>
          <Link href="/terms/">Terms &amp; Conditions</Link>
          <a href={SITE.social.linkedin}>LinkedIn</a>
          <a href={SITE.social.facebook}>Facebook</a>
          <a href={SITE.social.instagram}>Instagram</a>
        </nav>
      </footer>
    </section>
  );
}
