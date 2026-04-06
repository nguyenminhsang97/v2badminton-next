# V2 Badminton — Sprint 1 Review Notes

> Meeting notes for Sprint 1 technical review + data modeling review.
> Date: 2026-04-06
> Scope: `TASKS.md` Sprint 1 and Sprint 2 preconditions

---

## 1. Outcome

**Decision:** Sprint 1 is approved to start.

Reason:

- backlog direction is now stable
- no architecture blocker remains
- core migration constraints are explicit
- SEO-critical data requirements are clear enough to shape the foundation correctly

This approval is for:

- data layer
- layout foundation
- metadata foundation
- JSON-LD foundation

This is **not** approval to cut corners on:

- tracking parity
- form pipeline
- schedule-to-form prefill
- lead persistence

---

## 2. Technical Review Decisions

### 2.1 Submit architecture

Locked decision:

- **Server Action is the canonical form submit path**

Implications:

- no form submission through `/api/lead`
- progressive enhancement is native
- CSRF risk is lower than a custom route-handler-first approach

Supporting routes that still exist:

- `/api/health`
- `/api/form-token`

### 2.2 Homepage rendering strategy

Locked decision:

- homepage remains **primarily SSG**
- request-time logic must not break static rendering

Implications:

- anti-spam timing check cannot rely on tokens baked into static HTML
- JS timing token comes from a **dynamic endpoint**: `/api/form-token`
- no-JS path uses:
  - honeypot
  - stricter rate limit
  - `submission_method: "no_js"`

### 2.3 Lead pipeline order

Locked order:

1. validate
2. anti-spam checks
3. save to DB
4. notify Telegram
5. notify email backup
6. return success
7. client fires `generate_lead`

Rule:

- **save first, notify second**

### 2.4 Monitoring

Locked decision:

- monitoring starts in the same implementation wave as the form/backend

Minimum stack:

- Sentry for client + server
- uptime monitoring on `/api/health`
- lead failure alerting

### 2.5 Security baseline

Locked controls:

- honeypot
- Turnstile on JS path
- rate limiting
- server-side validation

### 2.6 URL and canonical policy

Locked decision:

- `trailingSlash: true`

Need in Sprint 1:

- canonical URL helper
- route registry for the 4 current production URLs

### 2.7 Tracking contract

Locked parity events:

- `cta_click`
- `contact_click`
- `map_click`
- `form_start`
- `generate_lead`
- `form_error`

Locked new form analytics:

- `form_field_focus`
- `form_abandon`
- `time_to_submit`

Rule:

- no raw `dataLayer.push` scattered in components
- all tracking goes through `src/lib/tracking.ts`

---

## 3. Data Modeling Decisions

### 3.1 `locations.ts`

This file must be **schema-ready**, not only UI-ready.

Required fields:

- `id`
- `name`
- `schemaName`
- `shortName`
- `district`
- `districtLabel`
- `localPage`
- `primaryForSchema`
- `mapsUrl`
- `geo.lat`
- `geo.lng`
- `image`
- `imageAlt`
- `streetAddress`
- `addressLocality`
- `addressRegion`
- `addressCountry`
- `addressText`

Rules:

- `addressText` is for display only
- schema generation must not parse freeform address strings later
- deep-link mapping to local pages belongs here, not in component code

### 3.2 `pricing.ts`

Locked direction:

- use a **discriminated union**
- do not flatten all tiers into one fake numeric model

Required fields:

- `id`
- `kind`
- `name`
- `description`
- `displayPrice`
- `billingModel`
- `features`
- `ctaName`

By tier type:

- group:
  - `groupSize`
  - `sessionsPerWeek: 2 | 3` — bán theo "2 buổi/tuần" hoặc "3 buổi/tuần", không chỉ sessionsPerMonth
  - `sessionsPerMonth: number` — derived từ sessionsPerWeek × 4
  - `pricePerMonth: number` — VND
- private:
  - `pricePerHour: number` — VND
- enterprise:
  - `priceLabel: string` — "Liên hệ báo giá"

