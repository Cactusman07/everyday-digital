// Low-level WPGraphQL access. Server-side only.

import type { CacheTag } from "./content-types";

/**
 * Publishing in WordPress refreshes the site straight away via
 * /api/revalidate. This timer is only the safety net if that call fails.
 */
export const FALLBACK_REVALIDATE_SECONDS = 60 * 5;

/** Stops a misbehaving cursor from looping forever (100 × 50 = 5000 items). */
const MAX_PAGES = 50;

function graphqlUrl(): string {
  const url = process.env.WORDPRESS_GRAPHQL_URL;
  if (!url) {
    throw new Error(
      "Missing WORDPRESS_GRAPHQL_URL environment variable. " +
        "Add it to .env.local, e.g.: WORDPRESS_GRAPHQL_URL=http://localhost:8181/graphql",
    );
  }
  return url;
}

/**
 * Runs one GraphQL request, cached under `tag` so /api/revalidate can purge it.
 *
 * @throws If WordPress is unreachable, returns a non-2xx status or reports a
 *   GraphQL error. Callers decide whether that's fatal (see {@link safe}).
 */
export async function fetchGraphQL<T>(
  query: string,
  tag: CacheTag,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(graphqlUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: FALLBACK_REVALIDATE_SECONDS, tags: [tag] },
  });
  if (!res.ok) throw new Error(`GraphQL fetch failed: ${res.status}`);

  const json = (await res.json()) as {
    data: T;
    errors?: { message: string }[];
  };
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

interface Connection<N> {
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
  nodes: N[];
}

/**
 * Fetches every node of a paginated connection query (see ./queries.ts),
 * following `endCursor` page by page.
 *
 * @param query - A query built by `paginated()` that takes `$after`.
 * @param connection - The root field to read, e.g. "posts".
 * @param tag - Cache tag for revalidation.
 */
export async function fetchAllNodes<N>(
  query: string,
  connection: string,
  tag: CacheTag,
): Promise<N[]> {
  const nodes: N[] = [];
  let after: string | null = null;
  for (let page = 0; page < MAX_PAGES; page++) {
    const data: Record<string, Connection<N>> = await fetchGraphQL(query, tag, {
      after,
    });
    const conn = data[connection];
    nodes.push(...conn.nodes);
    if (!conn.pageInfo.hasNextPage || !conn.pageInfo.endCursor) break;
    after = conn.pageInfo.endCursor;
  }
  return nodes;
}

/**
 * Runs a list fetch and returns `[]` if it throws. For sections that should
 * disappear quietly when WordPress is down (home page, testimonials, feeds),
 * rather than failing the whole page.
 */
export async function safe<T>(fn: () => Promise<T[]>): Promise<T[]> {
  try {
    return await fn();
  } catch {
    return [];
  }
}
