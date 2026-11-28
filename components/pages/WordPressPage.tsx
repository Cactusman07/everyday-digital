// A standard WordPress page (About, Services, Projects, Blog, Contact,
// Terms…). Opens with the page header; then the CMS content (or the contact
// form), the list that belongs on that page, a call to action, testimonials
// and the footer. What goes where is decided by the page's entry in
// lib/pages.ts.

import SiteFooter from "@/components/layout/SiteFooter";
import ArticleBody from "@/components/shared/ArticleBody";
import CallToActionBand from "@/components/shared/CallToActionBand";
import ContactForm from "@/components/shared/ContactForm";
import Testimonials from "@/components/shared/Testimonials";
import { stripHtml } from "@/lib/html";
import type { PageConfig } from "@/lib/pages";
import { SITE, telHref } from "@/lib/site";
import type {
  WPPage,
  WPPost,
  WPProject,
  WPService,
  WPTeamMember,
  WPTestimonial,
} from "@/lib/wordpress";
import AboutValues from "./AboutValues";
import PageHeader from "./PageHeader";
import PostGrid from "./PostGrid";
import ProjectGrid from "./ProjectGrid";
import ServiceGrid from "./ServiceGrid";
import TeamProfiles from "./TeamProfiles";

/** The WordPress list shown on a page, tagged by kind (see PageConfig.listing). */
export type PageListingData =
  | { kind: "services"; items: WPService[] }
  | { kind: "projects"; items: WPProject[] }
  | { kind: "posts"; items: WPPost[] }
  | { kind: "team"; items: WPTeamMember[] };

function Listing({ listing }: { listing: PageListingData }) {
  switch (listing.kind) {
    case "services":
      return <ServiceGrid services={listing.items} />;
    case "projects":
      return <ProjectGrid projects={listing.items} />;
    case "posts":
      return <PostGrid posts={listing.items} />;
    case "team":
      return (
        <>
          <AboutValues />
          <TeamProfiles
            team={listing.items.map((m) => ({
              ...m,
              bio: stripHtml(m.excerpt),
            }))}
          />
        </>
      );
  }
}

function ContactDetails() {
  return (
    <>
      <p className="page-intro page-intro--small">
        Prefer another way? Call{" "}
        <a href={telHref()} className="projects-cta-link">
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
  );
}

export default function WordPressPage({
  page,
  config,
  listing,
  testimonials,
}: {
  page: WPPage;
  config: PageConfig;
  listing?: PageListingData;
  testimonials: WPTestimonial[];
}) {
  return (
    <div id="content" className="page-wrap">
      <PageHeader title={page.title} eyebrow={config.eyebrow ?? SITE.name} />
      {config.intro && <p className="page-intro">{config.intro}</p>}

      {config.contactForm ? (
        <ContactDetails />
      ) : (
        page.content && <ArticleBody html={page.content} />
      )}

      {listing && <Listing listing={listing} />}
      {config.cta && <CallToActionBand {...config.cta} />}

      <Testimonials testimonials={testimonials} />
      <SiteFooter />
    </div>
  );
}
