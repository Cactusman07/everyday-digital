// Data fetching layer — all WordPress GraphQL queries go through here.
// These functions run on the server (in Server Components), so API credentials
// and WordPress URLs are never exposed to the browser.

import {
  PAGES_QUERY,
  PROJECTS_QUERY,
  SERVICES_QUERY,
  POSTS_QUERY,
  TEAMS_QUERY,
  TESTIMONIALS_QUERY,
} from "./queries";
import type {
  WPPage,
  WPProject,
  WPService,
  WPPost,
  WPTeam,
  WPTestimonial,
} from "./types";
import { sanitize } from "./sanitizeHtml";

// Cache tags — one per content type. app/api/revalidate/route.ts calls
// revalidateTag() with these when WordPress fires its publish hook, so a change
// in the CMS reaches production within seconds instead of waiting on a timer.
export const WP_TAGS = {
  pages: "wp:pages",
  projects: "wp:projects",
  services: "wp:services",
  posts: "wp:posts",
  teams: "wp:teams",
  testimonials: "wp:testimonials",
} as const;

export type WPTag = (typeof WP_TAGS)[keyof typeof WP_TAGS];

// Safety net: even with on-demand revalidation, re-fetch at most once a day so
// a missed webhook can never leave stale content up indefinitely.
const FALLBACK_REVALIDATE_SECONDS = 60 * 60 * 24;

// Validates the WordPress URL is configured — fails fast with a helpful error
// instead of a cryptic "fetch failed" at runtime.
function getGraphQLUrl(): string {
  const url = process.env.WORDPRESS_GRAPHQL_URL;
  if (!url) {
    throw new Error(
      "Missing WORDPRESS_GRAPHQL_URL environment variable. " +
        "Add it to .env.local, e.g.: WORDPRESS_GRAPHQL_URL=http://localhost:8181/graphql",
    );
  }
  return url;
}

async function fetchGraphQL<T>(
  query: string,
  tag: WPTag,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(getGraphQLUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: FALLBACK_REVALIDATE_SECONDS, tags: [tag] },
  });

  if (!res.ok) {
    throw new Error(`GraphQL fetch failed: ${res.status}`);
  }

  const json = await res.json();
  if (json.errors) {
    // Some WP plugins add fields (like "seo") that WPGraphQL doesn't support —
    // filter those out so they don't crash the page
    const visible = json.errors.filter(
      (e: { message: string }) => !e.message.includes('"seo"'),
    );
    if (visible.length) throw new Error(visible[0].message);
  }
  return json.data;
}

// Typed fetch functions — each returns a specific WordPress content type.

export async function getPages(): Promise<WPPage[]> {
  const data = await fetchGraphQL<{ pages: { nodes: WPPage[] } }>(
    PAGES_QUERY,
    WP_TAGS.pages,
  );
  return data.pages.nodes.map((p) => ({ ...p, content: sanitize(p.content) }));
}

export async function getProjects(): Promise<WPProject[]> {
  const data = await fetchGraphQL<{ projects: { nodes: WPProject[] } }>(
    PROJECTS_QUERY,
    WP_TAGS.projects,
  );
  return data.projects.nodes.map((p) => ({
    ...p,
    content: sanitize(p.content),
    ...(p.excerpt !== undefined && { excerpt: sanitize(p.excerpt) }),
  }));
}

export async function getServices(): Promise<WPService[]> {
  const data = await fetchGraphQL<{ services: { nodes: WPService[] } }>(
    SERVICES_QUERY,
    WP_TAGS.services,
  );
  return data.services.nodes.map((s) => ({
    ...s,
    content: sanitize(s.content),
    excerpt: sanitize(s.excerpt),
  }));
}

export async function getPosts(): Promise<WPPost[]> {
  const data = await fetchGraphQL<{ posts: { nodes: WPPost[] } }>(
    POSTS_QUERY,
    WP_TAGS.posts,
  );
  return data.posts.nodes.map((p) => ({
    ...p,
    content: sanitize(p.content),
    ...(p.excerpt !== undefined && { excerpt: sanitize(p.excerpt) }),
  }));
}

export async function getTeams(): Promise<WPTeam[]> {
  const data = await fetchGraphQL<{ teams: { nodes: WPTeam[] } }>(
    TEAMS_QUERY,
    WP_TAGS.teams,
  );
  return data.teams.nodes.map((t) => ({
    ...t,
    content: sanitize(t.content),
    excerpt: sanitize(t.excerpt),
  }));
}

export async function getTestimonials(): Promise<WPTestimonial[]> {
  const data = await fetchGraphQL<{ testimonials: { nodes: WPTestimonial[] } }>(
    TESTIMONIALS_QUERY,
    WP_TAGS.testimonials,
  );
  return data.testimonials.nodes.map((t) => ({
    ...t,
    content: sanitize(t.content),
  }));
}

// "Safe" variants — return [] instead of throwing. Used by the home page and
// other places where a WordPress outage should degrade to an empty section,
// not a 404 for the whole site.
export async function safe<T>(fn: () => Promise<T[]>): Promise<T[]> {
  try {
    return await fn();
  } catch {
    return [];
  }
}

// Slug-based lookups — used by detail pages (blog/[slug], projects/[slug], etc.)

export async function getPageBySlug(slug: string): Promise<WPPage | undefined> {
  const pages = await getPages();
  return pages.find((p) => p.uri === `/${slug}/` || p.uri === `/${slug}`);
}

export async function getPostBySlug(slug: string): Promise<WPPost | undefined> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getProjectBySlug(
  slug: string,
): Promise<WPProject | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}

export async function getServiceBySlug(
  slug: string,
): Promise<WPService | undefined> {
  const services = await getServices();
  return services.find((s) => s.slug === slug);
}
