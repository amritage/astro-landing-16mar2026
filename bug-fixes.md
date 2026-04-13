# Bug Fixes — Complete Record

All fixes across two rounds: API/data layer bugs (B1–B6) and code duplication bugs (C1–C5).

---

## Round 1 — API & Data Layer

---

### B1 — `getAllProducts()` fetches too many small pages

**File:** `src/lib/api.ts`

**Problem:** Page size was 20, meaning a 200-product catalogue required 10 requests.

**Before**
```ts
export async function getAllProducts(): Promise<ApiProduct[]> {
  const first = await getProducts(1, 20);
  if (first.totalPages <= 1) return first.data;
  const rest = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, i) => getProducts(i + 2, 20))
  );
  return [first.data, ...rest.map((p) => p.data)].flat();
}
```

**After**
```ts
export async function getAllProducts(): Promise<ApiProduct[]> {
  const first = await getProducts(1, 500); // one request for most catalogues
  if (first.totalPages <= 1) return first.data;
  const rest = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, i) => getProducts(i + 2, 500))
  );
  return [first.data, ...rest.map((p) => p.data)].flat();
}
```

---

### B2 — Topic pages fetched sequentially

**File:** `src/lib/api.ts`

**Problem:** `do...while` loop fetched each page only after the previous one resolved — O(n) serial requests.

**Before**
```ts
async function getAllTopicPages(): Promise<ApiTopicPage[]> {
  const all: ApiTopicPage[] = [];
  let page = 1;
  let totalPages = 1;
  try {
    do {
      const res = await fetch(`${BASE_URL}/api/topicpage?page=${page}&limit=20`);
      if (!res.ok) break;
      const json = await res.json();
      all.push(...(json.data ?? []));
      totalPages = json.pagination?.totalPages ?? 1;
      page++;
    } while (page <= totalPages);
  } catch {}
  return all;
}
```

**After**
```ts
async function getAllTopicPages(): Promise<ApiTopicPage[]> {
  try {
    const firstRes = await fetch(`${BASE_URL}/api/topicpage?page=1&limit=20`);
    if (!firstRes.ok) return [];
    const firstJson = await firstRes.json();
    const firstData: ApiTopicPage[] = firstJson.data ?? [];
    const totalPages: number = firstJson.pagination?.totalPages ?? 1;
    if (totalPages <= 1) return firstData;
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        fetch(`${BASE_URL}/api/topicpage?page=${i + 2}&limit=20`)
          .then((r) => (r.ok ? r.json() : { data: [] }))
          .then((j) => (j.data ?? []) as ApiTopicPage[])
      )
    );
    return [...firstData, ...rest.flat()];
  } catch {
    return [];
  }
}
```

---

### B3 — Category matching is too fuzzy

**File:** `src/lib/api.ts`

**Problem:** Fuzzy `.includes()` fallback caused `"Knit"` to match `"Non-Knit"` and `"Woven"` to match `"Non-Woven"`, showing wrong products on category pages.

**Before**
```ts
return all.filter((p) => {
  const cat = (p.category ?? "").toLowerCase().trim();
  if (cat === needle) return true;
  const catStripped = cat.replace(/\s+/g, "");
  const needleStripped = needle.replace(/\s+/g, "");
  return catStripped.includes(needleStripped) || needleStripped.includes(catStripped);
});
```

**After**
```ts
return all.filter((p) => (p.category ?? "").toLowerCase().trim() === needle);
```

---

### B4 — FAQ endpoint fetched twice

**File:** `src/lib/api.ts`

**Problem:** `getWebsiteFAQCategories()` and `getWebsiteFAQ()` each independently called `fetch(…/api/websitefaq)`.

**Before**
```ts
export async function getWebsiteFAQCategories() {
  const res = await fetch(`${BASE_URL}/api/websitefaq`); // request 1
  ...
}
export async function getWebsiteFAQ() {
  const res = await fetch(`${BASE_URL}/api/websitefaq`); // request 2 — duplicate
  ...
}
```

