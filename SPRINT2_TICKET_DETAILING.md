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
  - business-mode state
  - scroll-to-form
  - focus-first-empty-field
- `ScheduleSection` and `ContactForm` must consume that owner, not compete with it.

---

## 3. Ticket detailing

### `S2-A0` Homepage metadata parity

**Goal**

- Make homepage metadata owned by Sprint 2.

**Implementation**

- In `src/app/page.tsx`, export metadata via `buildMetadata("/")`.
- Do not hand-roll title/description/canonical/OG in the page file.

**Files**

- `src/app/page.tsx`
- `src/lib/routes.ts`

**Acceptance**

- Homepage title matches route registry.
- Canonical points to `/`.
- Open Graph fields come from route registry.
- No duplicate metadata logic outside `routes.ts`.

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

- Render from pricing/course-related source data where possible.
- Keep production behaviors:
  - basic and advanced cards filter schedule and scroll to `#lich-hoc`
  - enterprise card switches to business-mode form flow

**Files**

- `src/app/page.tsx`

**Acceptance**

- Three course cards render with correct imagery/copy.
- Basic and advanced cards are not reduced to static cards.
- Enterprise card is not treated like a schedule filter.

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
- then focus first empty field after scroll settles

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

### `S2-B4` Location-card deep links and maps links

**Goal**

- Port court cards with correct maps behavior.

**Implementation**

- Maps URL comes from `locations.ts`.
- Keep production behavior: location cards remain maps-first, not internal-link cards.

**Files**

- `src/app/page.tsx`
- `src/lib/locations.ts`

**Acceptance**

- Maps links are separate from internal links.
- Location cards do not absorb the standalone SEO-links behavior.

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
- Include delivery-audit fields for notify outcomes, such as status and attempted/error timestamps.

**Files**

- DB migration files
- `src/lib/db/*`

**Acceptance**

- DB schema supports homepage vertical slice without missing fields.

---

### `S2-D2` Server Action `submitLead`

**Goal**

- Create the canonical server submit path.

**Implementation**

- Parse form data
- validate
- anti-spam checks
- save to DB
- notify async
- return typed success/error payload
- define server-side duplicate policy for retry/double-submit scenarios

**Files**

- `src/app/actions/submitLead.ts`

**Acceptance**

- Save happens before notify.
- `generate_lead` is only allowed after success payload on the client.
- Duplicate-submit handling is defined server-side, not only in UI state.

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

- Make homepage schema parity explicit in Sprint 2.

**Implementation**

- Render:
  - `LocalBusiness`
  - homepage `FAQPage`
  - `Organization`
  - `WebSite`

**Files**

- `src/app/page.tsx`
- `src/lib/schema.ts`
- `src/components/ui/JsonLd.tsx`

**Acceptance**

- JSON-LD is present in homepage HTML.
- No duplicate hand-built schema exists in the page component.

---

## 4. Exit criteria before Sprint 3

Sprint 2 may hand off only when:

- homepage is visually real, not placeholder
- metadata is route-registry-owned
- JSON-LD is rendered
- exposed homepage links resolve `200`
- schedule prefill flow is preserved
- JS and no-JS submit both work
- save-first rule is verified
- monitoring is active and tested
