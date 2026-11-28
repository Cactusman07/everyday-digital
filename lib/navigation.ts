// Links shared by the site footers.

import { SITE } from "./site";
import { sectionOf } from "./wordpress/content-types";

interface NavLink {
  href: string;
  label: string;
}

/** Internal footer links, in order. Terms lives here rather than in the main menu. */
export const FOOTER_LINKS: NavLink[] = [
  { href: sectionOf("service").path, label: "Services" },
  { href: sectionOf("project").path, label: "Projects" },
  { href: sectionOf("post").path, label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/terms", label: "Terms & Conditions" },
];

/** Paths of pages that WordPress has but the main menu leaves out. */
export const MENU_EXCLUDED_PATHS = ["/terms"];

/** Our social profiles, in the order their icons appear. */
export const SOCIAL_LINKS = [
  { id: "facebook", label: "Facebook", href: SITE.social.facebook },
  { id: "instagram", label: "Instagram", href: SITE.social.instagram },
  { id: "linkedin", label: "LinkedIn", href: SITE.social.linkedin },
] as const;
