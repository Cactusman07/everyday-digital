// Page heading for WordPress pages: small label, then the title in the
// script font as the page's <h1>.

import ScriptTitle from "@/components/shared/ScriptTitle";

export default function PageHeader({
  title,
  eyebrow,
}: {
  title: string;
  eyebrow?: string;
}) {
  return (
    <header className="page-head">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="page-title">
        <ScriptTitle text={title} />
      </h1>
    </header>
  );
}
