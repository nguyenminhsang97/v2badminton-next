# Sprint 3: Homepage Trust Layer + Money Pages

## Status

- Sprint 3 status: `PLANNED`
- Dependency: `Sprint 2 DONE`
- Base branch: `codex/sprint3-homepage-money-pages`
- Sanity project: `w58s0f53`
- Dataset: `production`

## Current State

Da co:

- Sprint 2 da wire runtime frontend reads qua `src/lib/sanity/`
- Homepage da doc:
  - site settings
  - pricing tiers
  - schedule blocks
  - locations
  - homepage FAQs
- 3 pages hien co da doc tu Sanity-backed queries:
  - `/hoc-cau-long-cho-nguoi-moi/`
  - `/lop-cau-long-binh-thanh/`
  - `/lop-cau-long-thu-duc/`
- `schema.ts` da duoc tach khoi static libs
- `NEXT_PUBLIC_SITE_URL` da duoc wire vao `site.ts`
- Fallback static data van duoc giu lai trong query layer khi Sanity rong hoac unreachable

Con thieu:

- Homepage chua co trust layer:
  - coach section
  - testimonials section
- Contact flow van con ASCII copy va stale comment
- 3 money pages hien tai moi o muc skeleton content
- 3 money pages moi chua co route files:
  - `/lop-cau-long-tre-em/`
  - `/lop-cau-long-cho-nguoi-di-lam/`
  - `/cau-long-doanh-nghiep/`
- Homepage sections hien con coupling voi homepage context, chua suitable de tai su dung truc tiep cho money pages

## Planning Notes

- Sprint 3 chia thanh `3A` va `3B`.
- `3A` nen land truoc de homepage production-ready truoc khi money pages link nguoc ve homepage.
- `3A` tap trung vao visible homepage trust layer va copy polish, khong doi lead pipeline.
- `3B` khong reuse nguyen `PricingSection` va `LocationsSection`, ma tach presentational blocks truoc.
- CTA tren money pages tam thoi dung `/#lien-he`, chua them per-page contact section trong sprint nay.
- 3 pages dang live (`nguoi_moi`, `binh_thanh`, `thu_duc`) khong duoc `404` neu `money_page` document chua co.
- 3 pages dang live da nam san trong `CoreRoutePath`, `coreRoutes`, va `PREVIEW_READY_ROUTES`, nen khong can publish gate code nua.
- 3 pages moi co the ton tai route file nhung se `notFound()` cho toi khi co content that trong Sanity.
- Publish gating cho routes moi va routes duoc nang cap phai ro rang:
  - route file co the ton tai
  - `coreRoutes` chi them khi page ready de publish
  - `PREVIEW_READY_ROUTES` chi them khi page ready de expose tren homepage
- `routes.ts` khong duoc mo rong `CoreRoutePath` som hon `coreRoutes`. Neu publish route moi, type union va metadata entries phai di cung nhau trong cung mot commit.

---

## Sprint 3A: Homepage Trust Layer

**Muc tieu:** Chot homepage production-ready bang copy polish, trust layer, va smoke verification.

### Group A: Contact Copy Polish

**Muc tieu:** Loai bo toan bo ASCII copy trong contact flow va xoa stale comment.

**Scope:**

- `src/components/home/ContactForm.tsx`
  - labels, placeholders, helper text, submit states, captcha copy, success copy, business copy
- `src/components/home/ContactSection.tsx`
  - section title / subtitle
  - xoa stale comment block cua Sprint 2
- `BUSINESS_MESSAGE` constant duoc viet lai co dau

**Output:**

- Contact flow khong con copy thieu dau
- File luu o UTF-8, khong bi mojibake

**Dependency:** Sprint 2 done

---

### Group B: Coach Section

**Muc tieu:** Wire va render coach data tu Sanity tren homepage.

**Scope:**

- `src/lib/sanity/queries.ts`
  - them `SanityCoach`
  - them `getCoaches()`
  - `react.cache()`
  - published-only
  - sort theo `coalesce(order, 9999) asc`
  - khong can fallback, empty array thi section tu an
- `src/lib/sanity/index.ts`
  - export coach types / query
- `src/components/home/CoachSection.tsx`
  - server component
  - `return null` neu `coaches.length === 0`
  - card layout cho photo + name + teachingGroup + approach
- `src/app/globals.css`
  - `.coach-grid`
  - `.coach-card`
  - responsive 1 cot mobile, 2 cot tablet+
