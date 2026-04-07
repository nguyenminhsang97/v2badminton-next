# V2 Badminton - Sprint 2 Task Corrections

> Date: 2026-04-07
> Branch: `codex/sprint2-plan`
> Purpose: ghi lại các correction cần khóa trước khi break Sprint 2 thành implementation tasks.
>
> File này không thay thế:
> - `SPRINT2_PLAN.md`
> - `SPRINT2_TICKET_DETAILING.md`
> - `TASKS.md`
>
> Nó tồn tại để capture các ambiguity/blocker đã tìm thấy sau khi đọc toàn bộ docs Sprint 2.

---

## 1. Summary

Tìm thấy 7 vấn đề cần khóa rõ trước khi break task:

1. `S2-B6` có trong plan nhưng không có detailing.
2. `S2-A0` và `S2-E4` đã hoàn thành từ Sprint 1 nhưng docs vẫn mô tả như task build mới.
3. `S2-B2` chưa chốt cơ chế "focus after scroll settles".
4. `S2-D1` nói có delivery-audit fields nhưng không chốt tên cột cụ thể.
5. `S2-D2` yêu cầu duplicate-submit policy nhưng không định nghĩa policy.
6. Hành vi location cards mâu thuẫn giữa `MASTERPLAN.md` và docs Sprint 2.
7. `S2-A5` thiếu spec cách course cards tương tác với shared conversion controller.

---

## 2. Corrections To Lock Before Task Breakdown

### 2.1 `S2-B6` must get full detailing

**Problem**

- `SPRINT2_PLAN.md` có `S2-B6 Implement one owner for homepage conversion state`
- `SPRINT2_TICKET_DETAILING.md` chưa có detailing riêng cho ticket này
- Đây là ticket kiến trúc quan trọng nhất của Sprint 2, vì `S2-A5`, `S2-B2`, `S2-B3`, `S2-C1` đều phụ thuộc vào nó

**Correction**

Thêm detailing đầy đủ cho `S2-B6` với nội dung tối thiểu:

- **Goal**
  - tạo một controller duy nhất cho homepage conversion state
- **Owns**
  - `selectedSchedulePrefill`
  - `selectedCourseIntent`
  - `businessMode`
  - `scrollTarget`
  - `autoPrefilledMessage`
  - `focusAfterScroll`
- **Consumed by**
  - `ScheduleSection`
  - course cards
  - business CTA
  - `ContactForm`
- **Files**
  - `src/components/home/HomepageConversionProvider.tsx`
  - `src/components/home/ScheduleSection.tsx`
  - `src/components/home/ContactForm.tsx`
  - homepage page composition
- **Acceptance**
  - không có source of truth thứ hai cho prefill/business-mode
  - `ScheduleSection` không tự map form values ngoài controller
  - `ContactForm` không tự recreate prefill/business-mode logic
  - course cards dispatch action vào controller thay vì tự scroll/filter độc lập

**Task-break rule**

- Không break `S2-A5`, `S2-B2`, `S2-B3`, `S2-C1` trước khi `S2-B6` có detailing rõ.

---

### 2.2 `S2-A0` and `S2-E4` are verify-not-build tickets now

**Problem**

- `buildMetadata("/")` đã có trong `src/app/page.tsx` từ Sprint 1
- homepage JSON-LD cũng đã render từ `page.tsx`
- nếu giữ wording như task build mới, team dễ waste effort hoặc vô tình rewrite thứ đã đúng

**Correction**

Đổi framing:

- `S2-A0`
  - từ: "Wire homepage metadata via `buildMetadata('/')`"
  - thành: "Verify homepage metadata parity survives homepage UI port"
- `S2-E4`
  - từ: "Render homepage JSON-LD baseline"
  - thành: "Verify homepage JSON-LD baseline remains intact after homepage rewrite"

**Acceptance update**

- `S2-A0`
  - `src/app/page.tsx` vẫn export `metadata = buildMetadata("/")`
  - không xuất hiện metadata hand-built mới trong homepage component tree
- `S2-E4`
  - homepage vẫn render `LocalBusiness`, homepage `FAQPage`, `Organization`, `WebSite`
  - không duplicate schema logic ngoài `src/lib/schema.ts`

---

### 2.3 `S2-B2` must define a concrete scroll-settle mechanism

**Problem**

- docs nói "focus first empty field after scroll settles"
- chưa nói "scroll settles" nghĩa là gì
- không được dựa vào `scrollend` vì iOS Safari không đáng tin cậy

**Correction**

Khóa cơ chế cụ thể cho `S2-B2`:

1. controller mở optional disclosure trước
2. gọi `formSection.scrollIntoView({ behavior: "smooth", block: "start" })`
3. bắt đầu settle loop bằng `requestAnimationFrame`
4. coi là settled khi:
   - `Math.abs(currentTop - previousTop) <= 4` trong 2 frame liên tiếp
   - hoặc timeout fallback `800ms`
5. sau đó mới focus field đầu tiên còn trống
6. nếu `prefers-reduced-motion` hoặc scroll behavior là instant, focus ở `requestAnimationFrame` kế tiếp

**Acceptance update**

- không dùng `scrollend` làm primitive chính
- mobile Safari vẫn focus đúng sau scroll
- form heading và field focused vẫn còn trong viewport sau settle

---

### 2.4 `S2-D1` must lock exact delivery-audit columns

**Problem**

- ticket detailing chỉ nói "delivery-audit fields"
- không chốt cụ thể tên cột nào, status nào

**Correction**

Khóa tối thiểu các cột sau trong lead table:

- `telegram_status`
- `telegram_attempted_at`
- `telegram_error`
- `email_status`
- `email_attempted_at`
- `email_error`

**Allowed status values**

- `pending`
- `sent`
- `failed`
- `skipped`

**Notes**

- `TASKS.md` đã ngầm đi theo naming này, nên `SPRINT2_TICKET_DETAILING.md` phải sync đúng naming đó
- chưa bắt buộc thêm `sent_at` riêng trong Sprint 2 nếu `status + attempted_at` đã đủ cho audit baseline

