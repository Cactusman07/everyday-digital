// Full-page showcase for a blog post, project or service.
//
// Layout: breadcrumb, large script title with a short intro and meta line
// (date, reading time, tags), the featured image, then the article beside a
// sticky "On this page" contents list built from its headings. Below: author
// (blog), share links, previous/next, other services (service pages), a call
// to action, testimonials and the footer. A reading progress bar runs along
// the top of the window.

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Footer from "./Footer";
import ScriptTitle from "./ScriptTitle";
import ServiceIcon, { hasServiceIcon } from "./ServiceIcon";
import Testimonials from "./Testimonials";
import ReadingProgress from "./show/ReadingProgress";
import TocSpy from "./show/TocSpy";
import ShareLinks from "./show/ShareLinks";
import { BreadcrumbJsonLd } from "./JsonLd";
import {
  excerptText,
  formatDate,
  readingMinutes,
  stripHtml,
  withHeadingIds,
} from "@/lib/content";
import { PRICING, SERVICES, SITE, getServiceMeta } from "@/lib/site";
import type { WPPost, WPProject, WPService, WPTestimonial } from "@/lib/types";

const COVER_TAG = "cover";

type Item = WPPost | WPProject | WPService;

interface SingleItemContentProps {
  type: "blog" | "project" | "service";
  item: Item;
  testimonials: WPTestimonial[];
  siblings?: Item[];
}

const SECTION = {
  blog: { path: "/blog", label: "Blog", noun: "article" },
  project: { path: "/projects", label: "Projects", noun: "project" },
  service: { path: "/services", label: "Services", noun: "service" },
} as const;

// One line on price for each service page
function priceNote(slug: string) {
  switch (slug) {
    case "website-design":
    case "development":
      return `${PRICING.line} ${PRICING.rest}`;
    case "hosting":
      return "Website hosting is $40 a month, including one hour of free updates each month. Pay annually and get two months free. eCommerce hosting is $50 a month. Prices exclude GST.";
    case "digital-management":
      return "A fixed monthly fee, with the scope agreed in a free chat first.";
    default:
      return "Quoted at a fixed price after a free consultation and chat, so you know the cost before we start.";
  }
}

// WordPress auto-excerpts end with an ellipsis; only show hand-written ones
// as the intro, otherwise they just repeat the first paragraph.
function introFrom(excerpt?: string) {
  const text = stripHtml(excerpt ?? "");
  if (!text || /(\[…\]|…|\.\.\.)$/.test(text)) return "";
  return text;
}

