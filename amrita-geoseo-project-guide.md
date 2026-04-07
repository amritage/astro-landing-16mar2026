# Amrita GeoSEO Fabric Frontend — Project Guide

## 1) What this project is
This project is the **Astro-based marketing / SEO / GeoSEO frontend** for your fabric business.

Its main job is:
- product discovery
- category pages
- location landing pages
- industry pages
- blog and guides
- trust pages
- lead generation
- AI-readable content such as FAQ, summaries, `llms.txt`, and AI feed pages

It is **not** meant to be the heavy commerce app. Wishlist, cart, checkout, account, and orders should stay in the separate catalogue/shop frontend. This matches your project documentation. fileciteturn3file5turn3file4

---

## 2) Current known setup

### Known running framework version
- **Astro:** `6.0.8`  
  This is confirmed from your local dev server screenshot.

### Important note about package versions
Your local project versions are finally decided by your own `package.json` and lock file.
Because the current conversation only confirms Astro `6.0.8`, treat the rest of this guide as:
- **used / recommended packages for this project**, and
- **the structure and purpose of each package**

To see exact local installed versions at any time, run:

```bash
npm list --depth=0
```

Or open:

```text
package.json
```

---

## 3) Top-level folder structure

```text
amrita-geoseo-fabric-frontend/
├── public/
├── src/
├── .vscode/
├── package.json
├── astro.config.mjs
├── tsconfig.json
├── README.md
└── .gitignore
```

### How to understand this
- `public/` = direct static files
- `src/` = all project source code
- `package.json` = dependencies and scripts
- `astro.config.mjs` = Astro project configuration
- `tsconfig.json` = TypeScript rules
- `README.md` = project notes and usage

---

## 4) `public/` folder

`public/` is for files that should be served directly by URL.

### Your structure
- `public/manifest.webmanifest`
- `public/robots.txt`
- `public/llms.txt`
- `public/images/brand/`
- `public/images/icons/`
- `public/images/placeholders/`
- `public/documents/`

### How to use it
Use `public/` for:
- favicon
- robots file
- AI crawler readable files like `llms.txt`
- static logos
- placeholder images
- downloadable PDFs/documents

### Example
If you place a file here:

```text
public/images/brand/logo.png
```

then it becomes available at:

```text
/images/brand/logo.png
```

---

## 5) `src/` folder

This is the main application folder.

### Main areas inside `src/`
- `assets/`
- `components/`
- `content/`
- `data/`
- `layouts/`
- `lib/`
- `pages/`
- `scripts/`
- `styles/`
- `content.config.ts`
- `env.d.ts`

---

## 6) `src/assets/`

### Purpose
This is for local project assets that are imported into code.

### Your folders
- `src/assets/icons/`
- `src/assets/fonts/`
- `src/assets/static/`

### Use it for
- local SVG/icon files
- WOFF2 font files
- small decorative graphics
- local illustrations if they are part of build imports

### Do not use it for
- product catalog images from backend
- large downloadable files
- things that should be served directly without bundling

For product images, your documentation prefers Cloudinary as the main image source. fileciteturn3file1turn3file4

---

## 7) `src/components/`

This is the **UI component library** of the project.

You divided it very well by page family.

### A) `src/components/common/`
Reusable UI used across many pages.

Examples:
- `SeoHead.astro`
- `SchemaMarkup.astro`
- `Breadcrumbs.astro`
- `SectionHeading.astro`
- `Button.astro`
- `Badge.astro`
- `FAQBlock.astro`
- `PageSummaryBlock.astro`
- `WhatsAppButton.astro`
- `CallButton.astro`
- `ShareButtons.astro`
- `StickyLeadBar.astro`
- `LeadForm.astro`
- `MultiStepContactForm.astro`
- `InternalLinksGrid.astro`
- `CTASection.astro`
- `SearchBox.astro`
- `Pagination.astro`
- `EmptyState.astro`

### How to use it
Put components here when they can be reused on multiple page types.

### Best examples
- `SeoHead.astro` for title, meta, canonical, OG tags
- `FAQBlock.astro` for FAQ section on product, location, support, guide pages
- `PageSummaryBlock.astro` for AI-readable summary block
- `LeadForm.astro` for inquiry form

