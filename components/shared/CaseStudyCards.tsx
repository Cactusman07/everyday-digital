// Cards linking to case studies: screenshot, sector, client and summary.
// Used on landing pages ("Recent work") and under a case study ("Other projects").

import Image from "next/image";
import Link from "next/link";
import { caseStudyImage, type CaseStudyMeta } from "@/lib/case-studies";
import Reveal from "./Reveal";
import { itemPath } from "@/lib/wordpress/content-types";

export default function CaseStudyCards({
  studies,
  columns = 2,
}: {
  studies: CaseStudyMeta[];
  columns?: 2 | 3;
}) {
  return (
    <Reveal
      className={`work-grid${columns === 3 ? " work-grid--3" : ""}`}
      as="ul"
    >
      {studies.map((c) => (
        <li
          key={c.slug}
          className={`work-card${c.ownBusiness ? " work-card--own" : ""}`}
        >
          <Link href={itemPath("project", c.slug)} className="work-card__link">
            <div className="work-card__media">
              <Image
                src={caseStudyImage(c.slug)}
                alt={`${c.client} website`}
                fill
                sizes={`(max-width: 760px) 100vw, ${columns === 3 ? "33vw" : "50vw"}`}
                className="work-card__img"
              />
            </div>
            <div className="work-card__body">
              <span className="work-card__sector">{c.sector}</span>
              <h3>{c.client}</h3>
              <p>{c.summary}</p>
            </div>
          </Link>
        </li>
      ))}
    </Reveal>
  );
}
