# CMS / Web Split — Implementation Plan (Option B)

> **Committed to the repo on 2026-09-09**, verbatim as written on 2026-06-19, so the
> reasoning behind the workspace layout is recoverable from a fresh clone
> (`strategic-review-2026-07-06.md` §12 P0.2). It was previously untracked in `.claude/CMS/`.
>
> **Gate A is DONE** — merged 2026-06-22 (`249ca30`). Sections describing Gate A are a
> historical record, not work to do.
>
> **Gate B is NOT current as written.** Eight steps in §10.3 no longer match the code.
> Read [`gate-b-addendum-2026-09-09.md`](./gate-b-addendum-2026-09-09.md) alongside §10.3;
> it corrects them and is the governing document where the two disagree.

**Status:** Plan only — DO NOT IMPLEMENT yet.
**Author:** Tech lead (planning pass)
**Date:** 2026-06-18
**Impact check:** YELLOW — see `.claude/CMS/CMS-STUDIO-SPLIT-IMPACT-CHECK.md`
**Recommendation source:** `.claude/CMS/CMS-STUDIO-SPLIT-TIMING-RECHECK.md`
**Target structure:** `apps/web/`, `apps/studio/`, `packages/schema-shared/` under one repo

This plan is partitioned into **two approval gates**:

- **Gate A — Code split inside the repo.** Branch off fresh `main`, do the workspace/folder reorganisation, land it on `main`. No Vercel/DNS/CORS/redirect changes in this gate. Public site and Studio continue to deploy from the existing single Vercel project off `v2badminton.com/studio`. This gate is internally reversible.
- **Gate B — External cutover.** Create the second Vercel project, point `cms.v2badminton.com`, add Sanity CORS origin, change Studio basePath to `/`, add `/studio/*` → 308 redirect on web, delete the Studio mount route from web. This gate requires owner approval at the start (not during code edits) because it touches DNS, Vercel, and Sanity dashboard settings.

The plan below covers **Gate A in full detail** and **Gate B as a pre-approved spec** (no execution until owner gives the go).

---

## 0. YELLOW risk → plan-section traceability

Every YELLOW risk from §8 of the impact check is addressed by an explicit section here.

| YELLOW risk | Addressed in |
|---|---|
| Branch/base risk (must start from fresh `main`) | §1 |
| Lint/search risk (`.claude/worktrees/**` not ignored) | §2, §7 |
| Shared package design risk (`resolvePath` `sanity` type) | §5 |
| External deployment risk (Vercel/DNS/CORS unprovable from repo) | §10 |
| Redirect risk (`/studio/intent`, `/studio/structure` deep links) | §10 |
| Test risk (Vitest coverage drift) | §6 |
| Env risk (Studio inheriting web secrets) | §10 |
| Top-5 impact risk #1 (Vercel/DNS/CORS coordination) | §10 |
| Top-5 impact risk #2 (deep-link redirect correctness) | §10 |
| Top-5 impact risk #3 (build/test/lint script drift) | §3, §4, §6, §7 |
| Top-5 impact risk #4 (shared package dependency hygiene) | §5 |
| Top-5 impact risk #5 (PR5 overlap) | §8 |
| Explicit freeze list (PR5 content, nav flip, tracking, schema, GROQ, sitemap, webhook) | §8 |
| Exclude-from-split list (CMS-DP, CMS-DELIVERY-OPT, CMS-IMG-OPT, inline images, W8-4 CSP, analytics) | §8, §9 |
| **Gate A bridge contradiction (Codex recheck — see `CMS-STUDIO-SPLIT-PLAN-RECHECK.md`)** | §3.3, §10, §11, §12 — Studio code stays inside `apps/web/` for all of Gate A; no cross-workspace import; `apps/studio/` does not exist until Gate B |

---

## 1. Start from fresh `main`, not `docs/cms-img-opt-audit`

### 1.1 Current state (verified)

- Working branch: `docs/cms-img-opt-audit` at `5f0c399`.
- `origin/main` at `536007105b46658eea81f0f1599eb789cb21cb54` ("5360071").
- `git diff main..HEAD --stat` shows one in-flight delta: `tickets/CMS-IMG-OPT.md` (97 lines). That delta is the docs ticket for the image-optimization audit; it is **not** related to the split.
- **Tracked-modified file present (final-readiness review):** `.codex/config.toml` has unstaged modifications adding MCP server entries (cloudflare, vercel, sentry, sanity). This is **not** related to the split. See §1.5.

### 1.2 Procedure

The split branch is cut **only** after the working tree is clean and HEAD points at the freshly-fetched `origin/main` SHA. The image-optimization docs ticket is **outside** the split scope.

```bash
# 1. Make sure any in-flight work on docs/cms-img-opt-audit is committed or stashed.
git status --short                          # expect: only untracked artifacts (see §2)
git stash push -u -m "pre-split-stash"      # only if there's anything to stash

# 2. Fetch the authoritative remote main.
git fetch origin --prune

# 3. Confirm origin/main matches expectations.
git rev-parse origin/main                   # expect: 536007105b46658eea81f0f1599eb789cb21cb54 (or newer)

# 4. Cut the split branch FROM origin/main, not from local HEAD.
git switch --create chore/cms-studio-split origin/main

# 5. Confirm zero diff vs origin/main on the new branch.
git rev-parse HEAD                          # equal to origin/main SHA
git diff origin/main..HEAD --stat           # empty
git log origin/main..HEAD --oneline         # empty

# 6. Tag main for rollback reference (lightweight, local).
git tag pre-split-snapshot origin/main
```

### 1.3 Why not branch off `docs/cms-img-opt-audit`

- The image-audit docs ticket has nothing to do with the split. Carrying it forward means the split PR contains unrelated docs churn, which (a) confuses reviewers, (b) couples the split's mergeability to the image-audit ticket's review, (c) widens rollback blast radius.
- If the image-audit docs PR merges first, no work is lost — the split branch will rebase cleanly. If it merges after, the split-branch git history is unaffected.

### 1.4 Forbidden during this phase

- Do **not** `git merge docs/cms-img-opt-audit` into the split branch.
- Do **not** rebase the split branch onto a feature branch — only onto `origin/main`.
- Do **not** edit `tickets/CMS-IMG-OPT.md` from the split branch.

### 1.5 BLOCKER — handle `.codex/config.toml` modification before branch cut

The repo currently has tracked modifications in `.codex/config.toml`. This blocks the procedure in §1.2 because step 1 (`git stash push -u`) would either drag the change into a stash or leave a dirty tree when the branch is cut, which makes the `git diff origin/main..HEAD --stat` empty-check unreliable.

**Sonnet must NOT silently `git stash`, `git restore`, or `git checkout --` this file.**

**Required action: stop and ask the owner.** Present the diff and the three options:

```
You have unstaged changes to .codex/config.toml that add MCP server entries
(cloudflare, vercel, sentry, sanity). These are unrelated to the CMS/Web split.

How should I proceed?

  (a) Commit the change on its own ticket branch (e.g. chore/codex-mcp-toml),
      push, then start the split branch from clean origin/main.
  (b) Stash with explicit acknowledgement:
        git stash push -m "codex-mcp-config" -- .codex/config.toml
      and restore after the split branch is created and verified clean.
  (c) Discard the change (only if you explicitly say so — destructive).

I will not pick. Please answer (a), (b), or (c).
```

The plan resumes at §1.2 only after the owner responds and the working tree is clean.

---

## 2. Untracked / ignored local artifacts — no careless `git add -A`

### 2.1 Current untracked surface (verified)

Top-level untracked entries observed at start of session:
- `.codex/tmp/`
- `.mcp.json`
- `outputs/`
- `w1-h1-1440.png`
- `w1-h1-1440-redline.png`
- `w1-h1-375.png`

Git-ignored but locally present and relevant:
- `.claude/` (entire directory — includes `worktrees/` with multiple parallel worktrees: `cms-phase-1/`, `cms-w3a-static-page-schema/`, `cms-w4-site-settings/`, `fervent-nightingale-dc10c9/`, `funny-williamson-3b5552/`, …)
- `.next/`, `node_modules/`, `.vercel/`, `.lighthouseci/`, `.playwright-mcp/`, `test-results/`, `playwright-report/`

### 2.2 Rule: never `git add -A` / `git add .` on this branch

Every commit in the split uses **explicit paths only**:

```bash
# CORRECT — explicit
git add packages/schema-shared/ package.json package-lock.json

# FORBIDDEN — broad
git add -A
git add .
git add :
```

The commit-by-commit plan in §11 lists exact paths for every commit. Each commit must end with `git status --short` showing only intended changes.

### 2.3 ESLint must ignore `.claude/worktrees/**` before first lint run

The current `eslint.config.mjs` does **not** ignore `.claude/worktrees/**`. A broad lint pass on the new monorepo could descend into worktree copies of the repo and lint them too. Fix at the very first commit (see §11, commit 01).

Add to `globalIgnores([...])`:

```js
".claude/**",         // any local Claude artifacts
".codex/**",          // local Codex artifacts
".codex-artifacts/**",
"outputs/**",
"*.png",              // top-level dev screenshots like w1-h1-*.png
"apps/*/.next/**",
"apps/*/.lighthouseci/**",
"packages/*/dist/**",
```

(The existing default ignores from `eslint-config-next` and the current `globalIgnores` for `.next/**`, `out/**`, `build/**`, etc., stay.)

### 2.4 Pre-commit guard (manual, no hook)

Before each `git commit`:

```bash
git diff --cached --stat       # review every line of the staged set
git status --short             # any "??" entries are NOT in the commit, by design
```

If `git diff --cached --stat` shows anything outside the planned commit's scope, unstage and re-stage with explicit paths.

---

## 3. Workspace + package-lock strategy

### 3.1 Layout

Gate A layout is intentionally smaller than the final target:

- `apps/web/` exists and contains the public web app **plus the existing `/studio` mount and Studio source**.
- `packages/schema-shared/` exists.
- `apps/studio/` does **not** exist until Gate B.

Gate B target layout:

```
v2badminton-next/                  # repo root
├── package.json                    # workspace manifest + thin orchestrator scripts
├── package-lock.json               # ONE root lockfile, npm-managed
├── tsconfig.base.json              # shared TS compilerOptions (see §4)
├── eslint.config.mjs               # root flat config; per-app overrides at app paths
├── .github/workflows/              # CI orchestrates per-app commands
├── apps/
│   ├── web/                        # current public Next.js app
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── next.config.ts
│   │   ├── eslint.config.mjs       # extends root, scoped to apps/web
│   │   ├── vitest.config.ts
│   │   ├── playwright.config.ts
│   │   ├── public/, tests/, scripts/, seed/, src/
│   │   └── .lighthouserc.*.json
│   └── studio/                     # Sanity Studio as a thin Next.js shell
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.ts          # minimal
│       ├── sanity.config.ts
│       ├── sanity.cli.ts
│       ├── vitest.config.ts        # if any Studio tests are kept here
│       └── src/sanity/
└── packages/
    └── schema-shared/
        ├── package.json
        ├── tsconfig.json
        └── src/
            ├── index.ts
            ├── options.ts
            └── resolvePath.ts
```

### 3.2 Root `package.json` shape

```json
{
  "name": "v2badminton",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev:web":        "npm run -w apps/web dev",
    "dev":            "npm run dev:web",
    "build:web":      "npm run -w apps/web build",
    "build":          "npm run -w packages/schema-shared typecheck && npm run build:web",
    "lint":           "npm run -w apps/web lint",
    "typecheck":      "npm run -w packages/schema-shared typecheck && npm run -w apps/web typecheck",
    "test":           "npm run -w apps/web test",
    "test:e2e":       "npm run -w apps/web test:e2e",
    "verify:production-env": "npm run -w apps/web verify:production-env"
  },
  "devDependencies": {
    "typescript": "^5"
  }
}
```

**No runtime deps at root.** Each workspace owns its own deps. TypeScript is the one shared dev dep at root for tsc orchestration; if the workspaces hoist it cleanly we keep this minimal, otherwise we let each workspace own its `typescript`.

Gate A root scripts must only call workspaces that exist: `apps/web` and `packages/schema-shared`. In Gate A, `packages/schema-shared` is verified through `typecheck` because it has zero runtime deps and no separate ESLint config. Gate B introduces `dev:studio`, `build:studio`, and adds `apps/studio` to root `build`, `lint`, `typecheck`, and `test` after B.0 creates the workspace.

### 3.3 Workspace dep splits

> **Codex recheck applied — see `CMS-STUDIO-SPLIT-PLAN-RECHECK.md`.** Gate A keeps Studio code inside `apps/web/`. `apps/studio/` does **not** exist at the end of Gate A. The dep table below is split into Gate A reality and Gate B target.

**Gate A — `apps/web/package.json` deps** (mirrors current root, plus the new workspace dep):
- `next`, `react`, `react-dom`
- `@sentry/nextjs`
- `next-sanity` (used by **both** the server-side read client and the Studio mount; stays here in Gate A)
- `sanity`, `@sanity/vision`, `@sanity/icons` (Studio runtime — temporary in Gate A because Studio runs inside `apps/web`; moved to `apps/studio` in Gate B)
- `@upstash/ratelimit`, `@upstash/redis`, `@vercel/postgres`
- `jose`, `resend`, `styled-components`
- `@v2/schema-shared` (workspace)

**Gate A — `apps/web/package.json` devDeps:**
- `@playwright/test`, `playwright`
- `@types/node`, `@types/react`, `@types/react-dom`
- `@vitejs/plugin-react`, `vitest`
- `eslint`, `eslint-config-next`, `typescript`

**Gate A — `apps/studio/package.json`:** does not exist. Studio code lives at `apps/web/sanity.config.ts`, `apps/web/sanity.cli.ts`, and `apps/web/src/sanity/`. The `/studio` mount is `apps/web/src/app/studio/[[...tool]]/` — unchanged behaviour relative to today, just relocated under `apps/web/`.

**Gate A — `packages/schema-shared/package.json`:**
```jsonc
{
  "name": "@v2/schema-shared",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5"
  }
}
```

- Runtime `dependencies`: **none** (shared-package hygiene risk fix — see §5). The `dependencies` field is omitted entirely.
- `main` and `types` point at the source file because consumers resolve via tsconfig paths (§4.2) and bundle via `transpilePackages` (§4.5). No build step required for the package.
- The `typecheck` script is required because the root `package.json` `typecheck` orchestrator (§3.2) calls `npm run -w packages/schema-shared typecheck`.

**Gate B target — `apps/web/package.json` deps** (after Studio moves and mount is deleted):
- `next`, `react`, `react-dom`
- `@sentry/nextjs`
- `next-sanity` (server-side read client only)
- `@upstash/ratelimit`, `@upstash/redis`, `@vercel/postgres`
- `jose`, `resend`, `styled-components`
- `@v2/schema-shared` (workspace)
- **Removed in Gate B:** `sanity`, `@sanity/vision`, `@sanity/icons`

**Gate B target — `apps/studio/package.json` deps:**
- `sanity`, `@sanity/vision`, `@sanity/icons`
- `next-sanity`, `next`, `react`, `react-dom` (thin Next.js shell hosting `NextStudio`)
- `@v2/schema-shared` (workspace)

**Gate B target — `apps/studio/package.json` devDeps:**
- `@types/react`, `@types/react-dom`, `typescript`
- `eslint`, `eslint-config-next`
- `vitest` only if Studio retains schema tests (see §6)

### 3.4 Lockfile strategy

- **One** lockfile at repo root. Never commit per-workspace lockfiles (`apps/*/package-lock.json` etc. — would be created if anyone runs `npm install` inside a workspace dir without `-w`).
- The lockfile is regenerated **once** at the workspace conversion commit, by deleting the existing `package-lock.json` and running `npm install` from the root after the workspaces are declared. We allow `npm` to choose dependency hoisting — no manual lock edits.
- After regeneration, the lockfile diff will be large. That diff is its own commit so reviewers can see (a) workspace conversion and (b) lockfile churn separately.

Procedure:
```bash
rm package-lock.json
npm install
git add package.json package-lock.json
# Commit as 04 in §11.
```

`npm ci` is the verification — if `npm ci` succeeds in CI on the new lock, we're clean.

The root `"workspaces": ["apps/*", "packages/*"]` glob is valid in Gate A even though `apps/*` only matches `apps/web`; npm resolves existing workspace folders and does not require `apps/studio` to exist. The constraint is on scripts and CI: do not target `apps/studio` until Gate B creates it.

### 3.5 `.gitignore` additions

Add to root `.gitignore` after the workspaces land:

```
# workspace build outputs (in addition to existing /.next/)
apps/*/.next/
apps/*/.lighthouseci/
apps/*/dist/
packages/*/dist/
apps/*/.vercel/
```

Keep the existing `.env*` / `.vercel` / `.sanity/` / `.next/` ignores at root.

---

## 4. `tsconfig` and `@` alias strategy

### 4.1 Per-workspace, not solution-references — keep it simple

Solution references (`composite: true` + `references`) work but add tsc orchestration complexity. For Gate A's two workspaces (`apps/web`, `packages/schema-shared`) and Gate B's three-workspace target, the simpler model is:

- **`tsconfig.base.json`** at root — compilerOptions only. Each workspace `tsconfig.json` extends this.
- Each workspace has its **own** `@/*` alias scoped to its own `src/`. There is **no** cross-app `@/*` reachability.
- The shared package is consumed by its workspace export name `@v2/schema-shared` — not via an `@/*` alias.

### 4.2 Files

**`tsconfig.base.json`** (root, no `paths`, no `include`):
```jsonc
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true
  }
}
```

**`apps/web/tsconfig.json`**:
```jsonc
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@v2/schema-shared": ["../../packages/schema-shared/src/index.ts"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules", ".next", "tests/.playwright"]
}
```

**Gate B only — `apps/studio/tsconfig.json`**:
```jsonc
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@v2/schema-shared": ["../../packages/schema-shared/src/index.ts"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", ".next"]
}
```

