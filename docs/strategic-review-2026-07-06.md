# V2 Badminton — Strategic Review & Long-Term Direction

Date: 2026-07-06 · Companion to `docs/architecture-review-2026-07-06.md` (technical findings; referenced here as "AR §n" without repeating them). No code changes made.

---

## 1. My understanding of the current project direction

This is a **parallel rebuild** of a live HTML site, migrating route-by-route with SEO parity as a hard constraint, on top of Next 16 + Sanity in an npm-workspaces monorepo. The strategy documents show a deliberate sequence:

1. **Conversion parity first** (schedule→form prefill, GA4/GTM semantics, lead pipeline) — done.
2. **30-day SEO/AEO plan** — crawl hygiene, money-page content, schema enrichment, About page, placeholder-content removal. Largely done and encoded into code behavior (sitemap gating, noindex fallbacks, fail-safe 404s).
3. **CMS migration** — money pages, catalog data, static pages, homepage content into Sanity, with hardcoded fallbacks retained. Done.
4. **Content platform Phase 1** — hub/node/article/court with fullPath routing, seeded with `ky-thuat-cau-long` and courts. Built.
5. **Deferred: blog launch** at `/blog/<category>/<slug>/` per the approved taxonomy memo (5 categories), Gate B Studio split to `apps/studio` + `cms.v2badminton.com`, coach detail pages, review policy page.

The business model is clear and correct: **money pages are the hub; everything else is spokes** that capture informational/local/equipment intent and route readers to money pages. The site sells badminton coaching in Bình Thạnh/Thủ Đức; content exists to feed that funnel and build topical authority for future verticals.

**One structural observation:** the project has accumulated three generations of content strategy — (a) the blog memo (post + category enum, `/blog/<category>/<slug>/`), (b) the content platform (hub/node/article/court, fullPath routing), and (c) the future-verticals ambition (rackets, shoes, accessories, news, community, tools, reviews). Generations (a) and (b) **overlap and partially contradict each other**, and this is the single most important strategic decision to resolve before scaling (§7.1).

---

## 2. What the project is doing correctly

Condensed — full technical detail in AR §1.

- **SEO discipline is encoded in code, not in a checklist**: sitemap gating on published content, noindex-when-empty, fail-safe 404 over thin fallback, stable lastmod, trailing-slash + canonical consistency, env-gated indexing. This is rare and is the project's biggest asset.
- **The content platform is the right chassis**: exact-match fullPath resolution, global uniqueness validation, reserved prefixes, per-id cache tags, E-E-A-T fields already on `content_article` (authorKind, reviewer, lastReviewed), `quickAnswer` for AEO, typed `court` facts. `court` proves the "typed vertical doc under a hub" pattern that rackets/shoes/accessories should copy.
- **Caching/revalidation architecture** (tag ISR + signed webhooks + revalidationMap) is correct for this scale and for 10× this scale.
- **Decision hygiene**: locked specs, decision memos with option tables, documented rejections (audience categories, `llms.txt`, AI-only files, competitor comparisons). The "no placeholder is indexable" and "schema must match visible content" execution rules are exactly right.
- **Studio UX investment** is well beyond typical: Vietnamese desk, badges, SERP preview, dashboards, singleton guards.
- **Security/lead pipeline**: layered anti-spam, secrets hygiene, gated debug routes (AR §1, §2 R7).

---

## 3. What is risky, weak, or not scalable

Ranked by expected damage, not by effort.

**3.1 The blog memo and the content platform now compete for the same intents.** The memo (approved, May 2026) assigns `ky-thuat`, `thiet-bi`, `san-tap` to blog categories under `/blog/…/`. Since then, the content platform shipped: `ky-thuat-cau-long` exists as a **hub**, courts exist as **typed docs with their own URLs**, and equipment reviews are the obvious next typed vertical. If the blog launches as specified, you will have two homes for the same query classes (e.g. a `san-tap` blog post vs a `court` doc; a `thiet-bi` review post vs a future racket-review article). The memo itself flags cannibalization as the top risk of its own `san-tap` category. This is a strategy fork that must be resolved on paper before any blog work starts (§7.1).