`billingModel` type:

```ts
type BillingModel = "monthly_package" | "per_hour" | "quote";
```

- group → `"monthly_package"`
- private → `"per_hour"`
- enterprise → `"quote"`

Dùng trong render để biết có hiện price hay CTA "liên hệ" mà không cần switch trên `kind` ở mọi nơi.

`priceRangeContribution` type:

```ts
priceRangeContribution: { min: number; max: number } | null;
// null cho enterprise vì không có giá cố định
```

- group example: `{ min: 400_000, max: 1_500_000 }` (VND/tháng)
- private example: `{ min: 200_000, max: 200_000 }` (giá/giờ nếu cố định)
- enterprise: `null`

Aggregate cho `priceRange` schema:

```ts
export const sitePriceRange = buildPriceRange(pricingTiers);
// → "400.000đ – 1.500.000đ" — dùng cho LocalBusiness.priceRange
```

`buildPriceRange` lấy tất cả `priceRangeContribution` không null, lấy min của mins và max của maxes.

### 3.3 `schedule.ts`

Required fields:

- `id`
- `courtId`
- `dayGroup`
- `timeSlotId` — machine ID, dùng cho form state và form submission
- `timeLabel` — display string, dùng cho UI render
- `level`
- `levelLabel` — display string, dùng cho UI render
- `prefillMessage` — nội dung điền vào textarea message
- `prefillCourtId` — court ID điền vào form select (thường = `courtId`, nhưng tách biệt để forward-compatible)
- `prefillTimeSlotId` — time slot ID điền vào form select (= `timeSlotId`)

Rules:

- `prefillCourtId` + `prefillTimeSlotId` + `prefillMessage` là **bộ ba bắt buộc** cho Sprint 2 prefill flow
- Sprint 2 sẽ đọc trực tiếp ba fields này — không rebuild từ `courtId` hay `timeLabel`
- `timeSlotId` và `prefillTimeSlotId` phải dùng cùng enum với form select options
- `timeLabel` và `timeSlotId` phải cùng tồn tại: một cho hiển thị, một cho state

Lý do tách `timeSlotId` vs `timeLabel`:

- form select cần ID để set state
- UI card cần label để render
- nếu chỉ có một, hoặc phải parse label thành ID (không tin được), hoặc hardcode mapping trong component (sai)

### 3.4 `faqs.ts`

Required fields:

- `id`
- `page`
- `question`
- `answerText`
- `answerHtml` optional
- `schemaEligible`
- `order`

Rule:

- FAQPage schema should read from schema-safe text, not from stripped arbitrary HTML

### 3.5 Route/metadata foundation

Sprint 1 should create a route metadata foundation even before all page copy is ported.

File: `src/lib/routes.ts` — tách khỏi `site.ts` vì scope khác nhau.

`pageType` location decision: **`routes.ts`**, không phải `tracking.ts` hay `site.ts`.

- `tracking.ts` chứa event types, không chứa page identity
- `site.ts` chứa global site config, không phải per-route metadata
- `routes.ts` owns per-route facts — đây là nơi `pageType` thuộc về

`tracking.ts` import `PageType` từ `routes.ts`:

```ts
// tracking.ts
import type { PageType } from "./routes";
```

Required type:

```ts
type PageType = "homepage" | "seo_local" | "seo_service" | "seo_support";

type RouteMetadata = {
  route: string;              // "/lop-cau-long-binh-thanh/"
  canonicalPath: string;      // = route (same with trailingSlash: true)
  pageType: PageType;
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage: string;     // path relative to /public
};
```

Canonical helper cũng nằm trong file này:

```ts
export function canonicalUrl(path: string): string {
  // always trailing slash, always absolute
  const clean = path.endsWith("/") ? path : path + "/";
  return siteConfig.siteUrl + clean;
}
```

---

## 4. SEO Input That Should Not Wait

These items were considered SEO-critical for Sprint 1 and should not be deferred:

