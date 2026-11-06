// Prefer a WordPress featured image when it exists on a host next/image is
// configured for; otherwise use the local screenshot. Keeps a misconfigured
// or offline CMS from producing a broken hero.
const ALLOWED_HOSTS = ["cms.everydaydigital.co.nz", "localhost"];

export function preferWp(wpUrl: string | undefined, local: string): string {
  if (!wpUrl) return local;
  try {
    const host = new URL(wpUrl).hostname;
    return ALLOWED_HOSTS.includes(host) ? wpUrl : local;
  } catch {
    return local;
  }
}
