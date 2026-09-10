<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Repo layout — read this before touching CMS or Studio code

This is an npm-workspaces monorepo with **two deployed apps**, split in Gate B (2026-09-10):

| Path | Vercel project | Serves |
|---|---|---|
| `apps/web` | `v2badminton-next` | `v2badminton.com` — the public site |
| `apps/studio` | `v2badminton-studio` | `cms.v2badminton.com` — Sanity Studio |
| `packages/schema-shared` | — | route/path helpers used by both; keep it Sanity-free |

Rules that outlive Gate B:

- **The Studio is not inside `apps/web` any more.** `v2badminton.com/studio` does not exist,
  and there is no redirect. Studio work goes in `apps/studio`.
- **`apps/studio` must never import `@/…` from the web app.** Its `@/*` alias points only at
  `apps/studio/src/*`. Anything shared crosses through `@v2/schema-shared`.
- **`apps/web` must not depend on `next-sanity`** — it drags the whole Studio in as a peer.
  Use `@sanity/client` and `groq` directly.
- **`apps/studio` must not set `trailingSlash`.** The web app does; the Studio must not, or
  Sanity's own routes (`/structure/pages-group;content_article`) stop resolving.
- **`CODE_RESERVED_PREFIXES` in `apps/studio/src/sanity/schemaTypes/contentShared.ts` keeps
  `"/studio/"`.** That entry reserves a *website* URL prefix; it is not a Studio link.
- **Env files live at the repo root**, not in the workspaces. Both apps hardcode
  `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` fallbacks in their
  `next.config.ts`, so they run with no `.env` file. To check a Studio deployment's env,
  search its build log for `[studio]` — no matches means the variables arrived. Do not infer
  it from the Studio loading, because the fallbacks make it load either way.

Background: `docs/cms/gate-b-completion-2026-09-10.md` is the record of what shipped and what
is still open. Read it before `docs/cms/gate-b-junior-handbook.md`, which is closed history.

## Codex Project Tooling

- Use the project-scoped `.codex/config.toml` for MCP/features that belong to this repo.
- Use the OpenAI developer docs MCP server for OpenAI API, ChatGPT Apps SDK, Codex, MCP, tool, or model questions without needing an explicit reminder.
- Use Context7 MCP for current framework/library docs when working with Next.js, React, Sanity, Vercel, Sentry, Upstash, or related packages. Still read the local Next.js docs in `node_modules/next/dist/docs/` before changing Next.js code.
- Use Browser Use or the Playwright MCP server for local UI verification after frontend changes. Start the dev server and check key routes at desktop and mobile sizes when the change affects UX.
- Subagents are available for this project, but only spawn them when the user explicitly asks for multi-agent or parallel-agent work.
- Memories are enabled for useful local recall, but durable project rules must stay in `AGENTS.md` or checked-in docs.
- On this Windows workspace, prefer Browser Use, Playwright MCP, shell, and file inspection for GUI/browser work. Codex Computer Use is a macOS-only app capability in the current official docs.
- Use the project-local `v2badminton-next` skill from `.codex/skills/v2badminton-next` for repo-specific UI, routing, data, styling, verification, and launch-readiness work.
- Use the project-local `seo` skill from `.codex/skills/seo` for any SEO task: metadata, structured data (JSON-LD), sitemap, robots, canonical URLs, Open Graph, Twitter cards, indexing control, or Core Web Vitals that affect crawling and ranking.
- Preferred plugin capabilities for this repo: Browser Use for local browser checks, Vercel for deployment/env questions, Sentry for monitoring, Cloudflare for Workers/OpenNext/Wrangler, GitHub for PR/CI work, and Figma only for design/design-system tasks.
