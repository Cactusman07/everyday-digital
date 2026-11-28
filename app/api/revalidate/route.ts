// On-demand revalidation. WordPress calls this when content is published,
// updated or deleted (wpTheme/mu-plugins/edd-revalidate.php) and Next.js
// purges the matching cache tags, so the change is live on the next request.
//
// Security: `Authorization: Bearer <REVALIDATE_SECRET>`, compared in constant
// time. Set the same value in WordPress as EDD_REVALIDATE_SECRET.
// See docs/DEPLOY-AND-REVALIDATE.md.

import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { hasBearerSecret } from "@/lib/auth";
import { INDEXNOW_KEY, SITE, absoluteUrl } from "@/lib/site";
import {
  ALL_CACHE_TAGS,
  CONTENT_TYPES,
  isRoutedType,
  itemPath,
  toContentType,
  type CacheTag,
  type ContentType,
} from "@/lib/wordpress/content-types";

export const runtime = "nodejs";

/** What WordPress sends. An empty body purges everything. */
interface RevalidateBody {
  /** Canonical content type, e.g. "post" (see CONTENT_TYPES). */
  type?: string;
  /** The item's slug, for a path-level purge of its own page. */
  slug?: string;
  /** A page's uri, e.g. "/about/". */
  uri?: string;
  /** Purge every tag (the "Refresh live site" admin-bar button). */
  all?: boolean;
}

/** The paths whose rendered HTML changes along with this item. */
function pathsFor(type: ContentType | undefined, body: RevalidateBody) {
  const paths = new Set<string>(["/", "/sitemap.xml"]);
  if (body.uri) paths.add(body.uri.replace(/\/$/, "") || "/");
  if (body.slug && type && isRoutedType(type))
    paths.add(itemPath(type, body.slug));
  return paths;
}

/**
 * Tells IndexNow search engines (Bing and friends) about changed pages.
 * Production only, so preview deployments never submit URLs.
 *
 * @returns The IndexNow HTTP status, "skipped", or an error message.
 */
async function submitToIndexNow(paths: Set<string>): Promise<number | string> {
  if (process.env.VERCEL_ENV !== "production") return "skipped";
  const urlList = [...paths]
    .filter((p) => p !== "/sitemap.xml")
    .map((p) => absoluteUrl(p));
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: SITE.domain,
        key: INDEXNOW_KEY,
        keyLocation: absoluteUrl(`/${INDEXNOW_KEY}.txt`),
        urlList,
      }),
      signal: AbortSignal.timeout(5000),
    });
    return res.status;
  } catch (e) {
    return e instanceof Error ? e.message : "failed";
  }
}

export async function POST(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_SECRET is not configured" },
      { status: 500 },
    );
  }
  if (!hasBearerSecret(req, expected)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  let body: RevalidateBody = {};
  try {
    body = (await req.json()) as RevalidateBody;
  } catch {
    // An empty body is fine: it means "revalidate everything"
  }

  const type = body.all ? undefined : toContentType(body.type);
  // Unknown or missing type: purge everything rather than miss something
  const tags: CacheTag[] = type ? [CONTENT_TYPES[type].tag] : ALL_CACHE_TAGS;
  for (const tag of tags) revalidateTag(tag, "max");

  // Tag purges already cover these paths, but revalidating them too makes the
  // change visible on the very next request rather than the one after.
  const paths = pathsFor(type, body);
  for (const p of paths) revalidatePath(p);

  const indexnow = type ? await submitToIndexNow(paths) : "skipped";

  return NextResponse.json({
    ok: true,
    revalidated: tags,
    paths: [...paths],
    indexnow,
    at: new Date().toISOString(),
  });
}
