import NavMenu from "./NavMenu";
import { getPages } from "@/lib/wordpress";
import type { WPPage } from "@/lib/types";

// Async Server Component — fetches the nav menu independently of the root
// layout, wrapped in a <Suspense> boundary so the HTML shell can stream
// immediately instead of waiting on this WordPress round-trip.
export default async function NavMenuServer() {
  let menu: WPPage[] | null = null;
  try {
    const pages = await getPages();
    // Terms & Conditions lives in the footer only, not the main menu
    menu = pages.filter(
      (p: WPPage) => !p.isFrontPage && !/^\/terms\/?$/.test(p.uri),
    );
  } catch {
    // WordPress may not be running during build — gracefully degrade to no menu
  }

  return <NavMenu menu={menu} />;
}
