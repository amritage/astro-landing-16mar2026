# Website Image Report — Amrita Global Enterprises
> Complete audit of all images used across every page, both static (hardcoded) and dynamic (from API/CMS).
> Prepared for backend developer handoff.

---

## HOW IMAGES WORK IN THIS PROJECT

All images are served via **Cloudinary** (`res.cloudinary.com/age-fabric`).
Two reusable components handle all rendering:
- `CloudinaryImage.astro` — generates `<picture>` with AVIF + WebP + fallback srcsets
- `ResponsiveImage.astro` — wrapper that delegates to CloudinaryImage for Cloudinary URLs

**Image fields on API objects:**
- `image1CloudUrl` — base/original
- `image1CloudUrlWeb` — web-optimized variant
- `image1CloudUrlCard` — card thumbnail variant
- `image1CloudUrlHero` — hero/large variant
- `image1CloudUrlLarge` — largest variant
- `altTextImage1` — SEO alt text

---

## 1. GLOBAL / LAYOUT (Every Page)

### Header — `src/layouts/Header.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Company Logo | DYNAMIC — `company.logoUrl` from `getCompanyInfo()` API | 36×36px (1x), 72×72px (2x) | Rendered as `<picture>` AVIF+WebP. Falls back to `/images/icons/my_logo.png` |

### Footer — `src/layouts/Footer.astro`
No images — uses Material Symbols icons only.

---

## 2. HOME PAGE — `src/pages/index.astro`

### HeroSection — `src/components/home/HeroSection.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Hero main image | DYNAMIC — `homePage.image1CloudUrl` from `getTopicPageBySlug("home")` | 512×640px display slot. Srcset: 480w, 640w, 800w, 1024w | `loading="eager"`, `fetchpriority="high"`. Aspect ratio ~4:5 in a rounded card |

### CertificationsPreview — `src/components/home/CertificationsPreview.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| OEKO-TEX logo | STATIC — `https://res.cloudinary.com/age-fabric/image/upload/v1775651646/6_fytaun.jpg` | 64×64px display | `h-10 md:h-16 object-contain` |
| ISO 9001 logo | STATIC — `https://res.cloudinary.com/age-fabric/image/upload/v1775652064/11_accl32.jpg` | 64×64px display | `h-10 md:h-16 object-contain` |

### KnowledgePreview — `src/components/home/KnowledgePreview.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Latest blog post image | DYNAMIC — `post.blogimage1CloudURL` from `getBlogPosts()` API | 800×600px. Srcset: 400w, 640w, 800w, 1200w | `sizes="(min-width:1024px) 50vw, 100vw"`. Container: `h-[250px] sm:h-[400px]` |

### FeaturedCategories — `src/components/home/FeaturedCategories.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Category card images (multiple) | DYNAMIC — `cat.image1CloudUrlCard ?? cat.image1CloudUrl` from `getCategoryTopicPages()` API | 480×640px. Srcset: 240w, 480w, 720w | `aspect-[3/4]`, `sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 82vw"` |

### DynamicTopicSections — `src/components/home/DynamicTopicSections.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Product images in collection carousels | DYNAMIC — `product.image1 or product.image` from `getProductsByMerchTag()` API | 400×400px (square). Srcset: 200w, 400w, 600w, 800w | `aspect-square`, `sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 80vw"` |

### CapabilitiesPreview — `src/components/home/CapabilitiesPreview.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Manufacturing floor image | STATIC — `https://res.cloudinary.com/age-fabric/image/upload/v1775652005/9_wizefk.jpg` | 512×512px display | `aspect-[3/4]`, grayscale effect |
| Lab quality check image | STATIC — `https://res.cloudinary.com/age-fabric/image/upload/v1775652187/14_ith7ry.jpg` | 512×512px display | `aspect-[3/4]`, grayscale effect |

### TestimonialsSection — `src/components/home/TestimonialsSection.astro`
No images — text/review cards only.

### TrustSignals — `src/components/home/TrustSignals.astro`
No images — Material Symbols icons only.

### LocationsSection — `src/components/home/LocationsSection.astro`
No images.

