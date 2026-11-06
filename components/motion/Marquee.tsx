// Server Component — pure CSS marquee. Items are duplicated once so the loop is
// seamless; the animation is in globals.css and pauses on hover and under
// prefers-reduced-motion.

import type { ReactNode } from "react";

export default function Marquee({
  items,
  reverse = false,
  size = "lg",
  className = "",
  ariaLabel,
}: {
  items: ReactNode[];
  reverse?: boolean;
  size?: "lg" | "sm";
  className?: string;
  ariaLabel?: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div
      className={`marquee marquee--${size} ${reverse ? "marquee--reverse" : ""} ${className}`}
      aria-label={ariaLabel}
      role={ariaLabel ? "region" : undefined}
    >
      <ul>
        {doubled.map((item, i) => (
          <li key={i} aria-hidden={i >= items.length ? true : undefined}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
