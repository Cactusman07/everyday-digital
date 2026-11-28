// The founder's round avatar: his photo when lib/site.ts has one, otherwise
// his initials. Used on the About page and under every blog post.

import Image from "next/image";
import { FOUNDER } from "@/lib/site";

export default function FounderAvatar({
  size,
  className = "",
}: {
  /** Width and height in pixels. */
  size: number;
  className?: string;
}) {
  return (
    <span
      className={`founder-avatar ${className}`.trim()}
      style={{ width: size, height: size }}
    >
      {FOUNDER.photo ? (
        <Image
          src={FOUNDER.photo}
          alt={FOUNDER.name}
          width={size}
          height={size}
        />
      ) : (
        <span aria-hidden="true">{FOUNDER.initials}</span>
      )}
    </span>
  );
}
