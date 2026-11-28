// Browser-only scroll helpers for the client components' effects.

/**
 * Calls `frame` at most once per animation frame while the page scrolls or
 * resizes, and once straight away.
 *
 * @returns A cleanup function that removes the listeners and any pending frame.
 */
export function onScrollFrame(frame: () => void): () => void {
  let raf = 0;
  const schedule = () => {
    if (!raf)
      raf = requestAnimationFrame(() => {
        raf = 0;
        frame();
      });
  };
  frame();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    if (raf) cancelAnimationFrame(raf);
  };
}

/** Limits `v` to the range [min, max]. */
export const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));
