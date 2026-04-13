/**
 * Single source of truth for all Cloudinary URL utilities.
 * Import from here — never copy this logic into pages or components.
 *
 * C1 FIX: previously duplicated in:
 *   - src/data/products.ts  (rebuildCloudinaryUrl / getCloudinaryUrl / buildCloudinarySrcset)
 *   - src/pages/index.astro (local buildCloudinaryUrl)
 *   - src/pages/fabric/[productSlug].astro (local buildOgImageUrl using .replace())
 *   - src/lib/blog.ts (local buildCloudinaryUrl / cloudinarySrcset)
 */

/**
 * Strip any existing Cloudinary transforms from a URL and inject new ones.
 * Works with or without a version segment (v1234...).
 */
export function rebuildCloudinaryUrl(url: string, transforms: string): string {
  const uploadIdx = url.indexOf("/upload/");
  if (uploadIdx === -1) return url;

  const base = url.slice(0, uploadIdx + "/upload/".length);
  const segments = url.slice(base.length).split("/");

  const TRANSFORM_RE = /^[a-z]_/;
  const VERSION_RE = /^v\d+$/;

  let i = 0;
  while (i < segments.length) {
    const seg = segments[i];
    if (VERSION_RE.test(seg)) break;
    if (seg.includes(",") || TRANSFORM_RE.test(seg)) { i++; continue; }
    break;
  }

  return `${base}${transforms}/${segments.slice(i).join("/")}`;
}

/**
 * Inject Cloudinary transforms into any Cloudinary URL.
 * Safe to call on non-Cloudinary URLs — returns them unchanged.
 */
export function getCloudinaryUrl(url: string | null | undefined, transforms: string): string {
  if (!url || !url.includes("/upload/")) return url ?? "";
  return rebuildCloudinaryUrl(url, transforms);
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

/**
 * Build a srcset string for a specific format (avif / webp / auto).
 * Used for <source> elements and LCP preloads.
 */
export function cloudinarySrcset(
  url: string,
  widths: number[] = [400, 800, 1200],
  format: "f_auto" | "f_avif" | "f_webp" = "f_auto",
): string {
  if (!url) return "";
  return widths
    .map((w) => `${rebuildCloudinaryUrl(url, `${format},q_auto,w_${w},c_limit`)} ${w}w`)
    .join(", ");
}

/**
 * Build a 1200×630 OG image URL for social sharing.
 */
export function buildOgImageUrl(cloudUrl: string | null | undefined): string | undefined {
  if (!cloudUrl) return undefined;
  return rebuildCloudinaryUrl(cloudUrl, "f_jpg,q_auto,w_1200,h_630,c_fill,g_auto");
}
