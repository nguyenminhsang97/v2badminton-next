# Gate B — Junior Implementation Handbook

> **Purpose:** Turn Gate B into self-contained sub-tasks that can be executed and verified
> one at a time, top to bottom, without holding the whole design in your head.
> Mirrors the shape of `v2badminton-cms-phase-1-junior-handbook.md`.
>
> **Companions — read once before starting:**
> - [`cms-studio-split-implementation-plan.md`](./cms-studio-split-implementation-plan.md) §10.3 — WHAT Gate B is.
> - [`gate-b-addendum-2026-09-09.md`](./gate-b-addendum-2026-09-09.md) — the 8 corrections. **Where the plan and the addendum disagree, the addendum wins.**
> - This handbook — HOW, at sub-task level. Work top-to-bottom. Do not reorder.
>
> **Scope:** Gate A is already done (merged 2026-06-22, `249ca30`). This handbook covers
> Gate B only: split the Studio into its own workspace and its own deployment at
> `cms.v2badminton.com`.
>
> **What this does NOT do:** it adds no editor-facing feature. Draft preview and the
> fail-closed fallback work stay open afterwards — see addendum §7.

---

## 0. Pre-flight

Run from repo root (`D:\V2\v2badminton-next`). All four must pass before you touch anything.

| Step | Command | Expected |
|---|---|---|
| 0.1 | `git fetch origin` | no error |
| 0.2 | `git status --short` | empty, or untracked files only |
| 0.3 | `git checkout -b chore/cms-studio-cutover origin/main` | new branch created |
| 0.4 | `npm ci` | exit 0 |
| 0.5 | `npm run typecheck` | exit 0 |
| 0.6 | `npm run build` | exit 0 |
| 0.7 | `npm test` | exit 0 — `Test Files 9 passed (9)`, `Tests 82 passed (82)` |

**If any step fails, STOP and report it. Do not start Phase 1.**

Record the baseline: `git log --oneline -1` → note the hash. You will need it for rollback.

---

## 1. Rules you must not break

Read all seven before writing any code. R1–R4 are traps in the code, R6–R7 are traps in
this machine's environment (both were hit and verified while writing this handbook), and
R5 is the commit discipline.

**R1 — `contentShared.ts` line 59 keeps `"/studio/"`. Do not change it.**
In sub-task G9 you will replace `/studio/...` strings with `/...`. There is exactly one
`/studio` string that is NOT a Studio link: the entry inside `CODE_RESERVED_PREFIXES`. It
reserves a *website* URL prefix so no CMS document can claim a path the web app already
owns. It stays exactly as it is. See addendum §B-5.

**R2 — Never replace `async redirects()` in `apps/web/next.config.ts`.**
It already returns `FILE_ROUTE_REDIRECTS`, which holds the `/blog/` → `/tin-tuc/` rules.
You only ever *append entries to the array*. A test asserts on this. See addendum §B-1.

**R3 — `apps/studio` must never import `@/...`.**
The `@/*` alias inside `apps/studio` points only at `apps/studio/src/*`. Anything shared
with the web app goes through `@v2/schema-shared`. Verified in G16.

**R4 — Do not add `trailingSlash: true` to `apps/studio/next.config.ts`.**
The web app has it. The Studio must not — Sanity Studio builds its own URLs
(`/structure/pages-group;content_article`) and trailing-slash normalisation breaks them.

**R5 — Commits.** Phase 1 is **one** commit. Phase 3 is **one** commit. Never `git add -A`;
add the exact paths listed in each sub-task. Every commit message ends with:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

**R6 — Run the `git grep` verification commands in PowerShell, not Git Bash.**
This is a real trap, verified on this machine. In Git Bash (MSYS), a `git grep` pattern
containing a forward slash is silently mangled and **returns no output even when matches
exist**:

```
# Git Bash — WRONG, returns nothing despite 8 real matches:
git grep -n "/studio" -- apps/web/src/sanity
# PowerShell — correct, returns all matches
```

Every boundary check in this handbook is of the form "expect no output" or "expect exactly
one line". Under Git Bash they would all appear to pass while proving nothing. Use
PowerShell. If you must use Git Bash, prefix each one with `MSYS_NO_PATHCONV=1`.

**R7 — Never run `git checkout main` in this repo.** It fails with:

```
fatal: 'main' is already used by worktree at 'D:/V2/v2badminton-next-cta-fix'
```

`main` is checked out in a second worktree on this machine (`git worktree list` shows it).
Always branch directly off the remote ref instead, which needs no local `main`:

```bash
git fetch origin
git checkout -b <new-branch> origin/main
```

Both the Phase 1 pre-flight (0.3) and Phase 3 (G17) already use this form. If a command
fails with the message above you used the wrong one — do **not** try to fix it by removing
or moving the other worktree.

