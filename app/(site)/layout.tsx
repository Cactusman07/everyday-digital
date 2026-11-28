// Every page except the home page and landing pages: the logo and menu, then
// the page in #root.

import InnerHeader from "@/components/layout/InnerHeader";
import SiteMenu from "@/components/layout/SiteMenu";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <InnerHeader />
      <SiteMenu />
      <main id="root" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