---

### 2.5 `S2-D2` must define duplicate-submit policy explicitly

**Problem**

- docs yêu cầu "duplicate-submit handling"
- chưa chốt duplicate là gì, window bao lâu, return behavior ra sao

**Correction**

Khóa server-side policy như sau:

- normalize:
  - `phone`
  - `name`
  - `court`
  - `time_slot`
  - `message`
  - `landing_page`
- tính `dedupe_key` từ payload normalized
- duplicate window: `15 minutes`
- nếu cùng `dedupe_key` xuất hiện trong 15 phút:
  - không insert lead mới
  - **short-circuit**: return `{ success: true, deduped: true }` ngay lập tức
  - không retry notify, không inspect bản ghi cũ
  - nếu notify gốc đã failed → đó là concern riêng (ops cron/manual retry), không piggyback trên duplicate request

**Reason**

- chặn double-click
- chặn user resubmit khi mạng chậm
- chặn no-JS retry tạo duplicate rows

---

### 2.6 Location-card behavior conflict must be marked as intentional deviation

**Problem**

- `MASTERPLAN.md` §8.7 yêu cầu location cards có cả maps + internal link
- docs Sprint 2 lại khóa behavior maps-only, internal links chỉ nằm ở SEO-links block

**Correction**

Ghi rõ đây là **intentional Sprint 2 deviation**:

- Sprint 2 ưu tiên parity với production homepage hiện tại
- location cards trong Sprint 2 vẫn **maps-first / maps-only**
- internal links cho local pages vẫn có ở standalone `#seo-links` block
- requirement thêm internal-link CTA trực tiếp trên location cards được **defer** sang:
  - Sprint 3, hoặc
  - một UX/SEO enhancement ticket riêng sau khi parity homepage ổn

**Doc note to add**

- Sprint 2 docs phải nói rõ đây là temporary deviation from `MASTERPLAN.md` §8.7, không phải team quên requirement

---

### 2.7 `S2-A5` must define interaction with the shared conversion controller

**Problem**

- `S2-A5` nói course cards giữ production interactions
- nhưng không chốt các interaction này đi qua shared conversion controller như thế nào

**Correction**

Khóa behavior:

- **Basic course card**
  - dispatch `controller.setCourseIntent("co_ban")`
  - clear business mode nếu đang active
  - scroll tới `#lich-hoc`
- **Advanced course card**
  - dispatch `controller.setCourseIntent("nang_cao")`
  - clear business mode nếu đang active
  - scroll tới `#lich-hoc`
- **Enterprise course card**
  - dispatch `controller.enterBusinessMode()`
  - clear schedule-prefill state
  - scroll tới `#lien-he`

**Hard rule**

- course cards không được tự giữ state filter/prefill/business-mode riêng
- course cards chỉ dispatch action vào `S2-B6` controller

**Acceptance update**

- `S2-A5` và `S2-B6` phải close cùng semantics
- enterprise card không reuse behavior của basic/advanced card

---

## 3. Corrected Ticket Framing

### `S2-A0`

- New framing: verify existing homepage metadata contract does not break during UI port

### `S2-A5`

- New framing: port course cards and wire them into the shared homepage conversion controller

### `S2-B2`

- New framing: implement schedule-card prefill with explicit rAF-based scroll-settle focus contract

### `S2-B6`

- New framing: define and implement the single homepage conversion-state owner before dependent interaction tasks

### `S2-D1`

- New framing: create lead schema with locked delivery-audit columns and status vocabulary

### `S2-D2`

- New framing: implement `submitLead` with explicit dedupe policy and `deduped` success semantics

### `S2-E4`

- New framing: verify homepage JSON-LD baseline survives homepage rewrite, do not rebuild it from scratch

---

## 4. Break-Task Guardrails

Không break implementation tickets tiếp theo nếu chưa sync các correction trên:

- `S2-B6` chưa có detailing
- `S2-B2` chưa có scroll-settle contract
- `S2-D1` chưa có concrete audit columns
- `S2-D2` chưa có duplicate policy
- chưa note rõ intentional deviation cho location cards
- `S2-A5` chưa có controller interaction spec

---

## 5. Recommended Next Step

Các corrections trên đã được lock. Implementation tasks bên dưới đã embed đầy đủ các corrections này. Có thể start sprint ngay từ Section 6.

---

## 6. Implementation Tasks

> Các corrections từ Section 2 đã được embed trực tiếp vào từng ticket bên dưới.
> Không cần đọc lại SPRINT2_PLAN.md hay SPRINT2_TICKET_DETAILING.md — file này là
> source of truth để bắt đầu implementation.

---

### S2-B6 — HomepageConversionProvider ⚠️ FIRST

> **Phải làm trước S2-A5, S2-B2, S2-B3, S2-C1.**
> Đây là ticket kiến trúc, không phải UI.

**Goal**

Tạo một React Context duy nhất làm owner cho toàn bộ homepage conversion state.

**Files**

- `src/components/home/HomepageConversionProvider.tsx`
- `src/app/page.tsx` (wrap children)

**State shape**

```typescript
type SchedulePrefill = {
  courtId: CourtId;
  timeSlotId: TimeSlotId;
  message: string;
  levelHint?: ScheduleLevel; // set only for basic-only slots
};

type ConversionState = {
  selectedSchedulePrefill: SchedulePrefill | null;
  selectedCourseIntent: ScheduleLevel | null;
  businessMode: boolean;
  autoPrefilledMessage: string | null; // tracks last auto-set message to detect user edits
  scrollTarget: "form" | "schedule" | null;
  focusAfterScroll: boolean;
};

type ConversionActions = {
  setPrefill: (prefill: SchedulePrefill) => void;
  setCourseIntent: (level: ScheduleLevel) => void;
  enterBusinessMode: () => void;
  clearBusinessMode: () => void;
  clearPrefill: () => void;
  setScrollTarget: (target: "form" | "schedule" | null) => void;
  setFocusAfterScroll: (value: boolean) => void;
  markMessageUserEdited: () => void;
};
```

