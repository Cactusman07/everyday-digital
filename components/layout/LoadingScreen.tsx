// Full-screen loading screen shown during route changes (app/loading.tsx).
// Server-rendered and animated with CSS only.

import Image from "next/image";
import logo from "@/public/images/EveryDayDigital_Logo_reversed.png";
import { SITE } from "@/lib/site";

export default function LoadingScreen() {
  return (
    <div className="fixed z-[90] top-0 bottom-0 left-0 right-0 text-white flex justify-center items-center duration-500 bg-black">
      <div className="max-w-xs" id="logo-container">
        <Image id="splash-logo" src={logo} alt={`${SITE.name} logo`} priority />
        <div className="loading" role="status" aria-label="Loading">
          <span className="loading__dot" />
          <span className="loading__dot" />
          <span className="loading__dot" />
        </div>
      </div>
    </div>
  );
}
