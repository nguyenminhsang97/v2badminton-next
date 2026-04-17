# Sprint 6 — Final Implementation Plan

**Mục tiêu:** Refactor homepage cho đúng Figma + gọn hơn + UX tốt hơn.

**Quyết định đã chốt:**
- Giảm từ 13 → 10 sections (FAQ + Contact tách riêng; nếu tính chung thành 1 cluster end-of-funnel thì = 9)
- Gộp Courses + Pricing theo Phương án A (course cards + pricing strip + enterprise teaser)
- Bỏ BusinessSection riêng (gộp vào enterprise teaser)
- Bỏ SeoLinksBlock khỏi main flow (chuyển vào footer)
- Giữ Why trong trust cluster (Why + Coaches + Testimonials)
- Trust/social proof lên trước logistics (Schedule, Locations)
- Hero compact (≤100vh desktop, ≤1.5-2 màn mobile)
- Locations bỏ CTA card
- CSS refactor: tách globals.css, xóa 6 lớp duplicate

---

## Section order mới

```
TRƯỚC (13 sections, 16,117px):              SAU (10 sections):
─────────────────────────                   ─────────────────────
1.  Hero (3,517px)                          1.  Hero (compact)
2.  StatsBar (92px)                         2.  StatsBar
3.  CourseSection (1,014px)                 3.  CourseSection (gộp Pricing + Enterprise)
4.  WhySection (1,029px)                    ╌╌╌ [TRUST CLUSTER] ╌╌╌
5.  CoachSection (1,020px)                  4.  WhySection
6.  PricingSection (1,500px)  ← BỎ          5.  CoachSection
7.  TestimonialsSection (684px) ← DỜI LÊN  6.  TestimonialsSection
8.  ScheduleSection (1,783px)               ╌╌╌ [LOGISTICS CLUSTER] ╌╌╌
9.  LocationsSection (1,136px)              7.  ScheduleSection
10. FaqSection (661px)                      8.  LocationsSection (bỏ CTA card)
11. ContactSection (1,107px)                ╌╌╌ [END-OF-FUNNEL CLUSTER] ╌╌╌
12. BusinessSection (899px)   ← BỎ          9.  FaqSection
13. SeoLinksBlock (718px)     ← BỎ (→ footer) 10. ContactSection
```

> 10 section components riêng. Nếu tính theo cluster thì 5 nhóm: Hook → Offer → Trust → Logistics → Convert.

---

## PHASE 1: Section restructure

### 1.1 — page.tsx: New section order

**File:** `src/app/(site)/page.tsx`

```tsx
<HomepageConversionProvider>
  <HomepageBusinessModeInitializer />
  
  {/* ── HOOK ── Attract */}
  <HeroSection campaign={campaign} />
  <StatsBar />
  
  {/* ── OFFER ── What we have & how much */}
  <CourseSection pricingTiers={pricingTiers} />
  
  {/* ── TRUST ── Why us, who teaches, what people say */}
  <WhySection />
  <CoachSection coaches={coaches} />
  <TestimonialsSection testimonials={testimonials} />
  
  {/* ── LOGISTICS ── When & where */}
  <ScheduleSection scheduleBlocks={scheduleBlocks} />
  <LocationsSection locations={locations} />
  
  {/* ── CONVERT ── Objections + action */}
  <FaqSection faqs={faqs} />
  <ContactSection ... />
</HomepageConversionProvider>
```

**Bỏ imports:**
- `PricingSection` — gộp vào CourseSection
- `BusinessSection` — gộp vào CourseSection (enterprise teaser)
- `SeoLinksBlock` — chuyển links vào footer

**Giữ nguyên:**
- `HomepageBusinessModeInitializer` (URL param `?business=1`)
- Tất cả Sanity data fetches
- JsonLd schemas

### 1.2 — Gộp Courses + Pricing (Phương án A)

**File:** `src/components/home/CourseSection.tsx`

**Hiện tại:**
- Props: `{ pricingTiers: SanityPricingTier[] }`
- 4 course cards (hardcoded) + groupPrice/privatePrice từ Sanity
- CTA mỗi card: "Xem chi tiết" → money page
- Footer: "Xem toàn bộ học phí" → `#hoc-phi`

**Sau khi gộp:**

