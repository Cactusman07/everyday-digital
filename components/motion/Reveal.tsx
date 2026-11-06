"use client";

// Staggered reveal — children animate in sequence when the block scrolls into
// view. Pure CSS transitions; JS only flips a class once. Honours
// prefers-reduced-motion (see globals.css: the .reveal rules are skipped).

import { useEffect, useRef, type ReactNode } from "react";

export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
  stagger = 70,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "section";
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
          Array.from(e.target.children).forEach((c, i) =>
            (c as HTMLElement).style.setProperty("--i", String(i)),
          );
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
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
