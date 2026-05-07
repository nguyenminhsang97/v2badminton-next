---
name: v2badminton-next
description: Use when working in D:\V2\v2badminton-next on Next.js UI, routing, content, data fetching, SEO, launch readiness, Codex tooling, browser verification, or Cloudflare/Vercel deployment decisions.
---

# V2 Badminton Next.js Project Skill

This repo is a Next.js 16 App Router site for V2 Badminton. Use this skill to keep implementation, review, and verification aligned with the project.

## Read First

1. Read `AGENTS.md`.
2. Before changing Next.js code, read the relevant local guide under `node_modules/next/dist/docs/`.
3. Inspect the live files before recommending or editing; this repo has project-specific CSS and data fallbacks.

## Project Shape

- App Router lives under `src/app`.
- The public site route group is `src/app/(site)`.
- Global shell is split between `src/app/layout.tsx` and `src/app/(site)/layout.tsx`.
- Homepage sections live in `src/components/home/sections`.
- Contact form code lives in `src/components/home/forms` and submits through `src/app/actions/submitLead.ts`.
- Shared content blocks live in `src/components/blocks`.
- Layout components live in `src/components/layout`.
- Money page rendering lives in `src/components/money-page`.
- Data access is primarily through `src/lib/sanity`, `src/lib/db`, and supporting `src/lib/*` modules.
- Styling is global CSS from `src/app/globals.css`, importing `src/styles/**`; this project is not Tailwind-driven unless that changes explicitly.

## MCP And Docs Defaults

- Use `openaiDeveloperDocs` for Codex, MCP, OpenAI API, ChatGPT Apps SDK, tools, and model questions.
- Use Context7 for current Next.js, React, Sanity, Vercel, Sentry, Upstash, and related library docs.
- Still prefer local Next.js docs in `node_modules/next/dist/docs/` before modifying framework-sensitive files.
- Use Playwright MCP or Browser Use for local UI verification after frontend changes.

## Plugin Defaults

- Use Browser Use or Playwright for local route checks, responsive UI checks, and screenshots.
- Use Vercel capabilities for Vercel env, preview, deployment, or runtime questions.
- Use Sentry capabilities for production error and monitoring inspection.
- Use Cloudflare capabilities for Workers/OpenNext, Wrangler, bindings, and Cloudflare API work.
- Use GitHub capabilities for PR, issue, review, and CI workflows.
- Use Figma capabilities only when the task involves Figma design/design-system work.

## UI And Styling Rules

- Preserve the existing global CSS/BEM-style class approach unless the user asks for a styling migration.
- Do not introduce Tailwind or shadcn/ui unless the user explicitly asks for that migration.
- Keep UI handlers thin and push business logic into service/data modules where possible.
- Avoid broad visual refactors during narrow fixes.
- For frontend changes, check at least the affected route plus a representative mobile viewport.

## Data And Runtime Rules

- Keep Sanity reads behind `src/lib/sanity` helpers and preserve fallback behavior.
- Keep lead submission validation, anti-spam, dedupe, database writes, and notifications in the existing service path.
- Do not initialize database, Redis, email, or external service clients at module scope if a new client is added.
- Treat production readiness as broader than a passing build: include SEO, legal/trust, env, lead pipeline, monitoring, and CI gates when the user asks about launch or cutover.

## Useful Verification

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run test:mobile`
- `npm run verify:production-env`

On this Windows workspace, `rg` may fail with access denied. Use PowerShell `Get-ChildItem` and `Select-String` as reliable fallbacks.