**Rules**

- `enterBusinessMode()` clears `selectedSchedulePrefill` and `selectedCourseIntent`
- `setPrefill()` clears `businessMode`
- `setCourseIntent()` clears `businessMode`
- Message is only auto-overwritten when:
  - `autoPrefilledMessage === null` (field is empty), OR
  - `autoPrefilledMessage === currentMessage` (field still has the last auto value)
- If user edited message, `markMessageUserEdited()` sets `autoPrefilledMessage = "__user_edited__"` to block future auto-overwrites

**Acceptance**

- Không có source of truth thứ hai cho prefill hoặc business-mode trong bất kỳ component nào
- `ScheduleSection` chỉ dispatch actions, không tự quản lý form values
- `ContactForm` chỉ consume state, không tự recreate prefill logic
- Course cards chỉ dispatch actions, không giữ filter/prefill state riêng

---

### S2-A0 — Verify homepage metadata ✅ VERIFY ONLY

> Đã hoàn thành từ Sprint 1. Ticket này chỉ là verification check.

**Goal**

Đảm bảo homepage metadata không bị vỡ trong quá trình port homepage UI.

**Check**

- `src/app/page.tsx` vẫn có `export const metadata = buildMetadata("/")`
- Không có metadata hand-built mới trong component tree
- `npx tsc --noEmit` clean sau khi port xong

**Acceptance**

- Homepage title, canonical, OG đều đến từ route registry
- Không duplicate metadata logic ngoài `routes.ts`

---

### S2-A1 — Hero section

**Goal**

Port production hero với layout/copy parity-first.

**Files**

- `src/components/home/HeroSection.tsx`
- `src/app/page.tsx` (import và render)

**Implementation**

- Heading chính: H1, keyword-first, match production copy
- Sub-heading: proof point ngắn
- CTA group: CTA chính scroll to `#lien-he`, CTA phụ scroll to `#lich-hoc`
- Trust strip: stats/social proof từ production
- Background image từ `public/images/hero.jpg`
- CTA click fires `trackEvent("cta_click", { cta_name: "dang_ky_ngay", cta_location: "hero", page_type, page_path })`

**Acceptance**

- Hero visually matches production intent
- Mobile và desktop đều render đúng
- CTA label khớp taxonomy hiện tại
- Không có placeholder text

---

### S2-A2 — Pricing section

**Goal**

Render pricing cards từ `src/lib/pricing.ts`, switch trên `kind` discriminant.

**Files**

- `src/components/home/PricingSection.tsx`
- `src/lib/pricing.ts` (read only)
- `src/lib/tracking.ts` (add `"pricing"` to `CtaLocation`)

**Implementation**

- Loop `pricingTiers`, switch `tier.kind`:
  - `"group"` → render monthly package card với `displayPrice`
  - `"private"` → render per-hour card với `displayPrice`
  - `"enterprise"` → render quote card với `priceLabel`
- CTA dùng `tier.cta.label` và `tier.cta.ctaName`
- Enterprise CTA dispatch `controller.enterBusinessMode()` và scroll to `#lien-he`
- Các CTA còn lại scroll to `#lien-he` với prefill context tương ứng
- CTA click fires `trackEvent("cta_click", { cta_name: tier.cta.ctaName, cta_location: "pricing", ... })`
- Cần thêm `"pricing"` vào `CtaLocation` union type trong `tracking.ts`

**Acceptance**

- Ba loại card render đúng billing model
- `displayPrice` là source of truth duy nhất cho displayed price
- Monthly/hourly/quote không bị normalize về cùng shape
- Enterprise card không reuse group card behavior

---

### S2-A3 — Why choose V2 section

**Goal**

Port production "Khác biệt của V2" block với copy parity.

**Files**

- `src/components/home/WhySection.tsx`

**Implementation**

- Copy từ production: giữ nguyên các differentiator points
- Không thêm marketing claims mới trong Sprint 2
- Reuse design tokens/classes từ Sprint 1 visual system

**Acceptance**

- Section order và copy intent match production
- Không còn placeholder text

---

### S2-A4 — Homepage SEO links block

**Goal**

Port standalone SEO-links section. Tách biệt khỏi location cards.

**Files**

- `src/components/home/SeoLinksBlock.tsx`

**Implementation**

- Internal links build từ `coreRoutes` trong `src/lib/routes.ts` (không hardcode href)
- Block này là nơi duy nhất trên homepage chứa internal SEO links đến:
  - `/hoc-cau-long-cho-nguoi-moi/`
  - `/lop-cau-long-binh-thanh/`
  - `/lop-cau-long-thu-duc/`
- Chỉ expose link nếu route đó đã resolve `200` trong preview (xem S2-B5)

**Acceptance**

- SEO-links block xuất hiện đúng vị trí trên homepage
- Internal links không bị pushed onto location cards
- Mọi exposed link resolve `200`

---

### S2-A5 — Course cards section

> **Requires S2-B6.**
> Correction từ §2.7: course cards dispatch vào HomepageConversionProvider, không tự giữ state.

**Goal**

Port course cards cho basic, advanced, enterprise. Wire vào shared conversion controller.

**Files**

- `src/components/home/CourseSection.tsx`

**Implementation**

- Render 3 cards từ `pricingTiers` filter by `kind === "group" || kind === "enterprise"`
- **Basic card CTA:**
  - `controller.setCourseIntent("co_ban")`
  - `controller.clearBusinessMode()`
  - `controller.setScrollTarget("schedule")`
  - Smooth scroll to `#lich-hoc`
- **Advanced card CTA:**
  - `controller.setCourseIntent("nang_cao")`
  - `controller.clearBusinessMode()`
  - `controller.setScrollTarget("schedule")`
  - Smooth scroll to `#lich-hoc`
- **Enterprise card CTA:**
  - `controller.enterBusinessMode()`
  - `controller.setScrollTarget("form")`
  - Smooth scroll to `#lien-he`
- Không tự giữ filter/prefill/businessMode state riêng

**Acceptance**

