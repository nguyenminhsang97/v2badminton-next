# Sprint 1 â€” Code Review

> Review ngÃ y 2026-04-06. ÄÃ¡nh giÃ¡ toÃ n bá»™ code Sprint 1 so vá»›i spec trong `SPRINT_1_DETAILING.md` vÃ  acceptance criteria.

---

## Tá»•ng quan

Sprint 1 Ä‘Ã£ hoÃ n thÃ nh pháº§n lá»›n má»¥c tiÃªu: khÃ³a data model, shared layout, JSON-LD foundation, vÃ  route metadata. Code compiles sáº¡ch (`tsc --noEmit` pass), cáº¥u trÃºc rÃµ rÃ ng, type system cháº·t cháº½. DÆ°á»›i Ä‘Ã¢y lÃ  review chi tiáº¿t tá»«ng file.

---

## âœ… Acceptance Criteria Check

| # | Criteria | Status | Ghi chÃº |
|---|---------|--------|---------|
| 1 | 4 courts trong 1 typed source of truth | âœ… Pass | `locations.ts` â€” Ä‘áº§y Ä‘á»§ 4 sÃ¢n |
| 2 | Pricing offers trong 1 typed source of truth | âœ… Pass | `pricing.ts` â€” 5 tiers, discriminated union |
| 3 | Schedule data normalized cho prefill | âœ… Pass | `schedule.ts` â€” 15 slots vá»›i prefill fields |
| 4 | FAQ data render cáº£ UI vÃ  schema | âœ… Pass | `faqs.ts` â€” answerText + schemaEligible |
| 5 | Tracking contract compiles | âœ… Pass | `tracking.ts` â€” 9 events, typed params |
| 6 | JsonLd render server-side | âœ… Pass | `JsonLd.tsx` â€” server component |
| 7 | Shared Nav/Footer render | âœ… Pass | `Nav.tsx` + `Footer.tsx` via `layout.tsx` |
| 8 | Images trong `public/images/` | âš ï¸ Partial | CÃ³ 18 files nhÆ°ng cáº§n kiá»ƒm tra xem cÃ³ Ä‘á»§ háº¿t chÆ°a |
| 9 | Route metadata helper | âœ… Pass | `routes.ts` â€” `buildMetadata()` + `canonicalUrl()` |
| 10 | KhÃ´ng hardcode fact á»Ÿ nhiá»u nÆ¡i | âš ï¸ Minor | VÃ i chá»— hardcode URL (xem chi tiáº¿t) |

---

## ÄÃ¡nh giÃ¡ chi tiáº¿t theo file

---

### 1. `src/lib/locations.ts` âœ… Tá»‘t

**ÄÃºng spec:**
- 4 courts Ä‘áº§y Ä‘á»§ fields: `id`, `name`, `shortName`, `schemaName`, `district`, `districtLabel`, `localPage`, address fields, `mapsUrl`, `geo`, `image`, `primaryForSchema`
- `mapsEmbed` correctly deferred (khÃ´ng cÃ³ trong type)
- Huá»‡ ThiÃªn marked `primaryForSchema: true` âœ…
- Helper `getCourtsForLocalPage()` vÃ  `courtLocationMap` há»¯u Ã­ch

**Issues:**

> [!WARNING]
> **`addressRegion` sai so vá»›i spec.** Spec yÃªu cáº§u `addressRegion: "HCM"` nhÆ°ng code dÃ¹ng `"Há»“ ChÃ­ Minh"`. Cáº§n xÃ¡c nháº­n cÃ¡i nÃ o Ä‘Ãºng cho schema â€” Google thÆ°á»ng cháº¥p nháº­n cáº£ hai, nhÆ°ng nÃªn nháº¥t quÃ¡n vá»›i spec. Náº¿u muá»‘n `"Há»“ ChÃ­ Minh"` thÃ¬ cáº§n update type definition tá»« `addressRegion: "HCM"` sang `addressRegion: "Há»“ ChÃ­ Minh"`.

