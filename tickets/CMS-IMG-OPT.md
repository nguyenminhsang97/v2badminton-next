# CMS-IMG-OPT — Editor upload optimization

## Context

CMS-IBI (inline article body images) shipped with a soft 800 KB upload
warning and no upload-time compression. For V2's scale that is enough — most
editor uploads will be 1–3 MB phone photos and Sanity storage cost is
trivial. But oversize uploads still cost editor UX (slow Studio uploads on
patchy connections) and contribute to cold-LCP misses on the public site.

Before committing engineering time to an upload pipeline, we need data:
how often does this actually happen, on which fields, and how oversize? An
audit answers that and may make the rest of the ticket unnecessary.

## Phase 1 — Audit (must complete before Phase 2)

**Deliverable**: a markdown table committed to this file showing every
`sanity.imageAsset` over 2 MB, grouped by the field that references it.

**Method**:
1. Write a one-off script (Node + `next-sanity` server client) that runs:
   ```groq
   *[_type == "sanity.imageAsset" && size > 2000000]{
     _id, originalFilename, size, "uploadedAt": _createdAt,
     "referencedBy": *[references(^._id)]{ _type, _id }
   } | order(size desc)
   ```
2. Format into a table: filename, size MB, upload date, referencing doc type.
3. Commit the table to this ticket.

**Decision gate**: if the audit shows fewer than ~10 oversize assets total,
**stop here** and close the ticket. Manual re-compression in Studio is
cheaper than the pipeline. Document the close-out reason in this file.

## Phase 2 — Studio-side compression (only if audit warrants)

If the audit shows a steady stream of oversize uploads (rough threshold:
> 20 oversize assets, or > 1 new oversize asset per week of editor activity),
ship a client-side resize/re-encode hook in Sanity Studio.

**Approach**: Studio `customComponents` or `assetSources` hook that, on
upload, intercepts the file in the browser, resizes to max 2400 px on the
longest edge using `browser-image-compression` (~10 KB gzipped), re-encodes
as JPEG q≈85, and hands the result to Sanity's upload API. Original file
never reaches Sanity.

**Files likely to change** (Phase 2 only):
- `src/sanity/lib/imageUploadOptimizer.ts` *(new)* — the compression hook.
- `sanity.config.ts` — wires the hook into the studio.
- `package.json` — `browser-image-compression` (or equivalent).
- This file — record audit results and decision.