- Ba loại card render đúng
- Basic/advanced không reduced thành static cards
- Enterprise không reuse behavior của basic/advanced
- S2-A5 và S2-B6 close với cùng semantics

---

### S2-A6 — Business section

**Goal**

Port homepage business/team-building block.

**Files**

- `src/components/home/BusinessSection.tsx`

**Implementation**

- Business image từ `public/images/` (business.jpg hoặc tương đương)
- Copy/proof points match production
- CTA: `controller.enterBusinessMode()` → scroll to `#lien-he`
- Track CTA click: `cta_location: "business"`

**Acceptance**

- Section hoàn chỉnh về mặt visual
- CTA đúng business-mode flow

---

### S2-A7 — Homepage FAQ accordion

**Goal**

Render homepage FAQ từ `src/lib/faqs.ts`.

**Files**

- `src/components/home/FaqSection.tsx`

**Implementation**

- Dùng `getFaqsForPage("homepage")` (đã sort theo `order`)
- Accordion implement bằng `<details>`/`<summary>` native hoặc accessible ARIA alternative
- Nếu FAQ item có `answerHtml`, render với `dangerouslySetInnerHTML` (content đến từ `faqs.ts`, không phải user input)
- Nếu không có `answerHtml`, render `answerText` thành `<p>`

**Acceptance**

- FAQ render từ source data, không có hardcoded copy trong component
- Accordion keyboard accessible
- Không duplicate FAQ logic ngoài `faqs.ts`

---

### S2-A8 — Contact section direct CTAs

**Goal**

Giữ lại các live contact-channel CTAs trong contact section. Form không phải là kênh duy nhất.

**Files**

- `src/components/home/ContactSection.tsx` (wrapper for form + direct CTAs)

**Implementation**

- Phone `tel:` link từ `siteConfig.phoneE164`, display `siteConfig.phoneDisplay`
- Zalo link: `https://zalo.me/${siteConfig.zaloNumber}`
- Facebook link: `siteConfig.facebookUrl`
- Direct CTAs luôn hiển thị, không bị ẩn khi form đang ở success state
- Post-submit Zalo CTA trong success state (dẫn thẳng vào Zalo chat)

**Acceptance**

- Contact section không bị reduced thành chỉ form
- Live contact-channel CTA surfaces còn available
- Direct CTAs lấy values từ `siteConfig`, không hardcode

---

### S2-B1 — Schedule tabs and cards

**Goal**

Render schedule UI từ `src/lib/schedule.ts` với per-court filter tabs.

**Files**

- `src/components/home/ScheduleSection.tsx`

**Implementation**

- Client component (`"use client"`)
- Filter tabs (theo court, không theo district):
  - `all` → hiển thị tất cả `scheduleItems`
  - `hue-thien` → filter `courtId === "hue_thien"`
  - `green` → filter `courtId === "green"`
  - `phuc-loc` → filter `courtId === "phuc_loc"`
  - `khang-sport` → filter `courtId === "khang_sport"`
- Mỗi card hiển thị: `dayGroup`, `timeLabel`, `levelLabel`, court name từ `courtLocationMap`
- Card có CTA button để trigger prefill flow (S2-B2)
- Active tab state managed locally trong ScheduleSection

**Acceptance**

- Cards render từ typed `scheduleItems` only
- Filtering works mobile và desktop
- Không có district-level tab model
- Không có ad hoc mapping table trong component

---

### S2-B2 — Schedule card → prefill flow

> **Requires S2-B6.**
> Correction từ §2.3: dùng rAF-based scroll-settle, không dùng `scrollend`.

**Goal**

Preserve the core conversion asset: schedule card click prefills form và focus first empty field.

**Files**

- `src/components/home/ScheduleSection.tsx`
- `src/components/home/HomepageConversionProvider.tsx`

**Implementation**

1. On schedule-card CTA click:
   - `controller.setPrefill({ courtId: item.prefillCourtId, timeSlotId: item.prefillTimeSlotId, message: item.prefillMessage, levelHint: isBasicOnly ? "co_ban" : undefined })`
   - `controller.setScrollTarget("form")`
   - `controller.setFocusAfterScroll(true)`
2. Open optional fields `<details>` disclosure trước khi scroll
3. `formRef.scrollIntoView({ behavior: "smooth", block: "start" })`
4. Scroll-settle via rAF loop:
   ```
   let prevTop = -Infinity;
   let stableFrames = 0;
   const THRESHOLD = 4;
   const STABLE_NEEDED = 2;
   const TIMEOUT = 800ms;

   requestAnimationFrame(function check() {
     const currentTop = formRef.getBoundingClientRect().top;
     if (Math.abs(currentTop - prevTop) <= THRESHOLD) {
       stableFrames++;
       if (stableFrames >= STABLE_NEEDED) { focusFirstEmptyField(); return; }
     } else {
       stableFrames = 0;
     }
     prevTop = currentTop;
     if (elapsed < TIMEOUT) requestAnimationFrame(check);
     else focusFirstEmptyField(); // fallback
   });
   ```
5. Nếu `prefers-reduced-motion` hoặc scroll instant: focus ở `requestAnimationFrame` kế tiếp thay vì settle loop
6. Message auto-overwrite logic:
   - Chỉ set message nếu `autoPrefilledMessage === null` OR `autoPrefilledMessage === currentMessage`
   - Không clobber message do user đã edit

**Acceptance**

- Prefill values đến từ `prefillCourtId`, `prefillTimeSlotId`, `prefillMessage` (không ad hoc map)
- Works on mobile
- Optional fields disclosure open trước khi focus
- User-edited message không bị overwrite
- `scrollend` không được dùng làm primary mechanism
- Form heading và focused field vẫn trong viewport sau settle

---

### S2-B3 — Corporate card → business-mode flow

> **Requires S2-B6.**

**Goal**

Preserve enterprise conversion path từ business section/CTA.

**Files**

- `src/components/home/BusinessSection.tsx`
- `src/components/home/HomepageConversionProvider.tsx`

**Implementation**

