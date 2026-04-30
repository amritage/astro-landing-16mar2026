import type { APIRoute } from "astro";
import { getAllProducts } from "../lib/api";
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
  const products = await safeFetch(getAllProducts, []);

  const entries: SitemapUrlEntry[] = products
    .filter((product) => product.productslug?.trim())
    .filter((product) => product.productslug.trim().toLowerCase() !== "pending")
    .map((product) => ({
      path: `/fabric/${product.productslug}`,
      lastmod: product.modifiedAt ?? product.streamUpdatedAt ?? today,
      changefreq: "weekly",
      priority: "0.7",
    }));

  return xmlResponse(buildUrlsetXml(entries, today));
};
