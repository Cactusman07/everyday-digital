"use client";

// Number ticks up from 0 to `to` when scrolled into view. Server-renders the
// final value so the number is correct without JS and for crawlers; the
// animation only replaces it visually once the client mounts.

import { useEffect, useRef } from "react";

export default function CountUp({
  to,
  suffix = "",
  className = "",
  duration = 1100,
}: {
  to: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const io = new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0]?.isIntersecting) return;
        obs.disconnect();
        const t0 = performance.now();
        const step = (t: number) => {
          const p = Math.min((t - t0) / duration, 1);
          el.textContent = `${Math.round(to * ease(p))}${suffix}`;
          if (p < 1) requestAnimationFrame(step);
        };
        el.textContent = `0${suffix}`;
        requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {to}
      {suffix}
    </span>
  );
}
