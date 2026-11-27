import NavMenu from "./NavMenu";
import { getPages } from "@/lib/wordpress";
import type { WPPage } from "@/lib/types";

// Fetched in its own Suspense boundary so the page doesn't wait on WordPress.
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
