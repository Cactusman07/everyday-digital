// On-demand revalidation endpoint. WordPress calls this when content is
// published, updated or deleted (see wpTheme/mu-plugins/edd-revalidate.php),
// and Next.js purges the matching cache tags so the change is live on the
// next request — no waiting on the ISR timer, no redeploy.
//
// Security: a shared secret in the Authorization header, compared in constant
// time. Set REVALIDATE_SECRET in Vercel (Production + Preview) and the same
// value in WordPress as EDD_REVALIDATE_SECRET.

import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { WP_TAGS, type WPTag } from "@/lib/wordpress";

export const runtime = "nodejs";

// WordPress post_type → cache tag(s) to purge. "page" also purges nav (pages
// drive the menu) — covered by the same tag.
const TYPE_TO_TAGS: Record<string, WPTag[]> = {
  post: [WP_TAGS.posts],
  page: [WP_TAGS.pages],
  project: [WP_TAGS.projects],
  projects: [WP_TAGS.projects],
  service: [WP_TAGS.services],
  services: [WP_TAGS.services],
  team: [WP_TAGS.teams],
  teams: [WP_TAGS.teams],
  testimonial: [WP_TAGS.testimonials],
  testimonials: [WP_TAGS.testimonials],
};

const ALL_TAGS = Object.values(WP_TAGS);

function secretsMatch(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

interface RevalidateBody {
  type?: string; // WordPress post_type
  slug?: string; // optional, used for path revalidation
  uri?: string; // optional, WordPress page uri like "/about/"
  all?: boolean; // purge everything
}

export async function POST(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_SECRET is not configured" },
      { status: 500 },
    );
  }

  const auth = req.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  const headerSecret = req.headers.get("x-revalidate-secret");
  if (!secretsMatch(bearer ?? headerSecret, expected)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  let body: RevalidateBody = {};
  try {
    body = (await req.json()) as RevalidateBody;
  } catch {
    // empty body is fine — treated as "revalidate everything"
  }

  const revalidated: string[] = [];

  if (body.all || !body.type) {
    for (const tag of ALL_TAGS) {
      revalidateTag(tag, "max");
      revalidated.push(tag);
    }
  } else {
    const tags = TYPE_TO_TAGS[body.type.toLowerCase()] ?? ALL_TAGS;
    for (const tag of tags) {
      revalidateTag(tag, "max");
      revalidated.push(tag);
    }
  }

  // Path-level purges for the obvious pages. Tag purges already cover these,
  // but revalidating the path too makes the change visible on the very next
  // request rather than the one after.
  const paths = new Set<string>(["/", "/sitemap.xml"]);
  if (body.uri) paths.add(body.uri.replace(/\/$/, "") || "/");
  if (body.slug && body.type) {
    const t = body.type.toLowerCase();
    if (t === "post") paths.add(`/blog/${body.slug}`);
    if (t === "project" || t === "projects")
      paths.add(`/projects/${body.slug}`);
    if (t === "service" || t === "services")
      paths.add(`/services/${body.slug}`);
  }
  for (const p of paths) revalidatePath(p);

  return NextResponse.json({
    ok: true,
    revalidated,
    paths: [...paths],
    at: new Date().toISOString(),
  });
}

// Convenience for a quick browser check that the route is deployed. Does not
// reveal whether the secret is set.
export async function GET() {
  return NextResponse.json({
    ok: true,
    usage: "POST with Authorization: Bearer <secret>",
  });
}
