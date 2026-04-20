/**
 * /ai-feed.json — machine-readable product + page feed for AI crawlers.
 * Generates a static JSON file at build time from the API.
 */
import type { APIRoute } from "astro";
import { getProducts, getCategoryTopicPages, getDynamicTopicPages } from "../lib/api";

export const GET: APIRoute = async () => {
  const [products, categories, collections] = await Promise.all([
    getProducts().catch(() => []),
    getCategoryTopicPages().catch(() => []),
    getDynamicTopicPages().catch(() => []),
  ]);

  const feed = {
    site: "https://www.amrita-fashions.com",
    name: "Amrita Global Enterprises",
    description: "B2B fabric manufacturer and exporter — cotton, denim, knit, and woven fabrics.",
    generated: new Date().toISOString(),
    products: products.map((p: any) => ({
      name: p.productTitle ?? p.name,
      slug: p.slug,
      url: `https://www.amrita-fashions.com/fabric/${p.slug}`,
      category: p.category ?? null,
      gsm: p.gsm ?? null,
      width: p.width ?? null,
      content: p.fiberContent ?? null,
    })),
    categories: categories.map((c: any) => ({
      name: c.name,
      slug: c.slug,
      url: `https://www.amrita-fashions.com/category/${c.slug}`,
    })),
    collections: collections.map((c: any) => ({
      name: c.name,
      slug: c.slug,
      url: `https://www.amrita-fashions.com/collection/${c.slug}`,
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