**3.2 URL-change safety is missing** (AR R2/R3). One hub rename can strand a subtree with no redirects; file-routed pages have no CMS redirect coverage at all; no `proxy.ts`/`redirects()` exists. This is the biggest *irreversible-damage* risk in the repo today: rankings lost to unredirected 404s are not recoverable on any useful timescale.

**3.3 No draft preview** (AR R1). Acceptable at current team size, unacceptable the day a non-technical editor owns money pages — which is precisely the "100% CMS" ambition.

**3.4 Fallback-content drift** (AR R4). ~800 lines of hardcoded pricing/schedule/FAQ/location mirrors that can silently serve wrong prices. As CMS becomes the source of truth, every month these fallbacks age they get more dangerous, not less.

**3.5 Scaling friction in the money-page layer.** 13 near-identical route folders + `routes.ts` metadata duplication means every new money page is a code deploy touching 3–4 files (AR D1). Fine at 13; painful at 30.

**3.6 Knowledge base is partially outside the repo.** `MASTERPLAN.md` and `NEXTJS_MIGRATION_PLAN.md` are named as source-of-truth in README but do not exist in the repo; the locked CMS specs live in gitignored `.claude/CMS/` (AR R6). The strategy is currently unrecoverable from a fresh clone.

**3.7 Test coverage does not protect the SEO behavior that makes this site valuable** (AR R5). Four unit tests; zero coverage of sitemap/canonical/robots/JSON-LD.

**3.8 Monolith growth points**: `queries/shared.ts` (949 lines), `schema.ts` (732), `court.ts` (684). Not a problem today; will become the bottleneck file-conflict zone exactly when multiple verticals are added (AR D2).

**3.9 Community/UGC ambition has no safe landing zone.** Nothing in the stack (Sanity editorial CMS, no auth, no moderation) supports user-generated content. If attempted naively it would be both a security and an SEO-quality incident (§9.6).

---

## 4. What direction the project should follow from now on

**Continue the current direction — it is fundamentally healthy — with one consolidation decision and a guardrails-before-growth rule.**

The consolidation decision: **declare the content platform the single home for all evergreen informational/local/equipment content, and shrink the blog's role to news/announcements only.** Concretely:

- `ky-thuat` content → articles under the existing `ky-thuat-cau-long` hub (already live).
- `san-tap` content → `court` docs + articles under a courts hub (already built for this).
- `thiet-bi` content → a future equipment hub with typed product docs + review articles (§8.3).
- `tin-v2` (news, events, announcements) → this is the only intent that genuinely fits a chronological blog. Keep the `post` type for it.
- The blog memo's *strategic* content (intent map, cannibalization boundaries, indexing thresholds, redirect hygiene, affiliate disclosure rules) remains valid and should be re-attached to the content platform instead of `/blog/`.

Why this and not the memo's `/blog/<category>/<slug>/` plan: the memo was written before the content platform existed (its "codebase findings" section predates hub/node/article). The platform has strictly better SEO machinery than the blog route ever will — hierarchical URLs with topical signal, hub portals as archive pages, E-E-A-T author/reviewer fields, quickAnswer, relatedMoneyPage edges, per-id revalidation, isIndexed control. Running both systems means duplicate homes, split internal-link equity, two schemas to maintain, and an editor decision ("is this a post or an article?") that will be answered inconsistently. The memo's own clean-cutover finding (zero/near-zero production posts) makes this consolidation nearly free **today** and expensive after the first 20 posts are published.

The guardrails-before-growth rule: no new verticals, no blog launch, no content-volume push until P0 (§12) is done — slug-change safety, redirect layer, SEO regression tests, committed specs. Every P0 item exists to make the later growth non-destructive.

