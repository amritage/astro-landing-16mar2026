# CTA Buttons — Page-by-Page Reference

---

## Homepage (`/`)

| Section / Component | Button Label | Link / Action |
|---|---|---|
| HeroSection | Get a Wholesale Quote | WhatsApp link (dynamic) |
| HeroSection | View Collections | `/fabric` |
| FeaturedCategories | Explore Full Library | `/fabric` |
| KnowledgePreview | Read the Full Article | `/blog/[latest-slug]` |
| CapabilitiesPreview | View More / View Less | Toggle (expand content) |

---

## About (`/about`)

| Section / Component | Button Label | Link / Action |
|---|---|---|
| AboutCTA | Partner with Amrita Global | `tel:[phone]` |
| AboutCTA | Download Portfolio | `/fabric` |

---

## Capabilities (`/capabilities`)

| Section / Component | Button Label | Link / Action |
|---|---|---|
| CapabilitiesHero | Explore Capabilities | `#infrastructure` (anchor) |
| CapabilitiesHero | View Technical Specs | `#quality-hub` (anchor) |
| CapabilitiesCTA | Contact Us | `/support` |
| CapabilitiesCTA | Explore Fabrics | `/fabric` |
| CapabilitiesBottomCTA | Request a Technical Consultation | WhatsApp link (dynamic) |
| CapabilitiesBottomCTA | Download Capacity Deck | `tel:[phone]` |

---

## Certifications (`/certifications`)

| Section / Component | Button Label | Link / Action |
|---|---|---|
| CertificationsDocCTA | Full Certificate Pack | WhatsApp link (dynamic) |
| CertificationsDocCTA | Request Custom Doc | `tel:[phone]` |

---

## FAQ (`/faq`)

| Section / Component | Button Label | Link / Action |
|---|---|---|
| FAQCTA | Chat Expert | `/support` |
| FAQCTA | Contact Sales | `/support` |

---

## Shipping & Logistics (`/shipping`)

| Section / Component | Button Label | Link / Action |
|---|---|---|
| ShippingCTA | Consult with Experts | `/support` |
| ShippingCTA | Call Now | `tel:[phone]` |

---

## Support / Contact (`/support`)

| Section / Component | Button Label | Link / Action |
|---|---|---|
| SupportCTA | WhatsApp Now | WhatsApp link (dynamic) |
| SupportCTA | Send Email | `mailto:[supportEmail]` |

---

## Careers (`/careers`)

| Section / Component | Button Label | Link / Action |
|---|---|---|
| CareersHero | View Open Roles | `#positions` (anchor) |
| CareersForm | Next Step | Multi-step form navigation |
| CareersForm | Previous | Multi-step form navigation |
| CareersForm | Submit Application | Form submit → EspoCRM API |

---

## Blog Index (`/blog`)

| Section / Component | Button Label | Link / Action |
|---|---|---|
| BlogNewsletter | Subscribe | Form submit → Lead Capture API |

---

## Blog Post (`/blog/[slug]`)

| Section / Component | Button Label | Link / Action |
|---|---|---|
| BlogPostCTA | Consult an Expert | WhatsApp link (dynamic) |
| BlogPostCTA | Browse Our Collections | `/fabric` |

---

## Fabric Catalog (`/fabric`)

| Section / Component | Button Label | Link / Action |
|---|---|---|
| ProductHero | WhatsApp | WhatsApp link (dynamic) |
| ProductHero | Call Us | `tel:[phone]` |
| ProductHero | Email | `mailto:[salesEmail]` (dynamic) |
| ProductCTA | Request Swatch Samples | `/support` |

---

## Fabric Product Detail (`/fabric/[productSlug]`)

| Section / Component | Button Label | Link / Action |
|---|---|---|
| ProductDetailRelated | View Collection | `/fabric` |
| ProductDetailRelated | Start Bulk Inquiry | WhatsApp link (dynamic) |
| ProductDetailRelated | Download Data Sheet | `tel:[phone]` |

---

## Category Listing (`/category/[slug]`)

Same as Fabric Catalog — uses `FabricListLayout` which includes `ProductHero` and `ProductCTA`.

| Section / Component | Button Label | Link / Action |
|---|---|---|
| ProductHero | WhatsApp | WhatsApp link (dynamic) |
| ProductHero | Call Us | `tel:[phone]` |
| ProductHero | Email | `mailto:[salesEmail]` (dynamic) |
| ProductCTA | Request Swatch Samples | `/support` |

---

## Category Product Detail (`/category/[categorySlug]/[productSlug]`)

Same as Fabric Product Detail.

| Section / Component | Button Label | Link / Action |
|---|---|---|
| ProductDetailRelated | View Collection | `/fabric` |
| ProductDetailRelated | Start Bulk Inquiry | WhatsApp link (dynamic) |
| ProductDetailRelated | Download Data Sheet | `tel:[phone]` |

---

## Collection Listing (`/collection/[slug]`)

Same as Category Listing — uses `FabricListLayout`.

| Section / Component | Button Label | Link / Action |
|---|---|---|
| ProductHero | WhatsApp | WhatsApp link (dynamic) |
| ProductHero | Call Us | `tel:[phone]` |
| ProductHero | Email | `mailto:[salesEmail]` (dynamic) |
| ProductCTA | Request Swatch Samples | `/support` |

---

## Collection Product Detail (`/collection/[collectionSlug]/[productSlug]`)

Same as Fabric Product Detail.

| Section / Component | Button Label | Link / Action |
|---|---|---|
| ProductDetailRelated | View Collection | `/fabric` |
| ProductDetailRelated | Start Bulk Inquiry | WhatsApp link (dynamic) |
| ProductDetailRelated | Download Data Sheet | `tel:[phone]` |

---

## Industry Index (`/industry`) & Industry Detail (`/industry/[industrySlug]`)

| Section / Component | Button Label | Link / Action |
|---|---|---|
| IndustryCTA | Consult Our Experts | `/support` |
| IndustryCTA | View Catalog | `/fabric` |

---

## Location (`/location/[citySlug]`)

| Section / Component | Button Label | Link / Action |
|---|---|---|
| LocationHero (inline) | WhatsApp | WhatsApp link (dynamic) |
| LocationHero (inline) | Call Us | `tel:[phone]` |
| LocationHero (inline) | Email | `mailto:[salesEmail]` (dynamic) |

---

## Product + Location Listing (`/product-location`)

No CTA buttons — listing page only (PLListingHero + PLGrid).

---

## Product + Location Detail (`/product-location/[slug]`)

| Section / Component | Button Label | Link / Action |
|---|---|---|
| PLHero | Request Technical Sheet | `/support` |
| PLHero | Consult with Expert | Opens `ProductInquiryModal` |
| PLHero | WhatsApp | WhatsApp link (dynamic) |
| PLHero | Call Us | `tel:[phone]` |
| PLHero | Email | `mailto:[salesEmail]` (dynamic) |
| PLCTA | Request a Quote | `/support` |
| PLCTA | Browse All Fabrics | `/fabric` |
| PLInquiryForm | Next Step | Multi-step form navigation |
| PLInquiryForm | Previous | Multi-step form navigation |
| PLInquiryForm | Submit Request | Form submit → Lead Capture API |

---

## Global / Floating (all pages)

| Component | Button Label | Link / Action |
|---|---|---|
| FloatingActions | WhatsApp (floating icon) | WhatsApp link (dynamic) |
| FloatingActions | Call (floating icon) | `tel:[phone]` |
| FloatingActions | Email (floating icon) | `mailto:[primaryEmail]` |
