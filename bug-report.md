# Bug Report

Prepared on 2026-04-17 from a static code review of the current workspace. No code was changed while preparing this report.

## Scope

- Runtime verification was not completed because `node_modules` is not present in this workspace.
- Findings below are based on direct inspection of the checked-in source.

## Finding 2: Collection listing pages silently truncate results at 100 products

- Severity: High
- Affected route:
  - `/collection/[slug]`

### Summary

The collection page explicitly asks for all products for a merch tag by calling `getProductsByMerchTag(page.slug1, 0)`, but the helper still fetches only `limit=100` from the backend. Any collection with more than 100 matching products will be incomplete.

### Evidence

- `src/pages/collection/[slug].astro:28`
  - `getProductsByMerchTag(page.slug1, 0), // 0 = no limit, return all`
- `src/lib/api.ts:291`
  - `fetch(\`${BASE_URL}/api/product?merchtag=${encodeURIComponent(tag)}&limit=100\`, ...)`
- `src/lib/api.ts:295`
  - `return limit > 0 ? exact.slice(0, limit) : exact;`

### Actual behavior

`limit = 0` removes the local slice limit, but it does not remove the API-side `limit=100`, so the helper can never return more than the first 100 products from the backend response.

### Expected behavior

When the caller asks for all results, the helper should either paginate until exhaustion or request a sufficiently large page size consistent with the intended "all products" behavior.

### Impact

- Large collections render incomplete product grids.
- Buyers may not see the full catalogue for a collection.
- Merch-tag landing pages can appear inconsistent with the underlying data.

### Reproduction

1. Use a collection whose merch tag matches more than 100 products in the backend.
2. Open `/collection/<slug>`.
3. Count rendered products or compare against backend totals.
4. Only the first 100 matching items will be available to the page.

## Finding 3: WhatsApp CTA URLs are built with a non-standard `wa.me/+...` path

- Severity: Medium
- Affected shared helper:
  - `buildWaLink()`

### Summary

The shared WhatsApp link builder returns URLs in the form `https://wa.me/+<digits>`. Callers then use that output directly in header and sitemap CTAs. This format is risky because the helper injects a literal `+` into the path instead of returning a digits-only phone path.

### Evidence

- `src/lib/api.ts:481-484`
  - `return digits ? \`https://wa.me/+${digits}\` : null;`
- `src/layouts/Header.astro:15-16`
  - `buildWaLink(...) + "?text=..."`
- `src/pages/sitemap.astro:20`
  - `const whatsappHref = buildWaLink(company?.whatsappNumber);`

### Actual behavior

All CTAs using `buildWaLink()` inherit the `wa.me/+...` output shape.

### Expected behavior

The helper should return a WhatsApp URL format that callers can open reliably without path rewriting or redirect ambiguity.

### Impact

- "Get Quote" and similar WhatsApp CTAs may fail or behave inconsistently.
- The same broken link format can spread across multiple pages because it comes from a shared helper.

### Reproduction

1. Inspect the rendered `href` for the header "Get Quote" link.
2. Confirm the generated URL starts with `https://wa.me/+`.
3. Open the link in a browser and compare the behavior with a digits-only WhatsApp deep link.