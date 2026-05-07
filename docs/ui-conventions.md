# UI Conventions

Short reference for anyone editing UI code in this repo.

## Styling

- **No Tailwind.** This project uses plain CSS in `src/styles/**` with BEM-ish class names (`block__element--modifier`). Do not introduce Tailwind utility classes.
- **Tokens live in `src/styles/tokens.css`.** Prefer tokens over magic numbers. Existing scales:
  - Containers: `--width-site` (1280, nav/footer outer), `--width-content` (1240, body), `--width-narrow` (920, legal). `--s5-width` is an alias of `--width-content` for backward-compat.
  - Section rhythm: `--section-pad-y` (56/34), `--section-pad-y-spacious` (80/48), `--section-pad-y-compact` (40/28), `--section-gap` (26/16).
  - Cards: `--radius-card-sm/md/lg/xl` (16/22/28/32) and `--pad-card-sm/md/lg` (16/20/24).
  - Form spacing: `--space-form-field/group/shell/actions` (8/16/20/16).
  - Legacy radii `--s5-radius-md/lg/xl` (18/24/32) are still used in a few places — prefer the `--radius-card-*` scale for new card work.
- **Component CSS** lives at `src/styles/components/<name>.css` and is loaded via the global stylesheet (no CSS Modules in this codebase).
- **Mobile-first when reasonable**, but most existing CSS uses `min-width` desktop blocks with `max-width: 959px` mobile overrides. Match the surrounding pattern.

## Class naming

- Block: `course-card`
- Element: `course-card__title`
- Modifier: `course-card--featured` or `course-card__cta--primary`
- Avoid utility-style classes (e.g. `mt-4`, `text-sm`). Prefer a descriptive class with the spacing/typography baked in.

## Accessibility

- Required form fields use `required` and `aria-required="true"`. Forms use `noValidate` so HTML5 native validation does not pop up — rely on the custom validation pipeline.
- Error states expose `aria-invalid` plus `aria-describedby` pointing to a unique error message ID.
- Tab/tablist semantics are reserved for true tabs+tabpanels. For segmented buttons or filter groups, use `role="group"` + `aria-pressed` on each button. For carousel dots, use plain `<button>` + `aria-current="true"` on the active dot.
- Loading skeletons should announce themselves with `role="status"` + `aria-live="polite"` + `aria-busy="true"` and a screen-reader-only label (`.u-sr-only`).
- Decorative images use `alt=""` plus `aria-hidden="true"` on the wrapper. Informative images need a unique descriptive alt — never duplicate the page H1.
- Touch targets ≥ 44×44px (use `var(--touch-target-min)`).

## Responsive testing

Spot-check at these widths after any layout-affecting change:

- 360px / 390px (small mobile)
- 768px (tablet portrait)
- 900px (small laptop)
- 1280px / 1440px (desktop)

Manually scan for horizontal overflow (`document.documentElement.scrollWidth > window.innerWidth`). Use the audit toggle if global `overflow-x: clip` is hiding it:

```js
document.documentElement.dataset.audit = "1";
```

Remove the attribute to restore production behavior.

## Out-of-scope conventions for this doc

- Component file structure, route patterns, data fetching: see `AGENTS.md`.
- Sprint-by-sprint UI fixes: see `docs/ui-review-fixes.md`.
