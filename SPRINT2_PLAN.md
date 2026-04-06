# Sprint 2 Plan

> Branch: `codex/sprint2-plan`
>
> Sprint 2 scope is **homepage parity + lead backend baseline + monitoring baseline**.
> This is the first sprint that turns the Next.js repo from a foundation into a
> preview with real UI, real conversion flow, and real observability.

---

## 1. Sprint Goal

Deliver a working homepage preview with:

- real homepage sections instead of placeholders
- preserved `schedule -> prefill form -> scroll -> focus` flow
- ContactForm submit through **Server Action**
- lead pipeline that **saves first**, then notifies Telegram and email
- anti-spam baseline for both JS and no-JS paths
- monitoring baseline active before QA starts
- homepage metadata and homepage JSON-LD parity locked in
- contact section keeps live direct-contact CTAs, not only the form

Sprint 2 does **not** aim to:

- port the 3 SEO pages fully
- finish cookie consent or privacy policy
- finish full GA4/Meta parity for the entire site
- cut over production traffic

---

## 2. Success Criteria

Sprint 2 is only considered complete when all items below are true:

1. Homepage preview renders the main production sections:
   - hero
   - pricing
   - why choose V2
   - SEO links block
   - course cards
   - schedule
   - locations
   - business
   - FAQ
   - contact form
   - direct contact CTAs in the contact section
2. Clicking a schedule card prefills:
   - `court`
   - `time_slot`
   - `message`
3. After prefill:
   - smooth scroll reaches the form
   - the first empty field gets focus
   - focus happens after scroll settles, not before
   - optional fields disclosure is open
   - basic-only schedule cards may prefill beginner level when level is still empty
   - message is only auto-overwritten when empty or already auto-prefilled
4. ContactForm submits successfully with JS enabled.
5. ContactForm submits successfully with JS disabled.
6. Lead is saved to DB before Telegram or email notify runs.
7. Sentry, `/api/health`, and uptime monitoring are active before QA.
8. Homepage uses `buildMetadata("/")` from [`src/lib/routes.ts`](/D:/V2/v2badminton-next/src/lib/routes.ts).
9. Homepage renders JSON-LD for:
   - `LocalBusiness`
   - homepage `FAQPage`
   - `Organization`
   - `WebSite`
10. Every homepage internal SEO link exposed in preview resolves `200`.
11. Schedule tabs match production filter model:
   - `all`
   - `hue-thien`
   - `green`
   - `phuc-loc`
   - `khang-sport`
12. Mobile prefill flow keeps the form heading and focused field visible after scroll.
13. `npm run lint` and `npm run build` pass after each major block.

---

## 3. Scope

### 3.1 In scope

- Homepage visual parity at section/order/content-structure level
- Interactive schedule section
- Real ContactForm
- Server Action submit path
- DB persistence
- Telegram notification
- email backup notification
- `/api/health`
- `/api/form-token`
- anti-spam baseline
- monitoring baseline
- homepage metadata parity
- homepage JSON-LD baseline

### 3.2 Out of scope

- Detailed SEO page parity
- Full Meta Pixel parity
- Full CTA tracking on every site surface
- Cookie consent
- Privacy policy route
- Per-page OG image generation
- Production DNS cutover

---

## 4. Locked Architecture Decisions

### 4.1 Canonical submit path

- **Server Action** is the only canonical submit path
- `/api/lead` must not be used as the form submit endpoint
- `/api/lead` placeholder should be removed during Sprint 2 cleanup

### 4.2 Anti-spam paths

#### JS path

- Turnstile token required
- form token fetched from `GET /api/form-token`
- rate limit: `5 req / IP / hour`
- honeypot required

#### No-JS path

- no timing check
- missing token alone does not reject
- rate limit: `2 req / IP / hour`
- honeypot required
- persist `submission_method: "no_js"`

### 4.3 Save-first rule

Submit order is locked:

1. server-side validation
2. anti-spam checks
3. save to DB
4. notify Telegram asynchronously
5. notify email asynchronously
6. return success
7. client may then fire `generate_lead`

