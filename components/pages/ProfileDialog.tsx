"use client";

// Side panel with a team member's photo and full bio. Closes on Escape, the
// close button or a click on the backdrop, and stops the page scrolling
// behind it while open.

import { useEffect } from "react";
import Image from "next/image";
import type { WPImage } from "@/lib/wordpress";

export default function ProfileDialog({
  title,
  content,
  image,
  onClose,
}: {
  title: string;
  /** Sanitised WordPress HTML. */
  content: string;
  image?: WPImage;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <>
      <div className="project-overlay" onClick={onClose} role="presentation" />
      <div
        className="project-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <button
          type="button"
          className="project-panel__close"
          onClick={onClose}
          aria-label="Close panel"
          autoFocus
        >
          ✕
        </button>

        {image?.sourceUrl && (
          <div className="project-panel__hero relative">
            <Image
              src={image.sourceUrl}
              alt={image.altText || title}
              fill
              sizes="70vw"
              className="object-contain"
            />
          </div>
        )}

        <div className="project-panel__body">
          <h2 className="project-panel__title">{title}</h2>
          {content && (
            <div
              className="project-panel__content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
    </>
  );
}