```tsx
export function CourseSection({ pricingTiers }: CourseSectionProps) {
  const { enterBusinessMode } = useHomepageConversion(); // NEW: cần cho enterprise teaser

  return (
    <section className="section course-section" id="khoa-hoc">
      <div className="section__header">
        <p className="section__eyebrow">Chương trình & học phí</p>
        <h2 className="section__title">Chọn lộ trình phù hợp</h2>
        ...
      </div>

      {/* 4 visual course cards — GIỮ NGUYÊN cấu trúc hiện tại */}
      {/* Sửa: giá hiển thị thành "từ X" thay vì flat price */}
      <div className="course-grid course-grid--figma">
        {courseCards.map(...)}
      </div>

      {/* NEW: Pricing comparison strip */}
      <PricingStrip tiers={pricingTiers} />

      {/* NEW: Enterprise teaser (thay BusinessSection) */}
      <EnterpriseTeaser onRequestQuote={enterBusinessMode} />
    </section>
  );
}
```

**Sub-component: PricingStrip**

```tsx
// Inline trong CourseSection hoặc tách file nhỏ
function PricingStrip({ tiers }: { tiers: SanityPricingTier[] }) {
  const groupTiers = tiers.filter(t => t.kind === "group");
  const privateTier = tiers.find(t => t.kind === "private");

  return (
    <div className="pricing-strip" id="hoc-phi">  {/* GIỮ anchor #hoc-phi */}
      <h3 className="pricing-strip__title">Chi tiết học phí</h3>
      <div className="pricing-strip__grid">
        {groupTiers.map(tier => (
          <div className="pricing-strip__item">
            <span className="pricing-strip__name">{tier.name}</span>
            <span className="pricing-strip__tags">{tier tags}</span>
            <strong className="pricing-strip__price">{tier.displayPrice}</strong>
          </div>
        ))}
        {privateTier && (
          <div className="pricing-strip__item pricing-strip__item--private">
            <span className="pricing-strip__name">{privateTier.name}</span>
            <strong className="pricing-strip__price">{privateTier.displayPrice}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Sub-component: EnterpriseTeaser**

```tsx
function EnterpriseTeaser({ onRequestQuote }: { onRequestQuote: () => void }) {
  return (
    <div className="enterprise-teaser">
      <div className="enterprise-teaser__copy">
        <span className="enterprise-teaser__badge">Doanh nghiệp</span>
        <p className="enterprise-teaser__desc">
          Team building, lớp nội bộ, giải đấu. Thiết kế theo số lượng và ngân sách.
        </p>
      </div>
      <div className="enterprise-teaser__actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            onRequestQuote();
            trackEvent("cta_click", {
              cta_name: "nhan_bao_gia",
              cta_location: "enterprise_teaser",
              page_type: "homepage",
              page_path: "/",
            });
          }}
        >
          Nhận báo giá
        </button>
        <a href="/cau-long-doanh-nghiep/" className="enterprise-teaser__link">
          Xem chi tiết →
        </a>
      </div>
    </div>
  );
}
```

**Regression fix — QUYẾT ĐỊNH DỨT KHOÁT: KHÔI PHỤC `setCourseIntent`**

Codex đã vô tình xóa dispatch call này khi rewrite CourseSection. Hậu quả: `ScheduleSection` đọc `selectedCourseIntent` từ provider để filter lịch học theo cấp độ, nhưng giá trị luôn là `null` → tính năng filter lịch đã chết im lặng.

**Chọn: Khôi phục dispatch** (không xóa feature).

Lý do:
1. Provider contract đã document rõ (comment dòng 93: "CourseSection dispatches setCourseIntent")
2. ScheduleSection đang consume `selectedCourseIntent` — xóa thêm side-effects
3. CourseSection sau merge đã gọi `useHomepageConversion()` để lấy `enterBusinessMode` → thêm `setCourseIntent` là trivial

**Cách implement:** Mỗi course card thêm secondary action "Xem lịch học" — khi click vừa gọi `setCourseIntent(level)` vừa scroll xuống ScheduleSection (provider `scrollTarget: "schedule"` đã handle việc này).

```tsx
// IDs thực tế trong CourseSection.tsx (course-kids, course-beginner, course-working, course-private)
// ScheduleLevel = "co_ban" | "nang_cao" | "doanh_nghiep"