**Out of scope (Phase 2)**:
- Server-side Sharp pipeline (overkill for editor traffic at V2's scale).
- Sanity webhook → re-upload workflows (race conditions on asset refs).
- Changing document shape — asset refs stay opaque.

## Success criteria

**Phase 1**: audit table committed; close-or-proceed decision documented.

**Phase 2 (if triggered)**:
- Uploading a 12 MB phone photo to any `image` field in Studio lands the
  asset in Sanity at < 1 MB without manual editor action.
- All image fields work as before: `coverImage`, court `gallery`,
  homepage hero, `bodyImage`. Alt/caption/size/hotspot all preserved.
- Existing assets are untouched. No backfill.
- Editor sees a brief "Đang nén ảnh…" indicator during compression.
- A way to bypass compression for a single upload (escape hatch for cases
  where editors deliberately want the full-resolution original — rare).

## Related

- [CMS-DELIVERY-OPT](CMS-DELIVERY-OPT.md) — solves the delivery-side
  problem, which is independent and likely higher ROI for V2's scale.
  Sequence CMS-DELIVERY-OPT first.
- CMS-IBI shipped with an 800 KB upload warning. That warning stays in
  place regardless of whether this ticket ever moves past Phase 1.

## Status

- [x] Phase 1 audit script written and run. (Sanity MCP GROQ, 2026-06-18)
- [x] Audit table committed. (see Phase 1 results below)
- [x] Close-or-proceed decision recorded: **CLOSE Phase 1 — no pipeline now.**
- [ ] Phase 2 implemented (only if triggered).

---

## Phase 1 results — 2026-06-18

### Method

Read-only Sanity MCP GROQ queries against the `production` dataset. No
documents modified, no assets deleted. Auth verified via `whoami` before queries.

### Top-line stats

| Metric | Value |
|---|---|
| Total `sanity.imageAsset` documents | **6** |
| Total bytes across all assets | **6.0 MB** |
| Average asset size | 1.04 MB |
| Largest single asset | 2.15 MB |
| Assets > 800 KB | 3 |
| Assets > 2 MB | 1 |
| Assets > 5 MB | 0 |
| Assets wider than 2400 px | 0 |
| Assets wider than 4000 px | 0 |
| Assets with aspect ratio < 0.4 or > 3.0 | 0 |

### Asset-by-asset table (ordered by size desc)

| # | Filename | Size | W × H | AR | Used by | Status | Classification |
|---|---|---|---|---|---|---|---|
| 1 | `ao-v2-mau-so-1.png` | **2.15 MB** | 1448 × 1086 | 1.33 | content_article "Áo & quần kỷ niệm mẫu 01" (published) — body image | over 2 MB | **Manual replace candidate** — PNG of a marketing photo; would shrink ~80% as JPG q85. Sanity CDN `auto=format` already converts to WebP at delivery, so user-facing bytes are smaller than the stored 2.15 MB. |
| 2 | `ChatGPT Image 13_06_46 18 thg 6, 2026 (2).png` | 1.71 MB | 1086 × 1448 | 0.75 | content_article **draft** `007a51a9…` (untitled) — body image | over 800 KB | **Harmless for now** — sits in a draft; if the draft publishes, same JPG-vs-PNG manual replace applies. |
| 3 | `anh-mau-quan-ao-2026-mau01-cover.png` | 1.70 MB | 1086 × 1448 | 0.75 | content_article "Áo & quần kỷ niệm mẫu 01" (published) — cover image | over 800 KB | **Manual replace candidate** — same campaign as #1. |
| 4 | `ao-v2-2026.jpg` | 217 KB | 960 × 1280 | 0.75 | content_article "mẫu 02" — body image | under 800 KB | Harmless. |
| 5 | `anh-mau-quan-ao-2026-01.jpg` | 149 KB | 852 × 1280 | 0.67 | content_article "mẫu 02" — body image | under 800 KB | Harmless. |
| 6 | `quan-v2-2026.jpg` | 56 KB | 1120 × 960 | 1.17 | shared between "mẫu 01" + "mẫu 02" — body image | under 800 KB | Harmless. |

### Findings

- **No emergency assets.** Nothing over 5 MB, nothing over 4000 px wide, no
  aspect-ratio outliers. The corpus is healthy.
- **3 PNG marketing photos** (#1, #2, #3) account for **5.6 MB of the 6.0 MB
  total**. They are all from the same 2026 jersey campaign. They were uploaded
  as PNG when JPG would have been ~5× smaller for photographic content. This is
  a one-time editor habit, not a chronic process problem.
- **CMS-DELIVERY-OPT already mitigates** the user-facing impact: Sanity CDN
  `auto=format` transforms PNG → WebP at delivery time. The 2.15 MB stored PNG
  is shipped to users as a much smaller WebP. Stored bytes do not equal
  delivered bytes.
- **One asset (#2) sits in a draft.** Worth flagging to the editor at publish
  time; otherwise inert.
- **Asset #6** is shared by two articles (cross-referenced). Sanity's
  asset-reuse worked as designed.

### Decision: close Phase 1, do not build Phase 2

The audit threshold from this ticket's Phase 1 spec was: *"if the audit shows
fewer than ~10 oversize assets total, stop here and close the ticket."* We
have **3 oversize assets**, all from one campaign, all already mitigated by
delivery transforms, with no recurring upload pattern.

Building a Studio-side `browser-image-compression` hook costs ~half a day to
implement, plus a dependency and ongoing maintenance, to save **roughly 4 MB
of Sanity storage**. The return is too small.

### Ongoing policy (recommended)

1. **Keep CMS-IBI's existing 800 KB upload warning** in `contentShared.ts`.
   Editors see a yellow badge on upload; that's the first line of defence and
   it's already shipping.
2. **Rely on `auto=format` from CMS-DELIVERY-OPT** for delivered-byte
   reduction. No additional work needed.
3. **One-time manual cleanup (optional, low priority)**: re-export assets
   #1 and #3 as JPG q85 and re-upload, replacing the references on the two
   published "mẫu 01" articles. Roughly 10 minutes of editor work. Asset #2
   handled naturally when the draft publishes.
4. **Re-run this audit** when any of the following triggers fires:
   - Corpus grows past ~50 assets, OR
   - Any single asset exceeds 5 MB, OR
   - Total storage crosses 100 MB, OR
   - An editor reports slow Studio upload UX as a recurring complaint.

If a re-audit ever shows a sustained pattern (e.g., >20 oversize assets, >1
new oversize per week), re-open Phase 2 of this ticket and build the Studio
hook as originally scoped.

### Read-only confirmation

- Queries used only `query_documents` (read).
- No `create_documents`, `patch_documents`, `publish_documents`,
  `unpublish_documents`, or `discard_drafts` calls were made.
- No content modified. No assets deleted. No drafts touched.
