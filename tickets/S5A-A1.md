# S5A-A1 - Design system overhaul

**Muc tieu:** Chuyen visual foundation cua app sang Figma system: green + orange palette, rounded buttons, white cards + shadow, Inter-based typography, spacing rhythm moi.

**Thoi gian uoc luong:** 2 gio

**Phu thuoc:** Khong. Day la ticket dau tien cua Sprint 5.

**Rui ro:** Trung binh. Ticket nay anh huong `globals.css` va button/card primitives cua nhieu sections.

## Files chinh

- `src/app/globals.css`
- `src/app/(site)/layout.tsx` neu can font setup
- bat ky component nao dang rely vao old token names

## Scope

1. Them / map CSS variables theo `SPRINT_5_UI_RULES.md`
2. Doi button system sang rounded Figma buttons
3. Doi default card system sang white surface + shadow
4. Doi typography hierarchy sang Inter-led scale
5. Dinh nghia section kicker, section title, section desc, card title, price styles
6. Dat section spacing rhythm de Track A/B/C chi can consume system moi

## Khong nam trong ticket nay

- Rewrite tung section cu the
- Blog / money page routes
- Analytics

## Acceptance criteria

1. `globals.css` co token layer ro rang cho palette, text, border, surface, shadow
2. CTA buttons khong con dung clip-path diagonal system trong visual moi
3. Default card primitives la rounded white cards voi shadow nhe
4. Font stack / heading scale khop Figma direction
5. `npm run lint` pass
6. `npm run build` pass

## Implementation notes

- Infrastructure, data contracts, va class names cua business logic khong duoc sua neu khong can thiet.
- Neu can alias tu old token sang new token de giam regression, alias la chap nhan duoc trong ticket nay.

### CSS variables can dinh nghia (theo UI_RULES Rule 5)

```css
--color-green-primary: #0d4a28;
--color-green-dark: #0a3a1f;
--color-orange-primary: #f97316;
--color-orange-hover: #ea580c;
--color-surface: #ffffff;
--color-surface-alt: #f8faf9;   /* light green-tinted bg for alternating sections */
--color-text-primary: #1a1a1a;
--color-text-secondary: #6b7280;
--color-border: #e5e7eb;
--shadow-card: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
--shadow-card-hover: 0 4px 12px rgba(0,0,0,0.1);
--radius-card: 12px;
--radius-button: 8px;
```

### Font loading

- Inter font: load via `next/font/google` trong `layout.tsx` (hoac `globals.css` @import neu can)
- Set `font-family: var(--font-inter), system-ui, sans-serif` lam default body font

### Section background alternation

- Sections luan phien giua `--color-surface` (white) va `--color-surface-alt` (light green tint)
- Dark sections (hero, footer) dung `--color-green-primary` hoac `--color-green-dark`
