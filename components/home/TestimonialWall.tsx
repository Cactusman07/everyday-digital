import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import type { WPTestimonial } from "@/lib/types";

// Testimonials come from WordPress (the ones currently on the site). The first
// one is set large as a pull quote; the rest in a grid. Empty when WP has none.

function stripTags(html: string) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function TestimonialWall({ data }: { data: WPTestimonial[] }) {
  if (!data?.length) return null;
  const [lead, ...rest] = data;

  return (
    <section
      id="testimonials"
      className="home-section"
      aria-labelledby="testimonials-h"
    >
      <div className="home-wrap">
        <p className="eyebrow">04 — Clients</p>
        <h2 id="testimonials-h" className="display">
          In their words.
        </h2>

        <Reveal>
          <blockquote className="quote-lead">
            <p>“{stripTags(lead.content)}”</p>
            <footer>— {lead.title}</footer>
          </blockquote>
        </Reveal>

        {rest.length > 0 && (
          <Reveal className="quote-grid" as="ul">
            {rest.map((t, i) => (
              <li key={`${t.title}-${i}`} className="quote-card">
                <p>“{stripTags(t.content)}”</p>
                <footer>— {t.title}</footer>
              </li>
            ))}
          </Reveal>
        )}

        <div className="section-actions">
          <Link href="/contact/" className="btn btn--accent">
            Work with us
          </Link>
        </div>
      </div>
    </section>
  );
}
