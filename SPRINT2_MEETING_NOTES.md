# V2 Badminton - Sprint 2 Meeting Notes

> Working session for Sprint 2 planning
> Date: 2026-04-06
> Branch: `codex/sprint2-plan`
> Scope: homepage parity, lead backend baseline, monitoring baseline

---

## 1. Outcome

**Decision:** Sprint 2 is approved to start.

Reason:

- Sprint 1 foundation is stable enough
- submit architecture is already locked
- anti-spam and monitoring are no longer sequenced too late
- homepage-only SEO requirements are now explicit enough to avoid accidental drift

This approval is for:

- homepage build
- schedule and prefill flow
- ContactForm vertical slice
- lead persistence and notifications
- monitoring baseline
- homepage metadata and homepage JSON-LD baseline

This is **not** approval to:

- start cutover work
- expand into SEO page parity
- add broad visual polish experiments

---

## 2. Technical Decisions

### 2.1 Submit architecture

Locked:

- **Server Action is the canonical submit path**

Implications:

- no form submission through `/api/lead`
- progressive enhancement stays native
- save-first semantics remain simple

Supporting routes allowed:

- `/api/health`
- `/api/form-token`

### 2.2 Homepage rendering strategy

Locked:

- homepage stays primarily **SSG**

Implications:

- no request-time token baked into static HTML
- JS timing token must come from `/api/form-token`
- no-JS path uses honeypot + stricter rate limit, without timing check

### 2.3 Lead pipeline order

Locked order:

1. validate
2. anti-spam checks
3. save to DB
4. notify Telegram
5. notify email backup
6. return success
7. client fires `generate_lead`

Hard rule:

- **save first, notify second**

### 2.4 Monitoring

Locked:

- monitoring starts in the same implementation wave as the form/backend

Minimum baseline:

- Sentry for client and server
- uptime monitoring on `/api/health`
- alerting on lead-save failure

### 2.5 Route and metadata ownership

Locked:

- homepage metadata is owned by Sprint 2
- homepage must use `buildMetadata("/")`
- homepage deep links must come from `src/lib/routes.ts`

---

## 3. Conversion Decisions

### 3.1 Schedule -> form prefill

This remains a **migration acceptance criterion**, not a nice-to-have.

Required behavior:

- click schedule card
- prefill `court`, `time_slot`, `message`
- smooth scroll to form
- focus first empty field

### 3.2 Corporate card flow

Required behavior:

- click corporate card
- switch form into business-mode path
- scroll to form

### 3.3 No-JS submit

Required behavior:

- form submit still succeeds with JS disabled
- `submission_method: "no_js"` is persisted
- no-JS branch is protected by honeypot + stricter rate limit

---

## 4. SEO Input From Agent

SEO review was called in for Sprint 2 planning. The important findings were:

### 4.1 Homepage metadata parity cannot wait for Sprint 3

Sprint 2 must own homepage metadata parity now, because:

- homepage metadata already exists in `src/lib/routes.ts`
- delaying it would let homepage parity pass visually while metadata stays incomplete

Decision:

- homepage must ship with `buildMetadata("/")`

### 4.2 Homepage JSON-LD cannot remain implicit

Homepage schema was at risk of becoming "optional by accident".

Decision:

- Sprint 2 requires homepage JSON-LD for:
  - `LocalBusiness`
  - homepage `FAQPage`
  - `Organization`
  - `WebSite`

Clarification:

- separate top-level per-court `SportsActivityLocation` nodes are **not mandatory**
  for Sprint 2 as long as homepage `LocalBusiness` retains its location coverage

### 4.3 Homepage links must not point to broken routes

Sprint 2 already introduces homepage deep links and SEO links, while full SEO-page
parity is still Sprint 3 work.

Decision:

- only expose homepage internal SEO links that resolve `200` in preview
- build those links from the route registry, not hardcoded hrefs

---

## 5. Ticket-Level Amendments Agreed In Meeting

- Add homepage metadata parity as an explicit Sprint 2 ticket.
- Add homepage JSON-LD baseline as an explicit Sprint 2 ticket.
- Treat route-registry-driven deep links as a Sprint 2 requirement.
- Treat "all exposed homepage internal SEO links resolve `200`" as a Sprint 2 acceptance criterion.

---

## 6. Open Vendor Decisions

These do **not** block Block A/B work, but should be settled before Block D/E closes:

- DB provider and migration tool
- email backup provider
- uptime vendor
- Turnstile presentation mode

---

## 7. Definition Of Done For The Meeting

The meeting is considered successful because:

- Sprint 2 scope is still tight
- homepage-only SEO requirements are now explicit
- no new architecture blocker was introduced
- Sprint 2 can start without waiting for Sprint 3 decisions

---

## 8. Next Step

Start Sprint 2 implementation in this order:

1. homepage shell parity
2. schedule and prefill flow
3. ContactForm UI and validation
4. lead backend baseline
5. monitoring baseline

