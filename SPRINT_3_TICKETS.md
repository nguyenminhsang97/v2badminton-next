# Sprint 3: Homepage Trust Layer + Money Pages - Tickets

## Status

- Sprint 3 status: `PLANNED`
- Dependency: `Sprint 2 DONE`
- Base branch: `codex/sprint3-homepage-money-pages`
- Sanity project: `w58s0f53`
- Dataset: `production`

## Sprint 3A: Homepage Trust Layer

### S3A-A1: Contact Copy Polish + Stale Comment Cleanup
- **Objective:** Polish toan bo contact flow copy va xoa stale comment cua Sprint 2
- **Scope:**
  - `src/components/home/ContactForm.tsx`
    - labels
    - placeholders
    - helper text
    - business copy
    - submit state text
    - success state text
    - captcha copy
  - `src/components/home/ContactSection.tsx`
    - section title / subtitle
    - xoa stale comment block dau file
  - `BUSINESS_MESSAGE` constant viet lai co dau
  - Dam bao file luu o UTF-8, khong bi mojibake
- **Dependency:** Sprint 2
- **Priority:** P0
- **Expected output:** Contact flow khong con ASCII copy, stale comment da duoc xoa

### S3A-B1: Add `getCoaches()` Query
- **Objective:** Them typed query cho coach documents
- **Scope:**
  - `src/lib/sanity/queries.ts`
    - them `SanityCoach`
    - them `getCoaches()`
    - filter `isActive == true`
    - sort `coalesce(order, 9999) asc`
    - `react.cache()`
    - published-only
    - khong fallback, empty -> `[]`
  - `src/lib/sanity/index.ts`
    - export coach type va query
- **Dependency:** Sprint 2
- **Priority:** P0
- **Expected output:** `getCoaches()` tra typed data, import clean qua barrel

### S3A-B2: Build `CoachSection` + CSS
- **Objective:** Render coach section tren homepage
- **Scope:**
  - Tao `src/components/home/CoachSection.tsx`
  - Server component, khong `"use client"`
  - `return null` neu `coaches.length === 0`
  - Layout:
    - section header
    - `coach-grid`
    - `coach-card`
    - photo + name + teachingGroup + approach
  - `src/app/globals.css`
    - them `.coach-grid`
    - them `.coach-card`
    - responsive 1 cot mobile, 2 cot tablet+
    - photo square, `object-fit: cover`
- **Dependency:** S3A-B1
- **Priority:** P0
- **Expected output:** Section render dung, responsive, khong crash khi rong

### S3A-B3: Wire `CoachSection` vao Homepage
- **Objective:** Dua coach data vao homepage tree
- **Scope:**
  - `src/app/(site)/page.tsx`
    - them `getCoaches()` vao `Promise.all`
    - render `<CoachSection coaches={coaches} />`
    - dat sau `<CourseSection />`, truoc `<ScheduleSection />`
- **Dependency:** S3A-B2
- **Priority:** P0
- **Expected output:** Homepage render coach section khi co data, tu an khi rong

### S3A-C1: Add `getTestimonials()` Query
- **Objective:** Them typed query cho testimonial documents
- **Scope:**
  - `src/lib/sanity/queries.ts`
    - them `SanityTestimonial`
    - them `getTestimonials()`
    - filter `isActive == true`
    - sort `coalesce(order, 9999) asc`
    - `react.cache()`
    - published-only
    - khong fallback, empty -> `[]`
  - `src/lib/sanity/index.ts`
    - export testimonial type va query
- **Dependency:** Sprint 2
- **Priority:** P0
- **Expected output:** `getTestimonials()` tra typed data, import clean qua barrel

### S3A-C2: Build `TestimonialsSection` + CSS
- **Objective:** Render testimonials section tren homepage
- **Scope:**
  - Tao `src/components/home/TestimonialsSection.tsx`
  - Server component
  - `return null` neu empty
  - Render `blockquote` cards:
    - content
    - studentName
    - contextLabel
  - `src/app/globals.css`
    - them `.testimonials-grid`
    - them `.testimonial-card`
    - responsive 1 cot mobile, 2-3 cot desktop
