/**
 * Single source of truth for all hardcoded constants.
 * C3/C4/C5 FIX: previously scattered across 6+ files.
 *
 * To change the site domain, WhatsApp number, or API URL —
 * edit here only. All consumers import from this file.
 */

/** Public site base URL — override via PUBLIC_SITE_URL env var */
export const SITE_BASE =
  import.meta.env.PUBLIC_SITE_URL ?? "https://www.amrita-fashions.com";

/** Backend API base URL — override via API_BASE_URL env var */
export const API_BASE =
  (import.meta.env.API_BASE_URL as string | undefined) ??
  (typeof process !== "undefined" ? process.env.API_BASE_URL : undefined) ??
  "https://espobackend.vercel.app";

/** WhatsApp fallback used when company API data is unavailable */
export const WA_FALLBACK = "https://wa.me/+919925155141";

/** Phone fallback used when company API data is unavailable */
export const PHONE_FALLBACK = "tel:+919925155141";