> [!NOTE]
> **`addressLocality` cho Thá»§ Äá»©c.** Cáº£ 3 sÃ¢n Thá»§ Äá»©c Ä‘á»u dÃ¹ng `"Hiá»‡p BÃ¬nh"` â€” Ä‘Ã¢y cÃ³ thá»ƒ lÃ  phÆ°á»ng, khÃ´ng pháº£i quáº­n. Schema `addressLocality` thÆ°á»ng nÃªn lÃ  quáº­n/thÃ nh phá»‘ con. NÃªn kiá»ƒm tra láº¡i xem cÃ³ nÃªn dÃ¹ng `"Thá»§ Äá»©c"` cho `addressLocality` vÃ  dÃ¹ng phÆ°á»ng cho `streetAddress` khÃ´ng.

> [!NOTE]
> **SÃ¢n PhÃºc Lá»™c dÃ¹ng `share.google` URL** thay vÃ¬ `maps.app.goo.gl` nhÆ° 3 sÃ¢n kia. NÃªn nháº¥t quÃ¡n format.

**Äiá»ƒm tá»‘t:**
- `readonly` array + `as const` â€” immutable á»Ÿ runtime
- `courtLocationMap` táº¡o lookup O(1)
- Type export sáº¡ch

---

### 2. `src/lib/pricing.ts` âœ… Ráº¥t tá»‘t

**ÄÃºng spec:**
- Discriminated union `GroupTier | PrivateTier | EnterpriseTier` âœ…
- `BaseTier` with nested `cta: { label, ctaName }` âœ… (Ä‘Ãºng locked decision)
- `sessionsPerWeek` + `sessionsPerMonth` cáº£ hai âœ…
- `priceRangeContribution: null` cho enterprise âœ…
- `buildPriceRange()` + `sitePriceRange` export âœ…
- `displayPrice` stored, khÃ´ng rebuild âœ…

**Issues:**

> [!NOTE]
> **`formatVnd` dÃ¹ng `toLocaleString("vi-VN")`** â€” hÃ m nÃ y cháº¡y táº¡i build time nÃªn output phá»¥ thuá»™c vÃ o runtime environment. TrÃªn Vercel build thÆ°á»ng dÃ¹ng Node.js vá»›i ICU data. Kháº£ nÄƒng cao hoáº¡t Ä‘á»™ng Ä‘Ãºng, nhÆ°ng nÃªn verify khi deploy.

> [!NOTE]
> **Group tiers cÃ³ 3 entries thay vÃ¬ 2** (spec dÆ°á»ng nhÆ° chá»‰ nháº¯c 2: "nhÃ³m nhá»" tá»•ng thá»ƒ, vÃ  "1 kÃ¨m 1"). Hiá»‡n cÃ³ `group-basic-3x`, `group-advanced-3x`, `group-basic-2x` â€” Ä‘iá»u nÃ y há»£p lÃ½ vÃ¬ pháº£n Ã¡nh thá»±c táº¿ bÃ¡n hÃ ng, nhÆ°ng nÃªn confirm ráº±ng Ä‘Ã¢y lÃ  Ã½ Ä‘á»“.

**Äiá»ƒm tá»‘t:**
- Pricing model pháº£n Ã¡nh Ä‘Ãºng business tháº­t: monthly package, per-hour, quote
- Type intersection `BaseTier & { kind: ... }` pattern ráº¥t tá»‘t

---

### 3. `src/lib/schedule.ts` âœ… Tá»‘t

**ÄÃºng spec:**
- `ScheduleItem` cÃ³ Ä‘áº§y Ä‘á»§: `courtId`, `dayGroup`, `timeSlotId`, `timeLabel`, `level`, `levelLabel`, `prefillMessage`, `prefillCourtId`, `prefillTimeSlotId` âœ…
- `prefillTimeSlotId === timeSlotId` âœ… (enforced by factory)
- `createScheduleItem()` factory pattern tá»‘t â€” avoid manual duplication

**Issues:**

