"use client";

// The hero's "Every Day <word>" <h1>, cycling the word and its background
// gradients, plus a small pause/play button (it would otherwise move forever:
// WCAG 2.2.2). With reduced motion the word stays still and the button is left
// out. Screen readers hear "Every Day Digital" once, not the changing words.
//
// CSS transitions do the blur and fade; JS only swaps the word every ~2.5s
// (an earlier requestAnimationFrame loop ran every frame and slowed scrolling).
// The gradient layers are the #background1–6 divs in app/layout.tsx.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import OutlineIcon from "@/components/shared/OutlineIcon";
import { HERO_GRADIENT_LAYERS } from "@/lib/brand";
import { HERO_WORDS } from "@/lib/services";
import { SITE } from "@/lib/site";

const morphSeconds = 2;
const cooldownSeconds = 0.5;
const blurPx = 12;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** True when the visitor asks for reduced motion (false on the server). */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCED_MOTION);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

export default function HeroWordCycle() {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  // Index of the word shown (sharp) in text1. Starts where the server-rendered
  // markup left off; kept across pause and play so the cycle resumes in place.
  const indexRef = useRef(HERO_WORDS.length - 1);
  const backgroundIndexRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const running = !reducedMotion && !paused;

  useEffect(() => {
    if (!text1Ref.current || !text2Ref.current) return;
    // Re-bind to new consts: TS's control-flow narrowing above doesn't survive
    // into the nested closures below, but a const's inferred type does.
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    // The refs themselves (not their values): they're updated as it cycles
    const index = indexRef;
    const backgroundIndex = backgroundIndexRef;

    const backgrounds = Array.from({ length: HERO_GRADIENT_LAYERS }, (_, i) =>
      document.getElementById(`background${i + 1}`),
    );

    function showNextBackground() {
      backgrounds.forEach((bg) => {
        if (bg) bg.style.opacity = "0";
      });
      if (backgrounds[backgroundIndex.current]) {
        backgrounds[backgroundIndex.current]!.style.opacity = "1";
      }
      // Matches the original off-by-one cadence: one "blank" cycle every 7 turns.
      backgroundIndex.current =
        backgroundIndex.current + 1 > backgrounds.length
          ? 0
          : backgroundIndex.current + 1;
    }

    function snap(el: HTMLSpanElement, sharp: boolean) {
      el.style.transition = "none";
      el.style.filter = sharp ? "blur(0px)" : `blur(${blurPx}px)`;
      el.style.opacity = sharp ? "100%" : "0%";
    }

    /** text1 sharp with the current word, text2 hidden with the next. */
    function rest() {
      text1.textContent = HERO_WORDS[index.current % HERO_WORDS.length];
      snap(text1, true);
      text2.textContent = HERO_WORDS[(index.current + 1) % HERO_WORDS.length];
      snap(text2, false);
    }

    // Initial state (and after a pause): text1 sharp, so there's no flash of
    // blank text; text2 preloaded with the next word, hidden and blurred.
    rest();
    if (!running) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let morphing = false;

    function cycle() {
      // Cooldown: hold the current word sharp for a beat before morphing.
      timeoutId = setTimeout(() => {
        const transition = `filter ${morphSeconds}s ease-in-out, opacity ${morphSeconds}s ease-in-out`;
        text1.style.transition = transition;
        text2.style.transition = transition;
        text1.style.filter = `blur(${blurPx}px)`;
        text1.style.opacity = "0%";
        text2.style.filter = "blur(0px)";
        text2.style.opacity = "100%";
        showNextBackground();
        morphing = true;

        // Once the CSS transition finishes, swap roles and start the next cycle.
        timeoutId = setTimeout(() => {
          morphing = false;
          index.current++;
          rest();
          cycle();
        }, morphSeconds * 1000);
      }, cooldownSeconds * 1000);
    }

    cycle();

    return () => {
      clearTimeout(timeoutId);
      // Paused mid-morph: settle on the incoming word straight away
      if (morphing) {
        index.current++;
        rest();
      }
    };
  }, [running]);

  return (
    <>
      <h1 className="absolute transition-all duration-700">
        <span className="sr-only">{SITE.name}</span>
        <span aria-hidden="true">
          Every Day&nbsp;
          <br className="sm:hidden" />
          <span id="textWrap">
            <span ref={text1Ref} id="text1">
              {HERO_WORDS[HERO_WORDS.length - 1]}
            </span>
            <span ref={text2Ref} id="text2" />
          </span>
        </span>
      </h1>
      {!reducedMotion && (
        <button
          type="button"
          className="hero-pause"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label="Pause the moving title"
        >
          <OutlineIcon className="h-3 w-3">
            {paused ? (
              <polygon points="7 4 19 12 7 20 7 4" />
            ) : (
              <>
                <line x1="9" y1="5" x2="9" y2="19" />
                <line x1="15" y1="5" x2="15" y2="19" />
              </>
            )}
          </OutlineIcon>
        </button>
      )}
    </>
  );
}