### IndustriesSection — `src/components/home/IndustriesSection.astro`
No images — icon-based cards.

### HomepageFAQ — `src/components/home/HomepageFAQ.astro`
No images.

---

## 3. ABOUT PAGE — `src/pages/about.astro`

### AboutHero — `src/components/about/AboutHero.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Hero background | DYNAMIC — `aboutData.image1CloudUrlHero ?? image1CloudUrl` from `getTopicPageBySlug("about")`. Fallback: `About1_j3mzld.jpg` | Full-width hero: 1024×870px. Srcset: 400w, 768w, 1024w, 1280w | `loading="eager"`, `fetchpriority="high"`. Container: `h-[870px]` |

### AboutMissionVision — `src/components/about/AboutMissionVision.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Mission/Vision section image | DYNAMIC — `aboutData.image2CloudUrl` from API. Fallback: `About2_fallback.jpg` | 600×750px. Srcset: 300w, 600w, 900w | `aspect-[4/5]`, `sizes="(min-width:768px) 50vw, 100vw"` |

### AboutManufacturing — `src/components/about/AboutManufacturing.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Office building exterior | STATIC — `v1775655126/21_wnjesc.jpg` | 280×256px | Grid layout, `h-64` |
| Robotic arm in factory | STATIC — `v1775655067/19_b5qovh.jpg` | 280×192px | Grid layout, `h-48` |
| Navy blue suit fabric | STATIC — `v1775655124/20_zjtk2y.jpg` | 280×192px | Grid layout, `h-48` |
| Textile weaving floor | STATIC — `v1775655065/18_f7x5gw.jpg` | 280×256px | Grid layout, `h-64` |

### AboutLeadership — `src/components/about/AboutLeadership.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Single leader portrait | DYNAMIC — `author.authorimageWeb ?? author.authorimage` from `getAuthors()` API | 480×640px (single layout) | `aspect-[3/4]`, grayscale hover effect |
| Multiple leader portraits | DYNAMIC — same fields, grid layout | 400×533px each | `aspect-[3/4]`, grid of 3 |

---

## 4. CAPABILITIES PAGE — `src/pages/capabilities.astro`

### CapabilitiesHero — `src/components/capabilities/CapabilitiesHero.astro`
No images — text/icon only hero.

### CapabilitiesPillars — `src/components/capabilities/CapabilitiesPillars.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| "Industrial Customization" pillar image | DYNAMIC — `seo.image1CloudUrl` from `getTopicPageBySlug("capabilities")` | 192×192px display (`h-48 w-48`) | Only shown in the wide "Industrial Customization" card |

### CapabilitiesQuality — `src/components/capabilities/CapabilitiesQuality.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Quality control lab image | DYNAMIC — `seo.image2CloudUrl` from `getTopicPageBySlug("capabilities")`. Fallback: Google lh3 URL | 600×600px. Container: `aspect-square lg:h-[600px]` | `opacity-60`, dark overlay |

---

## 5. CERTIFICATIONS PAGE — `src/pages/certifications.astro`

### CertificationsHero — `src/components/certifications/CertificationsHero.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Hero background | DYNAMIC — `seo.image1CloudUrlHero ?? image1CloudUrl` from `getTopicPageBySlug("certification")`. Fallback: Unsplash `photo-1558618666` | 1600×614px | `opacity-20`, full-cover background. Container: `h-[500px] md:h-[614px]` |

### CertificationsGrid — `src/components/certifications/CertificationsGrid.astro`
No images — icon-based cards only.

### CertificationsTrust — `src/components/certifications/CertificationsTrust.astro`
No images — icon + text only.

---

## 6. CAREERS PAGE — `src/pages/careers.astro`

### CareersHero — `src/components/careers/CareersHero.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Hero background | DYNAMIC — `seo.image1CloudUrlHero ?? image1CloudUrl` from `getTopicPageBySlug("career")`. Fallback: Unsplash `photo-1558618666` | 1600×900px | `opacity-30`, full-cover. Container: full viewport height |

---

## 7. SUPPORT / CONTACT PAGE — `src/pages/support.astro`

