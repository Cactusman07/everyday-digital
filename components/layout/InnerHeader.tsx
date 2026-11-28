// Header for every page except the home page: just the logo.

import SiteLogo from "./SiteLogo";

export default function InnerHeader() {
  return (
    <header className="mx-8 my-5 relative z-10">
      <SiteLogo className="inline-block w-14 sm:w-20" />
    </header>
  );
}