**After**
```ts
let _faqCache: Promise<Array<Record<string, string>>> | null = null;
function fetchFaqData(): Promise<Array<Record<string, string>>> {
  if (!_faqCache) {
    _faqCache = fetch(`${BASE_URL}/api/websitefaq`)
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j) => (j.data ?? []) as Array<Record<string, string>>)
      .catch(() => []);
  }
  return _faqCache;
}
export async function getWebsiteFAQCategories() {
  const records = await fetchFaqData(); // shared
  ...
}
export async function getWebsiteFAQ() {
  const records = await fetchFaqData(); // shared
  ...
}
```

---

### B5 — Suitability parser breaks on malformed API data

**File:** `src/data/products.ts`

**Problem:** `parts[1]` was `undefined` when the API returned only one pipe-segment, producing names like `"Menswear undefined"`.

**Before**
```ts
function parseSuitability(raw: string[]) {
  return raw.map((s) => {
    const parts = s.split("|").map((p) => p.trim());
    const score = parseInt(parts[2] ?? "0", 10);
    return {
      name: `${parts[0]} ${parts[1]}`,  // "Menswear undefined" when parts[1] missing
      score: isNaN(score) ? 0 : score,
      desc: `Suitable for ${parts[0]} ${parts[1]}`,
    };
  });
}
```

**After**
```ts
function parseSuitability(raw: string[]) {
  return raw
    .map((s) => {
      const parts = s.split("|").map((p) => p.trim());
      const category = parts[0] ?? "";
      const type = parts[1] ?? "";
      const score = parseInt(parts[2] ?? "0", 10);
      const name = type ? `${category} ${type}` : category;
      return { name, score: isNaN(score) ? 0 : score, desc: `Suitable for ${name}` };
    })
    .filter((item) => item.name.length > 0);
}
```

---

### B6 — `LocalBusinessSchema` makes duplicate API calls

**Files:** `src/layouts/BaseLayout.astro` · `src/components/schema/LocalBusinessSchema.astro`

**Problem:** `BaseLayout` already fetches `getCompanyInfo` and `getSiteSettings`. `LocalBusinessSchema` fetched both again independently.

**Before — LocalBusinessSchema.astro**
```ts
const company = await getCompanyInfo("AGE");      // duplicate
const site    = await getSiteSettings("eCatalogue"); // duplicate
```

**After — BaseLayout.astro**
```astro
<LocalBusinessSchema company={company} site={site} />
```

**After — LocalBusinessSchema.astro**
```ts
interface Props { company: ApiCompanyInfo | null; site: ApiSiteSettings | null; }
const { company, site } = Astro.props; // no fetch — data passed from parent
```

---

## Round 2 — Code Duplication

---

### C1 — Cloudinary URL builder existed in four places

**New file created:** `src/lib/cloudinary.ts`

**Problem:** The same transform-strip-and-rebuild logic was copy-pasted in:
- `src/data/products.ts` — `rebuildCloudinaryUrl`, `getCloudinaryUrl`, `buildCloudinarySrcset`
- `src/pages/index.astro` — local `function buildCloudinaryUrl()`
- `src/pages/fabric/[productSlug].astro` — local `function buildOgImageUrl()` using fragile `.replace()`
- `src/lib/blog.ts` — local `buildCloudinaryUrl` + `cloudinarySrcset`

**Fix:** All logic moved to `src/lib/cloudinary.ts`. All four files now import from there.

`src/lib/cloudinary.ts` exports:
```ts
export function rebuildCloudinaryUrl(url, transforms): string
export function getCloudinaryUrl(url, transforms): string
export function buildCloudinarySrcset(sourceUrl, widths, aspectW, aspectH, crop): string
export function cloudinarySrcset(url, widths, format): string
export function buildOgImageUrl(cloudUrl): string | undefined
```