Your documentation explicitly requires FAQ, page summaries, internal linking, and CTA-related components. fileciteturn3file0turn3file5

### B) `src/components/layout/`
Global site layout pieces.

Examples:
- `TopBar.astro`
- `Header.astro`
- `MegaMenu.astro`
- `MobileMenu.astro`
- `Footer.astro`
- `CookieConsent.astro`

### Use it for
- navigation
- header CTA buttons
- footer links
- cookie consent banner
- mobile navigation logic

### C) `src/components/home/`
Homepage-only sections.

Examples:
- `HeroSection.astro`
- `TrustSignals.astro`
- `FeaturedCategories.astro`
- `FeaturedProducts.astro`
- `IndustriesSection.astro`
- `LocationsSection.astro`
- `CapabilitiesPreview.astro`
- `CertificationsPreview.astro`
- `KnowledgePreview.astro`
- `HomepageFAQ.astro`

### D) `src/components/product/`
Product detail page sections.

Examples:
- `ProductHero.astro`
- `ProductGallery.astro`
- `ProductSpecsStrip.astro`
- `ProductSpecsTable.astro`
- `ProductUseCases.astro`
- `ProductApplications.astro`
- `ProductCertifications.astro`
- `ProductFAQ.astro`
- `ProductLeadPanel.astro`
- `RelatedProducts.astro`
- `RelatedLocations.astro`
- `RelatedIndustries.astro`
- `RelatedGuides.astro`

### E) `src/components/category/`
Category landing page sections.

Examples:
- `CategoryHero.astro`
- `CategoryIntro.astro`
- `CategoryGrid.astro`
- `CategoryFilters.astro`
- `CategoryFAQ.astro`
- `CategoryInternalLinks.astro`

### F) `src/components/location/`
Location SEO page sections.

Examples:
- `LocationHero.astro`
- `LocationIntro.astro`
- `LocationSupplyInfo.astro`
- `LocationProductGrid.astro`
- `LocationIndustries.astro`
- `LocationFAQ.astro`
- `LocationCTA.astro`

### G) `src/components/industry/`
Industry solution pages.

Examples:
- `IndustryHero.astro`
- `IndustryOverview.astro`
- `IndustryRequirements.astro`
- `IndustryRecommendedProducts.astro`
- `IndustryComparisonTable.astro`
- `IndustryFAQ.astro`
- `IndustryCTA.astro`

### H) `src/components/blog/`
Blog and guide presentation components.

Examples:
- `BlogCard.astro`
- `BlogSidebar.astro`
- `BlogTOC.astro`
- `BlogAuthorBox.astro`
- `BlogRelatedPosts.astro`

### I) `src/components/trust/`
Trust, company, export, and brand authority sections.

Examples:
- `AboutIntro.astro`
- `MissionVision.astro`
- `ManufacturingStrengths.astro`
- `CertificationsList.astro`
- `ExportCapabilities.astro`
- `ShippingInfo.astro`
- `SupportChannels.astro`

### J) `src/components/compare/`
Comparison pages.

Examples:
- `CompareHero.astro`
- `CompareTable.astro`
- `CompareCTA.astro`

---

## 8) `src/content/`

This folder is for structured content collections.

### Your folders
- `src/content/blog/`
- `src/content/guides/`
- `src/content/faq/`
- `src/content/policies/`
- `src/content/locations/`
- `src/content/industries/`
- `src/content/categories/`

### Use it for
- MDX or markdown content
- editorial blog articles
- guides
- FAQs
- policy pages
- structured location content where useful

### Best rule
If content is mostly editorial and text-first, keep it in `src/content/`.
If content is API-first from backend, handle it through `src/lib/api/`.

Your documentation clearly says blog, guides, FAQs, policies, and AI-readable content are part of this frontend. fileciteturn3file1turn3file0

---

## 9) `src/data/`

This folder is for **static or semi-static project data**.

### Files
- `site.ts`
- `navigation.ts`
- `trust.ts`
- `faqs.ts`
- `industries.ts`
- `locations.ts`
- `categories.ts`

### Use it for
- navigation links
- brand contact info
- static trust badges
- frequently reused labels
- fallback data
- small config maps

### Do not use it for
- live backend product inventory
- dynamic search results
- full commerce data

---

## 10) `src/layouts/`

