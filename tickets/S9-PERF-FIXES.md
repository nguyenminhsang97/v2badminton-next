## Finding 1: Degraded money-page routes are causing the CLS hard fail
- Evidence: `/lop-cau-long-tre-em/` and `/lop-cau-long-cho-nguoi-di-lam/` both measured `CLS = 0.276` in Lighthouse. The browser trace showed a single late layout shift around `4.0s` with shift value about `0.231`, where `footer.site-footer` moved from `0x0` to roughly `375x233` after the page swapped out of the loading shell.
- Root cause: `src/app/(site)/lop-cau-long-tre-em/page.tsx:8-16` and `src/app/(site)/lop-cau-long-cho-nguoi-di-lam/page.tsx:8-16` opt into `degradedMetadataMode: "route"`. `src/components/money-page/publishedMoneyPageRoute.tsx:53-57` then calls `notFound()` whenever the Sanity read is degraded, so the route streams `loading.tsx` first and later swaps to `not-found.tsx`.
- Fix: Render a stable money-page fallback for degraded reads instead of routing through `notFound()`, or reserve the same content height until fallback content is ready.
- Est impact: `CLS -0.23 to -0.28` on both failing routes, with a likely `Perf +8 to +15`.
- Risk: low
- Effort: S

## Finding 2: The same degraded route path is also a likely contributor to the TBT outlier on `/lop-cau-long-cho-nguoi-di-lam/`
- Evidence: The TBT trace for `/lop-cau-long-cho-nguoi-di-lam/` showed long tasks of `396ms` and `190ms` on `/_next/static/chunks/0-kl82fo5g~hb.js`, `212ms` on the document URL, `59ms` unattributed, and `58ms` on `/_next/static/chunks/0ruwevyj34u6i.js`. The comparison route `/hoc-cau-long-cho-nguoi-moi/` had the same shared baseline (`393ms` shared chunk, `212ms` document) but did not pay the extra `190ms + 58ms`.
- Root cause: `src/components/money-page/publishedMoneyPageRoute.tsx:53-57` sends the route down the degraded `notFound()` path, and the extra `0ruwevyj34u6i.js` task maps to the global error/not-found path (`src/app/global-error.tsx` in the route manifest). That means the hard-fail route is doing recovery work on top of the already-heavy shared runtime.
- Fix: Remove the degraded `notFound()` path first, then rerun the trace before touching lower-priority micro-optimizations on this page.
- Est impact: `TBT -120 to -220ms` on `/lop-cau-long-cho-nguoi-di-lam/`, with a likely `Perf +10 to +20`.
- Risk: low
- Effort: S

## Finding 3: Sitewide first-load JS is dominated by shared runtime, Sentry, and layout-level client chrome
- Evidence: First Load JS is `917.6 kB` on `/` and `878.6 kB` on each money page. The largest first-load-relevant shared chunks are `0-kl82fo5g~hb.js` (`203.7 kB`, ReactDOM/runtime), `0h4md_42-o-ef.js` (`200.2 kB`, `@sentry/nextjs`), `0f69nhj0gkii_.js` (`142.7 kB`, shared framework/runtime), and `0shdor8wid~3~.js` (`52.9 kB`, more Sentry/runtime glue). The very large overall chunks (`00axj-~eic6e~.js` at `4.34 MB`, `12ob37.p7jm4k.js` at `1.30 MB`, `0i.noqz~xmmca.js` at `543.5 kB`, `0k0izk1f_upwv.js` at `396.8 kB`) appear to be Studio/Sanity/Mux-related, but they are not in the entry chunks for homepage or money pages.
- Root cause: `src/instrumentation-client.ts:1-11` eagerly initializes `@sentry/nextjs` on every route. `src/app/(site)/layout.tsx:2-25` also always includes client chrome (`Nav`, `FloatingCta`, `TrackingBootstrap`) across the whole site, so every landing route pays that baseline before route-specific UI is added.
- Fix: Reduce layout-level client islands and gate or slim browser-side Sentry/tracking so more of the chrome can stay server-rendered.
- Est impact: `LCP -0.30s to -0.70s` and `TBT -80ms to -180ms` across all five audited routes.
- Risk: medium
- Effort: M

## Finding 4: Homepage-specific client islands are stacked into first load instead of being deferred
- Evidence: The homepage adds route-specific chunks `033~6i0mt~06d.js` (`43.9 kB`) and `0ne.co1gdfoo..js` (`14.6 kB`) on top of the shared baseline. The route manifest maps those chunks to `HomepageConversionProvider`, `HomepageScrollCoordinator`, `ContactForm`, `CourseSection`, `HeroCtas`, `ScheduleSection`, and `TestimonialsSection`. Lighthouse measured homepage `LCP = 3.62s` and `Perf = 87`.
- Root cause: `src/app/(site)/page.tsx:94-120` renders the conversion provider, contact form, schedule table, testimonials, and other interactive sections directly in the initial route tree, so the homepage pays for below-the-fold islands up front.
- Fix: Lazy-load or split the below-the-fold interactive sections, especially the contact/schedule/testimonial stack, so the hero path stays lighter.
- Est impact: homepage `LCP -0.40s to -0.90s` and `Perf +3 to +8`.
- Risk: medium
- Effort: M

## Finding 5: Money pages pay a client-bundle tax for `PricingCards` mainly to read pathname and fire tracking
- Evidence: Every money page adds `13w9w0yfwf1h3.js` (`18.6 kB`) on top of shared route chunks, and the route manifest maps that chunk almost entirely to `src/components/blocks/PricingCards.tsx` plus `next/link` and `next/image`. The "healthy" money pages still landed at `TBT = 244ms` and `255ms`, which suggests this island is part of the remaining non-critical TBT baseline even before the degraded route issue is fixed.
- Root cause: `src/components/blocks/PricingCards.tsx:1-18` marks the entire pricing grid as `use client`, and `src/components/blocks/PricingCards.tsx:327-340` calls `usePathname()` to derive tracking metadata. `src/components/money-page/MoneyPageTemplate.tsx:139-150` then pulls that client island into every money page.
- Fix: Make pricing cards server-rendered and pass `pageType/pagePath` from the parent (or use plain anchors with tracking data attributes) so the cards do not need to hydrate just to know the current pathname.
- Est impact: `TBT -20ms to -70ms` and `LCP -0.10s to -0.30s` across money pages.
- Risk: low
- Effort: S/M
