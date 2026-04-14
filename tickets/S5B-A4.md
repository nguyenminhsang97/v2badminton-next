# S5B-A4 · Summer page Phase 2 follow-through

**Muc tieu:** Sau khi Sanity `money_page` doc cho `/lop-he-cau-long-tphcm/` da duoc publish va verified tren production, them route vao `coreRoutes` array va `PREVIEW_READY_ROUTES` de URL xuat hien trong sitemap va homepage nav.

**Thoi gian uoc luong:** 15 phut

**Phu thuoc:** Sanity doc phai da publish va verified live tren production URL

**Rui ro:** Thap. Them 2 entries, follow pattern Sprint 3.

---

## Context cho junior

Sprint 4 ticket S4A-A4 da lam Phase 1:
- `CoreRoutePath` type da co `/lop-he-cau-long-tphcm/` (routes.ts)
- Page file da tao (`src/app/(site)/lop-he-cau-long-tphcm/page.tsx`)
- Fallback config da co (`moneyPageFallback.ts`)

Phase 2 bi giu lai cho den khi Sanity doc publish — de tranh URL xuat hien trong sitemap/nav ma chua co content (link 404).

**Truoc khi lam ticket nay:** Verify rang `/lop-he-cau-long-tphcm/` **da render** dung tren production (khong phai 404). Neu van 404 → chua publish Sanity doc → chua lam ticket nay.

---

## Files can sua

1. `src/lib/routes.ts` — them `coreRoutes` entry
2. `src/components/home/SeoLinksBlock.tsx` — them vao `PREVIEW_READY_ROUTES`

---

## Buoc 1 — Them vao coreRoutes array

Mo `src/lib/routes.ts`. Them entry sau `/cau-long-doanh-nghiep/` (khoang dong 113):

```ts
{
  path: "/lop-he-cau-long-tphcm/",
  pageType: "seo_service",
  title: "Lop He Cau Long Tai TP.HCM | V2 Badminton",
  description:
    "Lop cau long he cho tre em va nguoi moi bat dau tai TP.HCM. Lich linh hoat, lop nho, san tai Binh Thanh va Thu Duc.",
  ogImage: siteConfig.defaultOgImagePath,
  navLabel: "Lop he",
  summary:
    "Landing page evergreen cho chien dich he hang nam. Noi dung cap nhat qua Sanity moi mua.",
},
```

---

## Buoc 2 — Them vao PREVIEW_READY_ROUTES

Mo `src/components/home/SeoLinksBlock.tsx`. Them vao `PREVIEW_READY_ROUTES` array:

```ts
const PREVIEW_READY_ROUTES: readonly CoreRoutePath[] = [
  "/hoc-cau-long-cho-nguoi-moi/",
  "/lop-cau-long-binh-thanh/",
  "/lop-cau-long-thu-duc/",
  "/lop-cau-long-tre-em/",
  "/lop-cau-long-cho-nguoi-di-lam/",
  "/cau-long-doanh-nghiep/",
  "/lop-he-cau-long-tphcm/",     // ← them
] as const;
```

---

## Buoc 3 — Update generateMetadata

Mo `src/app/(site)/lop-he-cau-long-tphcm/page.tsx`. Gio route da co trong `coreRoutes`, co the dung `buildMetadata(PATH)` cho degraded case:

```ts
// TRUOC (Phase 1 workaround):
if (degraded) {
  return buildMoneyPageMetadata(PATH, buildPublishedMoneyPageFallback(PATH));
}

// SAU (Phase 2, nhat quan voi cac money pages khac):
if (degraded) {
  return buildMetadata(PATH);
}
```

---

## Cach verify

1. `npm run build` — pass
2. Kiem tra `sitemap.xml` → co `/lop-he-cau-long-tphcm/`
3. Homepage → SeoLinksBlock → co card "Lop he"
4. Click card → trang render MoneyPageTemplate (khong phai 404)
5. Nav menu → co "Lop he" trong danh sach links