const CARD_LEVEL_MAP: Partial<Record<string, ScheduleLevel>> = {
  "course-kids":     "co_ban",    // lớp thiếu nhi → cơ bản
  "course-beginner": "co_ban",    // người lớn mới bắt đầu → cơ bản
  "course-working":  "co_ban",    // lớp tối/cuối tuần → cơ bản (schedule filter theo lịch, không theo trình)
  // "course-private" → BỎ QUA: học 1 kèm 1 không có lịch nhóm để filter
};

// Trong CourseSection — destructure thêm setCourseIntent
const { enterBusinessMode, setCourseIntent } = useHomepageConversion();

// Trên mỗi course card CÓ entry trong CARD_LEVEL_MAP
{CARD_LEVEL_MAP[card.id] && (
  <button
    type="button"
    className="btn btn--ghost btn--sm"
    onClick={() => setCourseIntent(CARD_LEVEL_MAP[card.id]!)}
  >
    Xem lịch học →
  </button>
)}
```

`setCourseIntent` trong provider đã set `scrollTarget: "schedule"` nên scroll tự động xảy ra. Card `course-private` không có nút này vì học 1 kèm 1 lên lịch riêng, không phụ thuộc bảng lịch nhóm.

### 1.3 — Hero compact

**File:** `src/components/home/HeroSection.tsx`

**Bỏ:**
- `<aside className="hero__visual">` toàn bộ — gồm:
  - "Lộ trình nổi bật" 3 highlight cards (trùng Courses)
  - "Tìm nhanh theo nhu cầu" 6 links (trùng SeoLinks / footer)
  - "Một form chung..." text block
- Trust strip 3 stats (trùng StatsBar ngay dưới)

**Giữ:**
- Background image + overlay
- Status pill + pulse dot
- H1 + lime gradient text
- Subheading (1-2 dòng)
- 2 CTAs thay vì 3: Primary "Đăng ký học thử" + Secondary "Xem khóa học"
  - Bỏ tertiary "Tư vấn qua Zalo" (đã có FloatingCta)
- Social proof 1 dòng: avatars + "4.9/5 từ 1200+ học viên"
- Scroll indicator
- Campaign override logic (GIỮ NGUYÊN 100%)

**Target height:**
- Desktop: ~100vh (single viewport)
- Mobile: content-based nhưng không quá 1.5-2 viewports

### 1.4 — Locations: bỏ CTA card

**File:** `src/components/blocks/LocationsGrid.tsx`

Bỏ `<aside className="location-cta-card">...</aside>`.
Grid chuyển từ 2-column (cards + CTA) sang single-column hoặc 3-column cards.
Location cards giữ nguyên (MapPin, phone, hours, "Xem bản đồ").

### 1.5 — SeoLinksBlock: chuyển vào footer

**File:** `src/components/layout/Footer.tsx`

**Vấn đề đã xác nhận:** `featuredRoutes` trong footer hiện tại chỉ có **5 routes**, thiếu 2 routes so với `PREVIEW_READY_ROUTES` của SeoLinksBlock:

| Route | SeoLinksBlock | Footer hiện tại |
|-------|---------------|-----------------|
| `/hoc-cau-long-cho-nguoi-moi/` | ✅ | ✅ |
| `/lop-cau-long-binh-thanh/` | ✅ | ❌ **THIẾU** |
| `/lop-cau-long-thu-duc/` | ✅ | ❌ **THIẾU** |
| `/lop-cau-long-tre-em/` | ✅ | ✅ |
| `/lop-cau-long-cho-nguoi-di-lam/` | ✅ | ✅ |
| `/cau-long-doanh-nghiep/` | ✅ | ✅ |

**Việc cần làm:** Thêm `/lop-cau-long-binh-thanh/` và `/lop-cau-long-thu-duc/` vào `featuredRoutes` array. Sau đó xóa `SeoLinksBlock` khỏi `page.tsx` và có thể xóa file component.

```tsx
// Footer.tsx — cập nhật featuredRoutes
const featuredRoutes = coreRoutes.filter((route) =>
  [
    "/hoc-cau-long-cho-nguoi-moi/",
    "/lop-cau-long-binh-thanh/",     // ← THÊM MỚI
    "/lop-cau-long-thu-duc/",         // ← THÊM MỚI
    "/lop-cau-long-tre-em/",
    "/lop-cau-long-cho-nguoi-di-lam/",
    "/hoc-cau-long-1-kem-1/",
    "/cau-long-doanh-nghiep/",
  ].includes(route.path),
);
```

> **Lưu ý:** `/hoc-cau-long-1-kem-1/` đang có trong footer nhưng không có trong SeoLinksBlock — giữ lại, không xóa (nó hợp lệ).

### 1.6 — WhySection: bỏ CTA buttons

**File:** `src/components/home/WhySection.tsx`

Bỏ `<div className="why-section__cta-row">` (chứa "Đăng ký học thử ngay" + "Xem lịch đang mở").
Lý do: Why là section trust/value prop, không phải conversion point. CTA ở đây gây noise.

---

## PHASE 2: CSS Refactor

### 2.1 — Xóa legacy dump khỏi globals.css (KHÔNG tạo file mới)

**⚠️ ĐÍNH CHÍNH QUAN TRỌNG:** Cây `src/styles/components/*.css` và `src/styles/pages/*.css` đã **tồn tại sẵn** (Codex đã tạo). `globals.css` lines 1–17 đã `@import` đầy đủ các file này. **KHÔNG được tạo cây song song mới.**

**Cấu trúc đã có (2,099 dòng clean CSS):**

```
src/styles/tokens.css                    ← CSS custom properties
src/styles/base.css                      ← reset, typography
src/styles/layout.css                    ← grid/container
src/styles/components/
  nav.css          (243L)
  hero.css         (389L)
  stats-bar.css     (68L)
  courses.css      (180L)
  why.css          (160L)
  coaches.css      (158L)
  pricing.css
  schedule.css     (163L)
  testimonials.css (100L)
  support.css
  footer.css       (159L)
  floating-cta.css
src/styles/pages/
  blog.css
  money-page.css
```

**Vấn đề thực sự:** `globals.css` lines 18–6,567 là **6,550 dòng legacy CSS** (Sprint 4–5) cascade **sau** các @import trên → override sạch CSS của component files.

**Quy trình fix:**

**Bước 1 — Audit từng component file** so với legacy selectors trong globals.css lines 18–6,567:
- Với mỗi selector namespace (`.hero*`, `.course-*`, `.schedule-*` v.v.), tìm definition cuối cùng (bottommost) trong legacy block
- Nếu component file đã có definition đúng → không cần làm gì
- Nếu component file thiếu hoặc sai → **cập nhật file đó** (không sửa globals.css)

**Bước 2 — Thêm CSS mới** cho components bổ sung (PricingStrip, EnterpriseTeaser) vào file tương ứng:
- `src/styles/components/courses.css` ← thêm `.pricing-strip*`, `.enterprise-teaser*`
- `src/styles/components/pricing.css` ← giữ `.pricing-card*` (vẫn cần cho money pages)

**Bước 3 — Xóa lines 18–6,567 khỏi globals.css** sau khi đã verify component files complete.

```css
/* globals.css sau refactor — chỉ còn: */
@import "../styles/tokens.css";
@import "../styles/base.css";
@import "../styles/layout.css";
@import "../styles/components/nav.css";
@import "../styles/components/hero.css";
/* ... tất cả imports hiện tại ... */
/* ← HẾT. Không có gì sau đây. */
```

### 2.2 — Mỗi component file chỉ 1 canonical definition

**Quy tắc khi audit:**
1. Tìm selector cuối cùng (bottommost) trong globals.css lines 18–6,567 → đó là canonical
2. Tìm responsive media query cho selector đó → giữ
3. Bỏ tất cả definitions trước đó (Sprint 4, Sprint 5 intermediate) trong **cùng component file**
4. Nếu Sprint 4 có styles không bị override (ví dụ: animation keyframes, một-lần-dùng variables), giữ

### 2.3 — CSS fixes (Figma fidelity)

| Fix | CSS property | From | To |
|-----|-------------|------|-----|
| Body bg | `background` | `#fbfcf8` | `#ffffff` |
| Section bg | alternating | `#f2fbf4` | `#f0fdf4` |
| Hero overlay | `background` | 92deg gradient | `linear-gradient(135deg, rgba(7,31,16,0.92), rgba(13,74,40,0.75) 50%, rgba(30,45,92,0.55))` |
| Hero status pill | `background`, `border` | white tint | `rgba(132,204,22,0.15)`, `border: 1px solid rgba(132,204,22,0.35)` |
| Stats bar | `border-radius` | 32px (floating card) | 0 (full-width bar) |
| Footer bg | `background` | gradient | `#071f10` flat |
| Bỏ Sprint 4 dark vars | `:root` | `--v2-black`, `--v2-dark`, etc. | delete (unused after refactor) |