Layouts wrap pages and provide shared page structure.

### Files
- `BaseLayout.astro`
- `LandingLayout.astro`
- `ProductLayout.astro`
- `ContentLayout.astro`
- `CompareLayout.astro`
- `TrustLayout.astro`

### How to use them
- `BaseLayout.astro` = base HTML shell, head tags, fonts, global CSS
- `LandingLayout.astro` = location/category/industry landing pages
- `ProductLayout.astro` = product detail pages
- `ContentLayout.astro` = blog/guides/pages with article styling
- `CompareLayout.astro` = compare pages
- `TrustLayout.astro` = about/support/shipping/capabilities pages

### Example
A page can do:

```astro
---
import ProductLayout from '@/layouts/ProductLayout.astro';
---

<ProductLayout title="Cotton Fabric">
  ...
</ProductLayout>
```

---

## 11) `src/lib/`

This is the **logic layer** of the project.

### A) `src/lib/api/`
Backend/API access helpers.

Files:
- `products.ts`
- `categories.ts`
- `locations.ts`
- `industries.ts`
- `blog.ts`
- `site-settings.ts`

### Use it for
- fetch product list
- fetch product detail
- fetch category data
- fetch location page data
- fetch industry data
- fetch CMS/blog data

### Best rule
Keep fetch code here, not inside page files everywhere.

### B) `src/lib/seo/`
SEO helpers.

Files:
- `meta.ts`
- `schema.ts`
- `breadcrumbs.ts`
- `canonical.ts`
- `hreflang.ts`
- `robots.ts`

### Use it for
- page meta creation
- JSON-LD schema
- canonical URL generation
- breadcrumb logic
- robots rules
- hreflang logic if needed

Your documentation strongly focuses on structured data, canonical control, AI summaries, llms, and strong technical SEO. fileciteturn3file5turn3file3

### C) `src/lib/ai/`
Helpers for AI-readable output.

Files:
- `feed.ts`
- `llms.ts`
- `page-summary.ts`

### Use it for
- `llms.txt` generation
- AI feed JSON generation
- page summary generation
- structured AI-readable snippets

### D) `src/lib/forms/`
Form and validation logic.

Files:
- `validation.ts`
- `inquiry.ts`
- `contact.ts`

### Use it for
- inquiry form validation
- contact form validation
- payload shaping
- email request preparation

### E) `src/lib/utils/`
Reusable helper functions.

Files:
- `cloudinary.ts`
- `slugify.ts`
- `format.ts`
- `phone.ts`
- `links.ts`
- `reading-time.ts`

### Use it for
- Cloudinary URL building
- slug generation
- string formatting
- phone formatting
- URL handling
- reading time for blog/guides

---

## 12) `src/pages/`

This is the most important folder in Astro.
Every file here becomes a route.

### Static pages
- `index.astro` → `/`
- `about.astro` → `/about`
- `capabilities.astro` → `/capabilities`
- `certifications.astro` → `/certifications`
- `faq.astro` → `/faq`
- `shipping.astro` → `/shipping`
- `support.astro` → `/support`
- `contact.astro` → `/support`
- `careers.astro` → `/careers`
- `search.astro` → `/search`
- `thank-you.astro` → `/thank-you`
- `404.astro` → custom not found page

### Dynamic and nested routes
- `fabric/index.astro` → `/fabric`
- `fabric/[productSlug].astro` → `/fabric/:productSlug`
- `category/[categorySlug].astro` → `/category/:categorySlug`
- `location/[citySlug].astro` → `/location/:citySlug`
- `industry/[industrySlug].astro` → `/industry/:industrySlug`
- `compare/[slug].astro` → `/compare/:slug`
- `blog/index.astro` → `/blog`
- `blog/[slug].astro` → `/blog/:slug`
- `guides/index.astro` → `/guides`
- `guides/[slug].astro` → `/guides/:slug`

### Important Astro rule
Use parameter names like:
- `[productSlug]`
- `[categorySlug]`
- `[citySlug]`

Do **not** use:
- `[product-slug]`
- `[city-slug]`

because Astro parameter names cannot contain `-`.

### API endpoints
- `api/inquiry.ts`
- `api/support.ts`
- `api/search.ts`

These can handle:
- form submit API
- contact API
- internal search API if needed

