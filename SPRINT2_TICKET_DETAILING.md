# V2 Badminton - Sprint 2 Ticket Detailing

> Detailed execution sheet for Sprint 2
> Date: 2026-04-06
> Branch: `codex/sprint2-plan`
> Source of truth:
> - `TASKS.md`
> - `SPRINT2_PLAN.md`
> - `SPRINT2_TECHNICAL_REVIEW.md`

---

## 1. Sprint 2 objective

Sprint 2 turns the Next.js repo from foundation into a real homepage preview with:

- homepage visual parity
- `schedule -> prefill form -> scroll -> focus`
- ContactForm vertical slice
- save-first lead pipeline
- anti-spam baseline
- monitoring baseline
- homepage metadata and homepage JSON-LD parity

This detailing exists so each ticket can be implemented without re-deciding scope.

---

## 2. Global rules for every Sprint 2 ticket

- Use `src/lib/routes.ts` for homepage hrefs and metadata ownership.
- Use `src/lib/schedule.ts` for any schedule-derived UI or prefill state.
- Use `src/lib/locations.ts` for court cards, maps links, and local-page routing.
- Do not hardcode pricing copy outside `src/lib/pricing.ts`.
- Do not push raw `dataLayer` events from components.
- Do not introduce `/api/lead` as a submit path.
- JS and no-JS submit paths must remain valid throughout implementation.
- Block C and Block D are one vertical slice in practice.
- No ticket in Block C is considered done against a temporary or mocked submit path.
- One owner controls homepage conversion state:
  - schedule prefill values
  - course-intent state
  - business-mode state
  - auto-prefilled message state
  - scroll-to-form
  - focus-first-empty-field
- `ScheduleSection` and `ContactForm` must consume that owner, not compete with it.

---

## 3. Ticket detailing

### `S2-A0` Homepage metadata parity

**Goal**

- Verify the existing homepage metadata baseline survives the Sprint 2 homepage
  rewrite.

**Implementation**

- In `src/app/page.tsx`, keep `metadata` exported via `buildMetadata("/")`.
- Do not hand-roll title/description/canonical/OG in the page file.
- After the homepage UI port, verify title, canonical, and Open Graph still come
  from the route registry rather than from copied page-local values.

**Files**

- `src/app/page.tsx`
- `src/lib/routes.ts`

**Acceptance**

- Homepage title matches route registry.
- Canonical points to `/`.
- Open Graph fields come from route registry.
- No duplicate metadata logic outside `routes.ts`.
- Sprint 2 homepage UI changes do not replace or bypass `buildMetadata("/")`.

---

### `S2-A1` Hero section

**Goal**

- Port the production hero with parity-first layout and copy.

**Implementation**

- Recreate heading, subheading, CTA group, and hero trust/stats strip.
- Keep CTA naming aligned with existing tracking taxonomy.
- Use assets already migrated into `public/images`.

**Files**

- `src/app/page.tsx`
- `src/components/home/*` if split

**Acceptance**

- Hero visually matches current production intent.
- Mobile and desktop both render correctly.
- CTA labels remain consistent with current site.

---

### `S2-A2` Pricing section

**Goal**

- Render homepage pricing from `src/lib/pricing.ts`.

**Implementation**

- Switch on `kind` to render:
  - group
  - private
  - enterprise
- Keep `displayPrice` as the displayed source of truth.
- Keep CTA nested shape `{ label, ctaName }`.

**Files**

- `src/app/page.tsx`
- `src/lib/pricing.ts`

**Acceptance**

- Group, private, and enterprise tiers render correctly.
- Monthly, hourly, and quote models do not drift into a fake common shape.
- Pricing cards preserve CTA intent.

---

### `S2-A3` Why choose V2 section

**Goal**

- Port the production "Khac biet cua V2" content.

**Implementation**

- Reuse the Sprint 1 visual system.
- Keep copy parity first; no new marketing claims in Sprint 2.