**Before — `src/pages/index.astro`**
```ts
function buildCloudinaryUrl(url: string, transforms: string): string {
  const uploadIdx = url.indexOf("/upload/");
  // ... 10 lines of duplicated logic
}
```

**After — `src/pages/index.astro`**
```ts
import { rebuildCloudinaryUrl } from "../lib/cloudinary";
// local function removed
```

**Before — `src/pages/fabric/[productSlug].astro`**
```ts
function buildOgImageUrl(cloudUrl) {
  return cloudUrl.replace("/upload/", "/upload/f_jpg,q_auto,w_1200,h_630,c_fill,g_auto/");
  // fragile: doesn't strip existing transforms first
}
```

**After — `src/pages/fabric/[productSlug].astro`**
```ts
import { buildOgImageUrl } from "../../lib/cloudinary";
// local function removed — shared version correctly strips existing transforms
```

**Before — `src/lib/blog.ts`**
```ts
function buildCloudinaryUrl(url, width, format) { /* local copy */ }
export function cloudinarySrcset(url, widths, format) { /* local copy */ }
```

**After — `src/lib/blog.ts`**
```ts
export { cloudinarySrcset } from "./cloudinary"; // re-export from shared source
```

**Before — `src/data/products.ts`**
```ts
export function rebuildCloudinaryUrl(url, transforms) { /* local copy */ }
export function getCloudinaryUrl(url, transforms) { /* local copy */ }
export function buildCloudinarySrcset(sourceUrl, widths, ...) { /* local copy */ }
```

**After — `src/data/products.ts`**
```ts
export { rebuildCloudinaryUrl, getCloudinaryUrl, buildCloudinarySrcset } from "../lib/cloudinary";
// re-exports so existing consumers of data/products don't need import changes
```

---

### C2 — `ApiBlogPost` interface defined twice with different fields

**Files:** `src/lib/api.ts` · `src/lib/blog.ts`

**Problem:** `api.ts` had a thin 9-field `ApiBlogPost`. `blog.ts` had the full 27-field version. Same name, different shapes — type drift guaranteed.

**Before — `src/lib/api.ts`**
```ts
export interface ApiBlogPost {
  id, title, slug, excerpt, category,
  paragraph1, blogimage1CloudURL, altimage1,
  publishedAt, readingTimeMin   // only 10 fields — missing status, isFeatured, tags, etc.
}
export async function getBlogPosts(limit = 20): Promise<ApiBlogPost[]> {
  const res = await fetch(`${BASE_URL}/api/blog?limit=${limit}`);
  ...
}
```

**After — `src/lib/api.ts`**
```ts
// Re-export the canonical full definition from lib/blog — no duplicate interface
export type { ApiBlogPost } from "./blog";
export { fetchBlogPosts as getBlogPosts } from "./blog";
```

The canonical `ApiBlogPost` (27 fields) lives only in `src/lib/blog.ts`. All consumers get the same type.

---

### C3 / C4 / C5 — Hardcoded URLs and repeated constants

**New file created:** `src/lib/constants.ts`

**Problem:** Three constants were scattered and repeated across 8+ files:

| Constant | Was repeated in |
|---|---|
| `"https://www.amrita-fashions.com"` | 7 files |
| `"https://wa.me/+919925155141"` | 2 files |
| `"https://espobackend.vercel.app"` | `api.ts` (env var) + `blog.ts` (hardcoded, no env var) |

**`src/lib/constants.ts`**
```ts
export const SITE_BASE =
  import.meta.env.PUBLIC_SITE_URL ?? "https://www.amrita-fashions.com";

export const API_BASE =
  import.meta.env.API_BASE_URL ?? process.env.API_BASE_URL
  ?? "https://espobackend.vercel.app";

export const WA_FALLBACK   = "https://wa.me/+919925155141";
export const PHONE_FALLBACK = "tel:+919925155141";
```

**Files updated to import from constants:**

