import type { APIRoute } from "astro";
import { fetchBlogPosts } from "../lib/blog";
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
  const posts = await safeFetch(fetchBlogPosts, []);

  const entries: SitemapUrlEntry[] = posts
    .filter((post) => post.slug?.trim())
    .filter((post) => !(post.robots ?? "").toLowerCase().includes("noindex"))
    .map((post) => ({
      path: `/blog/${post.slug}`,
      lastmod: post.modifiedAt ?? post.publishedAt ?? today,
      changefreq: "weekly",
      priority: "0.7",
    }));

  return xmlResponse(buildUrlsetXml(entries, today));
};
