"use client";

// Scroll effects for the Dive home page. One requestAnimationFrame loop reads
// the scroll position and updates the pinned hero, the iris, the manifesto
// words, the stacked service cards, the price counter and the sideways work
// track. Markup lives in Dive.tsx (server-rendered); this only animates it.
// With reduced motion on, transforms are skipped and content stays readable.

import { useEffect } from "react";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// 0 → 1 while a tall section scrolls past a viewport-high sticky child
function pin(el: Element) {
  const r = el.getBoundingClientRect();
  return clamp(-r.top / Math.max(1, r.height - window.innerHeight));
}
// 0 → 1 from entering the bottom of the viewport to leaving the top
function vis(el: Element) {
  const r = el.getBoundingClientRect();
  return clamp((window.innerHeight - r.top) / (window.innerHeight + r.height));
}

export default function DiveEffects() {
  useEffect(() => {
    const q = <T extends HTMLElement>(s: string) =>
      document.querySelector<T>(s);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const header = q("#header");
    const title = q("#title");
    const h1 = q("#title h1");
    const intro = q("[data-dive-intro]");
    const iris = q("[data-dive-iris]");
    const mani = q("[data-dive-mani]");
    const words = Array.from(
      document.querySelectorAll<HTMLElement>("[data-dive-mani] .wd"),
    );
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>("[data-dive-card]"),
    );
    const price = q("[data-dive-price]");
    const num = q("[data-dive-num]");
    const hz = q("[data-dive-hz]");
    const track = q("[data-dive-track]");
    const bar = q("[data-dive-bar]");
    const target = Number(num?.dataset.diveNum ?? 0);

    document.body.classList.add("dive-home");

    const size = () => {
      if (!hz || !track) return;
      hz.style.height = `${track.scrollWidth - window.innerWidth + window.innerHeight}px`;
    };

    let raf = 0;
    const frame = () => {
      raf = 0;
      // 1. Hero: the title grows, then the iris opens over it
      if (intro && header) {
        const p = pin(intro);
        header.classList.toggle("is-diving", p > 0.03);
        header.classList.toggle("is-done", p >= 0.999);
        if (h1 && title) {
          if (!reduce)
            h1.style.transform = `translateY(-40%) scale(${1 + Math.pow(p, 2.2) * 6})`;
          title.style.opacity = String(1 - clamp((p - 0.5) / 0.3));
        }
        if (iris)
          iris.style.clipPath = `circle(${clamp((p - 0.28) / 0.64) * 150}% at 58% 54%)`;
      }
      // 2. Manifesto: words light up in order
      if (mani && words.length) {
        const k = Math.round(clamp(pin(mani) / 0.85) * words.length);
        words.forEach((w, i) => w.classList.toggle("on", i < k));
      }
      // 3. Service cards: the card underneath shrinks back as the next covers it
      if (!reduce)
        cards.forEach((c, i) => {
          const n = cards[i + 1];
          if (!n) return;
          const a = c.getBoundingClientRect();
          const b = n.getBoundingClientRect();
          const d = clamp(1 - (b.top - a.top) / a.height);
          c.style.transform = `scale(${1 - d * 0.06})`;
          c.style.filter = `brightness(${1 - d * 0.45})`;
        });
      // 4. Price: counts up as it comes into view
      if (price && num) {
        const v = reduce ? 1 : clamp((vis(price) - 0.18) / 0.3);
        num.textContent = `$${Math.round((v * target) / 10) * 10}`;
      }
      // 5. Work: vertical scroll moves the track sideways
      if (hz && track) {
        const h = pin(hz);
        track.style.transform = `translateX(${-h * (track.scrollWidth - window.innerWidth)}px)`;
        if (bar) bar.style.width = `${h * 100}%`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      size();
      frame();
    };

    size();
    frame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      if (raf) cancelAnimationFrame(raf);
      document.body.classList.remove("dive-home");
      header?.classList.remove("is-diving", "is-done");
      if (h1) h1.style.transform = "";
      if (title) title.style.opacity = "";
    };
  }, []);

  return null;
}
