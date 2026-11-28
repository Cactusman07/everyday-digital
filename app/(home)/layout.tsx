// The home page: the full-screen hero and menu, then the page in #root.
// The hero sits outside #root on purpose: on the home page #root lets clicks
// fall through to the hero beneath it (app/styles/layout/header.css).

import HomeHero from "@/components/layout/HomeHero";
import SiteMenu from "@/components/layout/SiteMenu";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HomeHero />
      <SiteMenu />
      <main id="root" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
