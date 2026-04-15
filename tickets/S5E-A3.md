# S5E-A3 - Money pages batch (5 pages)

**Muc tieu:** Tao 5 money pages moi theo pattern Sprint 3-4 nhung ap design system moi cua Sprint 5.

**Thoi gian uoc luong:** 1.5 gio

**Phu thuoc:** Sau Track A/B/C va `S5D-A5`

**Rui ro:** Trung binh. Can giu dung Phase 1 / Phase 2 gating.

## Scope

Targets:

- `/hoc-cau-long-1-kem-1/`
- `/lop-cau-long-cuoi-tuan/`
- `/lop-cau-long-buoi-toi/`
- `/gia-hoc-cau-long-tphcm/`
- `/team-building-cau-long/`

## Files chinh

- route files cho 5 pages
- `src/lib/moneyPageFallback.ts`
- `src/lib/routes.ts` type-only Phase 1 updates khi can

## Acceptance criteria

1. Ca 5 pages ton tai o Phase 1
2. Gating logic giong Sprint 3-4, khong publish vao sitemap / nav qua som
3. Presentation dung design system moi
4. `lint` / `build` pass

## Implementation notes

### Phase 1 vs Phase 2 rules cho tung slug

| Slug | Phase 1 (ticket nay) | Phase 2 (sau khi co Sanity doc) |
|------|---------------------|-------------------------------|
| `/hoc-cau-long-1-kem-1/` | Route + fallback content, KHONG sitemap/nav | Add to sitemap, PREVIEW_READY_ROUTES, nav |
| `/lop-cau-long-cuoi-tuan/` | Route + fallback content, KHONG sitemap/nav | Add to sitemap, PREVIEW_READY_ROUTES, nav |
| `/lop-cau-long-buoi-toi/` | Route + fallback content, KHONG sitemap/nav | Add to sitemap, PREVIEW_READY_ROUTES, nav |
| `/gia-hoc-cau-long-tphcm/` | Route + fallback content, KHONG sitemap/nav | Add to sitemap, PREVIEW_READY_ROUTES, nav |
| `/team-building-cau-long/` | Route + fallback content, KHONG sitemap/nav | Add to sitemap, PREVIEW_READY_ROUTES, nav |

### Phase 1 checklist (cho moi page)

1. Them route vao `coreRouteMap` trong `src/lib/routes.ts` (type + metadata)
2. Them fallback content vao `src/lib/moneyPageFallback.ts`
3. Route file dung `MoneyPageTemplate` voi design system moi
4. **KHONG** add vao `PREVIEW_READY_ROUTES` trong `SeoLinksBlock.tsx`
5. **KHONG** add vao `sitemap.ts`
6. **KHONG** add vao Nav links

### Phase 2 trigger

- Khi Sanity document cho slug do duoc tao va published
- Luc do moi add vao sitemap, nav, va SeoLinksBlock