`src/lib/api.ts`
```ts
// Before
const BASE_URL = import.meta.env.API_BASE_URL ?? process.env.API_BASE_URL ?? "https://espobackend.vercel.app";
// After
import { API_BASE as BASE_URL } from "./constants";
```

`src/lib/blog.ts`
```ts
// Before
const API_URL = "https://espobackend.vercel.app/api/blog"; // no env var at all
// After
import { API_BASE } from "./constants";
const API_URL = `${API_BASE}/api/blog`;
```

`src/data/products.ts`
```ts
// Before
const waNumber  = buildWaLink(whatsappNumber, "https://wa.me/+919925155141");
const phoneHref = buildPhoneHref(phone1, "tel:+919925155141");
// After
import { WA_FALLBACK, PHONE_FALLBACK } from "../lib/constants";
const waNumber  = buildWaLink(whatsappNumber, WA_FALLBACK);
const phoneHref = buildPhoneHref(phone1, PHONE_FALLBACK);
```

`src/pages/sitemap.astro`
```ts
// Before
const whatsappHref = buildWaLink(company?.whatsappNumber, "https://wa.me/+919925155141");
// After
import { WA_FALLBACK } from "../lib/constants";
const whatsappHref = buildWaLink(company?.whatsappNumber, WA_FALLBACK);
```

`src/layouts/BaseLayout.astro`, `src/components/schema/LocalBusinessSchema.astro`,
`src/pages/fabric/[productSlug].astro`, `src/pages/fabric/index.astro`,
`src/pages/blog/[slug].astro`, `src/pages/blog/index.astro`,
`src/pages/collection/[collectionSlug]/[productSlug].astro`
```ts
// Before (in each file)
const siteBase = import.meta.env.PUBLIC_SITE_URL ?? "https://www.amrita-fashions.com";
// After (in each file)
import { SITE_BASE } from "...lib/constants";
const siteBase = SITE_BASE;
```

---

## How to verify everything is working

**1. Type-check — run in terminal:**
```bash
npx astro check
```
Should report zero errors.

**2. Build — run in terminal:**
```bash
npm run build
```
Should complete with no errors. Check the output for any missing pages.

**3. Dev server — run in terminal:**
```bash
npm run dev
```
Then check these pages manually:

| Page | What to verify |
|---|---|
| `/` | Hero image loads correctly (Cloudinary LCP preload) |
| `/fabric` | Products grid loads, filters work |
| `/fabric/[any-product-slug]` | Product detail page loads, OG image correct in `<head>` |
| `/category/[any-category]` | Only products from that exact category appear (B3 fix) |
| `/blog` | Blog grid loads |
| `/blog/[any-slug]` | Blog post loads with images |
| `/sitemap` | WhatsApp link works |

**4. Check for duplicate API calls (B4, B6):**
Open DevTools → Network tab → filter by `websitefaq` and `companyinformation`. Each should appear only once per page load.

**5. Check Cloudinary images (C1):**
On any product page, inspect an `<img>` src — it should contain proper Cloudinary transforms like `f_auto,q_auto,c_fill` with no doubled `/upload/upload/` or raw untransformed URLs.

**6. Check category pages (B3):**
Visit `/category/knit` — verify no "Non-Knit" products appear.
Visit `/category/woven` — verify no "Non-Woven" products appear.

---

## C3 (continued) — EspoCRM Lead Capture URL hardcoded in 5 files

**New file created:** `src/config/endpoints.ts`

**Problem:** The same EspoCRM lead capture URL appeared hardcoded in 5 separate `<script>` blocks. A CRM migration would require finding and updating all 5 manually — and one would inevitably be missed.

| File | Hardcoded value |
|---|---|
| `src/layouts/Footer.astro` | `…/LeadCapture/a4624c9bb58b8b755e3d94f1a25fc9be` |
| `src/components/blog/BlogNewsletter.astro` | same |
| `src/components/support/SupportContactForm.astro` | same + `https://espo.egport.com/api/v1` |
| `src/components/product/ProductInquiryModal.astro` | same |
| `src/components/careers/CareersForm.astro` | `…/LeadCapture/517205fe58db736ea2438667b84df4d0` + `/Attachment` |