---

## 5. What should be improved first, and why

In order (this is the P0 rationale; the full roadmap is §12):

1. **Route-change guardrails** — because it is the only current gap that can cause irreversible SEO loss from one editor action (AR R2/R3). Everything else is recoverable; lost indexed URLs are effectively not.
2. **Commit the knowledge base** (specs, masterplan) into `docs/` — because every subsequent decision (including this review) depends on specs that currently exist on one machine. One hour of work.
3. **SEO regression test suite** — because P1/P2 involve heavy refactors (blog consolidation, metadata CMS-first, monolith splits) and you must not do those against an untested SEO surface.
4. **Resolve the blog-vs-platform fork on paper** (one-page addendum to the memo) — because content production is blocked on it, and every week it stays unresolved invites someone to start publishing into the wrong system.
5. **Draft preview** — because it unblocks the actual goal of "100% CMS": non-technical editors shipping content safely.
6. **Fallback drift strategy** — because wrong prices are a business-trust incident waiting for a Sanity outage to trigger it (AR R4).

---

## 6. What should be avoided (SEO / production stability)

- **Do not migrate money pages into the catch-all.** The locked spec's Decision 1 (money pages keep frozen file routes; hubs link out to them) is correct. These URLs rank and convert; a routing migration buys zero user value and carries redirect/regression risk. Reduce their *boilerplate* (§10.2), never their *URLs*.
- **Do not launch `/blog/<category>/<slug>/` as specified in the memo** before resolving §7.1. Launching it creates the duplicate-home problem permanently.
- **Do not "clean up" URL structure, trailing slashes, or canonical logic.** (AR §5 — full list of protected behaviors.)
- **Do not enable index for content-platform hubs/nodes with thin content.** The `isIndexed` toggle plus the memo's archive-indexing thresholds (≥5 strong docs + sustained cadence) should govern hub indexing too. Empty hub portals in the index would damage the domain's quality signals exactly when you're trying to build topical authority.
- **Do not add `AggregateRating`/star schema to reviews** without a verifiable third-party source (execution rule 5 — keep enforcing it for the future reviews vertical, where the temptation will be strongest).
- **Do not attempt UGC/community with the current stack** (§9.6).
- **Do not enforce the CSP without analyzing report-only data**, and do not skip the narrowing step (AR D6).
- **Do not upgrade Next majors or restructure the monorepo mid-content-push.** Batch platform risk into quiet windows.

---

## 7. Recommended solutions for the biggest problems

**7.1 The content-system fork (blog vs platform).**
Options: (A) implement the memo as written — nested blog categories carry all five intents; (B) full consolidation — kill `post`, everything becomes `content_article`, news lives under a hub; (C) split by nature of content — platform owns evergreen (`ky-thuat`, `san-tap`, `thiet-bi`, `nguoi-moi` decision-support), blog/`post` owns only time-stamped news (`tin-v2`).
Tradeoffs: (A) preserves an approved memo but builds a parallel system with worse machinery and guaranteed cannibalization pressure; (B) is conceptually cleanest but forces news/announcements into a hierarchy they don't need, loses the simple chronological feed, and requires migrating the `post` schema for no gain; (C) keeps each system doing what it's structurally best at, requires only a one-page memo addendum, and matches what the code already implies (posts have `category: campaign/tips…` news-ish enum; articles have E-E-A-T and money-page edges).
**Recommendation: (C).** Write a memo addendum mapping each old category to its new home, keep `/blog/` as the news feed (or rename to `/tin-tuc/` — only do this before launch, never after), keep its conditional-noindex behavior, and delete the `/blog/<category>/<slug>/` migration deliverable from the CMS handoff brief.

