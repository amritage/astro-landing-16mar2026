/**
 * Shared server-side utility for proxying form submissions to EspoCRM.
 * Only runs in API routes — never shipped to the browser.
 */

const ESPO_BASE        = import.meta.env.ESPO_BASE        as string | undefined;
const LEAD_KEY         = import.meta.env.LEAD_CAPTURE_KEY as string | undefined;
const CAREERS_LEAD_KEY = import.meta.env.CAREERS_LEAD_CAPTURE_KEY as string | undefined;

export function getLeadCaptureUrl(type: "lead" | "careers" = "lead"): string | null {
  const base = ESPO_BASE?.replace(/\/$/, "");
  const key  = type === "careers" ? CAREERS_LEAD_KEY : LEAD_KEY;
  if (!base || !key) return null;
  return `${base}/LeadCapture/${key}`;
}

/** Proxy a validated payload to EspoCRM. Returns the fetch Response. */
export async function proxyToEspo(
  url: string,
  payload: Record<string, unknown>
): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/** Standard error response helper */
export function apiError(message: string, status = 400): Response {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Standard success response helper */
export function apiOk(message = "Submitted"): Response {
  return new Response(JSON.stringify({ ok: true, message }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
