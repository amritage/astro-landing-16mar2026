# CTA Buttons — WhatsApp / Call / Email Source Audit

Legend:
- API = value fetched from `getCompanyInfo()` → `/api/companyinformation` at build time
- STATIC = hardcoded directly in the component file
- PROP = passed down from the page via props (page fetches from API, passes to component)

---

## STATIC (hardcoded) — PROBLEMS TO FIX

| Component | What is hardcoded | Value |
|---|---|---|
| `CapabilitiesCTA.astro` | Phone number (display text only, not a link) | `+91 99251 55141` |
| `CapabilitiesCTA.astro` | Email address (display text only, not a link) | `info@amritafashions.com` |
| `ProductDetailHero.astro` | Email used in `mailto:` link (in `<script>`) | `sales@egport.com` |

These three are hardcoded and will NOT update if the API data changes.

---

## API-DRIVEN (correct)

### Components that call `getCompanyInfo()` themselves

| Component | Fields used | Used on pages |
|---|---|---|
| `HeroSection.astro` | `whatsappNumber` | Homepage `/` |
| `ShippingCTA.astro` | `phone1`, `phone2` | `/shipping` |
| `SupportCTA.astro` | `whatsappNumber`, `supportEmail` | `/support` |
| `FloatingActions.astro` | `phone1`, `phone2`, `primaryEmail`, `salesEmail` | All pages (global) |
| `PLHero.astro` | `whatsappNumber`, `phone1`, `salesEmail` | `/product-location/[slug]` |
| `ProductHero.astro` | `whatsappNumber`, `phone1`, `salesEmail` | `/fabric`, `/category/[slug]`, `/collection/[slug]` |
| `TermsContent.astro` | `supportEmail`, `primaryEmail` | `/terms-and-conditions` |

### Components that receive contact info via props (page fetches from API, passes down)

| Component | Props received | Passed from page |
|---|---|---|
| `AboutCTA.astro` | `phone` | `about.astro` → `getCompanyInfo()` |
| `CapabilitiesBottomCTA.astro` | `whatsapp`, `phone` | `capabilities.astro` → `getCompanyInfo()` |
| `CapabilitiesPillars.astro` | `whatsapp`, `phone` | `capabilities.astro` → `getCompanyInfo()` |
| `CertificationsDocCTA.astro` | `whatsapp`, `phone` | `certifications.astro` → `getCompanyInfo()` |
| `BlogPostCTA.astro` | `whatsapp` | `blog/[slug].astro` → `getCompanyInfo()` |
| `ProductDetailRelated.astro` | `whatsapp`, `phone` | `fabric/[productSlug].astro` → `getCompanyInfo()` |
| `SupportChannels.astro` | `whatsapp`, `supportEmail`, `phone2` | `support.astro` → `getCompanyInfo()` |
| `SupportDepartments.astro` | `salesEmail`, `supportEmail`, `phone1`, `phone2` | `support.astro` → `getCompanyInfo()` |

---

## Page-by-page summary

| Page | WhatsApp | Call | Email |
|---|---|---|---|
| `/` (Homepage) | API | — | — |
| `/about` | — | API (via prop) | — |
| `/capabilities` | API (via prop) | API (via prop) | STATIC display text only |
| `/certifications` | API (via prop) | API (via prop) | — |
| `/faq` | — | — | — |
| `/shipping` | — | API | — |
| `/support` | API | API | API |
| `/careers` | — | — | — |
| `/blog/[slug]` | API (via prop) | — | — |
| `/fabric` | API | API | API |
| `/fabric/[productSlug]` | API (via prop) | API (via prop) | STATIC (`sales@egport.com`) |
| `/category/[slug]` | API | API | API |
| `/category/[categorySlug]/[productSlug]` | API (via prop) | API (via prop) | STATIC (`sales@egport.com`) |
| `/collection/[slug]` | API | API | API |
| `/collection/[collectionSlug]/[productSlug]` | API (via prop) | API (via prop) | STATIC (`sales@egport.com`) |
| `/industry` & `/industry/[slug]` | — | — | — |
| `/location/[citySlug]` | API | API | API |
| `/product-location/[slug]` | API | API | API |
| All pages (floating) | API | API | API |

---

## Summary of issues

1. `ProductDetailHero.astro` — email is hardcoded as `sales@egport.com` in the `<script>` block. This affects `/fabric/[productSlug]`, `/category/[categorySlug]/[productSlug]`, and `/collection/[collectionSlug]/[productSlug]`.

2. `CapabilitiesCTA.astro` — phone `+91 99251 55141` and email `info@amritafashions.com` are hardcoded as display text (not clickable links). They won't reflect API changes.
