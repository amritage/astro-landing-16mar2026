import type { APIRoute } from "astro";
import { fetchBlogPosts } from "../lib/blog";
import { getDynamicTopicPages, getCategoryTopicPages, getAllProductLocations } from "../lib/api";
import { fetchProducts } from "../data/products";

const SITE = import.meta.env.PUBLIC_SITE_URL ?? "https://www.amrita-fashions.com";

// Pages to exclude from auto-discovery
const EXCLUDE = new Set([
  "404",
  "sitemap.xml",
  "thank-you",
  "ai-feed.json",
  "llms-full.txt",
  "search",
]);

// Priority/changefreq overrides for known static pages
const PAGE_META: Record<string, { priority: string; changefreq: string }> = {
  "/":                      { priority: "1.0", changefreq: "daily" },
  "/fabric":                { priority: "0.9", changefreq: "daily" },
  "/blog":                  { priority: "0.9", changefreq: "daily" },
  "/about":                 { priority: "0.8", changefreq: "monthly" },
  "/capabilities":          { priority: "0.8", changefreq: "monthly" },
  "/certifications":        { priority: "0.8", changefreq: "monthly" },
  "/support":               { priority: "0.8", changefreq: "monthly" },
  "/careers":               { priority: "0.7", changefreq: "monthly" },
  "/faq":                   { priority: "0.7", changefreq: "monthly" },
  "/shipping":              { priority: "0.7", changefreq: "monthly" },
  "/ahmedabad-hub":         { priority: "0.7", changefreq: "monthly" },
  "/product-location":      { priority: "0.8", changefreq: "weekly" },
  "/terms-and-conditions":  { priority: "0.3", changefreq: "yearly" },
  "/sitemap":               { priority: "0.3", changefreq: "monthly" },
};

function url(path: string, lastmod: string, priority = "0.7", changefreq = "weekly") {
  const meta = PAGE_META[path];
  return `  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${meta?.changefreq ?? changefreq}</changefreq>
    <priority>${meta?.priority ?? priority}</priority>
  </url>`;
}

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn(); } catch { return fallback; }
}

/**
 * Auto-discover static pages from src/pages/ using import.meta.glob.
 * Skips: dynamic routes ([param]), API routes (src/pages/api/),
 * non-page files (.ts/.json/.txt), and excluded page names.
 */
function getStaticPagePaths(): string[] {
  // Glob all .astro files under src/pages (Vite resolves at build time)
  const modules = import.meta.glob("/src/pages/**/*.astro", { eager: false });

  const paths: string[] = [];

  for (const filePath of Object.keys(modules)) {
    // Skip dynamic route segments
    if (filePath.includes("[")) continue;

    // Skip API folder
    if (filePath.includes("/pages/api/")) continue;

    // Convert file path → URL path
    // e.g. /src/pages/about.astro → /about
    //      /src/pages/blog/index.astro → /blog
    //      /src/pages/index.astro → /
    let route = filePath
      .replace("/src/pages", "")
      .replace(/\.astro$/, "")
      .replace(/\/index$/, "") || "/";

    // Skip excluded pages
    const name = route.replace(/^\//, "");
    if (EXCLUDE.has(name)) continue;

    paths.push(route);
  }

  // Sort: root first, then alphabetically
  return paths.sort((a, b) => {
    if (a === "/") return -1;
    if (b === "/") return 1;
    return a.localeCompare(b);
  });
}

export const GET: APIRoute = async () => {
  const today = new Date().toISOString().split("T")[0];

  const [blogPosts, collections, categoryPages, products, productLocations] = await Promise.all([
    safeFetch(fetchBlogPosts, []),
    safeFetch(getDynamicTopicPages, []),
    safeFetch(getCategoryTopicPages, []),
    safeFetch(fetchProducts, []),
    safeFetch(getAllProductLocations, []),
  ]);

  const staticPages = getStaticPagePaths();

  const lines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ``,
    `  <!-- Static Pages (auto-discovered) -->`,
    ...staticPages.map((p) => url(p, today)),
    ``,
    `  <!-- Categories (API-driven) -->`,
    ...categoryPages.map((c) => url(`/category/${c.slug}`, today, "0.8", "weekly")),
    ``,
    `  <!-- Collections (API-driven) -->`,
    ...collections.map((c) => url(`/collection/${c.slug}`, today, "0.8", "weekly")),
    ``,
    `  <!-- Products (API-driven) -->`,
    ...products.map((p) => url(`/fabric/${p.slug}`, today, "0.7", "weekly")),
    ``,
    `  <!-- Product + Location Pages (API-driven) -->`,
    ...productLocations
      .filter((pl) => pl.name?.toLowerCase() !== "test")
      .map((pl) => url(`/product-location/${pl.slug}`, today, "0.8", "weekly")),

    `  <!-- Blog Posts (API-driven) -->`,
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
