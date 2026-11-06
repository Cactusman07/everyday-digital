// Landing-page shell. The root layout still wraps this (gradients, fonts,
// schema), but HomeHero only renders the full hero on "/" and the nav lives in
// HomeHero's menuSlot — so on /lp/* the page gets gradients + small logo only.
// This layout just adds the lp class hook and hides the global menu via CSS.
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="lp-shell">{children}</div>;
}