**`packages/schema-shared/tsconfig.json`**:
```jsonc
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true   // shared package is consumed as source via paths above
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 4.3 Why consume the shared package as source (paths) and not as build output

- **No tsc orchestration.** `composite` + `references` + emit-then-consume adds build step ordering for both apps' Next dev servers. Source consumption via `paths` lets each app's bundler (Next/Webpack/SWC) read `.ts` directly.
- **The package has no transitive deps.** Nothing needs compiling before web/studio can read it.
- **Single source of truth verified by `paths`.** No risk of stale dist.
- **Workspace name still works** — when published or imported as `@v2/schema-shared`, TS resolves via `paths` first, npm workspace symlink second. Both resolve to the same files.

### 4.4 Alias safety checks (Yellow risk: top-5 #3 build script drift)

- Gate A: `@/*` on web points only at `apps/web/src/*`. Non-Studio web code must not import `@/sanity`; Studio code under `apps/web/src/sanity/` and `apps/web/src/app/studio/` is the allowed Gate A exception.
- Gate A: shared-package consumers in `apps/web` import from `@v2/schema-shared`, never from a relative `../../packages/...` path.
- Gate B: `@/*` on studio points only at `apps/studio/src/*`. A test like `grep -rn "@/lib\|@/components\|@/app" apps/studio` must return zero hits.
- Gate B: shared-package consumers in both apps **only ever** import from `@v2/schema-shared`, never from a relative `../../packages/...` path.

### 4.5 Next.js `transpilePackages` requirement (final-readiness review)

`apps/web` consumes `@v2/schema-shared` as a workspace package. npm workspaces creates a symlink at `apps/web/node_modules/@v2/schema-shared` → `../../packages/schema-shared/`. When Next.js's SWC compiler resolves the import via Node module resolution (the bundler's default at runtime, regardless of tsconfig paths), it sees a `.ts` file under `node_modules` and — by default — refuses to transpile it. Build fails.

**Required addition in Commit 05** — `apps/web/next.config.ts` gets one new option:

```ts
const nextConfig: NextConfig = {
  // ...existing keys (env, images, trailingSlash, poweredByHeader, headers) unchanged...
  transpilePackages: ["@v2/schema-shared"],
};
```

This is the **only** allowed deviation from §9's "next.config.ts moves verbatim" rule. It is a build-config necessity, not a CSP/Sentry/image-config change. Verification in §12 separates this allowed change from the forbidden CSP/Sentry/image diffs.

Why not `outputFileTracingRoot` widening: `transpilePackages` bundles the shared-package source into `apps/web`'s output, so Next's file tracer doesn't need to widen beyond `apps/web/`. This is exactly the property that lets Vercel Root Directory = `apps/web` (A1, §10.2) work safely without cross-workspace tracing.

Why not `experimental.externalDir`: that flag is for cases where the bundler resolves a non-workspace sibling path (e.g. a symlinked folder outside the project). The workspace setup here doesn't need it because npm workspaces makes `@v2/schema-shared` look like a normal package import once `transpilePackages` is set.

---

## 5. Moving `resolvePath` without adding a `sanity` runtime dependency to web

### 5.1 The risk (verified in impact check §3 and §4)

`src/sanity/lib/resolvePath.ts:14` has:

```ts
import type { SanityDocument } from "sanity";

export type RoutableDoc = SanityDocument & {
  slug?: SlugValue;
  fullPath?: SlugValue;
};
```

If `packages/schema-shared` keeps this import, then `packages/schema-shared/package.json` must list `sanity` as a dependency. Since `apps/web/package.json` lists `@v2/schema-shared`, npm will install `sanity` into `node_modules` for the web app — and a Studio runtime dep leaks into the web build.

`import type` is erased by TypeScript, **but** TS still needs the type's resolver during typecheck. If `sanity` isn't installed in the workspace, typecheck of `apps/web` fails.

### 5.2 The fix — structural `RoutableDoc`

`resolvePath` only ever reads `_type`, `slug.current`, and `fullPath.current`. The full `SanityDocument` shape (`_id`, `_rev`, `_createdAt`, `_updatedAt`, etc.) is not used by the function. The export shape can be made structural with zero behaviour change.

In `packages/schema-shared/src/resolvePath.ts`:

```ts
type SlugValue = { current?: string };

export type RoutableDoc = {
  _type?: string;
  slug?: SlugValue;
  fullPath?: SlugValue;
};

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "https://v2badminton.com"
).replace(/\/+$/, "");

export const ROUTABLE_TYPES = new Set([
  "homepage_content",
  "content_hub",
  "content_node",
  "content_article",
  "court",
  "money_page",
  "static_page",
  "post",
] as const);

export function ensureLeadingSlash(path: string): string { /* unchanged */ }
export function ensureTrailingSlash(path: string): string { /* unchanged */ }

export function resolvePath(
  schemaType: string,
  doc: RoutableDoc | null,
): string | null { /* identical body */ }

export function resolveFullUrl(
  schemaType: string,
  doc: RoutableDoc | null,
): string | null {
  const path = resolvePath(schemaType, doc);
  return path ? `${SITE_URL}${path}` : null;
}
```

**No `import type { SanityDocument }`. No `sanity` package dep in `schema-shared`.**

### 5.3 Studio call sites that use `RoutableDoc`

Only one caller widens to `RoutableDoc` today:
- `src/sanity/actions/openLivePageAction.tsx`: `const doc = (published ?? draft) as RoutableDoc | null;`

That cast works the same whether `RoutableDoc` extends `SanityDocument` or not, because the Studio's `published` / `draft` already are `SanityDocument`-typed at the call site. Loosening to structural is safe.

### 5.4 Acceptance for this risk

- `packages/schema-shared/package.json` has zero runtime `dependencies`. (`grep '"dependencies"' packages/schema-shared/package.json` shows none, or an empty object.)
- `grep -rn "from \"sanity\"" packages/schema-shared/src` returns zero hits.
- `grep -rn "import type.*from \"sanity\"" packages/schema-shared/src` returns zero hits.
- `apps/web/tsconfig.json` typecheck passes whether or not `sanity` is a transitive dep of web.

**Note (Codex recheck):** during **Gate A**, `apps/web` legitimately declares `sanity`, `@sanity/vision`, and `@sanity/icons` as deps because the Studio runs inside the web app. The original plan's "no sanity in web" check was misplaced for Gate A and has been moved to Gate B's acceptance criteria, after the web Studio mount is deleted. See §12 and `CMS-STUDIO-SPLIT-PLAN-RECHECK.md`.

---

## 6. Vitest coverage for both web and Studio/schema tests

### 6.1 Current test inventory (verified)

```
src/app/api/revalidate/sanity/__tests__/route.test.ts        ← web (webhook handler)
src/lib/sanity/__tests__/image.test.ts                       ← web (image loader)
src/lib/sanity/__tests__/revalidationMap.test.ts             ← web (cache-tag map)
src/sanity/schemaTypes/__tests__/contentBodyImage.test.ts    ← Studio (schema file, read as TEXT not import)
```

The Studio schema test is interesting: it reads `contentArticle.ts` as text via `node:fs` rather than importing it, so it has **no runtime coupling** to the Sanity SDK. That makes it portable.

### 6.2 Plan

**Don't centralise.** Each workspace owns its own Vitest config and test discovery. This avoids the "moved a file, silently lost a test" failure mode that the impact check flags.

**Gate A — all four tests run under `apps/web/vitest.config.ts`** because Studio code is colocated under `apps/web/src/sanity/` during Gate A:

| Test file | Gate A location | Gate B location |
|---|---|---|
| `route.test.ts` | `apps/web/src/app/api/revalidate/sanity/__tests__/route.test.ts` | unchanged |
| `image.test.ts` | `apps/web/src/lib/sanity/__tests__/image.test.ts` | unchanged |
| `revalidationMap.test.ts` | `apps/web/src/lib/sanity/__tests__/revalidationMap.test.ts` | unchanged |
| `contentBodyImage.test.ts` | `apps/web/src/sanity/schemaTypes/__tests__/contentBodyImage.test.ts` | moves to `apps/studio/src/sanity/schemaTypes/__tests__/contentBodyImage.test.ts` |

**`apps/web/vitest.config.ts`**:
```ts
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@v2/schema-shared": resolve(__dirname, "../../packages/schema-shared/src"),
    },
  },
});
```

**`apps/studio/vitest.config.ts`** is **not** created in Gate A — `apps/studio/` does not exist yet. It is created in Gate B, at which point `contentBodyImage.test.ts` relocates with the schema files. Path constants inside the test that use `resolve(__dirname, "...")` are adjusted as part of the Gate B move, not Gate A.

When Gate B creates the file, it uses:
```ts
// apps/studio/vitest.config.ts (Gate B only)
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@v2/schema-shared": resolve(__dirname, "../../packages/schema-shared/src"),
    },
  },
});
```

### 6.3 Coverage drift detection (mandatory)

Before merge of Gate A:

```bash
# 1. Pre-split: capture the test list from origin/main.
git switch pre-split-snapshot
git grep -l "^describe\|^test\|^it" 'src/**/*.test.ts' | sort > /tmp/tests-before.txt