**Files**

- `src/app/page.tsx`

**Acceptance**

- Section order and copy intent match production.
- No placeholder text remains.

---

### `S2-A4` Homepage SEO links block

**Goal**

- Port the standalone production SEO-links section.

**Implementation**

- Keep this block separate from location cards.
- Internal links here are the homepage-owned path into:
  - `/hoc-cau-long-cho-nguoi-moi/`
  - `/lop-cau-long-binh-thanh/`
  - `/lop-cau-long-thu-duc/`
- Build hrefs from `src/lib/routes.ts`.

**Files**

- `src/app/page.tsx`
- `src/lib/routes.ts`

**Acceptance**

- SEO-links block exists in the right place on homepage.
- Internal links do not get pushed onto location cards.
- Every exposed link resolves `200` in preview.

---

### `S2-A5` Course cards section

**Goal**

- Port course cards for basic, advanced, and enterprise.

**Implementation**

- Depends on `S2-B6` for shared conversion-state ownership.
- Render from pricing/course-related source data where possible.
- Keep production behaviors:
  - basic card dispatches `controller.setCourseIntent("co_ban")`, clears
    business mode, and scrolls to `#lich-hoc`
  - advanced card dispatches `controller.setCourseIntent("nang_cao")`, clears
    business mode, and scrolls to `#lich-hoc`
  - enterprise card dispatches `controller.enterBusinessMode()`, clears any
    schedule-prefill state, and scrolls to `#lien-he`

**Files**

- `src/app/page.tsx`

**Acceptance**

- Three course cards render with correct imagery/copy.
- Basic and advanced cards are not reduced to static cards.
- Enterprise card is not treated like a schedule filter.
- Course cards do not own independent conversion state outside the shared
  homepage controller.

---

### `S2-A6` Business section

**Goal**

- Port the homepage business/team-building block.

**Implementation**

- Use migrated business image.
- Keep CTA copy and proof points aligned with production.

**Files**

- `src/app/page.tsx`

**Acceptance**

- Section is visually complete.
- CTA is present and points into the correct business-mode flow.

---

### `S2-A7` Homepage FAQ accordion

**Goal**

- Render homepage FAQ from `src/lib/faqs.ts`.

**Implementation**

- Use homepage FAQ group only.
- Keep accessible accordion behavior.

**Files**

- `src/app/page.tsx`
- `src/lib/faqs.ts`

**Acceptance**

- FAQ renders from source data only.
- Accordion is keyboard accessible.
- No freeform FAQ copy is duplicated in component code.

---

### `S2-A8` Contact section direct CTAs

**Goal**

- Preserve the live contact-channel surfaces that production already exposes.

**Implementation**

- Keep direct contact CTAs in the contact section.
- Preserve the post-submit Zalo CTA behavior if a success state is shown.

**Files**

- `src/app/page.tsx`
- `src/components/home/ContactForm.tsx`

**Acceptance**

- Contact section is not reduced to only a form.
- Live contact-channel CTA surfaces remain available.

---

### `S2-B1` Schedule tabs and cards

**Goal**

- Render schedule UI from `src/lib/schedule.ts`.

**Implementation**

- Build filter tabs and schedule cards as a client component.
- Lock tab model to current production:
  - `all`
  - `hue-thien`
  - `green`
  - `phuc-loc`
  - `khang-sport`
- Preserve production grouping semantics.

**Files**

- `src/components/home/ScheduleSection.tsx`
- `src/lib/schedule.ts`

**Acceptance**

- Schedule cards render from typed data only.
- Filtering works on mobile and desktop.
- No district-level tab model replaces the production per-court tabs.

---

### `S2-B2` Schedule card -> prefill flow

**Goal**

- Preserve the core conversion asset.

**Implementation**

- On schedule-card click:
  - set `court`
  - set `time_slot`
  - set `message`
