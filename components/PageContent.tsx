import Link from "next/link";
import ProjectContainer from "./ProjectContainer";
import AboutSection from "./AboutSection";
import AboutUsProfiles from "./AboutUsProfiles";
import GeneralContentRenderer from "./GeneralContentRenderer";
import Testimonials from "./Testimonials";
import ContactForm from "./ContactForm";
import Footer from "./Footer";
import type {
  WPFeaturedImage,
  WPProject,
  WPTeam,
  WPService,
  WPPost,
  WPTestimonial,
} from "@/lib/types";

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

export default function PageContent(props: PageContentProps) {
  return (
    <div id="content" className="mt-12 mb-24 mx-8 relative z-0">
      <h2>{props.title}</h2>
      {!!props.content && !props.title?.toLowerCase().includes("contact") && (
        <div dangerouslySetInnerHTML={{ __html: props.content }} />
      )}
      {props.title?.toLowerCase().includes("contact") && (
        <>
          <div className="border-l-4 border-[#4b6ceb] rounded-r-xl bg-white/5 px-6 py-5 mb-2">
            <p className="text-[#4bafeb] text-[32px] font-bold mt-0 mb-3">
              Let&apos;s Talk
            </p>
            <p className="text-white/70 text-base leading-relaxed m-0">
              Whether you&apos;ve got a clear brief or just an idea — we&apos;re
              here to help. Fill in the form and we&apos;ll get back to you
              within one business day.
            </p>
            <p className="text-white/40 text-sm mt-3 mb-0">
              Prefer to reach us another way?{" "}
              <a href="tel:0211759457" className="projects-cta-link">
                021 175 9457
              </a>{" "}
              or{" "}
              <a
                href="mailto:hello@everydaydigital.co.nz"
                className="projects-cta-link"
              >
                hello@everydaydigital.co.nz
              </a>
            </p>
          </div>
          <ContactForm />
        </>
      )}
      {props.title === "Projects" && <ProjectContainer data={props.projects} />}
      {props.title?.toLowerCase().includes("about") && (
        <>
          <AboutSection />
          <AboutUsProfiles data={props.team} />
        </>
      )}
      {props.title === "Blog" && (
        <>
          <div className="border-l-4 border-[#4b6ceb] rounded-r-xl bg-white/5 px-6 py-5 mb-2">
            <p className="text-[#4bafeb] text-[32px] font-bold mt-0 mb-3">
              Digital Thinking, Every Day
            </p>
            <p className="text-white/70 text-base leading-relaxed m-0">
              Practical tips, honest opinions, and ideas from the team at Every
              Day Digital — covering websites, automation, digital strategy, and
              what&apos;s actually working for small and growing businesses in
              New Zealand.
            </p>
            <p className="text-white/40 text-sm mt-3 mb-0">
              Have a topic you&apos;d like us to cover?{" "}
              <Link href="/contact/" className="projects-cta-link">
                Get in touch →
              </Link>
            </p>
          </div>
          <GeneralContentRenderer data={props.posts} icons={false} />
          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between gap-6 flex-wrap">
            <p className="text-white/70 text-base leading-relaxed m-0">
              <strong className="text-white font-medium">
                Ready to put these ideas into practice?
              </strong>
              <br />
              We work with businesses across New Zealand to make digital less
              complicated and more effective.
            </p>
            <Link href="/contact/">
              <button className="bg-[#4b6ceb] hover:bg-[#4bafeb] transition-colors duration-300 text-white rounded-xl px-5 py-2.5 text-sm font-medium whitespace-nowrap cursor-pointer">
                Get in touch
              </button>
            </Link>
          </div>
        </>
      )}
      {props.title === "Services" && (
        <>
          <GeneralContentRenderer data={props.services} icons={true} />
          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between gap-6 flex-wrap">
            <p className="text-white/70 text-base leading-relaxed m-0">
              <strong className="text-white font-medium">
                Ready to get started?
              </strong>
              <br />
              Whether you know exactly what you need or you&apos;re still
              figuring it out — we&apos;re easy to talk to and happy to help
              with no pressure.
            </p>
            <Link href="/contact/">
              <button className="bg-[#4b6ceb] hover:bg-[#4bafeb] transition-colors duration-300 text-white rounded-xl px-5 py-2.5 text-sm font-medium whitespace-nowrap cursor-pointer">
                Contact us
              </button>
            </Link>
          </div>
        </>
      )}
      <Testimonials data={props.testimonials} />
      <Footer />
    </div>
  );
}
