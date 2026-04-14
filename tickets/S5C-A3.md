# S5C-A3 · Money pages batch (5 pages)

**Muc tieu:** Tao 5 money pages con lai tu `site.ts` plan. Tat ca follow pattern da established tu Sprint 3-4. Batch thanh 1 ticket vi cung pattern.

**Thoi gian uoc luong:** 2 gio

**Phu thuoc:** S5A-A1 (CSS on), S5A-A4 (Image + heroImage)

**Rui ro:** Thap. Copy pattern, thay slug/audience/content.

---

## Context cho junior

5 pages nay follow chinh xac pattern cua `/lop-cau-long-tre-em/`:
1. Them vao `CoreRoutePath` type (routes.ts)
2. Them fallback config (moneyPageFallback.ts)
3. Tao page file (copy template)

**Phase 1 vs Phase 2 van ap dung:** Them `CoreRoutePath` type + fallback + page file ngay. Chi them vao `coreRoutes` array va `PREVIEW_READY_ROUTES` khi Sanity doc da publish.

---

## 5 Pages can tao

| # | Path | navLabel | Audience | Keyword target |
|---|------|----------|----------|---------------|
| 1 | `/hoc-cau-long-1-kem-1/` | Kem rieng 1:1 | private | private coaching |
| 2 | `/lop-cau-long-cuoi-tuan/` | Cuoi tuan | nguoi_di_lam | weekend classes |
| 3 | `/lop-cau-long-buoi-toi/` | Buoi toi | nguoi_di_lam | evening classes |
| 4 | `/gia-hoc-cau-long-tphcm/` | Bang gia | nguoi_moi | pricing comparison |
| 5 | `/team-building-cau-long/` | Team building | doanh_nghiep | corporate events |

---

## File can sua

1. `src/lib/routes.ts` — them 5 paths vao `CoreRoutePath`
2. `src/lib/moneyPageFallback.ts` — them 5 fallback entries
3. 5x `src/app/(site)/[slug]/page.tsx` — tao page files

---

## Buoc 1 — Them vao CoreRoutePath

Mo `src/lib/routes.ts`. Them 5 paths vao union type:

```ts
export type CoreRoutePath =
  | "/"
  | "/hoc-cau-long-cho-nguoi-moi/"
  | "/lop-cau-long-binh-thanh/"
  | "/lop-cau-long-thu-duc/"
  | "/lop-cau-long-tre-em/"
  | "/lop-cau-long-cho-nguoi-di-lam/"
  | "/cau-long-doanh-nghiep/"
  | "/lop-he-cau-long-tphcm/"
  | "/hoc-cau-long-1-kem-1/"          // ← them
  | "/lop-cau-long-cuoi-tuan/"        // ← them
  | "/lop-cau-long-buoi-toi/"         // ← them
  | "/gia-hoc-cau-long-tphcm/"        // ← them
  | "/team-building-cau-long/";       // ← them
```

**Khong them vao `coreRoutes` array** — do la Phase 2 khi Sanity docs da publish.

---

## Buoc 2 — Them fallback configs

Mo `src/lib/moneyPageFallback.ts`. Them 5 entries vao `PublishedMoneyPagePath` va `MONEY_PAGE_FALLBACKS`.

### 2a. PublishedMoneyPagePath

```ts
export type PublishedMoneyPagePath = Extract<
  CoreRoutePath,
  | "/lop-cau-long-tre-em/"
  | "/lop-cau-long-cho-nguoi-di-lam/"
  | "/cau-long-doanh-nghiep/"
  | "/lop-he-cau-long-tphcm/"
  | "/hoc-cau-long-1-kem-1/"          // ← them
  | "/lop-cau-long-cuoi-tuan/"        // ← them
  | "/lop-cau-long-buoi-toi/"         // ← them
  | "/gia-hoc-cau-long-tphcm/"        // ← them
  | "/team-building-cau-long/"        // ← them
>;
```

### 2b. MONEY_PAGE_FALLBACKS entries