- open optional fields disclosure
- if level is empty and the slot is basic-only, prefill beginner level
- do not overwrite a user-edited message
- then smooth scroll to form
- then focus first empty field after scroll settles via an explicit
  requestAnimationFrame settle loop, not via `scrollend`
- settle success means the form container top is within 4px for two consecutive
  frames, with an 800ms timeout fallback for browsers that keep bouncing

**Files**

- `src/components/home/ScheduleSection.tsx`
- `src/components/home/ContactForm.tsx`
- one shared homepage conversion controller

**Acceptance**

- Prefill values come directly from `prefillCourtId`, `prefillTimeSlotId`, `prefillMessage`.
- No ad hoc mapping table exists in components.
- Works on mobile.
- Optional fields are open before focus lands.
- Message is only auto-overwritten when empty or previously auto-prefilled.
- Focus timing does not depend on `scrollend`.

---

### `S2-B3` Corporate card -> business-mode flow

**Goal**

- Preserve enterprise conversion behavior.

**Implementation**

- Corporate CTA sets business-mode form intent.
- Existing schedule-prefill data should not remain stuck when business mode is chosen.

**Files**

- `src/app/page.tsx`
- `src/components/home/ContactForm.tsx`

**Acceptance**

- Business CTA scrolls to form.
- Business-mode state is clearly reflected in form values/message.

---

### `S2-B4` Location-card maps behavior

**Goal**

- Port court cards with correct maps behavior.

**Implementation**

- Maps URL comes from `locations.ts`.
- Keep production behavior: location cards remain maps-first, not internal-link cards.
- This is an intentional Sprint 2 deviation from `MASTERPLAN.md` section 8.7;
  local-page internal links stay in the standalone SEO-links block for now.

**Files**

- `src/app/page.tsx`
- `src/lib/locations.ts`

**Acceptance**

- Maps links are separate from internal links.
- Location cards do not absorb the standalone SEO-links behavior.
- Reviewers can distinguish this from a missing feature because Sprint 2 treats
  maps-only cards as the locked homepage parity model.

---

### `S2-B5` Expose only working homepage SEO links

**Goal**

- Avoid homepage links pointing to non-ready preview routes.

**Implementation**

- If Sprint 3 page route is preview-ready and resolves `200`, expose it.
- If not preview-ready, hide that homepage SEO link for now.

**Files**

- `src/app/page.tsx`
- `src/lib/routes.ts`

**Acceptance**

- Every exposed homepage internal SEO link resolves `200`.
- No dead or placeholder internal links on preview.

---

### `S2-B6` One homepage conversion-state owner

**Goal**

- Define and implement one shared owner for all homepage conversion intent.

**Implementation**

- Create a single homepage conversion controller/provider before schedule,
  course-card, and form interactions diverge.
- Controller owns:
  - `selectedSchedulePrefill`
  - `selectedCourseIntent`
  - `businessMode`
  - `scrollTarget`
  - `autoPrefilledMessage`
  - `focusAfterScroll`
- `ScheduleSection`, course cards, business CTA surfaces, and `ContactForm`
  must all read/write through this owner.
- Do not allow a second source of truth inside `ContactForm` or page-local
  state for the same semantics.

**Files**

- `src/components/home/HomepageConversionProvider.tsx`
- `src/components/home/ScheduleSection.tsx`
- `src/components/home/ContactForm.tsx`
- homepage composition entrypoint such as `src/app/page.tsx`

**Acceptance**

- Schedule card clicks, course card clicks, and business CTA clicks all flow
  through the same controller semantics.
- Business-mode entry clears schedule-prefill state.
- Schedule-prefill entry clears incompatible business-mode intent.
- Auto-prefilled message tracking is explicit so later clicks do not clobber
  user-edited content.
- There is no second conversion-state owner in component-local state.

---

### `S2-C1` ContactForm UI and local state

**Goal**

- Build the real homepage form UI.

**Implementation**

- Fields:
  - name
  - phone
  - level
  - court
  - time_slot
  - message
