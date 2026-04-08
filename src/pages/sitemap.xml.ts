import type { APIRoute } from "astro";
import { industries } from "../data/industries";
import { fetchBlogPosts } from "../lib/blog";
import { getDynamicTopicPages, getCategoryTopicPages } from "../lib/api";
import { fetchProducts } from "../data/products";

const SITE = import.meta.env.PUBLIC_SITE_URL ?? "https://astro-geo-project.vercel.app/";

function url(path: string, lastmod?: string, priority = "0.7", changefreq = "weekly") {
  return `  <url>
    <loc>${SITE}${path}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export const GET: APIRoute = async () => {
  const today = new Date().toISOString().split("T")[0];

  const [blogPosts, collections, categoryPages, products] = await Promise.all([
    safeFetch(fetchBlogPosts, []),
    safeFetch(getDynamicTopicPages, []),
    safeFetch(getCategoryTopicPages, []),
    safeFetch(fetchProducts, []),
  ]);

  const lines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ``,
    `  <!-- Core Pages -->`,
    url("/", today, "1.0", "daily"),
    url("/about", today, "0.8", "monthly"),
    url("/capabilities", today, "0.8", "monthly"),
    url("/certifications", today, "0.8", "monthly"),
    url("/careers", today, "0.7", "monthly"),
    url("/support", today, "0.8", "monthly"),
    url("/faq", today, "0.7", "monthly"),
    url("/shipping", today, "0.7", "monthly"),
    url("/ahmedabad-hub", today, "0.7", "monthly"),
    url("/terms-and-conditions", today, "0.3", "yearly"),
    url("/sitemap", today, "0.3", "monthly"),
    ``,
    `  <!-- Fabric Catalog -->`,
    url("/fabric", today, "0.9", "daily"),
    ``,
    `  <!-- Categories (API-driven) -->`,
    ...categoryPages.map((c) => url(`/category/${c.slug}`, today, "0.8", "weekly")),
    ``,
    `  <!-- Collections (API-driven) -->`,
    ...collections.map((c) => url(`/collection/${c.slug}`, today, "0.8", "weekly")),
    ``,
    `  <!-- All Products -->`,
    ...products.map((p) => url(`/fabric/${p.slug}`, today, "0.7", "weekly")),
    ``,
    `  <!-- Industries -->`,
    url("/industry", today, "0.8", "monthly"),
    ...industries.map((i) => url(`/industry/${i.slug}`, today, "0.8", "monthly")),
    ``,
    `  <!-- Blog -->`,
    url("/blog", today, "0.9", "daily"),
    ...blogPosts.map((p) =>
      url(`/blog/${p.slug}`, p.publishedAt ? p.publishedAt.split("T")[0] : today, "0.7", "weekly")
    ),
    ``,
    `</urlset>`,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
