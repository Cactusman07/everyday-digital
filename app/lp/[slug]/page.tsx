// Landing pages for ads and social: /lp/<slug>. Defined in lib/landing.ts.
// One job per page, one action, no nav distractions. noindex unless the entry
// opts in. UTM parameters pass through to the form's hidden context field so
// the enquiry email says where the lead came from.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LANDING_PAGES, getLandingPage } from "@/lib/landing";
import { PACKAGES, SITE, CASE_STUDIES } from "@/lib/site";
import { getTestimonials, safe } from "@/lib/wordpress";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/motion/Reveal";
import JsonLd from "@/components/JsonLd";
import logo from "@/public/images/EveryDayDigital_Logo_reversed.png";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export function generateStaticParams() {
  return LANDING_PAGES.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lp = getLandingPage(slug);
  if (!lp) return {};
  return {
    title: lp.title,
    description: lp.description,
    robots: lp.indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    alternates: { canonical: `/lp/${lp.slug}/` },
    openGraph: {
      title: lp.title,
      description: lp.description,
      url: `/lp/${lp.slug}/`,
    },
  };
}

function stripTags(html: string) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function LandingPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const lp = getLandingPage(slug);
  if (!lp) notFound();

  const sp = await searchParams;
  const utm = ["utm_source", "utm_medium", "utm_campaign", "utm_content"]
    .map((k) => (typeof sp[k] === "string" ? `${k}=${sp[k]}` : null))
    .filter(Boolean)
    .join("&");
  const context = `lp:${lp.slug}${utm ? ` | ${utm}` : ""}`;

  const pkg = lp.packageId
    ? PACKAGES.find((p) => p.id === lp.packageId)
    : undefined;
  const testimonials = await safe(getTestimonials);
  const quote = testimonials[0];
  const work = CASE_STUDIES.slice(0, 2);

  return (
    <div className={`lp lp--${lp.layout}`}>
      {pkg?.price && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Offer",
            name: pkg.name,
            description: pkg.tagline,
            price: pkg.price,
            priceCurrency: "NZD",
            url: `${SITE.url}/lp/${lp.slug}/`,
            seller: { "@id": `${SITE.url}/#organization` },
          }}
        />
      )}

      {/* Minimal header: logo home-link only. No nav — one job per page. */}
      <header className="lp__head home-wrap">
        <Link href="/" aria-label="Every Day Digital home">
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
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="btn btn--lg"
            >
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
          <p className="eyebrow">
            {lp.layout === "audit" ? "What we check" : "What's included"}
          </p>
          <ul className="case__list">
            {lp.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          {pkg?.fineprint && (
            <p className="pkg__fine lp__fine">{pkg.fineprint}</p>
          )}
        </Reveal>
        {lp.steps && (
          <Reveal>
            <p className="eyebrow">How it works</p>
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

      {lp.layout !== "audit" && (
        <section className="home-section home-section--tight home-wrap">
          <p className="eyebrow">Recent work</p>
          <Reveal className="work-grid" as="ul">
            {work.map((c) => (
              <li
                key={c.slug}
                className={`work-card ${c.ownBusiness ? "work-card--own" : ""}`}
              >
                <Link href={`/projects/${c.slug}/`} className="work-card__link">
                  <div className="work-card__media">
                    <Image
                      src={`/images/work/${c.slug}.png`}
                      alt={`${c.client} website`}
                      fill
                      sizes="(max-width: 760px) 100vw, 50vw"
                      className="work-card__img"
                    />
                  </div>
                  <div className="work-card__body">
                    <span className="work-card__sector">{c.sector}</span>
                    <h3>{c.client}</h3>
                    <p>{c.summary}</p>
                  </div>
                </Link>
              </li>
            ))}
          </Reveal>
        </section>
      )}

      {quote && (
        <section className="home-section home-section--tight home-wrap">
          <Reveal>
            <blockquote className="quote-lead">
              <p>“{stripTags(quote.content)}”</p>
              <footer>— {quote.title}</footer>
            </blockquote>
          </Reveal>
        </section>
      )}

      <section className="home-section home-section--tight home-wrap home-wrap--narrow">
        <p className="eyebrow">Questions</p>
        <div className="faq">
          {lp.faq.map((f) => (
            <details key={f.q} className="faq__item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
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
          © {new Date().getFullYear()} {SITE.legalName} · {SITE.city}
        </span>
        <Link href="/">everydaydigital.co.nz</Link>
      </footer>
    </div>
  );
}
