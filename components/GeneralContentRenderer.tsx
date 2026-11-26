"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import DetailPanel from "./DetailPanel";
import ServiceIcon, { hasServiceIcon } from "./ServiceIcon";
import { getServiceMeta } from "@/lib/site";
import type { WPService, WPPost } from "@/lib/types";

type ContentItem = WPService | WPPost;

const COVER_TAG = "cover";

export default function GeneralContentRenderer({
  data,
  icons,
}: {
  data: ContentItem[];
  icons: boolean;
}) {
  const [active, setActive] = useState<ContentItem | null>(null);
  const close = useCallback(() => setActive(null), []);

  if (icons) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
          {data.map((item: ContentItem, index: number) => (
            <div
              key={item.databaseId ?? `${item.title}-${index}`}
              onClick={() => setActive(item)}
              style={
                {
                  "--k": getServiceMeta(item.slug)?.colour ?? "#4bafeb",
                } as React.CSSProperties
              }
              className="edd-card has-sicon p-6 cursor-pointer group flex flex-col gap-3"
            >
              {hasServiceIcon(item.slug) ? (
                <ServiceIcon slug={item.slug} size={44} className="mb-1" />
              ) : (
                !!item.featuredImage?.node?.sourceUrl && (
                  <div className="text-[#4bafeb] mb-1">
                    <Image
                      src={item.featuredImage.node.sourceUrl}
                      alt={item.featuredImage.node.altText ?? item.title}
                      width={44}
                      height={44}
                      className="w-11 h-11 object-contain content-icon-tint"
                    />
                  </div>
                )
              )}
              <p className="edd-card__title">{item.title}</p>
              <div
                className="text-white/60 text-sm leading-relaxed services-content"
                dangerouslySetInnerHTML={{ __html: item.excerpt ?? "" }}
              />
              <span className="text-[#4bafeb] text-xs uppercase tracking-widest mt-1 flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200">
                Find out more
                <svg
                  className="h-3 w-3"
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
              </span>
            </div>
          ))}
        </div>

        {active && (
          <DetailPanel
            title={active.title}
            content={active.content ?? ""}
            image={active.featuredImage?.node ?? null}
            type="service"
            onClose={close}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
        {data.map((item: ContentItem, index: number) => {
          const date = (item as WPPost)?.date
            ? new Date((item as WPPost).date).toLocaleDateString("en-NZ", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : null;
          const allTags = (item as WPPost)?.tags?.nodes || [];
          const isCover = allTags.some((t) => t.name === COVER_TAG);
          const tags = allTags.filter((t) => t.name !== COVER_TAG);

          return (
            <div
              key={item.databaseId ?? `${item.title}-${date ?? index}`}
              onClick={() => setActive(item)}
              className="edd-card cursor-pointer group flex flex-col overflow-hidden"
            >
              {!!item.featuredImage?.node?.sourceUrl && (
                <div className="relative w-full h-36 md:h-40 overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">
                  <Image
                    src={item.featuredImage.node.sourceUrl}
                    alt={item.featuredImage.node.altText ?? item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={
                      isCover
                        ? "object-cover transition duration-300 group-hover:scale-[1.02]"
                        : "object-contain transition duration-300 group-hover:scale-[1.02]"
                    }
                  />
                </div>
              )}
              <div className="p-5 flex flex-col gap-2 flex-1">
                {!!date && (
                  <span className="text-white/40 text-xs">{date}</span>
                )}
                <p className="text-white text-base font-medium m-0">
                  {item.title}
                </p>
                <div
                  className="text-white/60 text-sm leading-relaxed services-content"
                  dangerouslySetInnerHTML={{
                    __html: item.excerpt || item.content,
                  }}
                />
              </div>
              {tags.length > 0 && (
                <div className="px-5 pb-5 pt-0 flex flex-wrap gap-2">
                  {tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-[#4bafeb] text-xs bg-[#4b6ceb]/10 px-2.5 py-1 rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
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
          coverImage={
            (active as WPPost)?.tags?.nodes?.some(
              (t) => t.name === COVER_TAG,
            ) ?? false
          }
          onClose={close}
        />
      )}
    </>
  );
}
