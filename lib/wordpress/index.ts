// WordPress content getters. Server-side only. Each returns every published
// item of one type (all pages of results), with its HTML sanitised.

import { cache } from "react";
import { fetchAllNodes } from "./client";
import { CONTENT_TYPES, type ContentType } from "./content-types";
import { QUERIES } from "./queries";
import { decodeEntities } from "../html";
import { sanitize } from "./sanitize";
import type {
  WPPage,
  WPPost,
  WPProject,
  WPService,
  WPTeamMember,
  WPTestimonial,
} from "./types";

export { safe } from "./client";
export type * from "./types";

/**
 * Prepares an item for rendering: HTML fields are sanitised, and the title,
 * which WordPress may return with entities such as `&#8217;`, becomes plain
 * text so it can be printed by React and used in metadata as-is.
 */
function clean<T extends { title: string; content: string; excerpt?: string }>(
  item: T,
): T {
  return {
    ...item,
    title: decodeEntities(item.title),
    content: sanitize(item.content),
    ...(item.excerpt !== undefined && { excerpt: sanitize(item.excerpt) }),
  };
}

/** The node type each content type's query returns. */
interface NodeTypes {
  page: WPPage;
  post: WPPost;
  project: WPProject;
  service: WPService;
  team: WPTeamMember;
  testimonial: WPTestimonial;
}

/**
 * Every published item of one content type, all pages of results, cleaned.
 *
 * @throws If WordPress can't be reached; wrap in {@link safe} to get `[]`.
 */
async function fetchAll<K extends ContentType>(
  type: K,
): Promise<NodeTypes[K][]> {
  const { query, connection } = QUERIES[type];
  const nodes = await fetchAllNodes<NodeTypes[K]>(
    query,
    connection,
    CONTENT_TYPES[type].tag,
  );
  return nodes.map(clean);
}

// cache(): within one request, generateMetadata, the page and the share
// image share a single fetched-and-sanitised list instead of three.
export const getPages = cache(() => fetchAll("page"));
export const getPosts = cache(() => fetchAll("post"));
export const getProjects = cache(() => fetchAll("project"));
export const getServices = cache(() => fetchAll("service"));
export const getTeam = cache(() => fetchAll("team"));
export const getTestimonials = cache(() => fetchAll("testimonial"));

/**
 * Blog tag that marks a post whose featured image is a photo to crop to fill
 * its frame (rather than a graphic shown whole). Never shown as a tag.
 */
const COVER_TAG = "cover";

/** True when a post's featured image should fill its frame. */
export const isCoverPost = (post: WPPost) =>
  !!post.tags?.nodes.some((t) => t.name === COVER_TAG);

/** A post's visible tag names (everything except the cover marker). */
export const postTags = (post: WPPost) =>
  post.tags?.nodes.map((t) => t.name).filter((n) => n !== COVER_TAG) ?? [];

/** A page's slug from its WordPress uri: "/about/" → "about". */
export function pageSlug(page: Pick<WPPage, "uri">): string {
  return page.uri.replace(/^\/|\/$/g, "");
}

/** The published page at `/<slug>`, or undefined. */
export async function getPage(slug: string): Promise<WPPage | undefined> {
  return (await getPages()).find((p) => pageSlug(p) === slug);
}