**`src/config/endpoints.ts`**
```ts
export const ESPO_BASE               = "https://espo.egport.com/api/v1";
export const LEAD_CAPTURE_URL        = `${ESPO_BASE}/LeadCapture/a4624c9bb58b8b755e3d94f1a25fc9be`;
export const CAREERS_LEAD_CAPTURE_URL = `${ESPO_BASE}/LeadCapture/517205fe58db736ea2438667b84df4d0`;
export const ATTACHMENT_UPLOAD_URL   = `${ESPO_BASE}/Attachment`;
```

**Pattern used in each file** — import in frontmatter, inject via `define:vars`:

```astro
---
import { LEAD_CAPTURE_URL } from "../../config/endpoints";
---
<script define:vars={{ LEAD_CAPTURE_URL }}>
  // LEAD_CAPTURE_URL is now available as a build-time injected constant
  const ESPO_URL = LEAD_CAPTURE_URL;
  ...
</script>
```

**CareersForm** uses its own distinct endpoint:
```astro
---
import { CAREERS_LEAD_CAPTURE_URL, ATTACHMENT_UPLOAD_URL } from "../../config/endpoints";
---
<script define:vars={{ CAREERS_LEAD_CAPTURE_URL, ATTACHMENT_UPLOAD_URL }}>
  const ENDPOINT   = CAREERS_LEAD_CAPTURE_URL;
  const UPLOAD_URL = ATTACHMENT_UPLOAD_URL;
  ...
</script>
```

**To verify:** Run `npm run build` and check that all 5 forms still submit correctly. The URL value is injected at build time so runtime behaviour is identical — only the source of truth has changed.

---

## Round 3 — Performance (D-series)

---

### D1 — Small page-size fetching hurts performance

Already resolved as **B1** in Round 1. `getAllProducts()` now uses `limit=500`, reducing a 200-product catalogue from 10 requests down to 1.

---

### D2 — No cache strategy in fetch calls

**Files:** `src/lib/api.ts` · `src/lib/blog.ts`

**Problem:** Every `fetch()` call had no `cache` option. During SSG builds, if the same URL is requested more than once (e.g. `getAllProducts` called from multiple pages in the same build), Node's fetch would hit the network each time. This is safe but wasteful, and becomes risky if these functions are ever reused in SSR — every request would hit the live backend with no caching at all.

**Fix:** Added `{ cache: "force-cache" }` to every `fetch()` call. For SSG this deduplicates identical requests within a build run. For SSR it would serve from cache on repeated hits.

**Before — `src/lib/api.ts`**
```ts
const res = await fetch(`${BASE_URL}/api/product?page=${page}&limit=${limit}`);
const res = await fetch(`${BASE_URL}/api/product/fieldname/${field}`);
const res = await fetch(`${BASE_URL}/api/topicpage?page=1&limit=20`);
const res = await fetch(`${BASE_URL}/api/product?merchtag=...`);
_faqCache = fetch(`${BASE_URL}/api/websitefaq`)...
const res = await fetch(`${BASE_URL}/api/sitesettings`);
const res = await fetch(`${BASE_URL}/api/companyinformation`);
const res = await fetch(`${BASE_URL}/api/author`);
```

**After — `src/lib/api.ts`**
```ts
const res = await fetch(`${BASE_URL}/api/product?page=${page}&limit=${limit}`, { cache: "force-cache" });
const res = await fetch(`${BASE_URL}/api/product/fieldname/${field}`, { cache: "force-cache" });
const res = await fetch(`${BASE_URL}/api/topicpage?page=1&limit=20`, { cache: "force-cache" });
const res = await fetch(`${BASE_URL}/api/product?merchtag=...`, { cache: "force-cache" });
_faqCache = fetch(`${BASE_URL}/api/websitefaq`, { cache: "force-cache" })...
const res = await fetch(`${BASE_URL}/api/sitesettings`, { cache: "force-cache" });
const res = await fetch(`${BASE_URL}/api/companyinformation`, { cache: "force-cache" });
const res = await fetch(`${BASE_URL}/api/author`, { cache: "force-cache" });
```

