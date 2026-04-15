# S5C-A5 - SeoLinksBlock redesign

**Muc tieu:** Redesign `SeoLinksBlock` theo he Figma-first, giu role la internal-linking / SEO support block nhung dua no vao cung visual system moi.

**Thoi gian uoc luong:** 0.5 gio

**Phu thuoc:** `S5A-A1`

**Rui ro:** Thap-den-trung-binh. Block nay phu thuoc `coreRoutes` + `PREVIEW_READY_ROUTES`, nen redesign phai giu dung role SEO/discovery.

## Files chinh

- `src/components/home/SeoLinksBlock.tsx`
- `src/app/globals.css`

## Scope

1. Redesign card/list treatment cua `SeoLinksBlock`
2. Giu internal-linking logic dua tren published preview-ready routes
3. Block nay phai ro la support section, khong tranh main CTA
4. Block nay dat o cuoi homepage order

## Acceptance criteria

1. `SeoLinksBlock` khong con giu style cu
2. Internal links van dung theo route gating hien tai
3. Block dong bo voi homepage moi nhung van ro la support/discovery layer

## Implementation notes

### PREVIEW_READY_ROUTES hien tai (6 pages)

```
/hoc-cau-long-cho-nguoi-moi/
/lop-cau-long-binh-thanh/
/lop-cau-long-thu-duc/
/lop-cau-long-tre-em/
/lop-cau-long-cho-nguoi-di-lam/
/cau-long-doanh-nghiep/
```

### Data source

- Filter `coreRoutes` chi lay routes co `path` nam trong `PREVIEW_READY_ROUTES`
- Moi route dung: `route.path` (href), `route.navLabel` (display text), `route.description` (card subtitle)
- Early return `null` neu khong co route nao match — section tu an

### Redesign direction

- Hien tai: grid of link cards voi style cu
- Moi: card/pill treatment theo design system (white card + shadow hoac compact link list)
- Giu role la **support/discovery section**, khong tranh visual weight voi main CTAs
- Vi tri: cuoi homepage, truoc bottom-funnel cluster (FAQ → Contact → Business)
