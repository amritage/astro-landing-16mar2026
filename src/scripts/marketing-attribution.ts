type UnknownRecord = Record<string, unknown>;
type GtagFn = (...args: unknown[]) => void;
type FbqFn = (...args: unknown[]) => void;
type ClarityFn = (action: string, key: string, value?: string) => void;

interface MarketingTrackingConfig {
  googleAdsConversionId?: string | null;
  googleAdsLeadConversionLabel?: string | null;
  metaLeadEventName?: string | null;
}

interface TrackingWindow extends Window {
  dataLayer?: unknown[];
  gtag?: GtagFn & { __agePatched?: boolean };
  fbq?: FbqFn;
  clarity?: ClarityFn;
  ageTrack?: (eventName: string, params?: UnknownRecord) => void;
  ageGetAttribution?: () => UnknownRecord;
  __AGE_TRACKING_CONFIG__?: MarketingTrackingConfig;
  __AGE_TRACKING_INITIALIZED__?: boolean;
  __AGE_TRACKING_HANDLING__?: boolean;
}

const FIRST_TOUCH_KEY = "age_first_touch_attribution";
const LAST_TOUCH_KEY = "age_last_touch_attribution";

const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "utm_creative_format",
  "utm_marketing_tactic",
  "gclid",
  "dclid",
  "gbraid",
  "wbraid",
  "gad_source",
  "gad_campaignid",
  "fbclid",
  "msclkid",
  "li_fat_id",
  "ttclid",
  "twclid",
  "srsltid",
];

function trackingWindow(): TrackingWindow {
  return window as TrackingWindow;
}

function cleanRecord(record: UnknownRecord): UnknownRecord {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
}

function readStorage(key: string): UnknownRecord {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStorage(key: string, value: UnknownRecord): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Attribution must never block the page if storage is unavailable.
  }
}

function readUrlAttribution(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const values: Record<string, string> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key);
    if (value) values[key] = value;
  }
  return values;
}

function readCookie(name: string): string | null {
  const encodedName = `${encodeURIComponent(name)}=`;
  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(encodedName));
  return cookie ? decodeURIComponent(cookie.slice(encodedName.length)) : null;
}

function readGaClientId(): string | null {
  const cookie = readCookie("_ga");
  if (!cookie) return null;
  const parts = cookie.split(".");
  if (parts.length < 4) return cookie;
  return parts.slice(-2).join(".");
}

function buildFbcFromClickId(fbclid: unknown): string | null {
  if (!fbclid || typeof fbclid !== "string") return null;
  return `fb.1.${Date.now()}.${fbclid}`;
}

function browserAttribution(urlAttribution: UnknownRecord): UnknownRecord {
  return cleanRecord({
    gaClientId: readGaClientId(),
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc") ?? buildFbcFromClickId(urlAttribution.fbclid),
  });
}

function currentTouch(): UnknownRecord {
  const urlAttribution = readUrlAttribution();
  return cleanRecord({
    ...urlAttribution,
    sourcePage: window.location.href,
    landingPage: window.location.href,
    referrer: document.referrer,
    capturedAt: new Date().toISOString(),
  });
}

function hasCampaignSignal(record: UnknownRecord): boolean {
  return ATTRIBUTION_KEYS.some((key) => Boolean(record[key]));
}

function persistAttribution(): void {
  const current = currentTouch();
  const first = readStorage(FIRST_TOUCH_KEY);

  if (Object.keys(first).length === 0) {
    writeStorage(FIRST_TOUCH_KEY, current);
  }

  if (hasCampaignSignal(current) || Object.keys(readStorage(LAST_TOUCH_KEY)).length === 0) {
    writeStorage(LAST_TOUCH_KEY, current);
  }
}

function prefixedParams(prefix: string, record: UnknownRecord): UnknownRecord {
  const output: UnknownRecord = {};
  for (const key of ATTRIBUTION_KEYS) {
    if (record[key]) output[`${prefix}_${key}`] = record[key];
  }
  return output;
}

export function getAttributionPayload(): UnknownRecord {
  if (typeof window === "undefined") return {};

  const first = readStorage(FIRST_TOUCH_KEY);
  const last = readStorage(LAST_TOUCH_KEY);
  const currentParams = readUrlAttribution();
  const primary = { ...last, ...currentParams };

  return cleanRecord({
    sourcePage: window.location.href,
    landingPage: first.landingPage ?? first.sourcePage ?? window.location.href,
    referrer: first.referrer ?? document.referrer,
    firstTouchAt: first.capturedAt,
    lastTouchPage: last.sourcePage,
    lastTouchAt: last.capturedAt,
    ...Object.fromEntries(ATTRIBUTION_KEYS.map((key) => [key, primary[key] ?? first[key]])),
    ...prefixedParams("first", first),
    ...prefixedParams("last", last),
    ...browserAttribution(primary),
  });
}

function eventPayload(params: UnknownRecord = {}): UnknownRecord {
  return cleanRecord({
    page_path: window.location.pathname,
    page_location: window.location.href,
    page_title: document.title,
    ...getAttributionPayload(),
    ...params,
  });
}