export default function SingleItemContent({
  type,
  item,
  testimonials,
  siblings = [],
}: SingleItemContentProps) {
  const section = SECTION[type];
  const isService = type === "service";
  const post = type === "blog" ? (item as WPPost) : null;
  const allTags = post?.tags?.nodes ?? [];
  const isCover = allTags.some((t) => t.name === COVER_TAG);
  const tags = allTags.filter((t) => t.name !== COVER_TAG);
  const date = "date" in item ? item.date : undefined;
  const image = item.featuredImage?.node ?? null;
  const slug = item.slug;
  const meta = isService ? getServiceMeta(slug) : undefined;
  const { html, toc } = withHeadingIds(item.content ?? "");
  const minutes = readingMinutes(item.content);
  const intro = introFrom(item.excerpt);
  const url = `${SITE.url}${section.path}/${slug}`;

  // Previous / next in the same section
  let list = siblings;
  if (type === "blog")
    list = [...siblings].sort(
      (a, b) => +new Date((b as WPPost).date) - +new Date((a as WPPost).date),
    );
  if (isService)
    list = [...siblings].sort(
      (a, b) =>
        SERVICES.findIndex((s) => s.slug === a.slug) -
        SERVICES.findIndex((s) => s.slug === b.slug),
    );
  const idx = list.findIndex((s) => s.slug === slug);
  const newer = idx > 0 ? list[idx - 1] : undefined;
  const older = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : undefined;

  return (
    <div
      id="content"
      className={`show show--${type}`}
      style={{ "--k": meta?.colour ?? "#4bafeb" } as CSSProperties}
    >
      <ReadingProgress />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: section.label, url: section.path },
          { name: item.title, url: `${section.path}/${slug}` },
        ]}
      />

      <nav className="show__crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href={section.path}>{section.label}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{item.title}</span>
      </nav>

      <header className="show__hero has-sicon">
        {isService && hasServiceIcon(slug) && (
          <ServiceIcon slug={slug} size={72} className="show__icon" />
        )}
        <p className="eyebrow">
          {isService && meta ? `Every Day ${meta.word}` : section.label}
        </p>
        <h1 className="pg-title show__title">
          <ScriptTitle text={item.title} />
        </h1>
        {intro && <p className="show__intro">{intro}</p>}
        <p className="show__meta">
          {date && type === "blog" && <span>{formatDate(date)}</span>}
          <span>{minutes} min read</span>
          {tags.map((t) => (
            <span key={t.name} className="chip">
              {t.name}
            </span>
          ))}
        </p>
      </header>

      {!isService && image?.sourceUrl && (
        <figure
          className={`show__media${isCover || type === "project" ? "" : " show__media--contain"}`}
        >
          <Image
            src={image.sourceUrl}
            alt={image.altText || item.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </figure>
      )}

      {isService && (
        <aside className="show__price">
          <span className="eyebrow">Pricing</span>
          <p>{priceNote(slug)}</p>
          <Link href="/contact" className="btn btn--accent">
            Book a free consultation
          </Link>
        </aside>
      )}

      <div
        className={`show__body${toc.length >= 3 ? "" : " show__body--solo"}`}
      >
        {toc.length >= 3 && <TocSpy items={toc} />}
        <article
          className="project-panel__content prose-edd show__article"
          data-article
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      <div className="show__after">
        {type === "blog" && (
          <div className="show__author">
            <span className="show__author-av" aria-hidden="true">
              SM
            </span>
            <div>
              <p className="show__author-name">Written by {SITE.founder}</p>
              <p>
                Sam runs Every Day Digital in Auckland. He designs and builds
                websites, online stores and business automation, and helps run
                two businesses of his own, so the advice comes from doing it
                every day.
              </p>
            </div>
          </div>
        )}
        <ShareLinks url={url} title={item.title} />
      </div>

      {(older || newer) && (
        <nav
          className="show__pn"
          aria-label={`More ${section.label.toLowerCase()}`}
        >
          {newer ? (
            <Link
              href={`${section.path}/${newer.slug}`}
              className="show__pn-card"
            >
              <span>← {type === "blog" ? "Newer" : "Previous"}</span>
              <b>{newer.title}</b>
            </Link>
          ) : (
            <span />
          )}
          {older && (
            <Link
              href={`${section.path}/${older.slug}`}
              className="show__pn-card show__pn-card--next"
            >
              <span>{type === "blog" ? "Older" : "Next"} →</span>
              <b>{older.title}</b>
            </Link>
          )}
        </nav>
      )}

      {isService && (
        <section className="show__others" aria-labelledby="others-h">
          <h2 id="others-h" className="show__h2">
            Other services
          </h2>
          <ul>
            {SERVICES.filter((s) => s.slug !== slug).map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="has-sicon"
                  style={{ "--k": s.colour } as CSSProperties}
                >
                  <ServiceIcon slug={s.slug} size={36} />
                  <span>{s.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="show__cta">
        <p className="show__cta-script">Every Day.</p>
        <div>
          <p className="show__cta-h">
            {type === "blog"
              ? "Want this done for your business?"
              : type === "project"
                ? "Got a project like this?"
                : `Talk to us about ${item.title.toLowerCase()}.`}
          </p>
          <p>
            A free chat and a fixed-price quote. {excerptText(PRICING.line, 90)}
          </p>
        </div>
        <Link href="/contact" className="btn btn--accent btn--lg">
          Start with a free chat
        </Link>
      </section>

      <Testimonials data={testimonials} />
      <Footer />
    </div>
  );
}