- Corporate/business CTA click:
  - `controller.enterBusinessMode()` (clears schedule prefill automatically per B6 rules)
  - `controller.setScrollTarget("form")`
  - Scroll to `#lien-he`
- Trong `ContactForm`:
  - Khi `businessMode === true`: pre-fill message với enterprise-oriented text
  - Label/placeholder của form thay đổi để reflect enterprise context
  - `court` và `time_slot` fields ẩn hoặc optional khi business mode

**Acceptance**

- Business CTA scrolls đúng form
- Business-mode state phản ánh rõ trong form values/message
- Schedule prefill data không còn stuck khi business mode được chọn

---

### S2-B4 — Location cards

> **Intentional deviation from MASTERPLAN §8.7** (see §2.6 in corrections).
> Sprint 2 giữ maps-only behavior như production. Internal links chỉ ở `#seo-links` block.

**Goal**

Port court cards với maps behavior từ production.

**Files**

- `src/components/home/LocationsSection.tsx`
- `src/lib/locations.ts` (read only)

**Implementation**

- Render từ `courtLocations` array
- Maps URL: `court.mapsUrl` (link ra Google Maps)
- CTA button: "Xem bản đồ" → opens in new tab
- Hiển thị: `court.name`, `court.districtLabel`, địa chỉ ngắn
- **Không** có internal link đến local pages trên card (defer sang Sprint 3)

**Acceptance**

- Maps links đúng, mở trong tab mới
- Location cards không absorb SEO-links behavior
- Intentional deviation documented (thêm comment trong code hoặc TODO)

---

### S2-B5 — SEO link gating

**Goal**

Không expose homepage link đến route chưa sẵn sàng trong preview.

**Files**

- `src/components/home/SeoLinksBlock.tsx`
- `src/lib/routes.ts`

**Implementation**

- Trong Sprint 2 preview: 3 SEO routes (`/hoc-cau-long-cho-nguoi-moi/`, `/lop-cau-long-binh-thanh/`, `/lop-cau-long-thu-duc/`) đều là placeholder pages
- Nếu route có trang placeholder trả về `200` (không phải 404): expose link
- Nếu route chưa có page file: không expose link trong Sprint 2
- Approach đơn giản: dùng `ROUTES_PREVIEW_READY` constant hoặc check `coreRoutes[path].previewReady`

**Acceptance**

- Mọi exposed link trên homepage resolve `200`
- Không có dead link trong preview

---

### S2-C1 — ContactForm UI and local state

> **Requires S2-B6** (consume conversion controller).
> **Requires S2-D6 sketch** (form-token endpoint must exist to fetch on mount).

**Goal**

Build real homepage form UI, consuming HomepageConversionProvider.

**Files**

- `src/components/home/ContactForm.tsx`

**Implementation**

- Required fields: `name`, `phone`
- Optional fields (inside `<details>` disclosure): `level`, `court`, `time_slot`, `message`
- Honeypot: `<input name="_gotcha" type="text" tabIndex={-1} aria-hidden="true" style={{ display: "none" }} />`
- Consume `useHomepageConversion()` hook để nhận prefill state và businessMode
- Apply prefill values vào form fields khi `selectedSchedulePrefill` thay đổi
- Fetch `GET /api/form-token` on mount (JS path only):
  ```typescript
  const [formToken, setFormToken] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/form-token").then(r => r.json()).then(d => setFormToken(d.token));
  }, []);
  ```
- Render as `<form action={submitLeadAction}>` (Server Action)
- Form submit: nếu JS available → intercept với `startTransition`, đính kèm `formToken` và Turnstile token

**Acceptance**

- Tất cả required fields render
- Prefill có thể set values đúng
- Honeypot present nhưng không visible với user
- form-token fetch trên mount, không baked vào SSG HTML

---

### S2-C2 — Client-side validation

**Goal**

Block invalid submit trước khi hit server.

**Files**

- `src/components/home/ContactForm.tsx`

**Implementation**

- Phone regex: `/^(0|\+84)(3|5|7|8|9)\d{8}$/`
- Name: ít nhất 2 ký tự sau trim
- Validate on submit attempt (không validate on-blur để giảm noise)
- Inline error message per field: `aria-describedby` pointing to error element
- Show error only after first submit attempt

**Acceptance**

- Invalid phone blocks client submit
- Invalid name blocks client submit
- Errors visible và accessible
- Server submit vẫn có validation riêng (S2-C3)

---

### S2-C3 — Server-side validation

**Goal**

Server là final source of truth cho data validity.

**Files**

- `src/app/actions/submitLead.ts`
- optional `src/lib/validation/leadSchema.ts`

**Implementation**

- Re-validate toàn bộ fields trong Server Action
- Phone: cùng regex như client
- Name: min 2 chars
- Level: `"co_ban" | "nang_cao" | "doanh_nghiep" | undefined`
- Court: known `CourtId` values or `undefined`
- TimeSlot: known `TimeSlotId` values or `undefined`
- Message: max 500 chars, sanitize whitespace
- Return `{ success: false, errors: Record<string, string> }` on validation fail

**Acceptance**

- Invalid payload bị reject server-side kể cả khi client validation bypass được
- Error shape typed và consistent với form error rendering

---

### S2-C4 — Success, error, and disabled states

**Goal**

Submit behavior an toàn về mặt UX và idempotent ở UI level.

**Files**

- `src/components/home/ContactForm.tsx`

**Implementation**

- States: `"idle" | "submitting" | "success" | "error"`
- `"submitting"`: disable submit button, show loading indicator
- `"success"`: show success message, show Zalo follow-up CTA, hide form fields (hoặc keep visible)
- `"error"`: show error message, re-enable submit button
- Use `useFormStatus` hook hoặc `useTransition` để track pending state
- Double-click protection: disable button during submit

**Acceptance**

- Double click không tạo duplicate local submit
- Success UI chỉ xuất hiện sau real success response
- Error state re-enables form để user retry

---

### S2-D1 — Lead table schema

**Goal**

Persist leads với đủ attribution và delivery-audit context.

