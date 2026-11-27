// Loading screen for route changes. Server-rendered, animated with CSS only.

import Image from "next/image";
import logo from "@/public/images/EveryDayDigital_Logo_reversed.png";

export default function LandingSplashScreen() {
  return (
    <div className="fixed z-[90] top-0 bottom-0 left-0 right-0 text-white flex justify-center items-center duration-500 bg-black">
      <div className="max-w-xs" id="logoContainer">
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
