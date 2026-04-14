# Sprint 5 UI Rules

## Purpose

This file exists to prevent Sprint 5 from becoming only a "CSS bug fix" sprint.

Sprint 5 should produce a UI that is:

- structurally aligned with Version C
- commercially aligned with the current static V2 site
- visually polished with lessons from the Figma export

## Rule 1: Blueprint owns structure

Use:

- `VERSION_C_BLUEPRINT.md`
- `VERSION_C_IMPLEMENTATION_PLAN.md`

Implications:

- do not arbitrarily reorder the homepage
- do not turn the homepage into a wizard
- do not turn money pages into editorial article pages

## Rule 2: Static V2 owns business tone

Use:

- `D:\V2\landing-page\index.html`
- `D:\V2\landing-page\seo-common.css`
- `D:\V2\landing-page\tracking.js`

Borrow from static V2:

- concise CTA copy
- quick-link and trust-strip thinking
- breadcrumb + page-kicker rhythm
- compact CTA block at the end of money pages
- familiar analytics event names

Do not borrow:

- one-off page implementations that bypass the component system

## Rule 3: Figma owns polish, not architecture

Use:

- `D:\V2\Badminton Academy Enrollment Screens\src\app\pages\HomePage.tsx`
- `D:\V2\Badminton Academy Enrollment Screens\src\app\pages\EnrollmentPage.tsx`
- `D:\V2\Badminton Academy Enrollment Screens\src\styles\theme.css`

Borrow from Figma:

- stronger hero hierarchy
- richer card treatment
- better spacing rhythm
- more deliberate trust/testimonial presentation
- clearer CTA emphasis

Do not borrow:

- Eagle Academy branding
- orange-first identity
- multi-step enrollment flow as the main homepage interaction

## Rule 4: Homepage goals

After Sprint 5, the homepage should feel:

- faster to scan
- more trustworthy
- more clearly conversion-oriented

Targets:

1. Hero has stronger hierarchy and trust cues.
2. Course, pricing, and schedule cards feel fully designed.
3. Coach and testimonial sections feel like a trust layer.
4. Contact section feels like the final conversion zone.

## Rule 5: Money-page goals

After Sprint 5, money pages should feel like focused landing pages.

Targets:

1. Visual breadcrumb exists.
2. Hero image supports the page when Sanity provides one.
3. Intro density stays compact and readable.
4. CTA block is clear and easy to act on.

## Rule 6: Interaction quality matters

Sprint 5 must improve the feel of the interface, not only the layout.

Required:

- focus-visible states
- intentional hover states
- branded loading UI
- branded error UI
- mobile-safe tap targets

## Rule 7: Brand guardrails

Keep:

- dark background direction
- lime accent identity
- V2 copy tone
- conversion-first layout

Avoid:

- pastel redesigns
- generic SaaS styling
- a new unrelated button/card system

## Rule 8: One visual system

Blog pages and future money pages must inherit the same improved UI language.
Do not let homepage, money pages, and blog drift into three separate styles.

---

## Concrete CSS reference values

These values were extracted from cross-referencing `D:\V2\landing-page` (static V2) and `D:\V2\Badminton Academy Enrollment Screens` (Figma export). Use as primary reference when implementing Sprint 5 tickets.

### From Static V2 (business tone — priority)

**CTA clip-path (brand signature):**
```
clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
```
- Primary buttons: corner 10px
- Tab buttons: corner 6px, padding `0.45rem 1.1rem`
- Course card action: corner 8px (smaller pill)

**Why-card hover accent bar:**
```
.why-card::before { height: 2px; background: #c8f542; transform: scaleX(0→1); }
.why-card:hover { transform: translateY(-4px); }
```

**Schedule time highlight:**
```
color: #c8f542; font-size: 1.5rem; font-weight: 700;
```

**Card hover lift (shared):**
```
transform: translateY(-2px);
```
Applied to: schedule-card, pricing-card, seo-links__card.

**Breadcrumb + page-kicker:**
```
Separator: → (arrow, not >)
Link color: var(--v2-light)
Page-kicker: color: #c8f542; font-size: 0.82rem; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;
```

**Analytics event names (keep continuity):**
```
cta_click, contact_click, map_click, form_start, generate_lead
```

### From Figma (polish — secondary)

**Spacing rhythm:**
```
Section padding: py-20 (80px)
Card gap: 24px
```

**Card treatment:**
```
border-radius: 16px (rounded-2xl) — for badges/pills only, NOT buttons
shadow: 0 2px 20px rgba(0,0,0,0.07) — optional for card hover depth
```

**Button hover micro-interaction:**
```
hover:scale-105 — for icon buttons only, not primary CTA
transition: 0.18-0.2s ease
```

**Level tag colors:**
```
Co ban (lime):    background: rgba(200, 245, 66, 0.12); color: var(--v2-lime);
Nang cao (blue):  background: rgba(59, 130, 246, 0.12); color: #93bbfd;
Doanh nghiep (purple): background: rgba(168, 85, 247, 0.12); color: #c4a5f7;
```

**Section desc max-width:**
```
max-width: 760px; (65-75 characters per line for readability)
```

### Conflicts resolved

| Element | Static V2 | Figma | Decision |
|---------|-----------|-------|----------|
| Button shape | clip-path diagonal | rounded-xl | **Static V2** (brand signature) |
| Card border-radius | 0 (sharp) | 16px | **Static V2** (dark theme, sharp edges) |
| Pill/badge radius | 9999px | 9999px | **Same** |
| Color scheme | dark + lime | light + green | **Static V2** (brand identity) |
| Hover style | translateY | scale | **Static V2** for cards, Figma scale for icons |
| Section label | none | pill badge | **Figma** (adds hierarchy without breaking brand) |
