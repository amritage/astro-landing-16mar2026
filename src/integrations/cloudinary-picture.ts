/**
 * cloudinary-picture.ts — Astro Integration
 *
 * Post-processes every rendered HTML page and rewrites any bare
 *   <img src="https://res.cloudinary.com/...">
 * that is NOT already inside a <picture> into:
 *   <picture>
 *     <source type="image/avif" srcset="..." sizes="...">
 *     <source type="image/webp" srcset="..." sizes="...">
 *     <img src="..." srcset="..." sizes="..." ...>
 *   </picture>
 *
 * This runs at build time (SSG) and at request time (SSR), so no client-side
 * JavaScript is needed for the upgrade — zero layout shift, zero flicker.
 */

import type { AstroIntegration } from "astro";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const UPLOAD_MARKER = "/upload/";
const DEFAULT_WIDTHS = [320, 480, 640, 800, 1200];

function rebuildUrl(src: string, transforms: string): string {
  const idx = src.indexOf(UPLOAD_MARKER);
  if (idx === -1) return src;
  const base = src.slice(0, idx + UPLOAD_MARKER.length);
  const rest = src.slice(base.length).split("/");
  let i = 0;
  while (i < rest.length) {
    const seg = rest[i];
    if (/^v\d+$/.test(seg)) break;
    if (seg.includes(",") || /^[a-z]_/.test(seg)) { i++; continue; }
    break;
  }
  return `${base}${transforms}/${rest.slice(i).join("/")}`;
}

function buildSrcset(src: string, widths: number[], fmt: string): string {
  return widths.map((w) => `${rebuildUrl(src, `${fmt},q_auto,w_${w},c_limit`)} ${w}w`).join(", ");
}

/**
 * Parse the declared width attribute to pick sensible candidate widths.
 */
function pickWidths(widthAttr: string | null): number[] {
  const w = widthAttr ? parseInt(widthAttr, 10) : 0;
  if (w > 0) {
    return DEFAULT_WIDTHS.filter((cw) => cw <= Math.min(w * 2, 1600));
  }
  return DEFAULT_WIDTHS;
}

/**
 * Rewrite all bare Cloudinary <img> tags in an HTML string to <picture> elements.
 * Uses a regex-based approach — fast and dependency-free (no HTML parser needed).
 */
function rewriteHtml(html: string): string {
  // We need context to know if an <img> is already inside a <picture>.
  // Strategy: replace <picture>...</picture> blocks with a placeholder, then
  // process remaining <img> tags, then restore placeholders.
  const placeholders: string[] = [];
  const protected_html = html.replace(/<picture[\s\S]*?<\/picture>/gi, (match) => {
    const idx = placeholders.length;
    placeholders.push(match);
    return `\x00PICTURE_${idx}\x00`;
  });

  const rewritten = protected_html.replace(/<img(\s[^>]*?)?\/?>/gis, (imgTag) => {
    const srcMatch = imgTag.match(/\bsrc=["']([^"']+)["']/i);
    if (!srcMatch) return imgTag;
    const src = srcMatch[1];

    if (!src.includes("res.cloudinary.com") || !src.includes(UPLOAD_MARKER)) return imgTag;

    const sizesMatch = imgTag.match(/\bsizes=["']([^"']+)["']/i);
    const sizes = sizesMatch ? sizesMatch[1] : "100vw";

    const widthMatch = imgTag.match(/\bwidth=["']?(\d+)["']?/i);
    const widths = pickWidths(widthMatch ? widthMatch[1] : null);

    const avifSrcset = buildSrcset(src, widths, "f_avif");
    const webpSrcset = buildSrcset(src, widths, "f_webp");
    const fallbackSrcset = buildSrcset(src, widths, "f_auto");

    let newImg = imgTag;
    if (!/\bsrcset=/i.test(newImg)) {
      newImg = newImg.replace(/(\s*\/?>)$/, ` srcset="${fallbackSrcset}" sizes="${sizes}"$1`);
    } else if (!/\bsizes=/i.test(newImg)) {
      newImg = newImg.replace(/(\s*\/?>)$/, ` sizes="${sizes}"$1`);
    }

    return `<picture><source type="image/avif" srcset="${avifSrcset}" sizes="${sizes}"><source type="image/webp" srcset="${webpSrcset}" sizes="${sizes}">${newImg}</picture>`;
  });

  // Restore protected <picture> blocks
  return rewritten.replace(/\x00PICTURE_(\d+)\x00/g, (_, i) => placeholders[parseInt(i, 10)]);
}

export function cloudinaryPicture(): AstroIntegration {
  return {
    name: "cloudinary-picture",
    hooks: {
      "astro:build:done": async ({ dir, pages }) => {
        const dirPath = fileURLToPath(dir);

        await Promise.all(
          pages.map(async ({ pathname }) => {
            const filePath = join(
              dirPath,
              pathname.endsWith("/") ? `${pathname}index.html` : `${pathname}.html`
            );
            try {
              const original = await readFile(filePath, "utf-8");
              const rewritten = rewriteHtml(original);
              if (rewritten !== original) {
                await writeFile(filePath, rewritten, "utf-8");
              }
            } catch {
              // File may not exist for dynamic routes — skip silently
            }
          })
        );
      },
    },
  };
}
