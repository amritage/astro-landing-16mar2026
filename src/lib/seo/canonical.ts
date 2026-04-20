/**
 * Normalizes a canonical URL to always use https://.
 * Strips any existing http:// or https:// prefix, then re-adds https://.
 * Removes any trailing slash.
 * Returns undefined if no URL is provided.
 */
export function resolveCanonical(url?: string | null): string | undefined {
  if (!url) return undefined;
  const normalized = `https://${url.replace(/^https?:\/\//, "")}`;
  return normalized.replace(/\/$/, "");
}
