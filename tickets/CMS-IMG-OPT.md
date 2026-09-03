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

- [ ] Phase 1 audit script written and run.
- [ ] Audit table committed.
- [ ] Close-or-proceed decision recorded.
- [ ] Phase 2 implemented (only if triggered).
