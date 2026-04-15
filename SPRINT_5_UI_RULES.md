# Sprint 5 UI Rules — Figma Design

## Purpose

Sprint 5 is a visual overhaul. The target design is Version B (Figma).
This file defines how to translate Figma into the Next.js codebase.

## Rule 1: Figma owns the design

Primary reference:
- Published: `https://lemon-speck-28354326.figma.site`
- Local: `D:\V2\Badminton Academy Enrollment Screens`

Follow Figma for:
- Layout patterns (grid columns, section arrangement)
- Component structure (what goes inside each card)
- Typography hierarchy (sizes, weights, colors)
- Spacing rhythm (section padding, card gaps)
- Card treatment (radius, shadows, image slots)
- Color system (backgrounds, accents, text colors)
- Trust elements (ratings, student count, credentials)
- Footer structure (4-column)

## Rule 2: V2 brand replaces Eagle brand

Figma uses "Eagle Badminton Academy" as placeholder.
Replace with V2 Badminton content everywhere:
- Brand name: V2 Badminton
- Locations: Hue Thien, Phuc Loc, Green, Khang Sport (real V2 locations)
- Pricing: V2's real pricing (1.000.000 / 1.300.000 / 1.500.000 / 400.000)
- Coaches: V2's real coach info from Sanity
- Phone: 0907 911 886
- Copy tone: keep V2's direct, concise Vietnamese

## Rule 3: Infrastructure stays untouched

Do not modify:
- `src/lib/sanity/` (queries, types, client)
- `src/lib/routes.ts` (routing system)
- `src/lib/tracking.ts` (analytics events)
- `src/lib/moneyPageFallback.ts` (fallback system)
- `src/app/(site)/[slug]/page.tsx` patterns (money page architecture)
- Contact form logic in `ContactForm.tsx` (validation, submission, Postgres)

Only modify the **render output** and **CSS** of components — not their data contracts.

## Rule 4: Sanity drives content

Do not hardcode content that comes from Sanity:
- Course data → from Sanity schedules/courses
- Coach profiles → from Sanity (when available)
- Pricing → from Sanity money page fallbacks
- Testimonials → from Sanity (when available)

For sections where Sanity schemas don't exist yet (coaches, testimonials),
use static data in the component as a temporary bridge, but structure it
so Sanity integration is straightforward later.

## Rule 5: Color system from Figma

Figma's color palette (adapt to CSS variables):

```css
:root {
  /* Primary */
  --primary: #0d4a28;           /* dark green */
  --primary-light: #e8f5e9;     /* light green bg */
  --primary-surface: rgba(13, 74, 40, 0.08); /* subtle green bg */

  /* Accent */
  --accent: #f97316;            /* orange — primary CTA */
  --accent-hover: #ea580c;      /* orange darker */

  /* Neutral */
  --bg-white: #ffffff;
  --bg-light: #f8faf8;          /* off-white sections */
  --bg-dark: #1a2e23;           /* dark sections */
  --bg-footer: #0f1f17;         /* footer */

  /* Text */
  --text-primary: #1a1a1a;
  --text-secondary: #6b7280;
  --text-light: #ffffff;
  --text-muted: #9ca3af;

  /* Border */
  --border: #e5e7eb;
  --border-card: rgba(0, 0, 0, 0.06);

  /* Card */
  --card-bg: #ffffff;
  --card-shadow: 0 2px 20px rgba(0, 0, 0, 0.07);
  --card-radius: 16px;          /* rounded-2xl */
}
```

**Section background pattern (alternating):**
- Hero: dark green gradient + photo
- Courses: white/light
- Why V2: white/light
- Coaches: dark green
- Testimonials: white/light
- Schedule: white/light
- Locations: dark
- Contact: dark
- Footer: darkest

## Rule 6: Button system from Figma

```css
/* Primary CTA — orange, rounded */
.btn-primary {
  background: var(--accent);
  color: white;
  border-radius: 12px;
  padding: 14px 28px;
  font-weight: 700;
}

/* Secondary — outlined */
.btn-outline {
  background: transparent;
  border: 1.5px solid var(--primary);
  color: var(--primary);
  border-radius: 12px;
  padding: 14px 28px;
}

/* Ghost — text only with icon */
.btn-ghost {
  background: transparent;
  color: var(--primary);
  padding: 14px 28px;
}
```

Note: Figma does NOT use clip-path diagonal corners.
Previous Sprint 5 plan used V2 static site's clip-path — that is now replaced
by Figma's rounded buttons.

## Rule 7: Card system from Figma

```css
.card {
  background: var(--card-bg);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
```

Cards with images: image fills top portion, content below.
Cards without images: padding all around.

## Rule 8: Typography from Figma

```
Font: Inter or system-ui (Figma uses Inter)
Section kicker: 14px, 600, uppercase, tracking 0.1em, primary color, pill bg
Section title: clamp(28px, 4vw, 42px), 900, dark
Section desc: 16px, 400, secondary color, max-width 600px
Card title: 18px, 700, dark
Card desc: 14px, 400, secondary
Price: 24px, 900, primary
Label: 12px, 600, uppercase, tracking 0.08em
```

## Rule 9: Section kicker badge

Every major section has a kicker badge above the title:

```html
<span class="section-kicker">KHÓA HỌC CẦU LÔNG</span>
```

```css
.section-kicker {
  display: inline-flex;
  padding: 6px 16px;
  background: var(--primary-surface);
  border: 1px solid rgba(13, 74, 40, 0.15);
  border-radius: 9999px;
  color: var(--primary);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

## Rule 10: Mobile responsive

Figma shows desktop-first but must work on mobile:
- Grid columns collapse: 4-col → 2-col → 1-col
- Hero: 2-col → 1-col (image below or hidden)
- Schedule table: horizontal scroll on mobile
- Footer: 4-col → 2-col → 1-col
- Nav: hamburger menu on mobile
- Section padding: 80px → 48px on mobile
- Floating CTA: always visible

## Figma Section Reference

| Section | Figma pattern | Key elements |
|---------|--------------|--------------|
| Hero | Dark bg, photo right, trust strip | Kicker pill, H1, desc, 3 CTAs, avatar stack + 4.9★ + 1200+ |
| Courses | Light bg, 4-col cards | Photo, badge, title, age, desc, freq+price, CTA |
| Why V2 | Light bg, 2-col (text + images) | Icon list, stat box (98%), 2 photos |
| Coaches | Dark bg, 3-col cards | Large photo, name overlay, credentials, quote, stars + student count |
| Testimonials | Light bg, 3-col cards | Stars, quote, avatar + name + role |
| Schedule | Light bg, table layout | Day, time (bold), course, location, level tags (colored) |
| Locations | Dark bg, vertical list | Icon, name, address, phone, hours |
| Contact | Dark bg, 2-col | Title + desc + 2 CTAs (orange + outline) |
| Footer | Darkest bg, 4-col | Brand + desc + social, Courses links, Academy links, Contact info |
