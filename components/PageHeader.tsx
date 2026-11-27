// Shared page heading: small label, script title (the page's h1), colour bar.
// Used by pages, blog posts, projects and services so they all open the same way.

import type { ReactNode } from "react";
import ScriptTitle from "./ScriptTitle";

export default function PageHeader({
  title,
  eyebrow,
  icon,
  children,
}: {
  title: string;
  eyebrow?: string;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="pg-head has-sicon">
      {icon}
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="pg-title">
        <ScriptTitle text={title} />
      </h1>
      {children && <div className="pg-meta">{children}</div>}
    </header>
  );
}
