# Gate B Addendum — 2026-09-09

> **What this is.** A patch to §10.3 ("Gate B spec") of
> [`cms-studio-split-implementation-plan.md`](./cms-studio-split-implementation-plan.md).
> That spec was written on 2026-06-19 against the repo as it stood when Gate A merged
> (`249ca30`). The repo is now at `5888777`. Eight items in §10.3 no longer match the code.
>
> **Status.** Owner decision 2026-09-09: execute Gate B to close out the CMS workstream.
> The structural design in §10.3 is approved and unchanged. Everything below either
> **corrects** a step in §10.3 or **adds** a step it lacks. Where this addendum is silent,
> §10.3 still governs.
>
> **Read order:** §10.3 of the plan first, then this file. Do not execute §10.3 alone.

---

## 1. What changed in the repo since the spec was written

Gate B was specified before these landed. Each one touches a Gate B step:

| Change | Commit | Why Gate B cares |
|---|---|---|
| `FILE_ROUTE_REDIRECTS` + `redirects()` in `apps/web/next.config.ts` | `e0c507e`, `7dae6d8` | B.5 assumed `redirects()` did not exist yet |
| `/blog/` → `/tin-tuc/` rename | `7dae6d8` | Those redirect rules must survive B.5 |
| `fullPathGuardrails.test.ts` + `docs/cms/url-rename-runbook.md` | `e0c507e` | New test asserts on files on **both** sides of the split |
| `CODE_RESERVED_PREFIXES` incl. `"/studio/"` | `e0c507e` | A `/studio` literal that must **not** be mopped up in B.4 |
| `proxy.ts` canonical-host redirect | `cb131d0` era | Interacts with the B.5 redirect ordering |
| `sanityImageLoader` (browser-side Sanity CDN URLs) | `5360071` | Constrains the post-Gate-B CSP narrowing |
| `seoRegression.test.ts` | — | Part of the suite `npm test` must keep green |
| Production cutover executed on Cloudflare | tag `cutover-2026-05-11` | B.3 ("add a CNAME") is under-specified for Cloudflare |

---

## 2. Verified still correct — do not re-litigate

Checked against the working tree on 2026-09-09:

- **The boundary is clean.** No file outside `apps/web/src/sanity/` and
  `apps/web/src/app/studio/` imports from them, and no Studio file imports `@/…`.
  B.0 remains a pure file move.
- **Gate A structural prep is done.** `apps/web/src/sanity/lib/resolvePath.ts` and
  `apps/web/src/sanity/schemaTypes/shared.ts:1` are already
  `export * from "@v2/schema-shared"`. The corresponding "edits inside `apps/studio/`"
  bullets in B.0 are now **no-ops** — B.0 is smaller than the spec says.
- **B.4's literal inventory is exact.** `contentOpsStatus.ts:195`, and
  `DashboardTool.tsx` has exactly 8 `href` occurrences (502, 507, 512, 517, 536, 541,
  546, 551) plus 2 comments (18, 244) — precisely as §10.3 states.
- **Vercel target is real.** `.vercel/project.json` confirms team
  `team_7fCxBpY1zkfDmwChuDqgsiiR`, project `v2badminton-next`, and Root Directory
  `apps/web` (posture A1 was taken).
