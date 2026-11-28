// Home page FAQ. The same questions are emitted as FAQPage JSON-LD in
// app/(home)/page.tsx so answer engines can quote them.

import FaqList from "@/components/shared/FaqList";
import { FAQ } from "@/lib/faq";

export default function FaqSection() {
  return (
    <section id="faq" className="home-section" aria-labelledby="faq-h">
      <div className="home-wrap home-wrap--narrow">
        <p className="eyebrow">Questions</p>
        <h2 id="faq-h" className="display">
          Before you
          <br />
          get in touch.
        </h2>
        <FaqList items={FAQ} reveal />
      </div>
    </section>
  );
}
