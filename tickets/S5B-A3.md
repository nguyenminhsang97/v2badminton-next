# S5B-A3 · CTA/button consistency audit

**Muc tieu:** Audit tat ca interactive elements (buttons, links, CTAs) va dam bao chung follow `.btn` system nhat quan. Fix nhung cho dung ad-hoc styling.

**Thoi gian uoc luong:** 45 phut

**Phu thuoc:** S5A-A1 (CourseSection `.course-card__action` da duoc style)

**Rui ro:** Thap. Chi audit va align styling.

---

## Context cho junior

Hien tai project co `.btn` system (dong 309-356 trong globals.css):
- `.btn` — base: `display: inline-flex`, padding, transition
- `.btn--primary` — lime background, black text
- `.btn--outline` — transparent background, lime border
- `.btn--lg` — larger padding

Nhung mot so components dung button/link ma **khong dung `.btn` class**:
- `CourseSection` → `.course-card__action` (button, S5A-A1 da style rieng)
- `ScheduleSection` → `.schedule-tab` (tab buttons, co style rieng)
- `MoneyPageTemplate` → CTA link dung `.btn btn--primary btn--lg` (ok)

Ticket nay khong bat buoc moi element phai dung `.btn` — tab buttons co UI khac la dung. Chi can dam bao:
1. Hover states co transition mem (0.18-0.2s)
2. Cursor pointer tren tat ca interactive elements
3. Khong co button nao thieu hover effect
4. Font weight nhat quan cho CTA text

---

## File can sua

`src/app/globals.css`

---

## Buoc 1 — Audit checklist

Review tung interactive element va danh dau:

| Element | File | Dung `.btn`? | Hover effect? | Cursor? | Status |
|---------|------|-------------|---------------|---------|--------|
| Nav CTA | Nav.tsx | `.btn--primary` | Co | Co | OK |
| Hero primary CTA | HeroSection.tsx | `.btn--primary.btn--lg` | Co | Co | OK |
| Hero secondary CTA | HeroSection.tsx | `.btn--outline.btn--lg` | Co | Co | OK |
| Pricing CTA | PricingCards.tsx | `.btn--primary` / `.btn--outline` | Co | Co | OK |
| Course action | CourseSection.tsx | `.course-card__action` | Co (S5A-A1) | Co | OK |
| Schedule tab | ScheduleSection.tsx | `.schedule-tab` | **Thieu** | Co | **FIX** |
| Schedule card | ScheduleSection.tsx | `role="button"` | **Thieu** | **Thieu** | **FIX** |
| Location CTA | LocationsGrid.tsx | `.btn--outline` | Co | Co | OK |
| Money page CTA | MoneyPageTemplate.tsx | `.btn--primary.btn--lg` | Co | Co | OK |
| FAQ summary | FaqList.tsx | `<summary>` | **Thieu** | Co | **FIX** |
| Form submit | ContactForm.tsx | `.btn--primary.btn--lg` | Co | Co | OK |
| Form details toggle | ContactForm.tsx | `<summary>` | **Thieu** | Co | **FIX** |

---

## Buoc 2 — Fix schedule tab hover

Sau `.schedule-tab--active` (dong 630):

```css
.schedule-tab:hover:not(.schedule-tab--active) {
  border-color: rgba(200, 245, 66, 0.35);
  color: var(--v2-white);
}
```

---

## Buoc 3 — Fix schedule card hover + cursor

Sau `.schedule-card` rules:

```css
.schedule-card {
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease;
}

.schedule-card:hover {
  border-color: rgba(200, 245, 66, 0.25);
  background: rgba(200, 245, 66, 0.04);
}
```

**Luu y:** Kiem tra `.schedule-card` da co trong card background group (dong 374) chua. Neu co, chi them `cursor` va `transition` vao existing rule, khong tao rule moi de tranh override.

---

## Buoc 4 — Fix FAQ summary hover

Sau `.faq-item summary` (dong 668):

```css
.faq-item summary:hover {
  color: var(--v2-white);
}
```

---

## Buoc 5 — Fix form details toggle hover

Sau `.contact-form__optional summary` (dong 739):

```css
.contact-form__optional summary:hover {
  color: var(--v2-lime);
}
```

---

## Cach verify

1. `npm run build` — pass
2. Dev server → hover qua moi element trong checklist:
   - Schedule tabs: border sanger khi hover (tab khong active)
   - Schedule cards: background/border subtle change khi hover
   - FAQ items: summary text sang khi hover
   - Form "Thong tin bo sung": text sang lime khi hover
3. Tat ca hover transitions mem (khong bi snap)
4. Tat ca clickable elements co `cursor: pointer`
