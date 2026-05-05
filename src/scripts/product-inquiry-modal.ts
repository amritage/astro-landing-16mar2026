interface OpenProductInquiryOptions {
  product?: string;
}

interface ModalConfig {
  companyName: string;
  leadCaptureUrl: string;
}

interface AnalyticsWindow extends Window {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  ageTrack?: (eventName: string, params?: Record<string, unknown>) => void;
  ageGetAttribution?: () => Record<string, unknown>;
}

const ROOT_ID = "quote-modal-root";
const LOGO_SRC = "/images/icons/my_logo.webp";
const FORM_ID = "iqf";
const STEP_COUNT = 3;
const STEP_META = [
  { label: "Contact Info", progress: 33 },
  { label: "Company", progress: 66 },
  { label: "Requirements", progress: 100 },
] as const;

let activeCleanup: (() => void) | null = null;

function escapeHtml(value = ""): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getRoot(): HTMLElement | null {
  return document.getElementById(ROOT_ID);
}

function getConfig(root: HTMLElement): ModalConfig {
  return {
    companyName: root.dataset.companyName || "Amrita Global Enterprises",
    leadCaptureUrl: root.dataset.leadCaptureUrl || "",
  };
}

function queryRequired<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`[IQM] Missing required element: ${selector}`);
  }
  return element;
}

function pageKey(): string {
  return window.location.pathname.replace(/\//g, "_").replace(/^_/, "") || "home";
}

function productKey(product: string): string {
  return product.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "").slice(0, 30) || "product";
}

function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  const analyticsWindow = window as AnalyticsWindow;
  const payload = {
    ...params,
    page_path: window.location.pathname,
  };

  try {
    if (typeof analyticsWindow.ageTrack === "function") {
      analyticsWindow.ageTrack(name, payload);
      return;
    }

    analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
    if (typeof analyticsWindow.gtag === "function") {
      analyticsWindow.gtag("event", name, payload);
    } else {
      analyticsWindow.dataLayer.push({ event: name, ...payload });
    }
  } catch {
    // Analytics failures must not interrupt the inquiry flow.
  }
}

function getAttribution(): Record<string, unknown> {
  const analyticsWindow = window as AnalyticsWindow;
  if (typeof analyticsWindow.ageGetAttribution === "function") return analyticsWindow.ageGetAttribution();
  return {
    sourcePage: window.location.href,
    landingPage: window.location.href,
    referrer: document.referrer,
  };
}

