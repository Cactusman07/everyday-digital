// Home page sections. Server-rendered markup; the scroll behaviour is added
// by HomeScrollEffects. The hero itself (animated title, gradients, NZ map,
// logo, nav) is rendered by HomeHero in app/(home)/layout.tsx; on the home page
// it is pinned behind this content so the page can "dive" into it.

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import ServiceIcon from "@/components/shared/ServiceIcon";
import { CASE_STUDIES, caseStudyImage } from "@/lib/case-studies";
import { formatDate, newestFirst } from "@/lib/dates";
import { excerptOf, readingMinutes } from "@/lib/html";
import { FOOTER_LINKS, SOCIAL_LINKS } from "@/lib/navigation";
import { PRICES, PRICE_COPY, dollars } from "@/lib/pricing";
import { SERVICES } from "@/lib/services";
import { SITE, copyright } from "@/lib/site";
import type { WPPost, WPProject } from "@/lib/wordpress";
import { Climber, Waver } from "./Silhouettes";
import { itemPath, sectionOf } from "@/lib/wordpress/content-types";
import { isCmsMediaUrl } from "@/lib/wordpress/images";
import BookingLink from "@/components/shared/BookingLink";

const MANIFESTO =
  "We design, build and host websites and online stores, then automate the busywork behind them. WordPress and Shopify specialists. Fixed prices, agreed before we start.";

// Fixed layers: scroll progress bar and the rope climber
export function DiveChrome() {
  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
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
    <section className="manifesto" data-dive-mani id="about-us">
      <div className="manifesto__stick">
        <p>
          {MANIFESTO.split(" ").map((w, i) => (
            <span key={i} className="manifesto__word">
              {w}{" "}
            </span>
          ))}
          <span className="manifesto__sig">
            <span className="manifesto__word">Every </span>
            <span className="manifesto__word">Day.</span>
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
                <Link
                  href={itemPath("service", s.slug)}
                  className="dive-card__more"
                >
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
        data-dive-num={PRICES.website}
        aria-label={dollars(PRICES.website)}
      >
        {dollars(PRICES.website)}
      </div>
      <div className="dive-price__gst">+ GST</div>
      <p className="dive-price__p">
        {PRICE_COPY.website} {PRICE_COPY.quoted}
      </p>
      <div className="section-actions dive-center">
        <BookingLink className="btn btn--accent btn--lg">
          Book a free consultation
        </BookingLink>
      </div>
    </section>
  );
}

export function WorkTrack({ projects }: { projects: WPProject[] }) {
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
          <Link href={sectionOf("project").path} className="btn">
            All projects
          </Link>
        </div>
        <ul className="dive-track" data-dive-track>
          {CASE_STUDIES.map((cs) => (
            <li key={cs.slug} className="dive-pan">
              <Link href={itemPath("project", cs.slug)}>
                <div className="dive-pan__shot">
                  <Image
                    src={caseStudyImage(cs.slug, projects)}
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
          ))}
        </ul>
        <div className="dive-bar">
          <i data-dive-bar />
        </div>
      </div>
    </section>
  );
}

export function LatestPosts({ posts }: { posts: WPPost[] }) {
  const [latest, ...rest] = newestFirst(posts);
  if (!latest) return null;
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
        <Link href={sectionOf("post").path} className="btn">
          All articles
        </Link>
      </div>
      <div className="dive-latest__body">
        <Link
          href={itemPath("post", latest.slug)}
          className="dive-latest__feat"
          data-reveal
        >
          {isCmsMediaUrl(img?.sourceUrl) && (
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
            <p>{excerptOf(latest, 180)}</p>
            <span className="dive-latest__go">Read the latest post →</span>
          </div>
        </Link>
        {rest.length > 0 && (
          <ul className="dive-latest__more">
            {rest.slice(0, 3).map((p) => (
              <li key={p.slug}>
                <Link href={itemPath("post", p.slug)}>
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

/** Footer links for the home page: everything but About (the manifesto covers it). */
const OUTRO_LINKS = FOOTER_LINKS.filter((l) => l.href !== "/about");

export function Outro() {
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
            <BookingLink className="btn btn--lg" />
            <a href={`mailto:${SITE.email}`} className="btn btn--lg">
              {SITE.email}
            </a>
          </div>
        </div>
        <Waver />
      </div>
      <footer className="dive-outro__foot">
        <span>
          {copyright()} · {SITE.city}, New Zealand
        </span>
        <nav aria-label="Footer">
          {OUTRO_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          {SOCIAL_LINKS.map((l) => (
            <a key={l.id} href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ))}
        </nav>
      </footer>
    </section>
  );
}
