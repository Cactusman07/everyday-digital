// The two round "pill" links in the hero and footer: Contact us, View services.
// Small screens show them expanded, since touch screens can't hover
// (app/styles/components/hero-buttons.css).

import Link from "next/link";
import { sectionOf } from "@/lib/wordpress/content-types";

const BUTTONS = [
  { href: "/contact", label: "Contact us" },
  { href: sectionOf("service").path, label: "View services" },
];

export default function HeroButtons() {
  return (
    <div id="ctas" className="inline-flex md:grid z-10 mb-12 gap-4">
      {BUTTONS.map((b) => (
        <Link key={b.href} href={b.href} className="cta mt-4 p-0 md:w-48 w-36">
          <span className="circle" aria-hidden="true">
            <span className="icon arrow" />
          </span>
          <span className="button-text">{b.label}</span>
        </Link>
      ))}
    </div>
  );
}
