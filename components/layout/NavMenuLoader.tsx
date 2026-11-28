// Builds the menu from the WordPress pages. Rendered inside its own Suspense
// boundary (app/layout.tsx) so the page never waits on WordPress for it.

import { MENU_EXCLUDED_PATHS } from "@/lib/navigation";
import { getPages, pageSlug, safe } from "@/lib/wordpress";
import NavMenu, { type MenuItem } from "./NavMenu";

export default async function NavMenuLoader() {
  const pages = await safe(getPages);
  const items: MenuItem[] = pages
    .filter((p) => !p.isFrontPage)
    .map((p) => ({ href: `/${pageSlug(p)}`, label: p.title }))
    .filter((i) => !MENU_EXCLUDED_PATHS.includes(i.href));
  return <NavMenu items={items.length ? items : null} />;
}
