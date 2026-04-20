/**
 * POST /api/inquiry
 * Server-side proxy for ProductInquiryModal and PLInquiryForm.
 * Validates payload, checks honeypot, then forwards to EspoCRM.
 * Credentials never leave the server.
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

  // Honeypot
  if (body._hp) return apiOk("ok");

  const firstName = String(body.firstName ?? "").trim();
  const lastName  = String(body.lastName  ?? "").trim();
  const email     = String(body.emailAddress ?? "").trim();
  const phone     = String(body.phoneNumber  ?? "").trim();

  if (!firstName || !lastName)          return apiError("First and last name are required.");
  if (!email && !phone)                 return apiError("An email address or phone number is required.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return apiError("Invalid email address.");

  const payload: Record<string, unknown> = { firstName, lastName };
  if (email) payload.emailAddress = email;

  const textFields = [
    "salutationName","accountName",
    "addressStreet","addressCity","addressState","addressCountry",
    "description",
  ] as const;
  for (const f of textFields) {
    const v = String(body[f] ?? "").trim();
    if (v) payload[f] = v;
  }

  const bt  = String(body.cBusinessType ?? "").trim();
  const fc  = String(body.cFabricCategory ?? "").trim();
  const am  = parseFloat(String(body.opportunityAmount ?? ""));
  const cur = String(body.opportunityAmountCurrency ?? "").trim();
  if (bt)         payload.cBusinessType   = [bt];
  if (fc)         payload.cFabricCategory = [fc];
  if (!isNaN(am)) payload.opportunityAmount = am;
  if (cur)        payload.opportunityAmountCurrency = cur;

  const url = getLeadCaptureUrl("lead");
  if (!url) return apiError("Form submission is not configured. Please contact us directly.", 503);

  try {
    const res = await proxyToEspo(url, payload);
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[api/inquiry] EspoCRM error", res.status, detail);
      return apiError("Submission failed. Please try again.", 502);
    }
    return apiOk("Your inquiry has been received.");
  } catch (err) {
    console.error("[api/inquiry] fetch error", err);
    return apiError("Network error. Please try again.", 502);
  }
};