### SupportHero — `src/components/support/SupportHero.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Hero background | DYNAMIC — `seo.image1CloudUrl` from `getTopicPageBySlug("contact")`. Fallback: Unsplash `photo-1521737604893` | 800×525px | `opacity-30`, full-cover background |

### SupportDepartments — `src/components/support/SupportDepartments.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Author/Director avatar | DYNAMIC — `author.authorimageCard` from `getAuthors()` API | 48×48px (1x), 96×96px (2x) | Circular crop `c_fill,g_face`. Shown in department contact card |

---

## 8. FAQ PAGE — `src/pages/faq.astro`

### FAQHero — `src/components/faq/FAQHero.astro`
No images — gradient background only.

---

## 9. BLOG INDEX — `src/pages/blog/index.astro`

### BlogHero — `src/components/blog/BlogHero.astro`
No images — text/search only.

### BlogDynamicGrid — `src/components/blog/BlogDynamicGrid.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Featured post image | DYNAMIC — `getPostImage(post)` from blog API (`blogimage1CloudURL`) | 800×550px. Srcset: 400w, 800w, 1200w | `sizes="(max-width:768px) 100vw, 66vw"`. Container: `h-[400px] md:h-[550px]` |
| Grid post thumbnails | DYNAMIC — `getPostImage(post)` for each post | 400×225px (16:9). Srcset: 400w, 800w | `sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"`. `aspect-video` |

---

## 10. BLOG POST DETAIL — `src/pages/blog/[slug].astro`

### BlogDynamicPostHero — `src/components/blog/BlogDynamicPostHero.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Post hero image | DYNAMIC — `getPostImage(post)` → `post.blogimage1CloudURL` | 960×500px. Srcset: 400w, 768w, 960w | `loading="eager"`, `fetchpriority="high"`. Container: `h-[300px] md:h-[500px]` |

---

## 11. FABRIC CATALOG — `src/pages/fabric/index.astro`

### FabricListLayout Hero Banner
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Hero banner background | DYNAMIC — `seo.image1CloudUrl` from `getTopicPageBySlug("fabric")`. Fallback: `v1775652305/17_y6ajol.jpg` | 960×300px. Srcset: 640w, 960w, 1280w | `loading="eager"`. Container: `h-[250px] md:h-[300px]` |

### ProductCard — `src/components/product/ProductCard.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Product card image | DYNAMIC — `product.image` (mapped from `image1CloudUrlCard ?? image1CloudUrl`) | 400×267px (3:2). Srcset: 320w, 400w, 560w, 720w, 880w | `sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"`. Container: `h-64` |

### ProductGuide — `src/components/product/ProductGuide.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Guide section image | DYNAMIC — `seo.image2CloudUrl` from `getTopicPageBySlug("fabric")`. Fallback: `v1775651164/2_bc4m1l.jpg` | 600×600px (square) | Grayscale hover effect. Hidden on mobile (`hidden sm:block`) |

---

## 12. FABRIC PRODUCT DETAIL — `src/pages/fabric/[productSlug].astro`

### ProductDetailHero — `src/components/product/ProductDetailHero.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Main product image (slide 1) | DYNAMIC — `product.image1` (`image1CloudUrl`) | 700×467px. Srcset: 480w, 700w, 960w, 1200w | `loading="eager"`, `fetchpriority="high"`. Container: `h-[350px] lg:h-[600px]` |
| Product image 2 | DYNAMIC — `product.image2` (`image2CloudUrl`) | 700×467px | Same container |
| Product image 3 | DYNAMIC — `product.image3` (`image3CloudUrl`) | 700×467px | Same container |
| Collection image | DYNAMIC — `product.collectionImage` (`collection.collectionImage1CloudUrl`) | 700×467px | Same container |
| Thumbnail 1–4 | DYNAMIC — same images at thumbnail size | 80×80px | Desktop only. `c_fill,g_auto` |
| YouTube thumbnail | DYNAMIC — `https://img.youtube.com/vi/{id}/mqdefault.jpg` | 80×80px | When `product.collectionVideoURL` is a YouTube link |

