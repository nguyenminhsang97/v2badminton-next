# Sprint 1 Detailing

> Working-session notes for Sprint 1 of the V2 Badminton Next.js migration.
> Scope: make Sprint 1 implementation-ready, not just high-level.
> Source docs: `MASTERPLAN.md`, `NEXTJS_MIGRATION_PLAN.md`, `TASKS.md`

---

## 1. Sprint Goal

Sprint 1 exists to lock the data model and shared foundations so later sprints do not re-encode business facts in multiple places.

By the end of Sprint 1, the repo should have:

- one source of truth for locations
- one source of truth for pricing
- one source of truth for schedules
- one source of truth for FAQs
- a typed tracking contract
- reusable `Nav`, `Footer`, and `JsonLd`
- metadata/schema-safe data fields already present, even if some pages are built later

Sprint 1 is **not** the sprint for homepage parity, form submit, or live analytics wiring.

---

## 2. Locked Decisions

These are not open questions anymore:

- Hosting target: Vercel
- Route strategy: keep current production URLs
- Form strategy later: Server Action is canonical submit path
- Homepage remains mostly SSG
- Court pages stay inside local pages, not separate URLs
- Tracking contract stays locked to current production semantics

---

## 3. Sprint 1 Out of Scope

Do not pull these into Sprint 1:

- homepage visual parity
- schedule -> form prefill implementation
- form submit pipeline
- Turnstile
- Sentry
- DB setup
- cookie consent
- Meta Pixel wiring

Those belong to later sprints even if Sprint 1 prepares the shape they depend on.

---

## 4. Ticket Detail

## 4.1 `src/lib/locations.ts`

### Purpose

Central source of truth for every court/location fact used by:

- homepage location cards
- local SEO pages
- LocalBusiness / SportsActivityLocation schema
- map links
- internal links

### Required fields

```ts
type DistrictId = "binh_thanh" | "thu_duc";

type CourtLocation = {
  id: "green" | "hue_thien" | "khang_sport" | "phuc_loc";
  name: string;
  shortName: string;
  schemaName: string;
  district: DistrictId;
  localPage: "/lop-cau-long-binh-thanh/" | "/lop-cau-long-thu-duc/";

  addressText: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: "HCM";
  addressCountry: "VN";

  mapsUrl: string;
  mapsLabel: string;
  geo: { lat: number; lng: number };
  // mapsEmbed: deferred — not in Sprint 1 type (see SPRINT1_MEETING_NOTES §5)

  districtLabel: string;        // "Bình Thạnh" | "Thủ Đức" — for UI display

  image: string;
  imageAlt: string;

  primaryForSchema?: boolean;
};
```

### SEO-critical rules

- Keep both `addressText` and structured address fields.
- `localPage` is required from day 1 for internal-link parity.
- One court on Thu Duc side must be marked `primaryForSchema` for root LocalBusiness fallback.
- `schemaName` must be stable and match page/schema copy exactly.

### Done when

- all 4 courts exist in one typed array
- no address or map URL is hardcoded elsewhere
- the data is sufficient to render both card UI and JSON-LD without extra manual mapping

---

## 4.2 `src/lib/pricing.ts`

### Purpose

Single source of truth for:

- homepage pricing cards
- nguoi-moi page pricing
- FAQ answers about pricing
- schema `priceRange`

### Required fields

```ts
type BaseTier = {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  features: string[];
  cta: {
    label: string;
    ctaName: "dang_ky_hoc_thu" | "nhan_bao_gia";
  };
};

type GroupTier = BaseTier & {
  kind: "group";
  billingModel: "monthly_package";
  groupSize: "2-6 nguoi";
  sessionsPerWeek: 2 | 3;
  sessionsPerMonth: number;     // derived: sessionsPerWeek × 4
  pricePerMonth: number;        // VND
  displayPrice: string;
  priceRangeContribution: { min: number; max: number };
};

type PrivateTier = BaseTier & {
  kind: "private";
  billingModel: "per_hour";
  pricePerHour: number;         // VND
  displayPrice: string;
  priceRangeContribution: { min: number; max: number };
};

type EnterpriseTier = BaseTier & {
  kind: "enterprise";
  billingModel: "quote";
  priceLabel: string;           // "Liên hệ báo giá"
  displayPrice: string;
  priceRangeContribution: null; // no fixed price
};
```

