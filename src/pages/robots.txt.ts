import { getSiteOrigin } from "../lib/site-url";

const body = `# robots.txt — Amrita Global Enterprises
# ${getSiteOrigin()}

# ── All crawlers ───────────────────────────────────────────────────────────────
User-agent: *
Allow: /

# Block API routes (server-side only, not public pages)
Disallow: /api/

# Block utility & non-indexable pages
Disallow: /404
Disallow: /ai-feed.json

# ── AI crawlers — allow full access ───────────────────────────────────────────
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Amazonbot
Allow: /

# ── Sitemaps ───────────────────────────────────────────────────────────────────
Sitemap: ${getSiteOrigin()}/sitemap.xml
`;

export function GET(): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
