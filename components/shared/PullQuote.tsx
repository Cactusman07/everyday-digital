// The opening line of a testimonial as a large pull quote, for landing pages
// and case studies. (The full quote is in the testimonial cards.)

import type { Testimonial } from "@/lib/testimonials";

export default function PullQuote({
  testimonial,
  className = "",
}: {
  testimonial: Testimonial;
  className?: string;
}) {
  const { lead, name, company } = testimonial;
  return (
    <figure className={`quote-lead ${className}`.trim()}>
      <blockquote>
        <p>“{lead}”</p>
      </blockquote>
      <figcaption>
        — {name}
        {company && `, ${company}`}
      </figcaption>
    </figure>
  );
}
