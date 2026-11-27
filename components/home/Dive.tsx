// Home page sections for the "Dive" design. Server-rendered markup; the scroll
// behaviour is added by DiveEffects. The hero itself (animated title, gradient,
// NZ map, logo, nav) is still rendered by the root layout and is unchanged; on
// the home page it is pinned behind this content so the page can "dive" into it.

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import ServiceIcon from "@/components/ServiceIcon";
import { Climber, Waver } from "@/components/home/Figures";
import { CASE_STUDIES, PRICING, SERVICES, SITE } from "@/lib/site";
import { preferWp } from "@/lib/images";
import {
  excerptText,
  formatDate,
  parseTestimonial,
  readingMinutes,
} from "@/lib/content";
import type { WPPost, WPProject, WPTestimonial } from "@/lib/types";

const MANIFESTO =
  "We design, build and host websites and online stores, then automate the busywork behind them. WordPress and Shopify specialists. Fixed prices, agreed before we start.";

// Fixed layers: scroll progress bar and the rope climber
export function DiveChrome() {
  return (
    <>
      <div className="dive-progress" aria-hidden="true">
        <i data-dive-progress />
      </div>
      <Climber />
    </>
  );
}

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
          <span className="dive-mani__sig">
            <span className="wd">Every </span>
            <span className="wd">Day.</span>
          </span>
        </p>
      </div>
    </section>
  );
}

export function ServiceStack() {
  return (
    <section
      className="dive-svc"
      id="services"
      data-dive-svc
      aria-labelledby="svc-h"
    >
      <div className="dive-svc__head" data-dive-svc-head>
        <h2 id="svc-h" className="dive-svc__title">
          <span className="dive-svc__a">What we do.</span>
          <span className="dive-svc__b">Every Day.</span>
        </h2>
      </div>
      <div className="dive-svc__cards">
        {SERVICES.map((s, i) => (
          <article
            key={s.slug}
            className="dive-card has-sicon"
            data-dive-card
            style={
              {
                "--k": s.colour,
                top: `calc(var(--svc-head, 230px) + ${i * 12}px)`,
              } as CSSProperties
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
                <Link href={`/services/${s.slug}`} className="dive-card__more">
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

const PLATFORMS = [
  "WordPress",
  "Shopify",
  "WooCommerce",
  "Next.js",
  "Azure",
  "Cloudways",
  "Xero",
  "MYOB",
  "Lightspeed",
  "Claude",
];

export function PlatformMarquee() {
  const row = (k: string) =>
    [...PLATFORMS, ...PLATFORMS].map((p, i) => (
      <span key={`${k}${i}`}>
        {p}
        <i>✳</i>
      </span>
    ));
  return (
    <section className="dive-mq" aria-label="Platforms we work with">
      <p className="sr-only">Platforms we work with: {PLATFORMS.join(", ")}.</p>
      <div className="dive-mq__row" data-dive-mq="1" aria-hidden="true">
        {row("a")}
      </div>
      <div
        className="dive-mq__row dive-mq__row--o"
        data-dive-mq="-1"
        aria-hidden="true"
      >
        {row("b")}
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
        <Link href="/contact" className="btn btn--accent btn--lg">
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
          <Link href="/projects" className="btn">
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
                <Link href={`/projects/${cs.slug}`}>
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

const AVATAR = [
  "#e34beb",
  "#4bafeb",
  "#9deb4b",
  "#ebe74b",
  "#834beb",
  "#eb4b4b",
];

export function Testimonials({ data }: { data: WPTestimonial[] }) {
  if (!data?.length) return null;
  const items = data.map(parseTestimonial);
  return (
    <section className="dive-tst" aria-labelledby="tst-h">
      <div className="dive-tst__head">
        <p className="eyebrow">Testimonials</p>
        <h2 id="tst-h" className="dive-tst__title">
          <span>In their</span>
          <span className="dive-tst__script">own words.</span>
        </h2>
        <p className="dive-tst__sub">
          What the people we build for say, unedited.
        </p>
      </div>
      <div className="dive-tst__list">
        {items.map((t, i) => (
          <figure
            key={t.name + i}
            className="tst"
            data-reveal
            style={{ "--k": AVATAR[i % AVATAR.length] } as CSSProperties}
          >
            <figcaption className="tst__who">
              <span className="tst__av" aria-hidden="true">
                {t.initials}
              </span>
              <span>
                <span className="tst__name">{t.name}</span>
                <span className="tst__co">
                  {t.company}
                  {t.url && (
                    <>
                      {" · "}
                      <a href={t.url} target="_blank" rel="noreferrer">
                        {t.url.replace(/^https?:\/\//, "")}
                      </a>
                    </>
                  )}
                </span>
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

export function LatestPosts({ posts }: { posts: WPPost[] }) {
  if (!posts?.length) return null;
  const sorted = [...posts].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date),
  );
  const [latest, ...rest] = sorted;
  const img = latest.featuredImage?.node;
  return (
    <section className="dive-latest" aria-labelledby="latest-h">
      <div className="dive-latest__intro" data-reveal>
        <p className="eyebrow">From the blog</p>
        <h2 id="latest-h" className="dive-latest__title">
          The latest digital trends, news and project updates.
        </h2>
        <p className="dive-latest__sub">
          Plain-English articles on websites, online stores, AI search and
          automation, plus notes on what we&apos;ve been building lately.
        </p>
        <Link href="/blog" className="btn">
          All articles
        </Link>
      </div>
      <div className="dive-latest__body">
        <Link
          href={`/blog/${latest.slug}`}
          className="dive-latest__feat"
          data-reveal
        >
          {img?.sourceUrl && (
            <div className="dive-latest__img">
              <Image
                src={img.sourceUrl}
                alt={img.altText || latest.title}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
          )}
          <div className="dive-latest__txt">
            <span className="dive-latest__meta">
              Latest · {formatDate(latest.date)} ·{" "}
              {readingMinutes(latest.content)} min read
            </span>
            <h3>{latest.title}</h3>
            <p>{excerptText(latest.excerpt || latest.content, 180)}</p>
            <span className="dive-latest__go">Read the latest post →</span>
          </div>
        </Link>
        {rest.length > 0 && (
          <ul className="dive-latest__more">
            {rest.slice(0, 3).map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`}>
                  <span>{formatDate(p.date)}</span>
                  <b>{p.title}</b>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function Outro() {
  const year = new Date().getFullYear();
  return (
    <section className="dive-outro" id="contact" data-dive-outro>
      <div className="dive-outro__grid">
        <div>
          <p className="eyebrow">Ready when you are</p>
          <p className="dive-outro__huge">Every Day.</p>
          <p className="dive-outro__sub">
            A free chat, a fixed-price quote, and a website that keeps working
            long after launch.
          </p>
          <div className="section-actions">
            <Link href="/contact" className="btn btn--accent btn--lg">
              Start with a free chat
            </Link>
            <a href={`mailto:${SITE.email}`} className="btn btn--lg">
              {SITE.email}
            </a>
          </div>
        </div>
        <Waver />
      </div>
      <footer className="dive-outro__foot">
        <span>
          © {year} {SITE.legalName} · {SITE.city}, New Zealand
        </span>
        <nav aria-label="Footer">
          <Link href="/services">Services</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/terms">Terms &amp; Conditions</Link>
          <a href={SITE.social.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={SITE.social.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href={SITE.social.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </nav>
      </footer>
    </section>
  );
}
