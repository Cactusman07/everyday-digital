// Adds the inner-page class (smaller logo, offset content) to WordPress pages.
export default function InnerPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="inner-page">{children}</div>;
}
