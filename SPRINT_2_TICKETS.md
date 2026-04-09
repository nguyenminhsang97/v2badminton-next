# Sprint 2: Wire Sanity -> Frontend - Tickets

## Status

- Sprint 2 status: `PLANNED`
- Dependency: `Sprint 1 DONE`
- Sanity project: `w58s0f53`
- Dataset: `production`

## Group A: Sanity Read Infrastructure

### S2-A1: Sanity Client + Env Config
- **Objective:** Tao read-only Sanity client cho frontend, config env, va chot revalidation strategy
- **Scope:**
  - Tao `src/lib/sanity/client.ts` voi `createClient`
  - `apiVersion: "2026-04-09"`
  - CDN on
  - Support `SANITY_API_READ_TOKEN` trong env
  - Chot va document revalidation strategy
  - Export helper fetch wrapper null-safe
  - Update `.env.local` + `.env.example`
  - Install `@sanity/client` neu chua co
- **Dependency:** Sprint 1
- **Priority:** P0
- **Expected output:** `npm run build` pass, client importable, env documented

### S2-A2: GROQ Query Layer
- **Objective:** Tap trung moi GROQ queries vao mot file typed de components chi goi function
- **Scope:**
  - Tao `src/lib/sanity/queries.ts`
  - Tao `src/lib/sanity/index.ts`
  - `getSiteSettings()` -> `SanitySettings`
  - `getLocations()` -> `SanityLocation[]`
    - chi lay `isActive == true`
    - sort by `order`
  - `getPricingTiers()` -> `SanityPricingTier[]`
    - chi lay `isActive == true`
    - sort by `order`
  - `getScheduleBlocks()` -> `SanityScheduleBlock[]`
    - chi lay `isActive == true`
    - sort by `order`
    - projection bat buoc:
      - `locationId`
      - `locationName`
      - `locationShortName`
      - `locationDistrict`
      - `dayGroup`
      - `timeLabel`
      - `timeSlotId`
      - `levels`
      - `order`
  - `getFaqs(page?)` -> `SanityFaq[]`
    - filter `$page in pages` khi co param
    - sort by `order`
  - Tat ca queries chi doc published documents
  - Dung null-safe wrapper tu `S2-A1`
- **Dependency:** S2-A1
- **Priority:** P0
- **Expected output:** `npm run build` pass, query functions return typed data, import clean qua barrel

---

## Group B: Wire Homepage Sections

### S2-B1: Wire Layout - Nav + Footer <- SiteSettings
- **Objective:** `Nav` va `Footer` doc phone, social links tu Sanity thay vi `siteConfig`
- **Scope:**
  - `src/app/(site)/layout.tsx` fetch `getSiteSettings()`
  - Pass `siteSettings` vao `Nav` va `Footer` qua props
  - `Nav` va `Footer` khong con import `src/lib/site.ts`
  - Null-safe fallback neu settings null
- **Dependency:** S2-A2
- **Priority:** P0
- **Expected output:** Nav/Footer doc tu Sanity, edit phone trong Studio -> thay doi xuat hien sau revalidation

### S2-B2: Wire Homepage Data - Fetch + Distribute Props
- **Objective:** Homepage `page.tsx` fetch tat ca data tu Sanity roi distribute xuong sections qua props
- **Scope:**
  - `src/app/(site)/page.tsx` goi:
    - `getPricingTiers()`
    - `getScheduleBlocks()`
    - `getLocations()`
    - `getFaqs("homepage")`
    - `getSiteSettings()`
  - Pass data xuong tung section qua props
  - Them props interface cho sections, chua doi internal rendering logic
  - Client components nhan data qua props, khong tu fetch
  - Null checks o page level
- **Dependency:** S2-A2
- **Priority:** P0
- **Expected output:** Homepage `page.tsx` khong con import static libs, sections nhan typed props, build pass

**Execution note:** `S2-B1` la recommended order de verify pipeline som, nhung `B1` va phan plumbing cua `B2` co the song song sau `S2-A2`.

### S2-B3: Wire Section Internals - Pricing + Schedule + Locations + FAQ
- **Objective:** Doi 4 section components sang Sanity data thay vi static imports
- **Scope:**
  - `FaqSection`
    - nhan `SanityFaq[]`
    - render Portable Text answers
    - can `@portabletext/react`
  - `PricingSection`
    - nhan `SanityPricingTier[]`
    - map dung sang `group`, `private`, `enterprise` card logic hien tai
  - `ScheduleSection`
    - nhan `SanityScheduleBlock[]`
    - bo phu thuoc vao `courtLocationMap` va `scheduleItems`
    - dung `locationShortName` cho tab/filter
    - dung Sanity fields cho prefill message compose
  - `LocationsSection`
    - nhan `SanityLocation[]`
    - render cards tu data Sanity
  - Khong doi UI/CSS
- **Dependency:** S2-B2
- **Priority:** P0
- **Expected output:** Homepage render dung data tu Sanity, visual giu nguyen, homepage component tree khong con import static content libs

