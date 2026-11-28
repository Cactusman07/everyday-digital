// A testimonial as a pull quote. By default only its opening line, large, for
// landing pages; `full` shows the whole quote in readable type, for case
// studies. (The full quote is also in the testimonial cards.)

import type { Testimonial } from "@/lib/testimonials";

export default function PullQuote({
  testimonial,
  full = false,
  className = "",
}: {
  testimonial: Testimonial;
  full?: boolean;
  className?: string;
}) {
  const { lead, rest, name, company } = testimonial;
  const text = full && rest ? `${lead} ${rest}` : lead;
  return (
    <figure
      className={`quote-lead ${full ? "quote-lead--full" : ""} ${className}`.trim()}
    >
      <blockquote>
        <p>“{text}”</p>
      </blockquote>
      <figcaption>
        — {name}
        {company && `, ${company}`}
      </figcaption>
    </figure>
  );
}
