// Link to book a call in Sam's Calendly. Opens in a new tab so the visitor
// keeps their place on the site.

import type { ReactNode } from "react";
import { SITE } from "@/lib/site";

export default function BookingLink({
  className = "btn",
  children = "Book a call",
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <a
      href={SITE.bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
