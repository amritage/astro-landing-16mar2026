import type { APIRoute } from "astro";
import { getAllProductLocations } from "../lib/api";
import { buildUrlsetXml, getSitemapBuildDate, type SitemapUrlEntry, xmlResponse } from "../lib/seo/sitemap";

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export const GET: APIRoute = async () => {
  const today = getSitemapBuildDate();
  const productLocations = await safeFetch(getAllProductLocations, []);

  const entries: SitemapUrlEntry[] = productLocations
    .filter((item) => item.slug?.trim())
    .filter((item) => item.name?.toLowerCase() !== "test")
    .map((item) => ({
      path: `/fabric-manufacturer/${item.slug}`,
      lastmod: item.modifiedAt ?? item.streamUpdatedAt ?? item.product?.modifiedAt ?? item.product?.streamUpdatedAt ?? today,
      changefreq: "weekly",
      priority: "0.8",
    }));

  return xmlResponse(buildUrlsetXml(entries, today));
};
