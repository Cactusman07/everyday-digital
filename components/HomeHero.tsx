// "use client" — marks this as a Client Component. Required because it uses browser APIs
// (useState, useEffect, window.addEventListener) that don't exist on the server.
// Server Components (the default) can't use hooks or browser APIs.
"use client";

import { useCallback, useEffect, useState } from "react";
// next/link — replaces <a> tags for internal navigation. Provides client-side routing
// (no full page reload), automatic prefetching on hover, and scroll restoration.
import Link from "next/link";
// next/image — replaces <img> tags. Automatically optimises images: resizes, converts
// to WebP, lazy-loads, and serves responsive srcsets. Static imports (like below)
// get their dimensions at build time, so no layout shift.
import Image from "next/image";
// usePathname — Next.js hook that returns the current URL path (e.g. "/" or "/about").
// Replaces react-router-dom's useLocation().
import { usePathname } from "next/navigation";

import NavMenu from "./NavMenu";
import CTAS from "./CTAS";
import SocialIcons from "./SocialIcons";
import BackgroundGradients from "./BackgroundGradients";
import useMatchMedia from "@/hooks/useMatchMedia";
import type { WPPage } from "@/lib/types";

// Static image import — Next.js analyses this at build time to get width/height/blur placeholder.
// The image file lives in public/images/ and is served from the Next.js static file server.
import logo from "@/public/images/EveryDayDigital_Logo_reversed.png";

export default function HomeHero({ menu }: { menu: WPPage[] | null }) {
  const isDesktopResolution = useMatchMedia("(min-width:768px)", true);
  const pathname = usePathname();

  // Derived directly from pathname — no useEffect needed since pathname is reactive
  const showFooter = pathname === "/";
  const [showHeader, setShowHeader] = useState(true);

  const listenToScroll = useCallback(() => {
    const heightToHide = 80;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    setShowHeader(winScroll <= heightToHide);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, [listenToScroll]);

  return (
    <>
      <header
        id="header"
        className="h-[calc(100vh-40px)] mx-8 my-5 relative max-w-full z-10"
      >
        {showHeader && (
          <Link className="absolute w-14 sm:w-20 top-0 left-0" href="/">
            <Image
              id="logo"
              className="animate-invert w-14 sm:w-20 z-30 relative"
              src={logo}
              alt="Every Day Digital Logo"
            />
          </Link>
        )}

        {isDesktopResolution && showFooter && (
          <SocialIcons absolutePos={true} />
        )}
        {showFooter && (
          <div className="fixed md:absolute bottom-0 md:bottom-5 md:left-auto z-[5] right-0 left-0 justify-center flex">
            <CTAS />
          </div>
        )}
        <div
          style={{ opacity: !showHeader ? 0 : 1 }}
          id="title"
          className="transition-all duration-500 justify-center block text-7xl sm:text-8xl lg:text-[160px] xl:text-[210px] my-auto"
        >
          <h1 className="absolute transition-all duration-700">
            Every Day&nbsp;
            <br className="sm:hidden" />
            <span id="textWrap">
              <BackgroundGradients />
            </span>
          </h1>
          {showFooter && (
            <Link
              href="/about/"
              className="absolute flex items-center gap-3 group"
              style={{ top: "64%", left: 0 }}
            >
              <span className="text-white/70 text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-300 group-hover:text-[#4bafeb]">
                About our approach
              </span>
              <span className="flex items-center justify-center w-7 h-7 rounded-full border border-white/25 group-hover:border-[#4bafeb] transition-all duration-300">
                <svg
                  className="h-3 w-3 text-white/70 group-hover:text-[#4bafeb] transition-transform duration-300 group-hover:translate-x-px"
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
              </span>
            </Link>
          )}
        </div>
        <svg id="filters" className="w-0 h-0">
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
      <div id="menu" className="absolute top-0 right-5">
        <NavMenu menu={menu} />
      </div>
    </>
  );
}