- `src/app/(site)/page.tsx`
  - fetch `getCoaches()`
  - render `CoachSection` sau `CourseSection`

**Output:**

- Homepage co coach section doc tu Sanity
- Section graceful hide khi chua co data

**Dependency:** Sprint 2 done

---

### Group C: Testimonials Section

**Muc tieu:** Wire va render testimonials tu Sanity tren homepage.

**Scope:**

- `src/lib/sanity/queries.ts`
  - them `SanityTestimonial`
  - them `getTestimonials()`
  - `react.cache()`
  - published-only
  - sort theo `coalesce(order, 9999) asc`
  - khong can fallback
- `src/lib/sanity/index.ts`
  - export testimonial types / query
- `src/components/home/TestimonialsSection.tsx`
  - server component
  - `return null` neu empty
  - `blockquote` cards voi content + name + contextLabel
- `src/app/globals.css`
  - `.testimonials-grid`
  - `.testimonial-card`
  - responsive 1 cot mobile, 2-3 cot desktop
- `src/app/(site)/page.tsx`
  - fetch `getTestimonials()`
  - render sau `CoachSection`

**Output:**

- Homepage co testimonials section doc tu Sanity
- Section graceful hide khi chua co data

**Dependency:** Sprint 2 done

---

### Group D: Data Entry + Smoke Test

**Muc tieu:** Xac nhan trust layer da co data that va homepage khong regression.

**Scope:**

- Content operation trong Sanity Studio:
  - tao it nhat `2` coach documents
  - tao it nhat `3` testimonial documents
- Smoke verify:
  - coach section render dung
  - testimonials section render dung
  - xoa data coach/testimonial -> sections tu an, khong crash
  - regression check:
    - tao `schedule_block` co `levels: ["doanh_nghiep"]`
    - verify class render dung `level-tag--doanh-nghiep`
- `npm run lint`
- `npm run build`

**Output:**

- Homepage trust layer ready
- Regression check cho enterprise level pass

**Dependency:** Group A + Group B + Group C done

---

## Sprint 3B: Money Pages

**Muc tieu:** Chuyen 3 skeleton pages sang content template that va tao 3 route moi co gate.

### Group A: Extract Presentational Blocks

**Muc tieu:** Tach phan view khoi homepage-specific wrappers de money pages co the tai su dung an toan.

**Scope:**

- `src/components/blocks/PricingCards.tsx`
  - client component
  - props:
    - `tiers`
    - `ctaHref`
    - `trackingLocation`
    - `onEnterBusinessMode?`
  - enterprise card:
    - neu co `onEnterBusinessMode` -> button + callback
    - neu khong co -> plain link theo `ctaHref`
- `src/components/home/PricingSection.tsx`
  - tro thanh homepage wrapper
  - lay `enterBusinessMode` tu `useHomepageConversion`
  - delegate render xuong `PricingCards`
- `src/components/blocks/LocationsGrid.tsx`
  - render thuan locations cards
- `src/components/home/LocationsSection.tsx`
  - giu section header homepage
  - delegate xuong `LocationsGrid`
- `src/components/blocks/FaqList.tsx`
  - render thuan FAQ items
- `src/components/home/FaqSection.tsx`
  - giu section header homepage
  - delegate xuong `FaqList`

**Output:**

- Homepage wrappers van hoat dong
- Money pages co blocks tai su dung duoc ma khong mang coupling homepage

**Dependency:** Sprint 2 done

---

### Group B: Money Page Query Layer

**Muc tieu:** Doc `money_page` document va related references tu Sanity.

**Scope:**

- `src/lib/sanity/queries.ts`
  - them `SanityMoneyPage`
  - them `getMoneyPage(slug)`
  - dereference:
    - `relatedLocations[]->`
    - `relatedPricing[]->`
    - `relatedFaqs[]->`
  - return `null` neu document khong ton tai
  - khong can fallback
  - `react.cache()`
  - published-only
- `src/lib/sanity/index.ts`
  - export money page query + type

**Output:**

- Co typed query cho money pages
- Callers co the phan biet ro `null` vs document found

**Dependency:** Sprint 2 done

---

### Group C: Money Page Template

**Muc tieu:** Tao reusable template de render content that cua money pages.

**Scope:**

- `src/components/money-page/MoneyPageTemplate.tsx`
  - server component
  - render:
    - hero
    - intro Portable Text
    - `PricingCards` voi `ctaHref="/#lien-he"`
    - body Portable Text
    - `LocationsGrid`
    - `FaqList`
    - CTA cuoi trang link ve `/#lien-he`
