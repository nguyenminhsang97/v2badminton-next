# S3B-C1: Build `MoneyPageTemplate`

## Objective

Tao server component template de render content that cho money pages bang cac presentational blocks da tach ra.

## Input

- `PricingCards` tu S3B-A1
- `LocationsGrid` tu S3B-A2
- `FaqList` tu S3B-A3
- `SanityMoneyPage` tu S3B-B1
- `src/app/globals.css`

## Output

```text
src/components/money-page/MoneyPageTemplate.tsx
src/app/globals.css
```

## Dependency

- S3B-A1
- S3B-A2
- S3B-A3
- S3B-B1

## Priority

- P0

## Acceptance Criteria

1. Tao `src/components/money-page/MoneyPageTemplate.tsx`.
2. File la server component.
3. Template render:
   - hero section voi `h1`
   - intro Portable Text neu co
   - `PricingCards` neu `relatedPricing.length > 0`
   - body Portable Text
   - `LocationsGrid` neu `relatedLocations.length > 0`
   - `FaqList` neu `relatedFaqs.length > 0`
   - CTA cuoi trang link `/#lien-he`
4. `PricingCards` trong template dung:
   - `ctaHref="/#lien-he"`
   - khong truyen `onEnterBusinessMode`
5. Co CSS cho:
   - `.money-page`
   - `.money-page__hero`
   - `.money-page__body`
   - `.money-page__cta`
6. Template khong emit breadcrumb schema hay FAQ JSON-LD. Phan do de page files lo.
7. `npm run lint` va `npm run build` pass.

## Implementation Note

Server component import client component la hop le.

- `MoneyPageTemplate` van la server component
- `PricingCards` co `"use client"` va tro thanh client boundary
- Chi chieu nguoc lai, client import server component, moi bi cam

## Edge Cases

### 1. CTA anchor

Khong dung `#lien-he` local vi money pages khong co in-page contact section trong Sprint 3.

### 2. Empty related arrays

Template skip block rong thay vi render section shell rong.

### 3. Portable Text typing

Neu can, cast sang `PortableTextBlock[]` o diem render, khong nhet any.

## Non-Scope

- Chua wire vao routes
- Chua them per-page contact section
- Chua them hero image rendering

## Risk / Luu y

- Template nay se tro thanh nen cho 6 money pages, nen phai de du clean de route files khong can copy/paste JSX lon.
