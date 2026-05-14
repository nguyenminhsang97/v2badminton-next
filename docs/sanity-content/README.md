# Week 2 — Money Page Sanity Content Drafts

This folder contains draft Portable Text content for the 9 money pages listed in §6 of [seo-aeo-30-day-unified-plan.md](../seo-aeo-30-day-unified-plan.md). Each file is one money page, structured to match the Sanity schemas in `src/sanity/schemaTypes/`.

## File format

Each `NN-<slug>.json` file contains three sections:

1. **`moneyPage`** — A `money_page` document object with every scalar + Portable Text field filled. Drop into Sanity Studio via copy-paste per field, or import via `@sanity/cli` after wiring references (see §3).
2. **`newFaqs`** — 5 new `faq` document objects to create in Sanity Studio. Each has Portable Text `answer`, `pages` tag, `includeInSchema: true`, and a sensible `order`.
3. **`referenceWiring`** — Three lists naming which existing/new documents to link as `relatedLocations`, `relatedPricing`, and `relatedFaqs` on the money page. Existing locations and pricing tiers are identified by their `slug.current` value; new FAQs are matched by `question` since they don't have slugs.

## How to publish a page

1. Open Sanity Studio → `Câu hỏi thường gặp` (faq). Create each entry in `newFaqs`. Publish.
2. Open the `money_page` document for the slug (or create it). Paste each field from `moneyPage` (slug, audience, h1, metaTitle, metaDescription, intro, body, ctaLabel).
3. Wire references:
   - `relatedLocations` → pick the location docs whose slug matches each entry in `referenceWiring.relatedLocations`.
   - `relatedPricing` → pick the pricing_tier docs whose slug matches each entry in `referenceWiring.relatedPricing`.
   - `relatedFaqs` → pick the FAQs you just created in step 1.
4. Publish the `money_page`.

Once published, the W1.2 sitemap gate + W1.3 noindex fallback + W1.8 QuickAnswer all flip automatically (no code change needed). Verify per the plan §6 Task W2.1 checklist.

## Writing rules followed (W2.3)

Each page in this folder follows the answer-first rules:

- **First paragraph** directly answers "what is this page about, who is it for, where, how much?"
- **H2s are questions** ("Học 1 kèm 1 phù hợp với ai?" not "Đối tượng phù hợp")
- **Concrete entities** — every section names a court, district, VND amount, or time window
- **≥5 FAQs** with `includeInSchema: true`
- **Comparison block** included for `/hoc-cau-long-1-kem-1/` and `/gia-hoc-cau-long-tphcm/`

## Status

- [x] **Page 1 — `/hoc-cau-long-1-kem-1/`** — `01-hoc-cau-long-1-kem-1.json` (reference template)
- [ ] Pages 2–9 — pending Page 1 format/tone sign-off

After Page 1 is approved, the remaining 8 follow the same JSON shape.
