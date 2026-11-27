"use client";

import useMatchMedia from "@/hooks/useMatchMedia";
import Link from "next/link";

export default function CTAS() {
  const isDesktopResolution = useMatchMedia("(min-width:768px)", true);

  return (
    <div id="ctas" className="inline-flex md:grid z-10 mb-12 gap-4">
      {[
        { href: "/contact", label: "CONTACT US" },
        { href: "/services", label: "VIEW SERVICES" },
      ].map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className={`${isDesktopResolution ? "" : "cta-mobile"} cta mt-4 p-0 md:w-48 w-36`}
        >
          <span className="circle" aria-hidden="true">
            <span className="icon arrow"></span>
          </span>
          <span className="button-text">{c.label}</span>
        </Link>
      ))}
    </div>
  );
}