- `src/app/globals.css`
  - `.money-page`
  - `.money-page__hero`
  - `.money-page__body`
  - `.money-page__cta`

**Output:**

- Co template chung cho money pages
- CTA khong bi gay do anchor local khong ton tai

**Dependency:** Group A + Group B done

---

### Group D: Route Files + Fallback / Gate

**Muc tieu:** Convert pages theo muc do publish readiness ma khong tao regression SEO.

**Scope:**

- 3 pages dang live:
  - `/hoc-cau-long-cho-nguoi-moi/`
  - `/lop-cau-long-binh-thanh/`
  - `/lop-cau-long-thu-duc/`
- Pattern cho 3 pages dang live:
  - neu `getMoneyPage(slug)` co data -> render `MoneyPageTemplate`
  - neu `getMoneyPage(slug)` la `null` -> fallback ve implementation Sprint 2 hien tai
  - xoa static `export const metadata = buildMetadata(...)`
  - `generateMetadata()` async doc `metaTitle` / `metaDescription` tu Sanity khi document co data
  - fallback metadata ve `buildMetadata(...)` hien co khi document chua co
  - giu breadcrumb schema + FAQ schema o page level
- Tao 3 route files moi:
  - `/lop-cau-long-tre-em/`
  - `/lop-cau-long-cho-nguoi-di-lam/`
  - `/cau-long-doanh-nghiep/`
- Pattern cho 3 routes moi:
  - route file ton tai
  - `getMoneyPage(slug)` tra `null` -> `notFound()`
  - co data -> render `MoneyPageTemplate`
  - metadata async doc tu Sanity
- Khong sua `routes.ts` trong group nay
- Khong mo rong `CoreRoutePath` trong group nay

**Output:**

- 3 routes dang live duoc nang cap an toan
- 3 routes moi co gate theo content readiness

**Dependency:** Group C done

---

### Group E: Content Entry + Publish Gating

**Muc tieu:** Nhap content that va chi publish route khi da verify.

**Scope:**

- Content operation trong Sanity Studio:
  - tao `money_page` cho:
    - `nguoi_moi`
    - `binh_thanh`
    - `thu_duc`
    - `tre_em`
    - `nguoi_di_lam`
    - `doanh_nghiep`
- 3 page dang live khong can commit publish gate; chi can co document Sanity la runtime tu switch sang template moi
- Khi route moi nao verified, moi duoc lam commit publish gate:
  - them vao `CoreRoutePath`
  - them vao `coreRoutes`
  - them vao `PREVIEW_READY_ROUTES`
- Publish gate phai atomic trong cung mot commit
- `sitemap.ts` tu dong nhat route moi khi `coreRoutes` duoc update

**Output:**

- Route nao ready thi moi duoc expose tren homepage va sitemap
- Type safety trong `routes.ts` van giu dung

**Dependency:** Group D done

---

## Execution Order

```text
Sprint 3A:
  Group A: Contact Copy Polish
     |
     +-> Group B: Coach Section
     |
     `-> Group C: Testimonials Section
              |
              `------.
   .-----------------'
   v
Group D: Data Entry + Smoke Test

Sprint 3B:
  Group A: Extract Presentational Blocks
     |
     v
  Group B: Money Page Query Layer
     |
     v
  Group C: Money Page Template
     |
     v
  Group D: Route Files + Fallback / Gate
     |
     v
  Group E: Content Entry + Publish Gating
```

## Sprint 3 Definition Of Done

- Homepage co coach section + testimonials section doc tu Sanity
- Contact flow copy duoc polish va khong con ASCII strings
- Homepage trust layer pass smoke test va enterprise level regression check
- Presentational blocks duoc tach ra ma homepage khong regression
- Money page template render dung voi Sanity documents
- 3 pages dang live nang cap an toan, khong 404 khi document chua co
- 3 routes moi co gate qua `notFound()` cho toi khi co content
- Publish gating cho routes moi duoc document ro
- `npm run lint` + `npm run build` pass

## Non-Scope

- Chua them per-page contact section cho money pages
- Chua migrate lead pipeline khoi legacy `CourtId` / `TimeSlotId`
- Chua doi OpenClaw integration
- Chua lam campaign landing page
- Chua toi uu anh coach bang `next/image`
- Chua dua tat ca site metadata vao Sanity
