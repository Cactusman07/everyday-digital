// The home page hero: full-screen animated "Every Day <word>" title,
// buttons and social links. A server component: only the cycling title and
// the logo's hide-on-scroll wrapper are client JS.

import Link from "next/link";
import HeroButtons from "./HeroButtons";
import HeroWordCycle from "./HeroWordCycle";
import HideOnScroll from "./HideOnScroll";
import SiteLogo from "./SiteLogo";
import SocialLinks from "./SocialLinks";
import OutlineIcon from "@/components/shared/OutlineIcon";

export default function HomeHero() {
  return (
    <header
      id="header"
      className="h-[calc(100vh-40px)] mx-8 my-5 relative max-w-full z-10"
    >
      <HideOnScroll>
        <SiteLogo className="absolute w-14 sm:w-20 top-0 left-0" />
      </HideOnScroll>

      <SocialLinks className="hidden md:block absolute" />
      <div className="fixed md:absolute bottom-0 md:bottom-5 md:left-auto z-[5] right-0 left-0 justify-center flex">
        <HeroButtons />
      </div>
      <div
        id="title"
        className="transition-all duration-500 justify-center block text-7xl sm:text-8xl lg:text-[160px] xl:text-[210px] my-auto"
      >
        <HeroWordCycle />
        <Link
          href="/about"
          className="hero-about absolute flex items-center gap-3 group"
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
