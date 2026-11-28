// Full-page showcase for a blog post, project or service.
//
// Layout: breadcrumb, large script title with a short intro and meta line
// (date, reading time, tags), the featured image (or, for services, the
// price note), then the article beside a sticky "On this page" contents list.
// Below: author (blog), share links, previous/next, other services (service
// pages), a call to action, testimonials and the footer. A reading progress
// bar runs along the top of the window.

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import SiteFooter from "@/components/layout/SiteFooter";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import ArticleBody from "@/components/shared/ArticleBody";
import CallToActionBand from "@/components/shared/CallToActionBand";
import FounderAvatar from "@/components/shared/FounderAvatar";
import ScriptTitle from "@/components/shared/ScriptTitle";
import ServiceIcon from "@/components/shared/ServiceIcon";
import Testimonials from "@/components/shared/Testimonials";
import { DEFAULT_ACCENT } from "@/lib/brand";
import { formatDate, newestFirst } from "@/lib/dates";
import { readingMinutes, stripHtml } from "@/lib/html";
import { PRICE_COPY } from "@/lib/pricing";
import {
  SERVICES,
  getServiceMeta,
  servicePriceNote,
  sortByServiceOrder,
} from "@/lib/services";
import { FOUNDER, absoluteUrl } from "@/lib/site";
import {
  isCoverPost,
  postTags,
  type WPPost,
  type WPProject,
  type WPService,
  type WPTestimonial,
} from "@/lib/wordpress";
import { itemPath, sectionOf } from "@/lib/wordpress/content-types";
import ShareLinks from "@/components/shared/ShareLinks";
import { isCmsMediaUrl } from "@/lib/wordpress/images";
import BookingLink from "@/components/shared/BookingLink";

/** The item being shown, tagged by type so each branch gets the right fields. */
type ShowcaseItem =
  | { type: "post"; item: WPPost; siblings: WPPost[] }
  | { type: "project"; item: WPProject; siblings: WPProject[] }
  | { type: "service"; item: WPService; siblings: WPService[] };

/**
 * WordPress auto-excerpts end with an ellipsis; only hand-written ones are
 * shown as the intro, otherwise they just repeat the first paragraph.
 */
function handWrittenIntro(excerpt?: string) {
  const text = stripHtml(excerpt);
  return !text || /(\[…\]|…|\.\.\.)$/.test(text) ? "" : text;
}

/** Siblings in reading order: posts newest first, services in menu order. */
function ordered({ type, siblings }: ShowcaseItem) {
  if (type === "post") return newestFirst(siblings);
  if (type === "service") return sortByServiceOrder(siblings);
  return siblings;
}

function ctaHeading(s: ShowcaseItem) {
  if (s.type === "post") return "Want this done for your business?";
  if (s.type === "project") return "Got a project like this?";
  return `Talk to us about ${s.item.title.toLowerCase()}.`;
}

function PreviousNext({ showcase }: { showcase: ShowcaseItem }) {
  const { type, item } = showcase;
  const section = sectionOf(type);
  const list = ordered(showcase);
  const i = list.findIndex((s) => s.slug === item.slug);
  const before = i > 0 ? list[i - 1] : undefined;
  const after = i >= 0 && i < list.length - 1 ? list[i + 1] : undefined;
  if (!before && !after) return null;
  const isPost = type === "post";
  return (
    <nav
      className="show__pn"
      aria-label={`More ${section.label.toLowerCase()}`}
    >
      {before ? (
        <Link href={itemPath(type, before.slug)} className="show__pn-card">
          <span>← {isPost ? "Newer" : "Previous"}</span>
          <b>{before.title}</b>
        </Link>
      ) : (
        <span />
      )}
      {after && (
        <Link
          href={itemPath(type, after.slug)}
          className="show__pn-card show__pn-card--next"
        >
          <span>{isPost ? "Older" : "Next"} →</span>
          <b>{after.title}</b>
        </Link>
      )}
    </nav>
  );
}

function OtherServices({ current }: { current: string }) {
  return (
    <section className="show__others" aria-labelledby="others-h">
      <h2 id="others-h" className="show__h2">
        Other services
      </h2>
      <ul>
        {SERVICES.filter((s) => s.slug !== current).map((s) => (
          <li key={s.slug}>
            <Link
              href={itemPath("service", s.slug)}
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
  );
}

export default function ItemShowcase({
  showcase,
  testimonials,
}: {
  showcase: ShowcaseItem;
  testimonials: WPTestimonial[];
}) {
  const { type, item } = showcase;
  const section = sectionOf(type);
  const path = itemPath(type, item.slug);
  const post = showcase.type === "post" ? showcase.item : undefined;
  const service = type === "service" ? getServiceMeta(item.slug) : undefined;
  const image = item.featuredImage?.node;
  const intro = handWrittenIntro(item.excerpt);

  return (
    // .inner-page: the small logo and offset content of every inner page
    <div className="inner-page">
      <div
        id="content"
        className="show"
        style={{ "--k": service?.colour ?? DEFAULT_ACCENT } as CSSProperties}
      >
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "/" },
            { name: section.label, url: section.path },
            { name: item.title, url: path },
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
          {service && (
            <ServiceIcon slug={item.slug} size={72} className="show__icon" />
          )}
          <p className="eyebrow">
            {service ? `Every Day ${service.word}` : section.label}
          </p>
          <h1 className="page-title show__title">
            <ScriptTitle text={item.title} />
          </h1>
          {intro && <p className="show__intro">{intro}</p>}
          <p className="show__meta">
            {post && <span>{formatDate(post.date)}</span>}
            <span>{readingMinutes(item.content)} min read</span>
            {post &&
              postTags(post).map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
          </p>
        </header>

        {type === "service" ? (
          <aside className="show__price">
            <span className="eyebrow">Pricing</span>
            <p>{servicePriceNote(item.slug)}</p>
            <BookingLink className="btn btn--accent">
              Book a free consultation
            </BookingLink>
          </aside>
        ) : (
          isCmsMediaUrl(image?.sourceUrl) && (
            // Projects and "cover" posts fill the frame; other images show whole
            <figure
              className={`show__media${type === "project" || (post && isCoverPost(post)) ? "" : " show__media--contain"}`}
            >
              <Image
                src={image.sourceUrl}
                alt={image.altText || item.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </figure>
          )
        )}

        <ArticleBody html={item.content} as="article" alwaysShowProgress />

        <div className="show__after">
          {post && (
            <div className="show__author">
              <FounderAvatar size={54} className="show__author-av" />
              <div>
                <p className="show__author-name">Written by {FOUNDER.name}</p>
                <p>{FOUNDER.bio}</p>
              </div>
            </div>
          )}
          <ShareLinks url={absoluteUrl(path)} title={item.title} />
        </div>

        <PreviousNext showcase={showcase} />
        {type === "service" && <OtherServices current={item.slug} />}

        <CallToActionBand
          heading={ctaHeading(showcase)}
          text={`A free chat and a fixed-price quote. ${PRICE_COPY.website}`}
        />

        <Testimonials testimonials={testimonials} />
        <SiteFooter />
      </div>
    </div>
  );
}
