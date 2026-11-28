"use client";

// Shows its children only near the top of the page (the home page logo hides
// once the visitor scrolls in). The children stay server-rendered; only this
// wrapper ships as client JS.

import { useEffect, useState, type ReactNode } from "react";
import { onScrollFrame } from "@/lib/scroll";

/** Scroll distance after which the children hide. */
const HIDE_AFTER_PX = 80;

export default function HideOnScroll({ children }: { children: ReactNode }) {
  const [nearTop, setNearTop] = useState(true);
  useEffect(
    () => onScrollFrame(() => setNearTop(window.scrollY <= HIDE_AFTER_PX)),
    [],
  );
  return nearTop ? children : null;
}
