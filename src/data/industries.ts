export interface Industry {
  slug: string;
  name: string;
  badge?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
}

export const industries: Industry[] = [
  {
    slug: "apparel",
    name: "Apparel",
    badge: "Fashion & Garments",
    heroTitle: "Premium Fabrics for the Apparel Industry.",
    heroSubtitle: "High-street fashion and luxury ready-to-wear essentials crafted with precision.",
  },
  {
    slug: "hospitality",
    name: "Hospitality",
    badge: "Hotels & Resorts",
    heroTitle: "Luxury Linens for the Hospitality Sector.",
    heroSubtitle: "Durable, high-thread count linens trusted by elite global hotel chains.",
  },
  {
    slug: "uniforms",
    name: "Uniforms",
    badge: "Corporate & Workwear",
    heroTitle: "Professional Uniform Fabrics Built to Last.",
    heroSubtitle: "Strength meets professional aesthetics for corporate and industrial workwear.",
  },
  {
    slug: "export",
    name: "Export",
    badge: "Global Trade",
    heroTitle: "Textile Export Solutions for Global Markets.",
    heroSubtitle: "Serving 50+ countries with logistics mastery and compliance expertise.",
  },
];
