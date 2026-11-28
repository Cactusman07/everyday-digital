/**
 * The one table that maps each WordPress content type to everything the site
 * derives from it: the cache tag its queries are stored under, and — for the
 * types that have their own pages — the URL section they live in.
 *
 * Used by the GraphQL getters (cache tags), /api/revalidate (which tags and
 * paths to purge), the detail routes, the sitemap, feeds and breadcrumbs, so a
 * new section or a renamed path is a one-line change here.
 *
 * The keys are the canonical names the WordPress mu-plugins send in their
 * `type` field (see wpTheme/mu-plugins/edd-common.php).
 */

export const CONTENT_TYPES = {
  page: { tag: "wp:pages" },
  post: {
    tag: "wp:posts",
    section: { path: "/blog", label: "Blog", kicker: "Blog" },
  },
  project: {
    tag: "wp:projects",
    section: { path: "/projects", label: "Projects", kicker: "Project" },
  },
  service: {
    tag: "wp:services",
    section: { path: "/services", label: "Services", kicker: "Service" },
  },
  team: { tag: "wp:teams" },
  testimonial: { tag: "wp:testimonials" },
} as const;

export type ContentType = keyof typeof CONTENT_TYPES;
export type CacheTag = (typeof CONTENT_TYPES)[ContentType]["tag"];

/** Content types that have a page of their own at `<section>/<slug>`. */
export type RoutedType = {
  [K in ContentType]: (typeof CONTENT_TYPES)[K] extends { section: object }
    ? K
    : never;
}[ContentType];

export const ALL_CACHE_TAGS: CacheTag[] = Object.values(CONTENT_TYPES).map(
  (t) => t.tag,
);

/** Section path and labels for a routed type, e.g. `{ path: "/blog", … }`. */
export function sectionOf(type: RoutedType) {
  return CONTENT_TYPES[type].section;
}

/** Site-relative path of a routed item, e.g. `itemPath("post", "hi")` → `/blog/hi`. */
export function itemPath(type: RoutedType, slug: string): string {
  return `${sectionOf(type).path}/${slug}`;
}

/**
 * Normalise a `type` sent by WordPress to a canonical {@link ContentType}.
 * Accepts the canonical key in any case, the WordPress post type key (some
 * custom types are registered as plurals, e.g. "Projects") and singular or
 * plural forms. Returns undefined for anything unknown.
 */
export function toContentType(
  raw: string | undefined,
): ContentType | undefined {
  if (!raw) return undefined;
  const key = raw.trim().toLowerCase();
  const singular = key.endsWith("s") ? key.slice(0, -1) : key;
  if (Object.hasOwn(CONTENT_TYPES, key)) return key as ContentType;
  if (Object.hasOwn(CONTENT_TYPES, singular)) return singular as ContentType;
  return undefined;
}

/** True when a content type has pages of its own (see {@link RoutedType}). */
export function isRoutedType(type: ContentType): type is RoutedType {
  return "section" in CONTENT_TYPES[type];
}
