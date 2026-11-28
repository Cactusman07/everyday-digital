"use client";

// The hamburger button and full-screen menu. Items are the WordPress pages,
// passed in by NavMenuLoader; `null` renders the button with no items (the
// fallback while they stream in, or when WordPress is down).

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SocialLinks from "./SocialLinks";
import OutlineIcon from "@/components/shared/OutlineIcon";

export interface MenuItem {
  href: string;
  label: string;
}

export default function NavMenu({ items }: { items: MenuItem[] | null }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);

  // Escape closes the menu and puts focus back on the button that opened it
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="flex items-center justify-between py-4 pr-4">
      <nav>
        <button
          ref={toggle}
          type="button"
          className="menu-toggle flex cursor-pointer w-8 h-7 z-20 relative"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="navMenu"
        >
          <span className="menu-toggle__icon space-y-2 grid cursor-pointer">
            <span className="block h-0.5 w-8 animate-pulse bg-white" />
            <span className="block h-0.5 w-5 justify-self-end animate-pulse bg-white" />
            <span className="block h-0.5 w-8 animate-pulse bg-white" />
          </span>
        </button>
        {/* inert while closed: the off-screen links can't be focused or read out */}
        <div
          id="navMenu"
          className={open ? "showMenuNav" : "hideMenuNav"}
          inert={!open}
        >
          <button
            type="button"
            className="absolute top-0 right-0 pl-4 pt-8 pr-8"
            onClick={close}
            aria-label="Close menu"
          >
            <OutlineIcon className="h-8 w-8 text-white cursor-pointer animate-pulse">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </OutlineIcon>
          </button>
          <ul className="flex flex-col items-center justify-between min-h-[250px] text-xl">
            {items?.map((item) => (
              <li
                key={item.href}
                className="border-b border-gray-400 hover:border-light-blue my-4 uppercase hover:text-light-blue"
              >
                <Link
                  onClick={close}
                  href={item.href}
                  className="py-2 text-white hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* On desktop the social links sit in the hero instead */}
          <div className="flex md:hidden items-center justify-between mb-4">
            <SocialLinks />
          </div>
        </div>
      </nav>
    </div>
  );
}