> [!WARNING]
> **Type cÃ³ thÃªm `levels: ScheduleLevel[]` vÃ  `levelLabels: string[]`** â€” spec chá»‰ yÃªu cáº§u `level` (singular) vÃ  `levelLabel`. Code thÃªm `levels` + `levelLabels` arrays (há»£p lÃ½ cho UI), nhÆ°ng `level` chá»‰ láº¥y `input.levels[0]` â€” chá»‰ giá»¯ level Ä‘áº§u tiÃªn. Äiá»u nÃ y cÃ³ thá»ƒ gÃ¢y confusion khi filter schedule theo level. NÃªn xÃ¡c Ä‘á»‹nh rÃµ: náº¿u 1 slot support cáº£ `co_ban` vÃ  `nang_cao`, thÃ¬ `level` field nÃ o Ä‘Æ°á»£c dÃ¹ng? NÃªn document hoáº·c bá» `level` singular náº¿u `levels[]` Ä‘á»§.

> [!NOTE]
> **15 schedule items** â€” con sá»‘ nÃ y há»£p lÃ½, nÃªn verify cross-reference vá»›i HTML production.

---

### 4. `src/lib/faqs.ts` âœ… Tá»‘t

**ÄÃºng spec:**
- Type Ä‘Ãºng: `id`, `page`, `order`, `question`, `answerText`, `answerHtml?`, `schemaEligible` âœ…
- 4 page groups: homepage (5), nguoi_moi (6), binh_thanh (5), thu_duc (5) = 21 FAQs âœ…
- `answerText` plain text, `answerHtml` optional âœ…
- `schemaEligible` all true âœ…
- `getFaqsForPage()` helper âœ…

**Issues:**

> [!NOTE]
> **Má»i FAQ Ä‘á»u `schemaEligible: true`** â€” hiá»‡n táº¡i khÃ´ng sao, nhÆ°ng field sáº½ cÃ³ Ã½ nÄƒng hÆ¡n khi cÃ³ FAQ nÃ o Ä‘Ã³ cáº§n áº©n khá»i schema. Hiá»‡n táº¡i logic Ä‘Ãºng.

> [!NOTE]
> **KhÃ´ng cÃ³ FAQ nÃ o dÃ¹ng `answerHtml`** â€” Ä‘Ãºng theo spec (Sprint 1 fill not required).

**Äiá»ƒm tá»‘t:**
- FAQ content chi tiáº¿t, chÃ­nh xÃ¡c giÃ¡, sÃ¢n, lá»‹ch
- Sort by `order` trong helper
- Pricing FAQ Ä‘Ã£ mention Ä‘Ãºng giÃ¡ tá»« pricing data (nhÆ°ng lÃ  hardcode string, khÃ´ng reference dynamic â€” trade-off há»£p lÃ½ cho Sprint 1)

---

### 5. `src/lib/tracking.ts` âœ… Ráº¥t tá»‘t

**ÄÃºng spec:**
- 9 event types Ä‘áº§y Ä‘á»§ âœ…
- `CtaName` 5 values âœ…
- `CtaLocation` 5 values âœ…
- `window.v2TrackEvent` global export âœ…
- Typed `EventParams` map âœ…
- `trackEvent()` push to `dataLayer` âœ…

**Issues:**

> [!NOTE]
> **`PageType` imported from `routes.ts`** âœ… â€” Ä‘Ãºng locked decision (routes.ts owns pageType).

**Äiá»ƒm tá»‘t:**
- `EventParams` discriminated map â€” type-safe má»—i event cÃ³ param riÃªng
- `generate_lead` bao gá»“m `time_to_submit_ms`, `submission_method` â€” ready cho Sprint 4
- `form_field_focus`, `form_abandon`, `time_to_submit` placeholder types â€” ready cho Sprint 4.3
- `registerGlobalTracker()` + `TrackingBootstrap.tsx` pattern sáº¡ch
- SSR guard `typeof window === "undefined"` âœ…

---

### 6. `src/lib/routes.ts` âœ… Ráº¥t tá»‘t

**ÄÃºng spec:**
- 4 core routes chÃ­nh xÃ¡c âœ…
- `PageType` union âœ…
- `canonicalUrl()` trailing slash aware âœ…
- `buildMetadata()` accept overrides âœ…
- OG image, locale, siteName Ä‘á»u tá»« `siteConfig` âœ…

**Issues:**

> [!NOTE]
> **`routeCards` export `summary` field** â€” Ä‘Ã¢y lÃ  internal note, khÃ´ng pháº£i user-facing content. Hiá»‡n chá»‰ dÃ¹ng trong workspace page nÃªn OK.

