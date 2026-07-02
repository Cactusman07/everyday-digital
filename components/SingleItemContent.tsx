import Image from "next/image";
import Link from "next/link";
import Footer from "./Footer";
import Testimonials from "./Testimonials";
import type { WPPost, WPProject, WPService, WPTestimonial } from "@/lib/types";

const COVER_TAG = "cover";

interface SingleItemContentProps {
  type: "blog" | "project" | "service";
  item: WPPost | WPProject | WPService;
  testimonials: WPTestimonial[];
}

export default function SingleItemContent({
  type,
  item,
  testimonials,
}: SingleItemContentProps) {
  let backPath: string;
  let backLabel: string;

  if (type === "blog") {
    backPath = "/blog/";
    backLabel = "Back to Blog";
  } else if (type === "project") {
    backPath = "/projects/";
    backLabel = "Back to Projects";
  } else {
    backPath = "/services/";
    backLabel = "Back to Services";
  }

  const isService = type === "service";
  const post = type === "blog" ? (item as WPPost) : null;
  const isCover = post?.tags?.nodes?.some((t) => t.name === COVER_TAG) ?? false;
  const tags = post?.tags?.nodes?.filter((t) => t.name !== COVER_TAG) ?? [];
  const date = post?.date ? new Date(post.date).toLocaleDateString() : null;
  const image = item.featuredImage?.node ?? null;

  const imageClass =
    type === "blog"
      ? isCover
        ? "w-full h-full object-cover"
        : "max-w-full max-h-full object-contain"
      : "w-full h-full object-cover";

  return (
    <div
      id="content"
      className="mt-48 mb-24 mx-8 relative z-0 single-item-page"
    >
      <Link
        href={backPath}
        className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors duration-200 group"
      >
        <svg
          className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        {backLabel}
      </Link>

      {isService ? (
        <div className="flex items-center gap-4 mb-2">
          {image?.sourceUrl && (
            <Image
              src={image.sourceUrl}
              alt={image.altText || item.title}
              width={40}
              height={40}
              className="w-10 h-10 object-contain content-icon-tint flex-shrink-0"
            />
          )}
          <h2 className="m-0">{item.title}</h2>
        </div>
      ) : (
        <>
          {image?.sourceUrl && (
            <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-xl mb-8">
              <Image
                src={image.sourceUrl}
                alt={image.altText || item.title}
                fill
                sizes="100vw"
                className={imageClass}
              />
            </div>
          )}
          {date && (
            <span className="text-white/40 text-xs block mb-2">{date}</span>
          )}
          <h2>{item.title}</h2>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[#4bafeb] text-xs bg-[#4b6ceb]/10 px-2.5 py-1 rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      {item.content && (
        <div
          className="project-panel__content"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      )}

      {isService && (
        <Link href="/contact/">
          <div className="mt-8 px-8 py-5 bg-gradient-to-r from-[#4b6ceb] to-[#4bafeb] flex items-center justify-between rounded-xl group cursor-pointer">
            <div>
              <p className="text-white font-semibold uppercase tracking-widest text-sm m-0">
                Interested in this service?
              </p>
              <p className="text-white/70 text-xs m-0 mt-1">
                Get in touch and let&apos;s talk.
              </p>
            </div>
            <svg
              className="h-6 w-6 text-white transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </Link>
      )}

      <Testimonials data={testimonials} />
      <Footer />
    </div>
  );
}