```ts
"/hoc-cau-long-1-kem-1/": {
  slug: "hoc-cau-long-1-kem-1",
  audience: "private",
  h1: "Hoc cau long 1 kem 1 tai TP.HCM",
  intro:
    "Chuong trinh kem rieng 1:1 giup hoc vien tien bo nhanh nhat voi lo trinh ca nhan hoa hoan toan.",
  body:
    "HLV V2 Badminton theo sat tung dong tac, dieu chinh ky thuat theo the trang va muc tieu cua tung hoc vien. Noi dung chi tiet dang duoc cap nhat.",
  ctaLabel: "Dang ky kem rieng",
},

"/lop-cau-long-cuoi-tuan/": {
  slug: "lop-cau-long-cuoi-tuan",
  audience: "nguoi_di_lam",
  h1: "Lop cau long cuoi tuan tai TP.HCM",
  intro:
    "Lop thu 7 va chu nhat cho nguoi ban ngay thuong. Tap luyen deu dan khong can nghi phep.",
  body:
    "V2 Badminton mo lop cuoi tuan tai cac san Binh Thanh va Thu Duc, phu hop cho nguoi di lam va sinh vien. Noi dung chi tiet dang duoc cap nhat.",
  ctaLabel: "Xem lich cuoi tuan",
},

"/lop-cau-long-buoi-toi/": {
  slug: "lop-cau-long-buoi-toi",
  audience: "nguoi_di_lam",
  h1: "Lop cau long buoi toi tai TP.HCM",
  intro:
    "Lop toi tu 18h-21h cho nguoi di lam. Tan dung thoi gian sau gio lam de ren suc khoe.",
  body:
    "Lich toi linh hoat tai nhieu san, phu hop cho nguoi ban ngay. Noi dung chi tiet dang duoc cap nhat.",
  ctaLabel: "Xem lich buoi toi",
},

"/gia-hoc-cau-long-tphcm/": {
  slug: "gia-hoc-cau-long-tphcm",
  audience: "nguoi_moi",
  h1: "Gia hoc cau long tai TP.HCM 2026",
  intro:
    "Bang gia cac khoa hoc cau long tai V2 Badminton — tu lop nhom, kem rieng den chuong trinh doanh nghiep.",
  body:
    "So sanh gia giua cac goi hoc de chon phuong an phu hop nhat. Noi dung chi tiet dang duoc cap nhat.",
  ctaLabel: "Xem bang gia",
},

"/team-building-cau-long/": {
  slug: "team-building-cau-long",
  audience: "doanh_nghiep",
  h1: "Team building cau long cho doanh nghiep",
  intro:
    "To chuc hoat dong team building bang cau long — gan ket doi ngu, ren suc khoe, tao dong luc.",
  body:
    "V2 Badminton thiet ke chuong trinh rieng theo muc tieu va ngan sach cua tung doanh nghiep. Noi dung chi tiet dang duoc cap nhat.",
  ctaLabel: "Nhan bao gia team building",
},
```

---

## Buoc 3 — Tao 5 page files

Moi page copy template tu `lop-cau-long-tre-em/page.tsx` va doi:
- `PATH` constant
- `SLUG` constant
- Structured data IDs (breadcrumb, faq, business)
- Component function name

**Template chung:**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoneyPageStructuredData } from "@/components/money-page/MoneyPageStructuredData";
import { MoneyPageTemplate } from "@/components/money-page/MoneyPageTemplate";
import { buildMoneyPageMetadata } from "@/lib/moneyPageMetadata";
import { buildPublishedMoneyPageFallback } from "@/lib/moneyPageFallback";
import { getMoneyPage } from "@/lib/sanity";

const PATH = "/hoc-cau-long-1-kem-1/";       // ← doi cho moi page
const SLUG = "hoc-cau-long-1-kem-1";          // ← doi cho moi page

export async function generateMetadata(): Promise<Metadata> {
  const { page: moneyPage, degraded } = await getMoneyPage(SLUG);

  if (moneyPage) {
    return buildMoneyPageMetadata(PATH, moneyPage);
  }

  if (degraded) {
    return buildMoneyPageMetadata(PATH, buildPublishedMoneyPageFallback(PATH));
  }

  return {};
}

export default async function PrivateCoachingPage() {  // ← doi ten function
  const { page: moneyPage, degraded } = await getMoneyPage(SLUG);

  if (!moneyPage && !degraded) {
    notFound();
  }

  const resolvedPage = moneyPage ?? buildPublishedMoneyPageFallback(PATH);

  return (
    <>
      <MoneyPageStructuredData
        path={PATH}
        breadcrumbId="kem-rieng-breadcrumb"     // ← doi ID
        breadcrumbLabel="Kem rieng 1:1"          // ← doi label
        faqId="kem-rieng-faq"
        businessId="kem-rieng-business"
        faqs={resolvedPage.relatedFaqs}
        locations={resolvedPage.relatedLocations}
        pricingTiers={resolvedPage.relatedPricing}
      />
      <MoneyPageTemplate page={resolvedPage} />
    </>
  );
}
```

**Folders can tao:**
- `src/app/(site)/hoc-cau-long-1-kem-1/page.tsx`
- `src/app/(site)/lop-cau-long-cuoi-tuan/page.tsx`
- `src/app/(site)/lop-cau-long-buoi-toi/page.tsx`
- `src/app/(site)/gia-hoc-cau-long-tphcm/page.tsx`
- `src/app/(site)/team-building-cau-long/page.tsx`

---

## Cach verify

1. `npm run lint` — pass
2. `npm run build` — pass
3. Truy cap moi URL → 404 (dung, Sanity doc chua publish)
4. Test degraded mode (tat SANITY_API_READ_TOKEN tam) → fallback content hien, khong crash
5. Sau khi Sanity docs publish → lam Phase 2:
   - Them vao `coreRoutes` array
   - Them vao `PREVIEW_READY_ROUTES`
   - Verify sitemap + nav + page render
