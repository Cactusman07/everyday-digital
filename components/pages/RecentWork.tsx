// "Recent work" on the About page: the case studies, as proof of what we do.

import CaseStudyCards from "@/components/shared/CaseStudyCards";
import { CASE_STUDIES } from "@/lib/case-studies";
import { SectionTitle } from "./AboutValues";

export default function RecentWork() {
  return (
    <section className="mt-10">
      <SectionTitle>Recent work</SectionTitle>
      <CaseStudyCards studies={CASE_STUDIES} />
    </section>
  );
}