> [!NOTE]
> **`reservedRoutePrefixes`** â€” nice forward-thinking, nhÆ°ng hiá»‡n khÃ´ng cÃ³ code enforce nÃ³. CÃ³ thá»ƒ thÃªm validation helper sau.

> [!NOTE]
> **`normalizeRoutePath()` cast `as CoreRoutePath`** â€” unsafe cast. NÃªn validate hoáº·c dÃ¹ng runtime check trÆ°á»›c cast. Tuy nhiÃªn vÃ¬ hÃ m chá»‰ dÃ¹ng internal, risk tháº¥p.

**Äiá»ƒm tá»‘t:**
- `buildMetadata()` pattern ráº¥t tá»‘t â€” xÃ¢y tá»« route entry, merge overrides cleanly
- `canonicalUrl()` handle edge cases: asset paths, leading slash, trailing slash
- `coreRouteMap` O(1) lookup

---

### 7. `src/lib/site.ts` âœ… Tá»‘t

- Centralized site config: name, URL, OG, locale, phone, Zalo, Facebook, privacy path âœ…
- `moneyPages` array cho future expansion â€” nice
- Phone number consistent giá»¯a display vÃ  E.164 âœ…

---

### 8. `src/lib/schema.ts` âœ… Ráº¥t tá»‘t

**ÄÃºng spec trÃªn táº¥t cáº£ schema families:**
- `Organization` âœ…
- `WebSite` âœ…  
- `FAQPage` âœ…
- `BreadcrumbList` âœ…
- `SportsActivityLocation` âœ…
- `LocalBusiness` (homepage + local pages) âœ…
- `Course` âœ…

**Issues:**

> [!NOTE]
> **`buildHomepageLocalBusinessSchema()` dÃ¹ng `@type: ["LocalBusiness", "SportsActivityLocation"]`** â€” multi-type Ä‘Ãºng schema.org best practice cho business + sports venue.

**Äiá»ƒm tá»‘t:**
- `buildPostalAddress()` DRY helper
- `@id` anchors cho `Organization` vÃ  `WebSite` cross-reference
- `location` array trong LocalBusiness â€” tá»‘t cho multi-location business
- `buildLocalPageBusinessSchema()` dÃ¹ng `areaServed` â€” âœ… local SEO

---

### 9. `src/components/ui/JsonLd.tsx` âœ… Tá»‘t

- Server component (no `"use client"`) âœ…
- Accept `JsonLdNode | ReadonlyArray<JsonLdNode>` âœ…
- `JSON.stringify` + escape `<` â†’ `\\u003c` âœ… (XSS safe)
- Optional `id` prop âœ…

---

### 10. `src/components/layout/Nav.tsx` âš ï¸ Cáº§n cáº£i thiá»‡n

**ÄÃºng spec:**
- Logo, nav links, CTA button, mobile menu âœ…
- `<details>` for mobile menu â€” accessible pattern âœ…

**Issues:**

> [!NOTE]
> **Nav hiá»‡n giá»¯ Ä‘Ãºng hÆ°á»›ng IA cá»§a production hÆ¡n lÃ  má»™t bug parity.** Production HTML hiá»‡n táº¡i váº«n Æ°u tiÃªn section-anchor links trÃªn homepage; cÃ¡c deep link sang SEO pages náº±m á»Ÿ nhá»¯ng cá»¥m internal link khÃ¡c trÃªn page/footer. Náº¿u muá»‘n thÃªm cross-page links ngay trong nav, nÃªn ghi nháº­n Ä‘Ã¢y lÃ  **IA improvement** cho sprint sau, khÃ´ng nÃªn xem lÃ  lá»—i parity cá»§a Sprint 1.

> [!NOTE]
> **Mobile menu `<details>` khÃ´ng auto-close khi click link** â€” khi user click má»™t link trong mobile menu, `<details>` váº«n má»Ÿ. Cáº§n thÃªm client-side logic hoáº·c CSS trick. NhÆ°ng Ä‘Ã¢y lÃ  Sprint 1, UI parity chÆ°a yÃªu cáº§u.

