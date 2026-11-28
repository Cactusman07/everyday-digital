import { serviceRoute } from "@/lib/detail-routes";
import { SITE } from "@/lib/site";

export { OG_CONTENT_TYPE as contentType } from "@/lib/og";
export { OG_SIZE as size } from "@/lib/seo";
export const alt = SITE.name;

export default serviceRoute.ogImage;
