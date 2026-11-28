// Questions and answers as native <details>: no JavaScript, keyboard
// accessible, and readable by crawlers with every answer collapsed.

import type { FaqItem } from "@/lib/faq";
import Reveal from "./Reveal";

export default function FaqList({
  items,
  reveal = false,
}: {
  items: FaqItem[];
  /** Stagger the questions in as the list scrolls into view. */
  reveal?: boolean;
}) {
  const list = items.map((f) => (
    <details key={f.q} className="faq__item">
      <summary>{f.q}</summary>
      <p>{f.a}</p>
    </details>
  ));
  return reveal ? (
    <Reveal className="faq" stagger={50}>
      {list}
    </Reveal>
  ) : (
    <div className="faq">{list}</div>
  );
}
