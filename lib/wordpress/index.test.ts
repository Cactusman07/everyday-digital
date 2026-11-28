import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const MOCK_GRAPHQL_URL = "http://localhost:8181/graphql";
const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

let wp: typeof import("./index");

beforeAll(async () => {
  process.env.WORDPRESS_GRAPHQL_URL = MOCK_GRAPHQL_URL;
  wp = await import("./index");
});

beforeEach(() => fetchMock.mockReset());

/** Queues one GraphQL page of `nodes` for `connection`. */
function respond(
  connection: string,
  nodes: unknown[],
  next: string | null = null,
) {
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({
        data: {
          [connection]: {
            pageInfo: { hasNextPage: next !== null, endCursor: next },
            nodes,
          },
        },
      }),
  });
}

describe("fetching", () => {
  it("POSTs the query with its cache tag", async () => {
    respond("pages", []);
    await wp.getPages();
    expect(fetchMock).toHaveBeenCalledWith(
      MOCK_GRAPHQL_URL,
      expect.objectContaining({
        method: "POST",
        next: expect.objectContaining({ tags: ["wp:pages"] }),
      }),
    );
  });

  it("follows the cursor until the last page", async () => {
    respond("posts", [{ slug: "a", title: "A", content: "" }], "cursor-1");
    respond("posts", [{ slug: "b", title: "B", content: "" }]);
    const posts = await wp.getPosts();
    expect(posts.map((p) => p.slug)).toEqual(["a", "b"]);
    const second = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(second.variables).toEqual({ after: "cursor-1" });
  });

  it("throws on a non-2xx response", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(wp.getPages()).rejects.toThrow("GraphQL fetch failed: 500");
  });

  it("throws on GraphQL errors", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({ data: null, errors: [{ message: "Boom" }] }),
    });
    await expect(wp.getPages()).rejects.toThrow("Boom");
  });

  it("safe() turns a failure into an empty list", async () => {
    fetchMock.mockRejectedValueOnce(new Error("offline"));
    await expect(wp.safe(wp.getPages)).resolves.toEqual([]);
  });
});

describe("getters", () => {
  it.each([
    ["getPages", "pages"],
    ["getPosts", "posts"],
    ["getProjects", "projects"],
    ["getServices", "services"],
    ["getTeam", "teams"],
    ["getTestimonials", "testimonials"],
  ] as const)("%s reads the %s connection", async (getter, connection) => {
    const node = { title: "T", content: "<p>Hi</p>" };
    respond(connection, [node]);
    await expect(wp[getter]()).resolves.toEqual([node]);
  });

  it("sanitises content and excerpts", async () => {
    respond("projects", [
      {
        slug: "p",
        title: "P",
        content: "<p>Safe</p><script>alert(1)</script>",
        excerpt: '<img src=x onerror="alert(1)">Caption',
      },
    ]);
    const [project] = await wp.getProjects();
    expect(project.content).toBe("<p>Safe</p>");
    expect(project.excerpt).toBe('<img src="x" />Caption');
  });
});

describe("helpers", () => {
  it("pageSlug strips the slashes from a uri", () => {
    expect(wp.pageSlug({ uri: "/about/" })).toBe("about");
  });

  it("postTags hides the cover marker", () => {
    const post = {
      tags: { nodes: [{ name: "cover" }, { name: "SEO" }] },
    } as import("./types").WPPost;
    expect(wp.postTags(post)).toEqual(["SEO"]);
    expect(wp.isCoverPost(post)).toBe(true);
  });
});

describe("titles", () => {
  it("decodes HTML entities so titles print as plain text", async () => {
    respond("posts", [
      { slug: "p", title: "What&#8217;s new &amp; next", content: "" },
    ]);
    const [post] = await wp.getPosts();
    expect(post.title).toBe("What’s new & next");
  });
});
