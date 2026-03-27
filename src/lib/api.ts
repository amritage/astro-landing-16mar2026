const BASE_URL =
  import.meta.env.API_BASE_URL ??
  process.env.API_BASE_URL ??
  "https://espobackend.vercel.app";

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
  const res = await fetch(`${BASE_URL}/api/product?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
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
  const first = await getProducts(1, 20);
  if (first.totalPages <= 1) return first.data;
  const rest = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, i) => getProducts(i + 2, 20))
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
  const res = await fetch(`${BASE_URL}/api/product/fieldname/${field}`);
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

export async function getProductBySlug(slug: string): Promise<ApiProduct | undefined> {
  const all = await getAllProducts();
  return all.find((p) => p.productslug === slug);
}

// ── Topic Pages ────────────────────────────────────────────────────────────────

export interface ApiTopicPage {
  id: string;
  name: string;
  slug: string;
  slug1: string;
  description: string | null;
  metaTitle: string | null;
  excerpt: string | null;
  pageType: string;
  deleted: boolean;
  image1CloudUrl: string | null;
  image1CloudUrlWeb?: string | null;
  image1CloudUrlCard?: string | null;
  image1CloudUrlHero?: string | null;
  altTextImage1?: string | null;
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

export async function getDynamicTopicPages(): Promise<ApiTopicPage[]> {
  const res = await fetch(`${BASE_URL}/api/topicpage`);
  if (!res.ok) throw new Error(`Failed to fetch topic pages: ${res.status}`);
  const json = await res.json();
  const data: ApiTopicPage[] = json.data ?? [];
  return data.filter((p) => p.pageType === "Dynamic" && !p.deleted);
}

export async function getCategoryTopicPages(): Promise<ApiTopicPage[]> {
  const res = await fetch(`${BASE_URL}/api/topicpage`);
  if (!res.ok) throw new Error(`Failed to fetch topic pages: ${res.status}`);
  const json = await res.json();
  const data: ApiTopicPage[] = json.data ?? [];
  return data.filter((p) => p.pageType === "Category" && !p.deleted);
}

export async function getCategoryTopicPageBySlug(slug: string): Promise<ApiTopicPage | undefined> {
  const pages = await getCategoryTopicPages();
  return pages.find((p) => p.slug === slug);
}

export async function getProductsByCategory(categoryName: string): Promise<ApiProduct[]> {
  // Try direct API filter first
  const res = await fetch(`${BASE_URL}/api/product?category=${encodeURIComponent(categoryName)}&limit=100`);
  if (!res.ok) return [];
  const json: ApiResponse = await res.json();
  const direct = json.data ?? [];
  if (direct.length > 0) return direct;

  // Fallback: fuzzy match against all products (handles name mismatches like "Knit Fabric" vs "Knit Fabrics")
  const all = await getAllProducts();
  const needle = categoryName.toLowerCase().replace(/\s+/g, "");
  return all.filter((p) => p.category?.toLowerCase().replace(/\s+/g, "").includes(needle));
}

export async function getProductsByMerchTag(tag: string, limit = 4): Promise<ApiProduct[]> {
  const res = await fetch(`${BASE_URL}/api/product?merchtag=${encodeURIComponent(tag)}&limit=100`);
  if (!res.ok) return [];
  const json: ApiResponse = await res.json();
  // API does partial match, so filter client-side for exact tag match
  const exact = (json.data ?? []).filter((p) => p.merchTags?.includes(tag));
  return exact.slice(0, limit);
}
