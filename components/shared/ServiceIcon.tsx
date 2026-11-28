// Inline SVG service icons. Same thick-outline style as the original PNG icons,
// redrawn as SVG so they can take a colour: the outline uses currentColor and
// the shapes marked "ac" are filled with the service's own colour (--k).
// Hover styling: app/styles/components/service-icon.css (.sicon / .has-sicon).

import type { CSSProperties, ReactNode } from "react";
import { DEFAULT_ACCENT } from "@/lib/brand";
import { getServiceMeta } from "@/lib/services";

const gear = (cx: number, cy: number, r: number) => (
  <>
    <circle
      cx={cx}
      cy={cy}
      r={r}
      strokeWidth={r * 0.55}
      strokeDasharray={`${(Math.PI * r) / 8} ${(Math.PI * r) / 8}`}
      strokeLinecap="butt"
    />
    <circle cx={cx} cy={cy} r={r * 0.82} className="ac" />
    <circle cx={cx} cy={cy} r={r * 0.32} />
  </>
);

const ICONS: Record<string, ReactNode> = {
  "website-design": (
    <>
      <rect x="5" y="8" width="54" height="36" rx="4" />
      <path d="M24 56h16M32 44v12" />
      <rect x="12" y="15" width="16" height="22" rx="2" className="ac" />
      <path d="M34 17h18M34 25h18M34 33h10" />
      <circle cx="49" cy="34" r="3" className="ac" />
    </>
  ),
  development: (
    <>
      <rect x="5" y="8" width="54" height="36" rx="4" />
      <path d="M24 56h16M32 44v12" />
      <rect x="14" y="15" width="36" height="22" rx="2" className="ac" />
      <path d="M27 21l-6 5 6 5M37 21l6 5-6 5M34 20l-4 12" />
    </>
  ),
  "custom-application-development": (
    <>
      <rect x="22" y="5" width="20" height="14" rx="3" className="ac" />
      <path d="M32 19v9M14 40v-7a3 3 0 013-3h30a3 3 0 013 3v7" />
      <rect x="4" y="40" width="22" height="18" rx="3" />
      <path d="M12 45l-4 4 4 4M18 45l4 4-4 4" />
      <rect x="38" y="40" width="22" height="18" rx="3" className="ac" />
      <path d="M44 46h10M44 52h6" />
    </>
  ),
  ecommerce: (
    <>
      <path d="M5 9h8l6 30h30l6-22H16" />
      <path d="M20 25h32l-3 14H21z" className="ac" stroke="none" />
      <circle cx="24" cy="50" r="4.5" />
      <circle cx="45" cy="50" r="4.5" />
      <path d="M28 25v8M36 25v8M44 25v8" />
    </>
  ),
  hosting: (
    <>
      <rect x="10" y="6" width="44" height="12" rx="3" className="ac" />
      <rect x="10" y="22" width="44" height="12" rx="3" />
      <rect x="10" y="38" width="44" height="12" rx="3" className="ac" />
      <path d="M17 12h.1M24 12h.1M17 28h.1M24 28h.1M17 44h.1M24 44h.1M38 12h9M38 28h9M38 44h9" />
      <path d="M32 50v8M14 58h36" />
    </>
  ),
  automation: (
    <>
      {gear(22, 24, 11)}
      <path d="M40 14h16M40 22h16M40 30h10" />
      <path d="M22 40v8a4 4 0 004 4h10" />
      <path d="M32 47l5 5-5 5" />
      <circle cx="49" cy="50" r="9" className="ac" />
      <path d="M44.5 50l3.2 3.2 6-6.4" />
    </>
  ),
  "website-reviews": (
    <>
      <rect x="5" y="8" width="46" height="36" rx="4" />
      <path d="M5 17h46M11 12.5h.1M17 12.5h.1" />
      <path d="M12 25h14M12 32h9" />
      <circle cx="40" cy="38" r="11" className="ac" />
      <path d="M48 46l10 10" strokeWidth="5" />
      <path d="M35 38l3.6 3.6 6.4-7" />
    </>
  ),
  "digital-consulting": (
    <>
      <path
        d="M8 8h34a4 4 0 014 4v20a4 4 0 01-4 4H24l-10 8v-8H8a4 4 0 01-4-4V12a4 4 0 014-4z"
        className="ac"
      />
      <path d="M25 30h0M18 18a7 7 0 1110 6.4V27h-6v-2.6A7 7 0 0118 18z" />
      <path d="M52 26h4a4 4 0 014 4v14a4 4 0 01-4 4h-2v7l-8-7H36a4 4 0 01-4-4v-2" />
    </>
  ),
  "digital-management": (
    <>
      {gear(24, 40, 12)}
      <circle cx="14" cy="12" r="7" />
      <path d="M12 9.5v5l4-2.5z" className="ac" />
      <rect x="34" y="5" width="24" height="16" rx="4" className="ac" />
      <path d="M38 10l8 5 8-5" />
      <path d="M16 20c2 4 3 6 4 8M42 22c-3 3-6 6-9 9" strokeDasharray="3 4" />
      <path d="M44 40h14M44 48h14M44 56h8" />
    </>
  ),
};

export const hasServiceIcon = (slug: string) => Object.hasOwn(ICONS, slug);

export default function ServiceIcon({
  slug,
  size = 40,
  className = "",
}: {
  slug: string;
  size?: number;
  className?: string;
}) {
  const icon = ICONS[slug];
  if (!icon) return null;
  const colour = getServiceMeta(slug)?.colour ?? DEFAULT_ACCENT;
  return (
    <svg
      className={`sicon ${className}`}
      style={{ "--k": colour } as CSSProperties}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icon}
    </svg>
  );
}
