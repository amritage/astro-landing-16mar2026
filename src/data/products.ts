export interface Product {
  slug: string;
  seriesLabel: string;
  name: string;
  shortDesc: string;
  image: string;
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
  regionalPreference: string;
  regionalCities: string[];
  industries: string[];
  faq: { q: string; a: string }[];
  related: { name: string; slug: string; gsm: string; weave: string }[];
}

export const products: Product[] = [
  {
    slug: "majestica-767",
    seriesLabel: "Premium Woven Series",
    name: "Majestica-767 Cocoa Brown 100% Cotton Twill Woven Fabric 125 GSM",
    shortDesc:
      "Elevate your designs with Majestica-767 cocoa brown solid dyed cotton twill. Soft, mercerized finish & wide 146 cm width ideal for innovative apparel brands.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTp8Itgyf3JY8W5wSJpfGOwTfbEFOMlRQiZsk6rv4s__U5U_2kx60UbAsTTWRGkIPSrFl5HiTSjPTJ-xZeGtXEAwrXwbtpcd5L_sGaAfh8dlwpYDRH9wHRqond6F6fBGvL3UKYn7Ov3k25dtSO0gHbMqBE5sAZkSF_Vst1p-2BjlXcoLyUCMTh384O7biOCpPaKcBV38Bc7NvXDsbFaxhymxzWN6bcN3m1FIDVDVYN0lJljGh9JtH49s3ldNe0DkJ2Uq6fCmx157_y",
    imageAlt: "Majestica-767 Cocoa Brown Fabric",
    rating: 4.25,
    ratingCount: 150,
    category: "Woven Fabrics",
    categorySlug: "woven-fabrics",
    supplyStatus: "Never-Out-of-Stock (NOS)",
    whatsapp: "https://wa.me/919925155141",
    phone: "tel:+919925155141",
    specs: {
      material: "100% Cotton",
      weight: "125 GSM",
      width: "57-58 Inch",
      weave: "Twill",
    },
    techSpecs: [
      { label: "Fabric Code", value: "M-767-CB" },
      { label: "GSM (Grams/Sq. Meter)", value: "125" },
      { label: "Ozs (Ounces)", value: "3.69" },
      { label: "Width (CM)", value: "147 cm" },
      { label: "Sales MOQ", value: "110 Meters" },
      { label: "Vendor Code", value: "AGE-TX-09" },
    ],
    longDescription:
      "Crafted from premium 100% cotton twill, this fabric is dyed in vibrant, long-lasting colors — available in 72 stunning shades. It features a 40s x 40s yarn count, a soft yet durable 125 GSM weight (approx.), and a width of 56–57 inches. Perfect for apparel, uniforms, and home textiles, it offers breathability, comfort, and exceptional quality for diverse tailoring needs.",
    applications: [
      { name: "Menswear Shirt", score: 85, desc: "Recommended for high-end formal and semi-formal shirting." },
      { name: "Menswear Trousers (Chinos)", score: 75, desc: "Ideal for lightweight summer trousers and chinos." },
      { name: "Kidswear Shirt", score: 70, desc: "Suitable for durable yet soft children's apparel." },
      { name: "Home Textiles", score: 65, desc: "Functional for premium linens and soft furnishings." },
    ],
    certifications: [
      { icon: "eco", title: "Chemical - Bio Finish", desc: "Enzyme-treated for a cleaner surface and smoother hand-feel." },
      { icon: "workspace_premium", title: "Mercerized", desc: "Enhanced dye affinity and increased fabric strength with a silky luster." },
      { icon: "shield_with_heart", title: "Silicon Finish", desc: "Premium softness finish for superior comfort against the skin." },
    ],
    regionalPreference:
      "Preferred choice for Mumbai and Surat garment hubs due to its adaptable GSM and rich cocoa tone.",
    regionalCities: ["Mumbai", "Surat"],
    industries: ["Corporate Uniforms", "Luxury Fashion Labels", "Premium Hospitality Apparel"],
    faq: [
      { q: "What is the MOQ?", a: "The standard sales MOQ for Majestica-767 is 110 Meters per color." },
      { q: "Is Majestica-767 colorfast?", a: "Yes, it undergoes premium reactive dyeing with a minimum Grade 4 color fastness." },
      { q: "Is this suitable for uniforms?", a: "Absolutely. Its durable twill weave and soft finish make it ideal for corporate and institutional uniforms." },
      { q: "Can I request a sample?", a: "We provide 10x10 cm swatches for approved bulk inquiries." },
    ],
    related: [
      { name: "Majestica-768 Royal Blue", slug: "majestica-768", gsm: "130 GSM", weave: "Cotton Twill" },
      { name: "Sovereign-202 Steel Grey", slug: "sovereign-202", gsm: "115 GSM", weave: "Cotton Poplin" },
      { name: "Heritage-550 Olive Drab", slug: "heritage-550", gsm: "180 GSM", weave: "Heavy Twill" },
      { name: "Majestica-769 Jet Black", slug: "majestica-769", gsm: "125 GSM", weave: "Cotton Twill" },
    ],
  },
];
