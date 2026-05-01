import { toAbsoluteSiteUrl } from "../site-url";

/**
 * Resolves canonicals against the current site origin so stale CMS domains
 * do not leak into the built pages.
 */
export function resolveCanonical(url?: string | null): string | undefined {
  if (!url?.trim()) return undefined;
  return toAbsoluteSiteUrl(url);
}
