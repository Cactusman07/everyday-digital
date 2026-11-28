import Link from "next/link";
import { sectionOf } from "@/lib/wordpress/content-types";

const HELPFUL_LINKS = [
  { href: "/", label: "Home" },
  { href: sectionOf("service").path, label: "Services" },
  { href: sectionOf("post").path, label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <div className="inner-page">
      <div id="content" className="mt-48 mb-24 mx-8 relative z-0">
        <h1>Page not found</h1>
        <p className="mt-5">
          Oops! That link doesn&apos;t seem to work. No need to worry — here are
          some helpful links to get you back on track:
        </p>
        <ul className="mt-4 ml-2 text-lg">
          {HELPFUL_LINKS.map((l) => (
            <li key={l.href} className="mt-2">
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
