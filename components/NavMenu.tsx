"use client";

import { useState } from "react";
import Link from "next/link";
import SocialIcons from "./SocialIcons";
import useMatchMedia from "@/hooks/useMatchMedia";
import type { WPPage } from "@/lib/types";

export default function NavMenu({ menu }: { menu: WPPage[] | null }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isDesktopResolution = useMatchMedia("(min-width:768px)", true);

  const menuItems: React.JSX.Element[] = [];
  if (menu) {
    menu.forEach((mi: WPPage) => {
      menuItems.push(
        <li
          key={mi.uri}
          className="border-b border-gray-400 hover:border-light-blue my-4 uppercase hover:text-light-blue"
        >
          <Link
            onClick={() => setIsNavOpen(false)}
            href={mi.uri}
            className="py-2 text-white hover:text-[#4bafeb]"
          >
            {mi.title}
          </Link>
        </li>,
      );
    });
  }
  menuItems.reverse();

  return (
    <div className="flex items-center justify-between py-4 pr-4">
      <nav>
        <section
          className="MOBILE-MENU flex cursor-pointer w-8 h-7 z-20 relative"
          onClick={() => setIsNavOpen((prev) => !prev)}
        >
          <div className="HAMBURGER-ICON space-y-2 grid cursor-pointer">
            <span className="block h-0.5 w-8 animate-pulse bg-white"></span>
            <span className="block h-0.5 w-5 justify-self-end animate-pulse bg-white"></span>
            <span className="block h-0.5 w-8 animate-pulse bg-white"></span>
          </div>
        </section>
        <div
          id="navMenu"
          className={isNavOpen ? "showMenuNav" : "hideMenuNav"}
        >
          <div
            className="absolute top-0 right-0 pl-4 pt-8 pr-8"
            onClick={() => setIsNavOpen(false)}
          >
            <svg
              className="h-8 w-8 text-white cursor-pointer animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <ul className="flex flex-col items-center justify-between min-h-[250px] text-xl">
            {menuItems}
          </ul>
          {!isDesktopResolution && (
            <div className="flex items-center justify-between mb-4">
              <SocialIcons />
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
