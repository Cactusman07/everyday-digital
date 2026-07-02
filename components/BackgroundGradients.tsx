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

const morphTime = 2;
const cooldownTime = 0.5;

export default function BackgroundGradients() {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const stateRef = useRef({
    textIndex: texts.length - 1,
    backgroundIndex: 0,
    time: 0,
    morph: 0,
    cooldown: cooldownTime,
  });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    if (!text1 || !text2) return;

    const backgrounds = Array.from({ length: 6 }, (_, i) =>
      document.getElementById(`background${i + 1}`),
    );

    const state = stateRef.current;
    state.time = Date.now();
    text1.textContent = texts[state.textIndex % texts.length];
    text2.textContent = texts[(state.textIndex + 1) % texts.length];

    function changeBackground(idx: number) {
      backgrounds.forEach((bg) => {
        if (bg) bg.style.opacity = "0";
      });
      if (idx < backgrounds.length && backgrounds[idx]) {
        backgrounds[idx]!.style.opacity = "1";
      }
    }

    function setMorph(fraction: number) {
      text2!.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      text2!.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const inv = 1 - fraction;
      text1!.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
      text1!.style.opacity = `${Math.pow(inv, 0.4) * 100}%`;

      text1!.textContent = texts[state.textIndex % texts.length];
      text2!.textContent = texts[(state.textIndex + 1) % texts.length];
    }

    function doCooldown() {
      state.morph = 0;
      text2!.style.filter = "";
      text2!.style.opacity = "100%";
      text1!.style.filter = "";
      text1!.style.opacity = "0%";
    }

    function doMorph() {
      state.morph -= state.cooldown;
      state.cooldown = 0;
      let fraction = state.morph / morphTime;
      if (fraction > 1) {
        state.cooldown = cooldownTime;
        fraction = 1;
      }
      setMorph(fraction);
    }

    function animate() {
      rafRef.current = requestAnimationFrame(animate);

      const newTime = Date.now();
      const shouldIncrementIndex = state.cooldown > 0;
      const dt = (newTime - state.time) / 1000;
      state.time = newTime;
      state.cooldown -= dt;

      if (state.cooldown <= 0) {
        if (shouldIncrementIndex) {
          state.textIndex++;
          changeBackground(state.backgroundIndex);
          state.backgroundIndex++;
          if (state.backgroundIndex > backgrounds.length) {
            state.backgroundIndex = 0;
          }
        }
        doMorph();
      } else {
        doCooldown();
      }
    }

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <span ref={text1Ref} id="text1" />
      <span ref={text2Ref} id="text2" />
    </>
  );
}
