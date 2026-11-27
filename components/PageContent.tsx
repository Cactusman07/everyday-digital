// Standard WordPress pages (About, Services, Projects, Blog, Contact, Terms…).
// Every page opens with the shared page header; the CMS content follows, then
// any list that belongs on that page, a call to action, testimonials and the
// footer.

import Link from "next/link";
import ProjectContainer from "./ProjectContainer";
import AboutSection from "./AboutSection";
import AboutUsProfiles from "./AboutUsProfiles";
import GeneralContentRenderer from "./GeneralContentRenderer";
import PageHeader from "./PageHeader";
import ContactForm from "./ContactForm";
import Footer from "./Footer";
import Testimonials from "./Testimonials";
import ReadingProgress from "./show/ReadingProgress";
import TocSpy from "./show/TocSpy";
import { SERVICES, SITE } from "@/lib/site";
import { withHeadingIds } from "@/lib/content";
import type {
  WPFeaturedImage,
  WPProject,
  WPTeam,
  WPService,
  WPPost,
  WPTestimonial,
} from "@/lib/types";

const serviceRank = (slug?: string) => {
  const i = SERVICES.findIndex((s) => s.slug === slug);
  return i === -1 ? SERVICES.length : i;
};

interface PageContentProps {
  content: string | null;
  title: string;
  featuredImage?: WPFeaturedImage;
  projects: WPProject[];
  team: WPTeam[];
  services: WPService[];
  posts: WPPost[];
  testimonials: WPTestimonial[];
}

// Short intro line under the title on the list pages
const INTROS: Record<string, { eyebrow: string; text: string }> = {
  Services: {
    eyebrow: "What we do",
    text: "",
  },
  Projects: {
    eyebrow: "Our work",
    text: "Websites, online stores and custom portals for New Zealand businesses — plus two businesses we run ourselves.",
  },
  Blog: {
    eyebrow: "The blog",
    text: "The latest digital trends, news and project updates, in plain English. Websites, online stores, AI search and automation for small and growing NZ businesses.",
  },
  Contact: {
    eyebrow: "Get in touch",
    text: "Whether you've got a clear brief or just an idea, we're here to help. Fill in the form and we'll get back to you within one business day.",
  },
};

function CtaBand({
  heading,
  text,
  label = "Start with a free chat",
}: {
  heading: string;
  text: string;
  label?: string;
}) {
  return (
    <section className="show__cta">
      <p className="show__cta-script">Every Day.</p>
      <div>
        <p className="show__cta-h">{heading}</p>
        <p>{text}</p>
      </div>
      <Link href="/contact" className="btn btn--accent btn--lg">
        {label}
      </Link>
    </section>
  );
}

export default function PageContent(props: PageContentProps) {
  const title = props.title ?? "";
  const isContact = title.toLowerCase().includes("contact");
  const intro = INTROS[title] ?? (isContact ? INTROS.Contact : undefined);
  const { html, toc } = withHeadingIds(props.content ?? "");
  // Long text pages (Terms, About) get the contents list and progress bar
  const isLongRead = toc.length >= 4;

  return (
    <div id="content" className="page-wrap">
      {isLongRead && <ReadingProgress />}
      <PageHeader
        title={title}
        eyebrow={intro?.eyebrow ?? "Every Day Digital"}
      />
      {intro?.text && <p className="page-intro">{intro.text}</p>}

      {!!props.content && !isContact && (
        <div className={`show__body${isLongRead ? "" : " show__body--solo"}`}>
          {isLongRead && <TocSpy items={toc} />}
          <div
            className="prose-edd show__article"
            data-article
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}

      {isContact && (
        <>
          <p className="page-intro page-intro--small">
            Prefer another way? Call{" "}
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="projects-cta-link"
            >
              {SITE.phone}
            </a>{" "}
            or email{" "}
            <a href={`mailto:${SITE.email}`} className="projects-cta-link">
              {SITE.email}
            </a>
            .
          </p>
          <ContactForm />
        </>
      )}

      {title === "Projects" && (
        <>
          <ProjectContainer data={props.projects} />
          <CtaBand
            heading="Like what you see?"
            text="We'd love to hear about your project. No commitment, just a conversation."
          />
        </>
      )}

      {title.toLowerCase().includes("about") && (
        <>
          <AboutSection />
          <AboutUsProfiles data={props.team} />
        </>
      )}

      {title === "Blog" && (
        <>
          <GeneralContentRenderer data={props.posts} icons={false} />
          <CtaBand
            heading="Ready to put these ideas into practice?"
            text="We work with businesses across New Zealand to make digital less complicated and more effective."
          />
        </>
      )}

      {title === "Services" && (
        <>
          <GeneralContentRenderer
            data={[...props.services].sort(
              (a, b) => serviceRank(a.slug) - serviceRank(b.slug),
            )}
            icons={true}
          />
          <CtaBand
            heading="Not sure which one you need?"
            text="Most projects mix two or three of these. Tell us what you're trying to do and we'll come back with a fixed-price quote."
            label="Book a free consultation"
          />
        </>
      )}

      <Testimonials data={props.testimonials} />
      <Footer />
    </div>
  );
}
