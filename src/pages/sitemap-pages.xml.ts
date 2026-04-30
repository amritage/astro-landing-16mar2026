import type { APIRoute } from "astro";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { getAllTopicPages } from "../lib/api";
import { buildUrlsetXml, getSitemapBuildDate, type SitemapUrlEntry, xmlResponse } from "../lib/seo/sitemap";

const EXCLUDE = new Set([
  "404",
  "thank-you",
  "ai-feed.json",
  "llms-full.txt",
  "search",
]);

const PAGE_META: Record<string, { priority: string; changefreq: string }> = {
  "/": { priority: "1.0", changefreq: "daily" },
  "/fabric": { priority: "0.9", changefreq: "daily" },
  "/blog": { priority: "0.9", changefreq: "daily" },
  "/about": { priority: "0.8", changefreq: "monthly" },
  "/capabilities": { priority: "0.8", changefreq: "monthly" },
  "/certifications": { priority: "0.8", changefreq: "monthly" },
  "/support": { priority: "0.8", changefreq: "monthly" },
  "/careers": { priority: "0.7", changefreq: "monthly" },
  "/faq": { priority: "0.7", changefreq: "monthly" },
  "/shipping": { priority: "0.7", changefreq: "monthly" },
  "/ahmedabad-hub": { priority: "0.7", changefreq: "monthly" },
  "/fabric-manufacturer": { priority: "0.8", changefreq: "weekly" },
  "/terms-and-conditions": { priority: "0.3", changefreq: "yearly" },
  "/sitemap": { priority: "0.3", changefreq: "monthly" },
};

interface StaticPageRoute {
  path: string;
  sourcePath: string;
}

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

function getStaticPageRoutes(): StaticPageRoute[] {
  const modules = import.meta.glob("/src/pages/**/*.astro", { eager: false });
  const routes: StaticPageRoute[] = [];

  for (const filePath of Object.keys(modules)) {
    if (filePath.includes("[")) continue;
    if (filePath.includes("/pages/api/")) continue;

    const route = filePath
      .replace("/src/pages", "")
      .replace(/\.astro$/, "")
      .replace(/\/index$/, "") || "/";

    const name = route.replace(/^\//, "");
    if (EXCLUDE.has(name)) continue;

    routes.push({ path: route, sourcePath: filePath });
  }

  return routes.sort((a, b) => {
    if (a.path === "/") return -1;
    if (b.path === "/") return 1;
    return a.path.localeCompare(b.path);
  });
}

async function getStaticPageEntries(today: string): Promise<SitemapUrlEntry[]> {
  const routes = getStaticPageRoutes();

  return Promise.all(
    routes.map(async ({ path, sourcePath }) => {
      let lastmod: string | Date = today;

      try {
        const stats = await stat(resolve(process.cwd(), `.${sourcePath}`));
        lastmod = stats.mtime;
      } catch {
        lastmod = today;
      }

      return {
        path,
        lastmod,
        changefreq: PAGE_META[path]?.changefreq ?? "weekly",
        priority: PAGE_META[path]?.priority ?? "0.7",
      };
    })
  );
}

export const GET: APIRoute = async () => {
  const today = getSitemapBuildDate();
  const [staticEntries, topicPages] = await Promise.all([
    getStaticPageEntries(today),
    safeFetch(getAllTopicPages, []),
  ]);

  const categoryPages = topicPages.filter((page) => page.pageType === "Category" && !page.deleted);
  const collections = topicPages.filter((page) => page.pageType === "Dynamic" && !page.deleted);

  const entries: SitemapUrlEntry[] = [
    ...staticEntries,
    ...categoryPages
      .filter((page) => page.slug?.trim())
      .map((page) => ({
        path: `/category/${page.slug}`,
        lastmod: page.modifiedAt ?? page.streamUpdatedAt ?? today,
        changefreq: "weekly",
        priority: "0.8",
      })),
    ...collections
      .filter((page) => page.slug?.trim())
      .map((page) => ({
        path: `/collection/${page.slug}`,
        lastmod: page.modifiedAt ?? page.streamUpdatedAt ?? today,
        changefreq: "weekly",
        priority: "0.8",
      })),
  ];

  return xmlResponse(buildUrlsetXml(entries, today));
};
