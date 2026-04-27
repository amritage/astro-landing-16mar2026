import { getAllProducts, getCompanyInfo, buildWaLink, buildPhoneHref, type ApiProduct } from "../lib/api";
// C1 FIX: Cloudinary utils now live in lib/cloudinary — import from there, no local copies
// Import for local use; also re-exported below so existing consumers don't need import changes
import { rebuildCloudinaryUrl, getCloudinaryUrl, buildCloudinarySrcset } from "../lib/cloudinary";
export { rebuildCloudinaryUrl, getCloudinaryUrl, buildCloudinarySrcset };
// C4 FIX: fallback constants from single source of truth — now using null (no hardcoded fallback)

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
  // tech spec search fields
  fabricCode: string;
  vendorCode: string;
  salesMOQ: string;
}

// ── Map API shape → Product ────────────────────────────────────────────────────

function parseSuitability(raw: string[]): { name: string; score: number; desc: string }[] {
  // B5 FIX: guard against malformed entries like "Menswear" (missing parts)
  // which previously produced names like "Menswear undefined".
  return raw
    .map((s) => {
      // expected format: "Menswear | Shirt | 85%"
      const parts = s.split("|").map((p) => p.trim());
      const category = parts[0] ?? "";
      const type = parts[1] ?? "";           // was blindly used → "undefined" when missing
      const scoreRaw = parts[2] ?? "0";
      const score = parseInt(scoreRaw, 10);
      const name = type ? `${category} ${type}` : category;
      return {
        name,
        score: isNaN(score) ? 0 : score,
        desc: `Suitable for ${name}`,
      };
    })
    .filter((item) => item.name.length > 0); // drop completely empty entries
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
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  const plain = html.replace(/<[^>]*>/g, "").trim();
  return plain;
}

function sanitizeDisplayLabel(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .trim()
    .replace(/^["'“”‘’]+\s*/, "")
    .replace(/\s*["'“”‘’]+$/, "");
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







export function mapApiProduct(p: ApiProduct, whatsappNumber?: string, phone1?: string): Product {
  // C4 FIX: fallbacks come from constants, not hardcoded strings
  const waNumber = buildWaLink(whatsappNumber) ?? "";
  const phoneHref = buildPhoneHref(phone1) ?? "";
  const displayName = sanitizeDisplayLabel(p.productTitle ?? p.name);
  const imageAlt = sanitizeDisplayLabel(p.altTextImage1 ?? p.name);
  const seriesLabel = sanitizeDisplayLabel(p.collectionName);
  return {
    id: p.id,
    slug: p.productslug,
    seriesLabel,
    name: displayName,
    shortDesc: stripHtml(p.shortProductDescription) || p.productTagline || "",
    image: nullIfEmpty(p.image1CloudUrlCard) ?? getCloudinaryUrl(nullIfEmpty(p.image1CloudUrl), "f_auto,q_auto,w_400,c_fill,g_auto"),
    imageLarge: nullIfEmpty(p.image1CloudUrlHero) ?? nullIfEmpty(p.image1CloudUrl) ?? "",
    imageAlt,
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
    fabricCode: p.fabricCode,
    vendorCode: p.vendorFabricCode,
    salesMOQ: `${p.salesMOQ} ${p.uM}`,
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