### ProductDetailRelated — `src/components/product/ProductDetailRelated.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Related product images | DYNAMIC — `rel.image1` from same collection | 400×267px (3:2). Srcset: 200w, 400w, 600w | `sizes="(max-width:768px) 50vw, 25vw"`. Container: `aspect-[3/2]` |

---

## 13. CATEGORY PAGE — `src/pages/category/[slug].astro`

Uses `FabricListLayout` — same images as Fabric Catalog (hero from `page.image2CloudUrlHero ?? image2CloudUrl`, guide from `page.image3CloudUrl`).

### Category Product Detail — `src/pages/category/[categorySlug]/[productSlug].astro`
Same as Fabric Product Detail above (uses `ProductDetailHero`, `ProductDetailRelated`).

---

## 14. COLLECTION PAGE — `src/pages/collection/[slug].astro`

Uses `FabricListLayout` — hero from `page.image1CloudUrlHero ?? image1CloudUrl`.

### Collection Product Detail — `src/pages/collection/[collectionSlug]/[productSlug].astro`
Same as Fabric Product Detail above.

---

## 15. INDUSTRY PAGES — `src/pages/industry/`

### IndustryHero — `src/components/industry/IndustryHero.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Hero background | DYNAMIC (for `/industry/[slug]`) — `industry.heroImage` from `src/data/industries.ts` (currently no image set for dynamic slugs). Default fallback: `v1775636524/Industries_cssian.jpg` | 1440×618px | `loading="eager"`. Container: `h-[618px]` |

### IndustryRecommendedProducts — `src/components/industry/IndustryRecommendedProducts.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Featured product image | DYNAMIC prop or default: `v1775651584/4_xlq2b0.jpg` | 800×224px (`h-56 w-full`) | `object-cover`, rounded top |

### home-textile.astro (static industry page)
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Hero background | STATIC — `v1775650985/1_kgn4so.jpg` | Full-width, `min-h-[707px]` | `opacity-40` |
| Majestica-767 product | STATIC — `v1775652244/15_zlts4h.jpg` | ~50% of card width | `object-cover`, hover scale |
| Industrial Twill (bg) | STATIC — `v1775651586/3_ptvdom.jpg` | Decorative, `w-3/4 opacity-30` | Rotated background |
| Ahmedabad HQ map | STATIC — `v1775652246/16_ank94j.jpg` | `aspect-square` | Location section |

---

## 16. PRODUCT & LOCATION PAGES — `src/pages/product-location/`

### PLListingHero — `src/components/productandlocation/PLListingHero.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Hero background | STATIC — `v1775652305/17_y6ajol.jpg` | 1600×900px | `opacity-30`, `loading="eager"` |

### PLHero — `src/components/productandlocation/PLHero.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Product-location hero | DYNAMIC — `data.image1CloudUrl ?? product.image1CloudUrlHero ?? product.image1CloudUrl` from `getAllProductLocations()` API | 1600×900px | `loading="eager"`, `fetchpriority="high"`. Full-cover with gradient overlay |

### PLProductDetail — `src/components/productandlocation/PLProductDetail.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Main gallery image 1 | DYNAMIC — `product.image1CloudUrlHero ?? image1CloudUrl` | 800×1000px (4:5 aspect) | `loading="eager"` |
| Gallery image 2 | DYNAMIC — `product.image2CloudUrl` | 800×1000px | `loading="lazy"` |
| Gallery image 3 | DYNAMIC — `product.image3CloudUrl` | 800×1000px | `loading="lazy"` |
| Collection image | DYNAMIC — `product.collection.collectionImage1CloudUrlHero ?? collectionImage1CloudUrl` | 800×1000px | `loading="lazy"` |
| Thumbnails | DYNAMIC — same images | 80×80px | `c_fill` square crop |
| YouTube thumbnail | DYNAMIC — `img.youtube.com/vi/{id}/mqdefault.jpg` | 80×80px | When collection has video |

### PLCollection — `src/components/productandlocation/PLCollection.astro`
| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Collection product cards | DYNAMIC — `p.image1CloudUrlHero ?? image1CloudUrl` from `getProductsByCollectionId()` API | 600×800px (3:4). Up to 6 cards | `aspect-[3/4]`, hover scale |

