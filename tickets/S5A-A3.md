# S5A-A3 · Focus indicators + contrast audit

**Muc tieu:** Moi interactive element (button, link, tab, card) phai co `:focus-visible` outline ro rang. Dong thoi audit color contrast de dam bao WCAG AA.

**Thoi gian uoc luong:** 1 gio

**Phu thuoc:** S5A-A1 (can CSS class day du truoc khi them focus styles)

**Rui ro:** Thap. Chi them CSS, khong sua logic.

---

## Context cho junior

Hien tai project **khong co rule `:focus-visible` nao** ngoai form inputs (dong 724-728 co `:focus` cho input/select/textarea). Keyboard user (tab qua buttons, links, cards) khong thay dau hieu visual nao cho biet element nao dang duoc focus.

Day la accessibility gap — WCAG 2.4.7 yeu cau "focus indicator visible".

**`:focus-visible` vs `:focus`:** `:focus-visible` chi hien khi user dung keyboard (Tab), khong hien khi user click chuot. Day la pattern chuan hien tai — tranh outline xuat hien khi click button.

---

## File can sua

`src/app/globals.css`

---

## Buoc 1 — Global focus-visible reset

Them ngay sau `img { ... }` block (khoang dong 47):

```css
:focus-visible {
  outline: 2px solid var(--v2-lime);
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}
```

**Tai sao outline lime?** Lime la brand accent, contrast tot tren dark background. `outline-offset: 2px` de outline khong dinh sat vao element.

---

## Buoc 2 — Button focus refinement

`.btn` da co transition cho `background`, `color`, `border`. Them focus-visible rule sau `.btn:hover` (khoang dong 328):

```css
.btn:focus-visible {
  outline: 2px solid var(--v2-lime);
  outline-offset: 2px;
}
```

---

## Buoc 3 — Schedule tab focus

Sau `.schedule-tab--active` (dong 630):

```css
.schedule-tab:focus-visible {
  outline: 2px solid var(--v2-lime);
  outline-offset: -2px;
}
```

**`outline-offset: -2px`:** Tab co border rieng, outline offset am de outline nam ben trong border — nhin sach hon.

---

## Buoc 4 — Schedule card focus

Schedule card co `role="button"` va `tabIndex={0}` — user Tab duoc vao card. Them sau `.schedule-card` rules:

```css
.schedule-card:focus-visible {
  outline: 2px solid var(--v2-lime);
  outline-offset: 2px;
  border-color: rgba(200, 245, 66, 0.35);
}
```

---

## Buoc 5 — Nav link focus

Sau `.site-nav__link` hover rules:

```css
.site-nav__link:focus-visible,
.site-nav__mobile-link:focus-visible {
  outline: 2px solid var(--v2-lime);
  outline-offset: 2px;
}
```

---

## Buoc 6 — Course card action focus

Sau `.course-card__action:hover` (them o S5A-A1):

```css
.course-card__action:focus-visible {
  outline: 2px solid var(--v2-lime);
  outline-offset: 2px;
}
```

---

## Buoc 7 — SEO links card focus

Sau `.seo-links__card:hover` (them o S5A-A1):

```css
.seo-links__card:focus-visible {
  outline: 2px solid var(--v2-lime);
  outline-offset: 2px;
}
```

---

## Buoc 8 — Color contrast audit

Kiem tra cac text color co contrast ratio >= 4.5:1 (WCAG AA) tren dark background:

| Color | Hex | Background | Ratio | Pass? |
|-------|-----|-----------|-------|-------|
| `--v2-muted` | `#9d9d9d` | `#0a0a0a` | ~6.5:1 | AA |
| `--v2-light` | `#e8e8e8` | `#0a0a0a` | ~15:1 | AAA |
| `--v2-lime` | `#c8f542` | `#0a0a0a` | ~12:1 | AAA |
| `--v2-white` | `#f5f5f0` | `#0a0a0a` | ~16:1 | AAA |
| `#ff8b8b` (error) | | `#0a0a0a` | ~5.5:1 | AA |

**Ket qua:** Tat ca colors pass WCAG AA. `--v2-muted` la thap nhat (~6.5:1) nhung van pass AA (>= 4.5:1). Khong can thay doi color nao.

**Tool kiem tra:** Dung https://webaim.org/resources/contrastchecker/ hoac browser DevTools (Elements → Styles → color swatch → contrast ratio).

---

## Cach verify

1. `npm run build` — pass
2. Dev server → Tab qua toan bo page:
   - Buttons: outline lime hien khi Tab, mat khi click
   - Nav links: outline lime khi Tab
   - Schedule tabs: outline lime khi Tab
   - Schedule cards: outline lime + border highlight khi Tab
   - SEO link cards: outline lime khi Tab
   - Form inputs: giu nguyen outline hien tai (da co)
3. Click chuot vao bat ky element → khong co outline (`:focus:not(:focus-visible)` hide)
4. Mobile: test bang keyboard Bluetooth hoac skip (mobile users it dung keyboard navigation)