---

## 2. Phase 1 — the code split (one commit, no dashboards)

> **Goal of Phase 1:** `apps/studio` exists and runs standalone; `apps/web` no longer
> contains or depends on the Studio. Nothing is deployed yet, no DNS, no redirect.
>
> **Branch:** `chore/cms-studio-cutover`
> **Commit message:** `chore(cms): Gate B — split Sanity Studio into apps/studio`
> **Order matters.** G1→G16. Do not skip ahead; several sub-tasks depend on the previous one.

---

### G1 — Create `apps/studio/package.json`

**Goal:** declare the Studio workspace with the dependencies it actually needs.

**Create** `apps/studio/package.json`:

```json
{
  "name": "@v2/studio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "next typegen && tsc --noEmit --pretty false"
  },
  "dependencies": {
    "@next/env": "16.2.4",
    "@sanity/icons": "^3.7.4",
    "@sanity/vision": "^5.28.0",
    "@v2/schema-shared": "*",
    "next": "16.2.4",
    "next-sanity": "^12.3.1",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "sanity": "^5.23.0",
    "styled-components": "^6.4.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.4",
    "typescript": "^5"
  }
}
```

**Why these exact entries:**
- `styled-components` is a **required** peer of `sanity@5` — the Studio build fails without it.
  The plan's §3.3 omits it; the addendum §B-3 corrects that.
- `@next/env` is imported directly by `sanity.cli.ts`. Pinned to the same version as `next`.
- Versions are copied verbatim from `apps/web/package.json` so the single root lockfile
  resolves one copy of each package. **Do not "upgrade while you're in there."**
- **No `vitest`.** The Studio ships no tests — see G13 and addendum §B-4.

**Verify:** file exists, valid JSON (`node -e "require('./apps/studio/package.json')"` → no error).

---

### G2 — Create `apps/studio/tsconfig.json`

**Create** `apps/studio/tsconfig.json` (verbatim from plan §4.2):

```json
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

**Verify:** valid JSON.

---

### G3 — Create `apps/studio/eslint.config.mjs`

**Create** `apps/studio/eslint.config.mjs` — one line, same pattern as `apps/web`:

```js
export { default } from "../../eslint.config.mjs";
```

**Verify:** `cat apps/web/eslint.config.mjs` shows the identical line. If it differs, copy
whatever `apps/web` has.

---

### G4 — Create `apps/studio/next.config.ts`

**Create** `apps/studio/next.config.ts`:

```ts
import type { NextConfig } from "next";

/**
 * Studio-only Next.js shell. Deliberately minimal — see
 * docs/cms/gate-b-addendum-2026-09-09.md §B-8.
 *
 * - No CSP. Sanity Studio needs 'unsafe-eval', blob: workers and a wide
 *   connect-src; a hand-written policy breaks the editor and buys nothing.
 *   Access control on this origin is Vercel Password Protection, not CSP.
 * - No Sentry. The public site owns error reporting.
 * - No images config. The Studio serves its own assets.
 * - `env` mirrors apps/web/next.config.ts. These NEXT_PUBLIC_* values are
 *   public (browser-bundle safe) and already committed next door, so the same
 *   fallbacks cost nothing and make local dev and CI work with no .env file —
 *   there is no apps/*/.env.local on the dev machine, only a repo-root one
 *   that `next dev` never loads. A Vercel-set value still wins: the config
 *   reads process.env first. NEXT_PUBLIC_SITE_URL is deliberately NOT here —
 *   it varies per environment and @v2/schema-shared already defaults it.
 *   The warn below keeps a misconfigured Vercel project visible in build logs.
 * - No `trailingSlash`. The web app sets it; the Studio must not, or Sanity's
 *   own routes (/structure/pages-group;content_article) stop resolving.
 */