### S2-B4: Wire ContactForm <- Sanity Data
- **Objective:** `ContactForm` nhan locations + schedule + siteSettings tu Sanity thay vi static imports
- **Scope:**
  - `ContactForm` nhan props:
    - locations
    - schedule blocks
    - site settings
  - Dropdown logic map tu Sanity types
  - Prefill message compose dung `location.name`, `dayGroup`, `timeLabel`
  - `ContactSection` wrap va pass props vao `ContactForm`
  - Khong doi form submit logic, validation, hay API endpoint
- **Dependency:** S2-B2
- **Priority:** P0
- **Expected output:** ContactForm dropdowns populate tu Sanity, form submit van hoat dong, Zalo link dung

---

## Group C: Wire 3 Existing Pages + JSON-LD

### S2-C1: Wire 3 Existing Pages <- Sanity
- **Objective:** `nguoi_moi`, `binh_thanh`, `thu_duc` chuyen sang doc Sanity
- **Scope:**
  - `nguoi_moi/page.tsx`
    - `getFaqs("nguoi_moi")`
    - `getPricingTiers()`
  - `binh_thanh/page.tsx`
    - `getFaqs("binh_thanh")`
    - `getLocations()` roi filter `district == "binh_thanh"`
  - `thu_duc/page.tsx`
    - `getFaqs("thu_duc")`
    - `getLocations()` roi filter `district == "thu_duc"`
  - 3 pages khong con import static libs
  - Null-safe neu FAQs hoac locations trong
- **Dependency:** S2-A2
- **Priority:** P1
- **Expected output:** 3 pages render tu Sanity, build pass

### S2-C2: Refactor JSON-LD Builders <- Sanity Data
- **Objective:** `schema.ts` builders nhan data params thay vi import static libs
- **Scope:**
  - Refactor builders:
    - `buildFaqPageSchema(faqs)`
    - `buildHomepageLocalBusinessSchema(settings, locations)`
    - `buildOrganizationSchema(settings)`
    - `buildLocalPageBusinessSchema(...)`
    - `buildCourseSchemas(...)`
  - Update tat ca call sites tren homepage va 3 existing pages
  - `schema.ts` khong con import bat ky static content lib nao trong `src/lib/`
  - `robots.ts` + `sitemap.ts`
    - dung `process.env.NEXT_PUBLIC_SITE_URL` lam canonical base
    - chua fetch Sanity neu Sprint 2 chi co static routes
- **Dependency:** S2-B2, S2-C1
- **Priority:** P0
- **Expected output:** JSON-LD output khop Sanity data, `schema.ts` tro thanh bo pure builders

---

## Group D: Verify + Deprecate

### S2-D1: Smoke Test + Deprecate Static Files
- **Objective:** Gate ticket. Xac nhan moi thu wired dung, khong regression, va static files duoc danh dau deprecated
- **Scope:**
  - `npm run build` pass
  - `npm run lint` pass
  - Runtime smoke:
    - homepage: sections render, content khong trong, khong crash
    - `nguoi_moi`: FAQs + pricing hien thi
    - `binh_thanh`: FAQs + locations hien thi, chi courts Binh Thanh
    - `thu_duc`: FAQs + locations hien thi, chi courts Thu Duc
  - Revalidation verify:
    - edit `1` FAQ trong Studio -> confirm site cap nhat
    - edit phone number trong `site_settings` -> confirm `Nav` / `Footer` cap nhat
  - JSON-LD spot check:
    - FAQPage schema khop visible FAQ content
  - Danh dau `@deprecated` + JSDoc note trong:
    - `faqs.ts`
    - `pricing.ts`
    - `schedule.ts`
    - `locations.ts`
    - `site.ts`
  - Khong xoa static files
  - Viet ngan gon vao `SPRINT_2_DONE.md`:
    - revalidation strategy dang dung
    - operator can biet gi
- **Dependency:** S2-B3, S2-B4, S2-C2
- **Priority:** P0
- **Expected output:** Sprint 2 checklist pass, static files marked deprecated, operator-facing note documented

---

## Summary

| ID | Title | Group | Dep | Priority |
|---|---|---|---|---|
| S2-A1 | Sanity Client + Env Config | A | Sprint 1 | P0 |
| S2-A2 | GROQ Query Layer | A | S2-A1 | P0 |
| S2-B1 | Wire Layout - Nav + Footer | B | S2-A2 | P0 |
| S2-B2 | Wire Homepage Data - Fetch + Props | B | S2-A2 | P0 |
| S2-B3 | Wire Section Internals | B | S2-B2 | P0 |
| S2-B4 | Wire ContactForm | B | S2-B2 | P0 |
| S2-C1 | Wire 3 Existing Pages | C | S2-A2 | P1 |
| S2-C2 | Refactor JSON-LD Builders | C | S2-B2 + S2-C1 | P0 |
| S2-D1 | Smoke Test + Deprecate | D | S2-B3 + S2-B4 + S2-C2 | P0 |

## Execution Order

```text
S2-A1 -> S2-A2
              |-> S2-B1
              |-> S2-B2 -> S2-B3 --.
              |              `-> S2-B4 --.
              `-> S2-C1 ---------> S2-C2 -+-> S2-D1
```

- `S2-B1` la recommended order de verify vertical slice som.
- `S2-B1` va phan plumbing cua `S2-B2` co the song song sau `S2-A2`.
- `S2-C1` co the song song voi Group B sau `S2-A2`.
