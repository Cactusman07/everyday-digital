// Landing pages: no site header or menu, one job per page. Each page draws its
// own minimal header (app/lp/[slug]/page.tsx).
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main id="root" tabIndex={-1}>
      {children}
    </main>
  );
}