- **Dependency:** S3A-C1
- **Priority:** P0
- **Expected output:** Testimonials section render dung, responsive, khong crash khi rong

### S3A-C3: Wire `TestimonialsSection` vao Homepage
- **Objective:** Dua testimonials vao homepage tree
- **Scope:**
  - `src/app/(site)/page.tsx`
    - them `getTestimonials()` vao `Promise.all`
    - render `<TestimonialsSection testimonials={testimonials} />`
    - dat ngay sau `<CoachSection />`
- **Dependency:** S3A-C2
- **Priority:** P0
- **Expected output:** Homepage render testimonials khi co data, tu an khi rong

### S3A-D1: Data Entry + Smoke Test
- **Objective:** Verify trust layer va regression check cho enterprise level tag
- **Scope:**
  - Tao trong Sanity Studio:
    - it nhat `2` coach documents
    - it nhat `3` testimonial documents
  - Smoke verify:
    - coach section render dung
    - testimonials section render dung
    - xoa het coach/testimonial -> sections tu an
    - tao `schedule_block` voi `levels: ["doanh_nghiep"]`
    - verify render class `level-tag--doanh-nghiep`
  - `npm run lint`
  - `npm run build`
- **Dependency:** S3A-A1 + S3A-B3 + S3A-C3
- **Priority:** P0
- **Expected output:** Homepage trust layer verified, lint/build pass, enterprise class regression check pass

---

## Sprint 3B: Money Pages

### S3B-A1: Extract `PricingCards`
- **Objective:** Tach pricing cards thanh block tai su dung duoc cho homepage va money pages
- **Scope:**
  - Tao `src/components/blocks/PricingCards.tsx`
  - Client component
  - Props:
    - `tiers`
    - `ctaHref`
    - `trackingLocation`
    - `onEnterBusinessMode?`
  - Enterprise behavior:
    - co callback -> button + callback
    - khong co callback -> plain link theo `ctaHref`
  - Move pricing card render logic ra khoi homepage wrapper
  - `src/components/home/PricingSection.tsx`
    - tro thanh wrapper cho section header + hook + delegate
  - Giu lai trong `PricingSection.tsx`:
    - `buildSitePriceRange()`
    - `formatVnd()`
    - section header JSX
    - `useHomepageConversion()` hook call
  - Chuyen sang `PricingCards.tsx`:
    - `GroupCard`
    - `PrivateCard`
    - `EnterpriseCard`
    - `PricingCard` dispatcher
    - CTA tracking calls nhan `trackingLocation` tu prop
- **Dependency:** Sprint 2
- **Priority:** P0
- **Expected output:** Homepage pricing khong regression, money pages co block pricing tai su dung duoc

### S3B-A2: Extract `LocationsGrid`
- **Objective:** Tach locations cards thanh block tai su dung duoc
- **Scope:**
  - Tao `src/components/blocks/LocationsGrid.tsx`
  - Render thuan locations cards
  - `src/components/home/LocationsSection.tsx`
    - giu header homepage
    - delegate render xuong `LocationsGrid`
- **Dependency:** Sprint 2
- **Priority:** P0
- **Expected output:** Homepage locations khong regression, money pages co block locations phu hop cho 1-2 san

### S3B-A3: Extract `FaqList`
- **Objective:** Tach FAQ list thanh block tai su dung duoc
- **Scope:**
  - Tao `src/components/blocks/FaqList.tsx`
  - Render `details/summary` list
  - `src/components/home/FaqSection.tsx`
    - giu header homepage
    - delegate render xuong `FaqList`
- **Dependency:** Sprint 2
- **Priority:** P0
- **Expected output:** Homepage FAQ khong regression, money pages co block FAQ tai su dung duoc