# 2. Post-split: capture the test list from the split branch.
git switch chore/cms-studio-split
git grep -l "^describe\|^test\|^it" 'apps/*/src/**/*.test.ts' | sort > /tmp/tests-after.txt

# 3. Compare basenames.
diff <(sed 's|.*/||' /tmp/tests-before.txt) <(sed 's|.*/||' /tmp/tests-after.txt)
```

If the diff is non-empty, a test was renamed, deleted, or duplicated — investigate before merging.

### 6.4 CI runs every Gate A test from web

The root `npm test` script (§3.2) is `npm run -w apps/web test` during Gate A. That still runs the full existing test set because Studio source and Studio tests remain inside `apps/web` until Gate B.

Gate B updates the root test script to include `apps/studio` after `apps/studio/vitest.config.ts` is created with the relocated schema test.

---

## 7. Playwright, Lighthouse, CI, and ESLint ignores

### 7.1 Playwright

Stays web-only. Move `playwright.config.ts` and `tests/` under `apps/web/`. Update `webServer.command`:

```ts
// apps/web/playwright.config.ts
webServer: {
  command: "npm run dev",              // runs from apps/web after move; npm scripts always run in the package dir
  url: "http://127.0.0.1:3000",
  reuseExistingServer: true,
  timeout: 120_000,
},
```

`testDir: "./tests"` is correct because tests is relative to `apps/web/`. No port change.

`npm run test:e2e` at the root delegates to `npm run -w apps/web test:e2e` per §3.2.

### 7.2 Lighthouse CI

Stays web-only. `.lighthouserc.desktop.json` and `.lighthouserc.mobile.json` move into `apps/web/` (already covered in Commit 05). The workflow file needs to be updated so every step that touches build/start/collect/artifacts runs against `apps/web` instead of repo root. The pre-split workflow has 7 steps that depend on root layout; the post-split version is:

```yaml
# .github/workflows/lighthouse.yml (post-split, Gate A)
- name: Restore Next.js cache
  uses: actions/cache@v5
  with:
    path: apps/web/.next/cache
    key: ${{ runner.os }}-nextjs-lhci-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('apps/web/**/*.{js,jsx,ts,tsx}') }}
    restore-keys: |
      ${{ runner.os }}-nextjs-lhci-${{ hashFiles('**/package-lock.json') }}-

- name: Install dependencies
  run: npm ci

- name: Build (apps/web)
  run: npm run -w apps/web build

- name: Start Next.js (apps/web)
  working-directory: apps/web
  run: npm run start -- -H 127.0.0.1 -p 3000 > next-start.log 2>&1 &

- name: Wait for app
  run: npx wait-on@9.0.5 http://127.0.0.1:3000/

- name: Collect mobile reports
  working-directory: apps/web
  run: npx @lhci/cli@0.15.1 collect --config=.lighthouserc.mobile.json

- name: Collect desktop reports
  working-directory: apps/web
  run: npx @lhci/cli@0.15.1 collect --config=.lighthouserc.desktop.json --additive

- name: Upload temporary Lighthouse reports
  working-directory: apps/web
  run: npx @lhci/cli@0.15.1 upload --target=temporary-public-storage

- name: Upload raw Lighthouse artifacts
  uses: actions/upload-artifact@v7
  with:
    name: lighthouse-reports
    path: apps/web/.lighthouseci
    if-no-files-found: error
    include-hidden-files: true
```

Three things to watch when updating this file in Commit 07:
1. `path: ${{ github.workspace }}/.next/cache` → `path: apps/web/.next/cache` (and adjust hash glob).
2. The `Start Next.js` step gets `working-directory: apps/web` so the `npm run start` resolves the right `package.json`.
3. Every `npx @lhci/cli@0.15.1 collect/upload` step gets `working-directory: apps/web` so the config paths and `.lighthouseci` output dir resolve to `apps/web/`.
4. The artifact upload `path:` becomes `apps/web/.lighthouseci`.

URLs stay at `http://127.0.0.1:3000` — Lighthouse hits the locally-served web app on the same port.

### 7.3 CI workflow rewrite

Single job, still cheap. Replace the build step with workspace-aware steps:

```yaml
# .github/workflows/ci.yml (post-split)
jobs:
  verify:
    name: Lint, typecheck, build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with: { node-version: 22, cache: npm }
      - name: Restore web Next.js cache
        uses: actions/cache@v5
        with:
          path: apps/web/.next/cache
          key: ${{ runner.os }}-nextjs-web-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('apps/web/**/*.{js,jsx,ts,tsx}') }}
          restore-keys: ${{ runner.os }}-nextjs-web-${{ hashFiles('**/package-lock.json') }}-
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
      - run: npm test
```

`npm ci` at root installs all Gate A workspaces. `npm run lint/typecheck/build/test` fan out via the root scripts in §3.2 and target only `apps/web` plus `packages/schema-shared` during Gate A (`lint` is web-only; `typecheck` covers `packages/schema-shared`). Gate B adds the Studio cache and Studio root-script fanout after `apps/studio` exists.

### 7.4 ESLint ignores

Root `eslint.config.mjs` adds the `.claude/worktrees/**` ignore + monorepo-scoped ignores up front, before any workspace move. This is the very first commit in §11 — without it, a `npm run lint` after the workspaces land could lint files under `.claude/worktrees/.../node_modules/...` (huge slow noise) or recurse into worktree copies that have their own `apps/`.

Augmented `globalIgnores([...])` set (additions only):

```js
".claude/**",
".codex/**",
".codex-artifacts/**",
"outputs/**",
"w1-h1-*.png",
"*-mobile-*.png",
"apps/*/.next/**",
"apps/*/.lighthouseci/**",
"apps/*/.vercel/**",
"packages/*/dist/**",
"node_modules/**",
"**/node_modules/**",
```

Gate A creates only `apps/web/eslint.config.mjs`, which re-exports the root config so per-workspace `npm run lint` works the same way. Gate B creates `apps/studio/eslint.config.mjs` with the same re-export after the Studio workspace exists:

```js
// apps/*/eslint.config.mjs
export { default } from "../../eslint.config.mjs";
```

---

## 8. Freeze: PR5, `EXPOSE_SAN_CAU_LONG`, and the rest

### 8.1 Per the impact check §8.3, the following are FROZEN for the duration of Gate A + Gate B

- **PR5 content creation** in Sanity (no new courts, no new hub publishes, no editorial draft promotion).
- **`EXPOSE_SAN_CAU_LONG`** stays `false` in `Nav.tsx`. The split moves the file from `src/components/layout/Nav.tsx` to `apps/web/src/components/layout/Nav.tsx` **without touching that line**.
- **`cms_court_cta_click`** and any other tracking event semantics in `src/lib/tracking.ts` — pure import-path move only.
- **Court schema** (`court.ts`, `routeRedirect.ts`) — pure file move, no field rename or validation change.
- **Court GROQ** (`src/lib/sanity/queries/court.ts`, court projections in `shared.ts`) — pure file move.
- **`CourtView` renderer** — pure file move, no JSX or prop change.
- **Sitemap behavior** (`src/app/sitemap.ts`) — pure file move; priority `0.6` for `court` unchanged.
- **Sanity webhook** — endpoint URL stays `https://v2badminton.com/api/revalidate/sanity`. Webhook config in Sanity dashboard is **not** touched.
- **GA4 / GTM / Sanity / Vercel settings** — no dashboard changes except those explicitly listed in Gate B (§10).

### 8.2 Mechanical guard on `EXPOSE_SAN_CAU_LONG`

The verification checklist (§12) includes:

```bash
# Must match BOTH before AND after the split.
git grep -n "EXPOSE_SAN_CAU_LONG = false" -- 'src/**/Nav.tsx' 'apps/web/**/Nav.tsx'
```

The string `EXPOSE_SAN_CAU_LONG = false` must appear in exactly one file at all times. Any change of `false` → `true` during the split is a defect.

### 8.3 Items EXCLUDED from the split branch (per impact check §8.4)

The following are explicitly off-limits on `chore/cms-studio-split`:

- CMS-DP (article draft preview)
- CMS-DELIVERY-OPT follow-up
- CMS-IMG-OPT image optimization work
- Inline body image feature changes
- New CMS content, draft seeding, or publishing
- PR5 nav exposure
- W8-4 CSP enforcement / tightening (§9)
- Analytics event additions/changes
- Sanity schema design changes (beyond import-path relocation and the `shared.ts` extraction to `packages/schema-shared`)

If any of these arrive on `main` during the split window, the split branch rebases onto the new `main` — it does **not** absorb that work as its own commits.

---

## 9. CSP unchanged during split

The current `next.config.ts` ships `Content-Security-Policy-Report-Only` with broad allowances (including `'unsafe-eval'` for GTM and Sentry). The W8-4 ticket plans to narrow and enforce this later.

**Rule for this branch:** the CSP string is moved verbatim from `next.config.ts` (root) to `apps/web/next.config.ts`. No directive is added, removed, or reordered. No `unsafe-eval` removal "because Studio is no longer on this app." That trim belongs to W8-4 and can be done after the split lands, as a separate ticket.

