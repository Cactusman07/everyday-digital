// The menu button, top right. Its WordPress pages stream in inside their own
// Suspense boundary so the page never waits for them; until then (or if
// WordPress is down) the same button renders with no items.

import { Suspense } from "react";
import NavMenu from "./NavMenu";
import NavMenuLoader from "./NavMenuLoader";

export default function SiteMenu() {
  return (
    <div id="menu" className="absolute top-0 right-5">
      <Suspense fallback={<NavMenu items={null} />}>
        <NavMenuLoader />
      </Suspense>
    </div>
  );
}
