"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface DetailPanelProps {
  title: string;
  content: string;
  image?: { sourceUrl: string; altText?: string } | null;
  type: "service" | "project";
  coverImage?: boolean;
  onClose: () => void;
}

export default function DetailPanel({
  title,
  content,
  image,
  type,
  coverImage = false,
  onClose,
}: DetailPanelProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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
          className="project-panel__close"
          onClick={onClose}
          aria-label="Close panel"
        >
          ✕
        </button>

        {type === "service" ? (
          <div className="project-panel__header">
            <h2 className="project-panel__title">{title}</h2>
            {image?.sourceUrl && (
              <Image
                src={image.sourceUrl}
                alt={image.altText || title}
                width={72}
                height={72}
                className="project-panel__icon"
              />
            )}
          </div>
        ) : (
          image?.sourceUrl && (
            <div className="project-panel__hero relative">
              <Image
                src={image.sourceUrl}
                alt={image.altText || title}
                fill
                sizes="70vw"
                className={
                  coverImage
                    ? "project-panel__hero-img--cover object-cover"
                    : "object-contain"
                }
              />
            </div>
          )
        )}

        <div
          className={`project-panel__body${type === "service" ? " project-panel__body--service" : ""}`}
        >
          {type === "project" && (
            <h2 className="project-panel__title">{title}</h2>
          )}
          {content && (
            <div
              className="project-panel__content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>

        {type === "service" && (
          <Link href="/contact/" onClick={onClose}>
            <div className="absolute bottom-0 left-0 right-0 px-8 py-5 bg-gradient-to-r from-[#4b6ceb] to-[#4bafeb] flex items-center justify-between group cursor-pointer">
              <div>
                <p className="text-white font-semibold uppercase tracking-widest text-sm m-0">
                  Interested in this service?
                </p>
                <p className="text-white/70 text-xs m-0 mt-1">
                  Get in touch and let&apos;s talk.
                </p>
              </div>
              <svg
                className="h-6 w-6 text-white transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>
        )}
      </div>
    </>
  );
}
