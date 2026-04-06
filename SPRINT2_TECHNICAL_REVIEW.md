# V2 Badminton - Sprint 2 Technical Review

> Technical design review for Sprint 2
> Date: 2026-04-06
> Branch: `codex/sprint2-plan`
> Scope: homepage parity, form vertical slice, lead backend baseline, monitoring baseline

---

## 1. Decision

**Go** for Sprint 2.

Reason:

- Sprint 1 foundation is strong enough
- no unresolved architecture blocker remains
- homepage-only SEO requirements are now explicit
- form/backend/monitoring are sequenced as one vertical slice instead of separate late phases

This is a green light to build:

- homepage shell
- schedule/prefill interactions
- ContactForm UI and Server Action
- persistence, anti-spam, monitoring baseline

This is **not** a green light to:

- start production cutover work
- expand into Sprint 3 SEO page parity
- change tracking taxonomy

---

## 2. Architecture Decisions

### 2.1 Rendering strategy

- Homepage remains primarily **SSG**
- Interactive parts may be client components inside the static page shell
- Request-time anti-spam token must not be baked into SSG HTML

Implication:

- `GET /api/form-token` is the request-scoped token source for JS path only

### 2.2 Submit architecture

- **Server Action** is the canonical submit path
- `/api/lead` is not part of the final form architecture
- `/api/health` stays as an operational endpoint

Implication:

- form must work with and without JS
- all success semantics are owned by the Server Action result

### 2.3 Save-first lead pipeline

Locked order:

1. parse and validate form data
2. anti-spam checks
3. save lead to DB
4. notify Telegram async
5. notify email async
6. return success payload
7. client fires `generate_lead`

Hard rule:

- notification failure must never equal lead loss

### 2.4 Monitoring timing

- Sentry and uptime monitoring start in Sprint 2, not later
- preview QA must happen with observability already active

Minimum stack:

- Sentry client
- Sentry server
- uptime ping on `/api/health`
- alert on DB save failure

---

## 3. Component Boundary Decisions

### 3.1 Server-owned pieces

- route metadata via `buildMetadata("/")`
- homepage JSON-LD rendering
- Server Action submit
- DB persistence
- Turnstile verification
- rate limiting
- Telegram/email notifications
- `/api/health`
- `/api/form-token`

### 3.2 Client-owned pieces

- schedule tab state
- schedule-card click handling
- form local state
- prefill orchestration
- scroll-to-form behavior
- focus-first-empty-field behavior
- JS-path Turnstile token wiring
- client-side validation and disabled states
- post-success `generate_lead`

### 3.3 Shared data sources

These remain the only allowed sources of truth:

- `src/lib/routes.ts`
- `src/lib/locations.ts`
- `src/lib/pricing.ts`
- `src/lib/schedule.ts`
- `src/lib/faqs.ts`
- `src/lib/schema.ts`
- `src/lib/tracking.ts`

No section component should recreate:

- route hrefs
- schedule mappings
- FAQ schema text
- pricing display logic

---

## 4. Homepage SEO Contract

Sprint 2 owns homepage-only SEO parity.

Required in Sprint 2:

- homepage metadata via `buildMetadata("/")`
- homepage JSON-LD:
  - `LocalBusiness`
  - homepage `FAQPage`
  - `Organization`
  - `WebSite`
- homepage deep links built from route registry
- homepage internal SEO links must resolve `200` before being exposed

Not required yet:

- full SEO-page parity
- per-page OG image generation
- full `Course` rollout beyond current homepage baseline

Clarification:

- separate top-level `SportsActivityLocation` nodes are not mandatory in Sprint 2
  as long as homepage `LocalBusiness` still carries multi-location coverage

---

## 5. Anti-Spam Technical Contract

### 5.1 JS path

Required controls:

- Turnstile token
- `/api/form-token`
- honeypot
- rate limit `5/IP/hour`

### 5.2 No-JS path

Required controls:

- honeypot
- rate limit `2/IP/hour`
- `submission_method: "no_js"`

Explicitly not required:

- timing check

Reason:

- homepage is SSG
- no per-request token can be safely embedded into static HTML

---

## 6. Validation Contract

Server validation remains authoritative.

Minimum rules:

- `name`: required
- `phone`: required and must match VN mobile format
- `level`: optional enum
- `court`: optional enum
- `time_slot`: optional enum
- `message`: optional bounded string

Client validation:

- should improve UX
- must not replace server validation

---

## 7. Operational Requirements Before Block D/E Can Close

Must be provisioned:

- Postgres connection
- Telegram bot credentials
- email backup provider credentials
- Turnstile keys
- Sentry DSN/auth

May be deferred until after Block A/B starts, but not after Block D/E closes:

- final uptime vendor choice
- final migration tool choice

---

## 8. Technical Risks

### Risk 1 - Homepage UI parity ships without homepage SEO parity

Mitigation:

- metadata and JSON-LD are explicit Sprint 2 tickets

### Risk 2 - Client prefill logic diverges from production semantics

Mitigation:

- read directly from `lib/schedule.ts`
- compare behavior against HTML production before closing Block B

### Risk 3 - No-JS path is treated as second-class and silently breaks

Mitigation:

- no-JS submit is a success criterion, not an edge-case note
- QA must cover JS and no-JS separately

### Risk 4 - Monitoring is technically installed but not useful

Mitigation:

- require a real test error and a real `/api/health` check before closing Block E

---

## 9. No-Go Conditions

Pause before closing Sprint 2 if any of these remain unresolved:

- homepage metadata still not wired through route registry
- homepage JSON-LD missing
- schedule prefill does not set all 3 required values
- JS submit works but no-JS submit fails
- DB save is not guaranteed before notify
- Sentry is installed but unverified
- exposed homepage SEO links still point to non-ready routes

---

## 10. Recommended Build Order

1. Homepage shell plus metadata
2. Schedule cards plus prefill flow
3. ContactForm UI and local state
4. Server Action plus validation
5. DB save plus notifications
6. Anti-spam plus `/api/form-token`
7. Monitoring plus homepage JSON-LD
8. QA pass on preview

