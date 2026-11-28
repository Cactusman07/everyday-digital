"use client";

// Staggered reveal — children animate in sequence when the block scrolls into
// view. Pure CSS transitions; JS only flips a class once. Honours
// prefers-reduced-motion (app/styles/components/reveal.css).

import { useEffect, useRef, type ReactNode } from "react";

/** Children after this many animate in together. */
const MAX_STAGGERED = 8;

export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
  stagger = 70,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul";
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          // Cap the stagger, so a long block's later children don't wait
          Array.from(e.target.children).forEach((c, i) =>
            (c as HTMLElement).style.setProperty(
              "--i",
              String(Math.min(i, MAX_STAGGERED)),
            ),
          );
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }
      },
      // Any part of the block 8% above the fold. Not a ratio of the block:
      // a block many screens tall can never show 12% of itself at once, so
      // it would never appear.
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as "div";
  return (
    <Component
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${className}`}
      style={{ "--stagger": `${stagger}ms` } as React.CSSProperties}
    >
      {children}
    </Component>
  );
}
