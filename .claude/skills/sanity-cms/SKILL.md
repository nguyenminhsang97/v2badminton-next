---
name: sanity-cms
description: How Sanity CMS works in the v2badminton.com monorepo — schemas in apps/studio, GROQ reads and cache tags in apps/web, webhook revalidation, draft preview ("Xem bản nháp"), content-platform routing by fullPath, route redirects, and safe use of the Sanity MCP / CLI against the live production dataset. Use it for any task involving Sanity, the Studio at cms.v2badminton.com, a document type or field, GROQ, "đã publish mà web không đổi", preview, publish/unpublish, or reading and writing CMS documents — even when the user only names a type such as money_page, faq, pricing_tier, coach, or content_article.
---

# Sanity CMS — v2badminton.com

Project `w58s0f53`, dataset `production`. It is the only dataset: **every write through the MCP, the CLI, or a script changes the live site.**

| Piece | Where | Serves |
|---|---|---|
| Studio: schemas, desk structure, actions, badges | `apps/studio` | cms.v2badminton.com |
| Read client, GROQ, result types, fetch helpers | `apps/web/src/lib/sanity/` | v2badminton.com |
| Publish webhook → cache purge | `apps/web/src/app/api/revalidate/sanity/route.ts` | v2badminton.com |
| Draft preview | `apps/web/src/app/api/draft-mode/{enable,disable}` + `apps/studio/src/sanity/actions/openDraftPreviewAction.tsx` | both |
| Route helpers and option lists shared by both apps | `packages/schema-shared/src/{resolvePath,options}.ts` | both |

## Boundaries, and why they exist

- **Studio code goes in `apps/studio`.** `v2badminton.com/studio` no longer exists.
- **`apps/studio` never imports `@/…` from web.** Its `@/*` alias only reaches `apps/studio/src/*`. Share through `@v2/schema-shared`.
- **`apps/web` never depends on `next-sanity`**, which pulls the whole Studio in as a peer. Web uses `@sanity/client` + `groq`. `next-sanity` is fine inside `apps/studio`.
- **`packages/schema-shared` stays Sanity-free**, so web can import it without Studio runtime dependencies.
- **`apps/studio` must not set `trailingSlash`**, or Studio routes such as `/structure/pages-group;content_article` stop resolving.
- **`CODE_RESERVED_PREFIXES` keeps `"/studio/"`.** It reserves a *website* URL prefix so no CMS document can claim it. It is not a link to the Studio.
- **Env files live at the repo root.** Both `next.config.ts` files hardcode `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` fallbacks, so a Studio deploy loads even with its env missing. To check a Studio deployment's env, search its build log for `[studio]`: no match means the variables arrived.

## Document types

Schemas live in `apps/studio/src/sanity/schemaTypes/` and are registered in `index.ts`. The desk layout is `apps/studio/src/sanity/structure.ts`.

| Desk bucket | Types |
|---|---|
| Cài đặt (singletons: publish / discard / restore only) | `site_settings`, `homepage_content` |
| Trang (routable) | `money_page`, `static_page`, `post`, `content_hub`, `content_node`, `content_article`; `court` is also routed by `fullPath` |
| Dữ liệu (referenced by pages) | `faq`, `coach`, `testimonial`, `location`, `pricing_tier`, `schedule_block`, `campaign` |
| Đường dẫn | `route_redirect` |

Studio UI text is Vietnamese: titles, descriptions, validation messages. Editors aren't developers, so a field description says what to do ("Bấm Generate SAU KHI đã đặt slug…"). Prefer `.warning()` over a blocking error unless publishing the bad value would actually break the site.

## Reading from web

Every read goes through `apps/web/src/lib/sanity/client.ts`:

```ts
export const getThing = cache(async (slug: string) =>
  sanityFetchOrFallback<SanityThing | null>({
    query: THING_BY_SLUG_QUERY,
    params: { slug },
    fallback: null,
    tags: ["sanity:things", `sanity:thing:${slug}`],
  }),
);
```

- `sanityFetchWithStatus` returns `{ data, state }`, where `state` is `success | missing_config | query_error`, for callers that must distinguish "no content" from "Sanity unreachable". `sanityFetchOrFallback` returns only the data.
- Published reads use `perspective: "published"` and `useCdn: false`. The CDN once served stale nulls for parameterised queries and poisoned the ISR cache, so leave it off.
- ISR revalidation defaults to 24h (`SANITY_REVALIDATE_SECONDS`) and is only a safety net. The webhook is the real freshness path.
- GROQ lives in `lib/sanity/queries/shared.ts` or beside its helper in `queries/*.ts`. Helpers are re-exported from `lib/sanity/index.ts`.
- Result types in `lib/sanity/types.ts` are **hand-written** — there is no Sanity typegen. Change a projection and its type together.

## Cache tags and the webhook

On publish, Sanity calls `POST https://v2badminton.com/api/revalidate/sanity/`. The route:

1. verifies the HMAC signature with `SANITY_REVALIDATE_SECRET`;
2. skips `drafts.` ids;
3. maps `_type` to tags in `lib/sanity/revalidationMap.ts`;
4. calls `revalidateTag(tag, { expire: 0 })` for each.

If a fetch helper's tags aren't covered by that map, published edits stay invisible until the 24h timer. That is the first thing to check for "tôi đã publish mà web không đổi". Watch for embedding: `location`, `pricing_tier` and `faq` are dereferenced inside money-page queries, so they also purge `sanity:money-pages`. An unmapped `_type` is a 200 no-op with a warning in the runtime log.