**Files**

- `src/lib/db/schema.sql` (hoặc migration file)
- `src/lib/db/index.ts` (Vercel Postgres client setup)

**Implementation**

Cần provision: `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`

```sql
CREATE TABLE leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  phone           TEXT NOT NULL,
  level           TEXT,
  court           TEXT,
  time_slot       TEXT,
  message         TEXT,
  submission_method TEXT NOT NULL,   -- 'js' | 'no_js'
  landing_page    TEXT,
  dedupe_key      TEXT,              -- hash of normalized payload
  telegram_status TEXT DEFAULT 'pending',  -- pending | sent | failed | skipped
  telegram_attempted_at TIMESTAMPTZ,
  telegram_error  TEXT,
  email_status    TEXT DEFAULT 'pending',
  email_attempted_at TIMESTAMPTZ,
  email_error     TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX leads_dedupe_key_idx ON leads (dedupe_key, created_at);
CREATE INDEX leads_phone_idx ON leads (phone);
```

**Allowed status values**: `pending | sent | failed | skipped`

**Acceptance**

- Schema support đủ fields cho vertical slice
- Index trên `dedupe_key` và `created_at` để dedupe query nhanh
- Migration file committed vào repo

---

### S2-D2 — Server Action `submitLead`

**Goal**

Canonical server submit path với save-first rule và explicit dedupe policy.

**Files**

- `src/app/actions/submitLead.ts`

**Implementation**

Submit order (locked):
1. Parse `FormData`
2. Server-side validation (S2-C3)
3. Anti-spam checks:
   - Honeypot check: if `_gotcha` non-empty → return `{ success: true }` silently
   - Detect path (`formToken` present = JS path, absent = no-JS path)
   - **JS path**: verify form-token timing (token age < 10 min), verify Turnstile, apply 5/IP/hour rate limit
   - **No-JS path**: skip timing check, skip Turnstile, apply 2/IP/hour rate limit, record `submission_method: "no_js"`
4. Dedupe check:
   - Normalize: `phone` (strip spaces/dashes), `name` (trim lowercase), `court`, `time_slot`, `message`, `landing_page`
   - Build `dedupe_key = sha256(normalizedPayload)`
   - Query: `SELECT id FROM leads WHERE dedupe_key = $1 AND created_at > now() - interval '15 minutes'`
   - If found: **short-circuit** → return `{ success: true, deduped: true }` immediately
   - Không retry notify, không inspect bản ghi cũ. Nếu notify gốc failed thì đó là concern của ops retry (cron/manual), không piggyback trên duplicate request.
5. DB save:
   - Insert lead với `submission_method`, `dedupe_key`, all fields
   - Capture DB error in Sentry, return `{ success: false, error: "server_error" }`
6. Schedule async notify via `after()` (Next.js 16 `next/server`):
   ```typescript
   import { after } from "next/server";
   // ...inside submitLead, after DB save succeeds:
   after(async () => {
     await Promise.allSettled([
       notifyTelegram(leadId, payload),
       notifyEmail(leadId, payload),
     ]);
   });
   ```
   - `after()` đảm bảo callback chạy sau khi response đã gửi, runtime giữ function alive cho đến khi callback hoàn tất
   - Không dùng unawaited promise (bị kill trên serverless khi function terminates)
   - Telegram và email chạy song song qua `Promise.allSettled` — một cái fail không block cái kia
   - Mỗi notify function tự update delivery-audit fields (`telegram_status`, `email_status`) trong DB
7. Return `{ success: true }`
8. Client fires `trackEvent("generate_lead", ...)` sau khi nhận success

**Acceptance**

- Save xảy ra trước notify
- Notify failure không break success response
- `generate_lead` chỉ fire sau success payload
- Duplicate submit trong 15 phút trả `{ success: true, deduped: true }`
- `deduped: true` không fire `generate_lead` lại

---

### S2-D3 — Telegram notify module

**Goal**

Deliver lead notification qua Telegram, không block lead persistence.

**Files**

- `src/lib/notify/telegram.ts`

**Implementation**

Cần provision: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

```typescript
export async function notifyTelegram(leadId: string, lead: LeadPayload): Promise<void> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: formatTelegramMessage(lead) }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    await db.query(
      `UPDATE leads SET telegram_status = 'sent', telegram_attempted_at = now() WHERE id = $1`,
      [leadId]
    );
  } catch (err) {
    await db.query(
      `UPDATE leads SET telegram_status = 'failed', telegram_attempted_at = now(), telegram_error = $2 WHERE id = $1`,
      [leadId, String(err)]
    );
    Sentry.captureException(err, { extra: { leadId } });
    // never rethrow
  }
}
```

**Acceptance**

- Telegram failure không xóa lead đã save
- `telegram_status`, `telegram_attempted_at`, `telegram_error` được update trong DB
- Function không throw lên caller

---

### S2-D4 — Email backup notify module

**Goal**

Second non-DB alert channel, chạy độc lập với Telegram.

**Files**

- `src/lib/notify/email.ts`

**Implementation**

Cần provision: `RESEND_API_KEY`, `NOTIFY_EMAIL_TO`

- Dùng Resend SDK: `import { Resend } from "resend"`
- Subject: `[V2 Badminton] Đăng ký mới - {name} - {phone}`
- Body: plain text hoặc simple HTML với đầy đủ lead fields
- Update `email_status`, `email_attempted_at`, `email_error` trong DB (cùng pattern với Telegram)
- Không throw lên caller

**Acceptance**

- Email notify chạy độc lập với Telegram success/failure
- DB audit fields được update
- Resend failure không break lead pipeline

---

### S2-D5 — `/api/health`

**Goal**

Health endpoint cho uptime monitoring. Meaningful, không chỉ pingable.

**Files**

- `src/app/api/health/route.ts`

**Implementation**

```typescript
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.query("SELECT 1");
    return Response.json({ status: "ok" }, { status: 200 });
  } catch (err) {
    Sentry.captureException(err);
    return Response.json({ status: "degraded", error: "db_unreachable" }, { status: 503 });
  }
}
```

