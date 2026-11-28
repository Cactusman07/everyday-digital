// Landing pages for ads and social: /lp/<slug>, defined in lib/landing.ts.
// One job per page, one action, no nav distractions; noindex unless the entry
// opts in. UTM parameters pass through to the form's hidden context field so
// the enquiry email says where the lead came from.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LandingOfferJsonLd } from "@/components/seo/JsonLd";
import CaseStudyCards from "@/components/shared/CaseStudyCards";
import ContactForm from "@/components/shared/ContactForm";
import FaqList from "@/components/shared/FaqList";
import PullQuote from "@/components/shared/PullQuote";
import Reveal from "@/components/shared/Reveal";
import { CASE_STUDIES } from "@/lib/case-studies";
import { LANDING_PAGES, getLandingPage, type LandingPage } from "@/lib/landing";
import { pageMetadata } from "@/lib/seo";
import { SITE, copyright, telHref } from "@/lib/site";
import { parseTestimonial } from "@/lib/testimonials";
import { getTestimonials, safe } from "@/lib/wordpress";
import logo from "@/public/images/EveryDayDigital_Logo_reversed.png";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Query parameters copied into the enquiry's context field. */
const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
];

/** How many case studies the "Recent work" section shows. */
const RECENT_WORK_COUNT = 2;

export function generateStaticParams() {
  return LANDING_PAGES.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lp = getLandingPage((await params).slug);
  if (!lp) return {};
  return pageMetadata({
    title: lp.title,
    description: lp.description,
    path: `/lp/${lp.slug}`,
    noindex: !lp.indexable,
  });
}

/** "lp:<slug> | utm_source=…&utm_medium=…" for the enquiry email. */
function enquiryContext(
  lp: LandingPage,
  query: Record<string, string | string[] | undefined>,
) {
  const utm = TRACKED_PARAMS.flatMap((k) => {
    const v = query[k];
    return typeof v === "string" ? [`${k}=${v}`] : [];
  }).join("&");
  return `lp:${lp.slug}${utm ? ` | ${utm}` : ""}`;
}

export default async function LandingPageRoute({
  params,
  searchParams,
}: Props) {
  const lp = getLandingPage((await params).slug);
  if (!lp) notFound();

  const context = enquiryContext(lp, await searchParams);
  const [first] = await safe(getTestimonials);
  const quote = first && parseTestimonial(first);

  return (
    <div className="lp">
      {lp.price && (
        <LandingOfferJsonLd
          name={lp.title}
          description={lp.description}
          price={lp.price}
          path={`/lp/${lp.slug}`}
        />
      )}

      {/* Minimal header: logo home-link only. No nav — one job per page. */}
      <header className="lp__head home-wrap">
        <Link href="/" aria-label={`${SITE.name} home`}>
          <Image src={logo} alt="" className="w-12 sm:w-14" priority />
        </Link>
        <a href="#enquire" className="btn btn--accent">
          {lp.cta}
        </a>
      </header>

      <section className="lp__hero home-wrap">
        <Reveal>
          <p className="eyebrow">{lp.eyebrow}</p>
          <h1 className="display lp__title">{lp.title}</h1>
          <p className="lede lp__lede">{lp.description}</p>
          <div className="section-actions">
            <a href="#enquire" className="btn btn--accent btn--lg">
              {lp.cta}
            </a>
            <a href={telHref()} className="btn btn--lg">
              Call {SITE.phone}
            </a>
          </div>
        </Reveal>
        <Reveal className="stats lp__proof" as="ul">
          {lp.proof.map((p) => (
            <li key={p.label}>
              <b className="stats__text">{p.value}</b>
              <small>{p.label}</small>
            </li>
          ))}
        </Reveal>
      </section>

      <section className="home-section home-section--tight home-wrap lp__two">
        <Reveal>
          <h2 className="eyebrow">
            {lp.isReview ? "What we check" : "What's included"}
          </h2>
          <ul className="case__list">
            {lp.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          {lp.fineprint && <p className="pkg__fine lp__fine">{lp.fineprint}</p>}
        </Reveal>
        {lp.steps && (
          <Reveal>
            <h2 className="eyebrow">How it works</h2>
            <ol className="lp__steps">
              {lp.steps.map((s, i) => (
                <li key={s.title}>
                  <span className="lp__step-n">{i + 1}</span>
                  <div>
                    <b>{s.title}</b>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        )}
      </section>

      {!lp.isReview && (
        <section className="home-section home-section--tight home-wrap">
          <h2 className="eyebrow">Recent work</h2>
          <CaseStudyCards studies={CASE_STUDIES.slice(0, RECENT_WORK_COUNT)} />
        </section>
      )}

      {quote && (
        <section className="home-section home-section--tight home-wrap">
          <Reveal>
            <PullQuote testimonial={quote} />
          </Reveal>
        </section>
      )}

      <section className="home-section home-section--tight home-wrap home-wrap--narrow">
        <h2 className="eyebrow">Questions</h2>
        <FaqList items={lp.faq} />
      </section>

      <section id="enquire" className="home-section home-wrap lp__form">
        <div className="final-cta">
          <div>
            <p className="eyebrow">Enquire</p>
            <h2 className="display lp__form-title">{lp.cta}.</h2>
            <p className="lede">
              A reply the same day. No obligation, no mailing list.
            </p>
            <p className="final-cta__mail">
              {SITE.email} · {SITE.phone}
            </p>
          </div>
          <ContactForm
            defaultService={lp.formService}
            context={context}
            compact
            submitLabel={lp.cta}
          />
        </div>
      </section>

      <footer className="lp__foot home-wrap">
        <span>
          {copyright()} · {SITE.city}
        </span>
        <Link href="/">{SITE.domain}</Link>
      </footer>
    </div>
  );
}
