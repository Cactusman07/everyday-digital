// One testimonial as a large pull quote, for landing pages and case studies.

import type { Testimonial } from "@/lib/testimonials";

export default function PullQuote({
  testimonial,
  className = "",
}: {
  testimonial: Testimonial;
  className?: string;
}) {
  const { text, name, company } = testimonial;
  return (
    <blockquote className={`quote-lead ${className}`.trim()}>
      <p>“{text}”</p>
      <footer>
        — {name}
        {company && `, ${company}`}
      </footer>
    </blockquote>
  );
}
