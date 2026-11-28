"use client";

// Scroll effects for the Dive home page. One requestAnimationFrame loop reads
// the scroll position and updates: the pinned hero and iris, the manifesto
// words, the stacked service cards, the platform marquee, the price counter,
// the sideways work track, the progress bar and the rope climber. Markup lives
// in HomeSections.tsx (server-rendered); this only animates it. With reduced motion
// on, movement is skipped and content stays readable.

import { useEffect } from "react";
import { clamp, onScrollFrame } from "@/lib/scroll";

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

export default function HomeScrollEffects() {
  useEffect(() => {
    const q = <T extends Element = HTMLElement>(s: string) =>
      document.querySelector(s) as T | null;
    const qa = <T extends Element = HTMLElement>(s: string) =>
      Array.from(document.querySelectorAll(s)) as T[];
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const header = q("#header");
    const title = q("#title");
    const h1 = q("#title h1");
    const intro = q("[data-dive-intro]");
    const iris = q("[data-dive-iris]");
    const mani = q("[data-dive-mani]");
    const words = qa("[data-dive-mani] .manifesto__word");
    const svc = q("[data-dive-svc]");
    const svcHead = q("[data-dive-svc-head]");
    const cards = qa("[data-dive-card]");
    const mqRows = qa("[data-dive-mq]");
    const price = q("[data-dive-price]");
    const num = q("[data-dive-num]");
    const hz = q("[data-dive-hz]");
    const track = q("[data-dive-track]");
    const bar = q("[data-dive-bar]");
    const progress = q("[data-dive-progress]");
    const outro = q("[data-dive-outro]");
    const climber = q("[data-climber]");
    const rope = q("[data-climber-rope]");
    const fig = q("[data-climber-fig]");
    const armL = q<SVGPolylineElement>('[data-arm="l"]');
    const armR = q<SVGPolylineElement>('[data-arm="r"]');
    const handL = q<SVGCircleElement>('[data-hand="l"]');
    const handR = q<SVGCircleElement>('[data-hand="r"]');
    const legL = q<SVGPolylineElement>('[data-leg="l"]');
    const legR = q<SVGPolylineElement>('[data-leg="r"]');
    const target = Number(num?.dataset.diveNum ?? 0);

    document.body.classList.add("dive-home");

    // Widths only change on resize, so measure them here rather than every frame
    let trackOverflow = 0; // how far the work track extends past the window
    let rowWidths: number[] = []; // half the width of each marquee row (it repeats)
    const size = () => {
      if (track) trackOverflow = track.scrollWidth - window.innerWidth;
      rowWidths = mqRows.map((r) => r.scrollWidth / 2);
      if (hz && track)
        hz.style.height = `${trackOverflow + window.innerHeight}px`;
      if (svc && svcHead)
        svc.style.setProperty("--svc-head", `${svcHead.offsetHeight + 16}px`);
    };

    // Reveal-on-view for testimonials, blog and the waving figure
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.2 },
    );
    qa("[data-reveal], [data-waver]").forEach((el) => io.observe(el));

    let lastY = window.scrollY;
    let phase = 0;
    let idleTimer = 0;

    const drawClimber = () => {
      const s = Math.sin(phase);
      const c = Math.cos(phase);
      // Hands take turns on the rope (x = 40), elbows bow outwards
      const hl = 24 + 7 * s;
      const hr = 24 - 7 * s;
      armL?.setAttribute(
        "points",
        `36,62 ${26 - 3 * c},${(62 + hl) / 2} 40,${hl}`,
      );
      armR?.setAttribute(
        "points",
        `44,62 ${54 + 3 * c},${(62 + hr) / 2} 40,${hr}`,
      );
      handL?.setAttribute("cy", String(hl));
      handR?.setAttribute("cy", String(hr));
      // Legs swing a little in time
      legL?.setAttribute("points", `36,96 ${31 + 4 * s},118 ${27 + 6 * s},140`);
      legR?.setAttribute("points", `44,96 ${49 - 4 * s},118 ${53 - 6 * s},140`);
    };

    const frame = () => {
      const vh = window.innerHeight;
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const P = clamp(y / max);
      const dy = y - lastY;
      lastY = y;

      if (progress) progress.style.transform = `scaleX(${P})`;

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

      // 3. Service cards: the card underneath shrinks back as the next covers it.
      // All positions are read before any style is written, so the browser
      // lays out once per frame rather than once per card.
      if (!reduce) {
        const rects = cards.map((c) => c.getBoundingClientRect());
        cards.forEach((c, i) => {
          const a = rects[i];
          const b = rects[i + 1];
          if (!b) return;
          const d = clamp(1 - (b.top - a.top) / a.height);
          c.style.transform = `scale(${1 - d * 0.06})`;
          c.style.filter = `brightness(${1 - d * 0.5})`;
        });
      }

      // 4. Platform marquee: rows slide in opposite directions with the scroll
      if (!reduce)
        mqRows.forEach((r, i) => {
          const dir = Number(r.dataset.diveMq);
          const w = rowWidths[i] || 1;
          const x = (((y * 0.45 * dir) % w) + w) % w;
          r.style.transform = `translateX(${-x}px)`;
        });

      // 5. Price: counts up as it comes into view
      if (price && num) {
        const v = reduce ? 1 : clamp((vis(price) - 0.18) / 0.3);
        num.textContent = `$${Math.round((v * target) / 10) * 10}`;
      }

      // 6. Work: vertical scroll moves the track sideways
      if (hz && track) {
        const h = pin(hz);
        track.style.transform = `translateX(${-h * trackOverflow}px)`;
        if (bar) bar.style.width = `${h * 100}%`;
      }

      // 7. Climber: drops in once you start scrolling, then lowers himself
      // down the rope with the page. Hands it over to the waving figure
      // when the closing section arrives.
      if (climber && fig && rope) {
        const entry = clamp(y / (vh * 0.7));
        const top = -170 + entry * (vh * 0.14 + 170) + P * vh * 0.52;
        const o = outro ? outro.getBoundingClientRect().top / vh : 2;
        const leave = clamp((0.95 - o) / 0.35);
        fig.style.transform = `translateY(${top + leave * 60}px)`;
        rope.style.height = `${Math.max(0, top + 24)}px`;
        climber.style.opacity = String(1 - leave);
        if (!reduce && Math.abs(dy) > 0) {
          phase += dy * 0.045;
          drawClimber();
          climber.classList.add("is-moving");
          window.clearTimeout(idleTimer);
          idleTimer = window.setTimeout(
            () => climber.classList.remove("is-moving"),
            180,
          );
        }
      }
    };

    // Section sizes depend on the layout, so re-measure when it can change
    const remeasure = () => {
      size();
      frame();
    };

    size();
    drawClimber();
    const stopScrolling = onScrollFrame(frame);
    window.addEventListener("resize", remeasure);
    window.addEventListener("load", remeasure);
    let alive = true;
    document.fonts?.ready.then(() => alive && remeasure());
    return () => {
      alive = false;
      stopScrolling();
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("load", remeasure);
      window.clearTimeout(idleTimer);
      io.disconnect();
      document.body.classList.remove("dive-home");
      header?.classList.remove("is-diving", "is-done");
      if (h1) h1.style.transform = "";
      if (title) title.style.opacity = "";
    };
  }, []);

  return null;
}
