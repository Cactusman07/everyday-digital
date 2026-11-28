"use client";

// "Meet the Team" on the About page: a photo card per team member; choosing
// one opens their full bio in a ProfileDialog.

import { useCallback, useState } from "react";
import Image from "next/image";
import type { WPTeamMember } from "@/lib/wordpress";

/** A team member plus their short bio as plain text (worked out on the server). */
export type TeamProfile = WPTeamMember & { bio: string };
import ProfileDialog from "./ProfileDialog";

export default function TeamProfiles({ team }: { team: TeamProfile[] }) {
  const [active, setActive] = useState<TeamProfile | null>(null);
  const close = useCallback(() => setActive(null), []);

  if (!team.length) return null;
  return (
    <>
      <h2 className="text-center">Meet the Team</h2>
      <div className="flex about-container">
        {team.map((member) => {
          const photo = member.featuredImage?.node;
          return (
            <button
              type="button"
              key={member.databaseId}
              className="promo m-5"
              onClick={() => setActive(member)}
              aria-haspopup="dialog"
            >
              <span className="image-wrapper relative block">
                {photo?.sourceUrl && (
                  <Image
                    src={photo.sourceUrl}
                    alt={photo.altText || member.title}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                )}
              </span>
              {/* data-cta: the short bio, revealed on hover by CSS */}
              <span className="title block" data-cta={member.bio}>
                {member.title}
              </span>
            </button>
          );
        })}
      </div>
      {active && (
        <ProfileDialog
          title={active.title}
          content={active.content}
          image={active.featuredImage?.node}
          onClose={close}
        />
      )}
    </>
  );
}
