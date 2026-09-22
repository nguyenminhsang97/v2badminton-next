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

If a fetch helper's tags aren't covered by that map, published edits stay invisible until the 24h timer. Watch for embedding: `location`, `pricing_tier` and `faq` are dereferenced inside money-page queries, so they also purge `sanity:money-pages`. Any new type that dereferences another type needs the same treatment. An unmapped `_type` is a 200 no-op with a warning in the runtime log.

## Diagnosing "đã publish mà web không đổi"

Work through these in order and stop at the first step that explains the symptom. Don't jump to the webhook: most "stale" reports turn out to be edits that never published.

1. **Did the edit reach the published dataset?** Authenticated read of the document: its `_updatedAt`, whether a `drafts.` copy or a release version is still pending, and whether the value the live page shows equals the published value. If the page already matches published data, nothing is cached wrongly — the edit never published (blocked by validation, made in another Studio tab or preview URL, or discarded).
2. **Is the edited document actually on that page?** Follow the page's references (for example `money_page.relatedPricing`). Editing a document the page doesn't reference changes nothing there.
3. **Are the page's fetch tags purged?** Compare the helper's `tags` with `revalidationMap.ts`, including embedded types.
4. **Did the webhook fire and pass?** Read the attempt log in Sanity manage (API → Webhooks; expect 200), the Vercel runtime logs for `[revalidate/sanity]`, and confirm `SANITY_REVALIDATE_SECRET` is set on the web project.
5. **If the webhook missed**, the old value stays until the 24h ISR safety net (`SANITY_REVALIDATE_SECONDS`, default 86400). Tell the owner that — don't promise "a few minutes".
6. **Is the same fact stored twice?** A `pricing_tier` keeps its price as text (`displayPrice`) and as numbers (`pricePerMonth` / `pricePerHour`); some FAQ answers repeat prices in plain text. An edit to one copy leaves the others old.

## Adding or changing a document type

1. Schema file in `schemaTypes/`, added to `schemaTypes/index.ts`.
2. A bucket in `structure.ts` (anything unlisted lands in "Khác").
3. If it's a singleton, add it to `singletonTypes`.
4. The GROQ projection and its hand-written type in `apps/web/src/lib/sanity/`.
5. A fetch helper with tags, exported from `lib/sanity/index.ts`.
6. A `revalidationMap.ts` entry covering the tags of every query that embeds this type.
7. If it's routable: `resolvePath` + `ROUTABLE_TYPES` in `packages/schema-shared/src/resolvePath.ts` (these drive "Mở trang trực tiếp" and "Xem bản nháp"), and the sitemap. Content-platform types also go in `ROUTABLE_TYPES` in `contentShared.ts` for path uniqueness.
8. Make sure nothing else can claim its URLs: a file-routed type reserves its prefix in `CODE_RESERVED_PREFIXES` / `FILE_ROUTED_PATHS`; a type routed through a hub relies on `fullPath` uniqueness.
9. Option lists that web also renders (districts, audiences, CTA actions) belong in `packages/schema-shared/src/options.ts`.
10. Readiness badges, if editors need a nudge: `BADGES_BY_TYPE` in `apps/studio/sanity.config.ts`.
11. Existing documents don't migrate themselves. A renamed or newly required field needs a backfill plan, agreed with the owner, before it deploys.

## Content-platform routing

`content_hub`, `content_node`, `content_article` and `court` are served by `apps/web/src/app/(site)/[...slug]/page.tsx`, which resolves an exact `fullPath`.

- `fullPath` is generated from the parent chain plus the document's own slug (`defineFullPathField`) and must be globally unique. `findPathConflict` enforces this in the Studio.
- A CMS path may not equal an entry in `FILE_ROUTED_PATHS` or start with an entry in `CODE_RESERVED_PREFIXES` (both in `contentShared.ts`). When web adds a file-routed page, add its path to `FILE_ROUTED_PATHS`.
- More than 3 levels below the hub is a soft warning.
- Renaming a published `fullPath` requires a `route_redirect` first — see `docs/cms/url-rename-runbook.md`.
- Slugs come from `slugifyValue`: diacritics stripped, `đ` → `d`, lowercase, hyphen-separated, at most 96 characters.
- A post's public path is defined twice: in `resolvePath` (Studio links) and by the web route (`/tin-tuc/<slug>/`). Move them together.

## Draft preview

**Does a deployment have the viewer token?** Send a plain GET, no secret, to `<deployment>/api/draft-mode/enable/`: `401 invalid_secret` means `SANITY_API_VIEWER_TOKEN` reached it, `500 draft_mode_not_configured` means it did not. A Vercel env change only reaches deployments built after it, so check a fresh one.

How an editor sees unpublished changes:

1. The Studio action **"Xem bản nháp"** calls `createPreviewSecret`, which stores a short-lived, single-use secret in the dataset. It then opens `https://v2badminton.com/api/draft-mode/enable/?sanity-preview-secret=…&sanity-preview-pathname=<path>` — with the trailing slash, since the web app sets `trailingSlash: true` and would otherwise answer with a 308 first.
2. The enable route checks the secret with `validatePreviewUrl`, reduces the redirect target to a same-origin path, enables `draftMode()`, and returns a 307 with `no-store` + `noindex`.
3. While the `__prerender_bypass` cookie is present, `sanityFetchWithStatus` uses the draft client: its own `SANITY_API_VIEWER_TOKEN`, `perspective: "drafts"`, `cache: "no-store"`. `proxy.ts` adds `noindex` + `no-store` to every page response.
4. `/api/draft-mode/disable/?path=…` leaves preview and needs no secret.

