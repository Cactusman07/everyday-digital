/**
 * Shapes of the WordPress content returned by the GraphQL queries in
 * ./queries.ts. Only fields the site reads are queried and typed.
 *
 * Dates: `date` is the site-local publish date (used for display and
 * ordering); `dateGmt` / `modifiedGmt` are UTC without a zone marker — pass
 * them through {@link gmt} from lib/dates.ts before putting them in schema,
 * sitemaps or feeds.
 */

export interface WPImage {
  sourceUrl: string;
  altText?: string;
}

/** WPGraphQL wraps the featured image in an edge: `featuredImage.node`. */
export interface WPFeaturedImage {
  node: WPImage;
}

export interface WPPage {
  databaseId: number;
  title: string;
  /** e.g. "/about/" — WordPress keeps the trailing slash. */
  uri: string;
  content: string;
  featuredImage?: WPFeaturedImage;
  modifiedGmt?: string;
  isFrontPage: boolean;
}

/** Fields shared by every post type that has its own page and slug. */
export interface WPEntry {
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: WPFeaturedImage;
  modifiedGmt?: string;
}

export interface WPPost extends WPEntry {
  date: string;
  dateGmt?: string;
  tags?: { nodes: { name: string }[] };
}

export interface WPProject extends WPEntry {
  date: string;
  dateGmt?: string;
}

export type WPService = WPEntry;

export interface WPTeamMember {
  databaseId: number;
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: WPFeaturedImage;
}

export interface WPTestimonial {
  /** "Name - Company", e.g. "David Kerr - NZ In Pictures". */
  title: string;
  content: string;
}
