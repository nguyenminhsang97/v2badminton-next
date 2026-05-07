# UI/UX Review — Issues, Solutions & Implementation Guide

Consolidated punch list from three reviews (manual + two Codex passes) covering layout bugs, accessibility, and design-system inconsistencies on `v2badminton-next`. Each item is self-contained: paste it into a session and an agent (or you) can fix it without further context.

> **Branch baseline:** `codex/fix-homepage-decision-flow` after the homepage decision-flow + footer-gap fixes have landed (PricingStrip top-level section, EnterpriseTeaser wrapped, footer absorbs floating-CTA clearance, body `padding-bottom: 88px` removed).

---

## Priority Legend

- **P1** — concrete bug, broken layout or focusable dead control. Fix first.
- **P2** — visible inconsistency, a11y semantic mismatch, or moderate UX impact.
- **P3** — polish, design-system tokenization, low-impact a11y improvements.

---

# Phase 1 — Real Bugs (P1)

## P1-01 · Contact form ignores its own `width: 760px` cap on desktop/tablet

**Issue.** `.contact-form-shell` declares `width: min(100%, 760px)` so the form is supposed to stay narrow and centered. But it lives inside `.home-page > .section > *`, which sets `width: min(var(--s5-width), calc(100% - 32px))` (1240px). Because both rules have the same specificity but the global rule is loaded later in the cascade for the `.home-page` context, the form expands to the full 1240px on desktop and 729px on tablet — visibly mismatched with the surrounding design.

**Files**
- `src/styles/components/support.css:260` — `.contact-form-shell` declaration
- `src/styles/base.css:90` — `.home-page > .section > *` width override

**Why it matters.** Contact form looks visually unbalanced and breaks the "narrow form, centered" pattern. Form fields stretch much wider than they should be for comfortable reading.

**Solution.** Increase specificity of the form-shell width rule so it wins inside the homepage section.

**Implementation**

1. Open `src/styles/components/support.css`.
2. Replace the existing `.contact-form-shell` width rule (line 260-268) with a more specific selector:

   ```css
   .contact-section .contact-form-shell {
     padding: 26px;
     border-radius: 28px;
     background: var(--s5-surface);
     border: 1px solid var(--s5-border);
     box-shadow: var(--s5-shadow);
     width: min(100%, 760px);
     margin: 0 auto;
   }
   ```

3. Keep the duplicate `.contact-form-shell { display: grid; gap: 20px }` block (line 270-273) — those rules are not affected.

**Verification**

- Desktop 1440 → measure `.contact-form-shell` rendered width with `getComputedStyle` or DevTools. Expected: 760px.
- Tablet 768 → measure: expected `min(100%, 760px)` ≈ 744px (after gutters), not 729 with no max.
- Mobile 390 → still fits (≈ 366px content width).

---

## P1-02 · Schedule rows force horizontal scroll between 768–959px

**Issue.** `.schedule-row, .schedule-table__head` keep `min-width: 760px` until the layout switches to a card variant at `max-width: 767px`. At 768–959px (tablet/iPad portrait, small laptops), the available content width is ~729px, smaller than the table min-width → the page shows a horizontal scrollbar inside the schedule.

**Files**
- `src/styles/components/schedule.css:274` (mobile rule starts here)
- Likely the original min-width is on `.schedule-row` near the top of the same file — search for `min-width: 760px`.

**Why it matters.** Tablet users get an unexpected horizontal scroll inside the schedule. Looks broken.

**Solution.** Switch the schedule from "table" to "card" layout at `max-width: 959px` instead of `767px`, OR drop the `min-width: 760px` and let the table reflow within the available container.

**Implementation (preferred — extend card layout up to 959px)**

1. Open `src/styles/components/schedule.css`.
2. Find the existing `@media (max-width: 767px)` block that converts rows to cards (around line 325+).
3. Change the breakpoint to `@media (max-width: 959px)`.
4. Verify no other `@media (max-width: 767px)` block needs the same bump — leave purely-mobile-specific rules (≤ 480px copy tweaks etc.) alone.