**Before — `src/lib/blog.ts`**
```ts
const res = await fetch(API_URL);
```

**After — `src/lib/blog.ts`**
```ts
const res = await fetch(API_URL, { cache: "force-cache" });
```

---

### D3 — `getProductBySlug` downloads the full catalogue

**File:** `src/lib/api.ts`

**Problem:** To find one product by slug, the function called `getAllProducts()` internally — fetching and deserialising the entire catalogue just to `.find()` one entry. Acceptable as a temporary workaround but wrong as a permanent pattern.

The backend has no `/api/product/:slug` endpoint, so a direct single-product fetch isn't possible. The correct fix is to make the function accept an already-fetched array and filter in memory — zero extra network requests.

**Before**
```ts
export async function getProductBySlug(slug: string): Promise<ApiProduct | undefined> {
  const all = await getAllProducts();
  return all.find((p) => p.productslug === slug);
}
```

**After**
```ts
// D3 FIX: no longer downloads the full catalogue to find one product.
// Pass the already-fetched products array (from getAllProducts / fetchProducts)
// and filter in memory — zero extra network requests.
export function getProductBySlug(slug: string, products: ApiProduct[]): ApiProduct | undefined {
  return products.find((p) => p.productslug === slug);
}
```

Callers that already have the full product list (e.g. `getStaticPaths` in product detail pages) pass their array directly. No page was calling the old async version — they all used `fetchProducts()` — so this is a non-breaking refactor that also removes the footgun for future callers.

---

### D4 — Duplicate schema fetches

Already resolved as **B6** in Round 1. `LocalBusinessSchema` now receives `company` and `site` as props from `BaseLayout` instead of fetching them independently.

---

## Round 4 — Dead Dependencies & Unused Code (E-series)

---

### E1 — Unused npm packages

**Files:** `package.json`

**Problem:** Five packages were listed as dependencies but never imported anywhere in the source:

| Package | Why installed (originally) | Actual usage |
|---|---|---|
| `swiper` | Planned carousel component | Never used |
| `jspdf` | Planned PDF export feature | Never used |
| `astro-seo` | Optional SEO meta helper | Never used — `SeoHead.astro` handles all meta manually |
| `@astrojs/sitemap` | Sitemap generation integration | Not registered in `astro.config.ts` — custom `sitemap.xml.ts` used instead |
| `@astrojs/rss` | RSS feed integration | Not registered in `astro.config.ts` — no RSS feed page exists |

**Fix:** Uninstalled all five packages.

```bash
npm uninstall swiper jspdf astro-seo @astrojs/sitemap @astrojs/rss
```

---

### E2 — Unused font packages

**Files:** `package.json`

**Problem:** Six `@fontsource` packages were installed as dependencies, but fonts are self-hosted from `/public/fonts/` via `@font-face` declarations in `BaseLayout.astro`. The npm packages were never imported anywhere.

| Removed package |
|---|
| `@fontsource-variable/inter` |
| `@fontsource-variable/manrope` |
| `@fontsource-variable/newsreader` |
| `@fontsource/inter` |
| `@fontsource/manrope` |
| `@fontsource/newsreader` |

**Fix:** Uninstalled all six packages.

```bash
npm uninstall @fontsource-variable/inter @fontsource-variable/manrope @fontsource-variable/newsreader @fontsource/inter @fontsource/manrope @fontsource/newsreader
```

Self-hosted fonts in `BaseLayout.astro` are unaffected — they load from `/public/fonts/*.woff2` directly.

---

### E3 / E5 — Unused and duplicate components