function buildMarkup(companyName: string): string {
  return `
    <section
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      data-nosnippet
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquire-modal-title"
    >
      <div
        class="absolute inset-0 bg-[#020d1f]/80 backdrop-blur-md"
        data-close-inquiry-modal
      ></div>

      <div class="iqm-panel relative z-10 flex max-h-[92vh] w-full max-w-3xl overflow-hidden shadow-2xl">
        <div class="hidden w-64 shrink-0 flex-col justify-between bg-[#041632] px-7 py-8 text-white md:flex">
          <div>
            <div class="mb-8">
              <div class="flex items-center gap-3">
                <img
                  src="${LOGO_SRC}"
                  srcset="${LOGO_SRC} 1x, /images/icons/my_logo@2x.webp 2x"
                  alt="${escapeHtml(companyName)}"
                  width="40"
                  height="40"
                  class="h-10 w-10 flex-shrink-0 object-contain"
                />
                <div class="flex flex-col">
                  <span class="font-serif text-[17px] italic leading-tight text-white">${escapeHtml(companyName)}</span>
                  <span class="font-serif text-[16px] italic tracking-wide text-[#ffdea5]"></span>
                </div>
              </div>
              <div class="mt-5 h-px bg-white/10"></div>
            </div>
            <p class="mb-2 font-sans text-[10px] uppercase tracking-[0.3em] text-[#ffdea5]">Bulk Quote</p>
            <h2 id="inquire-modal-title" class="mb-4 font-serif text-2xl italic leading-snug">
              Request a<br />Custom Quote
            </h2>
            <p class="text-xs leading-relaxed text-white/60">
              Fill in your details and we'll prepare a personalised bulk pricing sheet within 24 hours.
            </p>
            <div id="iqm-product-chip" class="mt-6 hidden border border-white/20 p-3">
              <p class="mb-1 text-[10px] uppercase tracking-widest text-[#ffdea5]">Selected Product</p>
              <p id="inquire-product-name" class="text-xs leading-snug text-white/80"></p>
            </div>
          </div>

          <div class="mt-8 space-y-3">
            <div class="flex items-center gap-3">
              <div class="iqm-sidebar-dot flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#775a19] text-[10px] font-bold text-white transition-all duration-300">1</div>
              <span class="iqm-sidebar-label text-xs font-semibold text-white transition-colors duration-300">Contact Info</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="iqm-sidebar-dot flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/30 text-[10px] font-bold text-white/40 transition-all duration-300">2</div>
              <span class="iqm-sidebar-label text-xs text-white/40 transition-colors duration-300">Company</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="iqm-sidebar-dot flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/30 text-[10px] font-bold text-white/40 transition-all duration-300">3</div>
              <span class="iqm-sidebar-label text-xs text-white/40 transition-colors duration-300">Requirements</span>
            </div>
          </div>
        </div>

        <div class="flex flex-1 flex-col overflow-y-auto bg-white">
          <div class="flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
            <div class="md:hidden">
              <p class="text-[10px] font-bold uppercase tracking-widest text-[#775a19]">Bulk Quote</p>
              <p id="iqf-step-label-mobile" class="text-xs font-semibold text-[#44474d]">Step 1 of 3 - Contact Info</p>
            </div>
            <div class="hidden flex-1 items-center gap-2 md:flex">
              <div class="h-1 flex-1 overflow-hidden rounded-full bg-[#f0f0f0]">
                <div id="iqf-progress-bar" class="h-full rounded-full bg-[#775a19] transition-all duration-500" style="width:33%"></div>
              </div>
              <span id="iqf-progress-text" class="whitespace-nowrap text-[10px] font-sans text-[#9ca3af]">Step 1 of 3</span>
            </div>
            <button
              type="button"
              class="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#f3f4f5]"
              aria-label="Close"
              data-close-inquiry-modal
            >
              <span class="material-symbols-outlined text-lg text-[#44474d]">close</span>
            </button>
          </div>

          <div class="flex-1 px-6 py-6">
            <div class="msf-modal-inner">
              <div class="mb-2 flex items-center justify-center gap-0" id="iqf-stepper">
                <div class="h-px w-16 bg-[#d1d5db]"></div>
                <div id="iqf-dot-0" class="z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#041632] text-sm font-semibold text-white transition-all duration-300" title="Contact Info">1</div>
                <div id="iqf-line-0" class="h-px w-16 bg-[#d1d5db] transition-colors duration-300"></div>
                <div id="iqf-dot-1" class="z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#d1d5db] text-sm font-semibold text-[#9ca3af] transition-all duration-300" title="Company">2</div>
                <div id="iqf-line-1" class="h-px w-16 bg-[#d1d5db] transition-colors duration-300"></div>
                <div id="iqf-dot-2" class="z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#d1d5db] text-sm font-semibold text-[#9ca3af] transition-all duration-300" title="Requirements">3</div>
                <div class="h-px w-16 bg-[#d1d5db]"></div>
              </div>
              <p id="iqf-step-label" class="mb-6 text-center font-sans text-xs uppercase tracking-widest text-[#5a6a85]">Contact Info</p>

              <form id="${FORM_ID}" novalidate>
                <input type="text" name="_hp" class="hidden" tabindex="-1" autocomplete="off" />

                <div id="iqf-step-0" class="space-y-5">
                  <div>
                    <h3 class="mb-1 font-serif text-lg italic text-[#041632]">Your Contact Details</h3>
                    <p class="text-xs text-[#9ca3af]">We'll use this to send your quote.</p>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="iqm-field">
                      <input id="iqf-firstName" type="text" name="firstName" required placeholder=" " class="iqm-input peer" />
                      <label for="iqf-firstName" class="iqm-label">First Name <span class="text-[#775a19]">*</span></label>
                    </div>
                    <div class="iqm-field">
                      <input id="iqf-lastName" type="text" name="lastName" required placeholder=" " class="iqm-input peer" />
                      <label for="iqf-lastName" class="iqm-label">Last Name <span class="text-[#775a19]">*</span></label>
                    </div>
                  </div>
                  <div class="iqm-field">
                    <input id="iqf-email" type="email" name="emailAddress" placeholder=" " class="iqm-input peer" />
                    <label for="iqf-email" class="iqm-label">Email Address <span class="text-[#775a19]">*</span></label>
                  </div>
                  <div class="iqm-field">
                    <input id="iqf-phone" type="tel" name="phoneNumber" placeholder=" " class="iqm-input peer" />
                    <label for="iqf-phone" class="iqm-label">Phone Number (e.g. +91 98765 43210)</label>
                    <p class="ml-1 mt-1.5 text-[11px] text-[#9ca3af]">Provide at least an email or phone number.</p>
                  </div>
                  <div class="msf-nav-row end pt-2">
                    <button type="button" id="iqf-next-0" class="msf-btn-primary">
                      Continue
                      <span class="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                  </div>
                </div>

                <div id="iqf-step-1" class="hidden space-y-5">
                  <div>
                    <h3 class="mb-1 font-serif text-lg italic text-[#041632]">Company &amp; Location</h3>
                    <p class="text-xs text-[#9ca3af]">Helps us tailor pricing and logistics.</p>
                  </div>
                  <div class="iqm-field">
                    <input id="iqf-company" type="text" name="accountName" placeholder=" " class="iqm-input peer" />
                    <label for="iqf-company" class="iqm-label">Company Name</label>
                  </div>
                  <div class="iqm-field">
                    <input id="iqf-city" type="text" name="addressCity" placeholder=" " class="iqm-input peer" />
                    <label for="iqf-city" class="iqm-label">City</label>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="iqm-field">
                      <input id="iqf-state" type="text" name="addressState" placeholder=" " class="iqm-input peer" />
                      <label for="iqf-state" class="iqm-label">State</label>
                    </div>
                    <div class="iqm-field">
                      <input id="iqf-country" type="text" name="addressCountry" placeholder=" " class="iqm-input peer" />
                      <label for="iqf-country" class="iqm-label">Country</label>
                    </div>
                  </div>
                  <div class="msf-nav-row pt-2">
                    <button type="button" id="iqf-prev-1" class="msf-btn-secondary">Back</button>
                    <button type="button" id="iqf-next-1" class="msf-btn-primary">
                      Continue
                      <span class="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                  </div>
                </div>

                <div id="iqf-step-2" class="hidden space-y-5">
                  <div>
                    <h3 class="mb-1 font-serif text-lg italic text-[#041632]">Order Requirements</h3>
                    <p class="text-xs text-[#9ca3af]">Tell us what you need and we'll do the rest.</p>
                  </div>
                  <div>
                    <label for="iqf-bizType" class="msf-label">Business Type</label>
                    <select id="iqf-bizType" name="cBusinessType" class="msf-input">
                      <option value="">Select...</option>
                      <option value="fabric-importer">Fabric Importer</option>
                      <option value="fabric-exporter">Fabric Exporter</option>
                      <option value="garment-manufacturer">Garment Manufacturer</option>
                      <option value="retailer">Retailer</option>
                      <option value="wholesaler">Wholesaler</option>
                      <option value="buying-agent">Buying Agent</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label class="msf-label">Estimated Order Value</label>
                    <div class="flex flex-col gap-2 sm:flex-row">
                      <input id="iqf-amount" type="number" name="opportunityAmount" class="msf-input flex-1" placeholder="0.00" min="0" step="0.01" />
                      <select id="iqf-currency" name="opportunityAmountCurrency" class="msf-input flex-1">
                        <option value="USD">USD</option>
                        <option value="INR">INR</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label for="iqf-description" class="msf-label">Requirements</label>
                    <textarea id="iqf-description" name="description" rows="4" class="msf-input resize-none" placeholder="Quantity, colour, finish, delivery timeline..."></textarea>
                  </div>
                  <div class="msf-nav-row pt-2">
                    <button type="button" id="iqf-prev-2" class="msf-btn-secondary">Back</button>
                    <button type="submit" id="iqf-submit" class="msf-btn-primary">
                      <span id="iqf-submit-text">Send Inquiry</span>
                      <span id="iqf-submit-spinner" class="material-symbols-outlined animate-spin text-base" style="display:none">progress_activity</span>
                    </button>
                  </div>
                </div>

                <div id="iqf-success" class="hidden space-y-4 py-8 text-center">
                  <span class="material-symbols-outlined text-5xl text-[#775a19]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                  <h3 class="font-serif text-2xl italic text-[#041632]">Inquiry Sent!</h3>
                  <p class="text-sm text-[#44474d]">We'll prepare your bulk quote and reach out within 24 hours.</p>
                </div>
                <div id="iqf-error" class="hidden mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <style>
      @keyframes iqm-in {
        from { opacity: 0; transform: translateY(24px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }

      .iqm-panel { animation: iqm-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both; }
      .iqm-field { position: relative; }
      .iqm-input {
        width: 100%;
        border: 1.5px solid #e5e7eb;
        background: #fafafa;
        padding: 1.25rem 0.875rem 0.5rem;
        font-size: 0.875rem;
        color: #041632;
        outline: none;
        transition: border-color 0.2s, background 0.2s;
        border-radius: 6px;
      }
      .iqm-input:focus {
        border-color: #775a19;
        background: #fff;
      }
      .iqm-label {
        position: absolute;
        left: 0.875rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.8rem;
        color: #9ca3af;
        pointer-events: none;
        transition: all 0.18s ease;
        font-family: var(--font-sans, sans-serif);
      }
      .iqm-input:focus ~ .iqm-label,
      .iqm-input:not(:placeholder-shown) ~ .iqm-label {
        top: 0.55rem;
        transform: none;
        font-size: 0.65rem;
        color: #775a19;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .msf-label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #041632;
      }
      .msf-input {
        width: 100%;
        border: 1px solid #d1d5db;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        color: #041632;
        background: #f3f4f5;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      @media (min-width: 640px) {
        .msf-input { font-size: 0.875rem; }
      }
      .msf-input:focus {
        border-color: #775a19;
        box-shadow: 0 0 0 1px #775a19;
        background: white;
      }
      .msf-btn-primary {
        display: inline-flex;
        width: 100%;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        border: none;
        background: #041632;
        padding: 0.875rem 1.5rem;
        color: white;
        cursor: pointer;
        font-family: var(--font-sans, sans-serif);
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        transition: background 0.2s;
      }
      @media (min-width: 480px) {
        .msf-btn-primary {
          width: auto;
          padding: 0.875rem 2rem;
        }
      }
      .msf-btn-primary:hover { background: #775a19; }
      .msf-btn-primary:disabled { cursor: not-allowed; opacity: 0.5; }
      .msf-btn-secondary {
        width: 100%;
        cursor: pointer;
        border: 1px solid #d1d5db;
        background: white;
        padding: 0.875rem 1.5rem;
        color: #041632;
        font-family: var(--font-sans, sans-serif);
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        transition: border-color 0.2s;
      }
      @media (min-width: 480px) {
        .msf-btn-secondary {
          width: auto;
          padding: 0.875rem 2rem;
        }
      }
      .msf-btn-secondary:hover { border-color: #041632; }
      .msf-nav-row {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding-top: 0.5rem;
      }
      @media (min-width: 480px) {
        .msf-nav-row {
          flex-direction: row;
          justify-content: space-between;
        }
        .msf-nav-row.end {
          justify-content: flex-end;
        }
      }
    </style>
  `;
}