**Implementation (alternative — let table reflow)**

1. Find the rule with `min-width: 760px` on `.schedule-row` / `.schedule-table__head`.
2. Replace with `min-width: 0`.
3. Test that the table cells still read clearly at 768px; if columns crush, prefer the card-layout switch above.

**Verification**

- Resize browser to 768, 800, 900, 959 → no horizontal scrollbar inside schedule, no overflow indicator.
- Mobile 390 → still cards.
- Desktop 1024+ → still table.

---

## P1-03 · Schedule mobile has a redundant 108px bottom padding

**Issue.** `.schedule-section` (mobile) sets `padding-bottom: var(--floating-cta-clearance)` (≈ 108px). This was added because the floating CTA used to overlap the bottom of the section. After the recent fix (footer absorbs the CTA clearance via `padding-top: var(--floating-cta-clearance)`), this 108px is now dead space sandwiched between the schedule and the next section (FAQ).

**Files**
- `src/styles/components/schedule.css:274-278`

**Why it matters.** Mobile users see ~108px of empty space between schedule and FAQ — the same kind of bug that was just removed below the testimonials.

**Solution.** Remove the per-section CTA-clearance padding. The global `.home-page > .section { padding: 34px 0 }` (mobile) will then apply correctly.

**Implementation**

1. Open `src/styles/components/schedule.css`.
2. In the `@media (max-width: 959px)` block, delete the entire override:

   ```css
   .schedule-section {
     padding-top: 56px;
     padding-bottom: var(--floating-cta-clearance);
   }
   ```

3. Save. The global `.home-page > .section { padding: 34px 0 }` rule will handle vertical rhythm.

> **Note.** The schedule section is currently wrapped in a `<div>` (via `DeferredScheduleSection`), so it is *not* a direct child of `.home-page`. The global rule will not apply automatically. There are two options:
>
> - **Quick fix:** explicitly set `padding: 34px 0;` mobile and `56px 0;` desktop on `.schedule-section` to match peers.
> - **Better fix:** also unwrap the `<div>` in `DeferredScheduleSection.tsx` so `.schedule-section` becomes a direct child of `.home-page`. Then global rules apply.

**Verification**

- Mobile 390 → measure `.schedule-section` `padding-bottom`: expected `34px` (or whatever you set).
- Visual gap between schedule and FAQ on mobile should match gap between other sections (≈ 68px = 34 + 34).

---

## P1-04 · Footer mobile inner has 124px bottom padding (now redundant)

**Issue.** `.site-footer__inner` mobile sets `padding-bottom: 124px`. This was sized for the old layout where `body { padding-bottom: 88px }` plus a floating-CTA buffer required generous footer breathing room. After the recent fix that removed `body { padding-bottom }`, the 124px is excessive and makes mobile footer abnormally tall.

**Files**
- `src/styles/components/footer.css:196-201`

**Why it matters.** Footer feels disproportionately tall on mobile; copyright sits far below useful links.

**Solution.** Reduce inner bottom padding to a normal value (≈ 40px). The outer `.site-footer { padding-top: var(--floating-cta-clearance) }` already provides CTA clearance at the top of the footer — the bottom does not need the same allowance.

**Implementation**

1. Open `src/styles/components/footer.css`.
2. In the `@media (max-width: 959px)` block (around line 196), change:

   ```css
   .site-footer__inner {
     width: min(100%, calc(100% - 24px));
     padding-top: 28px;
     padding-bottom: 124px;
   }
   ```

   to:

   ```css
   .site-footer__inner {
     width: min(100%, calc(100% - 24px));
     padding-top: 28px;
     padding-bottom: 40px;
   }
   ```

**Verification**

- Mobile 390 → footer total height should be roughly: 108 (clearance) + 28 (inner top) + content + 40 (inner bottom) = content + 176. Compare to before: was content + 260.
- Copyright/legal links should sit close to the bottom of the page, not floating in mid-air.

---

## P1-05 · Static schedule fallback exposes dead controls

