/**
 * Normalizes a canonical URL to always use https:// and ensures a trailing slash.
 * Strips any existing http:// or https:// prefix, then re-adds https://.
 * Returns undefined if no URL is provided.
 */
export function resolveCanonical(url?: string | null): string | undefined {
  if (!url) return undefined;
  const normalized = `https://${url.replace(/^https?:\/\//, "")}`;
  return normalized.endsWith("/") ? normalized : `${normalized}/`;
}
