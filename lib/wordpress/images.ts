/**
 * Where WordPress media lives. Shared by next.config.ts (which hosts
 * next/image may optimise), {@link preferCmsImage} and the social route
 * (which only fetches images from our own CMS).
 */
export const CMS_MEDIA_ORIGINS = [
  // Production headless backend on Cloudways
  { protocol: "https", hostname: "cms.everydaydigital.co.nz", port: "" },
  // Local Docker WordPress (docker-compose.yml)
  { protocol: "http", hostname: "localhost", port: "8181" },
] as const;

export const CMS_UPLOADS_PATH = "/wp-content/uploads/**";

/** True when `url` is an absolute URL on one of {@link CMS_MEDIA_ORIGINS}. */
export function isCmsMediaUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const u = new URL(url);
    return CMS_MEDIA_ORIGINS.some(
      (o) =>
        `${o.protocol}:` === u.protocol &&
        o.hostname === u.hostname &&
        o.port === u.port,
    );
  } catch {
    return false;
  }
}

/**
 * Use the WordPress image when next/image is allowed to load it; otherwise the
 * local fallback. Keeps a misconfigured or offline CMS from breaking a hero.
 */
export function preferCmsImage(cmsUrl: string | undefined, fallback: string) {
  return isCmsMediaUrl(cmsUrl) ? cmsUrl : fallback;
}