## Adding or changing a document type

1. Schema file in `schemaTypes/`, added to `schemaTypes/index.ts`.
2. A bucket in `structure.ts` (anything unlisted lands in "Khác").
3. If it's a singleton, add it to `singletonTypes`.
4. The GROQ projection and its hand-written type in `apps/web/src/lib/sanity/`.
5. A fetch helper with tags, exported from `lib/sanity/index.ts`.
6. A `revalidationMap.ts` entry covering the tags of every query that embeds this type.
7. If it's routable: `resolvePath` + `ROUTABLE_TYPES` in `packages/schema-shared/src/resolvePath.ts` (these drive "Mở trang trực tiếp" and "Xem bản nháp"), and the sitemap. Content-platform types also go in `ROUTABLE_TYPES` in `contentShared.ts` for path uniqueness.
8. Option lists that web also renders (districts, audiences, CTA actions) belong in `packages/schema-shared/src/options.ts`.
9. Readiness badges, if editors need a nudge: `BADGES_BY_TYPE` in `apps/studio/sanity.config.ts`.
10. Existing documents don't migrate themselves. A renamed or newly required field needs a backfill plan, agreed with the owner, before it deploys.

## Content-platform routing

`content_hub`, `content_node`, `content_article` and `court` are served by `apps/web/src/app/(site)/[...slug]/page.tsx`, which resolves an exact `fullPath`.

- `fullPath` is generated from the parent chain plus the document's own slug (`defineFullPathField`) and must be globally unique. `findPathConflict` enforces this in the Studio.
- A CMS path may not equal an entry in `FILE_ROUTED_PATHS` or start with an entry in `CODE_RESERVED_PREFIXES` (both in `contentShared.ts`). When web adds a file-routed page, add its path to `FILE_ROUTED_PATHS`.
- More than 3 levels below the hub is a soft warning.
- Renaming a published `fullPath` requires a `route_redirect` first — see `docs/cms/url-rename-runbook.md`.
- Slugs come from `slugifyValue`: diacritics stripped, `đ` → `d`, lowercase, hyphen-separated, at most 96 characters.
- A post's public path is defined twice: in `resolvePath` (Studio links) and by the web route (`/tin-tuc/<slug>/`). Move them together.

## Draft preview

How an editor sees unpublished changes:

1. The Studio action **"Xem bản nháp"** calls `createPreviewSecret`, which stores a short-lived, single-use secret in the dataset. It then opens `https://v2badminton.com/api/draft-mode/enable?sanity-preview-secret=…&sanity-preview-pathname=<path>`.
2. The enable route checks the secret with `validatePreviewUrl`, reduces the redirect target to a same-origin path, enables `draftMode()`, and returns a 307 with `no-store` + `noindex`.
3. While the `__prerender_bypass` cookie is present, `sanityFetchWithStatus` uses the draft client: its own `SANITY_API_VIEWER_TOKEN`, `perspective: "drafts"`, `cache: "no-store"`. `proxy.ts` adds `noindex` + `no-store` to every page response.
4. `/api/draft-mode/disable?path=…` leaves preview and needs no secret.

Each invariant below exists for a reason — keep it:

- No static shared secret. The Studio is a separate public origin, so anything in its bundle is public.
- Draft data never passes through the published client, a cache entry, or an indexable response.
- No viewer token means no preview (HTTP 500). Never fall back to published data presented as a draft.
- `draftMode()` throws outside a request (build, `generateStaticParams`, tests). Treat that as "not a draft".

"Mở trang trực tiếp" (`openLivePageAction`) always opens the *published* URL. The two actions answer different questions: "what does the world see" versus "what am I about to publish".

## Working with live data (MCP, CLI, scripts)

- **Authenticate every read.** Anonymous reads of `production` silently return a *subset* — for example 0 pricing tiers instead of 5, or 45 of 67 FAQs. An empty result from an unauthenticated query proves nothing.
- Call `get_schema` before querying or writing through the Sanity MCP. Document ids don't always follow the type name (e.g. `pricingTier.group-basic-2x`).
- The Sanity MCP's credentials come from the `env` block in `~/.claude/settings.json`, not from `.env.local`.
- **Confirm with the owner before any mutation**: create, patch, publish, unpublish, discard drafts, delete, `deploy_schema`, `deploy_studio`, CORS or dataset changes. Name the document ids and the exact change. By default, create or edit content as a draft and let the owner publish after checking it with "Xem bản nháp".
- Schema changes reach editors by deploying `apps/studio` on Vercel (push → build). Gate B removed the Sanity-hosted Studio registrations, so don't run `deploy_studio` as well.

## Local dev

```bash
npm run dev:web                            # http://localhost:3000
npm run -w apps/studio dev -- -p 3333      # CORS allows localhost:3000 and :3333
```

Tests (run with `npm test`): `apps/web/src/app/api/draft-mode/__tests__`, `apps/web/src/app/api/revalidate/sanity/__tests__`, `apps/web/src/lib/sanity/__tests__`.

## Background reading

- `docs/cms/gate-b-completion-2026-09-10.md` — topology, CORS, webhook, Vercel projects, open items. Read it before `gate-b-junior-handbook.md`, which is history.
- `docs/cms/url-rename-runbook.md`.
- `.claude/CMS/v2badminton-cms-phase-1-locked-spec.md`, `v2badminton-cms-phase-2-locked-spec.md`, `v2badminton-cms-cache-revalidation-plan.md` — local only, gitignored.
