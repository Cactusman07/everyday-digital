"use client";

// Thin bar at the top of the window showing how far through the article you
// are, in the hero colours. Measures against the element with [data-article].

import { useEffect, useRef } from "react";

export default function ReadingProgress() {
  const bar = useRef<HTMLElement>(null);
  useEffect(() => {
    const article = document.querySelector("[data-article]");
    let raf = 0;
    const frame = () => {
      raf = 0;
      if (!article || !bar.current) return;
      const r = article.getBoundingClientRect();
      const total = Math.max(1, r.height - window.innerHeight * 0.6);
      const p = Math.min(1, Math.max(0, -r.top / total));
      bar.current.style.transform = `scaleX(${p})`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    frame();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className="dive-progress" aria-hidden="true">
      <i ref={bar} />
    </div>
  );
}
