const API_BASE = (import.meta.env.PUBLIC_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '';
if (!API_BASE) {
  throw new Error('[blog] PUBLIC_API_BASE_URL is not set. Add it to your .env file or Cloudflare Pages environment variables.');
}
export { cloudinarySrcset } from "./cloudinary";

const API_URL = `${API_BASE}/api/blog`;
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
    const res = await fetch(API_URL, { cache: "force-cache" });
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
