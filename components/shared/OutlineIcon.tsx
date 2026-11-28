// A 24×24 outline icon (Feather style) that takes the text colour.
// Children are the SVG shapes, e.g. <line> and <polyline>.

import type { ReactNode } from "react";

export default function OutlineIcon({
  children,
  className,
  strokeWidth = 2,
}: {
  children: ReactNode;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