- Include honeypot field.
- Consume the shared homepage conversion controller for prefill/business-mode state.
- Keep local state only for form inputs and submit UX, not as a second source of truth.

**Files**

- `src/components/home/ContactForm.tsx`

**Acceptance**

- Form renders all required fields.
- Prefill can override/select values correctly.

---

### `S2-C2` Client-side validation

**Goal**

- Improve UX without replacing server validation.

**Implementation**

- Validate name and phone before submit.
- Use VN mobile regex from plan.
- Show inline error states.

**Files**

- `src/components/home/ContactForm.tsx`

**Acceptance**

- Invalid phone blocks client submit path.
- Errors are visible and clear.

---

### `S2-C3` Server-side validation contract

**Goal**

- Make the server the final source of truth.

**Implementation**

- Re-validate all fields in Server Action.
- Only allow known enums for optional select values.

**Files**

- `src/app/actions/submitLead.ts`
- optional `src/lib/validation/*`

**Acceptance**

- Invalid payloads are rejected server-side even if client validation is bypassed.

---

### `S2-C4` Success, error, and disabled states

**Goal**

- Make submit behavior user-safe and idempotent at UI level.

**Implementation**

- Disable submit during in-flight request.
- Render success state only on confirmed success.
- Re-enable submit on failure.

**Files**

- `src/components/home/ContactForm.tsx`

**Acceptance**

- Double click does not create duplicate local submit attempts.
- Success UI only appears after real success.

---

### `S2-D1` Lead table schema

**Goal**

- Persist leads with attribution and submission-path context.

**Implementation**

- Add DB schema for fields defined in plan.
- Include `submission_method`.
- Lock delivery-audit columns to:
  - `telegram_status`
  - `telegram_attempted_at`
  - `telegram_error`
  - `email_status`
  - `email_attempted_at`
  - `email_error`
- Delivery status enum values are:
  - `pending`
  - `sent`
  - `failed`
  - `skipped`

**Files**

- DB migration files
- `src/lib/db/*`

**Acceptance**

- DB schema supports homepage vertical slice without missing fields.
- Delivery-audit columns match the agreed names exactly so backend and ops do
  not drift later.

---

### `S2-D2` Server Action `submitLead`

**Goal**

- Create the canonical server submit path.

**Implementation**

- Parse form data
- validate
- anti-spam checks
- dedupe check (short-circuit):
  - normalize `phone`, `name`, `court`, `time_slot`, `message`, and
    `landing_page`
  - derive a `dedupe_key` via `sha256(normalizedPayload)`
  - 15-minute duplicate window
  - if duplicate found: **short-circuit** → return `{ success: true, deduped: true }` immediately
  - do not insert a second lead row
  - do not retry notify on the duplicate request — if original notify
    failed, that is an ops/cron concern, not piggyback on user retry
- save to DB
- schedule async notify via `after()` from `next/server`:
  - `after()` runs callback after response is sent; runtime keeps the
    function alive until the callback completes
  - do NOT use unawaited promises (unreliable on serverless — function
    may terminate before notify completes)
  - Telegram and email run in parallel via `Promise.allSettled`
- return typed success/error payload

**Files**

- `src/app/actions/submitLead.ts`

**Acceptance**

- Save happens before notify.
- `generate_lead` is only allowed after success payload on the client.
- Duplicate-submit handling is defined server-side, not only in UI state.
- Duplicate-submit handling is concrete enough to implement without inventing a
  second policy during backend work.

---

### `S2-D3` Telegram notify module

**Goal**

- Deliver lead notification without blocking lead persistence.

**Implementation**

- Wrap Telegram notify in a helper with timeout.
- Never throw unhandled errors upward.

**Files**

- `src/lib/notify/telegram.ts`

**Acceptance**

- Telegram failure is logged/captured but does not erase a saved lead.

---

### `S2-D4` Email backup notify module

**Goal**