**7.2 URL-change safety.**
Options: (A) process-only (runbook: create redirect, then rename); (B) lock `fullPath` after first publish + rename runbook; (C) full automation (document action that regenerates subtree paths and creates redirects atomically).
Tradeoffs: (A) is free but guaranteed to be violated eventually; (C) is the best UX but is a multi-day build with transaction edge cases (Sanity has no cross-document transactions — a half-applied subtree rename is worse than a blocked one); (B) is ~a day of work using the existing `FullPathPreviewInput`, converts the dangerous action into a deliberate one, and doesn't preclude (C) later.
**Recommendation: (B) now, (C) only when hubs exceed ~50 child docs.** Plus, independently: a `redirects()` source for file-routed pages — either a small static list in `next.config.ts` or a build-time fetch of `route_redirect` docs. Static list first; it changes rarely and avoids a build-time Sanity dependency.

**7.3 Draft preview.**
Options: (A) Presentation tool with live edit + overlays; (B) plain draft-mode route (`/api/draft-mode/enable` + `perspective: "drafts"` behind `draftMode()`); (C) keep publish-blind.
Tradeoffs: (A) is the flagship experience but couples Studio and web app versions and adds config surface right before the Gate B studio split; (B) is small, uses a separate viewer-token path, achieves the safety goal (see before publish), and survives the Gate B split unchanged; (C) is what you have — acceptable only while editors are also the developers.
**Recommendation: (B) now; evaluate (A) after Gate B** when Studio lives on its own domain and the Presentation config can be done once, properly. Non-negotiables either way: separate `SANITY_API_VIEWER_TOKEN` used only inside draft mode, preview responses `noindex` + `Cache-Control: no-store`, and the published-only public path untouched (AR §5).

**7.4 Fallback drift.**
Options: (A) generate fallback modules from a committed snapshot of production Sanity + CI staleness check; (B) fail closed (hide section + alert) like money pages already do; (C) status quo.
**Recommendation: (B) for anything with numbers (pricing, schedule); (A) for structural content (FAQs, locations) where a stale answer is tolerable and layout collapse is not.** Delete `homepage-testimonials.fallback.ts` outright — testimonials have zero correctness constraints and an empty section is fine.

**7.5 Money-page scaling.**
Keep URLs and file routes; extract a factory: `createMoneyPageRoute({ slug, path, district? })` returning `generateMetadata` + the page component, so a new money page is one 10-line file + one Sanity doc. Move title/description authority fully to Sanity (`metaTitle` required — the readiness badge already exists), demote `routes.ts` to nav labels + fallback-of-last-resort, and derive the sitemap's money-page set from one registry instead of `ALWAYS_INDEX_PATHS` + comments (AR D3).

**7.6 Knowledge base.**
Move `.claude/CMS/*.md` specs, MASTERPLAN, and migration plan into `docs/` (or confirm the latter two are dead and update README). Add a repo rule: any doc code comments cite must be tracked.

---

## 8. Recommended CMS / content architecture going forward

**8.1 One platform, typed verticals.** The target document model:

- `content_hub` — one per vertical: kỹ thuật (live), sân tập, thiết bị, and later tin tức if news ever outgrows the flat feed.
- `content_node` — sub-topics within hubs (e.g. thiết bị → vợt / giày / phụ kiện). Nodes are the scaling mechanism; new verticals should not require new route code.
- `content_article` — all evergreen prose, discriminated by `contentFormat` (extend the enum per milestone as planned: `product_review`, `news`, `video` — additive, never repurposed).
- **Typed fact docs for entities**: `court` (exists), and for equipment a new `product` doc (brand, model, specs, price range, image) **separate from the review article**. Rationale: one product will be referenced by many articles (single review, roundups, "best under 1M"), and facts must update in one place. This differs from `court` (facts+review in one doc) deliberately — a court is reviewed once by V2; a racket appears in many pieces. Copy the `court` schema conventions (groups, status, isIndexed, fullPath only if products get pages — initially they should NOT have their own URLs; articles render them inline).
- `post` — news/announcements only (§7.1). Do not extend it; it stays deliberately simple.
- `tool` (later, P2) — metadata doc (title, slug under a hub, seo fields, quickAnswer) + a `componentKey` string that maps to a code registry of interactive React components. Tools are code releases with CMS-managed metadata; do not attempt CMS-composed interactivity.

