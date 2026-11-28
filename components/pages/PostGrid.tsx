// The Blog page: the latest post as a large card, then the rest in a grid.

import Image from "next/image";
import Link from "next/link";
import { formatDate, newestFirst } from "@/lib/dates";
import { excerptOf, readingMinutes } from "@/lib/html";
import { isCoverPost, postTags, type WPPost } from "@/lib/wordpress";
import { itemPath } from "@/lib/wordpress/content-types";
import { isCmsMediaUrl } from "@/lib/wordpress/images";

function PostCard({ post, big = false }: { post: WPPost; big?: boolean }) {
  const isCover = isCoverPost(post);
  const tags = postTags(post).slice(0, 3);
  const img = post.featuredImage?.node;
  return (
    <Link
      href={itemPath("post", post.slug)}
      className={`edd-card post-card${big ? " post-card--big" : ""}`}
    >
      {isCmsMediaUrl(img?.sourceUrl) && (
        <div
          className={`post-card__img${isCover ? "" : " post-card__img--contain"}`}
        >
          <Image
            src={img.sourceUrl}
            alt={img.altText || post.title}
            fill
            // The big latest-post card is the page's largest image (LCP)
            priority={big}
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
        <h2 className="post-card__title">{post.title}</h2>
        <span className="post-card__text">
          {excerptOf(post, big ? 220 : 140)}
        </span>
        {tags.length > 0 && (
          <span className="post-card__tags">
            {tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function PostGrid({ posts }: { posts: WPPost[] }) {
  const [latest, ...rest] = newestFirst(posts);
  if (!latest) return null;
  return (
    <div className="post-grid">
      <PostCard post={latest} big />
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
