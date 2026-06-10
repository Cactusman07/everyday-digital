import React, { useCallback, useState } from "react";
import "./AboutUsStyles.css";
import DetailPanel from "../DetailPanel/DetailPanel";
import { WPTeam } from "../../types";

interface AboutUsProfilesProps {
  data: WPTeam[];
}

const AboutUsProfiles = ({ data }: AboutUsProfilesProps) => {
  const [active, setActive] = useState<WPTeam | null>(null);
  const close = useCallback(() => setActive(null), []);

  const stripHtml = (html: string) => {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };
  //{testimonials?.data?.length > 0
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
                <div className="image-wrapper">
                  <img
                    src={profile.featuredImage?.node?.sourceUrl}
                    alt={profile.featuredImage?.node?.altText}
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
};

export default AboutUsProfiles;