**Problem:** The entire `src/components/trust/` folder was unused — no page or layout imported from it. It also contained a `SupportChannels.astro` that duplicated the real one at `src/components/support/SupportChannels.astro`, creating developer confusion about which was canonical.

Additionally, `src/components/Welcome.astro` was an Astro scaffold leftover with no imports.

**Deleted files:**
- `src/components/trust/AboutIntro.astro`
- `src/components/trust/CertificationsList.astro`
- `src/components/trust/ExportCapabilities.astro`
- `src/components/trust/ManufacturingStrengths.astro`
- `src/components/trust/MissionVision.astro`
- `src/components/trust/ShippingInfo.astro`
- `src/components/trust/SupportChannels.astro` ← duplicate of `support/SupportChannels.astro`
- `src/components/Welcome.astro` ← scaffold leftover

The canonical `SupportChannels` remains at `src/components/support/SupportChannels.astro` and is correctly imported by `src/pages/support.astro`.

---

### E4 — Empty `cloudinary.ts` utility file

Already resolved as **C1** in Round 2. `src/lib/cloudinary.ts` is fully implemented with `rebuildCloudinaryUrl`, `getCloudinaryUrl`, `buildCloudinarySrcset`, `cloudinarySrcset`, and `buildOgImageUrl`. All four previous duplicate implementations were removed and now import from this file.

---

### E6 — Blog API URL hardcoded

Already resolved as **C3/C5** in Round 2. `src/lib/blog.ts` now imports `API_BASE` from `src/lib/constants.ts` and constructs the URL as `` `${API_BASE}/api/blog` ``. No hardcoded backend URL remains.

---

## Round 5 — SEO & Performance Hints (F-series)

---

### F2 — Canonical/base URL logic repeated across pages

**Files:** `src/pages/fabric/index.astro` · `src/pages/fabric/[productSlug].astro` · `src/pages/blog/index.astro` · `src/pages/blog/[slug].astro` · `src/pages/collection/[collectionSlug]/[productSlug].astro`

**Problem:** Every page that needed an absolute URL (for JSON-LD schemas or canonical tags) declared a local alias `const siteBase = SITE_BASE` before using it. This is pure noise — `SITE_BASE` is already imported from `src/lib/constants.ts` and can be used directly. The alias adds a line of code with no benefit and increases the chance of a future developer introducing a different local override that drifts from the constant.

**Before (pattern repeated in 5 files)**
```ts
import { SITE_BASE } from "../../lib/constants";
// ...
const siteBase = SITE_BASE;          // pointless alias
const canonicalUrl = `${siteBase}/fabric/${product.slug}`;
// ...
url: `${siteBase}/blog`,
```

**After (all 5 files)**
```ts
import { SITE_BASE } from "../../lib/constants";
// ...
// F2 FIX: use SITE_BASE directly — no local alias needed
const canonicalUrl = `${SITE_BASE}/fabric/${product.slug}`;
// ...
url: `${SITE_BASE}/blog`,
```

All five `const siteBase = SITE_BASE` declarations removed. Every reference updated to use `SITE_BASE` directly.

---

### F3 — Redundant DNS-prefetch hints for Clarity

**File:** `vercel.json`

**Problem:** The `vercel.json` headers config sent `Link: rel=dns-prefetch` hints for four `clarity.ms` subdomains on every page response. DNS-prefetch is only useful when the browser will make a real network connection to that host from the main thread. Since Clarity runs inside a Partytown web worker, it never triggers a main-thread DNS lookup — the hints are sent on every request but never acted on, adding unnecessary response header weight.

**Before**
```json
{
  "source": "/(.*)",
  "headers": [
    {
      "key": "Link",
      "value": "<//www.clarity.ms>; rel=dns-prefetch, <//a.clarity.ms>; rel=dns-prefetch, <//b.clarity.ms>; rel=dns-prefetch, <//c.clarity.ms>; rel=dns-prefetch"
    }
  ]
}
```

**After**

The entire `/(.*) → Link` header block removed. The font and `/_astro/` cache headers are unaffected.