**Single allowed deviation from "moved verbatim":** `transpilePackages: ["@v2/schema-shared"]` is added to the top-level `NextConfig` object (see §4.5 for why). It does not affect CSP, Sentry, image config, headers, or runtime behaviour for end users. Everything else in `next.config.ts` is byte-identical to the pre-split snapshot.

Verification:
```bash
# Pre-split snapshot.
git show pre-split-snapshot:next.config.ts | grep -A 30 "CSP_REPORT_ONLY = \[" > /tmp/csp-before.txt

# Post-split.
cat apps/web/next.config.ts | grep -A 30 "CSP_REPORT_ONLY = \[" > /tmp/csp-after.txt

diff /tmp/csp-before.txt /tmp/csp-after.txt    # must be empty
```

Identical for `images.remotePatterns`, `headers()` block, and the `withSentryConfig` wrapping.

---

## 10. Vercel / DNS / CORS — deferred to Gate B

Per owner constraint ("no Vercel/DNS/CORS changes yet"), all dashboard/DNS work is segregated into Gate B. Gate A ships **inside the repo only**, with Studio still mounted at `/studio` on the existing single Vercel project.

### 10.1 Gate A end-state (Codex recheck applied — see `CMS-STUDIO-SPLIT-PLAN-RECHECK.md`)

- Repo has `apps/web/` and `packages/schema-shared/`. **No `apps/studio/` yet.**
- All Studio code (`sanity.config.ts`, `sanity.cli.ts`, `src/sanity/`, `src/app/studio/[[...tool]]/`) is moved **inside `apps/web/`** as part of the web move. Behaviour is identical to today; only the absolute paths change.
- `apps/web/package.json` legitimately declares `sanity`, `@sanity/vision`, `@sanity/icons`, and `next-sanity` because the Studio runs inside the web app (see §3.3 Gate A table).
- The `/studio` route works exactly as it did pre-split: `apps/web/src/app/studio/[[...tool]]/page.tsx` imports `../../../../sanity.config` (4 levels up, same relative depth as today). **No cross-workspace import.**
- `packages/schema-shared/` provides option enums and the structural `resolvePath`. Both Studio (`apps/web/src/sanity/...`) and any future web consumer import via `@v2/schema-shared`. The structural fix in §5 lands in Gate A so Gate B is a pure file move.
- No `cms.v2badminton.com` exists yet; no new Vercel project; Sanity CORS unchanged.

### 10.2 Two acceptable Gate-A Vercel postures (owner picks)

| Option | Description | Pro | Con |
|---|---|---|---|
| **A1 — Vercel Root Directory move at end of Gate A** | After Gate A code merges, change the existing Vercel project's Root Directory from `.` to `apps/web`. `apps/web` is fully self-contained (Studio included), so the deploy serves `v2badminton.com/` and `v2badminton.com/studio/` exactly as before. | Smaller delta in Gate B; CI matches deployed config; no shim | Requires one Vercel dashboard change in Gate A |
| **A2 — Repo-only Gate A, Vercel untouched** | Repo root keeps a thin `next.config.ts` that re-exports `apps/web/next.config.ts`; root `package.json` keeps `dev/build/start` scripts that proxy into `apps/web` (`npm run -w apps/web ...`). Vercel still builds from the root. | Zero Vercel dashboard changes in Gate A | Carries a "shim root" until Gate B; slightly awkward |

**Recommended: A1.** Under the R3 revision, `apps/web` has no cross-workspace dependencies, so a Root Directory change to `apps/web` is safe — Next traces only files under `apps/web/` and the `packages/schema-shared` workspace package (which is resolved through the workspace symlink). No `outputFileTracingRoot` widening is required.

This is an **owner decision** (see §15.2). Default plan below assumes A1.

### 10.3 Gate B spec (pre-approved structure, requires explicit owner go-ahead before execution)

> **Codex recheck applied.** Gate B now also owns the Studio file moves out of `apps/web` and into a new `apps/studio` workspace. The original Commit 06 of Gate A (Studio file move) is reassigned here as Gate B step B.0.

**B.0 — Create `apps/studio/`, move Studio files, transfer deps (code-only, no dashboards yet)**

Moves (with `git mv` to preserve history):
- `apps/web/sanity.config.ts` → `apps/studio/sanity.config.ts`
- `apps/web/sanity.cli.ts` → `apps/studio/sanity.cli.ts`
- `apps/web/src/sanity/` → `apps/studio/src/sanity/`

Creates:
- `apps/studio/package.json` with Gate B target deps from §3.3 (`sanity`, `@sanity/vision`, `@sanity/icons`, `next-sanity`, `next`, `react`, `react-dom`, `@v2/schema-shared`)
- `apps/studio/tsconfig.json` (§4.2)
- `apps/studio/eslint.config.mjs` (re-export root, like `apps/web`)
- `apps/studio/next.config.ts` (minimal — no CSP, no Sentry, no image config; Studio handles its own assets)
- `apps/studio/src/app/layout.tsx` (minimal HTML shell)
- `apps/studio/src/app/[[...tool]]/page.tsx` and `StudioClient.tsx` (copies of the Gate A files under `apps/web/src/app/studio/[[...tool]]/`)
- `apps/studio/vitest.config.ts` (per §6.2)

Edits inside `apps/studio/src/sanity/`:
- `schemaTypes/shared.ts` keeps `slugifyValue` only and re-exports option enums from `@v2/schema-shared` (the relative cross-workspace re-export from commit 03 of Gate A becomes a clean workspace import).
- `lib/resolvePath.ts` becomes a single line: `export * from "@v2/schema-shared";`

Edits inside `apps/web/`:
- Remove `sanity`, `@sanity/vision`, `@sanity/icons` from `apps/web/package.json` deps.
- Keep `next-sanity` (still used by `src/lib/sanity/client.ts` server-side reads).
- Regenerate `package-lock.json` from root.

Edits at root:
- Add root scripts `dev:studio` and `build:studio`.
- Update root `build`, `lint`, `typecheck`, and `test` to include `apps/studio`.
- Update CI to restore the Studio Next.js cache and run Studio lint/typecheck/build/test through the root scripts.

B.0 lands as the first commit on the Gate B branch `chore/cms-studio-cutover`. At this point Studio code is no longer in `apps/web`, but the `/studio` web mount has not yet been deleted (it now imports the Studio config via a cross-workspace path that only persists for one commit — see B.6 which deletes the mount).

**B.1 — Sanity dashboard (`manage.sanity.io`)**

- Add CORS origin `https://cms.v2badminton.com` (with credentials).
- Add CORS origin `https://v2badminton-studio.vercel.app` (preview alias, with credentials).
- **Do not remove** existing origins. Keep `https://v2badminton.com`, the existing Vercel preview alias, and `http://localhost:3000`.

**B.2 — Vercel**

- Create new project `v2badminton-studio` in team `team_7fCxBpY1zkfDmwChuDqgsiiR`, linked to the same GitHub repo.
- Root Directory: `apps/studio`. Framework: Next.js.
- Env vars (Production + Preview + Development) — **only these three**:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `NEXT_PUBLIC_SITE_URL`
- Enable Vercel Password Protection on the Studio project for the bake window.
- Existing project `v2badminton-next`: Root Directory `apps/web` (already true if A1 was chosen). Leave env vars **unchanged**.
- Set "Ignored Build Step" on both projects to a path filter so each only redeploys when its app changes (Vercel monorepo native support — `git diff --quiet HEAD^ HEAD ./` works because the Root Directory is the filter).

**B.3 — DNS**

- Add CNAME `cms.v2badminton.com → cname.vercel-dns.com`.

**B.4 — Studio basePath and the `/studio` literal mop-up**

These are code edits, but they only make sense once the Studio subdomain is live. Therefore they belong in Gate B, not Gate A. Edits, all in `apps/studio/`:

- `sanity.config.ts`: `basePath: "/studio"` → `basePath: "/"`.
- `src/sanity/lib/contentOpsStatus.ts:195`: `/studio/intent/edit/...` → `/intent/edit/...`.
- `src/sanity/tools/DashboardTool.tsx` 8 link locations + 2 comments: `/studio/structure/...` → `/structure/...`.

Note: this is a code change inside `apps/studio/`. It's classified Gate B because its semantics ("Studio is no longer under `/studio` prefix") only become correct after the subdomain is live. Lands as one commit after B.1–B.3 are verified.

**B.5 — Redirect on web**

In `apps/web/next.config.ts`:
```ts
async redirects() {
  return [
    {
      source: "/studio/:path*",
      destination: "https://cms.v2badminton.com/:path*",
      permanent: true,
    },
  ];
}
```

The redirect uses `:path*` so deep links `/studio/intent/edit/id=X;type=Y` and `/studio/structure/pages-group;content_article` preserve their tail verbatim. After the Studio basePath change in B.4, `cms.v2badminton.com/intent/edit/...` and `cms.v2badminton.com/structure/...` resolve to the same documents the old links did.

**B.6 — Decommission the web mount**

