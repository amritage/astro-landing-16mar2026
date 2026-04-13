// C3 FIX: single source of truth — no more hardcoded URL here
import { API_BASE as BASE_URL } from "./constants";

// ── Raw API shape ──────────────────────────────────────────────────────────────

export interface ApiProduct {
  id: string;
  name: string;
  productslug: string;
  productTitle: string;
  productTagline: string;
  shortProductDescription: string | null;
  fullProductDescription: string | null;
  category: string;
  structure: string;
  content: string[];
  design: string;
  motif: string | null;
  finish: string[];
  color: string[];
  hex: string[];
  gsm: number;
  ozs: number;
  cm: number;
  inch: number;
  salesMOQ: number;
  uM: string;
  supplyModel: string;
  fabricCode: string;
  vendorFabricCode: string;
  ratingValue: number;
  ratingCount: number;
  suitability: string[];
  aiTempOutput: string | null;
  keywords: string[];
  image1CloudUrl: string | null;
  image1CloudUrlWeb: string | null;
  image1CloudUrlCard: string | null;
  image1CloudUrlHero: string | null;
  image2CloudUrl: string | null;
  image3CloudUrl: string | null;
  altTextImage1: string | null;
  altTextImage2: string | null;
  altTextImage3: string | null;
  videoURL: string | null;
  altTextVideo: string | null;
  merchTags: string[];
  productQ1: string | null;
  productQ2: string | null;
  productQ3: string | null;
  productQ4: string | null;
  productQ5: string | null;
  productQ6: string | null;
  productA1: string | null;
  productA2: string | null;
  productA3: string | null;
  productA4: string | null;
  productA5: string | null;
  productA6: string | null;
  collectionId: string;
  collectionName: string;
  collection: {
    id: string;
    name: string;
    description: string;
    collectionImage1CloudUrl: string | null;
    collectionImage1CloudUrlBase: string | null;
    collectionImage1CloudUrlWeb: string | null;
    collectionImage1CloudUrlCard: string | null;
    collectionImage1CloudUrlHero: string | null;
    collectionImage1CloudUrlLarge: string | null;
    altTextCollectionImage1: string | null;
    collectionvideoURL: string | null;
    collectionaltTextVideo: string | null;
  };
}

