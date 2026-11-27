// Animates the hero's rotating word and gradients. The browser's CSS
// transitions do the blur/fade; JS only swaps the word every ~2.5s (an
// earlier requestAnimationFrame loop ran every frame and slowed scrolling).
"use client";

import { useEffect, useRef } from "react";

const texts = [
  "Digital",
  "Automation",
  "Design",
  "Reliability",
  "Innovation",
  "Mentoring",
  "Strategy",
];

const morphSeconds = 2;
const cooldownSeconds = 0.5;
const blurPx = 12;

export default function BackgroundGradients() {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!text1Ref.current || !text2Ref.current) return;
    // Re-bind to new consts: TS's control-flow narrowing above doesn't survive
    // into the nested closures below, but a const's inferred type does.
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;

    const backgrounds = Array.from({ length: 6 }, (_, i) =>
      document.getElementById(`background${i + 1}`),
    );

    // Index of the word currently shown (sharp) in text1. Starts where the
    // server-rendered markup left off, so the effect never "restarts" the word.
    let index = texts.length - 1;
    let backgroundIndex = 0;

    function showNextBackground() {
      backgrounds.forEach((bg) => {
        if (bg) bg.style.opacity = "0";
      });
      if (backgrounds[backgroundIndex]) {
        backgrounds[backgroundIndex]!.style.opacity = "1";
      }
      // Matches the original off-by-one cadence: one "blank" cycle every 7 turns.
      backgroundIndex =
        backgroundIndex + 1 > backgrounds.length ? 0 : backgroundIndex + 1;
    }

    function snap(el: HTMLSpanElement, sharp: boolean) {
      el.style.transition = "none";
      el.style.filter = sharp ? "blur(0px)" : `blur(${blurPx}px)`;
      el.style.opacity = sharp ? "100%" : "0%";
    }

    // Initial state: text1 is already server-rendered and sharp (no flash of
    // blank text), text2 is preloaded with the next word, hidden and blurred.
    snap(text1, true);
    text2.textContent = texts[(index + 1) % texts.length];
    snap(text2, false);

    let timeoutId: ReturnType<typeof setTimeout>;

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

        // Once the CSS transition finishes, swap roles and start the next cycle.
        timeoutId = setTimeout(() => {
          index++;
          text1.textContent = texts[index % texts.length];
          snap(text1, true);
          text2.textContent = texts[(index + 1) % texts.length];
          snap(text2, false);
          cycle();
        }, morphSeconds * 1000);
      }, cooldownSeconds * 1000);
    }

    cycle();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <span ref={text1Ref} id="text1">
        {texts[texts.length - 1]}
      </span>
      <span ref={text2Ref} id="text2" />
    </>
  );
}
