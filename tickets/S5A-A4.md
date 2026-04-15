# S5A-A4 - Pricing section upgrade

**Muc tieu:** Nang cap `PricingSection` theo Figma: featured card, feature list, tag badges, hierarchy ro giua tiers.

**Thoi gian uoc luong:** 1 gio

**Phu thuoc:** `S5A-A1`

**Rui ro:** Thap-den-trung-binh. Logic pricing da on, chu yeu doi presentation.

## Files chinh

- `src/components/home/PricingSection.tsx`
- `src/components/blocks/PricingCards.tsx`
- `src/app/globals.css`

## Scope

1. Featured card visual treatment cho tier uu tien
2. Feature list co icon / check treatment
3. Badges / labels cho phan loai tier
4. CTA system khop design moi

## Acceptance criteria

1. Pricing section khong con tron vai cung card system cu
2. Featured card duoc nhan ra ro rang
3. Feature list doc nhanh va co iconography don gian
4. Existing pricing logic, CTA href, tracking location khong bi vo
5. Money pages dung `PricingCards` van render dung sau khi doi style

## Implementation notes

### Cross-component impact (QUAN TRONG)

- `PricingCards` (`src/components/blocks/PricingCards.tsx`) duoc dung o **2 noi**:
  1. Homepage `PricingSection` — voi `onEnterBusinessMode` callback
  2. `MoneyPageTemplate` — voi `enterpriseCtaHref`
- Khi doi style PricingCards, **phai test ca 2 noi dung**
- PricingCards co polymorphic rendering theo `tier.kind`: GroupCard / PrivateCard / EnterpriseCard
- Tracking dung `usePathname()` de xac dinh `page_type` (homepage | seo_local | seo_support | seo_service)

### PricingSection wrapper

- `PricingSection` tinh price range tu `pricePerMonth` (group) va `pricePerHour` (private)
- Format VND qua `Intl.NumberFormat` — logic nay giu nguyen
