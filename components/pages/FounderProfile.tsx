// "Meet the founder" on the About page: photo, name, role, bio and LinkedIn.
// The facts come from FOUNDER in lib/site.ts, the same source as the
// founder's Person schema.

import FounderAvatar from "@/components/shared/FounderAvatar";
import { FOUNDER } from "@/lib/site";
import { SectionTitle } from "./AboutValues";

export default function FounderProfile() {
  return (
    <section className="mt-10" aria-labelledby="founder-name">
      <SectionTitle>Meet the founder</SectionTitle>
      <div className="founder">
        <FounderAvatar size={112} />
        <div>
          <h3 id="founder-name" className="founder__name">
            {FOUNDER.name}
          </h3>
          <p className="founder__role">{FOUNDER.jobTitle}</p>
          <p className="founder__bio">{FOUNDER.bio}</p>
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
      </div>
    </section>
  );
}