---

## 17. AHMEDABAD HUB PAGE — `src/pages/ahmedabad-hub.astro`

| Image | Source | Size Needed | Notes |
|-------|--------|-------------|-------|
| Hero background | STATIC — `v1775651644/5_enanbg.jpg` | Full-width, `min-h-[680px]` | `opacity-40` |
| Precision Manufacturing | STATIC — `v1775652007/10_m9djmz.jpg` | ~50% of card (`aspect-square`) | Hover scale |

---

## SUMMARY TABLE — ALL DYNAMIC API IMAGE FIELDS

| API Endpoint / Object | Image Fields Used | Where Used |
|---|---|---|
| `getCompanyInfo()` | `logoUrl` | Header logo (every page) |
| `getTopicPageBySlug("home")` | `image1CloudUrl`, `image1CloudUrlHero` | Home hero |
| `getTopicPageBySlug("about")` | `image1CloudUrl`, `image1CloudUrlHero`, `image2CloudUrl` | About hero, mission/vision |
| `getTopicPageBySlug("capabilities")` | `image1CloudUrl`, `image2CloudUrl` | Capabilities pillars, quality hub |
| `getTopicPageBySlug("certification")` | `image1CloudUrl`, `image1CloudUrlHero` | Certifications hero |
| `getTopicPageBySlug("career")` | `image1CloudUrl`, `image1CloudUrlHero` | Careers hero |
| `getTopicPageBySlug("contact")` | `image1CloudUrl` | Support hero |
| `getTopicPageBySlug("fabric")` | `image1CloudUrl`, `image2CloudUrl` | Fabric catalog hero + guide |
| `getTopicPageBySlug("blog")` | `image1CloudUrl`, `image1CloudUrlHero` | Blog OG image |
| `getTopicPageBySlug("product-location")` | `image1CloudUrl`, `image1CloudUrlHero` | PL listing OG |
| `getCategoryTopicPages()` | `image1CloudUrlCard`, `image1CloudUrl`, `image2CloudUrlHero`, `image2CloudUrl`, `image3CloudUrl` | Category cards (home), category hero, guide |
| `getDynamicTopicPages()` | `image1CloudUrl`, `image1CloudUrlHero` | Collection hero |
| `getProducts()` / `fetchProducts()` | `image1CloudUrl`, `image1CloudUrlCard`, `image1CloudUrlHero`, `image1CloudUrlWeb`, `image2CloudUrl`, `image3CloudUrl`, `collection.collectionImage1CloudUrl`, `collection.collectionImage1CloudUrlHero` | Product cards, detail gallery, related, thumbnails |
| `getAuthors()` | `authorimage`, `authorimageWeb`, `authorimageCard`, `altimage` | About leadership, Support departments |
| `getBlogPosts()` / `fetchBlogPosts()` | `blogimage1CloudURL`, `featuredImageAlt` | Blog grid, blog hero, knowledge preview |
| `getAllProductLocations()` | `image1CloudUrl`, `image1CloudUrlHero`, `product.image1CloudUrl`, `product.image1CloudUrlHero`, `product.image2CloudUrl`, `product.image3CloudUrl`, `product.collection.collectionImage1CloudUrl` | PL hero, PL gallery |

---

## SUMMARY TABLE — ALL STATIC (HARDCODED) CLOUDINARY IMAGES