### SEO-critical rules

- Keep `displayPrice` so copy, FAQ, and schema do not rebuild strings differently.
- Keep `sessionsPerWeek`, not only `sessionsPerMonth`, because user-facing copy is sold as `2 buổi/tuần` and `3 buổi/tuần`.
- `cta` field is **nested** (locked decision — see SPRINT1_MEETING_NOTES §5): `cta: { label: string; ctaName: CtaName }`.
- `priceRangeContribution` is `{ min, max }` for priced tiers, `null` for enterprise.
- Add one derived export:

```ts
export const sitePriceRange = buildPriceRange(pricingTiers);
// buildPriceRange: take min of all mins, max of all maxes, format as "Xđ – Yđ"
```

This avoids recomputing `priceRange` in multiple pages.

### Done when

- every current offer maps cleanly to one tier
- no tier needs meaningless null pricing fields
- `sitePriceRange` can be reused in schema immediately

---

## 4.3 `src/lib/schedule.ts`

### Purpose

Single source of truth for schedule display and later schedule-to-form prefill.

### Required fields

```ts
type ScheduleLevel = "co_ban" | "nang_cao" | "doanh_nghiep";

type ScheduleItem = {
  id: string;
  courtId: CourtLocation["id"];
  dayGroup: string;
  timeSlotId: string;           // machine ID — for form select state
  timeLabel: string;            // display string — for UI card render
  level: ScheduleLevel;
  levelLabel: string;           // display string — for UI card render
  prefillMessage: string;       // text → form textarea (message field)
  prefillCourtId: CourtLocation["id"];  // → form select (court field)
  prefillTimeSlotId: string;    // → form select (time_slot field), must = timeSlotId
};
```

### Conversion-critical rules

- `prefillMessage` must be stored in data, not built ad hoc in UI.
- `prefillCourtId` and `prefillTimeSlotId` must use the same IDs the form will use later.
- `timeLabel` and `timeSlotId` must both exist:
  - label for UI
  - id for state/form submission

### Done when

- schedule cards can later be rendered without hardcoded text
- prefill values are already normalized for Sprint 2

---

## 4.4 `src/lib/faqs.ts`

### Purpose

Single source of truth for visible FAQ content and FAQ schema.

### Required fields

```ts
type FaqPageId = "homepage" | "nguoi_moi" | "binh_thanh" | "thu_duc";

type FaqItem = {
  id: string;
  page: FaqPageId;
  order: number;               // render order within page group
  question: string;
  answerText: string;          // schema-safe plain text — always required
  answerHtml?: string;         // optional richer HTML — not required in Sprint 1
  schemaEligible: boolean;
};
```

### SEO-critical rules

- `answerText` is mandatory for schema-safe plain text.
- `answerHtml` is optional for richer on-page rendering.
- `schemaEligible` is required so page UI and FAQ schema can diverge safely if needed later.
- Pricing FAQ and location-selection FAQ must already be present in the right page groups.

### Done when

- page UI and `FAQPage` JSON-LD can both be rendered from the same dataset
- no FAQ answer requires HTML parsing to produce schema text

---

## 4.5 `src/lib/tracking.ts`

### Purpose

Typed wrapper around current analytics contract so future components do not push ad hoc `dataLayer` objects.

### Required exports

```ts
type TrackingEvent =
  | "cta_click"
  | "contact_click"
  | "map_click"
  | "form_start"
  | "generate_lead"
  | "form_error"
  | "form_field_focus"
  | "form_abandon"
  | "time_to_submit";

type CtaName =
  | "dang_ky_ngay"
  | "dang_ky_hoc_thu"
  | "xem_khoa_hoc"
  | "nhan_bao_gia"
  | "nhan_zalo_tu_van";

type CtaLocation =
  | "nav"
  | "hero"
  | "business"
  | "seo_cta_block"
  | "location_cards";
```

### Analytics-critical rules

- Keep the wrapper in Sprint 1 even if not every event is wired yet.
- Add placeholder types for post-parity form analytics now, so later tickets do not mutate the contract again.
- Include a typed `pageType` union early:

```ts
type PageType = "homepage" | "seo_local" | "seo_service" | "seo_support";
```

### Done when

- later components can import types instead of inventing strings
- no direct `window.dataLayer.push(...)` is needed outside the wrapper

---

## 4.6 `public/images/`

### Purpose

Move image ownership into the Next repo.

### Rules

- Keep file names stable and readable.
- Keep alt-text mapping next to data or alongside components, not as ad hoc props.
- Do not defer missing image inventory to later sprints.

### Done when

- all current production images needed for homepage + SEO pages exist locally
- hero, court, business, OG candidates, and logo assets are all present

---

## 4.7 `Nav` and `Footer`

### Purpose

Shared shell for all routes.

### Required behavior

- nav links match current production IA
- footer includes core contact paths and policy link placeholder
- mobile menu structure is accessible from day 1

### SEO/UX rules

- footer should reserve space for `/chinh-sach-bao-mat/`
- no external contact URL should be hardcoded in multiple files

### Done when

- all top-level routes can use one shared shell
- header/footer do not block later parity work

---

## 4.8 `JsonLd`

### Purpose

Reusable schema renderer with no page-specific hardcoding.

### Requirements

- server-rendered only
- plain object input
- safe serialization
- no client dependency

### SEO-critical additions

Sprint 1 should already support these schema families structurally:

- `LocalBusiness`
- `SportsActivityLocation`
- `FAQPage`
- `BreadcrumbList`
- `Course`
- `Organization`
- `WebSite`

Even if not every page emits all of them yet.

### Done when

- page tickets in Sprint 2/3 can pass schema objects without rewriting serializer logic

---

## 5. Cross-ticket Additions From SEO Review

These should not wait until later sprints.

### 5.1 Metadata foundations

Add a small site metadata helper in Sprint 1, even if page metadata is completed later.

Minimum:

- site name
- site URL
- default OG image path
- canonical builder
- trailing slash aware URL helper

### 5.2 Internal link implications

`locations.ts` must expose `localPage` now.

If this is deferred, Sprint 2 location cards and Sprint 3 SEO links will drift.

### 5.3 Schema-ready text discipline

For FAQs and pricing:

- keep display text
- keep schema-safe plain text
- do not rely on stripping HTML later

---

## 6. Suggested Owners

If team capacity is split by concern:

- Data/model owner:
  - `locations.ts`
  - `pricing.ts`
  - `schedule.ts`
  - `faqs.ts`
- Frontend foundation owner:
  - `Nav`
  - `Footer`
  - image migration
  - `JsonLd`
- Analytics/platform owner:
  - `tracking.ts`
  - metadata helper
  - route-safe utilities

If one dev is doing Sprint 1 alone, still follow this order:

1. data libs
2. tracking/types
3. metadata/schema helper
4. shell components
5. images

---

## 7. Sprint 1 Acceptance Criteria

Sprint 1 passes only if:

- [ ] all 4 courts exist in one typed source of truth
- [ ] all current pricing offers exist in one typed source of truth
- [ ] schedule data is normalized enough for future prefill
- [ ] FAQ data can render both page UI and FAQ schema safely
- [ ] tracking contract compiles with locked enums/unions
- [ ] `JsonLd` can render typed schema objects server-side
- [ ] shared nav/footer render across app routes
- [ ] required images are present in `public/images/`
- [ ] route metadata helper exists for later parity work
- [ ] no production fact is hardcoded in more than one place

---

## 8. Resolved Questions (from SPRINT1_MEETING_NOTES §5)

All four open questions are now resolved. No architecture questions remain open for Sprint 1.

| Question | Resolution |
|---|---|
| `mapsEmbed` vs `mapsUrl + geo` | **`mapsUrl + geo` only** — `mapsEmbed` deferred, not in Sprint 1 type |
| Pricing features: strings or IDs? | **Plain `string[]`** — no structured IDs needed now |
| `faq.answerHtml` required or optional? | **Optional** — field exists in type, Sprint 1 fill not required |
| `pageType` location: `tracking.ts` vs `site.ts`? | **`routes.ts`** — per-route facts belong there; `tracking.ts` imports the type |

Types in this file have been updated to reflect these decisions.