function isPlainEventObject(item: unknown): item is UnknownRecord & { event: string } {
  return Boolean(
    item &&
      typeof item === "object" &&
      !Array.isArray(item) &&
      typeof (item as UnknownRecord).event === "string",
  );
}

function isLeadSuccessEvent(eventName: string): boolean {
  return /(^lp_form_success$|inquiry_.*success|_inquiry_success|form_success|contact_success|newsletter_.*success|application_success|lead_success|subscribe_success)/i.test(
    eventName,
  );
}

function isContactClickEvent(eventName: string): boolean {
  return /(whatsapp|call|phone|email).*click|click.*(whatsapp|call|phone|email)|contact_click/i.test(eventName);
}

function sendToClarity(eventName: string, params: UnknownRecord): void {
  const w = trackingWindow();
  if (typeof w.clarity !== "function") return;
  w.clarity("set", "event", eventName);
  w.clarity("set", "page", String(params.page_path ?? window.location.pathname));
  if (params.utm_campaign) w.clarity("set", "campaign", String(params.utm_campaign));
}

function sendToMeta(eventName: string, params: UnknownRecord, config: MarketingTrackingConfig): void {
  const w = trackingWindow();
  if (typeof w.fbq !== "function") return;

  if (isLeadSuccessEvent(eventName)) {
    w.fbq("track", config.metaLeadEventName || "Lead", params);
    return;
  }

  if (isContactClickEvent(eventName)) {
    w.fbq("track", "Contact", params);
    return;
  }

  w.fbq("trackCustom", eventName, params);
}

function sendGoogleAdsLead(eventName: string, params: UnknownRecord, config: MarketingTrackingConfig): void {
  const w = trackingWindow();
  if (
    !isLeadSuccessEvent(eventName) ||
    typeof w.gtag !== "function" ||
    !config.googleAdsConversionId ||
    !config.googleAdsLeadConversionLabel
  ) {
    return;
  }

  w.gtag("event", "conversion", {
    send_to: `${config.googleAdsConversionId}/${config.googleAdsLeadConversionLabel}`,
    event_category: "lead",
    event_label: eventName,
    page_path: params.page_path,
    page_location: params.page_location,
  });
}

function handleMarketingEvent(eventName: string, params: UnknownRecord, config: MarketingTrackingConfig): void {
  if (eventName === "conversion") return;
  const payload = eventPayload(params);
  sendToClarity(eventName, payload);
  sendToMeta(eventName, payload, config);
  sendGoogleAdsLead(eventName, payload, config);
}

function patchDataLayer(config: MarketingTrackingConfig): void {
  const w = trackingWindow();
  w.dataLayer = w.dataLayer ?? [];
  const dataLayer = w.dataLayer as unknown[] & { __agePatched?: boolean };
  if (dataLayer.__agePatched) return;

  const originalPush = dataLayer.push.bind(dataLayer);
  dataLayer.push = (...items: unknown[]): number => {
    const enrichedItems = items.map((item) => {
      if (!isPlainEventObject(item)) return item;
      return {
        ...eventPayload(item),
        event: item.event,
      };
    });

    const result = originalPush(...enrichedItems);

    for (const item of enrichedItems) {
      if (!isPlainEventObject(item) || item.__age_from_gtag) continue;
      handleMarketingEvent(item.event, item, config);
    }

    return result;
  };

  dataLayer.__agePatched = true;
}

function patchGtag(config: MarketingTrackingConfig): void {
  const w = trackingWindow();
  if (typeof w.gtag !== "function" || w.gtag.__agePatched) return;

  const original = w.gtag;
  const patched: GtagFn & { __agePatched?: boolean } = (...args: unknown[]) => {
    original(...args);

    if (args[0] !== "event" || typeof args[1] !== "string") return;

    const eventName = args[1];
    const params = typeof args[2] === "object" && args[2] !== null ? (args[2] as UnknownRecord) : {};
    const payload = eventPayload(params);

    handleMarketingEvent(eventName, payload, config);

    if (!w.__AGE_TRACKING_HANDLING__) {
      w.__AGE_TRACKING_HANDLING__ = true;
      w.dataLayer?.push({ event: eventName, ...payload, __age_from_gtag: true });
      w.__AGE_TRACKING_HANDLING__ = false;
    }
  };

  patched.__agePatched = true;
  w.gtag = patched;
}

export function trackMarketingEvent(eventName: string, params: UnknownRecord = {}): void {
  const w = trackingWindow();
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event: eventName, ...params });
}

export function initMarketingAttribution(config: MarketingTrackingConfig = {}): void {
  if (typeof window === "undefined") return;

  const w = trackingWindow();
  w.__AGE_TRACKING_CONFIG__ = config;
  persistAttribution();
  w.ageGetAttribution = getAttributionPayload;
  w.ageTrack = trackMarketingEvent;

  patchDataLayer(config);
  patchGtag(config);

  if (!w.__AGE_TRACKING_INITIALIZED__) {
    w.__AGE_TRACKING_INITIALIZED__ = true;
    window.addEventListener("load", () => patchGtag(config));
    window.setTimeout(() => patchGtag(config), 1000);
    window.setTimeout(() => patchGtag(config), 3000);
  }
}