| Cloudinary Public ID | Used In | Display Size | Purpose |
|---|---|---|---|
| `v1775651646/6_fytaun.jpg` | CertificationsPreview (Home) | 64×64px | OEKO-TEX logo |
| `v1775652064/11_accl32.jpg` | CertificationsPreview (Home) | 64×64px | ISO 9001 logo |
| `v1775652005/9_wizefk.jpg` | CapabilitiesPreview (Home) | 512×512px | Manufacturing floor |
| `v1775652187/14_ith7ry.jpg` | CapabilitiesPreview (Home) | 512×512px | Lab quality check |
| `v1775655126/21_wnjesc.jpg` | AboutManufacturing | 280×256px | Office building |
| `v1775655067/19_b5qovh.jpg` | AboutManufacturing | 280×192px | Robotic arm |
| `v1775655124/20_zjtk2y.jpg` | AboutManufacturing | 280×192px | Navy suit fabric |
| `v1775655065/18_f7x5gw.jpg` | AboutManufacturing | 280×256px | Weaving floor |
| `v1775651164/2_bc4m1l.jpg` | ProductGuide (fallback) | 600×600px | Fabric guide |
| `v1775636524/Industries_cssian.jpg` | IndustryHero (default) | 1440×618px | Industry hero bg |
| `v1775651584/4_xlq2b0.jpg` | IndustryRecommendedProducts | 800×224px | Product showcase |
| `v1775650985/1_kgn4so.jpg` | home-textile.astro hero | Full-width | Industrial loom |
| `v1775652244/15_zlts4h.jpg` | home-textile.astro | ~50% card | Majestica-767 |
| `v1775651586/3_ptvdom.jpg` | home-textile.astro | Decorative | Industrial twill |
| `v1775652246/16_ank94j.jpg` | home-textile.astro | aspect-square | Ahmedabad map |
| `v1775652305/17_y6ajol.jpg` | PLListingHero, Fabric hero fallback | 1600×900px | Fabric supply |
| `v1775651644/5_enanbg.jpg` | ahmedabad-hub.astro hero | Full-width | Aerial factory |
| `v1775652007/10_m9djmz.jpg` | ahmedabad-hub.astro | aspect-square | Weaving loom |
| `About1_j3mzld.jpg` | AboutHero fallback | 1024×870px | About hero bg |

---

## FALLBACK / EXTERNAL IMAGES (Non-Cloudinary)

| URL | Used In | Notes |
|---|---|---|
| `images.unsplash.com/photo-1558618666` | CertificationsHero fallback, CareersHero fallback | Replace with Cloudinary upload |
| `images.unsplash.com/photo-1521737604893` | SupportHero fallback | Replace with Cloudinary upload |
| `lh3.googleusercontent.com/aida-public/...` | CapabilitiesQuality fallback, About OG fallback | Replace with Cloudinary upload |
| `img.youtube.com/vi/{id}/mqdefault.jpg` | Product gallery YouTube thumbnails | Auto-generated, no action needed |
| `/images/icons/my_logo.png` | Header logo local fallback | Static file in `/public/images/icons/` |

---

## RECOMMENDED IMAGE SIZES FOR BACKEND (UPLOAD GUIDE)

| Image Type | Recommended Upload Size | Aspect Ratio | Notes |
|---|---|---|---|
| Company Logo | 200×200px min | 1:1 | Cloudinary will resize to 36px/72px |
| Topic Page Hero (About, Capabilities, etc.) | 1280×870px | ~3:2 landscape | Used at full-width hero |
| Topic Page Hero (Fabric, Category, Collection) | 1280×300px | ~4:1 banner | Short banner hero |
| Topic Page Image 2 (guide/mission) | 800×1000px | 4:5 portrait | Used in 2-col layout |
| Topic Page Image 3 (guide section) | 800×800px | 1:1 | Guide section sidebar |
| Category Card Image | 720×960px | 3:4 portrait | `image1CloudUrlCard` |
| Product Image 1 (main) | 1200×800px | 3:2 landscape | Hero gallery slot |
| Product Image 2 & 3 | 1200×800px | 3:2 landscape | Gallery slides |
| Collection Image | 1200×800px | 3:2 landscape | Gallery slide |
| Blog Post Image | 1200×630px | ~16:9 | Hero + grid card |
| Author Portrait (Leadership) | 800×1067px | 3:4 portrait | `authorimageWeb` |
| Author Avatar (Departments) | 200×200px | 1:1 | `authorimageCard`, face crop |
| Product-Location Hero | 1600×900px | 16:9 | Full-bleed hero |
| Industry Hero | 1440×618px | ~7:3 | Full-width hero |
| Certification Logos | 200×200px | 1:1 | `object-contain` display |
