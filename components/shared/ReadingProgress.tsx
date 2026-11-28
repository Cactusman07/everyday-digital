"use client";

// Thin bar at the top of the window showing how far through the article you
// are, in the hero colours. Measures against the element with [data-article].

import { useEffect, useRef } from "react";
import { clamp, onScrollFrame } from "@/lib/scroll";

export default function ReadingProgress() {
  const bar = useRef<HTMLElement>(null);
  useEffect(() => {
    const article = document.querySelector("[data-article]");
    return onScrollFrame(() => {
      if (!article || !bar.current) return;
      const r = article.getBoundingClientRect();
      // Full once the end of the article is 60% of the way up the window
      const total = Math.max(1, r.height - window.innerHeight * 0.6);
      bar.current.style.transform = `scaleX(${clamp(-r.top / total)})`;
    });
  }, []);
  return (
    <div className="scroll-progress" aria-hidden="true">
      <i ref={bar} />
    </div>
  );
}
