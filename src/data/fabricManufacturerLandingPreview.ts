import type { ApiProductLocation } from "../lib/api";

export interface FabricManufacturerLandingPreview {
  headline: string;
  subheadline: string;
  buyerTypeLine: string;
  responsePromise: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  colorOverride?: string;
  assetNotice?: string;
  footerEmail?: string;
  footerPhone1?: string;
  footerPhone2?: string;
  whatsappNumber?: string;
  applications: string[];
  trustMetrics: Array<{ stat: string; label: string }>;
}

const DEFAULT_TRUST_METRICS = [
  { stat: "50+", label: "Years Textile Experience" },
  { stat: "1200+", label: "Fabric Varieties" },
  { stat: "9+", label: "Countries Served" },
  { stat: "24 Hr", label: "Inquiry Response" },
];

const DEFAULT_APPLICATIONS = [
  "Men's shirts",
  "Trousers",
  "Women's dresses",
  "Kidswear",
  "Uniforms",
  "Casual apparel",
];

const PREVIEW_OVERRIDES: Record<string, Partial<FabricManufacturerLandingPreview>> = {
  "majestica-766-dark-olive-cotton-twill-fabric-ahmedabad": {
    responsePromise:
      "Ahmedabad team responds within 24 hours with pricing and availability.",
    primaryCtaLabel: "Send Fabric Inquiry",
    secondaryCtaLabel: "Request Fabric Samples",
    footerEmail: "connect.age@outlook.com",
    footerPhone1: "+91-9925155141",
    footerPhone2: "+91-9824003484",
    whatsappNumber: "+91-9925155141",
  },
};

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function normalizeFinishLabel(value: string): string {
  return value.replace(/^.*?-\s*/, "").trim();
}

function deriveApplications(data: ApiProductLocation): string[] {
  const parsed = (data.product.suitability ?? [])
    .map((item) => item.split("|").map((part) => part.trim())[0] ?? "")
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return [...new Set(parsed)].slice(0, 6);
}

export function getFabricManufacturerLandingPreview(
  data: ApiProductLocation,
): FabricManufacturerLandingPreview {
  const override = PREVIEW_OVERRIDES[data.slug] ?? {};
  const firstColor = data.product.color?.[0] ?? "Bulk Buyer";
  const productLabel = data.product.productTitle ?? data.product.name;
  const fabricType = `${data.product.content.join(", ")} ${data.product.structure}`.trim();
  const defaultHeadline = `${productLabel} ${titleCase(firstColor)} ${fabricType} Fabric for Bulk Buyers in ${data.location.name}`;
  const defaultSubheadline = `${Math.round(data.product.gsm)} GSM • ${data.product.inch} inch width • ${data.product.design} ${data.product.structure.toLowerCase()} • MOQ ${data.product.salesMOQ} ${data.product.uM.toLowerCase()} • ${data.location.name} supply support`;

  return {
    headline: data.title?.trim() || override.headline || defaultHeadline,
    subheadline: data.tagline?.trim() || override.subheadline || defaultSubheadline,
    buyerTypeLine:
      data.productlocationA3?.trim() ||
      (override.buyerTypeLine ??
        "For garment manufacturers, traders, wholesalers, exporters, and repeat fabric buyers."),
    responsePromise:
      override.responsePromise ??
      `${data.location.name} team responds within 24 hours with pricing and availability.`,
    primaryCtaLabel: override.primaryCtaLabel ?? "Send Fabric Inquiry",
    secondaryCtaLabel: override.secondaryCtaLabel ?? "Request Fabric Samples",
    colorOverride: override.colorOverride,
    assetNotice: override.assetNotice,
    footerEmail: override.footerEmail,
    footerPhone1: override.footerPhone1,
    footerPhone2: override.footerPhone2,
    whatsappNumber: override.whatsappNumber,
    applications:
      override.applications ??
      (deriveApplications(data).length > 0
        ? deriveApplications(data).slice(0, 6)
        : DEFAULT_APPLICATIONS),
    trustMetrics: override.trustMetrics ?? DEFAULT_TRUST_METRICS,
  };
}

export function applyFabricManufacturerLandingPreview(
  data: ApiProductLocation,
  landing: FabricManufacturerLandingPreview,
): ApiProductLocation {
  return {
    ...data,
    title: landing.headline,
    tagline: landing.subheadline,
    product: {
      ...data.product,
      finish: [...new Set((data.product.finish ?? []).map(normalizeFinishLabel).filter(Boolean))],
    },
  };
}
