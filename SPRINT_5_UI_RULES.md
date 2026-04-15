# Sprint 5 UI Rules - Figma First

## Purpose

Sprint 5 rewrites the visual layer of `v2badminton-next` to match the Figma
direction while keeping V2 content and existing infrastructure.

## Rule 1 - Figma owns the visual system

Primary references:

- Published Figma site: `https://lemon-speck-28354326.figma.site`
- Local Figma export: `D:\V2\Badminton Academy Enrollment Screens`

Follow Figma for:

- layout patterns
- visual hierarchy
- spacing rhythm
- section composition
- card treatment
- imagery usage
- typography scale
- CTA prominence
- footer structure
- floating action pattern

## Rule 2 - V2 content replaces Eagle placeholders

Replace all placeholder brand/content with V2 data:

- brand name: `V2 Badminton`
- V2 pricing
- V2 locations
- V2 coach/testimonial content from Sanity where available
- V2 phone / CTA copy / route structure

Do not import irrelevant placeholder items from the Figma source.

## Rule 3 - Infrastructure is not the redesign target

Do not rewrite:

- `src/lib/sanity/*`
- `src/lib/routes.ts`
- `src/lib/moneyPageFallback.ts`
- tracking/event helpers
- money page route architecture
- form submission and validation logic

Sprint 5 changes render output and CSS, not backend behavior.

## Rule 4 - Sanity still owns content

Do not hardcode content already modeled in Sanity.

Allowed temporary bridge content:

- static trust copy only where schema data is incomplete
- placeholder imagery only when real assets are missing

That bridge content must be easy to replace later.

## Rule 5 - Color direction is Figma green + orange

Use a Figma-first palette:

```css
:root {
  --primary: #0d4a28;
  --primary-light: #e8f5e9;
  --primary-surface: rgba(13, 74, 40, 0.08);

  --accent: #f97316;
  --accent-hover: #ea580c;

  --bg-white: #ffffff;
  --bg-light: #f8faf8;
  --bg-dark: #1a2e23;
  --bg-footer: #0f1f17;

  --text-primary: #1a1a1a;
  --text-secondary: #6b7280;
  --text-light: #ffffff;
  --text-muted: #9ca3af;

  --border: #e5e7eb;
  --border-card: rgba(0, 0, 0, 0.06);

  --card-bg: #ffffff;
  --card-shadow: 0 2px 20px rgba(0, 0, 0, 0.07);
  --card-radius: 16px;
}
```

Default direction:

- light-forward sections for readability
- dark sections only where Figma uses them intentionally
- orange reserved for high-priority CTA emphasis

## Rule 6 - Buttons follow Figma, not old V2 clip-path

Rounded buttons replace the old diagonal clip-path system.

```css
.btn-primary {
  background: var(--accent);
  color: white;
  border-radius: 12px;
}

.btn-outline {
  background: transparent;
  border: 1.5px solid var(--primary);
  color: var(--primary);
  border-radius: 12px;
}
```

Do not preserve old clip-path CTA corners in new Sprint 5 work.

## Rule 7 - Cards are white surfaces with shadow

Figma-style cards use:

- white background
- rounded corners
- subtle border and shadow
- clear image slot where relevant
- hover lift + shadow deepening

Dark transparent cards are no longer the default card system.

## Rule 8 - Typography follows Figma hierarchy

- font family: `Inter` or equivalent system fallback
- section kicker: compact uppercase pill
- section title: bold, large, high contrast
- section description: calmer secondary text
- card title: concise and bold
- price / metric / rating: high emphasis

## Rule 9 - Every major section needs visible design richness

Homepage and money pages should visibly include:

- image support where Figma uses imagery
- trust strip or stat treatment where appropriate
- badges / labels / ratings / quotes where appropriate
- stronger content grouping than current wireframe-like layout

This rule also applies to support sections:

- `FaqSection`
- `BusinessSection`
- `SeoLinksBlock`

These are not allowed to keep the old visual style while the rest of the homepage moves to Figma.

## Rule 10 - Schedule uses table-first desktop layout

Schedule should no longer be a dark card grid as the default.

Target:

- table-first on desktop
- scannable time emphasis
- colored level tags
- mobile fallback that stays usable

## Rule 11 - Frame elements must match the new system

This includes:

- nav
- contact section
- faq section
- business section
- locations
- footer
- floating CTA
- seo links block
- blog page frame
- money page breadcrumb / kicker

These are part of the redesign, not optional polish.

## Rule 12 - Mobile must stay first-class

Desktop Figma patterns must degrade cleanly:

- grids collapse
- hero stacks
- schedule remains readable
- floating CTA remains reachable
- footer collapses logically

No desktop-only solutions.

## Rule 13 - Homepage narrative order

Homepage should follow this order:

1. Hero
2. Courses
3. Why
4. Coaches
5. Pricing
6. Schedule
7. Testimonials
8. Locations
9. FAQ
10. Contact
11. Business
12. SeoLinks

Reason:

- fit and trust come before pricing detail
- objections are handled before main conversion
- business is secondary
- SEO/discovery support stays near the end

## Rule 14 - Why section density

Homepage `Why` section should show 4 visible differentiators, not 6.

If V2 needs more than 4 claims:

- keep the extra points in supporting copy
- or move them to FAQ / Business / deeper content

Do not surface 6 equal-weight differentiators on the homepage.
