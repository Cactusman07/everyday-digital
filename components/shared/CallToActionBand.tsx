// The "Every Day." call-to-action band near the foot of inner pages.

import Link from "next/link";
import type { CallToAction } from "@/lib/pages";

export default function CallToActionBand({
  heading,
  text,
  label = "Start with a free chat",
}: CallToAction) {
  return (
    <section className="show__cta">
      <p className="show__cta-script">Every Day.</p>
      <div>
        <p className="show__cta-h">{heading}</p>
        <p>{text}</p>
      </div>
      <Link href="/contact" className="btn btn--accent btn--lg">
        {label}
      </Link>
    </section>
  );
}