Delete `apps/web/src/app/studio/` entirely. Lands in the same commit as the redirect rule.

**B.7 — Verify deep-link semantics** (yellow risk #5)

```bash
# After deploy, with redirect live:
curl -sI https://v2badminton.com/studio/                                  | grep -iE "^location|^http/"
curl -sI https://v2badminton.com/studio/structure/pages-group\;content_article | grep -iE "^location|^http/"
curl -sI 'https://v2badminton.com/studio/intent/edit/id=foo;type=content_article' | grep -iE "^location|^http/"
```

Expected: each returns `308 Permanent Redirect` with `Location:` pointing at the corresponding `cms.v2badminton.com/...` URL with the path tail preserved exactly. Then load each target URL manually to confirm Studio resolves it.

**Gate B acceptance checks**

- `npm run -w apps/studio build` exits 0.
- `npm run -w apps/studio lint` and `npm run -w apps/studio typecheck` exit 0.
- `apps/web/package.json` no longer declares direct `sanity`, `@sanity/vision`, or `@sanity/icons` dependencies.
- `apps/web/src/app/studio/` is deleted after the redirect lands.
- `/studio/*` redirects to `https://cms.v2badminton.com/*`.
- `cms.v2badminton.com` loads the independent Studio app.

### 10.4 Gate B is NOT in this plan's commit list

`chore/cms-studio-split` (Gate A) merges first. Gate B starts on a separate branch `chore/cms-studio-cutover` cut from the merged `main`. A separate small PR holds the Gate B commits (B.4 code edits + B.5 redirect + B.6 mount delete). DNS/Vercel/CORS dashboard changes are tracked in the PR description, not in code.

This separation is the YELLOW-risk mitigation for "External deployment risk: Vercel root directories, new Studio project, DNS, Sanity CORS, and ignored build steps cannot be proven from repo alone."

---

## 11. Commit-by-commit plan (Gate A)

> **Codex recheck applied.** Original Commit 06 (Studio file move to `apps/studio`) is removed from Gate A. Studio code stays inside `apps/web/`. Commits are renumbered: 8 commits total instead of 9. The Studio file move is reassigned to Gate B step B.0 (see §10.3).

Each commit lands a focused, reviewable change. Every commit lists the exact paths to `git add`. No `git add -A`. After each commit, run `git status --short` and confirm only the intended files moved.

**All commits target branch `chore/cms-studio-split`, cut from `origin/main` (§1).**

### Commit 01 — ESLint ignore worktrees + local artifacts

- Edit `eslint.config.mjs` to add the augmented `globalIgnores([...])` set from §7.4.
- Paths to add: `eslint.config.mjs`.
- Verify: `npm run lint` exits 0; `git grep -l "\.claude/worktrees" eslint.config.mjs` returns 1.
- Why first: subsequent commits run lint; the ignore must already be in place.

### Commit 02 — Add `packages/schema-shared/` (new files only; no existing file edited)

- Create:
  - `packages/schema-shared/package.json` (name `@v2/schema-shared`, version `0.0.0`, private, no `dependencies`)
  - `packages/schema-shared/tsconfig.json` (§4.2)
  - `packages/schema-shared/src/index.ts` (re-exports `options.ts` and `resolvePath.ts`)
  - `packages/schema-shared/src/options.ts` (copy of `src/sanity/schemaTypes/shared.ts` minus `slugifyValue`; that helper stays Studio-only because web has its own `slugifyHeading`)
  - `packages/schema-shared/src/resolvePath.ts` (copy of `src/sanity/lib/resolvePath.ts` with `RoutableDoc` rewritten to structural; see §5.2)
- Paths to add: `packages/`.
- Verify: `npx tsc -p packages/schema-shared/tsconfig.json --noEmit` exits 0. `grep -rn "from \"sanity\"" packages/schema-shared/src` returns zero matches.
- Why second: subsequent commits switch consumers to import from this package; the package must exist first.

### Commit 03 — Switch existing callers to `@v2/schema-shared` (single-source via re-exports, before workspaces are declared)

This step is subtle: we cannot yet rely on the workspace symlink because the workspace manifest hasn't been added. To bridge the gap, this commit edits `src/sanity/schemaTypes/shared.ts` and `src/sanity/lib/resolvePath.ts` to **re-export from `packages/schema-shared/src/...` via a relative path**:

- `src/sanity/schemaTypes/shared.ts`:
  ```ts
  // Transitional re-export — see commit 03 of CMS-STUDIO-SPLIT-IMPLEMENTATION-PLAN.md
  export * from "../../../packages/schema-shared/src/options";
  // slugifyValue stays here, schema-only — web does not import it
  export function slugifyValue(input: string) { /* unchanged */ }
  ```
- `src/sanity/lib/resolvePath.ts`:
  ```ts
  export * from "../../../packages/schema-shared/src/resolvePath";
  ```
- `src/lib/sanity/types.ts:1-9`: change import from `@/sanity/schemaTypes/shared` to relative `../../../packages/schema-shared/src/options`. (Stays relative until commit 05 wires the `@v2/schema-shared` alias.)
- Paths to add: `src/sanity/schemaTypes/shared.ts`, `src/sanity/lib/resolvePath.ts`, `src/lib/sanity/types.ts`.
- Verify: `npm run lint`, `npm run typecheck`, `npm run build`, `npm test` all exit 0. The web app still builds against root layout.
- Why now: proves the structural `RoutableDoc` and the option-array extraction compile cleanly **before** the folder move, so any incompatibility surfaces while the codebase is still at root.

### Commit 04 — Declare npm workspaces; regenerate lockfile

- Edit root `package.json` to add `"workspaces": ["apps/*", "packages/*"]`. Keep all current scripts and deps at root for now (apps don't exist yet).
- Delete `package-lock.json`; run `npm install`; commit the new lock.
- Paths to add: `package.json`, `package-lock.json`.
- Verify: `npm ci` succeeds. `npx tsc --noEmit` for the root app still succeeds. `npm run build` still works against root.
- Why now: workspaces have to be declared before `apps/web/package.json` is added; `apps/studio/package.json` is introduced later in Gate B. The lockfile churn is isolated to this commit for reviewer clarity.

### Commit 05 — Create `apps/web/` skeleton, move all current sources (including Studio code), wire `@v2/schema-shared` alias

> **Codex recheck applied.** This commit moves **all** of `src/`, including `src/sanity/`, plus `sanity.config.ts` and `sanity.cli.ts`, into `apps/web/`. The `/studio` route continues to work because Studio code remains colocated with the mount route. `apps/studio/` is not created in Gate A.

This is the largest commit. It moves all current root-level app files into `apps/web/` and creates `apps/web/package.json` + `apps/web/tsconfig.json` + the per-app configs.

Moves (using `git mv` so history is preserved):

- `src/` (entire tree, including `src/sanity/`) → `apps/web/src/`
- `public/` → `apps/web/public/`
- `tests/` → `apps/web/tests/`
- `scripts/` → `apps/web/scripts/`
- `seed/` → `apps/web/seed/`
- `next.config.ts` → `apps/web/next.config.ts` (verbatim move — CSP, Sentry, images, headers unchanged; see §9)
- `next-env.d.ts` → `apps/web/next-env.d.ts`
- `sanity.config.ts` → `apps/web/sanity.config.ts` (verbatim — stays at `apps/web/` root because `apps/web/src/app/studio/[[...tool]]/page.tsx` imports it via `../../../../sanity.config`, the same 4-level relative depth as today)
- `sanity.cli.ts` → `apps/web/sanity.cli.ts`
- `playwright.config.ts` → `apps/web/playwright.config.ts`
- `vitest.config.ts` → `apps/web/vitest.config.ts` (aliases per §6.2)
- `.lighthouserc.desktop.json` → `apps/web/.lighthouserc.desktop.json`
- `.lighthouserc.mobile.json` → `apps/web/.lighthouserc.mobile.json`
- `eslint.config.mjs` → `apps/web/eslint.config.mjs` (will be replaced with a re-export shim — see "Replaces at root" below)
- `.env.example` → `apps/web/.env.example` (final-readiness review: added — was missing from the original move list)

Creates:

- `apps/web/package.json` (Gate A deps per §3.3 — including `sanity`, `@sanity/vision`, `@sanity/icons`, `next-sanity`; scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`, `test:mobile`, `test:mobile:headed`, `verify:production-env`, `sanity:dev` — copied from current root)
- `apps/web/tsconfig.json` (§4.2, with `@v2/schema-shared` alias)
- `apps/web/eslint.config.mjs` (re-exports root, per §7.4)

Edits:

- Update `apps/web/src/lib/sanity/types.ts` to import from `@v2/schema-shared` (replacing the relative path from commit 03).
- Update `apps/web/src/sanity/schemaTypes/shared.ts` and `apps/web/src/sanity/lib/resolvePath.ts`: replace the relative re-exports from commit 03 with `export * from "@v2/schema-shared"` (now that the alias resolves via the workspace).
- `apps/web/src/sanity/schemaTypes/shared.ts` keeps `slugifyValue` defined locally (it's Studio-only; web has its own `slugifyHeading`).
- **Add `transpilePackages: ["@v2/schema-shared"]`** to the top-level `NextConfig` object in `apps/web/next.config.ts` (see §4.5 and §9). This is the only allowed deviation from the verbatim CSP/Sentry/image-config move.

Replaces at root:

- `tsconfig.json` → `tsconfig.base.json` (§4.2)
- `eslint.config.mjs` → root flat config that hosts the global ignore set (already updated in commit 01). The per-app `eslint.config.mjs` files re-export root (§7.4).
- Root `package.json`: drop runtime deps, drop most scripts, become the orchestrator from §3.2.
- `.gitignore`: replace `!.env.example` rule with `!apps/web/.env.example` so the relocated example stays tracked.

Lockfile regeneration (final-readiness review: this step was missing from the original Commit 05):

After all files are moved and `apps/web/package.json` is in place, regenerate the lockfile from the root because `apps/web/package.json` is a new workspace member that the existing lockfile (post-Commit 04) does not know about:

```bash
# From repo root, NEVER inside a workspace dir.
npm install
```

Paths to add: `apps/web/`, `tsconfig.base.json`, `package.json` (root), `package-lock.json` (regenerated — final-readiness review: was missing), `eslint.config.mjs` (root), `.gitignore`, and the deletions from root (`src/`, `next.config.ts`, etc. — `git mv` records these as renames).

**Developer local-env note (manual, not a commit):** the developer's local `.env.local` and `.env.production.local` files live at repo root today. Both Next.js and `sanity.cli.ts` read env via `loadEnvConfig(process.cwd())`. After Commit 05, npm scripts run inside `apps/web/`, so the developer must manually move:
- `.env.local` → `apps/web/.env.local`
- `.env.production.local` → `apps/web/.env.production.local`

Both files are gitignored — this is a per-developer setup step, **not** a git operation. Sonnet must NOT touch these files. Document the requirement in commit 08's README update.

Verify:
```bash
# Lockfile coherence — npm ci must succeed against the regenerated lockfile.
npm ci

npm run -w apps/web lint
npm run -w apps/web typecheck
npm run -w apps/web build
npm run -w apps/web test                  # runs all 4 tests under apps/web
npm run -w apps/web dev &
curl -sI http://127.0.0.1:3000 | head -1  # 200 — public site
curl -sI http://127.0.0.1:3000/studio | head -1  # 200 — Studio still mounted in web app
kill %1

# Build-config invariants (§9).
grep -n "transpilePackages" apps/web/next.config.ts          # exactly one match
diff <(git show pre-split-snapshot:next.config.ts | grep -A 30 "CSP_REPORT_ONLY = \[") \
     <(cat apps/web/next.config.ts | grep -A 30 "CSP_REPORT_ONLY = \[")
# expect: empty diff (CSP unchanged)
```

### Commit 06 — Coverage drift check + cleanup

- Run the §6.3 coverage-drift check. If non-empty diff, fix in this commit.
- Sweep for `@/sanity` imports in `apps/web/` outside the Studio surface (Studio code legitimately lives at `apps/web/src/sanity/` and the mount at `apps/web/src/app/studio/`):
  ```bash
  # Only non-studio, non-config web code is checked. Hits here are defects.
  git grep -n "@/sanity" apps/web/src \
    | grep -vE "^apps/web/src/sanity/|^apps/web/src/app/studio/"
  # expect: no output. The legitimate non-studio consumer is apps/web/src/lib/sanity/types.ts,
  # and it now imports from @v2/schema-shared (commit 03 + commit 05), not @/sanity.
  ```
- Run `git grep -n "EXPOSE_SAN_CAU_LONG = false"` — must hit exactly `apps/web/src/components/layout/Nav.tsx`. Any other hit (especially `= true`) is a defect.
- Confirm `next.config.ts` CSP diff vs `pre-split-snapshot` is empty (§9).

Paths to add: any final renames or import fixes uncovered by the sweeps.

Verify: clean run of root `lint && typecheck && build && test`.

### Commit 07 — Update CI workflow + Lighthouse workflow

- Edit `.github/workflows/ci.yml` to the workspace-aware shape (§7.3).
- Edit `.github/workflows/lighthouse.yml` to use `working-directory: apps/web` and update config paths (§7.2).
- Paths to add: `.github/workflows/ci.yml`, `.github/workflows/lighthouse.yml`.
- Verify: push the branch; GitHub Actions runs the new CI. CI must be green before opening the PR.

### Commit 08 — Update `.env.example` and `README.md` workspace notes (no other docs)

- Annotate `apps/web/.env.example` to mark which vars become Studio-only (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SITE_URL`) **at Gate B**. During Gate A, the web app still consumes all of them because Studio runs inside it.
- Add a short "Workspaces" section to `README.md` explaining:
  - `npm run -w apps/web dev` to start the web app (Studio still served at `/studio`).
  - `apps/studio` will be added in Gate B.
  - **Developer local-env setup (final-readiness review):** any pre-existing `.env.local` or `.env.production.local` at the repo root must be moved into `apps/web/` because Next.js and `sanity.cli.ts` read env via `loadEnvConfig(process.cwd())`. These files are gitignored; the move is a one-time per-developer setup step.
- Paths to add: `apps/web/.env.example`, `README.md`.
- Verify: nothing functional; this is documentation.

### Gate A merge

- PR description references this plan and the impact check.
- Reviewer checklist:
  - [ ] No `git add -A` in any commit (visible in `git log -p` — each commit's file set is targeted)
  - [ ] `EXPOSE_SAN_CAU_LONG = false` preserved
  - [ ] No CSP changes
  - [ ] No Studio runtime dep in `packages/schema-shared/package.json`
  - [ ] CI green
  - [ ] No file outside §11's scope is touched
- Merge to `main`.
- If Gate A end-state A1 (§10.2) was chosen: change the existing Vercel project's Root Directory to `apps/web` in the same merge window. (This is the **only** dashboard change in Gate A.) Smoke `https://v2badminton.com/` and `https://v2badminton.com/studio/`. If anything is wrong, revert Vercel Root Directory back to `.` (instant).

---

## 12. Verification checklist (run at end of each commit; full pass at end of Gate A)

### Per-commit (mandatory)

- `git status --short` shows only intended paths
- `git diff --cached --stat` matches the commit description
- `npm run lint` exits 0 (or scoped equivalent post-workspace)
- `npm run typecheck` exits 0
- `npm run build` exits 0 (after commit 04 onwards)
- `npm test` exits 0 (after the relevant test workspace exists)

### Pre-merge Gate A full pass

Repo hygiene:
- [ ] Branch was cut from `origin/main`, not `docs/cms-img-opt-audit` (`git log --oneline origin/main..HEAD` shows only the split's commits)
- [ ] No commits touch `tickets/CMS-IMG-OPT.md`
- [ ] No commits touch files outside `apps/`, `packages/`, root config files
- [ ] No `.codex/`, `outputs/`, `*.png`, `.claude/` paths are staged in any commit

Shared package hygiene (Yellow #3, top-5 #4):
- [ ] `packages/schema-shared/package.json` has empty (or absent) `dependencies` block
- [ ] `grep -rn "from \"sanity\"" packages/schema-shared/src` returns zero hits
- [ ] `grep -rn "import type.*from \"sanity\"" packages/schema-shared/src` returns zero hits
- [ ] `apps/web/package.json` declares `sanity`, `@sanity/vision`, `@sanity/icons`, and `next-sanity` (Gate A reality — Studio runs inside web; the original "no sanity in web" assertion was wrong for Gate A per the Codex recheck and now belongs to Gate B's acceptance)

Boundary hygiene (top-5 #3):
- [ ] Non-Studio web code does not reach into Studio code:
  ```bash
  git grep -n "@/sanity" apps/web/src \
    | grep -vE "^apps/web/src/sanity/|^apps/web/src/app/studio/"
  # expect: no output
  ```
- [ ] `git grep -n "@v2/schema-shared" apps/web` returns at least one match (`apps/web/src/lib/sanity/types.ts` and the Studio re-export shims)
- [ ] `git grep -n "packages/schema-shared" apps/web` returns zero hits (no relative cross-workspace imports — all consumers go through `@v2/schema-shared`)
- [ ] `git grep -n "apps/studio" apps/web` returns zero hits (no premature reference to a workspace that does not exist in Gate A)

Freeze enforcement (top-5 #5, Yellow PR5 risk):
- [ ] `git grep -n "EXPOSE_SAN_CAU_LONG" apps/web` returns exactly one hit, with value `false`
- [ ] `git diff origin/main -- "apps/web/src/components/content/CourtView.tsx"` shows only path-shift / import-rewrite changes, no JSX or logic diff
- [ ] `git diff origin/main -- "apps/web/src/sanity/schemaTypes/court.ts"` shows only import-path diffs
- [ ] `git diff origin/main -- "apps/web/src/sanity/schemaTypes/routeRedirect.ts"` shows only import-path diffs
- [ ] `git diff origin/main -- "apps/web/src/lib/sanity/queries/court.ts"` empty or import-only
- [ ] `git diff origin/main -- "apps/web/src/app/(site)/[...slug]/page.tsx"` empty or import-only
- [ ] `git diff origin/main -- "apps/web/src/app/sitemap.ts"` empty or import-only
- [ ] `git diff origin/main -- "apps/web/src/app/api/revalidate/sanity/route.ts"` empty or import-only

CSP and config invariants (§9):
- [ ] CSP_REPORT_ONLY string in `apps/web/next.config.ts` is byte-identical to root `next.config.ts` at `pre-split-snapshot`
- [ ] `images.remotePatterns` unchanged
- [ ] `headers()` block unchanged
- [ ] `withSentryConfig` wrap and options unchanged
- [ ] `transpilePackages: ["@v2/schema-shared"]` is present (this is the **only** allowed deviation; see §4.5 and §9)
- [ ] (`apps/studio/next.config.ts` check moves to Gate B — `apps/studio/` does not exist in Gate A)

Workspace / lockfile coherence (final-readiness review):
- [ ] `npm ci` exits 0 from repo root using the committed `package-lock.json`
- [ ] `apps/web/package.json` is a workspace member (`npm query .workspace` lists `apps/web` and `packages/schema-shared`; does NOT list `apps/studio`)
- [ ] `packages/schema-shared/package.json` has a `typecheck` script (`tsc --noEmit`)
- [ ] `apps/web/node_modules/@v2/schema-shared` is a symlink (`test -L apps/web/node_modules/@v2/schema-shared` exits 0)
- [ ] No per-workspace lockfiles exist (`find apps packages -name package-lock.json` returns empty)

Test coverage (Yellow #6):
- [ ] Test file count post-split == pre-split count (4 tests total; all remain under `apps/web` during Gate A)
- [ ] `npm test` runs all 4 via `apps/web` during Gate A

CI:
- [ ] `.github/workflows/ci.yml` runs `npm ci`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm test` at root
- [ ] CI passes on the branch
- [ ] `.github/workflows/lighthouse.yml` uses `working-directory: apps/web`

Web smoke (after Vercel Root Directory change, if A1):
- [ ] `https://v2badminton.com/` returns 200 with home page intact
- [ ] `https://v2badminton.com/blog/` returns 200
- [ ] `https://v2badminton.com/hoc-cau-long-cho-nguoi-moi/` returns 200
- [ ] `https://v2badminton.com/gioi-thieu/` returns 200
- [ ] `https://v2badminton.com/ky-thuat-cau-long/ky-thuat-dap-cau-smash/` returns 200
- [ ] `https://v2badminton.com/studio/` returns 200 (still mounted in web app under Gate A)
- [ ] Sentry error rate over 1h post-deploy ≤ baseline
- [ ] Sanity webhook still resolves to `/api/revalidate/sanity` and returns 200 on a benign edit

---

## 13. Rollback plan

### 13.1 Per-commit rollback (during development)

Any commit can be reverted with `git revert <sha>` while on `chore/cms-studio-split`. The commit-by-commit structure keeps each step small enough that a revert is one targeted change.

### 13.2 Pre-merge rollback (after CI is green, before merge to `main`)

Discard the branch: `git branch -D chore/cms-studio-split`. No production impact (nothing has shipped). The `pre-split-snapshot` tag still points at the unchanged main SHA.

### 13.3 Post-merge rollback (Gate A merged to `main`, deployed)

Two layers:

**Layer 1 — Vercel rollback (if A1 was chosen):**
- Vercel dashboard → project `v2badminton-next` → previous deployment → "Promote to Production". Production reverts to pre-merge build in ~30 s.
- Then revert the Root Directory change: `apps/web` → `.`. Save. Next push deploys at root again, which won't build anymore on the post-split repo — so the previous-deployment promotion is the actual rollback.

**Layer 2 — Repo rollback:**
- `git revert -m 1 <merge-sha>` on `main` to undo the split merge. Push.
- Restore Vercel Root Directory to `.` (default). CI green on the reverted `main` and the next deploy builds from root as before.

**Sanity:** untouched throughout. No data rollback needed.

**DNS / CORS:** untouched in Gate A. No rollback needed.

### 13.4 Recovery if `EXPOSE_SAN_CAU_LONG` is accidentally flipped during the split

- Catch via the §12 grep check before merge.
- If it slips past merge: the change is one line. Hotfix PR on `main` flipping back to `false`. Deploy. Sanity is untouched.

---

## 14. Acceptance criteria (Gate A only)

This plan is **Gate A complete** when all of:

- [ ] All 8 commits in §11 have landed on `chore/cms-studio-split` (Codex recheck reduced 9 → 8)
- [ ] CI is green on the branch
- [ ] All checkboxes in §12 (pre-merge Gate A full pass) are satisfied
- [ ] PR has been reviewed and approved by the owner
- [ ] PR is merged to `main`
- [ ] If A1 (§10.2) was chosen: Vercel `v2badminton-next` Root Directory is `apps/web` and the production deploy off `main` is green
- [ ] `https://v2badminton.com/` and `https://v2badminton.com/studio/` both return 200
- [ ] One Sanity webhook fires successfully on a benign no-op edit (proves `/api/revalidate/sanity` still works)
- [ ] No Sentry regression in the 24 h post-merge window

**Gate B is a separate plan, separate approval, separate branch.** Acceptance criteria for Gate B live in §10.3 here as a pre-approved spec, but execution requires its own owner go-ahead.

---

## 15. Readiness and owner decisions

### 15.1 Is the plan ready for implementation?

**Yes for Gate A — pending the owner decisions in §15.2.**

Specifically:
- All YELLOW risks from the impact check have an explicit mitigation section above.
- The Codex recheck (`CMS-STUDIO-SPLIT-PLAN-RECHECK.md`) has been applied: Studio code stays inside `apps/web/` for Gate A; no cross-workspace import; `apps/studio/` does not exist until Gate B; the misplaced "no sanity in web" assertion has been removed from Gate A acceptance.
- All freeze and exclude items from the impact check are listed with grep-checkable assertions.
- The commit-by-commit plan is small enough that each commit is reviewable independently (8 commits total after the recheck reduction).
- `packages/schema-shared` has zero runtime deps in Gate A; `apps/web` legitimately depends on the Studio runtime packages because the Studio runs inside it during Gate A.
- Gate B is **not** in this plan beyond the pre-approved spec in §10.3; it requires a separate owner approval at its own start.

**Not ready for Gate B yet.** Gate B starts after Gate A merges and bakes, and requires a separate go-ahead because it touches Vercel, DNS, and Sanity dashboards. The Gate B spec in §10.3 is pre-approved structurally but not pre-authorised for execution.

### 15.2 Remaining owner decisions

1. **Gate A Vercel posture — A1 or A2?** (§10.2.) Default recommendation: **A1** (change Vercel Root Directory to `apps/web` at end of Gate A; no shim). Under the R3 revision this is now strictly safer than before because `apps/web` is fully self-contained — no cross-workspace import, no `outputFileTracingRoot` widening required.
2. **`slugifyValue` placement.** (Mentioned in impact check §3.) Web already has its own `slugifyHeading` (with an explicit comment that it's intentionally not imported from Sanity). The plan keeps `slugifyValue` Studio-only and **does not** move it to `packages/schema-shared`. Owner confirm: this is fine, or do you want one slug helper across both?
3. **Freeze acknowledgement.** Confirm PR5 (`/san-cau-long/` content publish + nav flip + `cms_court_cta_click` tracking changes) is paused until Gate B + bake completes (≥1 week post-merge of Gate B).
4. **Codex recheck acknowledgement.** Confirm the R3 revision — Studio code stays inside `apps/web/` for Gate A, the `apps/studio/` workspace is created in Gate B — is acceptable. The trade-off: Gate A is smaller and safer; Gate B grows by one preparatory step (B.0).
5. (Pre-approval for Gate B — not required to start Gate A.) Confirm `cms.v2badminton.com` is the target subdomain and that the DNS provider used for `v2badminton.com` is the same as where the CNAME will be added.

### 15.3 Recommended first implementation phase

**Start with §1.5 → §1.2 → Commit 01 only.**

That is:
1. **Resolve `.codex/config.toml` per §1.5.** Sonnet must NOT proceed past §1 until the owner answers (a/b/c) and the working tree is clean.
2. Execute §1.2 verbatim: fetch `origin/main`, cut `chore/cms-studio-split` from it, tag `pre-split-snapshot`. Confirm the branch is at the fresh `main` SHA and the working tree shows only the expected untracked artifacts from §2.1.
3. Land Commit 01 from §11: the ESLint ignore update. This is a single-file change, zero behaviour impact, and it is a prerequisite for every later commit so the broad `lint`/`typecheck` passes don't trip on `.claude/worktrees/**`.
4. Push the branch. Confirm CI runs and passes on Commit 01 alone.

**Stop after Commit 01 and check in with the owner before proceeding to Commit 02.** This gives both sides a chance to confirm the branch hygiene is correct before any structural moves begin, and it spends ~30 minutes of work to retire two YELLOW risks (Branch/base risk and Lint/search risk) before touching anything else.