- structured address fields in `locations.ts`
- local deep-link mapping in `locations.ts`
- canonical URL helper
- route registry
- schema-safe FAQ shape
- `priceRange` support in pricing data
- `JsonLd` support for:
  - `Organization`
  - `WebSite`
  - `LocalBusiness`
  - `FAQPage`

Not urgent in Sprint 1:

- `mapsEmbed`
- final per-page metadata copy
- full `Course` schema payload content

---

## 5. Resolved Questions From SPRINT_1_DETAILING.md

SPRINT_1_DETAILING.md §8 có 4 open questions. Chốt tại đây:

### `mapsEmbed` — deferred, không có trong Sprint 1 type

`SPRINT_1_DETAILING.md` còn `mapsEmbed` trong `CourtLocation` type nhưng MEETING_NOTES §4 đã đặt nó vào "not urgent in Sprint 1".

Chốt: **`mapsEmbed` không có trong Sprint 1 `CourtLocation` type**. Nếu sau này cần embed iframe, thêm sau. `mapsUrl + geo` đủ cho Sprint 1.

`SPRINT_1_DETAILING.md` cần xóa `mapsEmbed` khỏi type definition.

### Pricing features — plain strings

Chốt: **`features: string[]`** — mảng string display-ready. Không cần structured bullet IDs ở giai đoạn này. Nếu sau này cần filter/compare features, migrate sau.

### `faq.answerHtml` — optional, không bắt buộc Sprint 1

Chốt: **`answerHtml?: string`** — optional. Sprint 1 implementation không cần fill nó, nhưng field phải có trong type để Sprint 2/3 không phải sửa type.

### `cta` field shape — nested, thống nhất 3 file

Hiện tại: DETAILING + TASKS.md dùng `cta: { label, ctaName }` (nested); MEETING_NOTES §3.2 dùng flat `ctaName`.

Chốt: **nested**:

```ts
cta: {
  label: string;      // UI button text — "Đăng ký học thử"
  ctaName: CtaName;   // tracking enum — "dang_ky_hoc_thu"
};
```

MEETING_NOTES §3.2 (pricing.ts fields) cần update sang nested. Nested giữ label và tracking name cùng chỗ — không tách thành hai fields rời nhau.

---

## 7. Open Questions (vendor choices only — none block Sprint 1)

### 5.1 Monitoring vendor

Choose one:

- UptimeRobot
- Better Stack
- Vercel Cron + internal health check

### 5.2 Email backup provider

Likely:

- Resend

### 5.3 Database tooling

Choose one:

- raw SQL
- Drizzle

Recommendation:

- Drizzle if you want type-safe migrations

### 5.4 Turnstile UI strategy

Need final implementation choice:

- visible widget
- invisible/non-intrusive integration

---

## 8. Definition of Done for Sprint 1

Sprint 1 is done when:

- `locations.ts` is schema-ready
- `pricing.ts` supports real business model + `priceRange` derivation
- `schedule.ts` supports render + prefill
- `faqs.ts` supports render + FAQPage schema
- route registry exists for all 4 current routes
- canonical URL helper returns trailing-slash URLs
- `JsonLd` can render typed payloads
- Nav and Footer exist as reusable components
- none of the above hardcodes schema mappings in section components

---

## 7. Recommended Build Order After This Meeting

1. `src/lib/locations.ts`
2. `src/lib/pricing.ts`
3. `src/lib/schedule.ts`
4. `src/lib/faqs.ts`
5. route registry + canonical helper
6. `src/components/ui/JsonLd.tsx`
7. `src/components/layout/Nav.tsx`
8. `src/components/layout/Footer.tsx`

Only after that:

- homepage visual port
- form vertical slice
- SEO page port

---

## 9. Go/No-Go

**Go**

Sprint 1 can begin immediately with the current plan and this note as the detailing layer.

**No-Go conditions**

Pause before Sprint 2 if any of these are still unresolved:

- no decision on DB provider
- no decision on Sentry/uptime vendor
- no route registry
- no canonical helper
- no schema-ready `locations.ts`
