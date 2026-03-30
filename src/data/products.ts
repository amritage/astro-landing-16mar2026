import { getProducts, getAllProducts, type ApiProduct } from "../lib/api";

// ── Type used by all product components ───────────────────────────────────────

export interface Product {
  id: string;
  slug: string;
  seriesLabel: string;
  name: string;
  shortDesc: string;
  image: string;
  imageLarge: string;   // full-size for OG sharing
  imageAlt: string;
  rating: number;
  ratingCount: number;
  category: string;
  categorySlug: string;
  supplyStatus: string;
  whatsapp: string;
  phone: string;
  specs: {
    material: string;
    weight: string;
    width: string;
    weave: string;
  };
  techSpecs: { label: string; value: string }[];
  longDescription: string;
  applications: { name: string; score: number; desc: string }[];
  certifications: { icon: string; title: string; desc: string }[];
  regionalCities: string[];
  industries: string[];
  faq: { q: string; a: string }[];
  related: { name: string; slug: string; gsm: string; weave: string }[];
  // media
  image1: string;
  image2: string | null;
  image3: string | null;
  imageAlt2: string | null;
  imageAlt3: string | null;
  videoURL: string | null;
  collectionImage: string | null;
  collectionImageAlt: string | null;
  collectionVideoURL: string | null;
  // extras from API
  hex: string[];
  colorNames: string[];
  structure: string;
  content: string;
  gsm: number;
  ozs: number;
  cm: number;
  inch: number;
  design: string;
  motif: string | null;
  finish: string[];
  keywords: string[];
  merchTags: string[];
  collectionId: string;
  collectionName: string;
  collectionDescription: string;
}

// ── Map API shape → Product ────────────────────────────────────────────────────

function parseSuitability(raw: string[]): { name: string; score: number; desc: string }[] {
  return raw.map((s) => {
    // format: "Menswear | Shirt | 85%"
    const parts = s.split("|").map((p) => p.trim());
    const score = parseInt(parts[2] ?? "0", 10);
    return {
      name: `${parts[0]} ${parts[1]}`,
      score: isNaN(score) ? 0 : score,
      desc: `Suitable for ${parts[0]} ${parts[1]}`,
    };
  });
}

function buildFaq(p: ApiProduct): { q: string; a: string }[] {
  const pairs = [
    [p.productQ1, p.productA1],
    [p.productQ2, p.productA2],
    [p.productQ3, p.productA3],
    [p.productQ4, p.productA4],
    [p.productQ5, p.productA5],
    [p.productQ6, p.productA6],
  ];
  return pairs
    .filter(([q, a]) => q && a)
    .map(([q, a]) => ({ q: q!, a: a! }));
}

/** Strip HTML tags and return plain text, or null if nothing meaningful remains */
function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  const plain = html.replace(/<[^>]*>/g, "").trim();
  return plain;
}

function buildCertifications(finish: string[]) {
  const iconMap: Record<string, string> = {
    "Chemical - Bio Finish": "eco",
    "Chemical - Mercerized": "workspace_premium",
    "Chemical - Silicon": "shield_with_heart",
  };
  return finish.map((f) => ({
    icon: iconMap[f] ?? "verified",
    title: f,
    desc: f,
  }));
}

/** Returns null only if the URL is truly empty/null (keeps fallback images) */
function nullIfEmpty(url: string | null | undefined): string | null {
  return url || null;
}

/** Returns null if the URL is a secondary slot fallback (not the primary image) */
function sanitizeSecondaryImage(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/ProductFallBack/i.test(url)) return null;
  return url;
}

