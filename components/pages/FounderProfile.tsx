// "Meet Sam" on the About page: photo, role, profile and LinkedIn. The facts
// come from FOUNDER in lib/site.ts, the same source as the founder's Person
// schema.

import FounderAvatar from "@/components/shared/FounderAvatar";
import { FOUNDER, SITE } from "@/lib/site";

export default function FounderProfile() {
  const firstName = FOUNDER.name.split(" ")[0];
  return (
    <section className="founder mt-10" aria-labelledby="founder-name">
      <FounderAvatar size={112} />
      <div>
        <h2 id="founder-name" className="founder__name">
          Meet {firstName}
        </h2>
        <p className="founder__role">
          {FOUNDER.jobTitle} of {SITE.name}
        </p>
        {FOUNDER.profile.map((p) => (
          <p key={p} className="founder__bio">
            {p}
          </p>
        ))}
        <a
          href={FOUNDER.linkedIn}
          target="_blank"
          rel="me noopener noreferrer"
          className="text-link"
        >
          {FOUNDER.name} on LinkedIn
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </section>
  );
}
