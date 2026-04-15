# S5D-A5 - Breadcrumbs + page-kicker on money pages

**Muc tieu:** Them visual breadcrumb va page-kicker cho money pages de khop design system moi.

**Thoi gian uoc luong:** 0.5 gio

**Phu thuoc:** Tot nhat sau `S5A-A1`

**Rui ro:** Thap-den-trung-binh. Can tranh lam vo Phase 1 unpublished pages.

## Files chinh

- `src/components/money-page/MoneyPageTemplate.tsx`
- breadcrumb component neu can
- `src/app/globals.css`

## Scope

1. Breadcrumb visual treatment
2. Page-kicker pattern
3. Published paths va unpublished Phase 1 paths deu duoc handle dung

## Acceptance criteria

1. Money pages co breadcrumb frame ro rang
2. Kicker system khop Figma
3. Khong introduce route/type mismatch voi unpublished pages

## Implementation notes

### Pages co breadcrumb

| Page | Breadcrumb | Phase |
|------|-----------|-------|
| `/hoc-cau-long-cho-nguoi-moi/` | Trang chủ → Người mới | Published |
| `/lop-cau-long-binh-thanh/` | Trang chủ → Bình Thạnh | Published |
| `/lop-cau-long-thu-duc/` | Trang chủ → Thủ Đức | Published |
| `/lop-cau-long-tre-em/` | Trang chủ → Trẻ em | Published |
| `/lop-cau-long-cho-nguoi-di-lam/` | Trang chủ → Người đi làm | Published |
| `/cau-long-doanh-nghiep/` | Trang chủ → Doanh nghiệp | Published |
| `/hoc-cau-long-1-kem-1/` | Trang chủ → 1 kèm 1 | Phase 1 (unpublished) |
| `/lop-cau-long-cuoi-tuan/` | Trang chủ → Cuối tuần | Phase 1 (unpublished) |
| `/lop-cau-long-buoi-toi/` | Trang chủ → Buổi tối | Phase 1 (unpublished) |
| `/gia-hoc-cau-long-tphcm/` | Trang chủ → Giá học | Phase 1 (unpublished) |
| `/team-building-cau-long/` | Trang chủ → Team building | Phase 1 (unpublished) |

- Homepage (`/`) khong co breadcrumb
- Blog pages: handle rieng trong S5E-A2

### Unpublished Phase 1 pages

- Phase 1 pages co route + fallback content nhung **chua co trong sitemap/nav**
- Breadcrumb van render binh thuong tren page (user co the truy cap truc tiep bang URL)
- Breadcrumb "Trang chu" link ve `/` — luon an toan
- Label lay tu `route.navLabel` trong `coreRouteMap`

### Page-kicker pattern

- Kicker = short label phia tren page title (vd: "Khoa hoc", "Dia diem", "Doanh nghiep")
- Render trong `MoneyPageTemplate` ngay tren `<h1>`
- Style: uppercase, small, `--color-orange-primary`, letter-spacing