// A fallback keeps local dev working but would let a forgotten Vercel variable
// pass unnoticed, silently pointing the Studio at the real production dataset.
// Warn at build time so a misconfigured project shows up in the build log.
for (const key of [
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
] as const) {
  if (!process.env[key]?.trim()) {
    console.warn(
      `[studio] ${key} is not set — falling back to the committed default. ` +
        `On Vercel this means the environment variable is missing.`,
    );
  }
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID:
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "w58s0f53",
    NEXT_PUBLIC_SANITY_DATASET:
      process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  },
  transpilePackages: ["@v2/schema-shared"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
```

**Common mistake:** copying `apps/web/next.config.ts` and deleting bits. Don't — write the
file above from scratch. The web config carries CSP, Sentry, image and trailing-slash
settings that are all wrong here.

---

### G5 — Create `apps/studio/src/app/layout.tsx`

**Create** `apps/studio/src/app/layout.tsx`:

```tsx
import type { ReactNode } from "react";

/**
 * Minimal HTML shell for the standalone Studio app.
 *
 * `metadata` and `viewport` — including `robots: "noindex"` — come from
 * next-sanity/studio and are re-exported by the page segment, exactly as they
 * were when the Studio was mounted inside apps/web.
 */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
```

**Do not** add `globals.css` or any site styling here. The Studio brings its own.

---

### G6 — Create `apps/studio/src/app/robots.ts`

**Create** `apps/studio/src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";

/**
 * The Studio origin must never be indexed. next-sanity/studio already sets
 * `robots: noindex` on the page metadata; this is defence in depth at the
 * origin level and stops the host serving a 404 for /robots.txt.
 * No `sitemap` entry, on purpose.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
```

---

### G7 — Move the Studio source with `git mv`

**Goal:** relocate Studio code without losing git history.

Run from repo root, **in this order**:

```bash
mkdir -p apps/studio/src
git mv apps/web/sanity.config.ts apps/studio/sanity.config.ts
git mv apps/web/sanity.cli.ts apps/studio/sanity.cli.ts
git mv apps/web/src/sanity apps/studio/src/sanity
```

**Verify:**

```bash
git status --short
```

Expect only `R` (renamed) entries for these paths, and nothing else moved.

```bash
test -d apps/web/src/sanity && echo "FAIL: still there" || echo "OK: gone"
test -f apps/studio/src/sanity/schemaTypes/contentShared.ts && echo "OK: arrived"
```

**Common mistake:** using the OS file explorer or `mv` instead of `git mv`. That loses the
rename detection and makes the diff unreviewable.

---

### G8 — Create the Studio route segment

The two route files stay in `apps/web` after G7 (they were under `src/app/studio/`, which
G7 did not move). You will **recreate** them under `apps/studio` and **delete** the
originals in G12.

**Create** `apps/studio/src/app/[[...tool]]/page.tsx`:

```tsx
import { isSanityStudioConfigured } from "../../../sanity.config";
import { StudioClient } from "./StudioClient";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityStudioConfigured) {
    return (
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Sanity Studio is unavailable</h1>
        <p>
          Missing <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> or{" "}
          <code>NEXT_PUBLIC_SANITY_DATASET</code>.
        </p>
      </main>
    );
  }

  return <StudioClient />;
}
```

**Create** `apps/studio/src/app/[[...tool]]/StudioClient.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import config from "../../../sanity.config";

const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  { ssr: false },
);

export function StudioClient() {
  return <NextStudio config={config} />;
}
```

**The only change from the `apps/web` originals is the import depth:** `../../../../` became
`../../../`. The old path was `src/app/studio/[[...tool]]/` (four levels up to the app root);
the new one is `src/app/[[...tool]]/` (three).

**Note the folder name:** `[[...tool]]` — double square brackets, three dots. On Windows,
create it with `mkdir "apps/studio/src/app/[[...tool]]"` (quotes required in PowerShell).

---

### G9 — Flip `basePath` and fix the Studio's own `/studio` links

The Studio now lives at the root of its own domain, so its internal links must drop the
`/studio` prefix. **Three files, 11 edits.**

**9a — `apps/studio/sanity.config.ts` line 39:**

```diff
-  basePath: "/studio",
+  basePath: "/",
```

**9b — `apps/studio/src/sanity/lib/contentOpsStatus.ts` line 195:**

```diff
-  return `/studio/intent/edit/id=${baseId};type=${type}`;
+  return `/intent/edit/id=${baseId};type=${type}`;
```

**9c — `apps/studio/src/sanity/tools/DashboardTool.tsx` — 8 `href` values + 2 comments.**

Replace `/studio/structure/` with `/structure/` at these lines: **502, 507, 512, 517, 536,
541, 546, 551**. Also update the two comments that quote an example path: **line 18**
(`e.g. /studio/structure/settings-group;site_settings`) and **line 244**
(`` `href` should be a path like "/studio/structure/settings-group;site_settings" ``).

**Verify — this is the important check (R1). Run it in PowerShell (R6):**

```bash
git grep -n "studio/" -- apps/studio/src
```

Expected output: **exactly one line**, and it must be

```
apps/studio/src/sanity/schemaTypes/contentShared.ts:59:  "/studio/",
```

**If you see zero lines, you broke R1 — restore that entry.** If you see more than one,
you missed an edit in 9b or 9c.

Second check, because the pattern above cannot match `basePath` (it has no trailing slash):

```bash
git grep -n "basePath" -- apps/studio/sanity.config.ts
```

Expected: `basePath: "/",`

Notes: the path filter is `apps/studio/src` so that `apps/studio/package.json`
(`"name": "@v2/studio"`) cannot inflate the count. The pattern is `studio/` rather than
`/studio` so it survives Git Bash too — but still prefer PowerShell per R6.

---

### G10 — Point the web app at `@sanity/client` and `groq`

**Goal:** stop `apps/web` depending on `next-sanity`, which drags the whole Studio in as a
required peer. Both replacements are the *same functions* — `next-sanity` re-exports them
untouched. See addendum §B-2.

**10a — `apps/web/src/lib/sanity/client.ts` line 2:**

```diff
-import { createClient } from "next-sanity";
+import { createClient } from "@sanity/client";
```

**10b — `apps/web/src/lib/sanity/queries/shared.ts` line 3:**

```diff
-import { defineQuery } from "next-sanity";
+import { defineQuery } from "groq";
```

**10c — `apps/web/scripts/sync-faqs-locations-to-sanity.mts` line 19:**

```diff
-import { createClient } from "next-sanity";
+import { createClient } from "@sanity/client";
```

This is a one-off migration script, not application code, but `apps/web/tsconfig.json`
includes `**/*.mts` so it **is** typechecked. Its two `createClient` calls (lines 113 and
123) use only plain `@sanity/client` options — `projectId`, `dataset`, `apiVersion`,
`useCdn`, `perspective`, `token` — so the swap is a no-op. Leave them alone.

**Change nothing else in any of the three files.** In particular leave the `next: { revalidate, tags }`
options in `client.ts` exactly as they are — `@sanity/client@7` supports them natively, and
they are what makes on-demand revalidation work.

---

### G11 — Fix `apps/web/package.json` dependencies

> **Do not run a build between G11 and G12.** After this sub-task the deleted-in-G12 mount
> files still import `next-sanity`, which you are about to undeclare. The repo is briefly
> inconsistent by design; G12 resolves it. Run the build only at G16.

**Remove** these five from `dependencies`:

```
@sanity/icons  @sanity/vision  next-sanity  sanity  styled-components
```

**Add** these six to `dependencies` (keep the block alphabetically sorted, as it is today):

```json
"@next/env": "16.2.4",
"@portabletext/react": "^6.0.3",
"@portabletext/types": "^4.0.2",
"@sanity/client": "^7.22.0",
"@sanity/webhook": "^4.0.4",
"groq": "^5.23.0",
```

**Why the additions:** all six are already imported by `apps/web` today but were never
declared — they only resolved because `next-sanity` (or `next`) happened to pull them in.
`@sanity/webhook` is the signature check for the revalidation endpoint and has **no other
provider**; removing `next-sanity` without declaring it breaks the build. `@next/env` is
imported directly by the migration script you edited in G10c. See addendum §B-3.

The resulting `dependencies` block must be **exactly** this — copy it verbatim, there is no
`next-sanity`, `sanity`, `styled-components`, `@sanity/icons` or `@sanity/vision` line:

```json
"dependencies": {
  "@next/env": "16.2.4",
  "@portabletext/react": "^6.0.3",
  "@portabletext/types": "^4.0.2",
  "@sanity/client": "^7.22.0",
  "@sanity/webhook": "^4.0.4",
  "@sentry/nextjs": "^10.51.0",
  "@upstash/ratelimit": "^2.0.8",
  "@upstash/redis": "^1.37.0",
  "@v2/schema-shared": "*",
  "@vercel/postgres": "^0.10.0",
  "groq": "^5.23.0",
  "jose": "^6.2.3",
  "next": "16.2.4",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "resend": "^6.12.2"
}
```

Leave `devDependencies` untouched.

Also **delete** the now-dead script `"sanity:dev": "next dev"` from `apps/web/package.json`.

---

### G12 — Delete the web Studio mount

```bash
git rm -r "apps/web/src/app/studio"
```

**Verify — four checks, all scoped to *all* of `apps/web`, not just `src/`.** The original
version of this handbook checked only `next-sanity` and missed
`apps/web/scripts/sync-faqs-locations-to-sanity.mts`, which is why G10c exists.

```bash
git grep -n "next-sanity" -- apps/web
```
```bash
git grep -n "styled-components" -- apps/web
```
```bash
git grep -nE "@sanity[/](icons|vision)" -- apps/web
```
```bash
git grep -nE "from .sanity." -- apps/web
```

Expected: **no output from any of the four.** If anything remains, G10 or G12 is incomplete.

> **Prove the pattern before trusting an empty result.** Per R6, a mangled pattern returns
> nothing and looks identical to a pass. For each check that uses `-E`, run it once with a
> term you know is present — e.g. swap `@sanity[/](icons|vision)` for
> `@sanity[/](icons|vision|client)`, which must print the `client.ts` and the migration
> script. If the positive control prints nothing, your shell is eating the pattern: switch
> to PowerShell and re-run everything.

---

### G13 — Relocate the two contract tests

**Why:** both tests read source files on *both* sides of the split, so neither can live in
`apps/studio`. They become repo-level contract tests inside `apps/web`'s suite, which is the
only workspace with vitest. See addendum §B-4.

They must stay under `src/**` — `apps/web/vitest.config.ts` has `include: ["src/**/*.test.ts"]`
— and must **not** go to `apps/web/tests/`, which is Playwright's `testDir`.

```bash
mkdir -p apps/web/src/lib/__tests__
git mv apps/studio/src/sanity/schemaTypes/__tests__/contentBodyImage.test.ts apps/web/src/lib/__tests__/contentBodyImage.test.ts
git mv apps/studio/src/sanity/schemaTypes/__tests__/fullPathGuardrails.test.ts apps/web/src/lib/__tests__/fullPathGuardrails.test.ts
```

Then remove the now-empty folder if git left it: `rmdir apps/studio/src/sanity/schemaTypes/__tests__` (ignore an error if it is already gone).

**13a — In BOTH files, change `ROOT` to the repo root.** The files are now five levels deep
(`apps/web/src/lib/__tests__/`):

```diff
-const ROOT = resolve(__dirname, "../../../../");
+const ROOT = resolve(__dirname, "../../../../../");
```

**13b — `contentBodyImage.test.ts` — rewrite the four read paths:**

| Line | Old | New |
|---|---|---|
| 32 | `"src/sanity/schemaTypes/contentShared.ts"` | `"apps/studio/src/sanity/schemaTypes/contentShared.ts"` |
| 38 | `"src/sanity/schemaTypes/contentArticle.ts"` | `"apps/studio/src/sanity/schemaTypes/contentArticle.ts"` |
| 43, 48, 56, 63 | `"src/lib/sanity/queries/shared.ts"` | `"apps/web/src/lib/sanity/queries/shared.ts"` |
| 68, 73 | `"src/components/content/ArticleView.tsx"` | `"apps/web/src/components/content/ArticleView.tsx"` |

**13c — `fullPathGuardrails.test.ts` — rewrite the four read paths:**

| Line | Old | New |
|---|---|---|
| 13 | `"../../docs/cms/url-rename-runbook.md"` | `"docs/cms/url-rename-runbook.md"` |
| 23 | `"src/sanity/components/FullPathPreviewInput.tsx"` | `"apps/studio/src/sanity/components/FullPathPreviewInput.tsx"` |
| 32 | `"src/sanity/schemaTypes/contentShared.ts"` | `"apps/studio/src/sanity/schemaTypes/contentShared.ts"` |
| 44 | `"next.config.ts"` | `"apps/web/next.config.ts"` |

Note line 13 loses its `../../` prefix — the old `ROOT` was `apps/web/`, so it had to climb
out; the new `ROOT` is already the repo root.

**Change no assertions.** Only `ROOT` and the strings inside `read(...)`.

---

### G14 — Update the root scripts

**Edit** `package.json` (repo root) — the `scripts` block becomes:

```json
"scripts": {
  "dev": "npm run -w apps/web dev",
  "dev:web": "npm run -w apps/web dev",
  "dev:studio": "npm run -w apps/studio dev",
  "build": "npm run -w packages/schema-shared typecheck && npm run -w apps/web build && npm run -w apps/studio build",
  "build:web": "npm run -w apps/web build",
  "build:studio": "npm run -w apps/studio build",
  "start": "npm run -w apps/web start",
  "lint": "npm run -w apps/web lint && npm run -w apps/studio lint",
  "typecheck": "npm run -w packages/schema-shared typecheck && npm run -w apps/web typecheck && npm run -w apps/studio typecheck",
  "test": "npm run -w apps/web test",
  "test:e2e": "npm run -w apps/web test:e2e",
  "verify:production-env": "npm run -w apps/web verify:production-env"
}
```

`test` stays web-only on purpose — the Studio has no tests (G13).

---

### G15 — Update CI

**Edit** `.github/workflows/ci.yml`. After the existing "Restore Next.js cache" step, add a
second cache step for the Studio:

```yaml
      - name: Restore Studio Next.js cache
        uses: actions/cache@v5
        with:
          path: apps/studio/.next/cache
          key: ${{ runner.os }}-nextjs-studio-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('apps/studio/**/*.{js,jsx,ts,tsx}') }}
          restore-keys: |
            ${{ runner.os }}-nextjs-studio-${{ hashFiles('**/package-lock.json') }}-
```

No other CI change is needed: `npm run lint`, `npm run typecheck` and `npm run build` already
fan out to both workspaces via the root scripts you edited in G14.

Leave `.github/workflows/lighthouse.yml` alone — it audits the public site only.

---

### G16 — Reinstall, verify, commit

**16a — Regenerate the lockfile:**

```bash
npm install
```

(from the repo root — **not** `npm ci`, and never inside a workspace folder). Expect
`package-lock.json` to change. That is intended and belongs in this commit.

**16a.2 — Stage everything now, before the checks.** The boundary checks in 16c use
`git grep`, which only searches **tracked** files — the files you created in G1–G8 are still
untracked and would be silently skipped:

```bash
git add apps/studio apps/web package.json package-lock.json .github/workflows/ci.yml
```

**16b — Run the full gate. All must exit 0:**

```bash
npm run typecheck
```
```bash
npm run lint
```
```bash
npm run build
```
```bash
npm test
```

**16c — Boundary checks. Run these in PowerShell (R6). Each must produce the stated output:**

```bash
git grep -nE "@[/](lib|components|app)" -- apps/studio
```
→ no output (R3). The `[/]` bracket form makes this one safe in Git Bash as well.

```bash
git grep -n "studio/" -- apps/studio/src
```
→ exactly one line: `contentShared.ts:59` (R1).

```bash
git grep -n "basePath" -- apps/studio/sanity.config.ts
```
→ `basePath: "/",`

Re-run all four G12 verify checks (`next-sanity`, `styled-components`,
`@sanity[/](icons|vision)`, `from .sanity.`) against `apps/web`.
→ no output from any of them.

```bash
git grep -n "FILE_ROUTE_REDIRECTS" -- apps/web/next.config.ts
```
→ still present (R2 — you have not touched this file yet; Phase 3 does).

```bash
npm ls sanity --workspace apps/web
```
→ the tree under `@v2/web` must list **no** `sanity` entry. (For reference, before Gate B
it printed `@sanity/vision@5.28.0 -> sanity@5.23.0 deduped` and `next-sanity@12.3.1`.) If
`sanity` still appears, one of `sanity`, `@sanity/vision` or `next-sanity` is still declared
in `apps/web/package.json`.

**16d — Run the Studio locally and click it:**

```bash
npm run dev:studio
```

Open `http://localhost:3000/`. You must see the Studio with the Vietnamese desk, **at the
root path, not under `/studio`**. Check three things:
1. The "Bảng điều khiển" dashboard tool loads as the first tool.
2. A shortcut card in the dashboard navigates correctly (its URL is now `/structure/...`).
3. Open any `content_article` and confirm the "Mở trang trực tiếp" action still points at
   `https://v2badminton.com/...`.

Then stop the dev server and check the web app still builds and serves without the mount:

```bash
npm run dev
```

`http://localhost:3000/studio/` must no longer serve the Studio. It renders the
"Không tìm thấy trang" not-found page instead. That is correct at this stage — the redirect
does not exist until Phase 3.

**Expect HTTP 200, not 404.** This site answers *every* unknown path with 200 plus a
not-found body — a pre-existing site-wide soft-404 from the content catch-all, unrelated to
Gate B. Confirm with a control: request an invented path such as
`http://localhost:3000/khong-ton-tai-abc/` and see the same 200. What G16d actually proves
is that `/studio/` now behaves like any other non-existent path, i.e. the mount is gone.

**16e — Commit.** Everything was staged in 16a.2. Re-stage in case the dev runs in 16d
touched anything, then review:

```bash
git add apps/studio apps/web package.json package-lock.json .github/workflows/ci.yml
git status --short
```

Review the list. You should see: renames under `apps/studio`, deletions under
`apps/web/src/app/studio`, modifications to the two web source files, both package.json
files, the lockfile, and the CI file. **Nothing else.** Then:

```bash
git commit -m "chore(cms): Gate B — split Sanity Studio into apps/studio

Creates the apps/studio workspace and moves the Studio out of apps/web:
config, CLI, schema types, tools, badges and components. basePath flips to
'/' and the Studio's own /studio/* links lose the prefix, since it now
serves from the root of its own origin.

apps/web drops next-sanity in favour of @sanity/client + groq (both are
pure re-exports, so behaviour is unchanged) and declares five dependencies
it was importing without declaring: @portabletext/react, @portabletext/types,
@sanity/webhook, @sanity/client, groq. That removes sanity and
styled-components from the web install.

The two schema contract tests read files on both sides of the split, so they
move to apps/web/src/lib/__tests__ with repo-root-relative paths rather than
following the schema into apps/studio.

No DNS, Vercel or Sanity dashboard changes. No redirect yet — /studio 404s
on the web app until Phase 3 lands, after cms.v2badminton.com is live.

See docs/cms/gate-b-junior-handbook.md and
docs/cms/gate-b-addendum-2026-09-09.md.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

**16f — Push and open a PR:**

```bash
git push -u origin chore/cms-studio-cutover
```

**STOP HERE.** Phase 2 is owner work on three dashboards. Do not proceed alone.

---

## 3. Phase 2 — dashboards (owner only)

> **The coding model does not do this section.** It needs Sanity, Vercel and Cloudflare
> logins. Steps run in this order; each has a verification you must see pass before the next.

### P2.1 — Sanity CORS (`manage.sanity.io`)

Add two CORS origins, **both with credentials allowed**:

- `https://cms.v2badminton.com`
- `https://v2badminton-studio.vercel.app`

**Do not remove** any existing origin. `https://v2badminton.com`, the existing Vercel preview
alias and `http://localhost:3000` all stay.

### P2.2 — Vercel: create the Studio project

- Team: `team_7fCxBpY1zkfDmwChuDqgsiiR` (same as `v2badminton-next`).
- New project `v2badminton-studio`, linked to the **same GitHub repo**.
- **Root Directory: `apps/studio`.** Framework preset: Next.js.
- Environment variables — Production, Preview **and** Development, **only these three**:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `NEXT_PUBLIC_SITE_URL`
- Turn on **Password Protection** for the bake window.

> **Check the variables are really set — a working Studio does not prove it.**
> `apps/studio/next.config.ts` falls back to the committed `w58s0f53` / `production`
> defaults (G4), so a forgotten variable does **not** show up as a broken Studio. It shows
> up as a Studio quietly pointing at the real production dataset, which is usually the right
> target and therefore invisible. Two things to do:
>
> 1. Open the Vercel project's Environment Variables page and confirm all three are present
>    in Production, Preview **and** Development. Read the list; do not infer it.
> 2. Open the deployment's build log and search for `[studio]`. The build warns
>    `NEXT_PUBLIC_… is not set — falling back to the committed default` for any missing
>    variable. A clean build log means they were genuinely set.
>
> This matters most if a preview is ever meant to point at a non-production dataset.

**P2.3 — Verify the Preview before merging Phase 1.**
Vercel will build a Preview from the `chore/cms-studio-cutover` branch. Open that preview
URL and confirm the Studio loads and you can open a document. **Only merge the Phase 1 PR
after this passes** — merging first would delete `v2badminton.com/studio` while nothing
replaces it.

### P2.4 — Ignored Build Step (both projects)

On **each** of `v2badminton-next` and `v2badminton-studio`, set the Ignored Build Step to:

```bash
git diff --quiet HEAD^ HEAD -- ./ ../../packages/schema-shared ../../package-lock.json
```

The plan's `git diff --quiet HEAD^ HEAD ./` is wrong — it would cancel both deploys when
only the shared schema package or the root lockfile changed, shipping a stale schema. See
addendum §B-7.

**Verify:** push a commit that touches only `packages/schema-shared/` and confirm **both**
projects rebuild.

### P2.5 — Cloudflare DNS

1. **Back up first.** Export the zone's DNS records (cutover-guide §3.1). Store outside the repo.
2. Check for `CAA` records. If any exist they must permit `letsencrypt.org`, or the
   certificate will hang at "Pending".
3. Add: type `CNAME`, name `cms`, target `cname.vercel-dns.com.`,
   **Proxy status: DNS only (gray cloud)**. An orange cloud blocks Vercel's certificate issuance.
4. Leave the apex `A 76.76.21.21` and the `www` record untouched.

**Verify:**

```bash
nslookup cms.v2badminton.com 1.1.1.1
```

→ resolves to a Vercel host. Then add `cms.v2badminton.com` as a domain on the
`v2badminton-studio` Vercel project and wait for SSL to read "Issued".

**STOP IF** SSL is still "Pending" after 10 minutes with DNS resolving correctly — check
CAA records (cutover-guide §4.4).

### P2.6 — Real editing session

Log in at `https://cms.v2badminton.com/`, open a document, make a trivial edit and publish it.
Confirm the change appears on `https://v2badminton.com/` within a minute (that also proves
the revalidation webhook still works after the dependency change).

**Only after this passes does Phase 3 begin.**

---

## 4. Phase 3 — the redirect (one commit)

> **Precondition:** `https://cms.v2badminton.com/` is live and has served a real editing
> session (P2.6). Do not land this earlier — it would redirect to a dead host.

### G17 — Append the `/studio` rules to `FILE_ROUTE_REDIRECTS`

```bash
git fetch origin
git checkout -b chore/cms-studio-redirect origin/main
```

**Do not use `git checkout main`** — see R7. Branch straight off `origin/main` as above.

**Edit** `apps/web/next.config.ts`. Find the `FILE_ROUTE_REDIRECTS` array (it currently holds
the two `/blog` entries) and **append** these two entries inside it. Do **not** touch
`async redirects()` (R2):

```ts
  // /studio/* -> cms.v2badminton.com (Gate B). The Studio moved to its own
  // origin; see docs/cms/gate-b-addendum-2026-09-09.md §B-1. Split into two
  // rules for the same trailing-slash reason as the /blog rules above.
  { source: "/studio", destination: "https://cms.v2badminton.com/", permanent: true },
  {
    source: "/studio/:path+",
    destination: "https://cms.v2badminton.com/:path+",
    permanent: true,
  },
```

**Verify:**

```bash
npm run build
```
```bash
npm test
```

Both exit 0. `fullPathGuardrails.test.ts` must still pass — if it fails you replaced
`redirects()` instead of appending (R2).

Also confirm the `/blog` rules are still there:

```bash
git grep -n "tin-tuc" -- apps/web/next.config.ts
```

**Commit:**

```
fix(cms): Gate B — redirect /studio/* to cms.v2badminton.com

The Studio now serves from its own origin. Appends two entries to
FILE_ROUTE_REDIRECTS (never replacing redirects(), which still carries the
/blog -> /tin-tuc rules). Split into an index rule and a :path+ rule for the
same trailing-slash reason documented on the /blog entries.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

## 5. Phase 4 — verify the deep links

After the Phase 3 deploy is live, run these three. Each must return `308` with a `Location`
pointing at the matching `cms.v2badminton.com` URL, tail preserved:

```bash
curl -sI https://v2badminton.com/studio/ | grep -iE "^location|^HTTP/"
```
```bash
curl -sI "https://v2badminton.com/studio/structure/pages-group;content_article" | grep -iE "^location|^HTTP/"
```
```bash
curl -sI "https://v2badminton.com/studio/intent/edit/id=foo;type=content_article" | grep -iE "^location|^HTTP/"
```

Then **open each target URL in a browser** and confirm the Studio resolves it to the
intended pane/document.

> **The one genuinely unverified thing in this whole plan.** The web app sets
> `trailingSlash: true`, so a deep link may arrive at the Studio with a trailing slash on
> the tail. Whether Sanity's router accepts that form has not been tested. If a slashed
> deep link mis-resolves, move the two rules out of `redirects()` and into
> `apps/web/src/proxy.ts`, which issues the 308 without trailing-slash normalisation.
> Report this before improvising anything else.

Also check:

```bash
curl -sI https://cms.v2badminton.com/robots.txt
```
→ 200, and the body contains `Disallow: /`.

---

## 6. Rollback

| Symptom | Fix | Time |
|---|---|---|
| Studio broken on `cms.` | Remove the Cloudflare CNAME. Editors use `v2badminton-studio.vercel.app`. | ~5 min |
| Deep links dead / wrong target | `git revert` the Phase 3 commit. `/studio` 404s again; nothing is misrouted. | one deploy |
| Web build broken after the dep swap | `git revert` the Phase 1 commit; `next-sanity` and the old tree return. | one deploy |
| Editors fully blocked | `git revert` the Phase 1 commit — this restores `apps/web/src/app/studio/` and `basePath: "/studio"` together. | one deploy |

Because Phase 1 is a single commit, a single `git revert` restores the pre-Gate-B state
completely. Keep it that way — do not split Phase 1 across several commits.

---

## 7. Done checklist

Gate B is complete when every line is true:

- [ ] `npm run build`, `npm run lint`, `npm run typecheck`, `npm test` all exit 0 from the repo root
- [ ] `git grep -n "studio/" -- apps/studio/src` returns exactly one line (`contentShared.ts:59`)
- [ ] `git grep -n "basePath" -- apps/studio/sanity.config.ts` returns `basePath: "/",`
- [ ] `git grep -nE "@[/](lib|components|app)" -- apps/studio` returns nothing
- [ ] All four G12 checks return nothing against `apps/web` — `next-sanity`,
      `styled-components`, `@sanity[/](icons|vision)`, `from .sanity.`
- [ ] `npm ls sanity --workspace apps/web` lists no `sanity` entry under `@v2/web`
- [ ] `apps/web/src/app/studio/` no longer exists
- [ ] `apps/web/next.config.ts` still contains the `/blog` → `/tin-tuc` rules
- [ ] `https://cms.v2badminton.com/` loads the Studio and has published a real edit
- [ ] All three `/studio/*` deep links 308 correctly **and load in a browser**
- [ ] `https://cms.v2badminton.com/robots.txt` serves `Disallow: /`
- [ ] A `packages/schema-shared`-only commit rebuilds **both** Vercel projects
- [ ] A published Sanity edit still appears on the live site within a minute (proves the
      revalidation webhook survived the `@sanity/webhook` re-declaration)

**Then tell the owner two things:** Gate B is done, and — per addendum §7 — draft preview
(P1.6) and the fail-closed fallbacks (P1.7) are still open, so the CMS workstream is not
finished by this alone.
