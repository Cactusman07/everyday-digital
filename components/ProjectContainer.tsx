"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import DetailPanel from "./DetailPanel";
import type { WPProject } from "@/lib/types";

export default function ProjectContainer({ data }: { data: WPProject[] }) {
  const [active, setActive] = useState<WPProject | null>(null);
  const close = useCallback(() => setActive(null), []);

  if (!data?.length) {
    return (
      <p className="mt-4 text-white/60">
        Your project could be here...{" "}
        <Link href="/contact/" className="text-[#a89cf7] hover:underline">
          Get in touch →
        </Link>
      </p>
    );
  }

  return (
    <div className="projects-page w-full">
      <div className="border-l-4 border-[#4b6ceb] rounded-r-xl bg-white/5 px-6 py-5 mb-8">
        <p className="text-[#4bafeb] text-[32px] font-bold mt-0 mb-3">
          Explore Our Digital Ventures
        </p>
        <p className="text-white/70 text-base leading-relaxed m-0">
          A selection of projects we&apos;ve had the pleasure of working on —
          from brand-new websites to custom platforms and everything in between.
          Every project is different; here&apos;s a taste of what we can do.
        </p>
        <p className="text-white/40 text-sm mt-3 mb-0">
          Your project could be next.{" "}
          <Link href="/contact/" className="projects-cta-link">
            Get in touch →
          </Link>
        </p>
      </div>

      <div className="projects-grid">
        {data.map((project: WPProject) => {
          const imgSrc = project.featuredImage?.node?.sourceUrl;
          return (
            <button
              key={project.slug}
              className="project-card"
              onClick={() => setActive(project)}
              aria-label={`View project: ${project.title}`}
            >
              {imgSrc && (
                <Image
                  src={imgSrc}
                  alt={project.featuredImage?.node?.altText || project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="project-card__img object-cover"
                />
              )}
              <div className="project-card__overlay">
                <span className="project-card__label">{project.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between gap-6 flex-wrap w-full">
        <p className="text-white/70 text-base leading-relaxed m-0">
          <strong className="text-white font-medium">Like what you see?</strong>
          <br />
          We&apos;d love to hear about your project — no commitment, just a
          conversation.
        </p>
        <Link href="/contact/">
          <button className="bg-[#4b6ceb] hover:bg-[#4bafeb] transition-colors duration-300 text-white rounded-xl px-5 py-2.5 text-sm font-medium whitespace-nowrap cursor-pointer">
            Get in touch
          </button>
        </Link>
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
    </div>
  );
}
