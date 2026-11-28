// The Every Day Digital logo, linking home.

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/EveryDayDigital_Logo_reversed.png";
import { SITE } from "@/lib/site";

export default function SiteLogo({ className }: { className: string }) {
  return (
    <Link className={className} href="/">
      <Image
        id="logo"
        className="animate-invert w-14 sm:w-20 z-30 relative"
        src={logo}
        alt={`${SITE.name} logo`}
      />
    </Link>
  );
}
