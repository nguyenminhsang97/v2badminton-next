# S3B-A1: Extract `PricingCards`

## Objective

Tach pricing cards thanh block tai su dung duoc cho homepage va money pages, nhung van giu enterprise behavior cua homepage thong qua callback prop.

## Input

- `src/components/home/PricingSection.tsx`
- Homepage pricing hien la client component va dung `useHomepageConversion`

## Output

```text
src/components/blocks/PricingCards.tsx
src/components/home/PricingSection.tsx
```

## Dependency

- Sprint 2 done

## Priority

- P0

## Required API

```ts
type PricingCardsProps = {
  tiers: SanityPricingTier[];
  ctaHref: string;
  trackingLocation: string;
  onEnterBusinessMode?: () => void;
};
```

## Acceptance Criteria

1. Tao `src/components/blocks/PricingCards.tsx`.
2. `PricingCards` la client component.
3. `PricingSection.tsx` tro thanh homepage wrapper:
   - giu section header
   - lay `enterBusinessMode` tu `useHomepageConversion`
   - pass callback xuong `PricingCards`
4. Enterprise card behavior:
   - co `onEnterBusinessMode` -> render button + callback
   - khong co callback -> render plain link theo `ctaHref`
5. Group va private cards dung plain link theo `ctaHref`.
6. Tracking location duoc pass qua prop, khong hardcode thanh `"pricing"` o moi context.
7. Homepage pricing khong regression sau refactor.
8. Money pages co the import `PricingCards` truc tiep ma khong can `HomepageConversionProvider`.
9. `npm run lint` va `npm run build` pass.

## What Stays in `PricingSection.tsx`

- `buildSitePriceRange()`
- `formatVnd()`
- section header JSX
- `useHomepageConversion()` hook call
- delegation xuong `PricingCards`

## What Moves to `PricingCards.tsx`

- `GroupCard`
- `PrivateCard`
- `EnterpriseCard`
- `PricingCard` dispatcher
- CTA `trackEvent` calls trong cards, nhan `trackingLocation` tu prop

## Edge Cases

### 1. Client / server boundary

Khong duoc tao server component roi import vao `PricingSection.tsx` vi wrapper homepage dang la client component.

### 2. Enterprise CTA

`onEnterBusinessMode` la callback prop, khong dung `variant` enum. Money pages khong truyen callback.

### 3. `ctaHref`

Homepage truyen `#lien-he`. Money pages truyen `/#lien-he`.

## Non-Scope

- Chua tach `PricingSection` thanh per-page variant
- Chua doi pricing data source
- Chua lam money page template

## Risk / Luu y

- Day la ticket deblock lon cho 3B. Neu tach sai architecture, money pages se bi drag theo homepage state machine.
