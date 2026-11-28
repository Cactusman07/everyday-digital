// Testimonials come from WordPress as a title ("David Kerr - NZ In Pictures")
// and an HTML body. This turns them into the parts the cards show and links
// each one to its client's case study where there is one.

import { CASE_STUDIES, type CaseStudyMeta } from "./case-studies";
import { stripHtml } from "./html";
import { itemPath } from "./wordpress/content-types";
import type { WPTestimonial } from "./wordpress/types";

export interface Testimonial {
  name: string;
  company: string;
  initials: string;
  /** First sentence, shown larger. */
  lead: string;
  /** The rest of the quote. */
  rest?: string;
  /** The full quote as one plain-text string. */
  text: string;
  url?: string;
  /** Path of the matching case study, e.g. "/projects/nz-in-pictures". */
  caseStudy?: string;
}

/** Lower-case letters and digits only, minus "ltd"/"limited", for loose name matching. */
const normalise = (s: string) =>
  s
    .toLowerCase()
    .replace(/\b(ltd|limited)\b/g, "")
    .replace(/[^a-z0-9]/g, "");

/**
 * True when two business names refer to the same client, allowing for
 * suffixes and punctuation ("Plow Foods Ltd" matches "Plow Foods").
 */
export function isSameClient(a: string, b: string): boolean {
  const [short, long] = [normalise(a), normalise(b)].sort(
    (p, q) => p.length - q.length,
  );
  // A prefix match needs a few letters, so "NZ" alone can't match "NZ In Pictures"
  return (
    !!short && (short === long || (short.length >= 5 && long.startsWith(short)))
  );
}

function initialsOf(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return name.slice(0, 2).toUpperCase();
  return words
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Splits a WordPress testimonial into name, company and quote. A signature
 * block at the end of the body (name plus web address) is dropped because
 * the card shows the name and company as its header.
 */
export function parseTestimonial(t: WPTestimonial): Testimonial {
  const [rawName, ...companyParts] = t.title.split(/\s+[-–—]\s+/);
  const name = rawName.trim();
  const company = companyParts.join(" – ");

  const isSignature = (p: string) =>
    !!name &&
    p.includes(name) &&
    (/www\.|\.co\.nz|\.com/.test(p) || p.length < 80);
  const paras = (t.content.match(/<p[^>]*>[\s\S]*?<\/p>/gi) ?? [t.content])
    .map((p) => stripHtml(p))
    .filter((p) => p && !isSignature(p));

  const text = paras.join(" ");
  const [first = text] = text.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [];
  const rest = text.slice(first.length).trim();

  const site = /(?:www\.)?[a-z0-9-]+\.(?:co\.nz|com|nz)/i.exec(t.content)?.[0];
  const cs = company ? findCaseStudy(company) : undefined;

  return {
    name,
    company,
    initials: initialsOf(name),
    lead: first.trim(),
    rest: rest || undefined,
    text,
    url:
      cs?.url ?? (site ? `https://${site.replace(/^www\./, "")}` : undefined),
    caseStudy: cs ? itemPath("project", cs.slug) : undefined,
  };
}

function findCaseStudy(company: string): CaseStudyMeta | undefined {
  return CASE_STUDIES.find((c) => isSameClient(c.client, company));
}

/** The testimonial from a given client, if WordPress has one. */
export function testimonialFor(
  client: string,
  testimonials: WPTestimonial[],
): Testimonial | undefined {
  return testimonials
    .map(parseTestimonial)
    .find((t) => isSameClient(t.company, client));
}
