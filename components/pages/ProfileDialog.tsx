"use client";

// Side panel with a team member's photo and full bio: a native modal
// <dialog>, so the browser traps focus, closes it on Escape and makes the page
// behind inert. It also closes on the close button or a click on the
// backdrop, and stops the page scrolling behind it while open. The caller
// unmounts it in onClose and puts focus back on the card that opened it.

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import type { WPImage } from "@/lib/wordpress";
import { isCmsMediaUrl } from "@/lib/wordpress/images";

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
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // Opens as a modal on mount; the browser moves focus to the close button
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (!el.open) el.showModal();
    document.body.style.overflow = "hidden";
    // A click on the ::backdrop targets the <dialog> itself, outside its box.
    // A mouse-only extra: keyboard users have Escape and the close button.
    const onBackdropClick = (e: MouseEvent) => {
      if (e.target !== el) return;
      const r = el.getBoundingClientRect();
      const inside =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;
      if (!inside) el.close();
    };
    el.addEventListener("click", onBackdropClick);
    // No close() here: unmounting takes it out of the top layer anyway, and a
    // close event from Strict Mode's re-run would unmount it straight away
    return () => {
      el.removeEventListener("click", onBackdropClick);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    // Escape, the close button and the backdrop all end in the close event
    <dialog
      ref={dialog}
      className="profile-dialog"
      aria-labelledby={titleId}
      onClose={onClose}
    >
      <button
        type="button"
        className="profile-dialog__close"
        onClick={() => dialog.current?.close()}
        aria-label="Close panel"
      >
        ✕
      </button>

      {isCmsMediaUrl(image?.sourceUrl) && (
        <div className="profile-dialog__hero relative">
          <Image
            src={image.sourceUrl}
            alt={image.altText || title}
            fill
            sizes="70vw"
            className="object-contain"
          />
        </div>
      )}

      <div className="profile-dialog__body">
        <h2 id={titleId} className="profile-dialog__title">
          {title}
        </h2>
        {content && (
          <div
            className="profile-dialog__content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </dialog>
  );
}
