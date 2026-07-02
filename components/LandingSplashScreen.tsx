// No "use client" — this is a Server Component. It renders on the server and ships
// zero JavaScript. The animation (loading dots, shimmer) is pure CSS (defined in globals.css).

import Image from "next/image";
// Static import — Next.js gets dimensions at build time, no layout shift
import logo from "@/public/images/EveryDayDigital_Logo_reversed.png";

// Used by app/loading.tsx as the route transition loading indicator
export default function LandingSplashScreen() {
  return (
    <div className="fixed z-[90] top-0 bottom-0 left-0 right-0 text-white flex justify-center items-center duration-500 bg-black">
      <div className="max-w-xs" id="logoContainer">
        {/* priority — tells Next.js to preload this image (no lazy loading).
            Used for above-the-fold images that need to appear immediately. */}
        <Image
          id="splash_logo"
          src={logo}
          alt="Every Day Digital Logo"
          priority
        />
        <div className="loading">
          <span className="loading__dot"></span>
          <span className="loading__dot"></span>
          <span className="loading__dot"></span>
        </div>
      </div>
    </div>
  );
}