Hard rules:

- notification failure must not equal lead loss
- DB save failure must be captured in Sentry

### 4.4 Homepage SEO contract for Sprint 2

- homepage metadata is owned by Sprint 2, not Sprint 3
- homepage JSON-LD is owned by Sprint 2, not Sprint 3
- homepage SEO links must use route-registry values from
  [`src/lib/routes.ts`](/D:/V2/v2badminton-next/src/lib/routes.ts)
- location cards stay maps-first like production
- local-page internal links live in the standalone SEO-links block, not inside
  location cards
- if a homepage SEO link target is not preview-ready, that link should not be
  exposed yet

### 4.5 Homepage conversion state ownership

- one client-side controller owns:
  - schedule prefill state
  - business-mode state
  - scroll-to-form behavior
  - focus-first-empty-field behavior
- `ScheduleSection` and `ContactForm` must not each invent their own source of
  truth for the same flow

---

## 5. Execution Order

Sprint 2 should run in five blocks, in order:

### Block A - Homepage shell parity

Goal:

- replace the placeholder homepage with the real homepage shell

Includes:

- hero
- pricing
- why choose V2
- SEO links block
- course cards
- business
- FAQ
- homepage metadata
- contact-section direct CTAs

Not yet required:

- schedule interactivity
- real form submission

Done when:

- homepage section order matches production
- route metadata is wired through `buildMetadata("/")`
- layout is stable on desktop and mobile

### Block B - Schedule plus prefill flow

Goal:

- preserve the strongest conversion asset from production

Includes:

- schedule tabs/cards
- schedule card -> prefill
- scroll to form
- focus first empty field
- open optional fields disclosure
- preserve user-entered message unless the field is still auto-prefilled
- beginner-level prefill for basic-only schedule cards when level is empty
- corporate card -> business-mode path
- location cards keep maps-only CTA behavior

Done when:

- mobile flow works
- no component rebuilds values outside `lib/schedule.ts`
- filter tabs match production:
  - `all`
  - `hue-thien`
  - `green`
  - `phuc-loc`
  - `khang-sport`
- exposed internal SEO links resolve `200`

### Block C - ContactForm plus validation plus Server Action

Goal:

- real form submit path works end-to-end at UI level

Includes:

- form UI states
- client validation
- server validation contract
- success and error rendering
- anti-double-submit

Done when:

- JS path submits successfully against the real backend path
- no-JS path submits successfully against the real backend path
- Block C is not considered done against a temporary or mocked submit path

### Block D - DB plus notify plus anti-spam

Goal:

- lead pipeline is production-shaped

Includes:

- Vercel Postgres
- lead table
- Telegram notify
- email backup
- honeypot
- Turnstile verify
- `/api/form-token`
- `/api/health`
- rate limiting

Done when:

- save-first rule works
- duplicate-submission policy is defined server-side
- notify failure does not break successful submit response

### Block E - Monitoring plus QA-ready preview

Goal:

- preview is observable before formal QA starts

Includes:

- Sentry client and server
- uptime monitor pinging `/api/health`
- test error capture
- homepage JSON-LD baseline
- preview smoke checklist

Done when:

- preview can be QAed without blind spots

---

## 6. Ticket Breakdown

### A. Homepage parity

- `S2-A0` Wire homepage metadata via `buildMetadata("/")`
- `S2-A1` Port hero section from production homepage
- `S2-A2` Port pricing section from `lib/pricing.ts`
- `S2-A3` Port "Khac biet cua V2" section
- `S2-A4` Port homepage SEO links block
- `S2-A5` Port course cards section with production interactions
- `S2-A6` Port business section
- `S2-A7` Port homepage FAQ accordion from `lib/faqs.ts`
- `S2-A8` Port direct contact CTAs in the contact section

### B. Schedule parity

- `S2-B1` Build schedule tabs and cards from `lib/schedule.ts`
- `S2-B2` Implement schedule card -> prefill form flow
- `S2-B3` Implement corporate card -> business-mode form flow
- `S2-B4` Keep location-card maps behavior in parity with production
- `S2-B5` Only expose homepage SEO links that resolve `200` in preview
- `S2-B6` Implement one owner for homepage conversion state