**8.2 "100% CMS" — redefine the target.** The right target is: **every word an editor might change monthly is CMS-managed; route topology and interactive behavior stay in code.** You are ~80% there. Close the rest in this order: money-page metadata CMS-first (§7.5) → retire content fallbacks (§7.4) → nav labels/order into `site_settings` → legal/static page bodies already covered by `static_page` (finish adoption). Do **not** chase CMS-managed layouts/page-builders (block-based page composition). That direction trades your biggest strength — a strictly typed, validated content model that produces consistent SEO output — for editor flexibility you don't need at a 2-district coaching business, and it is the classic road to unmaintainable Sanity projects.

**8.3 Editorial workflow model.** Keep `status` (draft/published) + Sanity drafts as-is; the two-layer model (document drafts for WIP, `status` for business state) is working. When preview ships, add a third state implicitly: previewable. Resist adding scheduled publishing until a real need appears (it complicates revalidation and the webhook path).

---

## 9. Recommended SEO / AEO / content hub strategy going forward

**9.1 Hub sequencing — authority first, monetizable adjacency second:**
1. Finish **kỹ thuật** depth (active-student + prospective-student intents; lowest cannibalization risk; feeds 1-kèm-1 money page).
2. **Sân tập** courts hub (local SEO surface; feeds location money pages; `court` machinery already built — cheapest win).
3. **Thiết bị** (rackets → shoes → accessories as nodes, not separate hubs; product+review model per §8.1; requires `chinh-sach-danh-gia` disclosure page first — it's already planned).
4. **Tin tức** stays a flat feed until cadence is proven (the memo's ≥2 posts/month for 6 months gate is right — keep it).
5. **Tools** after thiết bị has traffic (tools amplify existing clusters; a racket-picker quiz inside a thin equipment hub is wasted).
6. **Community/reviews-by-users: not on this stack** (§9.6).

**9.2 Internal linking as a system, not a habit.** The edges already exist (`relatedMoneyPage`, `relatedFaqs`, hub/node hierarchy, `ARTICLES_BY_MONEY_PAGE_QUERY` reverse lookup). Add one rule to the editorial checklist: every article sets `relatedMoneyPage`; every money page renders its reverse-linked articles (already implemented). That closed loop — money page ↔ supporting articles — is the whole hub-and-spoke strategy in one edge. Consider a Studio badge for "article missing relatedMoneyPage".

**9.3 Indexing thresholds.** Apply the memo's archive gates to hubs/nodes: a node stays `isIndexed: false` until it has ≥4–5 strong children. The dashboard should surface "indexable but thin" as a warning state.

**9.4 AEO.** Current approach (quickAnswer + FAQ schema + answer-first writing + AI crawlers allowed + no fake AI files) is correct and ahead of most sites. Extend, don't invent: keep `quickAnswer` mandatory-by-badge on new verticals; ensure product/court facts render as visible HTML tables (extractable), matching schema. Skip speakable/llms.txt per your own execution rule 7 — it has aged well.

**9.5 E-E-A-T.** `authorCoach`/`reviewer`/`lastReviewed` on articles is the right structure. For the thiết bị vertical, reviews signed by a named coach with a visible profile are your differentiation against retailer content — prioritize coach detail pages (`/huan-luyen-vien/<slug>/`) **before** scaling equipment reviews (the memo defers them until ≥6 coaches; consider lowering to the 2–3 coaches who will author reviews).

**9.6 Community.** If community content matters commercially, the safe versions on this stack are: curated student stories as articles, moderated testimonials (exists), or an off-site community (FB group, already linked) with recap articles on-site. Open UGC (comments, forums, user reviews) requires auth, moderation queues, spam defense, and `ugc` link attributes — a different product. Never index UGC on day one anywhere.

---

## 10. Recommended technical architecture going forward

**10.1 Keep:** Next App Router + tag-based ISR + signed webhook revalidation; `useCdn: false`; monorepo with `schema-shared`; Vercel; Sentry; the lead pipeline. None of these need rethinking for 10× content volume.

**10.2 Change (in P1/P2):** money-page factory (§7.5); split `queries/shared.ts` by domain (`queries/content.groq.ts`, `queries/catalog.groq.ts`, …) and `schema.ts` by schema type, mechanically, behind the test suite; add `proxy.ts` (Next 16 middleware) only if redirect volume outgrows `next.config.ts` `redirects()` — static config is faster and cacheable, proxy is flexible; prefer static until you have >~50 dynamic redirects or need per-request logic.

**10.3 Gate B (studio split to `apps/studio` + `cms.v2badminton.com`).** Proceed as planned, after preview ships. Benefits: web bundle drops the Studio dependency tree (sanity + styled-components currently ship in the web app's dependency graph), independent deploy cadence, cleaner CSP for the public site. Keep `/studio` → 308 to the new domain for bookmarks. `schema-shared` already positions you for this — good design.

**10.4 Performance.** Current posture (custom Sanity loader with width cap/quality, deferred homepage sections, `Suspense`) is right. Before the content push: verify LCP `priority` on hero images per template, add `sizes` audits on card grids, and consider `next/font` self-hosting check (didn't audit fonts). Don't adopt PPR/experimental rendering flags on money pages; there is no problem they'd solve here worth the risk.

**10.5 Data layer.** `@vercel/postgres` for leads is fine. Resist moving content queries into Postgres or adding a search service until on-site search is a real requirement; when it is, Sanity's GROQ + a small `/api/search` with rate limiting will carry you far before you need anything heavier.

---

## 11. Recommended Studio / editor experience improvements

Ordered by editor-error prevented per unit of effort:

1. **Draft preview** (§7.3) — removes publish-blind editing; the single biggest editor-trust feature.
2. **fullPath lock after publish + guided rename flow** (§7.2) — converts the most dangerous editor action into a deliberate workflow with an explanation in Vietnamese.
3. **Readiness badges → publish gates.** Badges exist (missing hero/meta); for `money_page` and `content_article`, escalate the critical ones to validation `Rule.required()` or a custom publish action that blocks with a checklist (meta description, cover image alt, quickAnswer, relatedMoneyPage).
4. **"Thin but indexable" dashboard tile** (§9.3) — hubs/nodes with <4 children and `isIndexed: true`.
5. **Internal-link health view** — articles missing `relatedMoneyPage`; money pages with zero reverse-linked articles.
6. **Redirect manager polish** — `route_redirect` list with a "test" link and a badge when `fromPath` collides with a live route (validation exists at write time; surface it in the list too).
7. After Gate B: evaluate Presentation tool for visual editing (§7.3), scheduled publishing only if editors ask twice.

---

## 12. Roadmap by priority

**P0 — Guardrails (do before any new content push; ~1–2 weeks of focused work)**
1. fullPath lock-after-publish + rename runbook; `redirects()` block for file-routed pages.
2. Commit `.claude/CMS` specs + masterplan into `docs/`; fix README pointers.
3. SEO regression tests (sitemap, canonicals, robots meta, JSON-LD validity per template).
4. Blog-vs-platform memo addendum (§7.1) — decision on paper, signed off.
5. Rotate/slim local production secrets (AR R7).

**P1 — Editorial safety & CMS completion (unblocks non-technical editors; ~2–4 weeks)**
6. Draft mode preview with viewer token (§7.3 option B).
7. Fallback strategy: fail-closed pricing/schedule, snapshot-generated FAQs/locations, delete testimonial fallback (§7.4).
8. Money-page factory + Sanity-first metadata + sitemap registry (§7.5).
9. CSP narrowing + enforcement (W8-4 as planned).
10. Publish-gate checklist actions in Studio (§11.3).

**P2 — Scale content (the growth phase this was all for)**
11. Sân tập hub buildout on existing `court` machinery; then kỹ thuật depth.
12. Thiết bị vertical: `product` doc + review articles + `chinh-sach-danh-gia` page + coach detail pages for review authors.
13. Split `shared.ts`/`schema.ts` monoliths behind the test suite.
14. Gate B: `apps/studio` split + `cms.v2badminton.com`.
15. Studio link-health + thin-content dashboards.

**P3 — Amplifiers & options (only after P2 traction)**
16. `tool` registry + first interactive tool inside thiết bị.
17. Tin tức cadence decision + archive indexing per thresholds.
18. Presentation tool / visual editing evaluation.
19. Curated community content (student stories) — still no UGC.
20. Search (`/api/search` over GROQ) if nav analytics show demand.

---

## 13. Now / Later / Never

**Now:** P0 list; nothing else until it's done.
**Later:** every P1/P2 item; coach detail pages (tied to review authorship); scheduled publishing (only on demand); proxy.ts (only past ~50 redirects); Next major upgrades (quiet windows).
**Never (on this stack / this business):** open UGC and comment systems; CMS page-builder/layout composition; audience-based content categories (`phu-huynh`, `nguoi-di-lam`) — rejected in the memo for cannibalization, stays rejected; competitor-comparison content (business rule, also correct for liability); `llms.txt`/AI-meta pseudo-standards; migrating money-page URLs into the catch-all; AggregateRating without third-party verification; deleting published URLs without redirects.

---

## 14. Irreversible or dangerous decisions

- **URL structure choices are one-way doors once indexed.** The `/blog/` vs `/tin-tuc/` naming, hub slugs (`ky-thuat-cau-long`), and the nested-category question (§7.1) must be settled *before* content ships at those URLs. After indexing, every change is a redirect project with permanent leakage risk.
- **Publishing thin hubs/verticals into the index** damages domain-level quality perception; recovery is slow and diffuse. The isIndexed thresholds are the defense — treat them as policy, not suggestion.
- **Sanity dataset schema erosion**: repurposing enum values (e.g. reusing an old `category` value with new meaning) silently corrupts historical documents. Enums are append-only; migrations must map old→new explicitly.
- **Deleting document types or fields with published data** — always migrate + deprecate, never drop.
- **Handing production Studio access to editors before preview + publish gates exist** — the current system publishes to the live site within seconds via webhook; there is no undo except re-publish.
- **Enforcing CSP without report analysis** can blank the site for a subset of browsers/extensions — one-way in the sense that the incident cost is paid immediately.
- **The Gate B domain move** (`cms.v2badminton.com`) is low-risk for SEO (Studio is noindexed) but bookmark/webhook/token URLs all change — do it once, with a checklist, not incrementally.

---

## 15. Final opinion

**The direction is healthy. Do not pivot.** The stack is right (Next + Sanity + Vercel at this scale), the hub-and-spoke content thesis is right for a local service business expanding into topical authority, the content platform is well-designed and already proven by the court vertical, and the SEO discipline encoded in code is the strongest I'd expect to see at this project size.

The project needs an **adjustment, not a pivot**, in exactly two places. First, resolve the internal fork: the approved blog memo and the newer content platform describe overlapping futures, and the platform should win everything except news (§7.1) — settle it in writing before the first evergreen post is published into the wrong system. Second, the project's growth is currently gated by *change safety*, not by capability: URL renames, blind publishes, and untested SEO surfaces are all cheap to fix now and expensive to fix after editors and content volume arrive. Run P0 (guardrails) before the growth phase, and this codebase will scale to courts, equipment, tools, and news without structural rework. Skip the guardrails, and the most likely failure mode is not bad architecture — it's a routine content operation quietly deleting the SEO position the whole plan is built on.
