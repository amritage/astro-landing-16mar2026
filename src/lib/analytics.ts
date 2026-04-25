/**
 * GA4 event tracking utility.
 * Every event automatically includes page_path so you can see
 * exactly which page + which element triggered it in GA reports.
 */

type GtagFn = (...args: unknown[]) => void;

function page(): string {
  return typeof window !== "undefined" ? window.location.pathname : "";
}

function send(eventName: string, params: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof (window as unknown as { gtag?: GtagFn }).gtag === "function") {
    (window as unknown as { gtag: GtagFn }).gtag("event", eventName, {
      page_path: page(),
      ...params,
    });
  }
}

// ── CTA clicks ────────────────────────────────────────────────────────────────
// label     = button text e.g. "Get a Wholesale Quote"
// section   = component/area e.g. "hero", "faq_cta"
export function trackCTAClick(label: string, section: string) {
  send("cta_click", { event_label: label, section });
}

// ── Form events ───────────────────────────────────────────────────────────────
// formId    = unique form identifier e.g. "plf", "iqf", "newsletter"
// formName  = human-readable name e.g. "Product Inquiry Form"
export function trackFormStart(formId: string, formName: string) {
  send("form_start", { form_id: formId, form_name: formName });
}

export function trackFormStep(formId: string, formName: string, step: number, stepLabel: string) {
  send("form_step", { form_id: formId, form_name: formName, step_number: step, step_label: stepLabel });
}

export function trackFormSubmit(formId: string, formName: string, extra?: Record<string, string>) {
  send("form_submit", { form_id: formId, form_name: formName, ...extra });
}

export function trackFormSuccess(formId: string, formName: string, extra?: Record<string, string>) {
  send("form_success", { form_id: formId, form_name: formName, ...extra });
}

export function trackFormError(formId: string, formName: string, errorMessage: string) {
  send("form_error", { form_id: formId, form_name: formName, error_message: errorMessage });
}

// ── Modal events ──────────────────────────────────────────────────────────────
// modalId   = e.g. "inquiry_modal", "share_modal"
// trigger   = what opened it e.g. "Request a Custom Quote button"
export function trackModalOpen(modalId: string, trigger: string, extra?: Record<string, string>) {
  send("modal_open", { modal_id: modalId, trigger, ...extra });
}

export function trackModalClose(modalId: string, stepReached: number) {
  send("modal_close", { modal_id: modalId, step_reached: stepReached });
}

// ── Share events ──────────────────────────────────────────────────────────────
export function trackShare(method: string, productName: string) {
  send("share", { method, content_type: "product", item_id: productName });
}

// ── Engagement ────────────────────────────────────────────────────────────────
export function trackEngagement(action: string, extra?: Record<string, string>) {
  send("engagement", { action, ...extra });
}
