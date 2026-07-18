"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import DetailPanel from "./DetailPanel";
import type { WPTeam } from "@/lib/types";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

export default function AboutUsProfiles({ data }: { data: WPTeam[] }) {
  const [active, setActive] = useState<WPTeam | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    data.length > 0 && (
      <>
        <h2 className="text-center">Meet the Team</h2>
        <div className="flex about-container">
          {data.map((profile: WPTeam, index: number) => {
            return (
              <div
                key={profile.databaseId ?? `${profile.title}-${index}`}
                className="promo m-5"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  setActive(profile);
                }}
              >
                <div className="image-wrapper relative">
                  <Image
                    src={profile.featuredImage?.node?.sourceUrl ?? ""}
                    alt={profile.featuredImage?.node?.altText ?? profile.title}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
                <p className="title" data-cta={`${stripHtml(profile.excerpt)}`}>
                  {profile.title}
                </p>
              </div>
            );
          })}
        </div>
        {active && (
          <DetailPanel
            title={active.title}
            content={active.content ?? ""}
            image={active.featuredImage?.node ?? null}
            type="project"
            onClose={close}
          />
        )}
      </>
    )
  );
}
