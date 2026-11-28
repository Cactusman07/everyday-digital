// Date helpers shared by pages, schema, the sitemap and feeds.

/**
 * WordPress GraphQL returns GMT dates without a zone marker. Appending "Z"
 * makes them unambiguous for schema, sitemaps and feeds.
 */
export function gmt(date?: string | null): string | undefined {
  if (!date) return undefined;
  return /(?:[zZ]|[+-]\d\d:?\d\d)$/.test(date) ? date : `${date}Z`;
}

/** "19 November 2026" in New Zealand English. Empty for a missing date. */
export function formatDate(date?: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** A copy of `items` sorted newest first by their `date`. */
export function newestFirst<T extends { date?: string }>(items: T[]): T[] {
  const time = (d?: string) => (d ? Date.parse(d) || 0 : 0);
  return [...items].sort((a, b) => time(b.date) - time(a.date));
}

/** The latest of some ISO dates, ignoring missing ones. */
export function latest(dates: (string | undefined)[]): string | undefined {
  return dates
    .filter((d): d is string => !!d)
    .sort()
    .at(-1);
}

/**
 * When an item was published, as an unambiguous UTC date where WordPress
 * gave one, else the site-local date.
 */
export const publishedAt = (item: { date: string; dateGmt?: string }) =>
  gmt(item.dateGmt) ?? item.date;
