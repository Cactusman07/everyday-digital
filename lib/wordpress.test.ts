import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";

const MOCK_GRAPHQL_URL = "http://localhost:8181/graphql";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

let getPages: typeof import("./wordpress").getPages;
let getProjects: typeof import("./wordpress").getProjects;
let getServices: typeof import("./wordpress").getServices;
let getPosts: typeof import("./wordpress").getPosts;
let getTeams: typeof import("./wordpress").getTeams;
let getTestimonials: typeof import("./wordpress").getTestimonials;
let getPageBySlug: typeof import("./wordpress").getPageBySlug;
let getPostBySlug: typeof import("./wordpress").getPostBySlug;

beforeAll(async () => {
  process.env.WORDPRESS_GRAPHQL_URL = MOCK_GRAPHQL_URL;
  const wp = await import("./wordpress");
  getPages = wp.getPages;
  getProjects = wp.getProjects;
  getServices = wp.getServices;
  getPosts = wp.getPosts;
  getTeams = wp.getTeams;
  getTestimonials = wp.getTestimonials;
  getPageBySlug = wp.getPageBySlug;
  getPostBySlug = wp.getPostBySlug;
});

beforeEach(() => {
  fetchMock.mockReset();
});

function mockGraphQLResponse(data: unknown) {
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ data }),
  });
}

describe("fetchGraphQL", () => {
  it("sends POST request with correct headers and body", async () => {
    mockGraphQLResponse({ pages: { nodes: [] } });
    await getPages();

    expect(fetchMock).toHaveBeenCalledWith(
      MOCK_GRAPHQL_URL,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("throws on non-ok response", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(getPages()).rejects.toThrow("GraphQL fetch failed: 500");
  });

  it("filters out seo-related GraphQL errors", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: { pages: { nodes: [] } },
          errors: [{ message: 'Cannot query field "seo" on type "Page"' }],
        }),
    });

    const result = await getPages();
    expect(result).toEqual([]);
  });

  it("throws on non-seo GraphQL errors", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: null,
          errors: [{ message: "Internal server error" }],
        }),
    });

    await expect(getPages()).rejects.toThrow("Internal server error");
  });
});

describe("getPages", () => {
  it("returns page nodes from response", async () => {
    const mockPages = [
      { title: "Home", uri: "/", isFrontPage: true },
      { title: "About", uri: "/about/" },
    ];
    mockGraphQLResponse({ pages: { nodes: mockPages } });

    const result = await getPages();
    expect(result).toEqual(mockPages);
  });
});

describe("getProjects", () => {
  it("returns project nodes from response", async () => {
    const mockProjects = [{ title: "Project 1", slug: "project-1" }];
    mockGraphQLResponse({ projects: { nodes: mockProjects } });

    const result = await getProjects();
    expect(result).toEqual(mockProjects);
  });
});

describe("getServices", () => {
  it("returns service nodes from response", async () => {
    const mockServices = [{ title: "Web Design", slug: "web-design" }];
    mockGraphQLResponse({ services: { nodes: mockServices } });

    const result = await getServices();
    expect(result).toEqual(mockServices);
  });
});

describe("getPosts", () => {
  it("returns post nodes from response", async () => {
    const mockPosts = [{ title: "Blog Post", slug: "blog-post" }];
    mockGraphQLResponse({ posts: { nodes: mockPosts } });

    const result = await getPosts();
    expect(result).toEqual(mockPosts);
  });
});

describe("getTeams", () => {
  it("returns team nodes from response", async () => {
    const mockTeams = [{ title: "Sam Muir" }];
    mockGraphQLResponse({ teams: { nodes: mockTeams } });

    const result = await getTeams();
    expect(result).toEqual(mockTeams);
  });
});

describe("getTestimonials", () => {
  it("returns testimonial nodes from response", async () => {
    const mockTestimonials = [{ title: "Great service", content: "<p>Loved it</p>" }];
    mockGraphQLResponse({ testimonials: { nodes: mockTestimonials } });

    const result = await getTestimonials();
    expect(result).toEqual(mockTestimonials);
  });
});

describe("getPageBySlug", () => {
  it("finds page by slug with trailing slash", async () => {
    const mockPages = [
      { title: "Home", uri: "/" },
      { title: "About", uri: "/about/" },
    ];
    mockGraphQLResponse({ pages: { nodes: mockPages } });

    const result = await getPageBySlug("about");
    expect(result).toEqual({ title: "About", uri: "/about/" });
  });

  it("finds page by slug without trailing slash", async () => {
    const mockPages = [{ title: "Contact", uri: "/contact" }];
    mockGraphQLResponse({ pages: { nodes: mockPages } });

    const result = await getPageBySlug("contact");
    expect(result).toEqual({ title: "Contact", uri: "/contact" });
  });

  it("returns undefined for missing slug", async () => {
    mockGraphQLResponse({ pages: { nodes: [] } });

    const result = await getPageBySlug("nonexistent");
    expect(result).toBeUndefined();
  });
});

describe("getPostBySlug", () => {
  it("finds post by slug", async () => {
    const mockPosts = [
      { title: "First Post", slug: "first-post" },
      { title: "Second Post", slug: "second-post" },
    ];
    mockGraphQLResponse({ posts: { nodes: mockPosts } });

    const result = await getPostBySlug("second-post");
    expect(result).toEqual({ title: "Second Post", slug: "second-post" });
  });

  it("returns undefined for missing slug", async () => {
    mockGraphQLResponse({ posts: { nodes: [] } });

    const result = await getPostBySlug("nonexistent");
    expect(result).toBeUndefined();
  });
});
