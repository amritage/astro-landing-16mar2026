/**
 * POST /api/careers
 * Server-side proxy for the CareersForm job application.
 * Note: resume file upload still goes directly to EspoCRM /Attachment
 * because it requires a multipart binary stream — that endpoint is
 * authenticated differently and the attachment ID is passed here.
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

  const firstName = String(body.firstName ?? "").trim();
  const lastName  = String(body.lastName  ?? "").trim();
  const email     = String(body.emailAddress ?? "").trim();
  const title     = String(body.title ?? "").trim();

  if (!firstName || !lastName) return apiError("First and last name are required.");
  if (!email)                  return apiError("Email address is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return apiError("Invalid email address.");
  if (!title)                  return apiError("Position applied for is required.");

  const payload: Record<string, unknown> = { firstName, lastName, emailAddress: email, title };

  const textFields = [
    "addressStreet","addressCity","addressState","addressCountry","addressPostalCode",
    "cExperience","description",
  ] as const;
  for (const f of textFields) {
    const v = String(body[f] ?? "").trim();
    if (v) payload[f] = v;
  }

  // Resume attachment ID uploaded separately by the client
  if (body.cResumeAttachmentIds) payload.cResumeAttachmentIds = body.cResumeAttachmentIds;

  const url = getLeadCaptureUrl("careers");
  if (!url) return apiError("Application submission is not configured.", 503);

  try {
    const res = await proxyToEspo(url, payload);
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[api/careers] EspoCRM error", res.status, detail);
      return apiError("Submission failed. Please try again.", 502);
    }
    return apiOk("Application received.");
  } catch (err) {
    console.error("[api/careers] fetch error", err);
    return apiError("Network error. Please try again.", 502);
  }
};