> [!NOTE]
> **CTA "ÄÄƒng kÃ½ ngay" link tá»›i `/#lien-he`** â€” OK cho homepage, nhÆ°ng khi navigate tá»« SEO pages, hash link sáº½ khÃ´ng scroll tá»›i form trÃªn homepage. Cáº§n review behavior cross-page.

---

### 11. `src/components/layout/Footer.tsx` âš ï¸ Cáº§n cáº£i thiá»‡n nhá»

**ÄÃºng spec:**
- Phone, Zalo, Facebook âœ…
- Links tá»›i SEO pages âœ…
- Copyright âœ…

**Issues:**

> [!NOTE]
> **Footer dùng `<a>` cho internal phone link nhưng `<Link>` cho pages** — nhất quán (phone là external protocol `tel:` nên `<a>` đúng).


---

### 12. `src/app/layout.tsx` âœ… Tá»‘t

- `Be_Vietnam_Pro` font â€” Vietnamese font, Ä‘Ãºng âœ…
- `lang="vi"` âœ…
- `metadataBase` tá»« `siteConfig.siteUrl` âœ…
- `allowIndexing` controlled by env var âœ…
- Nav + Footer + TrackingBootstrap âœ…

**Issues:**

> [!NOTE]
> **Root metadata `description`** lÃ  `"Next.js migration workspace..."` â€” ná»™i dung dev-only. KhÃ´ng áº£nh hÆ°á»Ÿng vÃ¬ má»—i page override qua `buildMetadata()`, nhÆ°ng nÃªn cáº©n tháº­n náº¿u cÃ³ page nÃ o quÃªn override.

---

### 13. `src/app/page.tsx` âœ… Tá»‘t (workspace page)

- JsonLd emits: Organization, WebSite, LocalBusiness, FAQPage, Course âœ…
- Reads tá»« data layers, khÃ´ng hardcode âœ…
- Hiá»‡n lÃ  workspace page, khÃ´ng pháº£i homepage production â€” OK cho Sprint 1

---

### 14. SEO Pages (nguoi-moi, binh-thanh, thu-duc) âœ… Skeleton OK

- Má»—i page cÃ³ metadata tá»« `buildMetadata()` âœ…
- JsonLd: BreadcrumbList + FAQPage + LocalBusiness (cho local pages) âœ…
- Content lÃ  skeleton vá»›i data shape â€” Ä‘Ãºng scope Sprint 1

**Issues:**
**Issues:** Không có issue đáng chú ý ở Sprint 1 sau cleanup breadcrumb helper.

---

### 15. `src/app/robots.ts` âœ… Tá»‘t

- AI crawler rules (GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot) âœ…
- Sitemap directive âœ…
- URL tá»« `siteConfig` âœ…

---

### 16. `src/app/sitemap.ts` âœ… Tá»‘t

- Generated tá»« `coreRoutes` âœ…
- `canonicalUrl()` âœ…
- `lastModified` hardcoded â€” OK cho sprint

---

### 17. `src/app/api/lead/route.ts` âš ï¸ Cáº§n xÃ³a

> [!IMPORTANT]
> **TASKS.md (2.17) nÃ³i xÃ³a `/api/lead` route** â€” Server Action lÃ  canonical submit path. Sprint 1 váº«n giá»¯ scaffold 501, nhÆ°ng TASKS.md nÃ³i "Delete `/api/lead` route placeholder" trong Sprint 2. Hiá»‡n táº¡i khÃ´ng block, nhÆ°ng note ráº±ng file nÃ y sáº½ bá»‹ xÃ³a.

---

### 18. `next.config.ts` âœ…

- `trailingSlash: true` âœ… â€” match route strategy

---

### 19. `public/images/` âš ï¸ Cáº§n review

18 files Ä‘Ã£ cÃ³, bao gá»“m:
10 files hiện còn lại, bao gồm:
- ✅ Court photos: `green.webp`, `hue-thien.webp`, `khang-sport.webp`, `phuc-loc.webp`
- ✅ Hero logo: `hero-logo.webp`
- ✅ Course images: `course-basic.webp`, `course-advanced.webp`, `course-enterprise.webp`
- ✅ Business: `biz-team-building.webp`
- ✅ Source logo: `V2 logo.png`
- ⚠️ OG image: `og-image.jpg` (trong `public/`, không trong `public/images/`)

