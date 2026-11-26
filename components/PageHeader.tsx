// Shared page heading: small label, script title (the page's h1), colour bar.
// Used by pages, blog posts, projects and services so they all open the same way.

import type { ReactNode } from "react";

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
        {title.split(/([0-9$%][0-9$%,.]*)/).map((part, i) =>
          i % 2 ? (
            <span key={i} className="pg-num">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </h1>
      {children && <div className="pg-meta">{children}</div>}
    </header>
  );
}
