import type { APIRoute } from "astro";
import { buildSitemapIndexXml, getSitemapBuildDate, xmlResponse } from "../lib/seo/sitemap";

export const GET: APIRoute = async () => {
  const today = getSitemapBuildDate();

  return xmlResponse(
    buildSitemapIndexXml([
      { path: "/sitemap-pages.xml", lastmod: today },
      { path: "/sitemap-products.xml", lastmod: today },
      { path: "/sitemap-blog.xml", lastmod: today },
      { path: "/sitemap-fabric-manufacturer.xml", lastmod: today },
    ], today)
  );
};
