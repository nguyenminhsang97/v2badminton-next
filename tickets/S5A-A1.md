# S5A-A1 · Missing CSS audit & fix

**Muc tieu:** Bo sung 31 CSS class dang bi thieu va fix 2 naming mismatch. Sau ticket nay moi component phai co day du styling.

**Thoi gian uoc luong:** 2-3 gio

**Rui ro:** Trung binh. Sua CSS nhieu cho nhung khong thay doi logic. Can test visual tren ca desktop va mobile.

---

## Context cho junior

Khi review Sprint 4, phat hien nhieu component render CSS class ma `globals.css` chua co rule. Visual nhin duoc la nho browser default + kế thừa chung tu parent, nhung layout/spacing/color bi sai.

**Nguyen tac:** Moi class moi phai follow design tokens da co (`:root` variables), khong hardcode color/font-size moi. Xem `:root` block (dong 0-10) va cac pattern da co de match style.

---

## File can sua

`src/app/globals.css` — chi file nay.

---

## Buoc 1 — Fix shared `.section__desc` (7 components)

Class nay duoc dung trong: CourseSection, WhySection, ScheduleSection, LocationsSection, CoachSection, TestimonialsSection, BusinessSection.

Them vao group text muted (khoang dong 497-511), them `.section__desc` vao selector list:

```css
.hero__subheading,
.section__subtitle,
.section__desc,                    /* ← them */
.pricing-card__desc,
.course-card__desc,
.location-card__address,
.contact-form-shell__subtitle,
.contact-form__hint,
.contact-direct__label,
.contact-direct__value,
.business__points,
.faq-item__answer,
.why-grid__text {
  color: var(--v2-muted);
  line-height: 1.7;
}
```

**Tai sao gop vao group co san?** Vi `.section__desc` can cung style voi cac description text khac — mau muted, line-height thoang. Khong tao rule rieng.

---

## Buoc 2 — Fix `.section__filter-note` (ScheduleSection)

Them sau `.section__desc` fix o buoc 1. Day la text nho hien khi user dang filter theo trinh do:

```css
.section__filter-note {
  color: var(--v2-lime);
  font-size: 0.85rem;
  font-weight: 600;
}
```

---

## Buoc 3 — Fix WhySection naming mismatch

Component render `.why-card`, `.why-card__title`, `.why-card__desc`. Nhung CSS co `.why-grid__item` (dong 378) va `.why-grid__text` (dong 508).

### 3a. Sua card background group

Tim dong 378 (`.why-grid__item` trong group padding/background):

```css
/* TRUOC: */
.why-grid__item {

/* SAU: */
.why-card {
```

### 3b. Sua card layout group

Tim dong 583 (`.why-grid__item` trong group `display: grid; gap: 14px`):

```css
/* TRUOC: */
.why-grid__item {

/* SAU: */
.why-card {
```

### 3c. Sua text muted group

Tim dong 508 (`.why-grid__text` trong group muted text):

```css
/* TRUOC: */
.why-grid__text {

/* SAU: */
.why-card__desc {
```

### 3d. Them `.why-card__title`

Them vao group title cac card (dong 593-600):

```css
.pricing-card__name,
.course-card__title,
.location-card__name,
.why-card__title,                  /* ← them */
.contact-direct__title,
.faq-item__question {
  color: var(--v2-white);
  font-size: 1.08rem;
}
```

---

## Buoc 4 — CourseSection (5 class)

### 4a. `.course-card__badge`

Badge "Pho bien" hien tren goc card. Them sau `.course-card` rules:

```css
.course-card__badge {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 0.25rem 0.75rem;
  background: var(--v2-lime-dim);
  border: 1px solid rgba(200, 245, 66, 0.28);
  border-radius: 9999px;
  color: var(--v2-lime);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
```

**Tai sao giong `hero__campaign-badge`?** Vi cung la pill badge, chi khac size nho hon. Giu visual system nhat quan.

### 4b. `.course-card__body`

Container cho title + desc + tags + action. Card dung `display: grid; gap: 14px` (dong 584), nhung body can gap rieng giua cac child:

```css
.course-card__body {
  display: grid;
  gap: 12px;
}
```

### 4c. `.course-card__tags` + `.course-card__tag`

Tags list va individual tag pill:

```css
.course-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.course-card__tag {
  padding: 0.2rem 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: var(--v2-muted);
  font-size: 0.78rem;
}
```

### 4d. `.course-card__action`

Button "Xem lich hoc" / "Lien he tu van". Khong dung `.btn` class nen can style rieng, nhung nen follow btn pattern:

```css
.course-card__action {
  justify-self: flex-start;
  padding: 0.5rem 1.2rem;
  border: 1px solid var(--v2-lime);
  background: transparent;
  color: var(--v2-lime);
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;
}

.course-card__action:hover {
  background: var(--v2-lime);
  color: var(--v2-black);
}
```

