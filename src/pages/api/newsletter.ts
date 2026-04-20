/**
 * POST /api/newsletter
 * Server-side proxy for Footer and BlogNewsletter email subscriptions.
 */
import type { APIRoute } from "astro";
import { getLeadCaptureUrl, proxyToEspo, apiError, apiOk } from "../../lib/espo-proxy";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body");
  }

  const email  = String(body.emailAddress ?? "").trim();
  const source = String(body.description  ?? "Newsletter").trim();

  if (!email)                                              return apiError("Email address is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))         return apiError("Invalid email address.");

  const url = getLeadCaptureUrl("lead");
  if (!url) return apiError("Newsletter is not configured.", 503);

  try {
    const res = await proxyToEspo(url, { emailAddress: email, description: source });
    if (!res.ok) return apiError("Subscription failed. Please try again.", 502);
    return apiOk("Subscribed successfully.");
  } catch (err) {
    console.error("[api/newsletter] fetch error", err);
    return apiError("Network error. Please try again.", 502);
  }
};
