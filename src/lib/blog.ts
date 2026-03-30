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
