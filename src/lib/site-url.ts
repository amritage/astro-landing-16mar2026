const DEFAULT_SITE_ORIGIN = "http://localhost:4321";

function normalizeRawSiteValue(value?: string | URL | null): string | undefined {
  if (!value) return undefined;

  const rawValue = value instanceof URL ? value.toString() : value;
  const trimmed = rawValue.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return undefined;

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function normalizeSiteOrigin(value?: string | URL | null): string | undefined {
  const normalized = normalizeRawSiteValue(value);
  if (!normalized) return undefined;

  try {
    return new URL(normalized).origin;
  } catch {
    return undefined;
  }
}

export function getSiteOrigin(value?: string | URL | null): string {
  return normalizeSiteOrigin(value ?? import.meta.env.PUBLIC_SITE_URL) ?? DEFAULT_SITE_ORIGIN;
}

export function toAbsoluteSiteUrl(path: string, siteOrigin = getSiteOrigin()): string {
  const normalizedInput = path.trim() || "/";
  const siteUrl = new URL(siteOrigin);
  const resolvedUrl = /^https?:\/\//i.test(normalizedInput)
    ? new URL(normalizedInput)
    : new URL(normalizedInput.startsWith("/") ? normalizedInput : `/${normalizedInput}`, `${siteOrigin}/`);

  resolvedUrl.protocol = siteUrl.protocol;
  resolvedUrl.host = siteUrl.host;
  resolvedUrl.pathname = resolvedUrl.pathname === "/"
    ? "/"
    : resolvedUrl.pathname.replace(/\/{2,}/g, "/").replace(/\/+$/, "");
  resolvedUrl.hash = "";

  return resolvedUrl.toString();
}
