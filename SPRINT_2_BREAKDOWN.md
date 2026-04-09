# Sprint 2: Wire Sanity -> Frontend

## Status

- Sprint 2 status: `PLANNED`
- Dependency: `Sprint 1 DONE`
- Sanity project: `w58s0f53`
- Dataset: `production`

## Current State

Da co:

- 10 Sanity schemas live
- Data seeded:
  - `1` site_settings
  - `4` locations
  - `5` pricing tiers
  - `15` schedule blocks
  - `21` FAQs
- Homepage hien tai van doc tu static files trong `src/lib/*.ts`
- 3 existing pages da co route:
  - `/hoc-cau-long-cho-nguoi-moi/`
  - `/lop-cau-long-binh-thanh/`
  - `/lop-cau-long-thu-duc/`
- Coach + testimonial schemas da co, nhung chua co data that
- Campaign schema da co, nhung chua co campaign that
- Chua setup OpenClaw
- Chua co anh that cho hero, san, coach

## Static Dependency Map

```text
Static imports can wire:
|- siteConfig       -> Nav, Footer, ContactSection, ContactForm, layout.tsx, robots.ts
|- faqs             -> FaqSection, nguoi_moi, binh_thanh, thu_duc pages
|- pricing          -> PricingSection, nguoi_moi page
|- schedule         -> ScheduleSection, ContactForm
|- locations        -> LocationsSection, ScheduleSection, ContactForm, binh_thanh, thu_duc pages
|- schema (JSON-LD) -> homepage, 3 money pages
`- routes           -> Nav, SeoLinksBlock, sitemap, all pages metadata
```

## Planning Notes

- Sanity se tro thanh source of truth cho runtime reads.
- Static files trong `src/lib/*.ts` duoc giu lai trong Sprint 2 de lam reference va fallback, nhung se danh dau `@deprecated`.
- Dataset hien tai la `public`, nen `SANITY_API_READ_TOKEN` la `optional`, khong phai hard requirement cho Sprint 2. Van nen support trong env de san sang cho private dataset hoac preview flow sau nay.
- Revalidation phai duoc chot ngay tu Group A va document ro operator expectation.
- `robots.ts` va `sitemap.ts` nen dung `NEXT_PUBLIC_SITE_URL` lam canonical base. Chi fetch Sanity khi can content-derived URLs trong sprint sau.
- OpenClaw chua setup, nen khong nam tren critical path cua Sprint 2.
- `.env.example` hien dang bi pattern `.env*` ignore. Group A can chot cach track file nay trong git, khuyen nghi unignore ro rang.

## Group A: Sanity Read Infrastructure

**Muc tieu:** Tao nen doc data tu Sanity: client, revalidation, null-safe patterns, query layer typed.

**Vi sao di cung nhau:** Client config, revalidation strategy, va query layer la cung mot khoi logic. Khong nen wire section nao truoc khi nhom nay xong.

**Output:**

- `src/lib/sanity/client.ts`
  - read-only client
  - `SANITY_API_READ_TOKEN` support neu can
  - CDN on
- Revalidation strategy duoc chot va document ro
  - time-based ISR hoac on-demand webhook
  - phai giai thich ly do chon
- Published-only pattern mac dinh trong moi query
- Null-safe wrapper
  - khi Sanity tra `null` hoac loi network, component khong crash
  - frontend co graceful fallback
- `src/lib/sanity/queries.ts`
  - `getSiteSettings()`
  - `getLocations()`
  - `getPricingTiers()`
  - `getScheduleBlocks()`
  - `getFaqs(page?)`
- `getScheduleBlocks()` phai project du cac fields de thay the static schedule helpers:
  - `locationId`
  - `locationName`
  - `locationShortName`
  - `locationDistrict`
  - `dayGroup`
  - `timeLabel`
  - `timeSlotId`
  - `levels`
  - `order`
- Tat ca query return typed objects
- `.env.local` + `.env.example` duoc update

**Dependency:** Sprint 1 done

---

## Group B: Wire Homepage Sections

**Muc tieu:** 6 homepage sections chuyen tu static import sang Sanity query.

**Vi sao di cung nhau:** Tat ca deu la homepage sections dung chung query layer tu Group A, va cung theo pattern server fetch -> pass props.

**Scope:**

- `FaqSection` <- `getFaqs("homepage")`
- `PricingSection` <- `getPricingTiers()`
- `ScheduleSection` <- `getScheduleBlocks()`
- `LocationsSection` <- `getLocations()`
- `ContactSection` + `ContactForm` <- `getSiteSettings()` + locations + schedule data
- `Nav` + `Footer` <- `getSiteSettings()`

**Luu y dac biet:**

- `Nav` va `Footer` nam trong `layout.tsx`, nen `site settings` fetch o layout level
- `ContactForm` dang build dropdowns tu locations + schedule, nen can pass props hoac fetch lai theo pattern nhat quan
- `PricingSection` va `ScheduleSection` la `"use client"`, nen khong await truc tiep trong client component
- Group nay chi wire visible UI, chua wire JSON-LD
- `B1` la vertical slice nho nhat de verify pipeline, nhung la `recommended order` thay vi hard dependency ky thuat
- Sau khi Group A merge, `B1` va phan plumbing cua `B2` co the chay song song neu can

**Output:**

- Homepage render data tu Sanity
- Homepage tree khong con import `src/lib/faqs.ts`, `pricing.ts`, `schedule.ts`, `locations.ts`, `site.ts`
- `page.tsx` fetch data roi distribute props
- `layout.tsx` fetch `getSiteSettings()` roi pass vao `Nav` va `Footer`

**Dependency:** Group A done

---

## Group C: Wire 3 Existing Pages + JSON-LD

**Muc tieu:** 3 existing pages chuyen sang Sanity. Dong thoi wire JSON-LD schema builders de doc tu Sanity thay vi static.

**Vi sao di cung nhau:**

- 3 pages nay dung lai queries tu Group A
- JSON-LD builders hien van doc static internals, neu khong doi se tao 2 source of truth
- Visible content va structured data can dong bo trong cung sprint

**Scope:**

- `nguoi_moi/page.tsx` <- `getFaqs("nguoi_moi")` + `getPricingTiers()`
- `binh_thanh/page.tsx` <- `getFaqs("binh_thanh")` + `getLocations()` filtered
- `thu_duc/page.tsx` <- `getFaqs("thu_duc")` + `getLocations()` filtered
- `schema.ts` refactor
  - builders nhan data params
  - vi du: `buildFaqPageSchema(faqs)` thay vi tu import static data
- `robots.ts` + `sitemap.ts`
  - dung `NEXT_PUBLIC_SITE_URL` lam canonical base
  - chua fetch Sanity neu chi can static routes cua Sprint 2

**Output:**

- 3 pages render tu Sanity
- JSON-LD output khop voi Sanity data
- `sitemap.ts` va `robots.ts` van hoat dong

**Dependency:** Group A done

**Parallelism:** Co the chay song song voi Group B sau khi Group A merge

---

## Group D: Verify + Deprecate Statics

**Muc tieu:** Xac nhan wiring dung, khong regression, va danh dau static files la deprecated.

**Vi sao di cung nhau:** Day la gate cuoi cho Sprint 2. Neu nhom nay khong pass thi Sprint 2 chua xong.

**Scope:**

- `npm run build` pass
- Runtime smoke cho:
  - homepage
  - `nguoi_moi`
  - `binh_thanh`
  - `thu_duc`
- Edit `1` FAQ trong Studio -> verify revalidation hoat dong
- Edit phone number trong `site_settings` -> verify `Nav` / `Footer` cap nhat
- JSON-LD output spot check -> FAQPage schema khop visible content
- Danh dau `@deprecated` trong:
  - `faqs.ts`
  - `pricing.ts`
  - `schedule.ts`
  - `locations.ts`
  - `site.ts`
- Khong xoa static files trong Sprint 2
- Document ro:
  - revalidation dang hoat dong theo cach nao
  - operator can lam gi de thay thay doi tren site

**Output:**

- Sprint 2 done checklist pass
- Static files marked deprecated
- Revalidation behavior duoc document ro

**Dependency:** Group B + Group C done

---

## Execution Order

```text
Group A: Sanity Read Infrastructure
   |
   +-> Group B: Wire Homepage
   |
   `-> Group C: Wire 3 Pages + JSON-LD
            |
            `------.
   .---------------'
   v
Group D: Verify + Deprecate
```

## Sprint 2 Definition Of Done

- Frontend homepage va 3 existing pages doc tu Sanity
- Structured data khop cung source Sanity
- Operator edit trong Studio -> site cap nhat theo revalidation strategy da chot
- Static libs duoc danh dau `@deprecated`
- Build va smoke checks pass

## Non-Scope

- Chua xoa static files
- Chua doi UI/layout
- Chua wire coach/testimonial
- Chua build money pages moi
- Chua them OpenClaw
