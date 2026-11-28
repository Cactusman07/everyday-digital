"use client";

// "On this page" contents list that highlights the section you're reading.

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/html";

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const heads = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (es) => {
        const vis = es
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    heads.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav aria-label="On this page" className="show__toc">
      <p className="show__toc-h">On this page</p>
      <ol>
        {items.map((i) => (
          <li key={i.id} className={i.level === 3 ? "is-sub" : undefined}>
            <a
              href={`#${i.id}`}
              className={active === i.id ? "is-on" : undefined}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
