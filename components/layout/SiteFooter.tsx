// Footer for inner pages: hero buttons, footer links, social icons, copyright.
// (The home page and landing pages have their own closing sections.)

import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/navigation";
import { copyright } from "@/lib/site";
import HeroButtons from "./HeroButtons";
import SocialLinks from "./SocialLinks";

export default function SiteFooter() {
  return (
    <footer className="mx-8 mt-12 pb-10 text-center md:text-right left-0 right-0 bottom-0 relative">
      <HeroButtons />
      <nav className="edd-foot" aria-label="Footer">
        {FOOTER_LINKS.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="flex align-middle items-center flex-auto">
        <SocialLinks />
        <div className="flex flex-auto flex-row-reverse">{copyright()}</div>
      </div>
    </footer>
  );
}