### AI + sitemap endpoints
- `ai-feed.json.ts`
- `llms-full.txt.ts`
- `sitemap.xml.ts`

These support SEO, AI crawlers, and content discovery. Your documentation explicitly calls for `llms.txt`, AI feed JSON, and sitemap support. fileciteturn3file5turn3file4

---

## 13) `src/scripts/`

This folder is for small browser-side scripts.

Files:
- `sticky-cta.ts`
- `mobile-menu.ts`
- `share.ts`
- `contact-steps.ts`
- `filters.ts`
- `search.ts`
- `cookie-consent.ts`

### Use it for
- menu toggle
- sticky CTA behavior
- share button logic
- multi-step contact form behavior
- lightweight filters
- local search behavior
- cookie consent logic

### Best rule
Keep scripts here small and targeted.
Do not turn this Astro frontend into a heavy client-side app.

---

## 14) `src/styles/`

This folder keeps CSS organized.

Files:
- `global.css`
- `tokens.css`
- `typography.css`
- `utilities.css`
- `forms.css`
- `prose.css`

### How to use them
- `global.css` = imports, resets, global base
- `tokens.css` = colors, radius, spacing, design tokens
- `typography.css` = headings, body text, lists
- `utilities.css` = custom utility classes if needed
- `forms.css` = inquiry/support/search form styles
- `prose.css` = blog/article/legal content styling

### Best rule
Use Tailwind for most layout and utility work. Use these CSS files for:
- project-wide design tokens
- prose styles
- form-specific styling
- controlled custom rules

Your document says Tailwind should be used for layout, spacing, grid, and responsive utilities. fileciteturn3file1turn3file4

---

## 15) `src/content.config.ts`

This file controls Astro content collections.

### Current role
Since your script created it empty, it must at least export collections.

### Minimum valid content
```ts
import { defineCollection, z } from 'astro:content';

export const collections = {};
```

### Later use
When blog/guides/faq content becomes real, define collections here.

---

## 16) `src/env.d.ts`

TypeScript environment typing file.

### Use it for
- typing custom env variables
- IntelliSense support
- safer environment usage

Examples of env values from your documentation include GA ID, Clarity ID, Cloudinary base URL, and API base URL. fileciteturn3file1

---

## 17) Key config files

### `package.json`
Controls:
- project name
- scripts
- dependencies
- devDependencies

### `astro.config.mjs`
Controls:
- site URL
- integrations
- Vite plugins
- build behavior
- image/service config
- sitemap integration

### `tsconfig.json`
Controls:
- TypeScript strictness
- path aliases
- type support

### `README.md`
Project documentation for developers.

---

## 18) Packages used / recommended for this project

Below is the package map based on your project documentation and the setup work done during this conversation.

## Core framework
- `astro`
  - main framework
  - static pages
  - dynamic routes
  - geo landing pages
  - product pages

## SEO and content
- `@astrojs/mdx`
  - blog, guides, knowledge pages
- `@astrojs/sitemap`
  - sitemap generation
- `@astrojs/rss`
  - blog RSS feed if used
- `astro-seo`
  - optional helper for meta/OG/canonical tags
- `flexsearch`
  - lightweight FAQ/blog/guide/site search

## Styling
- `tailwindcss`
- `@tailwindcss/vite`
  - Tailwind setup for Astro 6

## Validation and env
- `zod`
  - form validation, schemas, content safety
- `@t3-oss/env-core`
  - env validation
- `typescript`
  - typing, safety, helper consistency

## Icons and UI
- `astro-icon`
  - WhatsApp, call, share, chatbot, trust icons
- `vanilla-cookieconsent`
  - cookie consent banner and preferences
- `swiper`
  - only if you truly need sliders

## Forms, PDF, mail
- `nodemailer`
  - inquiry and contact emails
- `jspdf`
  - PDF export / downloadable summary
- `nanoid`
  - small IDs for requests/references

## Performance and third-party control
- `@astrojs/partytown`
  - move some third-party scripts off main thread when needed

## Testing and code quality
- `vitest`
  - unit testing
- `playwright`
  - e2e testing
