import { toAbsoluteSiteUrl } from "../site-url";

export interface SitemapUrlEntry {
  path: string;
  lastmod?: string | Date | null;
  changefreq?: string;
  priority?: string;
}

export interface SitemapIndexEntry {
  path: string;
  lastmod?: string | Date | null;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toAbsoluteUrl(path: string): string {
  return toAbsoluteSiteUrl(path);
}

function normalizeLastmod(value: string | Date | null | undefined, fallback: string): string {
  if (!value) return fallback;
  if (value instanceof Date) return value.toISOString().slice(0, 10);

  const trimmed = value.trim();
  if (!trimmed) return fallback;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString().slice(0, 10);
}

function dedupeByAbsoluteUrl<T extends { path: string }>(entries: T[]): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const entry of entries) {
    const absoluteUrl = toAbsoluteUrl(entry.path);
    if (seen.has(absoluteUrl)) continue;
    seen.add(absoluteUrl);
    unique.push(entry);
  }

  return unique;
}

export function getSitemapBuildDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function buildUrlsetXml(entries: SitemapUrlEntry[], fallbackLastmod = getSitemapBuildDate()): string {
  const uniqueEntries = dedupeByAbsoluteUrl(
    entries.filter((entry) => entry.path?.trim())
  );

  const lines = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...uniqueEntries.map((entry) => {
      const parts = [
        `  <url>`,
        `    <loc>${escapeXml(toAbsoluteUrl(entry.path))}</loc>`,
        `    <lastmod>${normalizeLastmod(entry.lastmod, fallbackLastmod)}</lastmod>`,
      ];

      if (entry.changefreq) parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      if (entry.priority) parts.push(`    <priority>${entry.priority}</priority>`);

      parts.push(`  </url>`);
      return parts.join("\n");
    }),
    `</urlset>`,
  ];

  return lines.join("\n");
}

export function buildSitemapIndexXml(entries: SitemapIndexEntry[], fallbackLastmod = getSitemapBuildDate()): string {
  const uniqueEntries = dedupeByAbsoluteUrl(
    entries.filter((entry) => entry.path?.trim())
  );

  const lines = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...uniqueEntries.map((entry) => [
      `  <sitemap>`,
      `    <loc>${escapeXml(toAbsoluteUrl(entry.path))}</loc>`,
      `    <lastmod>${normalizeLastmod(entry.lastmod, fallbackLastmod)}</lastmod>`,
      `  </sitemap>`,
    ].join("\n")),
    `</sitemapindex>`,
  ];

  return lines.join("\n");
}

export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