**Issue.** `StaticScheduleSection.tsx` (server-rendered fallback) renders `<button>` tabs and row controls before hydration. They have no `onClick` and do not respond to keyboard activation. Keyboard and screen-reader users can `Tab` to and "press" them with no result during the brief idle window.

**Files**
- `src/components/home/sections/StaticScheduleSection.tsx:103-197`

**Why it matters.** Real a11y bug — focusable, announced as a button, does nothing. Confuses keyboard and AT users.

**Solution.** Mark the fallback controls non-interactive until hydration: either render them as `<div role="presentation">`, or as `<button disabled aria-disabled="true">` with a visual hint, or hide them from the accessibility tree with `inert` (for browsers that support it).

**Implementation (recommended — disabled + aria)**

1. Open `src/components/home/sections/StaticScheduleSection.tsx`.
2. For every `<button>` rendered in the fallback (filter tabs, row CTAs):
   - Add `disabled`
   - Add `aria-disabled="true"` (redundant safety, also covers cases where you can't disable)
   - Add `tabIndex={-1}` to keep them out of the tab order
3. If the buttons currently use `role="tab"` / `role="tablist"`, *also* keep that markup but the disabled attribute will neutralize keyboard activation.
4. Optional: wrap the entire static fallback in a container with `aria-busy="true"` so screen readers announce "loading" instead of treating it as live UI.

**Implementation (alternative — non-interactive markup)**

1. Replace `<button>` tags with `<span>` + visual styles. Keep the existing CSS classes — visual unchanged.
2. After hydration, the dynamic `ScheduleSection.tsx` mounts and replaces these with real buttons.

**Verification**

- Disable JS in DevTools → reload → `Tab` through the schedule. The fallback controls should not receive focus, or if they do they should be disabled and announced as "dimmed/disabled".
- With JS enabled → after hydration, real ScheduleSection works as before.

---

# Phase 2 — Visible Inconsistencies & Semantic A11y (P2)

## P2-01 · Course card spacing micro-issues

**Issue.** A few small but visible inconsistencies in the homepage course cards:

1. `.course-card__body { padding: 20px 20px 22px }` — bottom 22px, top/sides 20px. 2px asymmetry without visual reason.
2. `.course-card__cta--primary { min-height: 52px }` vs `.course-card__cta--ghost { min-height: 44px }` — when stacked vertically (gap 10), the height difference is visible.
3. Media badge `inset-inline: 18px` vs body `padding: 20px` — 2px horizontal mismatch.
4. `.course-card__title { min-height: 2.3em }` reserves a 2nd line that current titles never use; cards look airy on top.

**Files**
- `src/styles/components/courses.css:106-110` (body padding)
- `src/styles/components/courses.css:215-232` (CTAs)
- `src/styles/components/courses.css:55-63` (media inset)
- `src/styles/components/courses.css:118-124` (title min-height)

**Solution & Implementation**

1. Body padding: change `padding: 20px 20px 22px` → `padding: 22px 20px` (or pick `20px` everywhere — the symmetric value matches the 18px media inset closely).
2. Match media inset to body padding: `inset-inline: 20px; top: 20px; bottom: 20px` so the visual rhythm is identical above and below the media boundary.
3. CTA height: align both to a single value, e.g. `min-height: 48px` for both. If you want primary to feel weightier, give it slightly heavier `padding-block` instead of taller min-height.
4. Title min-height: drop `min-height: 2.3em` (or reduce to `1.14em` for 1-line). Use grid auto rows on `.course-card` to keep all cards equal height naturally — `grid-template-rows: auto 1fr` on `.course-card` already does this.

**Verification**
- Cards in the homepage carousel should have equal heights with no visible top/bottom asymmetry.
- Stacked CTAs should look like a clean vertical stack with consistent button heights.

---

## P2-02 · Section vertical rhythm is ad hoc

**Issue.** Homepage section padding values vary by section — most are 56/56 (desktop) and 34/34 (mobile), but `schedule-section` is 74/82 desktop and 56/(108) mobile, `testimonials-section` is 80/80 desktop and 80/72 mobile.

**Files**
- `src/styles/base.css:82` (homepage rhythm)
- `src/styles/components/schedule.css:1-3`
- `src/styles/components/testimonials.css:5-12, 237-250`

**Solution.** Pick a 3-tier scale and apply consistently.

**Implementation**

1. Open `src/styles/tokens.css`. Add:

   ```css
   :root {
     --section-pad-y: 56px;
     --section-pad-y-compact: 40px;
     --section-pad-y-spacious: 80px;
   }
   @media (max-width: 959px) {
     :root {
       --section-pad-y: 34px;
       --section-pad-y-compact: 28px;
       --section-pad-y-spacious: 48px;
     }
   }
   ```

2. Open `src/styles/base.css`. Replace literal 56/34 with `var(--section-pad-y)`.
3. Open `src/styles/components/schedule.css`. Replace `padding-top: 74px; padding-bottom: 82px;` with `padding-block: var(--section-pad-y);`. Same in mobile block.
4. Open `src/styles/components/testimonials.css`. Replace 80/80 with `var(--section-pad-y-spacious)` (if you want testimonials to feel airy) or `var(--section-pad-y)` for full uniformity.
5. Also reset `.testimonials-section { gap: 56px }` (line 10) to match the 30/20px gap of other sections — or lift `--section-gap` into the tokens if you want a knob.

**Verification**
- Scroll the homepage on desktop and mobile. Adjacent sections should have visually equal vertical breaks.

---

## P2-03 · Container widths drift between routes

**Issue.** Five different "container" widths in use:
- Header inner: `1280px` ([nav.css:33](src/styles/components/nav.css:33))
- Homepage section: `1240px` (`--s5-width`)
- Footer inner: matches `--s5-width`
- Blog page: `1180px` ([blog.css:1](src/styles/pages/blog.css:1))
- Money pages: `1180px` ([money-page.css:1](src/styles/pages/money-page.css:1))
- Legal/narrow: `920px`

Logo and content edges visibly shift between routes.

**Solution.** Tokenize three container widths.

**Implementation**

1. In `src/styles/tokens.css` add:

   ```css
   :root {
     --width-site: 1280px;     /* nav, footer outer */
     --width-content: 1240px;  /* page content, sections */
     --width-narrow: 920px;    /* legal, long-form prose */
   }
   ```

2. Replace literal widths:
   - `nav.css:33` → `width: min(var(--width-site), calc(100% - 56px));`
   - `base.css:96` `.section { width: var(--s5-width) }` → keep `--s5-width` as alias of `var(--width-content)`, OR replace.
   - `footer.css` → `width: var(--width-site)` for inner shell to align with header.
   - `blog.css:1` and `money-page.css:1` → use `var(--width-content)` (and update gutter math).
   - Legal pages → `var(--width-narrow)`.

3. Decide on **one** gutter rule. Currently nav uses `calc(100% - 56px)`, sections use `calc(100% - 32px)`. Standardize:
   - Desktop ≥ 1280: 28px each side (matches nav 56 split).
   - Tablet 768–1279: 24px each side.
   - Mobile < 768: 16px each side.

**Verification**
- Visually align the logo's left edge across `/`, `/blog/`, `/chinh-sach-bao-mat/`. Should not jump horizontally as you navigate.

---

## P2-04 · Card radii / padding are not on a single scale

**Issue.** Across courses, pricing, testimonials, blog, forms, locations: radii range 14, 20, 22, 28, 30, 32; paddings 16, 20, 22, 26, 30. Similar card types feel unrelated.

**Files**
- `src/styles/components/pricing.css:9-12`, `127`
- `src/styles/components/courses.css:15-19`, `109`
- `src/styles/components/testimonials.css:108`
- `src/styles/pages/blog.css:58`
- `src/styles/components/coaches.css:114, 151, 221`

**Solution.** Define 3 card variants in tokens; replace one-off values gradually.

**Implementation**

1. In `src/styles/tokens.css`:

   ```css
   :root {
     --radius-card-sm: 16px;
     --radius-card-md: 24px;
     --radius-card-lg: 30px;
     --pad-card-sm: 16px;
     --pad-card-md: 20px;
     --pad-card-lg: 26px;
   }
   ```

2. Pick a variant for each card type and replace literals:
   - Course card → `lg` (30px radius, 22/20 padding) — current matches roughly.
   - Pricing summary item → `md` (24px radius, 20px padding) — was 20/17.
   - Testimonial card → `lg` (current 32 → 30).
   - Blog card → `md` (current 22).
   - Location card → `md`.

3. Do this gradually — don't blanket-replace. Each card visit is a small commit.

**Verification**
- Visually inspect homepage and blog. Cards should look like a family.

---

## P2-05 · Schedule filter buttons use tab semantics without tabpanels

**Issue.** Filter buttons are marked `role="tablist"` / `role="tab"`. Screen readers will announce them as "tab 1 of N" and expect a corresponding `tabpanel` plus arrow-key navigation. The implementation is actually a single-row filter with table content below, not a tabs widget.

**Files**
- `src/components/home/sections/ScheduleSection.tsx:234-255`

**Solution.** Use a segmented-button pattern with `aria-pressed`, OR implement full tabs with panels and keyboard handling.

**Implementation (recommended — segmented buttons)**

1. Remove `role="tablist"` from the wrapping element.
2. Remove `role="tab"` from each button.
3. Replace `aria-selected` with `aria-pressed`.
4. Remove `aria-controls` (no panel relationship needed).
5. Keep the visual styling (active/inactive) untouched — it's just the semantics that change.

**Verification**
- VoiceOver/NVDA should announce "button, pressed" / "button, not pressed" instead of "tab N of M".
- Arrow-key behavior is no longer expected; Tab / Shift+Tab navigation is correct.

---

## P2-06 · Carousel dots use tab semantics

**Issue.** `MobileDotCarousel.tsx` marks dots as `role="tab"` with `aria-controls` pointing at the track. The track is *not* a `tabpanel`. Same semantic mismatch as P2-05.

**Files**
- `src/components/ui/MobileDotCarousel.tsx:149-165`

**Solution.** Use carousel/navigation button semantics.

**Implementation**

1. Remove `role="tab"` and `role="tablist"`.
2. Remove `aria-controls` from each dot.
3. Add `aria-label` like `Slide ${i+1} of ${total}` to each dot button.
4. On the active dot, add `aria-current="true"` (or `aria-pressed="true"`).

**Verification**
- AT announces "button, slide 2 of 4, current" rather than "tab 2 of 4".

---

## P2-07 · Contact form select fields lack error-state ARIA

**Issue.** Text inputs in `ContactForm.tsx` render `aria-invalid` and `aria-describedby` linking to error messages. The `level`, `court`, `time_slot` `<select>` elements do not — even though they can fail validation.

**Files**
- `src/components/home/forms/ContactForm.tsx:364-430`

**Solution.** Mirror the text-input error pattern on each select.

**Implementation**

1. For each `<select>`, add:
   - `aria-invalid={!!errors.fieldName}` (boolean → string)
   - `aria-describedby={errors.fieldName ? "fieldname-error" : undefined}`
2. Render the matching error block:

   ```tsx
   {errors.level && (
     <p id="level-error" className="form-field__error" role="alert">
       {errors.level}
     </p>
   )}
   ```

3. Style `.form-field__error` (already exists for text inputs) — reuse.

**Verification**
- Submit the form with empty selects → AT should announce the error inline as it does for name/phone.

---

## P2-08 · Required fields lack `aria-required` / `required`

**Issue.** Name and phone are required (visually marked with `*`). The HTML `required` attribute and/or `aria-required="true"` are missing, so AT users only learn about the requirement after a failed submit.

**Files**
- `src/components/home/forms/ContactForm.tsx`

**Solution.** Add `required` (HTML5) and/or `aria-required="true"` to required inputs.

**Implementation**

1. On `<input name="name" />` and `<input name="phone" />`, add `required` and `aria-required="true"`.
2. Keep existing custom validation logic — `required` is just an a11y hint, browser native validation can co-exist or be `noValidate` on the form.

**Verification**
- AT announces "name, edit text, required" before user types.

---

## P2-09 · Testimonial context text low-opacity contrast

**Issue.** `.testimonial-card__context` uses a low-opacity color on the dark testimonial background. Likely below WCAG AA (4.5:1) for small text.

**Files**
- `src/styles/components/testimonials.css` — search for `.testimonial-card__context`

**Solution.** Raise opacity/lightness of the context text. Test contrast.

**Implementation**

1. Find `.testimonial-card__context { color: rgba(255, 255, 255, 0.X) }` (or similar).
2. Bump alpha to at least `0.84`, or replace with a solid `#dcecdc` / `#cfe6cf` and verify with a contrast checker against the testimonial gradient bg.
3. Aim for ≥ 4.5:1.

**Verification**
- Run Chrome DevTools "Inspect" on a testimonial context line → contrast indicator should pass AA.

---

# Phase 3 — Polish (P3)

## P3-01 · Money page mobile loses card framing

**Issue.** `.money-page__section--compact-list` mobile drops padding, border, radius, background, shadow. Blog/legal cards keep framing — money pages feel "loose" by comparison.

**Files**
- `src/styles/pages/money-page.css:206-215`

**Solution.** Keep a light card shell on mobile.

**Implementation**

1. In the mobile override, instead of zeroing out the framing, soften it:

   ```css
   @media (max-width: 767px) {
     .money-page__section--compact-list {
       padding: 16px;
       border: 1px solid var(--s5-border);
       border-radius: var(--radius-card-sm, 16px);
       background: var(--s5-surface);
       box-shadow: none; /* skip the heavy shadow on mobile */
     }
   }
   ```

**Verification**
- Mobile money pages now have visible card boundaries, matching blog/legal.

---

## P3-02 · Loading skeleton not announced

**Issue.** `app/(site)/loading.tsx` shows a skeleton but has no `role="status"` / `aria-live`, so screen readers receive a silent transition.

**Files**
- `src/app/(site)/loading.tsx:3-14`

**Solution.** Add live-region semantics.

**Implementation**

1. On the root element, add `role="status"` and `aria-live="polite"`.
2. Include visually hidden text: `<span className="sr-only">Đang tải nội dung trang…</span>` (Vietnamese to match site language).
3. Optionally set `aria-busy="true"` on the parent layout while loading.

**Verification**
- Trigger a route transition with a screen reader on; you should hear "Đang tải nội dung trang…" announced.

---

## P3-03 · Money hero alt duplicates `page.h1`

**Issue.** `MoneyPageTemplate.tsx` sets the hero image alt to the same string as the H1. Screen reader users hear the title twice.

**Files**
- `src/components/money-page/MoneyPageTemplate.tsx`

**Solution.** Use `alt=""` for decorative hero, or write a unique informative alt.

**Implementation**

1. If the hero image is decorative — `alt=""` and `role="presentation"`.
2. If it conveys info not in the H1 — write a short descriptive alt, e.g. `"Nhóm học viên tập cầu lông trong nhà"`.

---

## P3-04 · Form spacing scale lacks grouping tokens

**Issue.** `.contact-form-shell` gap 20, `.contact-form` gap 16, fields gap 8, actions gap 12; nested optional area adds 16. No clear field/group/form scale.

**Files**
- `src/styles/components/support.css:260, 304, 413`

**Solution.** Introduce form spacing tokens.

**Implementation**

1. Tokens:
   ```css
   :root {
     --space-form-field: 8px;
     --space-form-group: 16px;
     --space-form-shell: 24px;
     --space-form-actions: 16px;
   }
   ```
2. Replace literals in support.css.

---

## P3-05 · Why-section 2-column may crush at <390px

**Issue.** `.why-section__stats` stays 2-column on all mobile widths. With longer Vietnamese stat labels at 360–375px, cards may look cramped.

**Files**
- `src/styles/components/why.css:155`

**Solution.** Allow 1-column collapse at narrow widths.

**Implementation**

```css
.why-section__stats {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr));
}
```

---

## P3-06 · Blog grid uses raw `minmax(320px, 1fr)`

**Issue.** Safe on tested widths but vulnerable below 344px content (e.g. embedded browsers).

**Files**
- `src/styles/pages/blog.css:52`

**Solution.** Wrap min in `min(100%, 320px)`.

**Implementation**

```css
.blog-grid {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
}
```

---

## P3-07 · Global `overflow-x: clip` hides real overflow

**Issue.** `html, body, .app-shell` all use `overflow-x: hidden/clip`. Hides legitimate overflow during QA.

**Files**
- `src/styles/base.css:7`

**Solution.** Keep clipping at component level where needed (hero gradients, etc.); avoid the global rule, OR add an audit toggle.

**Implementation (audit toggle)**

```css
:root[data-audit] .app-shell,
:root[data-audit] body {
  overflow-x: visible !important;
}
```

Then `document.documentElement.dataset.audit = '1'` in DevTools to test.

---

## P3-08 · Document "no Tailwind" convention

**Issue.** Project uses CSS modules + global tokens, no Tailwind. Future agents may default to Tailwind utility classes.

**Files**
- `AGENTS.md` or new `docs/ui-conventions.md`

**Solution.** Add a one-paragraph note:

```md
## Styling
- No Tailwind. Use plain CSS in `src/styles/**` with BEM-ish class names.
- Tokens live in `src/styles/tokens.css`. Prefer tokens over magic numbers.
- Components import their CSS from `src/styles/components/<name>.css` via the global stylesheet.
```

---

# Tracking

| ID | Title | Priority | Phase | Done |
|---|---|---|---|---|
| P1-01 | Contact form 760px override | P1 | 1 | ☐ |
| P1-02 | Schedule horizontal scroll 768–959 | P1 | 1 | ☐ |
| P1-03 | Schedule mobile 108px dead space | P1 | 1 | ☐ |
| P1-04 | Footer mobile 124px excess padding | P1 | 1 | ☐ |
| P1-05 | Static schedule fallback dead controls | P1 | 1 | ☐ |
| P2-01 | Course card spacing micro-issues | P2 | 2 | ☐ |
| P2-02 | Section vertical rhythm tokens | P2 | 2 | ☐ |
| P2-03 | Container widths tokens | P2 | 2 | ☐ |
| P2-04 | Card radii/padding tokens | P2 | 2 | ☐ |
| P2-05 | Schedule filter tab semantics | P2 | 2 | ☐ |
| P2-06 | Carousel dot tab semantics | P2 | 2 | ☐ |
| P2-07 | Contact form select aria | P2 | 2 | ☐ |
| P2-08 | Required field aria-required | P2 | 2 | ☐ |
| P2-09 | Testimonial context contrast | P2 | 2 | ☐ |
| P3-01 | Money page mobile card framing | P3 | 3 | ☐ |
| P3-02 | Loading skeleton role=status | P3 | 3 | ☐ |
| P3-03 | Money hero alt duplication | P3 | 3 | ☐ |
| P3-04 | Form spacing tokens | P3 | 3 | ☐ |
| P3-05 | Why-section narrow mobile | P3 | 3 | ☐ |
| P3-06 | Blog grid minmax safety | P3 | 3 | ☐ |
| P3-07 | Global overflow-x audit toggle | P3 | 3 | ☐ |
| P3-08 | Document "no Tailwind" | P3 | 3 | ☐ |

---

# How to Apply

Recommended order:
1. **Phase 1 in one PR** — five small fixes, low risk, clear bug fixes. Verify on desktop 1440 + tablet 768 + mobile 390 before merging.
2. **Phase 2 in 2-3 PRs** — group by theme (a11y semantics, design tokens, card cleanup). Each needs its own regression check.
3. **Phase 3 ad-hoc** — pick up between feature work.

For each PR:
- Run dev server (`npm run dev`) and check homepage, /blog/, /huan-luyen-vien/, /chinh-sach-bao-mat/ at 390, 768, 1280, 1440.
- Run any existing tests.
- Use Lighthouse / axe-core for a11y phases.
