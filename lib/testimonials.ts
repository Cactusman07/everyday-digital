// Testimonials come from WordPress as a title ("David Kerr - NZ In Pictures"),
// an HTML body and, optionally, the project they're about (chosen in the
// editor; see wpTheme/functions.php). This turns them into the parts the cards
// show and links each one to its project.

import { getCaseStudy } from "./case-studies";
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
  /** The client's website. */
  url?: string;
  /** The linked project's page, e.g. "/projects/nz-in-pictures". */
  projectPath?: string;
  /** True when the linked project has a full case study. */
  isCaseStudy: boolean;
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
  const cs = t.projectSlug ? getCaseStudy(t.projectSlug) : undefined;

  return {
    name,
    company,
    initials: initialsOf(name),
    lead: first.trim(),
    rest: rest || undefined,
    text,
    url:
      cs?.url ?? (site ? `https://${site.replace(/^www\./, "")}` : undefined),
    projectPath: t.projectSlug ? itemPath("project", t.projectSlug) : undefined,
    isCaseStudy: !!cs,
  };
}

/** The testimonial linked to a project, if WordPress has one. */
export function testimonialFor(
  projectSlug: string,
  testimonials: WPTestimonial[],
): Testimonial | undefined {
  const linked = testimonials.find((t) => t.projectSlug === projectSlug);
  return linked && parseTestimonial(linked);
}