### 2.4 — New CSS components

```css
/* Pricing strip */
.pricing-strip { ... }
.pricing-strip__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.pricing-strip__item { padding: 20px; border-radius: 16px; border: 1px solid rgba(21,96,52,0.1); }
.pricing-strip__price { color: #0d4a28; font-size: 1.1rem; font-weight: 800; }

/* Enterprise teaser */
.enterprise-teaser { display: flex; align-items: center; justify-content: space-between; padding: 24px 28px; border-radius: 24px; background: linear-gradient(135deg, #0d4a28, #1e2d5c); color: #fff; }
.enterprise-teaser__badge { ... pill style lime ... }
```

---

## PHASE 3: Anchor & link fixes

Khi bỏ sections, cần update anchors:

| Anchor | Hiện trạng | Sau refactor |
|--------|-----------|-------------|
| `#hoc-phi` | PricingSection | → `<PricingStrip id="hoc-phi">` trong CourseSection |
| `#doanh-nghiep` | BusinessSection | → `<EnterpriseTeaser id="doanh-nghiep">` hoặc bỏ |
| `#seo-links` | SeoLinksBlock | → bỏ (chuyển vào footer, không cần anchor) |
| `#khoa-hoc` | CourseSection | → giữ nguyên |

**Files cần update anchors:**
- `Nav.tsx`: link "Học phí" href `/#hoc-phi` → vẫn OK (anchor chuyển vào CourseSection)
- `Footer.tsx`: legal link "Học phí & hoàn phí" href `/#hoc-phi` → OK
- `LocationsGrid.tsx`: link "Xem trước học phí" href `#hoc-phi` → OK (nếu giữ LocationsGrid; nếu bỏ CTA card thì bỏ link này luôn)
- `CourseSection.tsx`: footer "Xem toàn bộ học phí" href `#hoc-phi` → bỏ (pricing strip ngay bên dưới, không cần link tới chính mình)