### C. Form baseline

- `S2-C1` Build ContactForm UI and local state
- `S2-C2` Add client-side validation
- `S2-C3` Add server-side validation contract
- `S2-C4` Add success, error, and disabled states

### D. Lead backend

- `S2-D1` Create lead table schema
- `S2-D2` Implement Server Action `submitLead`
- `S2-D3` Implement Telegram notify module
- `S2-D4` Implement email backup notify module
- `S2-D5` Implement `/api/health`
- `S2-D6` Implement `/api/form-token`
- `S2-D7` Add honeypot and Turnstile verify
- `S2-D8` Add rate limiting for JS and no-JS branches

### E. Monitoring and schema baseline

- `S2-E1` Add Sentry baseline
- `S2-E2` Add uptime monitor setup notes and endpoint check
- `S2-E3` Verify preview alerts and error capture
- `S2-E4` Render homepage JSON-LD baseline from `src/lib/schema.ts`

---

## 7. Dependencies To Provision Before Deep Backend Work

Needed before Block C/D is finished:

- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `TELEGRAM_OPS_CHAT_ID`
- email provider key such as `RESEND_API_KEY`
- `NOTIFY_EMAIL_TO`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `FORM_TOKEN_SECRET`
- `SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`

If one of these groups is still missing:

- Blocks A and B can still proceed
- Blocks D and E should not be considered done

---

## 8. QA Focus For Sprint 2

QA for Sprint 2 should stay focused on conversion-risk areas:

### UI and UX

- homepage section order matches production
- mobile layout does not break
- form remains usable on mobile

### Conversion

- schedule card -> prefill works correctly
- corporate card -> business mode works correctly
- no-JS submit still works
- user-edited message is not clobbered by a later auto-prefill
- contact section still exposes live contact-channel CTAs

### Data and backend

- lead save succeeds
- duplicate submit does not create duplicate leads
- invalid phone is rejected
- honeypot is rejected

### SEO and routing

- homepage metadata is correct
- homepage JSON-LD is present
- internal homepage SEO links resolve `200`
- route registry is used for homepage deep links

### Ops

- `/api/health` returns `200` only when DB is healthy
- Sentry captures a test error

---

## 9. Risks

### Risk 1 - UI port over-polishes too early

Mitigation:

- parity first
- no motion or visual experiments in Sprint 2

### Risk 2 - Form pipeline exists but cannot be observed

Mitigation:

- monitoring baseline must ship in the same sprint

### Risk 3 - Prefill flow drifts from production

Mitigation:

- use `lib/schedule.ts` directly
- compare against the HTML production behavior during QA

### Risk 4 - Sprint 2 accidentally expands into SEO-page work

Mitigation:

- keep boundary strict: Sprint 2 owns homepage plus backend baseline only

### Risk 5 - Homepage links to non-ready routes

Mitigation:

- expose only links that resolve `200` in preview
- build all homepage links from route-registry values

---

## 10. Definition Of Done

Sprint 2 is done when:

- all `S2-A*`, `S2-B*`, `S2-C*`, `S2-D*`, and `S2-E*` tickets are complete
- homepage preview on Vercel is usable end-to-end
- JS and no-JS form submits both work
- save-first lead flow is verified
- server-side duplicate policy is verified
- monitoring baseline is active
- homepage metadata parity is active through `buildMetadata("/")`
- homepage JSON-LD exists for `LocalBusiness`, homepage `FAQPage`,
  `Organization`, and `WebSite`
- homepage SEO links and location deep links resolve `200` in preview
- lint and build pass
- the team can enter Sprint 3 without reworking form/backend foundations

---

## 11. Handoff To Sprint 3

After Sprint 2, the repo should be ready for Sprint 3 because:

- homepage is no longer a placeholder
- form/backend is trustworthy enough to reuse
- schedule/prefill behavior is locked
- homepage metadata and schema are already settled
- Sprint 3 can focus on page-content and schema parity for the 3 SEO pages