export function mapApiProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    slug: p.productslug,
    seriesLabel: p.collectionName,
    name: p.productTitle ?? p.name,
    shortDesc: stripHtml(p.shortProductDescription) || p.productTagline || "",
    image: nullIfEmpty(p.image1CloudUrlCard) ?? nullIfEmpty(p.image1CloudUrlWeb) ?? nullIfEmpty(p.image1CloudUrl) ?? "",
    imageLarge: nullIfEmpty(p.image1CloudUrlHero) ?? nullIfEmpty(p.image1CloudUrl) ?? nullIfEmpty(p.image1CloudUrlWeb) ?? "",
    imageAlt: p.altTextImage1 ?? p.name,
    rating: p.ratingValue,
    ratingCount: p.ratingCount,
    category: p.category,
    categorySlug: p.category.toLowerCase().replace(/\s+/g, "-"),
    supplyStatus: p.supplyModel,
    whatsapp: "https://wa.me/919925155141",
    phone: "tel:+919925155141",
    specs: {
      material: p.content.join(", "),
      weight: `${Math.round(p.gsm)} GSM`,
      width: `${p.cm} cm / ${p.inch} inch`,
      weave: p.structure,
    },
    techSpecs: [
      { label: "Fabric Code", value: p.fabricCode },
      { label: "Vendor Code", value: p.vendorFabricCode },
      { label: "GSM", value: String(Math.round(p.gsm)) },
      { label: "Ozs", value: String(Math.round(p.ozs * 100) / 100) },
      { label: "Width (CM)", value: `${p.cm} cm` },
      { label: "Width (Inch)", value: `${p.inch}"` },
      { label: "Sales MOQ", value: `${p.salesMOQ} ${p.uM}` },
      { label: "Design", value: p.design },
      { label: "Color", value: p.color.join(", ") },
    ],
    longDescription: p.fullProductDescription ?? p.collection?.description ?? "",
    applications: parseSuitability(p.suitability),
    certifications: buildCertifications(p.finish),
    regionalCities: [],
    industries: [],
    faq: buildFaq(p),
    related: [],
    hex: p.hex ?? [],
    colorNames: p.color ?? [],
    structure: p.structure,
    content: p.content.join(", "),
    gsm: p.gsm,
    ozs: p.ozs,
    cm: p.cm,
    inch: p.inch,
    design: p.design,
    motif: p.motif ?? null,
    finish: p.finish,
    keywords: p.keywords,
    merchTags: p.merchTags,
    collectionId: p.collectionId,
    collectionName: p.collectionName,
    collectionDescription: p.collection?.description ?? "",
    image1: nullIfEmpty(p.image1CloudUrlHero) ?? nullIfEmpty(p.image1CloudUrlWeb) ?? nullIfEmpty(p.image1CloudUrlCard) ?? nullIfEmpty(p.image1CloudUrl) ?? "",
    image2: sanitizeSecondaryImage(p.image2CloudUrl),
    image3: sanitizeSecondaryImage(p.image3CloudUrl),
    imageAlt2: p.altTextImage2 ?? null,
    imageAlt3: p.altTextImage3 ?? null,
    videoURL: p.videoURL ?? null,
    collectionImage: nullIfEmpty(p.collection?.collectionImage1CloudUrlBase)
      ?? nullIfEmpty(p.collection?.collectionImage1CloudUrl)
      ?? nullIfEmpty(p.collection?.collectionImage1CloudUrlWeb)
      ?? null,
    collectionImageAlt: p.collection?.altTextCollectionImage1 ?? null,
    collectionVideoURL: p.collection?.collectionvideoURL ?? null,
  };
}

// ── Exported data (called at build time) ──────────────────────────────────────

/** Returns true if the product has a valid, published slug */
function hasValidSlug(p: ApiProduct): boolean {
  const slug = (p.productslug ?? "").trim().toLowerCase();
  return slug.length > 0 && slug !== "pending";
}

export async function fetchProducts(): Promise<Product[]> {
  const raw = await getAllProducts();
  return raw.filter(hasValidSlug).map(mapApiProduct);
}

export async function fetchProductsPage(page: number): Promise<{ products: Product[]; total: number; totalPages: number; currentPage: number }> {
  const result = await getProducts(page, 20);
  return {
    products: result.data.filter(hasValidSlug).map(mapApiProduct),
    total: result.total,
    totalPages: result.totalPages,
    currentPage: result.page,
  };
}