---

## PHASE 4: CTA audit sau refactor

### CTA map mới:

```
Nav:           "Đăng ký ngay" ×1
Hero:          "Đăng ký học thử" ×1 + "Xem khóa học" ×1
Courses:       "Xem chi tiết" ×4 (per card, → money pages)
               "Nhận báo giá" ×1 (enterprise teaser)
Why:           (không có CTA)
Coaches:       (không có CTA)
Testimonials:  (không có CTA)
Schedule:      rows clickable → auto-scroll to Contact
Locations:     "Xem bản đồ" ×3-4 (per card, utility)
FAQ:           (không có CTA)
Contact:       "Gửi thông tin" ×1 + "Gọi" ×1 + "Zalo" ×1
Floating:      "Gọi" ×1 + "Zalo" ×1
Footer:        "Đăng ký học thử" ×1 (link)
─────────────────────────
Tổng "Đăng ký": 3 (nav + hero + footer)     ← giảm từ 17
Tổng CTA:       ~17                          ← giảm từ 31
```

---

## PHASE 5: Files tóm tắt

### Files SỬA:

| File | Thay đổi |
|------|----------|
| `src/app/(site)/page.tsx` | Bỏ PricingSection, BusinessSection, SeoLinksBlock imports. Reorder sections. |
| `src/components/home/CourseSection.tsx` | Thêm `useHomepageConversion()`, thêm PricingStrip + EnterpriseTeaser sub-components. Sửa giá "từ X". Bỏ footer "Xem toàn bộ học phí". |
| `src/components/home/HeroSection.tsx` | Bỏ `<aside>`, trust strip. Giảm từ 3→2 CTA. |
| `src/components/home/WhySection.tsx` | Bỏ CTA row. |
| `src/components/blocks/LocationsGrid.tsx` | Bỏ CTA card `<aside>`. Đổi grid layout. |
| `src/components/layout/Footer.tsx` | Thêm `/lop-cau-long-binh-thanh/` và `/lop-cau-long-thu-duc/` vào `featuredRoutes` (hiện thiếu 2/6 routes). |
| `src/app/globals.css` | Xóa lines 18–6,567 (legacy dump). Giữ lines 1–17 (@imports). KHÔNG tạo file mới. |
| `src/styles/components/courses.css` | Thêm `.pricing-strip*`, `.enterprise-teaser*` CSS. Audit canonical selectors. |