export function openProductInquiryModal(options: OpenProductInquiryOptions = {}): void {
  activeCleanup?.();

  const root = getRoot();
  if (!root) return;

  const { companyName, leadCaptureUrl } = getConfig(root);
  const productName = options.product?.trim() ?? "";
  const previousBodyOverflow = document.body.style.overflow;

  root.innerHTML = buildMarkup(companyName);
  document.body.style.overflow = "hidden";

  const form = queryRequired<HTMLFormElement>(root, `#${FORM_ID}`);
  const productChip = queryRequired<HTMLElement>(root, "#iqm-product-chip");
  const productNameEl = queryRequired<HTMLElement>(root, "#inquire-product-name");
  const progressBar = queryRequired<HTMLElement>(root, "#iqf-progress-bar");
  const progressText = queryRequired<HTMLElement>(root, "#iqf-progress-text");
  const mobileLabel = queryRequired<HTMLElement>(root, "#iqf-step-label-mobile");
  const stepLabel = queryRequired<HTMLElement>(root, "#iqf-step-label");
  const submitButton = queryRequired<HTMLButtonElement>(root, "#iqf-submit");
  const submitText = queryRequired<HTMLElement>(root, "#iqf-submit-text");
  const submitSpinner = queryRequired<HTMLElement>(root, "#iqf-submit-spinner");
  const errorEl = queryRequired<HTMLElement>(root, "#iqf-error");
  const successEl = queryRequired<HTMLElement>(root, "#iqf-success");
  const firstNameInput = queryRequired<HTMLInputElement>(root, "#iqf-firstName");
  const sidebarDots = Array.from(root.querySelectorAll<HTMLElement>(".iqm-sidebar-dot"));
  const sidebarLabels = Array.from(root.querySelectorAll<HTMLElement>(".iqm-sidebar-label"));

  productNameEl.textContent = productName;
  productChip.classList.toggle("hidden", !productName);

  let current = 0;
  let isClosed = false;

  const cleanup = (): void => {
    if (isClosed) return;
    isClosed = true;
    document.removeEventListener("keydown", onKeydown);
    root.innerHTML = "";
    document.body.style.overflow = previousBodyOverflow;
    if (activeCleanup === cleanup) activeCleanup = null;
  };

  const closeModal = (): void => {
    trackEvent(`inquiry_modal_closed__step${current + 1}__${pageKey()}`, {
      step_reached: current + 1,
    });
    cleanup();
  };

  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") closeModal();
  };

  activeCleanup = cleanup;
  document.addEventListener("keydown", onKeydown);

  root.querySelectorAll<HTMLElement>("[data-close-inquiry-modal]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  const g = (name: string): string =>
    (
      form.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`[name="${name}"]`)
        ?.value ?? ""
    ).trim();

  const goTo = (stepIndex: number): void => {
    queryRequired<HTMLElement>(root, `#${FORM_ID}-step-${current}`).classList.add("hidden");
    current = stepIndex;
    queryRequired<HTMLElement>(root, `#${FORM_ID}-step-${current}`).classList.remove("hidden");

    const meta = STEP_META[current];
    progressBar.style.width = `${meta.progress}%`;
    progressText.textContent = `Step ${current + 1} of ${STEP_COUNT}`;
    mobileLabel.textContent = `Step ${current + 1} of ${STEP_COUNT} - ${meta.label}`;
    stepLabel.textContent = meta.label;

    for (let i = 0; i < STEP_COUNT; i += 1) {
      const dot = queryRequired<HTMLElement>(root, `#${FORM_ID}-dot-${i}`);
      if (i <= current) {
        dot.classList.remove("border-2", "border-[#d1d5db]", "text-[#9ca3af]");
        dot.classList.add("bg-[#041632]", "text-white");
      } else {
        dot.classList.add("border-2", "border-[#d1d5db]", "text-[#9ca3af]");
        dot.classList.remove("bg-[#041632]", "text-white");
      }
    }

    for (let i = 0; i < STEP_COUNT - 1; i += 1) {
      const line = queryRequired<HTMLElement>(root, `#${FORM_ID}-line-${i}`);
      line.classList.toggle("bg-[#041632]", i < current);
      line.classList.toggle("bg-[#d1d5db]", i >= current);
    }

    sidebarDots.forEach((dot, index) => {
      dot.classList.toggle("bg-[#775a19]", index <= current);
      dot.classList.toggle("text-white", index <= current);
      dot.classList.toggle("border", index > current);
      dot.classList.toggle("border-white/30", index > current);
      dot.classList.toggle("text-white/40", index > current);
    });

    sidebarLabels.forEach((label, index) => {
      label.classList.toggle("text-white", index <= current);
      label.classList.toggle("font-semibold", index === current);
      label.classList.toggle("text-white/40", index > current);
    });
  };

  const validateStep0 = (): boolean => {
    if (!g("firstName") || !g("lastName")) {
      window.alert("Please enter your first and last name.");
      return false;
    }
    if (!g("emailAddress") && !g("phoneNumber")) {
      window.alert("Please provide at least an email or phone number.");
      return false;
    }
    return true;
  };

  const collectPayload = (): Record<string, unknown> => {
    const payload: Record<string, unknown> = { ...getAttribution() };
    [
      "firstName",
      "lastName",
      "emailAddress",
      "accountName",
      "addressCity",
      "addressState",
      "addressCountry",
    ].forEach((field) => {
      const value = g(field);
      if (value) payload[field] = value;
    });

    const businessType = g("cBusinessType");
    const amount = g("opportunityAmount");
    const currency = g("opportunityAmountCurrency");
    if (businessType) payload.cBusinessType = [businessType];
    if (amount) payload.opportunityAmount = Number.parseFloat(amount);
    if (currency) payload.opportunityAmountCurrency = currency;

    const descriptionParts: string[] = [];
    if (productName) descriptionParts.push(`Product: ${productName}`);
    const phone = g("phoneNumber");
    if (phone) descriptionParts.push(`Phone: ${phone}`);
    const requirements = g("description");
    if (requirements) descriptionParts.push(requirements);
    if (descriptionParts.length > 0) payload.description = descriptionParts.join("\n");

    return payload;
  };

  queryRequired<HTMLButtonElement>(root, "#iqf-next-0").addEventListener("click", () => {
    if (!validateStep0()) return;
    goTo(1);
    trackEvent(`inquiry_modal_step2_company__${pageKey()}`, { product: productName });
  });

  queryRequired<HTMLButtonElement>(root, "#iqf-prev-1").addEventListener("click", () => {
    goTo(0);
  });

  queryRequired<HTMLButtonElement>(root, "#iqf-next-1").addEventListener("click", () => {
    goTo(2);
    trackEvent(`inquiry_modal_step3_requirements__${pageKey()}`, { product: productName });
  });

  queryRequired<HTMLButtonElement>(root, "#iqf-prev-2").addEventListener("click", () => {
    goTo(1);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const honeypot = form.querySelector<HTMLInputElement>('[name="_hp"]');
    if (honeypot?.value) return;

    submitButton.disabled = true;
    submitText.textContent = "Sending...";
    submitSpinner.style.display = "";
    errorEl.classList.add("hidden");

    trackEvent(`inquiry_modal_submitted__${pageKey()}`, { product: productName });

    const resetSubmitState = (): void => {
      submitButton.disabled = false;
      submitText.textContent = "Send Inquiry";
      submitSpinner.style.display = "none";
    };

    try {
      if (!leadCaptureUrl) {
        throw new Error("Lead capture URL is not configured.");
      }

      const payload = collectPayload();
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 8000);

      let response: Response;
      try {
        response = await fetch(leadCaptureUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      } finally {
        window.clearTimeout(timer);
      }

      if (!response.ok) {
        let detail = "";
        try {
          detail = await response.text();
        } catch {
          detail = "";
        }
        console.error("[IQM] API error", response.status, detail);
        throw new Error(`API error ${response.status}${detail ? `: ${detail}` : ""}`);
      }

      form.reset();
      queryRequired<HTMLElement>(root, `#${FORM_ID}-step-${current}`).classList.add("hidden");
      resetSubmitState();
      successEl.classList.remove("hidden");
      progressBar.style.width = "100%";
      progressText.textContent = `Step ${STEP_COUNT} of ${STEP_COUNT}`;
      mobileLabel.textContent = "Inquiry Sent";
      stepLabel.textContent = "Inquiry Sent";
      trackEvent(`inquiry_modal_success__${pageKey()}`, { product: productName });
    } catch (error: unknown) {
      let message = "Something went wrong. Please try again.";
      if (error instanceof Error) {
        if (error.name === "AbortError") message = "Request timed out. Please try again.";
        else if (error.message) message = error.message;
      }
      console.error("[IQM] Submit error:", error);
      errorEl.textContent = message;
      errorEl.classList.remove("hidden");
      trackEvent(`inquiry_modal_error__${pageKey()}`, {
        error_message: message,
      });
      resetSubmitState();
    }
  });

  trackEvent(`inquiry_modal_opened__${productKey(productName)}__${pageKey()}`, {
    product: productName,
  });
  firstNameInput.focus();
}