**Issues:**

> [!NOTE]
> **Cleanup đã hoàn tất cho asset thừa.** Các PNG/JPG gốc nặng và file template mặc định của Create Next App đã được xóa khỏi repo Next. Phần còn lại là bộ asset phục vụ migration và một file logo source có thể giữ lại nếu team còn dùng về sau.

---

### 20. `globals.css` âœ… Tá»‘t

- Dark theme consistent âœ…
- CSS custom properties âœ…
- Mobile-first responsive âœ…
- Sticky header with blur âœ…

---

## Bugs / Váº¥n Ä‘á» cáº§n fix

| Priority | File | Váº¥n Ä‘á» |
|----------|------|--------|
| 🟡 Medium | `locations.ts` | `addressRegion: "Hồ Chí Minh"` nhưng type spec nói `"HCM"` — cần align |
| 🟢 Low | `Nav.tsx` | Có thể bổ sung cross-page nav links như một IA improvement sau Sprint 1 |
| 🟢 Low | `schedule.ts` | `level` singular chỉ lấy `levels[0]`, có thể gây confusion |
| 🟢 Low | `locations.ts` | Phúc Lộc dùng `share.google` URL format khác 3 sân kia |

---

## Improvement Suggestions

### Architecture
1. **ThÃªm barrel export** `src/lib/index.ts` â€” optional nhÆ°ng giÃºp import gá»n hÆ¡n
2. **ThÃªm `getScheduleForCourt(courtId)`** helper trong `schedule.ts` cho Sprint 2
3. **ThÃªm `getScheduleForDistrict(districtId)`** helper cho filter tabs

### Type Safety
4. **`normalizeRoutePath()` nÃªn validate** thay vÃ¬ unsafe cast `as CoreRoutePath`
5. **`FaqPageId` cÃ³ thá»ƒ derive tá»« `coreRoutes`** thay vÃ¬ manual sync

### Performance
6. **XÃ³a PNG gá»‘c lá»›n** khá»i git tracking â€” chá»‰ giá»¯ webp
7. **Favicon** lÃ  25KB `.ico` â€” cÃ³ thá»ƒ optimize thÃªm

### DX
8. **ThÃªm `README` section** cho Sprint 1 data shape conventions
9. **ThÃªm lint rule** cho `"use client"` boundary (Ä‘Ã£ clean, nhÆ°ng preventive)

---

## Verdict

> [!TIP]
> **Sprint 1 Ä‘áº¡t má»¥c tiÃªu vÃ  foundation Ä‘á»§ máº¡nh Ä‘á»ƒ Ä‘i tiáº¿p.** Data layer cháº¯c cháº¯n, type system cháº·t vÃ  kiáº¿n trÃºc tá»•ng thá»ƒ á»•n. Hai issue lá»›n nháº¥t á»Ÿ lá»›p schema/data-source (`sitePriceRange` vÃ  duplicate `Course` name) Ä‘Ã£ Ä‘Æ°á»£c vÃ¡, nÃªn pháº§n cÃ²n láº¡i chá»§ yáº¿u lÃ  cleanup medium/low trÆ°á»›c hoáº·c trong Ä‘áº§u Sprint 2.

### Äiá»ƒm máº¡nh ná»•i báº­t:
- **Discriminated union cho pricing** â€” pattern tá»‘t nháº¥t cho use case nÃ y
- **Schema builder functions** â€” DRY, composable, sáºµn sÃ ng cho má»i page
- **Tracking contract typed end-to-end** â€” má»—i event cÃ³ param shape riÃªng
- **Route metadata centralized** â€” `buildMetadata()` ráº¥t clean
- **`createScheduleItem()` factory** â€” avoid manual prefill duplication
- **TSC passes clean** â€” no type errors

### Trước khi bắt Sprint 2, nên fix:
1. Chốt lại convention `addressRegion` giữa code và spec (`"HCM"` vs `"Hồ Chí Minh"`)
2. Quyết định rõ vai trò của `level` singular so với `levels[]` trong `schedule.ts`
3. Nếu cần, chuẩn hóa URL Google Maps của Phúc Lộc sang cùng format với các sân còn lại