### S3B-B1: Add `getMoneyPage(slug)`
- **Objective:** Them typed query cho `money_page`
- **Scope:**
  - `src/lib/sanity/queries.ts`
    - them `SanityMoneyPage`
    - them `getMoneyPage(slug)`
    - dereference `relatedLocations`, `relatedPricing`, `relatedFaqs`
    - return `null` neu khong tim thay
    - published-only
    - `react.cache()`
    - khong fallback
  - `src/lib/sanity/index.ts`
    - export money page type va query
- **Dependency:** Sprint 2
- **Priority:** P0
- **Expected output:** Co query typed cho money pages, co the branch logic theo `null`

### S3B-C1: Build `MoneyPageTemplate`
- **Objective:** Tao template server component de render money page content
- **Scope:**
  - Tao `src/components/money-page/MoneyPageTemplate.tsx`
  - Render:
    - H1
    - intro Portable Text
    - `PricingCards` voi `ctaHref="/#lien-he"`
    - body Portable Text
    - `LocationsGrid`
    - `FaqList`
    - final CTA link `/#lien-he`
  - `src/app/globals.css`
    - them `.money-page`
    - `.money-page__hero`
    - `.money-page__body`
    - `.money-page__cta`
  - Server component import client component la hop le:
    - `MoneyPageTemplate` van la server component
    - `PricingCards` la client boundary
- **Dependency:** S3B-A1 + S3B-A2 + S3B-A3 + S3B-B1
- **Priority:** P0
- **Expected output:** Money page template render dung va khong phu thuoc homepage-only sections

### S3B-D1: Convert 3 Live Pages voi Safe Fallback
- **Objective:** Nang cap 3 routes dang live ma khong tao regression SEO
- **Scope:**
  - `src/app/(site)/hoc-cau-long-cho-nguoi-moi/page.tsx`
  - `src/app/(site)/lop-cau-long-binh-thanh/page.tsx`
  - `src/app/(site)/lop-cau-long-thu-duc/page.tsx`
  - Pattern:
    - `getMoneyPage(slug)`
    - neu co document -> render `MoneyPageTemplate`
    - neu `null` -> fallback ve implementation Sprint 2 hien tai
  - `generateMetadata()` async:
    - co data -> doc `metaTitle` / `metaDescription` tu Sanity
    - khong co data -> fallback `buildMetadata(...)`
  - Xoa static `export const metadata = buildMetadata(...)`
  - Giu breadcrumb schema + FAQ schema
- **Dependency:** S3B-C1
- **Priority:** P0
- **Expected output:** 3 pages live duoc nang cap an toan, khong 404 khi content chua san sang

### S3B-D2: Create 3 New Page Files voi `notFound()` Gate
- **Objective:** Tao 3 routes moi nhung chi mo khi da co content
- **Scope:**
  - Tao:
    - `src/app/(site)/lop-cau-long-tre-em/page.tsx`
    - `src/app/(site)/lop-cau-long-cho-nguoi-di-lam/page.tsx`
    - `src/app/(site)/cau-long-doanh-nghiep/page.tsx`
  - Pattern:
    - `getMoneyPage(slug)`
    - `null` -> `notFound()`
    - co data -> render `MoneyPageTemplate`
  - `generateMetadata()` async doc tu Sanity
  - Chua can breadcrumb hay JSON-LD neu content chua verified
- **Dependency:** S3B-C1
- **Priority:** P1
- **Expected output:** 3 routes moi ton tai va duoc gate theo content readiness

### S3B-E1: Content Entry + Atomic Publish Gate
- **Objective:** Nhap content va chi publish route khi da verify
- **Scope:**
  - Tao `money_page` documents cho:
    - `nguoi_moi`
    - `binh_thanh`
    - `thu_duc`
    - `tre_em`
    - `nguoi_di_lam`
    - `doanh_nghiep`
  - 3 route dang live da ton tai san trong:
    - `CoreRoutePath`
    - `coreRoutes`
    - `PREVIEW_READY_ROUTES`
  - 3 route dang live khong can commit publish gate; khi `money_page` co data, page tu dong switch sang `MoneyPageTemplate`
  - Chi 3 route moi moi can publish gate
  - Khi route moi nao verified, tao mot commit publish gate gom:
    - them vao `CoreRoutePath`
    - them vao `coreRoutes`
    - them vao `PREVIEW_READY_ROUTES`
  - Khong mo rong `routes.ts` som hon khi page ready
  - `sitemap.ts` se tu pick up qua `coreRoutes`