---

## Buoc 5 — SeoLinksBlock (3 class)

### 5a. `.seo-links__card`

Moi card la `<Link>` chua title + description:

```css
.seo-links__card {
  display: grid;
  gap: 8px;
  padding: 20px;
  border: 1px solid var(--v2-border);
  background: rgba(20, 20, 20, 0.92);
  transition: border-color 0.2s ease, background 0.2s ease;
}

.seo-links__card:hover {
  border-color: rgba(200, 245, 66, 0.35);
  background: rgba(200, 245, 66, 0.04);
}
```

### 5b. `.seo-links__card-title` + `.seo-links__card-desc`

```css
.seo-links__card-title {
  color: var(--v2-white);
  font-size: 1.08rem;
}

.seo-links__card-desc {
  color: var(--v2-muted);
  font-size: 0.92rem;
  line-height: 1.6;
}
```

---

## Buoc 6 — ScheduleSection (7 class)

### 6a. `.schedule-card__days` (naming)

Component render `className="schedule-card__days schedule-card__day"` — ca 2 class. CSS co `.schedule-card__day` (dong 653) roi. Khong can them `.schedule-card__days` vi `.schedule-card__day` da cover.

### 6b. `.schedule-card__location`

```css
.schedule-card__location {
  display: flex;
  align-items: center;
  gap: 6px;
}
```

### 6c. `.schedule-card__levels`

```css
.schedule-card__levels {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
```

### 6d. Level tag system

```css
.level-tag {
  display: inline-flex;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.level-tag--co-ban {
  background: rgba(200, 245, 66, 0.12);
  color: var(--v2-lime);
}

.level-tag--nang-cao {
  background: rgba(59, 130, 246, 0.12);
  color: #93bbfd;
}

.level-tag--doanh-nghiep {
  background: rgba(168, 85, 247, 0.12);
  color: #c4a5f7;
}
```

**Tai sao 3 mau khac nhau?** De user phan biet nhanh trinh do bang visual — khong can doc text. Lime = co ban (theme color), blue = nang cao, purple = doanh nghiep.

### 6e. `.schedule-note`

Text cuoi section, guide user sang form:

```css
.schedule-note {
  color: var(--v2-muted);
  font-size: 0.92rem;
  line-height: 1.7;
  text-align: center;
  padding-top: 8px;
}
```

---

## Buoc 7 — LocationsGrid (2 class)

### 7a. `.location-card__info`

```css
.location-card__info {
  display: grid;
  gap: 6px;
}
```

### 7b. `.location-card__cta`

Da co trong group `justify-self: flex-start` (dong 609-613). Kiem tra — neu `.location-card__cta` chua co trong selector list:

```css
.course-card__cta,
.pricing-card__cta,
.location-card__cta {
  justify-self: flex-start;
}
```

Selector nay da co roi (dong 609). Nhung `.location-card__cta` da nam trong list. **Kiem tra lai** — neu dung la da co thi khong can them. Class nay la `btn btn--outline location-card__cta` nen `.btn--outline` cung da cover styling.

---

## Buoc 8 — PricingCards (2 class)

### 8a. `.pricing-card--enterprise`

Enterprise card dung `btn--outline` thay vi `btn--primary`. Them modifier de visual phan biet:

```css
.pricing-card--enterprise {
  border-color: rgba(168, 85, 247, 0.2);
}
```

### 8b. `.pricing-card__cta`

Da co trong group dong 609-613 (`justify-self: flex-start`). Kiem tra lai — neu da co thi khong can sua.

---

## Buoc 9 — Responsive adjustments

Them vao `@media (min-width: 960px)` block (dong 999+):

```css
@media (min-width: 960px) {
  /* ... existing rules ... */

  .why-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .seo-links__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

**Tai sao 3 cot?** WhySection co 6 items → 3 cot x 2 hang. SeoLinksBlock co 6 routes → tuong tu. Tren mobile giu `auto-fit minmax(220px)` default.

---

## Cach verify

1. `npm run lint` — pass
2. `npm run build` — pass
3. Dev server → desktop (>960px):
   - WhySection: 6 cards hien dung, co title trang + desc muted
   - CourseSection: badge "Pho bien" hien pill xanh, tags hien nho, CTA button outline lime
   - SeoLinksBlock: 6 cards co border, hover effect
   - ScheduleSection: level tags co mau khac nhau, location hien dung
   - LocationsGrid: card info layout dung, CTA "Xem ban do" hien
   - PricingCards: enterprise card co border purple nhe
4. Dev server → mobile (<960px):
   - Tat ca grid collapse ve 1 cot hoac auto-fit
   - Text van doc duoc, khong bi tran
5. **Quan trong nhat:** So sanh truoc/sau — khong co section nao bi mat hoac layout vo
