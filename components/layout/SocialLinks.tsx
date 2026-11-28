// LinkedIn and Facebook icon links. Inline SVG so they match and take the
// text colour.

import { SOCIAL_LINKS } from "@/lib/navigation";
import { SITE } from "@/lib/site";

/** Icon outlines (24×24), keyed by SOCIAL_LINKS id. */
const ICON_PATHS: Record<(typeof SOCIAL_LINKS)[number]["id"], string> = {
  facebook:
    "M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.4V21h3.1z",
  linkedin:
    "M6.9 8.8H3.8V20h3.1V8.8zM5.3 4a1.8 1.8 0 100 3.6 1.8 1.8 0 000-3.6zM20.2 13.6c0-3-.6-5.1-4.1-5.1-1.7 0-2.8.9-3.2 1.8h-.1V8.8h-3V20h3.1v-5.5c0-1.5.3-2.9 2.1-2.9s1.8 1.7 1.8 3V20h3.1l.3-6.4z",
};

export default function SocialLinks({
  className = "flex md:block relative",
}: {
  /** Layout classes; the default stacks the icons on desktop. */
  className?: string;
}) {
  return (
    <div className={`social-links ${className} bottom-0 left-0 md:left-5 z-20`}>
      {SOCIAL_LINKS.map((i) => (
        <a
          key={i.id}
          className="social-icon md:mb-3 mr-3"
          target="_blank"
          rel="noreferrer"
          href={i.href}
          aria-label={`${SITE.name} on ${i.label}`}
        >
          <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
            <path d={ICON_PATHS[i.id]} fill="currentColor" />
          </svg>
        </a>
      ))}
    </div>
  );
}
