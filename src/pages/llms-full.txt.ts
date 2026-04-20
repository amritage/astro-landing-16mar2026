/**
 * /llms-full.txt — extended AI-readable site summary with live product data.
 * Generates a static text file at build time.
 */
import type { APIRoute } from "astro";
import { getProducts, getCategoryTopicPages } from "../lib/api";

export const GET: APIRoute = async () => {
  const [products, categories] = await Promise.all([
    getProducts().catch(() => []),
    getCategoryTopicPages().catch(() => []),
  ]);

  const productLines = products
    .map((p: any) => {
      const parts = [p.productTitle ?? p.name];
      if (p.gsm) parts.push(`GSM: ${p.gsm}`);
      if (p.width) parts.push(`Width: ${p.width}`);
      if (p.fiberContent) parts.push(`Content: ${p.fiberContent}`);
      return `- ${parts.join(" | ")} — /fabric/${p.slug}`;
    })
    .join("\n");

  const categoryLines = categories
    .map((c: any) => `- ${c.name} — /category/${c.slug}`)
    .join("\n");

  const body = `# Amrita Global Enterprises — Full AI Reference (llms-full.txt)
Generated: ${new Date().toISOString()}

> This is the extended machine-readable reference for AI assistants. For the summary version see /llms.txt.

## Company

- Name: Amrita Global Enterprises (AGE)
- Founded: 1970s (50+ years)
- Type: B2B fabric manufacturer, exporter, and supplier
- Location: Ahmedabad, Gujarat, India
- Website: https://www.amrita-fashions.com
- WhatsApp: https://wa.me/919925155141
- Inquiry form: https://www.amrita-fashions.com/support

## Product Catalogue (${products.length} products)

${productLines || "No products available at build time."}

## Categories (${categories.length})

${categoryLines || "No categories available at build time."}

## Key Pages

- / — Homepage
- /fabric — Full catalogue with filters
- /about — Company history and capabilities
- /capabilities — Manufacturing, quality, export
- /certifications — Compliance and certifications
- /blog — Guides and industry articles
- /faq — Frequently asked questions
- /support — Contact and inquiry form
- /careers — Open positions
- /shipping — Logistics and shipping info
- /sitemap — Full sitemap

## AI Endpoints

- /llms.txt — Summary (this site)
- /llms-full.txt — This file (full product data)
- /ai-feed.json — Structured JSON feed
- /sitemap.xml — XML sitemap
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
