// The "Every Day." call-to-action band near the foot of inner pages: the
// contact form, or a call booked straight into the calendar.

import Link from "next/link";
import type { CallToAction } from "@/lib/pages";
import BookingLink from "./BookingLink";

export default function CallToActionBand({ heading, text }: CallToAction) {
  return (
    <section className="show__cta">
      <p className="show__cta-script">Every Day.</p>
      <div>
        <h2 className="show__cta-h">{heading}</h2>
        <p>{text}</p>
      </div>
      <div className="section-actions">
        <Link href="/contact" className="btn btn--accent btn--lg">
          Start with a free chat
        </Link>
        <BookingLink className="btn btn--lg" />
      </div>
    </section>
  );
}
