/**
 * Single source of truth for all EspoCRM endpoint constants.
 * C3 FIX: previously hardcoded in 5 separate client-side <script> blocks.
 *
 * These are imported by Astro components via define:vars so the values
 * are injected at build time into each client script.
 *
 * To update an endpoint (e.g. after a CRM migration), change it here only.
 */

/** EspoCRM base URL */
export const ESPO_BASE = "https://espo.egport.com/api/v1";

/** Lead capture endpoint — used by newsletter, contact, and inquiry forms */
export const LEAD_CAPTURE_URL = `${ESPO_BASE}/LeadCapture/a4624c9bb58b8b755e3d94f1a25fc9be`;

/** Lead capture endpoint — used exclusively by the careers / job application form */
export const CAREERS_LEAD_CAPTURE_URL = `${ESPO_BASE}/LeadCapture/517205fe58db736ea2438667b84df4d0`;

/** Attachment upload endpoint — used by the careers form for resume uploads */
export const ATTACHMENT_UPLOAD_URL = `${ESPO_BASE}/Attachment`;
