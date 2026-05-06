import type { APIRoute } from "astro";
import { getSiteOrigin } from "../lib/site-url";

const siteOrigin = getSiteOrigin();

const body = `# Amrita Global Enterprises Full AI Context

Amrita Global Enterprises is a B2B fabric supplier and manufacturer website focused on product discovery, technical fabric specifications, and lead generation.

## Primary Buyer Actions

- Send fabric inquiry
- Request fabric samples
- Ask AI fabric assistant for fabric discovery, MOQ questions, and quote preparation
- Contact by WhatsApp
- Contact by phone

## Buyer Audience

Garment manufacturers, apparel brands, textile traders, wholesalers, exporters, and bulk fabric buyers use this website to review fabric specifications before contacting the sales team.

## Important Data Sources

The website uses backend CMS/API data for product, product-location, collection, location, company, SEO, and site tracking settings. Environment variables are fallback values for deployment configuration when CMS fields are missing.

## Key URLs

- Website: ${siteOrigin}
- Fabric catalogue: ${siteOrigin}/fabric
- Fabric manufacturer pages: ${siteOrigin}/fabric-manufacturer
- Support and inquiry: ${siteOrigin}/support
- Sitemap: ${siteOrigin}/sitemap.xml
- Robots: ${siteOrigin}/robots.txt
`;

export const GET: APIRoute = () =>
  new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
