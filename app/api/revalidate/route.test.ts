import { describe, it, expect, vi, beforeEach } from "vitest";

const revalidateTag = vi.fn();
const revalidatePath = vi.fn();
vi.mock("next/cache", () => ({ revalidateTag, revalidatePath }));

const { POST } = await import("./route");

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

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    revalidateTag.mockReset();
    revalidatePath.mockReset();
    process.env.REVALIDATE_SECRET = "test-secret";
  });

  it("rejects a missing secret", async () => {
    const res = await POST(req({ type: "post", slug: "hello" }));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a wrong secret", async () => {
    const res = await POST(req({ type: "post" }, "nope"));
    expect(res.status).toBe(401);
  });

  it("purges only the matching tag for a known post type", async () => {
    const res = await POST(
      req({ type: "project", slug: "nz-in-pictures" }, "test-secret"),
    );
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledTimes(1);
    expect(revalidateTag).toHaveBeenCalledWith("wp:projects", "max");
    expect(revalidatePath).toHaveBeenCalledWith("/projects/nz-in-pictures");
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("purges everything when all=true or type is unknown", async () => {
    await POST(req({ all: true }, "test-secret"));
    expect(revalidateTag).toHaveBeenCalledTimes(6);
  });

  it("returns 500 when the secret is not configured", async () => {
    delete process.env.REVALIDATE_SECRET;
    const res = await POST(req({}, "anything"));
    expect(res.status).toBe(500);
  });
});
