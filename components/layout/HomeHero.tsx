"use client";

// The home page hero: full-screen animated "Every Day <word>" title,
// buttons and social links. The logo hides once the visitor scrolls in.

import { useEffect, useState } from "react";
import Link from "next/link";
import { onScrollFrame } from "@/lib/scroll";
import HeroButtons from "./HeroButtons";
import HeroWordCycle from "./HeroWordCycle";
import SiteLogo from "./SiteLogo";
import SocialLinks from "./SocialLinks";
import OutlineIcon from "@/components/shared/OutlineIcon";

/** Scroll distance after which the home page logo hides. */
const LOGO_HIDE_AFTER_PX = 80;

/** Hides the logo once the visitor scrolls into the page. */
function useNearTop() {
  const [nearTop, setNearTop] = useState(true);
  useEffect(
    () => onScrollFrame(() => setNearTop(window.scrollY <= LOGO_HIDE_AFTER_PX)),
    [],
  );
  return nearTop;
}

export default function HomeHero() {
  const showLogo = useNearTop();
  return (
    <header
      id="header"
      className="h-[calc(100vh-40px)] mx-8 my-5 relative max-w-full z-10"
    >
      {showLogo && <SiteLogo className="absolute w-14 sm:w-20 top-0 left-0" />}

      <SocialLinks className="hidden md:block absolute" />
      <div className="fixed md:absolute bottom-0 md:bottom-5 md:left-auto z-[5] right-0 left-0 justify-center flex">
        <HeroButtons />
      </div>
      <div
        id="title"
        className="transition-all duration-500 justify-center block text-7xl sm:text-8xl lg:text-[160px] xl:text-[210px] my-auto"
      >
        <h1 className="absolute transition-all duration-700">
          Every Day&nbsp;
          <br className="sm:hidden" />
          <span id="textWrap">
            <HeroWordCycle />
          </span>
        </h1>
        <Link
          href="/about"
          className="absolute flex items-center gap-3 group"
          style={{ top: "64%", left: 0 }}
        >
          <span className="text-white/70 text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-300 group-hover:text-accent">
            About our approach
          </span>
          <span className="flex items-center justify-center w-7 h-7 rounded-full border border-white/25 group-hover:border-accent transition-all duration-300">
            <OutlineIcon className="h-3 w-3 text-white/70 group-hover:text-accent transition-transform duration-300 group-hover:translate-x-px">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </OutlineIcon>
          </span>
        </Link>
      </div>
      {/* Gooey threshold filter used by the morphing hero word (#textWrap) */}
      <svg id="filters" className="w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </header>
  );
}