**Acceptance**

- Return `200` chỉ khi DB healthy
- Return `503` khi DB unreachable
- Uptime monitor alert trên `503` có nghĩa (không phải chỉ ping)

---

### S2-D6 — `/api/form-token`

**Goal**

Issue request-scoped token cho JS path timing check. Không bake vào SSG HTML.

**Files**

- `src/app/api/form-token/route.ts`

**Implementation**

Cần provision: `FORM_TOKEN_SECRET`

```typescript
export const dynamic = "force-dynamic";
export const fetchCache = "no-store";

export async function GET() {
  const payload = { iat: Date.now() };
  const token = await signJwt(payload, process.env.FORM_TOKEN_SECRET!);
  return Response.json({ token });
}
```

- `signJwt`: dùng `jose` library hoặc `jsonwebtoken`
- Verify trong `submitLead`: token age phải < 10 phút
- Nếu token missing (no-JS path): skip timing check

**Acceptance**

- JS path nhận fresh token mỗi request
- Token không xuất hiện trong static HTML
- No-JS path không bị block vì thiếu token

---

### S2-D7 — Honeypot and Turnstile verify

**Goal**

Baseline bot resistance cho cả JS và no-JS paths.

**Files**

- `src/components/home/ContactForm.tsx` (honeypot field + Turnstile widget)
- `src/app/actions/submitLead.ts` (verify logic)

**Implementation**

Cần provision: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`

**Honeypot:**
```html
<input
  name="_gotcha"
  type="text"
  tabIndex={-1}
  aria-hidden="true"
  autoComplete="off"
  style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }}
/>
```

**Turnstile (JS path only):**
- Widget từ Cloudflare: `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async />`
- Embedded widget widget trong form: `<div class="cf-turnstile" data-sitekey="..." />`
- Token submit cùng form data

**Server verify:**
```typescript
if (isJsPath && turnstileToken) {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: JSON.stringify({ secret: TURNSTILE_SECRET, response: turnstileToken }),
  });
  const data = await res.json();
  if (!data.success) return { success: false, error: "captcha_failed" };
}
```

**Acceptance**

- Honeypot-filled submit bị reject silently (return `{ success: true }` giả để không reveal detection)
- Invalid Turnstile token bị reject trên JS path
- No-JS path không bị block vì thiếu Turnstile token

---

### S2-D8 — Rate limiting

**Goal**

Tách riêng rate limit cho JS và no-JS paths.

**Files**

- `src/lib/rateLimit.ts`
- `src/app/actions/submitLead.ts`

**Implementation**

Option A (Upstash Ratelimit — recommended):
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const jsLimiter = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(5, "1 h") });
const noJsLimiter = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(2, "1 h") });
```

Cần provision nếu dùng Upstash: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

Option B (Vercel KV — same API):
```typescript
import { kv } from "@vercel/kv";
```

- IP từ `request.headers.get("x-forwarded-for")` hoặc `x-real-ip`
- Nếu rate exceeded: return `{ success: false, error: "rate_limited" }` với status 429

**Acceptance**

- JS và no-JS paths enforce riêng rate limit của mình
- Rate limit error trả về `429` status rõ ràng

---

### S2-E1 — Sentry baseline

**Goal**

Error visibility trước khi QA bắt đầu.

**Files**

- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `instrumentation.ts`
- `next.config.ts` (wrap với `withSentryConfig`)

**Implementation**

Cần provision: `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`

```bash
npx @sentry/wizard@latest -i nextjs
```

Hoặc manual:
- `npm install @sentry/nextjs`
- Configure DSN trong config files
- Enable source maps upload với `SENTRY_AUTH_TOKEN`

**Acceptance**

- Test error được capture từ preview
- Client errors và server errors đều visible trong Sentry dashboard

---

### S2-E2 — Uptime monitor setup

**Goal**

`/api/health` được monitor bởi external tool.

**Files**

- Ops notes (không nhất thiết phải commit vào repo)

**Implementation**

- Vendor: Betterstack (recommended) hoặc UptimeRobot (free tier)
- Check interval: 1 phút
- Monitor URL: `https://{preview-url}/api/health`
- Alert condition: 2 consecutive failures → alert
- Alert channel: Telegram ops chat (`TELEGRAM_OPS_CHAT_ID`) hoặc email

**Acceptance**

- `/api/health` đang được ping bởi uptime tool
- Alert được verify bằng cách temporarily return 503

---

### S2-E3 — Verification: monitoring and alerts

**Goal**

Chứng minh monitoring thực sự hoạt động, không chỉ installed.

**Implementation**

1. Trigger test Sentry capture:
   ```typescript
   // Temporary test in Server Action or API route
   Sentry.captureException(new Error("Sprint 2 Sentry test"));
   ```
   → Verify alert xuất hiện trong Sentry dashboard

2. Simulate DB failure:
   - Tạm thời pass invalid DB URL hoặc kill DB connection
   - Verify `/api/health` trả về `503`
   - Verify uptime monitor alert fires

3. Verify alert path cho notify failures:
   - Telegram và email đều fail scenario
   - Lead vẫn saved trong DB
   - Failure được captured trong Sentry

**Acceptance**

- Team thấy real monitored failure trong preview
- DB-save failure alert path verified
- Branch khi cả hai notify channels fail được capture và visible

---

### S2-E4 — Verify homepage JSON-LD baseline ✅ VERIFY ONLY

> Đã hoàn thành từ Sprint 1. Ticket này chỉ là verification check.

**Goal**

Đảm bảo homepage JSON-LD không bị vỡ trong quá trình port homepage UI.

**Check**

- `src/app/page.tsx` vẫn render: `LocalBusiness`, homepage `FAQPage`, `Organization`, `WebSite`
- Không có duplicate hand-built schema trong component tree
- `buildHomepageLocalBusinessSchema()`, `buildFaqPageSchema("homepage")`, `buildOrganizationSchema()`, `buildWebsiteSchema()` đều được gọi từ `schema.ts`

**Acceptance**