- Add a second non-DB alert channel.

**Implementation**

- Use provider abstraction or direct Resend integration.

**Files**

- `src/lib/notify/email.ts`

**Acceptance**

- Email backup can run independently of Telegram success.

---

### `S2-D5` `/api/health`

**Goal**

- Provide a health endpoint for uptime monitoring.

**Implementation**

- Return `200` only when DB is healthy enough for lead intake.
- Return a non-healthy response when DB connectivity is broken.

**Files**

- `src/app/api/health/route.ts`

**Acceptance**

- Endpoint health result is meaningful for alerting, not only for ping success.

---

### `S2-D6` `/api/form-token`

**Goal**

- Support JS-path timing token without breaking SSG.

**Implementation**

- `force-dynamic`
- `no-store`
- return signed token

**Files**

- `src/app/api/form-token/route.ts`

**Acceptance**

- JS path receives a request-scoped token.
- No SSG HTML token baking is introduced.

---

### `S2-D7` Honeypot and Turnstile verify

**Goal**

- Add baseline bot resistance.

**Implementation**

- Honeypot always active.
- Turnstile required on JS path only.

**Files**

- `src/components/home/ContactForm.tsx`
- `src/app/actions/submitLead.ts`

**Acceptance**

- Honeypot-filled submit is rejected.
- Invalid Turnstile token is rejected on JS path.

---

### `S2-D8` Rate limiting

**Goal**

- Separate JS and no-JS throttling behavior.

**Implementation**

- JS path: `5/IP/hour`
- no-JS path: `2/IP/hour`

**Files**

- server-side rate-limit utility
- `src/app/actions/submitLead.ts`

**Acceptance**

- JS and no-JS branches enforce their own limits.

---

### `S2-E1` Sentry baseline

**Goal**

- Enable useful error visibility before QA.

**Implementation**

- Configure Next.js Sentry on client and server.

**Files**

- `next.config.*`
- `instrumentation.*`
- Sentry config files

**Acceptance**

- A test error is captured from preview.

---

### `S2-E2` Uptime monitor setup notes and endpoint check

**Goal**

- Ensure `/api/health` is externally monitorable.

**Implementation**

- Document vendor choice and check interval.
- Point monitor at preview endpoint for validation.

**Files**

- ops/setup notes
- optional docs file

**Acceptance**

- `/api/health` is being pinged by the chosen uptime tool.

---

### `S2-E3` Preview alerts and error capture verification

**Goal**

- Prove monitoring is real, not just installed.

**Implementation**

- Trigger test capture
- verify alert arrives

**Acceptance**

- Team can see a real monitored failure in preview.
- DB-save failure alert path is verified.
- The branch where both notify channels fail is captured and visible.

---

### `S2-E4` Homepage JSON-LD baseline

**Goal**

- Verify the existing homepage JSON-LD baseline survives the Sprint 2 homepage
  rewrite.

**Implementation**

- Keep rendering:
  - `LocalBusiness`
  - homepage `FAQPage`
  - `Organization`
  - `WebSite`
- Reuse `src/lib/schema.ts` and `src/components/ui/JsonLd.tsx`; do not rebuild
  parallel homepage schema logic in the page component.

**Files**

- `src/app/page.tsx`
- `src/lib/schema.ts`
- `src/components/ui/JsonLd.tsx`

**Acceptance**

- JSON-LD is present in homepage HTML.
- No duplicate hand-built schema exists in the page component.
- Sprint 2 homepage work does not remove or bypass the existing schema builder
  baseline.

---

## 4. Exit criteria before Sprint 3

Sprint 2 may hand off only when:

- homepage is visually real, not placeholder
- metadata is route-registry-owned
- JSON-LD baseline is preserved and rendered
- exposed homepage links resolve `200`
- schedule prefill flow is preserved
- course cards and business CTA flow through one conversion controller
- JS and no-JS submit both work
- save-first rule is verified
- monitoring is active and tested
