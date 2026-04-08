import { getProducts, getAllProducts, getCompanyInfo, buildWaLink, buildPhoneHref, type ApiProduct } from "../lib/api";

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
  image1Card: string | null;   // ~400px card size
  image1Web: string | null;    // ~800px web size
  image1Srcset: string;        // ready-to-use srcset string
  image2: string | null;
  image3: string | null;
  imageAlt2: string | null;
  imageAlt3: string | null;
  videoURL: string | null;
  collectionImage: string | null;
  collectionImageSrcset: string; // ready-to-use srcset for collection image
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

/**
 * Inject Cloudinary transforms into any Cloudinary URL, stripping any existing transforms first.
 * Safe to call on non-Cloudinary URLs — returns them unchanged.
 * Example: getCloudinaryUrl(url, "f_auto,q_auto,w_400,c_fill,g_auto")
 */
export function getCloudinaryUrl(url: string | null | undefined, transforms: string): string {
  if (!url || !url.includes("/upload/")) return url ?? "";
  return rebuildCloudinaryUrl(url, transforms);
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
    "Chemical - Silicon": "verified_user",
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

/**
 * Strip any existing Cloudinary transforms from a URL and inject new ones.
 * Works with or without a version segment (v1234...).
 * Handles both comma-separated single segments and any known single-param prefixes.
 */
export function rebuildCloudinaryUrl(
  url: string,
  transforms: string,
): string {
  const uploadIdx = url.indexOf("/upload/");
  if (uploadIdx === -1) return url;

  const base = url.slice(0, uploadIdx + "/upload/".length);
  const rest = url.slice(base.length);

  // Split on "/" but keep version + public ID intact.
  // A transform segment either contains "," or matches a known Cloudinary param prefix.
  // We stop as soon as we hit a version segment (v\d+) or a plain public-ID segment.
  const TRANSFORM_RE = /^[a-z]_/; // any lowercase letter followed by underscore
  const VERSION_RE = /^v\d+$/;

  const segments = rest.split("/");
  let i = 0;
  while (i < segments.length) {
    const seg = segments[i];
    if (VERSION_RE.test(seg)) break;           // version — stop here
    if (seg.includes(",") || TRANSFORM_RE.test(seg)) { i++; continue; } // transform — skip
    break;                                      // public ID — stop
  }

  const publicPart = segments.slice(i).join("/");
  return `${base}${transforms}/${publicPart}`;
}

/**
 * Build a srcset string for a Cloudinary image.
 * @param sourceUrl  Any Cloudinary URL (existing transforms are stripped and replaced)
 * @param widths     Array of pixel widths for the srcset descriptors
 * @param aspectW    Slot aspect ratio width  (e.g. 4 for 4:5)
 * @param aspectH    Slot aspect ratio height (e.g. 5 for 4:5)
 * @param crop       Cloudinary crop mode: "fill" (cards) | "limit" (editorial)
 */
export function buildCloudinarySrcset(
  sourceUrl: string | null | undefined,
  widths: number[],
  aspectW = 1,
  aspectH = 1,
  crop: "fill" | "limit" = "limit",
): string {
  if (!sourceUrl) return "";
  return widths
    .map((w) => {
      const h = Math.round((w * aspectH) / aspectW);
      const t =
        crop === "fill"
          ? `f_auto,q_auto,c_fill,g_auto,w_${w},h_${h}`
          : `f_auto,q_auto,c_limit,w_${w}`;
      return `${rebuildCloudinaryUrl(sourceUrl, t)} ${w}w`;
    })
    .join(", ");
}

/** Build a srcset string from [url, width] pairs, skipping nulls (legacy helper) */
function buildSrcset(entries: [string | null, number][]): string {
  return entries
    .filter((e): e is [string, number] => !!e[0])
    .map(([url, w]) => `${url} ${w}w`)
    .join(", ");
}

export function mapApiProduct(p: ApiProduct, whatsappNumber?: string, phone1?: string): Product {
  const waNumber = buildWaLink(whatsappNumber, "https://wa.me/+919925155141");
  const phoneHref = buildPhoneHref(phone1, "tel:+919925155141");
  return {
    id: p.id,
    slug: p.productslug,
    seriesLabel: p.collectionName,
    name: p.productTitle ?? p.name,
    shortDesc: stripHtml(p.shortProductDescription) || p.productTagline || "",
    image: nullIfEmpty(p.image1CloudUrlCard) ?? getCloudinaryUrl(nullIfEmpty(p.image1CloudUrl), "f_auto,q_auto,w_400,c_fill,g_auto"),
    imageLarge: nullIfEmpty(p.image1CloudUrlHero) ?? nullIfEmpty(p.image1CloudUrl) ?? "",
    imageAlt: p.altTextImage1 ?? p.name,
    rating: p.ratingValue,
    ratingCount: p.ratingCount,
    category: p.category,
    categorySlug: p.category.toLowerCase().replace(/\s+/g, "-"),
    supplyStatus: p.supplyModel,
    whatsapp: waNumber,
    phone: phoneHref,
    specs: {
      material: p.content.join(", "),
      weight: `${Math.round(p.gsm)} GSM`,
      width: `${Math.round(p.cm)} cm / ${Math.round(p.inch)} inch`,
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
    image1: nullIfEmpty(p.image1CloudUrl) ?? "",
    image1Card: nullIfEmpty(p.image1CloudUrlCard),
    image1Web: nullIfEmpty(p.image1CloudUrlWeb),
    image1Srcset: buildCloudinarySrcset(
      sanitizeSecondaryImage(p.image1CloudUrl),
      [400, 800, 1200],
      4, 5, "fill",
    ),
    image2: sanitizeSecondaryImage(p.image2CloudUrl),
    image3: sanitizeSecondaryImage(p.image3CloudUrl),
    imageAlt2: p.altTextImage2 ?? null,
    imageAlt3: p.altTextImage3 ?? null,
    videoURL: p.videoURL ?? null,
    collectionImage: nullIfEmpty(p.collection?.collectionImage1CloudUrl) ?? null,
    collectionImageSrcset: buildCloudinarySrcset(
      nullIfEmpty(p.collection?.collectionImage1CloudUrl),
      [400, 800, 1200],
      4, 5, "fill",
    ),
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
  const [raw, company] = await Promise.all([getAllProducts(), getCompanyInfo("AGE")]);
  const wa = company?.whatsappNumber ?? undefined;
  const ph = company?.phone1 ?? undefined;
  return raw.filter(hasValidSlug).map((p) => mapApiProduct(p, wa, ph));
}

export async function fetchProductsPage(page: number): Promise<{ products: Product[]; total: number; totalPages: number; currentPage: number }> {
  const [result, company] = await Promise.all([getProducts(page, 20), getCompanyInfo("AGE")]);
  const wa = company?.whatsappNumber ?? undefined;
  const ph = company?.phone1 ?? undefined;
  return {
    products: result.data.filter(hasValidSlug).map((p) => mapApiProduct(p, wa, ph)),
    total: result.total,
    totalPages: result.totalPages,
    currentPage: result.page,
  };
}