- **Dependency:** S3B-D1 + S3B-D2
- **Priority:** P0
- **Expected output:** Route ready moi duoc expose tren homepage + sitemap, type safety giu dung

### S3B-E2: Final Verification
- **Objective:** Gate cuoi cho Sprint 3B
- **Scope:**
  - Verify homepage wrappers khong regression sau khi tach blocks
  - Verify money page template render dung voi content that
  - Verify 3 routes live van hoat dong khi `money_page` document chua co
  - Verify 3 routes moi `404` khi chua co content, va mo duoc khi da co content
  - Verify publish gate:
    - route duoc add vao `coreRoutes`
    - route xuat hien trong `SeoLinksBlock`
    - route xuat hien trong sitemap
  - `npm run lint`
  - `npm run build`
- **Dependency:** S3B-E1
- **Priority:** P0
- **Expected output:** Sprint 3B verified, publish gating hoat dong dung, lint/build pass

---

## Summary

| ID | Title | Group | Dep | Priority |
|---|---|---|---|---|
| S3A-A1 | Contact Copy Polish + Cleanup | 3A | Sprint 2 | P0 |
| S3A-B1 | Add `getCoaches()` Query | 3A | Sprint 2 | P0 |
| S3A-B2 | Build `CoachSection` + CSS | 3A | S3A-B1 | P0 |
| S3A-B3 | Wire `CoachSection` | 3A | S3A-B2 | P0 |
| S3A-C1 | Add `getTestimonials()` Query | 3A | Sprint 2 | P0 |
| S3A-C2 | Build `TestimonialsSection` + CSS | 3A | S3A-C1 | P0 |
| S3A-C3 | Wire `TestimonialsSection` | 3A | S3A-C2 | P0 |
| S3A-D1 | Data Entry + Smoke Test | 3A | S3A-A1 + S3A-B3 + S3A-C3 | P0 |
| S3B-A1 | Extract `PricingCards` | 3B | Sprint 2 | P0 |
| S3B-A2 | Extract `LocationsGrid` | 3B | Sprint 2 | P0 |
| S3B-A3 | Extract `FaqList` | 3B | Sprint 2 | P0 |
| S3B-B1 | Add `getMoneyPage(slug)` | 3B | Sprint 2 | P0 |
| S3B-C1 | Build `MoneyPageTemplate` | 3B | S3B-A1 + S3B-A2 + S3B-A3 + S3B-B1 | P0 |
| S3B-D1 | Convert 3 Live Pages voi Safe Fallback | 3B | S3B-C1 | P0 |
| S3B-D2 | Create 3 New Pages voi `notFound()` Gate | 3B | S3B-C1 | P1 |
| S3B-E1 | Content Entry + Atomic Publish Gate | 3B | S3B-D1 + S3B-D2 | P0 |
| S3B-E2 | Final Verification | 3B | S3B-E1 | P0 |

## Execution Order

```text
Sprint 3A:
S3A-A1
   |-> S3A-B1 -> S3A-B2 -> S3A-B3 --.
   `-> S3A-C1 -> S3A-C2 -> S3A-C3 --+-> S3A-D1

Sprint 3B:
S3B-A1 --.
S3B-A2 --+-> S3B-C1 -> S3B-D1 --.
S3B-A3 --'             `-> S3B-D2 --+-> S3B-E1 -> S3B-E2
S3B-B1 -----------------------------'
```

- `3A` nen land truoc `3B`.
- `S3B-A1`, `S3B-A2`, `S3B-A3`, `S3B-B1` co the chay song song.
- `S3B-D1` va `S3B-D2` co the chay song song sau khi template xong.
- Publish gating route moi / route nang cap phai atomic trong mot commit.
