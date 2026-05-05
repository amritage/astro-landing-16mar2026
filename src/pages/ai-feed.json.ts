import type { APIRoute } from "astro";
import { getSiteOrigin } from "../lib/site-url";

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: "Amrita Global Enterprises",
        type: "B2B fabric catalogue and lead-generation website",
        website: getSiteOrigin(),
        primaryActions: ["Send fabric inquiry", "Request fabric samples", "WhatsApp", "Call"],
        audience: ["garment manufacturers", "textile traders", "wholesalers", "exporters", "bulk fabric buyers"],
        machineReadable: {
          llms: `${getSiteOrigin()}/llms.txt`,
          sitemap: `${getSiteOrigin()}/sitemap.xml`,
          robots: `${getSiteOrigin()}/robots.txt`,
        },
      },
      null,
      2,
    ),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
