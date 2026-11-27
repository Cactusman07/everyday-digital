import { ogImage, OG_SIZE } from "@/lib/og";
import { getServices, safe } from "@/lib/wordpress";
import { decodeEntities } from "@/lib/content";
import { getServiceMeta } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Every Day Digital";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const items = await safe(getServices);
  const item = items.find((i) => i.slug === slug);
  return ogImage({
    title: decodeEntities(item?.title ?? "Every Day Digital"),
    kicker: "Service · Every Day Digital",
    colour: getServiceMeta(slug)?.colour,
  });
}
