"use client";

import { useState } from "react";

type FadeProps = {
  show: boolean;
  fadeIn?: boolean;
  fadeOut?: boolean;
  children: React.ReactNode;
};

export default function Fade({ show, fadeIn, fadeOut, children }: FadeProps) {
  const [animating, setAnimating] = useState(false);

  const visible = show || animating;

  if (!visible) return null;

  return (
    <div
      style={{
        animation: `${show ? (fadeIn ? "fadeIn" : "") : fadeOut ? "fadeOut" : ""} 1.5s`,
      }}
      onAnimationStart={() => setAnimating(true)}
      onAnimationEnd={() => setAnimating(false)}
    >
      {children}
    </div>
  );
}
