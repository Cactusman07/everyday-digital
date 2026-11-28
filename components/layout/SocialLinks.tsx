// LinkedIn, Facebook and Instagram icon links. Inline SVG so all three match
// and take the text colour.

import { SOCIAL_LINKS } from "@/lib/navigation";
import { SITE } from "@/lib/site";

/** Icon outlines (24×24), keyed by SOCIAL_LINKS id. */
const ICON_PATHS: Record<(typeof SOCIAL_LINKS)[number]["id"], string> = {
  facebook:
    "M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.4V21h3.1z",
  instagram:
    "M12 7.4a4.6 4.6 0 100 9.2 4.6 4.6 0 000-9.2zm0 7.6a3 3 0 110-6 3 3 0 010 6zm4.8-8.9a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2zM21 8.3c0-1.3-.3-2.4-1.2-3.3S17.8 3.9 16.5 3.8C15.2 3.7 8.8 3.7 7.5 3.8 6.2 3.9 5.1 4.2 4.2 5.1S3.9 7 3.8 8.3c-.1 1.3-.1 7.7 0 9 .1 1.3.3 2.4 1.2 3.3s2 1.1 3.3 1.2c1.3.1 7.7.1 9 0 1.3-.1 2.4-.3 3.3-1.2s1.1-2 1.2-3.3c.1-1.3.1-7.7.1-9zm-2 10.4a2.6 2.6 0 01-1.5 1.5c-1 .4-3.4.3-4.5.3s-3.5.1-4.5-.3a2.6 2.6 0 01-1.5-1.5c-.4-1-.3-3.4-.3-4.5s-.1-3.5.3-4.5A2.6 2.6 0 016.5 7.2c1-.4 3.4-.3 4.5-.3s3.5-.1 4.5.3c.7.3 1.2.8 1.5 1.5.4 1 .3 3.4.3 4.5s.1 3.5-.3 4.5z",
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
