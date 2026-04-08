export interface Location {
  slug: string;
  city: string;
  state: string;
  country: string;
  heroTitle: string;
  heroSubtitle: string;
}

export const locations: Location[] = [
  {
    slug: "surat",
    city: "Surat",
    state: "Gujarat",
    country: "India",
    heroTitle: "Fabric Supplier in Surat — Direct from the Textile Hub.",
    heroSubtitle: "Amrita Global supplies premium fabrics to garment manufacturers and exporters in Surat.",
  },
  {
    slug: "mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    heroTitle: "Fabric Supplier in Mumbai — Bulk Orders, Fast Delivery.",
    heroSubtitle: "Serving Mumbai's fashion and garment industry with quality cotton and woven fabrics.",
  },
  {
    slug: "ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    heroTitle: "Fabric Supplier in Ahmedabad — Quality Textiles at Scale.",
    heroSubtitle: "Trusted by Ahmedabad's textile industry for bulk fabric supply and export.",
  },
  {
    slug: "delhi",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    heroTitle: "Fabric Supplier in Delhi — Premium Textiles for Every Need.",
    heroSubtitle: "Supplying Delhi's garment hubs with certified, export-quality fabrics.",
  },
];
