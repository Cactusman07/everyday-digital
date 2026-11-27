"use client";

// Share this page: LinkedIn, Facebook, or copy the link.

import { useState } from "react";

export default function ShareLinks({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);
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
            setTimeout(() => setCopied(false), 2000);
          } catch {
            window.prompt("Copy this link", url);
          }
        }}
        aria-label={`Copy link to ${title}`}
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