- JSON-LD present trong homepage HTML (`<script type="application/ld+json">`)
- Không có schema logic hardcoded ngoài `src/lib/schema.ts`

---

## 7. Build Order

```
Phase 0 (FIRST, before everything else):
  S2-B6  HomepageConversionProvider

Phase 1 (parallel, after B6):
  Block A: S2-A1, S2-A2, S2-A3, S2-A4, S2-A6, S2-A7, S2-A8
  Block D start: S2-D1 (schema), S2-D5 (/api/health), S2-D6 (/api/form-token)
  Block E start: S2-E1 (Sentry)

Phase 2 (after Phase 1):
  S2-A5  (requires B6) — course cards
  S2-B1  (after A1 shell exists) — schedule tabs/cards
  S2-B4  — location cards
  S2-B5  — SEO link gating
  S2-D3  — Telegram notify
  S2-D4  — Email notify

Phase 3 (after B6 + B1 + D1 + D6):
  S2-B2  (requires B6, B1) — prefill flow
  S2-B3  (requires B6) — business mode
  S2-C1  (requires B6, D6 sketch) — ContactForm UI

Phase 4 (after C1):
  S2-C2  — client validation
  S2-C3  — server validation
  S2-C4  — submit states
  S2-D2  (requires D1, D3, D4, D7, D8) — submitLead Server Action
  S2-D7  — honeypot + Turnstile
  S2-D8  — rate limiting

Phase 5 (after D2 + E1):
  S2-E2  — uptime monitor
  S2-E3  — verify monitoring

Verify any time (no deps):
  S2-A0  — verify metadata
  S2-E4  — verify JSON-LD
```

---

## 8. Env Vars Checklist

| Variable | Required by | Available in | Notes |
|---|---|---|---|
| `POSTGRES_URL` | S2-D1, S2-D2 | Vercel Postgres | Pooled |
| `POSTGRES_URL_NON_POOLING` | S2-D1 | Vercel Postgres | For migrations |
| `TELEGRAM_BOT_TOKEN` | S2-D3 | BotFather | Bot token |
| `TELEGRAM_CHAT_ID` | S2-D3 | Telegram | Lead alerts channel |
| `TELEGRAM_OPS_CHAT_ID` | S2-E2 | Telegram | Ops/uptime alerts channel |
| `RESEND_API_KEY` | S2-D4 | Resend dashboard | Email notify |
| `NOTIFY_EMAIL_TO` | S2-D4 | Manual | Recipient email |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | S2-D7 | Cloudflare dashboard | Client-side widget |
| `TURNSTILE_SECRET_KEY` | S2-D7 | Cloudflare dashboard | Server-side verify |
| `FORM_TOKEN_SECRET` | S2-D6, S2-D2 | Manual (random 32+ bytes) | JWT signing |
| `SENTRY_DSN` | S2-E1 | Sentry dashboard | Error capture |
| `SENTRY_AUTH_TOKEN` | S2-E1 | Sentry dashboard | Source maps upload |
| `UPSTASH_REDIS_REST_URL` | S2-D8 | Upstash | Rate limiting (if using Upstash) |
| `UPSTASH_REDIS_REST_TOKEN` | S2-D8 | Upstash | Rate limiting (if using Upstash) |

**Blocks A và B** có thể proceed mà không cần bất kỳ var nào trong bảng này.
**Blocks D và E** không được coi là done nếu còn thiếu vars tương ứng.

---

## 9. Sprint 2 Acceptance Criteria Summary

Checkbox dưới đây phải all-green trước khi close Sprint 2:

**Homepage UI**
- [ ] Hero section đúng với production intent (mobile + desktop)
- [ ] Pricing section render từ `pricing.ts`, switch trên `kind`
- [ ] "Khác biệt của V2" section đủ copy, không placeholder
- [ ] SEO links block tách biệt khỏi location cards
- [ ] Course cards render đúng 3 loại, enterprise không reuse basic behavior
- [ ] Business section có CTA đúng
- [ ] FAQ accordion từ `faqs.ts`, keyboard accessible
- [ ] Contact section không chỉ có form

**Schedule + Prefill**
- [ ] Filter tabs: `all | hue-thien | green | phuc-loc | khang-sport`
- [ ] Schedule card click prefills `court`, `time_slot`, `message`
- [ ] Optional fields disclosure mở trước focus
- [ ] First empty field được focus sau scroll settles (rAF, không `scrollend`)
- [ ] Mobile: heading + focused field vẫn trong viewport
- [ ] User-edited message không bị clobber
- [ ] Enterprise card → business mode (không qua schedule flow)

**ContactForm**
- [ ] JS path submit thành công end-to-end
- [ ] No-JS path submit thành công end-to-end
- [ ] Client validation block invalid phone/name
- [ ] Submit button disabled during in-flight
- [ ] Success state chỉ xuất hiện sau real success
- [ ] Error state re-enables form

**Lead Backend**
- [ ] Lead save xảy ra trước Telegram/email notify
- [ ] Telegram failure không mất lead
- [ ] Email failure không mất lead
- [ ] Duplicate submit trong 15 phút → `{ success: true, deduped: true }`
- [ ] Honeypot filled → silent success (lead không insert)
- [ ] Invalid Turnstile (JS path) → rejected
- [ ] Rate limit JS: 5/IP/hour, no-JS: 2/IP/hour
- [ ] `/api/health` trả `200` khi DB healthy, `503` khi không
- [ ] `/api/form-token` không bake vào SSG HTML

**Monitoring**
- [ ] Sentry capture test error từ preview
- [ ] `/api/health` được ping bởi uptime tool
- [ ] DB failure alert path verified

**SEO**
- [ ] Homepage metadata qua `buildMetadata("/")`
- [ ] JSON-LD: `LocalBusiness`, `FAQPage`, `Organization`, `WebSite` present
- [ ] Mọi exposed internal link resolve `200`

**Build**
- [ ] `npm run lint` clean
- [ ] `npm run build` clean sau mỗi major block
- [ ] `npx tsc --noEmit` no errors
