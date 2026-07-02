// Inner-page layout — wraps all dynamic WordPress pages (about, blog, services, etc.).
// The [slug] folder name means this layout applies to any route like /about, /contact, etc.
// Adding the "inner-page" class triggers different CSS styling (logo shrinks, content shifts)
// compared to the home page. This replaces the old SPA pattern of document.body.classList.add().
export default function InnerPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="inner-page">{children}</div>;
}
