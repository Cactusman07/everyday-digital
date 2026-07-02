// No "use client" — this is a Server Component (the default in App Router).
// It renders on the server and sends pure HTML to the browser. No JavaScript
// is shipped for this component. Server Components can use static image imports
// but cannot use hooks, state, or browser APIs.

import Image from "next/image";
// Static imports — Next.js reads these files at build time to get dimensions
// and generate optimised versions (WebP, multiple sizes).
import fbIcon from "@/public/images/facebook-4-64.png";
import liIcon from "@/public/images/linkedin-4-64.png";

export default function SocialIcons({
  absolutePos,
}: {
  absolutePos?: boolean;
}) {
  return (
    <div
      id="social"
      className={`flex md:block ${
        absolutePos ? "absolute" : "relative"
      } bottom-0 left-0 md:left-5`}
    >
      <a
        className="md:mb-3 mr-3"
        target="_blank"
        rel="noreferrer"
        href="https://www.facebook.com/every.day.digital.2023"
      >
        <Image
          id="facebook"
          className="w-8 md:w-10 animate-invert"
          src={fbIcon}
          alt="Every Day Digital Facebook Page"
        />
      </a>
      <a
        className="md:mb-3 mr-3"
        target="_blank"
        rel="noreferrer"
        href="https://www.linkedin.com/company/every-day-digital/"
      >
        <Image
          id="linkedin"
          className="w-8 md:w-10 animate-invert"
          src={liIcon}
          alt="Every Day Digital LinkedIn Page"
        />
      </a>
    </div>
  );
}
