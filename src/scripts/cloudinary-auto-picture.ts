/**
 * cloudinary-auto-picture.ts
 *
 * Automatically upgrades every <img> whose src is a Cloudinary URL into a
 * <picture> element with AVIF and WebP <source> tags + a proper srcset.
 *
 * Works for:
 *  - SSR/backend-rendered images
 *  - Manually written <img> tags
 *  - Dynamically injected images (via MutationObserver)
 *
 * No manual work needed — just include this script once in BaseLayout.
 */

const CLOUDINARY_RE = /^https:\/\/res\.cloudinary\.com\/.+\/upload\//;

// Default candidate widths for srcset
const DEFAULT_WIDTHS = [320, 480, 640, 800, 1200];

/**
 * Strip any existing transform segments from a Cloudinary URL and inject new ones.
 */
function rebuildUrl(src: string, transforms: string): string {
  const uploadIdx = src.indexOf("/upload/");
  if (uploadIdx === -1) return src;
  const base = src.slice(0, uploadIdx + "/upload/".length);
  const rest = src.slice(base.length).split("/");
  // Skip existing transform segments (contain "," or match known param prefixes)
  let i = 0;
  while (i < rest.length) {
    const seg = rest[i];
    if (/^v\d+$/.test(seg)) break;          // version segment — stop
    if (seg.includes(",") || /^[a-z]_/.test(seg)) { i++; continue; } // transform — skip
    break;                                   // public ID — stop
  }
  return `${base}${transforms}/${rest.slice(i).join("/")}`;
}

/**
 * Build a srcset string for a given format.
 */
function buildSrcset(src: string, widths: number[], format: "f_avif" | "f_webp" | "f_auto"): string {
  return widths
    .map((w) => `${rebuildUrl(src, `${format},q_auto,w_${w},c_limit`)} ${w}w`)
    .join(", ");
}

/**
 * Determine sensible candidate widths from the img's rendered/natural width.
 */
function getWidths(img: HTMLImageElement): number[] {
  const w = img.getAttribute("width");
  const natural = w ? parseInt(w, 10) : 0;
  if (natural > 0) {
    // Include widths up to 2× the declared width (for HiDPI), capped at 1600
    return DEFAULT_WIDTHS.filter((cw) => cw <= Math.min(natural * 2, 1600));
  }
  return DEFAULT_WIDTHS;
}

/**
 * Upgrade a single <img> to a <picture> with AVIF + WebP sources.
 * Skips images that are already inside a <picture>, already upgraded,
 * or don't have a Cloudinary src.
 */
function upgradeImg(img: HTMLImageElement): void {
  const src = img.getAttribute("src") ?? "";
  if (!CLOUDINARY_RE.test(src)) return;
  if (img.parentElement?.tagName === "PICTURE") return; // already in a picture
  if (img.dataset.clUpgraded) return;                   // already processed

  const widths = getWidths(img);
  const sizes = img.getAttribute("sizes") ?? "100vw";

  const picture = document.createElement("picture");

  const avif = document.createElement("source");
  avif.type = "image/avif";
  avif.srcset = buildSrcset(src, widths, "f_avif");
  avif.sizes = sizes;

  const webp = document.createElement("source");
  webp.type = "image/webp";
  webp.srcset = buildSrcset(src, widths, "f_webp");
  webp.sizes = sizes;

  // Mark the img so we don't process it again, and add a fallback srcset
  img.dataset.clUpgraded = "1";
  if (!img.getAttribute("srcset")) {
    img.srcset = buildSrcset(src, widths, "f_auto");
    img.sizes = sizes;
  }

  // Wrap: insert picture before img, move img inside
  img.parentNode!.insertBefore(picture, img);
  picture.appendChild(avif);
  picture.appendChild(webp);
  picture.appendChild(img);
}

/**
 * Scan all <img> elements in a root and upgrade Cloudinary ones.
 */
function scanAndUpgrade(root: Document | Element = document): void {
  root.querySelectorAll<HTMLImageElement>("img").forEach(upgradeImg);
}

// Run immediately on existing DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => scanAndUpgrade());
} else {
  scanAndUpgrade();
}

// Watch for dynamically added images
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType !== 1) continue;
      const el = node as Element;
      if (el.tagName === "IMG") {
        upgradeImg(el as HTMLImageElement);
      } else {
        el.querySelectorAll<HTMLImageElement>("img").forEach(upgradeImg);
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });
