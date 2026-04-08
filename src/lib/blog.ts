const API_URL = "https://espobackend.vercel.app/api/blog";
const FALLBACK_IMAGE = "https://res.cloudinary.com/age-fabric/image/upload/v1773744244/BlogFallBackImage_snbkg6.jpg";

export interface ApiBlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt: string;
  excerpt: string | null;
  category: string | null;
  tags: string[];
  readingTimeMin: number | null;
  paragraph1: string | null;
  paragraph2: string | null;
  paragraph3: string | null;
  blogimage1CloudURL: string | null;
  blogimage2CloudURL: string | null;
  altimage1: string | null;
  altimage2: string | null;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  robots: string | null;
  isFeatured: boolean;
  q1: string | null;
  q2: string | null;
  q3: string | null;
  a1: string | null;
  a2: string | null;
  a3: string | null;
}

export async function fetchBlogPosts(): Promise<ApiBlogPost[]> {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data.filter((p: ApiBlogPost) => p.status === "Approved");
    }
    return [];
  } catch {
    return [];
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<ApiBlogPost | null> {
  const posts = await fetchBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getPostImage(post: ApiBlogPost): string {
  return post.featuredImageUrl || post.blogimage1CloudURL || FALLBACK_IMAGE;
}

/**
 * Rewrites a Cloudinary URL with an exact width using c_scale (no upscale, no crop).
 * Strips any existing transform segments and injects clean ones.
 */
function buildCloudinaryUrl(url: string, width: number, format: "f_auto" | "f_avif" | "f_webp" = "f_auto"): string {
  const uploadIdx = url.indexOf("/upload/");
  if (uploadIdx === -1) return url;

  const base = url.slice(0, uploadIdx + "/upload/".length);
  const segments = url.slice(base.length).split("/");

  let i = 0;
  while (i < segments.length) {
    const seg = segments[i];
    if (/^v\d+$/.test(seg)) break;
    if (seg.includes(",") || /^[fqwchgbdeo]_/.test(seg)) { i++; }
    else break;
  }

  const publicPart = segments.slice(i).join("/");
  return `${base}${format},q_auto,w_${width},c_limit/${publicPart}`;
}

/**
 * Generates a Cloudinary srcset string for responsive images.
 * Each candidate uses an exact width that matches its w descriptor.
 */
export function cloudinarySrcset(url: string, widths: number[] = [400, 800, 1200], format: "f_auto" | "f_avif" | "f_webp" = "f_auto"): string {
  if (!url) return "";
  return widths.map((w) => `${buildCloudinaryUrl(url, w, format)} ${w}w`).join(", ");
}

/**
 * Adds rel="noopener noreferrer" to all <a target="_blank"> links in an HTML string.
 * Fixes the "Unsafe Cross-Origin Links" SEO/security warning.
 */
export function safeExternalLinks(html: string): string {
  if (!html) return html;
  return html.replace(
    /<a\s([^>]*target=["']_blank["'][^>]*)>/gi,
    (match, attrs) => {
      // Already has rel= — just ensure noopener noreferrer are present
      if (/rel=["'][^"']*["']/i.test(attrs)) {
        return match.replace(
          /rel=(["'])([^"']*)(["'])/i,
          (_m, q1, val, q2) => {
            const parts = val.split(/\s+/).filter(Boolean);
            if (!parts.includes("noopener")) parts.push("noopener");
            if (!parts.includes("noreferrer")) parts.push("noreferrer");
            return `rel=${q1}${parts.join(" ")}${q2}`;
          }
        );
      }
      // No rel= — inject it
      return `<a ${attrs} rel="noopener noreferrer">`;
    }
  );
}