interface ApiResponse {
  success: boolean;
  data: ApiProduct[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductsPage {
  data: ApiProduct[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

// ── Fetch helpers ──────────────────────────────────────────────────────────────

export async function getProducts(page = 1, limit = 20): Promise<ProductsPage> {
  // D2 FIX: force-cache avoids redundant network hits when the same URL is
  // requested multiple times during a single SSG build run.
  const res = await fetch(`${BASE_URL}/api/product?page=${page}&limit=${limit}`, { cache: "force-cache" });
  if (!res.ok) return { data: [], total: 0, page, totalPages: 0, limit };
  const json: ApiResponse = await res.json();
  return {
    data: json.data,
    total: json.total,
    page: json.pagination.page,
    totalPages: json.pagination.totalPages,
    limit: json.pagination.limit,
  };
}

export async function getAllProducts(): Promise<ApiProduct[]> {
  // B1 FIX: use large page size to minimise round-trips (ideally one request)
  const first = await getProducts(1, 500);
  if (first.totalPages <= 1) return first.data;
  const rest = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, i) => getProducts(i + 2, 500))
  );
  return [first.data, ...rest.map((p) => p.data)].flat();
}

export interface FilterValues {
  category: string[];
  color: { name: string; hex: string }[];
  structure: string[];
  content: string[];
  design: string[];
  finish: string[];
}

async function fetchField(field: string): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/api/product/fieldname/${field}`, { cache: "force-cache" });
  if (!res.ok) return [];
  const json = await res.json();
  return json.values ?? [];
}

export async function getFilterValues(): Promise<FilterValues> {
  // Fetch field lists + all products in parallel to build color→hex map
  const [category, colorNames, structure, content, design, finish, allProducts] = await Promise.all([
    fetchField("category"),
    fetchField("color"),
    fetchField("structure"),
    fetchField("content"),
    fetchField("design"),
    fetchField("finish"),
    getAllProducts(),
  ]);

  // Build color name → hex from product data (color[] and hex[] are parallel arrays)
  const colorHexMap = new Map<string, string>();
  for (const p of allProducts) {
    if (!p.color || !p.hex) continue;
    p.color.forEach((name, i) => {
      if (name && p.hex[i] && !colorHexMap.has(name)) {
        colorHexMap.set(name, p.hex[i]);
      }
    });
  }

  const color = colorNames.map((name) => ({
    name,
    hex: colorHexMap.get(name) ?? "#cccccc",
  }));

  return { category, color, structure, content, design, finish };
}

// D3 FIX: no longer downloads the full catalogue to find one product.
// Pass the already-fetched products array (from getAllProducts / fetchProducts)
// and filter in memory — zero extra network requests.
export function getProductBySlug(slug: string, products: ApiProduct[]): ApiProduct | undefined {
  return products.find((p) => p.productslug === slug);
}

// ── Topic Pages ────────────────────────────────────────────────────────────────

export interface ApiTopicPage {
  id: string;
  name: string;
  slug: string;
  slug1: string;
  description: string | null;
  metaTitle: string | null;
  keywords: string[] | null;
  canonicalUrl: string | null;
  excerpt: string | null;
  ogType: string | null;
  pageType: string;
  deleted: boolean;
  // Image 1
  image1CloudUrl: string | null;
  image1CloudUrlBase?: string | null;
  image1CloudUrlWeb?: string | null;
  image1CloudUrlCard?: string | null;
  image1CloudUrlHero?: string | null;
  image1CloudUrlLarge?: string | null;
  altTextImage1?: string | null;
  // Image 2
  image2CloudUrl: string | null;
  image2CloudUrlBase?: string | null;
  image2CloudUrlWeb?: string | null;
  image2CloudUrlCard?: string | null;
  image2CloudUrlHero?: string | null;
  image2CloudUrlLarge?: string | null;
  altTextImage2?: string | null;
  // Image 3
  image3CloudUrl: string | null;
  image3CloudUrlBase?: string | null;
  image3CloudUrlWeb?: string | null;
  image3CloudUrlCard?: string | null;
  image3CloudUrlHero?: string | null;
  image3CloudUrlLarge?: string | null;
  altTextImage3?: string | null;
  // Image 4
  image4CloudUrl: string | null;
  image4CloudUrlBase?: string | null;
  image4CloudUrlWeb?: string | null;
  image4CloudUrlCard?: string | null;
  image4CloudUrlHero?: string | null;
  image4CloudUrlLarge?: string | null;
  altTextImage4?: string | null;
  p1: string | null;
  p2: string | null;
  q1: string | null;
  q2: string | null;
  q3: string | null;
  q4: string | null;
  q5: string | null;
  a1: string | null;
  a2: string | null;
  a3: string | null;
  a4: string | null;
  a5: string | null;
}

// B2 FIX: fetch remaining topic pages in parallel instead of sequentially
async function getAllTopicPages(): Promise<ApiTopicPage[]> {
  try {
    const firstRes = await fetch(`${BASE_URL}/api/topicpage?page=1&limit=20`, { cache: "force-cache" });
    if (!firstRes.ok) return [];
    const firstJson = await firstRes.json();
    const firstData: ApiTopicPage[] = firstJson.data ?? [];
    const totalPages: number = firstJson.pagination?.totalPages ?? 1;
    if (totalPages <= 1) return firstData;
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        fetch(`${BASE_URL}/api/topicpage?page=${i + 2}&limit=20`, { cache: "force-cache" })
          .then((r) => (r.ok ? r.json() : { data: [] }))
          .then((j) => (j.data ?? []) as ApiTopicPage[])
      )
    );
    return [...firstData, ...rest.flat()];
  } catch {
    return [];
  }
}

export async function getDynamicTopicPages(): Promise<ApiTopicPage[]> {
  const data = await getAllTopicPages();
  return data.filter((p) => p.pageType === "Dynamic" && !p.deleted);
}

export async function getCategoryTopicPages(): Promise<ApiTopicPage[]> {
  const data = await getAllTopicPages();
  return data.filter((p) => p.pageType === "Category" && !p.deleted);
}

export async function getCategoryTopicPageBySlug(slug: string): Promise<ApiTopicPage | undefined> {
  const pages = await getCategoryTopicPages();
  return pages.find((p) => p.slug === slug);
}

export async function getTopicPageBySlug(slug: string): Promise<ApiTopicPage | undefined> {
  const data = await getAllTopicPages();
  return data.find((p) => p.slug === slug && !p.deleted);
}

export async function getProductsByCategory(categoryName: string): Promise<ApiProduct[]> {
  // The backend ?category= filter is unreliable (returns all products).
  // Always fetch all and filter client-side.
  const all = await getAllProducts();
  const needle = categoryName.toLowerCase().trim();
  // B3 FIX: exact match only — fuzzy contains-check caused "Knit" to match "Non-Knit",
  // "Woven" to match "Non-Woven", etc., corrupting category pages.
  return all.filter((p) => (p.category ?? "").toLowerCase().trim() === needle);
}

export async function getProductsByMerchTag(tag: string, limit = 4): Promise<ApiProduct[]> {
  const res = await fetch(`${BASE_URL}/api/product?merchtag=${encodeURIComponent(tag)}&limit=100`, { cache: "force-cache" });
  if (!res.ok) return [];
  const json: ApiResponse = await res.json();
  const exact = (json.data ?? []).filter((p) => p.merchTags?.includes(tag));
  return limit > 0 ? exact.slice(0, limit) : exact;
}

// ── Website FAQ ────────────────────────────────────────────────────────────────

export interface WebsiteFaqItem {
  question: string;
  answer: string;
}

export interface WebsiteFaqCategory {
  id: string;
  label: string;
  icon: string;
  faqs: WebsiteFaqItem[];
}

const FAQ_ICON_MAP: Record<string, string> = {
  sourcing: "category",
  manufacturing: "precision_manufacturing",
  logistics: "local_shipping",
  "pricing/moq": "payments",
  common: "help_center",
};

function nameToId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// B4 FIX: single shared fetch so both getWebsiteFAQCategories and getWebsiteFAQ
// reuse the same response instead of each hitting the endpoint independently.
let _faqCache: Promise<Array<Record<string, string>>> | null = null;
function fetchFaqData(): Promise<Array<Record<string, string>>> {
  if (!_faqCache) {
    _faqCache = fetch(`${BASE_URL}/api/websitefaq`, { cache: "force-cache" })
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j) => (j.data ?? []) as Array<Record<string, string>>)
      .catch(() => []);
  }
  return _faqCache;
}

export async function getWebsiteFAQCategories(): Promise<WebsiteFaqCategory[]> {
  try {
    const records = await fetchFaqData();
    return records
      .filter((r) => !r.deleted)
      .map((r) => {
        const id = nameToId(r.name);
        const icon = FAQ_ICON_MAP[r.name.toLowerCase()] ?? "help_outline";
        const faqs: WebsiteFaqItem[] = [];
        for (let i = 1; i <= 4; i++) {
          const q = r[`question${i}`];
          const a = r[`answer${i}`];
          if (q && a) faqs.push({ question: q, answer: a });
        }
        return { id, label: r.name, icon, faqs };
      })
      .filter((cat) => cat.faqs.length > 0);
  } catch {
    return [];
  }
}

export async function getWebsiteFAQ(): Promise<WebsiteFaqItem[]> {
  try {
    const records = await fetchFaqData();
    const record = records[0];
    if (!record) return [];
    const items: WebsiteFaqItem[] = [];
    for (let i = 1; i <= 4; i++) {
      const q = record[`question${i}`];
      const a = record[`answer${i}`];
      if (q && a) items.push({ question: q, answer: a });
    }
    return items;
  } catch {
    return [];
  }
}

// ── Blog Posts ─────────────────────────────────────────────────────────────────
// C2 FIX: ApiBlogPost was defined here (9 fields) AND in src/lib/blog.ts (27 fields).
// The canonical full definition lives in lib/blog.ts — re-export from there.
export type { ApiBlogPost } from "./blog";
export { fetchBlogPosts as getBlogPosts } from "./blog";

// ── Site Settings ─────────────────────────────────────────────────────────────

export interface ApiSiteSettings {
  id: string;
  name: string;
  siteKey: string;
  baseUrl: string | null;
  gaMeasurementId: string | null;
  gtmId: string | null;
  clarityId: string | null;
  googleVerification: string | null;
  bingVerification: string | null;
  twitterHandle: string | null;
  robotsPolicy: string | null;
  siteStatus: string | null;
  knowsAbout: string[];
}

export async function getSiteSettings(name = "eCatalogue"): Promise<ApiSiteSettings | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/sitesettings`, { cache: "force-cache" });
    if (!res.ok) return null;
    const json = await res.json();
    const data: ApiSiteSettings[] = json.data ?? [];
    return data.find((s) => s.name === name) ?? null;
  } catch {
    return null;
  }
}