- **Redirect ordering is safe.** `next.config` `redirects` run **before** proxy
  (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md:200-212`),
  so the B.5 rule fires without a second hop through the canonical-host proxy in
  `apps/web/src/proxy.ts`.
- **`sanity.cli.ts` travels fine.** Its only non-Sanity import is `@next/env`, supplied
  by `next`, which `apps/studio` will declare.

---

## 3. Corrections to §10.3

### B-1 — B.5 must **append** to `FILE_ROUTE_REDIRECTS`, not replace `redirects()` (blocker)

§10.3 B.5 hands the junior a whole `async redirects()` block. Pasting it deletes the
`/blog/` → `/tin-tuc/` rules and turns CI red: `fullPathGuardrails.test.ts:46-49` asserts
that `next.config.ts` contains `async redirects()`, `FILE_ROUTE_REDIRECTS`, and
`return FILE_ROUTE_REDIRECTS`.

**Do this instead** — add two entries to the existing `FILE_ROUTE_REDIRECTS` array in
`apps/web/next.config.ts`, mirroring the split-rule pattern the `/blog/` entries already
use and for the same `trailingSlash: true` reason:

```ts
// /studio/* -> cms.v2badminton.com (Gate B, 2026-09-XX). Studio moved to its own
// origin; see docs/cms/gate-b-addendum-2026-09-09.md. Split into two rules for the
// same trailing-slash reason as the /blog rules above.
{ source: "/studio", destination: "https://cms.v2badminton.com/", permanent: true },
{ source: "/studio/:path+", destination: "https://cms.v2badminton.com/:path+", permanent: true },
```

**Unverified, and B.7 must settle it:** with `trailingSlash: true`, whether a deep link
such as `/studio/intent/edit/id=X;type=Y` arrives at the Studio with or without a trailing
slash on the tail, and whether Sanity's client-side router accepts the slashed form.
Run the B.7 `curl` checks **and then load each target URL in a browser**. If the slashed
tail mis-resolves, move the rule out of `redirects()` into `apps/web/src/proxy.ts`, which
issues the 308 without trailing-slash normalisation.

### B-2 — the "web sheds Sanity deps" benefit is mostly fictional as written (blocker for the stated goal)

§10.3 B.0 removes `sanity`, `@sanity/vision`, `@sanity/icons` from `apps/web` and **keeps
`next-sanity`**. But `next-sanity@12.3.1` declares these as **required** peers (no
`peerDependenciesMeta`, so none are optional):

```
@sanity/client ^7.22.0 · next ^16.0.0-0 · react ^19.2.3
react-dom ^19.2.3 · sanity ^5.22.0 · styled-components ^6.1
```

So npm reinstalls `sanity` into `apps/web` anyway. The §10.3 acceptance check
"`apps/web/package.json` no longer declares direct `sanity`" becomes cosmetic.

**What makes it real:** `next-sanity`'s `createClient` is a *pure re-export* of
`@sanity/client`'s (`node_modules/next-sanity/dist/index.js:3,7`) and its `defineQuery` is
a pure re-export from `groq` — no wrapper, no Next-specific behaviour. `@sanity/client@7.22.0`
supports the `next: { revalidate, tags }` fetch option natively
(`node_modules/@sanity/client/dist/index.d.ts:4909`), which is the only Next integration
`apps/web/src/lib/sanity/client.ts` relies on.

Web imports exactly two symbols from `next-sanity`:

| Import | File | Replacement |
|---|---|---|
| `createClient` | `src/lib/sanity/client.ts:2` | `from "@sanity/client"` |
| `defineQuery` | `src/lib/sanity/queries/shared.ts:3` | `from "groq"` |

**Decision — take option B-full:**

- **B-lite** (§10.3 as written): keep `next-sanity`. `sanity` and `styled-components`
  stay installed in web as peers. Little is gained; the acceptance check must then be
  reworded to admit it.
- **B-full** (recommended): swap those two imports, drop `next-sanity` from
  `apps/web/package.json`, and declare the phantom deps in §B-3. Web then genuinely stops
  installing the Studio. Behaviour is unchanged — both replacements are the same functions.

### B-3 — dependency lists in §3.3 are wrong in both directions (blocker)

**`apps/web` has five undeclared direct dependencies today** (imported in `src/`, absent
from `package.json`, resolved only by hoisting):

| Package | Imported in | Currently supplied by |
|---|---|---|
| `@portabletext/react` | 11 files (`ArticleView`, `CourtView`, `HubPortal`, `MoneyPageTemplate`, …) | `next-sanity`, `sanity` |
| `@portabletext/types` | 10 files | `@portabletext/react` |
| `@sanity/webhook` | `api/revalidate/sanity/route.ts:6` + its test | `next-sanity` **only** |
| `@sanity/client` | (after B-full) `lib/sanity/client.ts` | `next-sanity` |
| `groq` | (after B-full) `lib/sanity/queries/shared.ts` | `next-sanity` |

This is a latent risk today and a **build break** the moment `next-sanity` leaves web —
`@sanity/webhook` has no other provider, and it is the signature check for the ISR
revalidation webhook. Declare all five explicitly in `apps/web/package.json` as part of B.0.

**`styled-components` is mis-assigned.** §3.3 keeps it in web and omits it from studio.
Correct reading:

- `sanity@5.23.0` requires it as a peer (`^6.1.15`) → **`apps/studio` must declare it.**
  §3.3's studio list is missing it; without it the Studio build fails.
- While `next-sanity` remains in web it is also a web peer (`^6.1`), so keeping it there is
  *not* wrong under B-lite. Under **B-full it leaves `apps/web` entirely** — the app has
  zero direct `styled-components` imports (verified by grep across all of `apps/web`).

**Corrected target dependency sets (B-full):**

```
apps/web    deps: next, react, react-dom, @sentry/nextjs,
                  @sanity/client, groq, @sanity/webhook,
                  @portabletext/react, @portabletext/types,
                  @upstash/ratelimit, @upstash/redis, @vercel/postgres,
                  jose, resend, @v2/schema-shared
            removed: sanity, @sanity/vision, @sanity/icons,
                     next-sanity, styled-components

apps/studio deps: sanity, @sanity/vision, @sanity/icons, next-sanity,
                  styled-components, next, react, react-dom, @v2/schema-shared
```

Pin `next` and `react`/`react-dom` in `apps/studio` to the same versions web uses
(`next 16.2.4`, `react`/`react-dom` `19.2.4`) so one lockfile resolves one copy of each.

### B-4 — the two schema tests cannot move to `apps/studio` (blocker)

§6.2 of the plan names one test (`contentBodyImage.test.ts`) and says it "relocates with
the schema files". There are now two, and **both read files on both sides of the split**:

| Test | Reads (→ moves to studio) | Reads (→ stays in web / repo root) |
|---|---|---|
| `contentBodyImage.test.ts` | `src/sanity/schemaTypes/contentShared.ts`, `contentArticle.ts` | `src/lib/sanity/queries/shared.ts`, `src/components/content/ArticleView.tsx` |
| `fullPathGuardrails.test.ts` | `src/sanity/schemaTypes/contentShared.ts`, `src/sanity/components/FullPathPreviewInput.tsx` | `next.config.ts`, `docs/cms/url-rename-runbook.md` |

Both compute `ROOT = resolve(__dirname, "../../../../")` (= `apps/web/`). Moving them under
`apps/studio` breaks every web-side and repo-root path.

**Do this:** treat them as **repo-level contract tests**, not schema tests.

1. Move both to `apps/web/src/lib/__tests__/` — they must stay under `src/**` because
   `apps/web/vitest.config.ts` has `include: ["src/**/*.test.ts"]`, and they must **not**
   go to `apps/web/tests/`, which is Playwright's `testDir`.
2. Change `ROOT` to the repo root: `resolve(__dirname, "../../../../../")`.
3. Rewrite the read paths as repo-relative: `apps/web/next.config.ts`,
   `apps/studio/src/sanity/schemaTypes/contentShared.ts`,
   `docs/cms/url-rename-runbook.md`, etc.

**Trade-off, accepted deliberately:** `apps/web`'s suite then asserts on `apps/studio`
files, a reverse coupling. That is the contract these tests exist to protect, and they read
text rather than importing modules, so there is no build coupling and §4.4's
"no `@/…` imports in `apps/studio`" rule is untouched. The alternative — splitting each test
in half across two suites — was rejected: it doubles the files and neither half then
asserts the actual web↔schema contract.

Consequence: `apps/studio/vitest.config.ts` (plan §6.2, B.0) is **not needed**, and
`apps/studio` needs no `vitest` devDependency. The root `test` script stays
`npm run -w apps/web test`.

### B-5 — one `/studio` literal must survive B.4 (trap)

`apps/web/src/sanity/schemaTypes/contentShared.ts:59` contains `"/studio/"` inside
`CODE_RESERVED_PREFIXES`. It is **not** a Studio link — it reserves a *web* URL prefix so no
CMS document can claim a `fullPath` that a filesystem route (now a redirect) would shadow.

**It must stay `"/studio/"` after Gate B, unchanged.** B.4 says "mop up the `/studio`
literals"; whoever executes it will find this one and it is the wrong kind. After Gate B the
prefix is still shadowed — by the B-1 redirect instead of a route — so the reservation is
still required.

`fullPathGuardrails.test.ts` asserts on this file's contents, which is one more reason it
lands as a contract test (§B-4) rather than moving into the Studio workspace.

### B-6 — B.3 (DNS) is under-specified for Cloudflare

§10.3 B.3 is one line: "Add CNAME `cms.v2badminton.com` → `cname.vercel-dns.com`." The zone
is on **Cloudflare**, and the apex was cut over on `cutover-2026-05-11`
(see [`cutover-guide.md`](../cutover-guide.md) §3–4). Replace B.3 with:

1. Export the current DNS record set as a backup before touching anything
   (cutover-guide §3.1).
2. Add `CNAME cms → cname.vercel-dns.com.` with **Proxy status: DNS only (gray cloud)**.
   An orange cloud puts Cloudflare in the path and blocks Vercel's certificate issuance.
3. Check the zone for `CAA` records first. If any exist they must permit
   `letsencrypt.org`, or the certificate will hang at "Pending" (cutover-guide §4.4 STOP
   condition).
4. Verify with `nslookup cms.v2badminton.com 1.1.1.1` before adding the domain in Vercel.

Leave the apex `A 76.76.21.21` and `www` records alone. This step touches DNS only for the
new subdomain.

### B-7 — the "Ignored Build Step" filter in B.2 will skip real changes

§10.3 B.2 proposes `git diff --quiet HEAD^ HEAD ./`. With Root Directory `apps/web` /
`apps/studio`, `./` is that app's directory, so a change to `packages/schema-shared/` or to
the root `package-lock.json` would **cancel both deploys** — shipping a stale schema
against new code. Use, on each project:

```bash
git diff --quiet HEAD^ HEAD -- ./ ../../packages/schema-shared ../../package-lock.json
```

(exit 0 = skip build; non-zero = build). Verify after setting it by pushing a
`packages/schema-shared`-only change and confirming **both** projects rebuild.

### B-8 — the Studio subdomain ships with no headers and no `robots.txt`

Today the Studio inherits `apps/web`'s header block (`next.config.ts:80-99`):
`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, and
the Report-Only CSP. §10.3 specifies `apps/studio/next.config.ts` as "minimal — no CSP", so
after the split the Studio origin has none of them.

Severity is moderate, not severe: `next-sanity/studio` already exports
`metadata = { robots: "noindex", referrer: "same-origin" }`
(`node_modules/next-sanity/dist/studio/index.js:46-49`), which the Studio page re-exports,
so the pages are noindex regardless. Add as defence in depth:

- `apps/studio/src/app/robots.ts` returning `disallow: "/"` for `userAgent: "*"`, and **no**
  `sitemap` entry.
- A `headers()` block on `/:path*` with `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and
  `X-Frame-Options: SAMEORIGIN`.
- **No CSP on the Studio.** Sanity Studio needs `unsafe-eval`, `blob:` workers and a wide
  `connect-src`; a hand-written policy here will break the editor and buy nothing. Keep
  Vercel Password Protection (B.2) as the real access control.

**Env fallback — this paragraph reverses the original guidance.** It first said
`apps/studio/next.config.ts` should *not* carry web's `env: { … }` block, so that a missing
Vercel variable would surface as the "Studio is unavailable" page. The first local run of
the split (2026-09-09) showed why that was wrong:

- There is no `apps/web/.env.local` on the dev machine — only a repo-root `.env.local`,
  which `next dev` never loads because it runs with cwd = the workspace directory. The web
  app works locally *only* because of that hardcoded `env` block. Omitting it from the
  Studio made `npm run dev:studio` render a black page connecting to
  `missing-project-id.api.sanity.io`, with no documented way to fix it.
- The two values are public and already committed in `apps/web/next.config.ts`. Withholding
  them from the sibling app buys no secrecy.

So `apps/studio/next.config.ts` **does** mirror web's block for
`NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` (not `NEXT_PUBLIC_SITE_URL`,
which varies per environment and already has a default in `@v2/schema-shared`). A value set
in Vercel still wins — the config reads `process.env` first.

**The cost, and how it is paid.** A fallback turns a forgotten Vercel variable from a loud
failure into a silent one: instead of the "unavailable" page, the Studio quietly connects to
the real `production` dataset. That is the correct target anyway, so the practical risk is
narrow — it only bites if a preview was *meant* to point somewhere else. Two mitigations,
both cheap:

1. A build-time `console.warn` in `apps/studio/next.config.ts` when either variable is
   absent, so a misconfigured Vercel project is visible in the build log.
2. B.2 verification is explicit about it: after creating the project, confirm all three
   variables are actually present in the Vercel dashboard rather than inferring it from a
   working Studio.

Credit: the silent-failure trade-off was raised by the implementer during the Phase 1 run,
not caught in review.

---

## 4. Revised step order

B.0 grows (dependency work, test relocation) and B.7 gains a browser check. Otherwise the
shape of §10.3 stands.

| Step | Change vs §10.3 |
|---|---|
| **B.0** Create `apps/studio`, `git mv` Studio files, fix deps | Drop the `resolvePath.ts` / `shared.ts` edits (**already done in Gate A**). Add: §B-3 dependency sets, §B-2 two-import swap, §B-4 contract-test relocation. Drop `apps/studio/vitest.config.ts`. |
| **B.1** Sanity CORS | Unchanged. |
| **B.2** Vercel project | Fix the Ignored Build Step command (§B-7). Confirm the three env vars on a Preview deploy **before** B.3. |
| **B.3** DNS | Replaced by §B-6 (Cloudflare procedure). |
| **B.4** basePath + literal mop-up | Unchanged **except**: do not touch `contentShared.ts:59` (§B-5). |
| **B.5** Redirect on web | Replaced by §B-1 (append to `FILE_ROUTE_REDIRECTS`). |
| **B.6** Delete `apps/web/src/app/studio/` | Unchanged. |
| **B.7** Verify deep links | Keep the `curl` checks, **and** load each redirect target in a browser to settle the trailing-slash question in §B-1. |
| **B.8** *(new)* Studio `robots.ts` + headers | §B-8. Lands with B.0 or immediately after. |

---

## 5. Revised acceptance checks

Replacing the list at the end of §10.3:

- `npm run -w apps/studio build`, `lint`, `typecheck` exit 0.
- `npm run build`, `npm run lint`, `npm run typecheck`, `npm test` exit 0 **from the repo
  root** — including the two relocated contract tests and `seoRegression.test.ts`.
- `apps/web/package.json` declares none of `sanity`, `@sanity/vision`, `@sanity/icons`,
  `next-sanity`, `styled-components` — **and** `npm ls sanity --workspace apps/web` reports
  it absent rather than present-as-peer. (Under B-lite this check is dropped, not weakened.)
- `apps/web/package.json` explicitly declares `@sanity/client`, `groq`, `@sanity/webhook`,
  `@portabletext/react`, `@portabletext/types`.
- `grep -rn "@/lib\|@/components\|@/app" apps/studio/src` returns zero hits.
- `apps/web/src/app/studio/` is deleted.
- `apps/web/next.config.ts` still contains the `/blog` → `/tin-tuc` rules.
- `/studio/`, `/studio/structure/pages-group;content_article`, and a deep
  `/studio/intent/edit/...` link each return 308 to the matching `cms.v2badminton.com` URL,
  **and the target loads the intended document in a browser**.
- `curl -sI https://cms.v2badminton.com/robots.txt` serves `Disallow: /`.
- A `packages/schema-shared`-only commit rebuilds **both** Vercel projects.
- The Sanity revalidation webhook still purges tags after deploy — POST a test webhook and
  confirm a `revalidateTag` hit. This is the check that catches a botched `@sanity/webhook`
  declaration.

---

## 6. Constraints Gate B creates for later work

Record these now; both are invisible while the Studio is same-origin.

**6.1 Presentation tool will be blocked by the web app's frame headers.**
`strategic-review-2026-07-06.md` §7.3 defers visual editing to "after Gate B". Once the
Studio is on `cms.v2badminton.com`, `apps/web`'s `X-Frame-Options: SAMEORIGIN` and CSP
`frame-ancestors 'self'` will refuse to let the site be embedded in the Studio's iframe.
Whoever picks up Presentation must add `frame-ancestors https://cms.v2badminton.com` and
drop or scope `X-Frame-Options` on the previewed routes. Not a Gate B task — a Gate B
consequence.

**6.2 W8-4 (CSP narrowing) gets easier, and there is an ordering argument for doing Gate B first.**
Sanity reads in web are server-only (`src/lib/sanity/client.ts` is `import "server-only"`),
so after B.6 these `connect-src` entries exist only for the deleted Studio mount and become
removal candidates:

```
https://*.api.sanity.io   https://*.apicdn.sanity.io   https://cdn.sanity.io
```

**Keep `https://cdn.sanity.io` in `img-src`.** `sanityImageLoader`
(`apps/web/src/lib/sanity/image.ts`) is a custom `next/image` loader that hands the browser
`cdn.sanity.io` URLs directly, so the browser really does load images cross-origin.
Do **not** attribute `'unsafe-eval'` to the Studio — the comment in `next.config.ts:8-9`
ties it to GTM and Sentry, and it must stay until W8-4 re-evaluates.

Confirm each removal against real CSP reports during the bake rather than by reasoning.

---

## 7. Gate B is not the end of the CMS workstream

Stated plainly so "close the ticket" lands on the right scope. Gate B delivers a separate
Studio deployment and a clean dependency boundary. It delivers **no editor-facing
capability**. Per `strategic-review-2026-07-06.md` §12, these remain open afterwards:

| Item | Priority | Status |
|---|---|---|
| fullPath lock + rename runbook + file-route redirects | P0.1 | **Done** (`e0c507e`, `7dae6d8`) |
| Specs committed into `docs/` | P0.2 | **This PR**, for the split plan; the rest of `.claude/CMS/` is still untracked |
| SEO regression tests | P0.3 | **Done** (`seoRegression.test.ts`) |
| Blog vs content-platform decision | P0.4 | **Decided** — `blog-content-platform-addendum-2026-07-09.md`, executed by `7dae6d8` |
| Draft-mode preview with viewer token | P1.6 | Open — the largest remaining editor-trust gap |
| Fallback strategy (fail-closed pricing/schedule) | P1.7 | Open — ~800 lines of hardcoded mirrors that can serve stale prices |
| CSP narrowing + enforcement (W8-4) | P1.9 | Open — see §6.2 |

Gate B is P2.14 on that list. Doing it now is a legitimate owner call — it is
self-contained, it is the last *structural* CMS item, and §6.2 gives a real ordering
benefit ahead of W8-4. But "CMS done" should mean P1.6 and P1.7 too; neither is unblocked
by this work.

---

## 8. Rollback

Each layer reverses independently, fastest first:

| Failure | Reversal | Time |
|---|---|---|
| Studio broken on `cms.` | Revert the DNS CNAME; Studio stays reachable on `v2badminton-studio.vercel.app` | ~5 min (TTL) |
| Redirect wrong / deep links dead | Revert the B.5 commit on web; `/studio` 404s but no traffic is misrouted | one deploy |
| Web build broken by the dep swap | Revert the B.0 commit; `next-sanity` and the hoisted tree return | one deploy |
| Editors blocked entirely | Revert B.6 to restore `apps/web/src/app/studio/`; requires B.4's `basePath` also reverted to `/studio` | two commits |

Do **not** delete the `apps/web/src/app/studio/` mount (B.6) in the same deploy that first
points DNS at the new Studio. Land B.6 only after `cms.v2badminton.com` has served a real
editing session.
