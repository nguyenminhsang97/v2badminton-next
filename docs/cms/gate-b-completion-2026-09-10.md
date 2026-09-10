# Gate B — what actually shipped (2026-09-10)

> **Status: DONE.** Phase 1 and Phase 2 are complete and live. Phase 3 was cancelled by the
> repo owner. This document is the record of what was executed, where it departed from
> [`gate-b-junior-handbook.md`](./gate-b-junior-handbook.md), and what is still open.
>
> **Read this before the handbook.** The handbook is now history: following it top-to-bottom
> a second time would try to re-create things that already exist.

---

## 1. The live topology

```
repo (npm workspaces)
├── apps/web              → Vercel project v2badminton-next
│                            v2badminton.com, www.v2badminton.com
├── apps/studio           → Vercel project v2badminton-studio
│                            cms.v2badminton.com, v2badminton-studio.vercel.app
└── packages/schema-shared → consumed by both, Sanity-free
```

- The Studio no longer exists inside `apps/web`. `v2badminton.com/studio` is gone.
- `apps/studio` serves from the **root** of its own origin: `basePath: "/"`, so the Studio's
  own links are `/structure/…`, not `/studio/structure/…`.
- `apps/web` no longer depends on `next-sanity`. It uses `@sanity/client` + `groq` directly.

**Sanity project `w58s0f53` (`v2-badminton`), dataset `production` (public).**

| Setting | Value |
|---|---|
| CORS origins | `cms.v2badminton.com`, `v2badminton-studio.vercel.app`, `v2badminton.com`, `v2badminton-next.vercel.app`, `localhost:3000`, `localhost:3333` — all with credentials |
| Registered Studios | none (both stale registrations removed) |
| Revalidation webhook | `https://v2badminton.com/api/revalidate/sanity/`, enabled, all datasets |

**Vercel team `team_7fCxBpY1zkfDmwChuDqgsiiR`, plan Hobby.**

| Project | Root Directory | Deployment protection |
|---|---|---|
| `v2badminton-next` | `apps/web` | none |
| `v2badminton-studio` | `apps/studio` | none |

---

## 2. Where execution departed from the handbook

Each of these is a real correction, not a shortcut. If you are updating the handbook, fix it
at the source rather than re-deriving these.

### 2.1 The G12 check was too narrow (fixed in PR #114)

`git grep -n "next-sanity" -- apps/web` also matched
`apps/web/scripts/sync-faqs-locations-to-sanity.mts`, which the handbook never mentions. That
file is typechecked (`tsconfig` includes `**/*.mts`), so leaving it would have kept an
undeclared dependency alive by hoisting. It now imports `@sanity/client`, and `@next/env`
became the sixth previously-undeclared dependency.

### 2.2 Addendum §B-8 was reversed: `apps/studio` DOES carry env fallbacks

The addendum specified no `env` block, so that a missing Vercel variable would render the
"Sanity Studio is unavailable" page. In practice that made local dev and CI unusable without
an `.env` file, because a workspace `next dev` reads `process.cwd()` — the workspace
directory — and the repo's `.env.local` lives at the root.

`apps/studio/next.config.ts` now mirrors `apps/web`: it hardcodes `NEXT_PUBLIC_SANITY_PROJECT_ID`
and `NEXT_PUBLIC_SANITY_DATASET` fallbacks. A Vercel-set value still wins.

**The cost, and how it is paid.** A fallback would let a forgotten Vercel variable pass
unnoticed and silently point the Studio at the real production dataset. So the config warns on
stderr at build time when either variable is unset:

```
[studio] NEXT_PUBLIC_SANITY_PROJECT_ID is not set — falling back to the committed default.
         On Vercel this means the environment variable is missing.
```

**This is how you verify a Studio deployment's env, and it is the only reliable way.** Search
the build log for `[studio]`. No matches means all variables arrived. Do **not** infer it from
the Studio loading correctly — the fallbacks make it load either way.

### 2.3 P2.4 uses Vercel's built-in skip, not a custom Ignored Build Step

The handbook asks for:

```
git diff --quiet HEAD^ HEAD -- ./ ../../packages/schema-shared ../../package-lock.json
```

Both projects instead use **"Skip deployments when there are no changes to the root directory
or its dependencies"**, with Ignored Build Step left on `Automatic`. Two reasons:

