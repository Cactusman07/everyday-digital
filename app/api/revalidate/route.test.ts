import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidateTag = vi.fn();
const revalidatePath = vi.fn();
vi.mock("next/cache", () => ({ revalidateTag, revalidatePath }));

const { POST } = await import("./route");

const SECRET = "test-secret";

function req(body: unknown, secret?: string) {
  return new Request("http://localhost/api/revalidate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(secret ? { authorization: `Bearer ${secret}` } : {}),
    },
    body: JSON.stringify(body),
  }) as unknown as import("next/server").NextRequest;
}

const purgedTags = () => revalidateTag.mock.calls.map(([tag]) => tag);
const purgedPaths = () => revalidatePath.mock.calls.map(([path]) => path);

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    revalidateTag.mockReset();
    revalidatePath.mockReset();
    process.env.REVALIDATE_SECRET = SECRET;
  });

  it("returns 500 when the secret is not configured", async () => {
    delete process.env.REVALIDATE_SECRET;
    expect((await POST(req({}, "anything"))).status).toBe(500);
  });

  it.each([undefined, "nope"])("rejects secret %s", async (secret) => {
    const res = await POST(req({ type: "post", slug: "hello" }, secret));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("purges only the matching tag and the item's page", async () => {
    const res = await POST(
      req({ type: "project", slug: "nz-in-pictures" }, SECRET),
    );
    expect(res.status).toBe(200);
    expect(purgedTags()).toEqual(["wp:projects"]);
    expect(purgedPaths()).toEqual(
      expect.arrayContaining(["/", "/projects/nz-in-pictures"]),
    );
  });

  it("accepts WordPress's plural post type keys", async () => {
    await POST(req({ type: "Services", slug: "hosting" }, SECRET));
    expect(purgedTags()).toEqual(["wp:services"]);
    expect(purgedPaths()).toContain("/services/hosting");
  });

  it("purges a page by its uri", async () => {
    await POST(req({ type: "page", slug: "about", uri: "/about/" }, SECRET));
    expect(purgedTags()).toEqual(["wp:pages"]);
    expect(purgedPaths()).toContain("/about");
  });

  it.each([{ all: true }, { type: "attachment" }, {}])(
    "purges everything for %j",
    async (body) => {
      await POST(req(body, SECRET));
      expect(revalidateTag).toHaveBeenCalledTimes(6);
    },
  );
});
