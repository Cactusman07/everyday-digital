import Reveal from "@/components/motion/Reveal";
import { FAQ } from "@/lib/site";

// Native <details> — no JS, keyboard-accessible, and the same text is emitted
// as FAQPage JSON-LD in app/page.tsx so answer engines can quote it.

export default function FaqSection() {
  return (
    <section id="faq" className="home-section" aria-labelledby="faq-h">
      <div className="home-wrap home-wrap--narrow">
        <p className="eyebrow">05 — Questions</p>
        <h2 id="faq-h" className="display">
          Before you
          <br />
          get in touch.
        </h2>
        <Reveal className="faq" stagger={50}>
          {FAQ.map((f) => (
            <details key={f.q} className="faq__item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
