// Lists for the Services and Blog pages. Every card is a real link to its own
// full page (good for visitors and for search engines, which follow links but
// not click handlers).

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import ServiceIcon, { hasServiceIcon } from "./ServiceIcon";
import { getServiceMeta } from "@/lib/site";
import { excerptText, formatDate, readingMinutes } from "@/lib/content";
import type { WPService, WPPost } from "@/lib/types";

const COVER_TAG = "cover";

function ServiceGrid({ data }: { data: WPService[] }) {
  return (
    <ul className="svc-grid">
      {data.map((item, i) => {
        const meta = getServiceMeta(item.slug);
        return (
          <li key={item.databaseId ?? item.slug}>
            <Link
              href={`/services/${item.slug}`}
              className="edd-card svc-grid__card has-sicon"
              style={{ "--k": meta?.colour ?? "#4bafeb" } as CSSProperties}
            >
              <span className="svc-grid__n">
                {String(i + 1).padStart(2, "0")}
              </span>
              {hasServiceIcon(item.slug) ? (
                <ServiceIcon slug={item.slug} size={48} />
              ) : (
                !!item.featuredImage?.node?.sourceUrl && (
                  <Image
                    src={item.featuredImage.node.sourceUrl}
                    alt=""
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain content-icon-tint"
                  />
                )
              )}
              <span className="edd-card__title">{item.title}</span>
              {meta && (
                <span className="svc-grid__word">Every Day {meta.word}</span>
              )}
              <span className="svc-grid__text">
                {excerptText(item.excerpt || item.content, 170)}
              </span>
              <span className="svc-grid__go">Find out more →</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function PostCard({ post, big = false }: { post: WPPost; big?: boolean }) {
  const tags = post.tags?.nodes ?? [];
  const isCover = tags.some((t) => t.name === COVER_TAG);
  const shown = tags.filter((t) => t.name !== COVER_TAG).slice(0, 3);
  const img = post.featuredImage?.node;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`edd-card post-card${big ? " post-card--big" : ""}`}
    >
      {img?.sourceUrl && (
        <div
          className={`post-card__img${isCover ? "" : " post-card__img--contain"}`}
        >
          <Image
            src={img.sourceUrl}
            alt={img.altText || post.title}
            fill
            sizes={
              big
                ? "(max-width: 900px) 100vw, 60vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
          />
        </div>
      )}
      <div className="post-card__body">
        <span className="post-card__meta">
          {big && <b>Latest · </b>}
          {formatDate(post.date)} · {readingMinutes(post.content)} min read
        </span>
        <span className="post-card__title">{post.title}</span>
        <span className="post-card__text">
          {excerptText(post.excerpt || post.content, big ? 220 : 140)}
        </span>
        {shown.length > 0 && (
          <span className="post-card__tags">
            {shown.map((t) => (
              <span key={t.name} className="chip">
                {t.name}
              </span>
            ))}
          </span>
        )}
      </div>
    </Link>
  );
}

function PostGrid({ data }: { data: WPPost[] }) {
  const sorted = [...data].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date),
  );
  const [first, ...rest] = sorted;
  if (!first) return null;
  return (
    <div className="post-grid">
      <PostCard post={first} big />
      <ul className="post-grid__list">
        {rest.map((p) => (
          <li key={p.slug}>
            <PostCard post={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function GeneralContentRenderer({
  data,
  icons,
}: {
  data: (WPService | WPPost)[];
  icons: boolean;
}) {
  return icons ? (
    <ServiceGrid data={data as WPService[]} />
  ) : (
    <PostGrid data={data as WPPost[]} />
  );
}