// ── Company Information ────────────────────────────────────────────────────────

export interface ApiCompanyInfo {
  id: string;
  name: string;
  legalName: string;
  description: string | null;
  tagline: string | null;
  foundingYear: number | null;
  primaryEmail: string | null;
  phone1: string | null;
  phone2: string | null;
  phone1Dept: string | null;
  phone2Dept: string | null;
  whatsappNumber: string | null;
  salesEmail: string | null;
  supportEmail: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  linkedinUrl: string | null;
  xUrl: string | null;
  pinterestUrl: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  defaultOgImage: string | null;
  addressStreet: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressCountry: string | null;
  addressPostalCode: string | null;
  areaServed: string[];
  recognitions: string[];
  alternateName: string[];
  languages: string[];
  gstin: string | null;
  latitude: number | null;
  longitude: number | null;
  employeeRange: string | null;
}

export async function getCompanyInfo(companyName = "AGE"): Promise<ApiCompanyInfo | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/companyinformation`, { cache: "force-cache" });
    if (!res.ok) return null;
    const json = await res.json();
    const data: ApiCompanyInfo[] = json.data ?? [];
    return data.find((c) => c.name === companyName) ?? data[0] ?? null;
  } catch {
    return null;
  }
}

export interface ApiAuthor {
  id: string;
  name: string;
  description: string | null;
  designation: string | null;
  authorimage: string | null;
  authorimageWeb?: string | null;
  authorimageCard?: string | null;
  altimage: string | null;
  authorLinkedinURL: string | null;
}

/**
 * Build a correct wa.me link from any phone string like "+91-9925155141"
 * Always produces: https://wa.me/+919925155141
 */
export function buildWaLink(number: string | null | undefined, fallback = ""): string {
  if (!number) return fallback;
  const digits = String(number).replace(/[^\d]/g, "");
  return digits ? `https://wa.me/+${digits}` : fallback;
}

/**
 * Build a tel: href from any phone string like "+91-9925155141"
 * Always produces: tel:+919925155141
 */
export function buildPhoneHref(number: string | null | undefined, fallback = ""): string {
  if (!number) return fallback;
  const digits = String(number).replace(/[^\d]/g, "");
  return digits ? `tel:+${digits}` : fallback;
}

export async function getAuthors(): Promise<ApiAuthor[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/author`, { cache: "force-cache" });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []).filter((a: ApiAuthor & { deleted?: boolean }) => !a.deleted);
  } catch {
    return [];
  }
}
