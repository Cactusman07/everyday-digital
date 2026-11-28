/**
 * WPGraphQL queries. Every list query is paginated: WPGraphQL caps `first` at
 * 100 (and returns only 10 without it), so {@link fetchAllNodes} in
 * ./client.ts follows `pageInfo.endCursor` until `hasNextPage` is false.
 */

import type { ContentType } from "./content-types";

const FEATURED_IMAGE = `featuredImage { node { sourceUrl altText } }`;

/** Fields every routed entry (post, project, service) has in common. */
const ENTRY_FIELDS = `
  databaseId
  title
  slug
  content(format: RENDERED)
  excerpt(format: RENDERED)
  modifiedGmt
  ${FEATURED_IMAGE}
`;

/**
 * Wraps a connection's node fields in a paginated query.
 *
 * @param connection - WPGraphQL root connection field, e.g. "posts".
 * @param fields - GraphQL selection for each node.
 * @param where - Optional `where` argument, e.g. `{ status: PUBLISH }`.
 */
function paginated(connection: string, fields: string, where?: string) {
  const args = ["first: 100", "after: $after", where && `where: ${where}`]
    .filter(Boolean)
    .join(", ");
  return {
    connection,
    query: `
      query ${connection[0].toUpperCase()}${connection.slice(1)}($after: String) {
        ${connection}(${args}) {
          pageInfo { hasNextPage endCursor }
          nodes { ${fields} }
        }
      }
    `,
  };
}

/** The paginated query for each content type, and the connection it reads. */
export const QUERIES: Record<
  ContentType,
  { connection: string; query: string }
> = {
  page: paginated(
    "pages",
    `databaseId title uri content(format: RENDERED) modifiedGmt isFrontPage ${FEATURED_IMAGE}`,
    // Oldest first: the order the menu has always used
    "{ status: PUBLISH, orderby: { field: DATE, order: ASC } }",
  ),
  post: paginated(
    "posts",
    `${ENTRY_FIELDS} date dateGmt tags { nodes { name } }`,
  ),
  project: paginated("projects", `${ENTRY_FIELDS} date dateGmt`),
  service: paginated("services", ENTRY_FIELDS),
  team: paginated(
    "teams",
    `databaseId title content(format: RENDERED) excerpt(format: RENDERED) ${FEATURED_IMAGE}`,
  ),
  testimonial: paginated("testimonials", `title content(format: RENDERED)`),
};
