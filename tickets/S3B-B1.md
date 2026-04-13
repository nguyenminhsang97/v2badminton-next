# S3B-B1: Add `getMoneyPage(slug)`

## Objective

Them typed query cho `money_page` documents, bao gom dereference sang locations, pricing, va FAQs lien quan.

## Input

- `src/lib/sanity/queries.ts`
- `src/lib/sanity/index.ts`
- `src/sanity/schemaTypes/moneyPage.ts`
- Reusable projections da co trong query layer cho locations / pricing / faqs

## Output

```text
src/lib/sanity/queries.ts
src/lib/sanity/index.ts
```

Them:

- `SanityMoneyPage`
- `getMoneyPage(slug)`

## Dependency

- Sprint 2 done

## Priority

- P0

## Data Shape

```ts
type SanityMoneyPage = {
  id: string;
  slug: string;
  audience: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: SanityPortableTextBlock[];
  body: SanityPortableTextBlock[];
  heroImageUrl: string | null;
  relatedLocations: SanityLocation[];
  relatedPricing: SanityPricingTier[];
  relatedFaqs: SanityFaq[];
  ctaLabel: string;
};
```

## Acceptance Criteria

1. `queries.ts` export type `SanityMoneyPage`.
2. `getMoneyPage(slug)` dung `react.cache()`.
3. Query:
   - `_type == "money_page"`
   - `slug.current == $slug`
   - published-only
4. Projection co day du fields trong data shape.
5. `relatedLocations`, `relatedPricing`, `relatedFaqs` dung dereference `[]->`.
6. Neu khong tim thay document -> tra `null`, khong tra fallback object.
7. Khong duplicate projection logic mot cach kho doc; nen reuse inline projections da co o query layer neu hop ly.
8. `index.ts` barrel export type va query.
9. `npm run lint` va `npm run build` pass.

## Slug Notes

Goi y 6 slugs:

- `hoc-cau-long-cho-nguoi-moi`
- `lop-cau-long-binh-thanh`
- `lop-cau-long-thu-duc`
- `lop-cau-long-tre-em`
- `lop-cau-long-cho-nguoi-di-lam`
- `cau-long-doanh-nghiep`

## Edge Cases

### 1. `intro`

Co the rong -> nen `coalesce(intro, [])`.

### 2. `body`

Schema yeu cau bat buoc, nhung query type van phai an toan neu data xau.

### 3. Missing references

Related arrays co the rong, nhung khong duoc crash caller.

## Non-Scope

- Chua build template
- Chua wire vao routes
- Chua doi `routes.ts`

## Risk / Luu y

- Day la query quan trong nhat cua 3B. Neu return shape loi type, page/template se vo hang loat.
