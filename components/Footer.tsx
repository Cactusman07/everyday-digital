import Link from "next/link";
import CTAS from "./CTAS";
import SocialIcons from "./SocialIcons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-8 mt-12 pb-10 text-center md:text-right left-0 right-0 bottom-0 relative">
      <CTAS />
      <nav className="edd-foot" aria-label="Footer">
        <Link href="/services/">Services</Link>
        <Link href="/projects/">Projects</Link>
        <Link href="/blog/">Blog</Link>
        <Link href="/about/">About</Link>
        <Link href="/contact/">Contact</Link>
        <Link href="/terms/">Terms &amp; Conditions</Link>
      </nav>
      <div className="flex align-middle items-center flex-auto">
        <SocialIcons />
        <div className="flex flex-auto flex-row-reverse">
          &copy;{` Copyright ${year} Every Day Digital Limited`}
        </div>
      </div>
    </footer>
  );
}