### Files KHÔNG SỬA:

| File | Lý do giữ nguyên |
|------|------------------|
| `HomepageConversionProvider.tsx` | Logic core, không đổi. `setCourseIntent` đã có sẵn — chỉ cần CourseSection gọi lại. |
| `HomepageBusinessModeInitializer.tsx` | URL param handler, không đổi |
| `ScheduleSection.tsx` | Giữ nguyên. `selectedCourseIntent` filter sẽ work lại sau khi CourseSection khôi phục dispatch. |
| `CoachSection.tsx` | Giữ nguyên |
| `TestimonialsSection.tsx` | Giữ nguyên |
| `FaqSection.tsx` | Giữ nguyên |
| `ContactSection.tsx` + `ContactForm.tsx` | Giữ nguyên 100% |
| `PricingCards.tsx` | VẪN CẦN cho money pages — chỉ bỏ trên homepage |
| `Nav.tsx` | Giữ nguyên (anchors vẫn work) |
| `FloatingCta.tsx` | Giữ nguyên |

### Files CÓ THỂ XÓA (sau khi verify không import ở đâu khác):

| File | Điều kiện |
|------|-----------|
| `PricingSection.tsx` | Chỉ dùng trên homepage → xóa sau khi bỏ khỏi page.tsx |
| `BusinessSection.tsx` | Chỉ dùng trên homepage → xóa sau khi bỏ khỏi page.tsx |
| `SeoLinksBlock.tsx` | Chỉ dùng trên homepage → xóa hoặc giữ nếu muốn dùng cho sub-page sau này |

---

## Test checklist

- [ ] Homepage render đúng 10 sections, đúng order (Hero → StatsBar → CourseSection → Why → Coaches → Testimonials → Schedule → Locations → FAQ → Contact)
- [ ] `#hoc-phi` anchor scroll tới PricingStrip trong CourseSection
- [ ] `#doanh-nghiep` hoặc enterprise teaser nhận focus khi `?business=1`
- [ ] `enterBusinessMode()` từ enterprise teaser → Contact form chuyển business mode
- [ ] Schedule rows click → auto-scroll to Contact form (setPrefill vẫn work)
- [ ] Course cards "Xem lịch học" → `setCourseIntent` dispatch → ScheduleSection filter hoạt động + scroll
- [ ] Course cards "Xem chi tiết" → đúng money pages
- [ ] Nav links tất cả anchors hoạt động
- [ ] Mobile: hero ≤ 2 viewports, menu hoạt động
- [ ] PricingCards vẫn render đúng trên money pages (không bị ảnh hưởng)
- [ ] Blog pages không bị ảnh hưởng
- [ ] Contact form submit + validation vẫn work
- [ ] FloatingCta vẫn hiện đúng
- [ ] JSON-LD schemas vẫn output đúng (giữ nguyên data fetches)

---

## Effort estimate

| Phase | Task | Effort |
|-------|------|--------|
| 1.1 | page.tsx reorder | 15min |
| 1.2 | CourseSection gộp (PricingStrip + EnterpriseTeaser) | 2-3h |
| 1.3 | Hero compact | 1-1.5h |
| 1.4 | Locations bỏ CTA card | 30min |
| 1.5 | Footer SeoLinks | 15min |
| 1.6 | Why bỏ CTA | 10min |
| 2.1-2.2 | CSS refactor (audit component files + xóa legacy dump) | 2-3h |
| 2.3 | CSS Figma fidelity fixes | 30min |
| 2.4 | New CSS (pricing-strip, enterprise-teaser) | 1h |
| 3 | Anchor/link fixes | 30min |
| 4 | CTA cleanup verification | 15min |
| 5 | Testing | 1h |
| **Total** | | **~10-12h** |
