"use client";

// Share this page: LinkedIn, Facebook, or copy the link.

import { useEffect, useRef, useState } from "react";

/** How long the button says "Link copied" before going back. */
const COPIED_MS = 2000;

export default function ShareLinks({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const u = encodeURIComponent(url);
  return (
    <div className="show__share">
      <span>Share</span>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
        target="_blank"
        rel="noreferrer"
      >
        LinkedIn
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}
        target="_blank"
        rel="noreferrer"
      >
        Facebook
      </a>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), COPIED_MS);
          } catch {
            window.prompt("Copy this link", url);
          }
        }}
      >
        {copied ? "Link copied" : "Copy link"}
        <span className="sr-only"> to {title}</span>
      </button>
      {/* Always in the page, so screen readers announce the change */}
      <p className="sr-only" role="status" aria-live="polite">
        {copied ? "Link copied" : ""}
      </p>
    </div>
  );
}