- `eslint`
- `eslint-plugin-astro`
- `eslint-config-prettier`
- `eslint-plugin-unused-imports`
- `eslint-plugin-import`
- `@typescript-eslint/parser`
- `@typescript-eslint/eslint-plugin`
- `prettier`
- `prettier-plugin-astro`
- `prettier-plugin-tailwindcss`
- `husky`
- `lint-staged`

This package grouping comes directly from your project documentation, with one practical update for Astro 6: Tailwind is being handled through `tailwindcss + @tailwindcss/vite` instead of the old `@astrojs/tailwind` package flow. Your document also incorrectly mentions `swipper`; the correct package name is `swiper`. fileciteturn3file1turn3file3turn3file4

---

## 19) Important routes for this project

Your documentation says the main indexed routes should be:
- `/`
- `/fabric/`
- `/fabric/[productSlug]`
- `/category/[categorySlug]`
- `/location/[citySlug]`
- `/industry/[industrySlug]`
- `/compare/[slug]`
- `/blog/`
- `/blog/[slug]`
- `/guides/`
- `/guides/[slug]`
- `/about`
- `/capabilities`
- `/certifications`
- `/shipping`
- `/support`
- `/faq`
- `/support`

This route family supports strong internal linking between product, category, location, industry, guide, and trust pages. fileciteturn3file4turn3file5

---

## 20) What should NOT be inside this Astro frontend

Keep these in the separate shop frontend:
- login
- user profile
- wishlist
- cart
- checkout
- orders
- saved address

That separation is one of the most important architecture decisions in your documentation. fileciteturn3file4turn3file5

---

## 21) Suggested implementation order

Build in this order:

1. `src/layouts/BaseLayout.astro`
2. `src/styles/global.css`
3. `src/components/layout/Header.astro`
4. `src/components/layout/Footer.astro`
5. `src/components/common/SeoHead.astro`
6. `src/pages/index.astro`
7. `src/data/site.ts`
8. `src/lib/utils/cloudinary.ts`
9. `src/lib/seo/meta.ts`
10. `src/components/common/LeadForm.astro`
11. `src/pages/fabric/index.astro`
12. `src/pages/fabric/[productSlug].astro`
13. `src/pages/location/[citySlug].astro`
14. `src/pages/category/[categorySlug].astro`
15. `src/pages/industry/[industrySlug].astro`
16. blog and guide system
17. AI feed / llms / sitemap polish

---

## 22) Very important working rule for this project

This Astro project should stay:
- server-first
- SEO-first
- content-first
- lead-generation-focused
- lightweight on the client side

Avoid turning it into a big CSR-heavy application.

---

## 23) Commands you will often use

### Start dev server
```bash
npm run dev
```

### Build project
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Check installed package versions
```bash
npm list --depth=0
```

---

## 24) Final summary

This project structure is strong because it separates:
- layout
- reusable components
- page-specific sections
- API logic
- SEO logic
- AI helpers
- content collections
- routes
- styles

That makes the project easier to scale for:
- more products
- more city pages
- more industries
- more guides
- more SEO pages
- stronger lead generation


---

## 25) Frontend coding rules

### No JavaScript
This project does **not** use any custom JavaScript.
- No `.js` or `.ts` client-side scripts
- No `<script>` tags in components
- No client-side interactivity via JS
- Astro's server-first rendering handles everything
- If something truly needs interaction, use pure CSS techniques (checkbox hack, `:focus-within`, `details`/`summary`, etc.)

### CSS — Tailwind only
- Use **Tailwind CSS exclusively** for all styling
- No custom CSS files for layout, spacing, colors, or typography
- The `src/styles/` files (`tokens.css`, `typography.css`, etc.) are only for things Tailwind cannot handle (e.g., prose styles for MDX content, font-face declarations)
- Do not write utility classes manually — use Tailwind classes directly in markup

### Mobile-first approach
- Always write styles mobile-first
- Start with the base (smallest screen) style, then add `sm:`, `md:`, `lg:`, `xl:` breakpoint overrides
- Every component and page must be fully responsive across all screen sizes

### Icons — Lucide first, SVG fallback
- Use **Lucide icons** as the primary icon source
- If a needed icon is not available in Lucide, use an inline **SVG**
- Do not use emoji, image files, or other icon libraries for icons
- Keep SVGs minimal and accessible (add `aria-hidden="true"` on decorative icons)
