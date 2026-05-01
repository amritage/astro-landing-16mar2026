declare global {
  interface Window {
    __PRODUCT_INQUIRY_ROOT_INIT__?: boolean;
  }
}

async function openInquiryModal(product: string): Promise<void> {
  const { openProductInquiryModal } = await import("./product-inquiry-modal");
  openProductInquiryModal({ product });
}

export function initProductInquiryRoot(): void {
  if (window.__PRODUCT_INQUIRY_ROOT_INIT__) return;
  window.__PRODUCT_INQUIRY_ROOT_INIT__ = true;

  document.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const trigger = target.closest<HTMLElement>("[data-open-inquiry-modal]");
    if (!trigger) return;

    const fallbackHref =
      trigger instanceof HTMLAnchorElement ? trigger.href : trigger.getAttribute("data-fallback-href");

    event.preventDefault();

    try {
      await openInquiryModal(trigger.dataset.product ?? "");
    } catch (error) {
      console.error("[IQM] Failed to open modal:", error);
      if (fallbackHref) window.location.href = fallbackHref;
    }
  });

  window.addEventListener("iqm:open", async (event) => {
    try {
      const detail =
        event instanceof CustomEvent && event.detail && typeof event.detail === "object"
          ? event.detail
          : null;
      const product =
        detail && "product" in detail && typeof detail.product === "string" ? detail.product : "";
      await openInquiryModal(product);
    } catch (error) {
      console.error("[IQM] Failed to open modal from event:", error);
    }
  });
}