1. It is dependency-graph aware, so it already covers `packages/schema-shared` and the root
   lockfile — the gap addendum §B-7 was patching by hand.
2. `HEAD^..HEAD` is the wrong baseline. It inspects only the last commit, so a push containing
   several commits, or a build that was previously skipped, silently skips a real change.
   Vercel exposes `VERCEL_GIT_PREVIOUS_SHA` (the last *successful* deployment) for exactly
   this, but that variable only exists once a custom Ignored Build Step is configured, so the
   handbook's command as written cannot use it.

The toggle was already on for `v2badminton-studio` (Vercel's default for new projects) and was
**Disabled** on `v2badminton-next`. Verified by PR #115 (`3e874db`), a commit touching only
`packages/schema-shared/package.json` with no lockfile change: **both** projects produced a
Production deployment for that SHA.

### 2.4 G16d's expected `/studio` 404 is really a soft-404

After the mount is deleted, `v2badminton.com/studio` returns the site's not-found page with
**HTTP 200**, not 404. That is pre-existing app-wide behaviour — every unknown path does it,
production included — and is unrelated to Gate B. Control with a made-up path before
concluding anything from it.

### 2.5 Phase 3 (G17) was cancelled

The owner confirmed nobody but them used `v2badminton.com/studio`, and they have moved to
`cms.`. No redirect was added. `CODE_RESERVED_PREFIXES` in
`apps/studio/src/sanity/schemaTypes/contentShared.ts` still reserves `/studio/`, so no CMS
document can claim that path. G17 remains in the handbook if it is ever wanted; its
precondition (`cms.v2badminton.com` live) is now met.

---

## 3. Environment traps on this machine

These cost real time. They are environmental, not repo problems.

- **`git grep` patterns containing a literal `"` are mangled** before reaching git — the quotes
  are stripped, so `from "(a|b)"` silently matches nothing and a bracket form
  `from ["](a|b)["]` makes git report `Invalid range end`. Rule R6 already warns about Git Bash
  and forward slashes; this is the same class of trap. **Always positive-control a
  "expect no output" check**: add a string you know exists to the pattern and confirm the
  pattern finds it, then run the real check. A pattern that cannot match anything looks
  identical to a clean result.
- **Vercel's root-directory picker is empty and project creation fails with
  `400 "You need to add a Login Connection"`** unless the Vercel *account* has a GitHub Login
  Connection (separate from the team's GitHub App install). Adding one needs an OAuth popup.
- **`vercel.com/new/…/import?s=<repo>/tree/<branch>` mis-parses branch names containing `/`.**
  `chore/cms-studio-cutover` was read as branch `chore`, directory `cms-studio-cutover`.
  Workaround: import from the default branch, then set Root Directory in Settings, which is a
  plain text field and needs no file tree.
- **Sanity's "This studio is not registered" screen is a wrapper around a plain
  `CorsOriginError`.** Vercel previews get a *branch alias*, which is a different origin from
  the project alias in CORS. Its "Add development host" button opens a popup.

---

## 4. Still open — this is not the end of the CMS workstream

Per [`gate-b-addendum-2026-09-09.md`](./gate-b-addendum-2026-09-09.md) §7, Gate B delivered no
editor-facing capability. These remain:

- **P1.6 — draft preview.** Editors cannot see unpublished content on the site. The
  "Mở trang trực tiếp" action always opens the *published* URL.
- **P1.7 — fail-closed fallbacks.** Content rendering still falls back to hardcoded JSX rather
  than failing closed when Sanity is unreachable.
- **CSP on the Studio origin.** `apps/studio/next.config.ts` deliberately ships no CSP — see
  addendum §B-8. Access control there is currently nothing but Sanity's own login.

Unrelated, found in the web app's runtime logs while verifying the revalidation webhook and
recorded here so it is not lost:

```
[env] TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID missing.
      Telegram lead notifications will be skipped.
```

Lead notifications are not being delivered. Pre-existing, unrelated to Gate B.

---

## 5. Rollback

Phase 1 is a single commit on `main` (`ad3cbb7`), so `git revert ad3cbb7` restores
`apps/web/src/app/studio/` and `basePath: "/studio"` together. The Vercel project and the
`cms.` domain would then need removing by hand.