Each invariant below exists for a reason — keep it:

- No static shared secret. The Studio is a separate public origin, so anything in its bundle is public.
- Draft data never passes through the published client, a cache entry, or an indexable response.
- No viewer token means no preview (HTTP 500). Never fall back to published data presented as a draft.
- `draftMode()` throws outside a request (build, `generateStaticParams`, tests). Treat that as "not a draft".

"Mở trang trực tiếp" (`openLivePageAction`) always opens the *published* URL. The two actions answer different questions: "what does the world see" versus "what am I about to publish".

**Known limitation — check before relying on it.** `content_article` and `court` queries (`ROUTE_RESOLUTION_QUERY` and the by-id queries in `lib/sanity/queries/shared.ts`) also require their own `status` field to be `"published"`, which is independent of Sanity publishing. So a new article still marked "Nháp" previews as not-found until the editor sets Trạng thái = Đã đăng inside the draft. Read the current queries before telling an editor this; it may have been fixed.

## Working with live data (MCP, CLI, scripts)

- **Authenticate every read.** Anonymous reads of `production` silently return a *subset*: documents whose `_id` contains a dot (such as `pricingTier.group-basic-2x` or `location.green`) are hidden, so pricing tiers and locations come back empty and FAQs come back partial. An empty result from an unauthenticated query proves nothing.
- Call `get_schema` before querying or writing through the Sanity MCP. Document ids don't always follow the type name.
- The Sanity MCP's credentials come from the `env` block in `~/.claude/settings.json`, not from `.env.local`.
- **Confirm with the owner before any mutation**: create, patch, publish, unpublish, discard drafts, delete, `deploy_schema`, `deploy_studio`, CORS or dataset changes. Name the document ids and the exact change. By default, create or edit content as a draft and let the owner publish after checking it with "Xem bản nháp".
- **Production HTTP endpoints get read-only requests.** While investigating, send only GETs to v2badminton.com and cms.v2badminton.com. Never POST to an API route — not even an unsigned probe of `/api/revalidate/sanity/` that you expect to be rejected. Webhook health is read from Sanity's attempt log and Vercel's runtime logs, not tested by calling the endpoint.
- Schema changes reach editors by deploying `apps/studio` on Vercel (push → build). Gate B removed the Sanity-hosted Studio registrations, so don't run `deploy_studio` as well.

### Writing content: drafts by script, published by the owner

Approved by the owner on 2026-09-22, after eleven documents took an afternoon through the Studio UI.

- **The Sanity MCP cannot write.** Its token is "Codex Local Read Token (Robot)", role `read`; `patch_documents` comes back with `permission "create" required`. Don't plan a task around MCP writes — check with `whoami` if unsure.
- **The write token is the `SANITY` variable in the repo-root production env file** (gitignored, so it is on the owner's machine only): robot token "Read and edit CMS", role `write`. Identify a token by sending a GET to `https://w58s0f53.api.sanity.io/v2021-06-07/users/me` with it. Never print a token, echo it into a log, or paste it anywhere.
- **The flow.** Agree the exact wording with the owner first — one table of document id → field → old sentence → new sentence — then write a script that reads the published documents, builds `drafts.<id>` copies carrying the new text, and asserts every old string is still there before replacing it. Use `create`, never `createOrReplace`, so an existing draft aborts the run instead of being overwritten, and send all mutations in one transaction. The script never publishes.
- **Dry run, then hand the command over.** Sanity's `dryRun=true` validates permissions and content and writes nothing; run that first and show the resulting sentences. Claude Code's auto mode refuses the committing request itself ("Modify Shared Resources"), so give the owner the one-line command to run.
- **Verify twice.** Before handing over, query with `perspective=drafts` and run `skills/noi-dung-vi/scripts/check-facts.mjs --input <file>`. After the owner publishes, run `check-facts.mjs` against production and grep the live pages for the old sentences. Expect the owner to have reworded some drafts — read what was published, don't assume your text survived.
- **Driving the Studio UI with a browser tool is the fallback, and a poor one.** Key events (Backspace, arrow keys) never reach Sanity's Portable Text editor; only typing and mouse clicks land. Deleting anything means selecting it and typing over it, and you must read `window.getSelection()` anchor and focus block keys before every keystroke: a shift-click one line too far puts the focus in the *next* block, where typing silently merges two blocks.

## Local dev

```bash
npm run dev:web                            # http://localhost:3000
npm run -w apps/studio dev -- -p 3333      # CORS allows localhost:3000 and :3333
```

Tests (run with `npm test`): `apps/web/src/app/api/draft-mode/__tests__`, `apps/web/src/app/api/revalidate/sanity/__tests__`, `apps/web/src/lib/sanity/__tests__`.

## Background reading

- `docs/cms/gate-b-completion-2026-09-10.md` — topology, CORS, webhook, Vercel projects, open items. Read it before `gate-b-junior-handbook.md`, which is history.
- `docs/cms/url-rename-runbook.md`.
- `.claude/CMS/v2badminton-cms-phase-1-locked-spec.md`, `.claude/CMS/v2badminton-cms-phase-2-locked-spec.md`, `.claude/CMS/v2badminton-cms-cache-revalidation-plan.md` — local only, gitignored: they exist on the owner's machine, not in a fresh clone or worktree.
