# S4A-A4 · Summer landing page `/lop-he-cau-long-tphcm/`

**Mục tiêu:** Tạo route evergreen cho chiến dịch hè. URL không đổi mỗi năm, content cập nhật qua Sanity.

**Thời gian ước lượng:** 1 giờ

**Phụ thuộc:** S4A-A2 (cần `getMoneyPage` query hoạt động)

**Rủi ro:** Thấp. Copy pattern từ 3 new money pages Sprint 3 (`lop-cau-long-tre-em`). Chỉ thêm route mới, không sửa code hiện tại.

---

## Context cho junior

Đây là money page thứ 7. Nó giống hệt pattern của `/lop-cau-long-tre-em/` — dùng `getMoneyPage()`, fallback nếu Sanity chưa có data, dùng `MoneyPageTemplate`.

Khác biệt duy nhất: đây là campaign page, nhưng về mặt code nó vẫn là 1 money page bình thường. Sanity `money_page` doc sẽ có `audience = "tre_em"` hoặc tùy target mà business owner chọn.

**Tại sao dùng money_page chứ không phải campaign type?** Vì campaign type dùng cho hero override, không phải page content. Landing page cần full content (H1, intro, body, pricing, FAQ...) → đúng cấu trúc money_page.

---

## Files cần sửa (Phase 1 — route tạo trước)

1. `src/lib/moneyPageFallback.ts` — thêm fallback config
2. `src/app/(site)/lop-he-cau-long-tphcm/page.tsx` — tạo mới

Phase 2 (chỉ làm SAU KHI Sanity doc đã publish và verified):
3. `src/lib/routes.ts` — thêm route vào sitemap/nav
4. `src/components/home/SeoLinksBlock.tsx` — thêm route vào SEO links block

**Tại sao chia 2 phase?** Sprint 3 đã thiết lập quy tắc này: route file có thể tồn tại với `notFound()` gate (404 khi doc chưa publish), nhưng chỉ add vào `coreRoutes` và `PREVIEW_READY_ROUTES` sau khi content đã verified trên production. Nếu add sớm: URL xuất hiện trong sitemap và nav card dẫn link 404.

---

## Bước 1 — Thêm fallback config

Mở `src/lib/moneyPageFallback.ts`.

### 1a. Thêm path vào `PublishedMoneyPagePath`

```ts
export type PublishedMoneyPagePath = Extract<
  CoreRoutePath,
  | "/lop-cau-long-tre-em/"
  | "/lop-cau-long-cho-nguoi-di-lam/"
  | "/cau-long-doanh-nghiep/"
  | "/lop-he-cau-long-tphcm/"          // ← thêm
>;
```

### 1b. Thêm fallback entry vào `MONEY_PAGE_FALLBACKS`

```ts
"/lop-he-cau-long-tphcm/": {
  slug: "lop-he-cau-long-tphcm",
  audience: "tre_em",
  h1: "Lớp cầu lông hè tại TP.HCM",
  intro:
    "V2 Badminton đang chuẩn bị nội dung chi tiết cho chương trình hè. Phụ huynh và học viên có thể để lại thông tin để nhận thông báo khi lớp hè mở đăng ký.",
  body:
    "Chương trình hè được thiết kế cho trẻ em và người mới bắt đầu, với lịch học linh hoạt và lớp nhỏ tại các sân ở Bình Thạnh và Thủ Đức. Nội dung chi tiết đang được cập nhật và sẽ hiển thị đầy đủ trong thời gian sớm nhất.",
  ctaLabel: "Nhận thông báo lớp hè",
},
```

**Tại sao `audience: "tre_em"`?** Vì lớp hè chủ yếu nhắm trẻ em (audience ưu tiên #1 theo blueprint). Khi business owner tạo Sanity doc, có thể chọn audience khác nếu muốn.

---

## Bước 2 — Tạo page file

Tạo folder + file: `src/app/(site)/lop-he-cau-long-tphcm/page.tsx`

Copy pattern từ `lop-cau-long-tre-em/page.tsx` và đổi:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoneyPageStructuredData } from "@/components/money-page/MoneyPageStructuredData";
import { MoneyPageTemplate } from "@/components/money-page/MoneyPageTemplate";
import { buildMoneyPageMetadata } from "@/lib/moneyPageMetadata";
import { buildPublishedMoneyPageFallback } from "@/lib/moneyPageFallback";
import { buildMetadata } from "@/lib/routes";
import { getMoneyPage } from "@/lib/sanity";

const PATH = "/lop-he-cau-long-tphcm/";
const SLUG = "lop-he-cau-long-tphcm";

export async function generateMetadata(): Promise<Metadata> {
  const { page: moneyPage, degraded } = await getMoneyPage(SLUG);

  if (moneyPage) {
    return buildMoneyPageMetadata(PATH, moneyPage);
  }

  if (degraded) {
    return buildMetadata(PATH);
  }

  return {};
}

export default async function SummerCampaignPage() {
  const { page: moneyPage, degraded } = await getMoneyPage(SLUG);

  if (!moneyPage && !degraded) {
    notFound();
  }

  const resolvedPage = moneyPage ?? buildPublishedMoneyPageFallback(PATH);

  return (
    <>
      <MoneyPageStructuredData
        path={PATH}
        breadcrumbId="lop-he-breadcrumb"
        breadcrumbLabel="Lớp cầu lông hè"
        faqId="lop-he-faq"
        businessId="lop-he-business"
        faqs={resolvedPage.relatedFaqs}
        locations={resolvedPage.relatedLocations}
        pricingTiers={resolvedPage.relatedPricing}
      />
      <MoneyPageTemplate page={resolvedPage} />
    </>
  );
}
```

**Giải thích flow:**
1. `getMoneyPage("lop-he-cau-long-tphcm")` → fetch từ Sanity
2. Nếu có data → render MoneyPageTemplate
3. Nếu Sanity lỗi (`degraded = true`) → render fallback from `buildPublishedMoneyPageFallback`
4. Nếu doc chưa tồn tại (`page = null, degraded = false`) → `notFound()` (404)

---

## Bước 3 — Tạo Sanity document

Mở Sanity Studio → Money Pages → New:

- Slug: `lop-he-cau-long-tphcm`
- Đối tượng: `Trẻ em` (hoặc tùy chọn)
- H1: `Lớp cầu lông hè 2026 tại TP.HCM`
- Nội dung: draft ban đầu, refine sau

**Trước khi publish:** Kiểm tra preview trong Studio — content đúng chưa?

Sau khi publish: truy cập production URL `/lop-he-cau-long-tphcm/` → phải render MoneyPageTemplate (không còn 404). Nếu vẫn 404 → chờ ISR cache refresh (tối đa 300 giây) hoặc trigger revalidate.

---

## Bước 4 — Activate route (chỉ sau khi Sanity doc đã publish và verified)

**Không làm bước này trước khi trang thực sự live.** Thêm sớm → URL xuất hiện trong sitemap và nav dẫn link 404.

### 4a. Thêm vào `routes.ts`

Mở `src/lib/routes.ts`.

Thêm path vào `CoreRoutePath`:

```ts
export type CoreRoutePath =
  | "/"
  | "/hoc-cau-long-cho-nguoi-moi/"
  | "/lop-cau-long-binh-thanh/"
  | "/lop-cau-long-thu-duc/"
  | "/lop-cau-long-tre-em/"
  | "/lop-cau-long-cho-nguoi-di-lam/"
  | "/cau-long-doanh-nghiep/"
  | "/lop-he-cau-long-tphcm/";       // ← thêm
```

Thêm entry vào `coreRoutes` array sau `/cau-long-doanh-nghiep/`:

```ts
{
  path: "/lop-he-cau-long-tphcm/",
  pageType: "seo_service",
  title: "Lớp Hè Cầu Lông Tại TP.HCM | V2 Badminton",
  description:
    "Lớp cầu lông hè cho trẻ em và người mới bắt đầu tại TP.HCM. Lịch linh hoạt, lớp nhỏ, sân tại Bình Thạnh và Thủ Đức.",
  ogImage: siteConfig.defaultOgImagePath,
  navLabel: "Lớp hè",
  summary:
    "Landing page evergreen cho chiến dịch hè hằng năm. Nội dung cập nhật qua Sanity mỗi mùa.",
},
```

**Lưu ý:** `CoreRoutePath` type và `coreRoutes` array phải được thêm **cùng lúc** (atomic commit). Đây là quy ước đã thống nhất từ Sprint 3.

### 4b. Thêm vào SeoLinksBlock

Mở `src/components/home/SeoLinksBlock.tsx`. Thêm route mới vào `PREVIEW_READY_ROUTES`:

```ts
const PREVIEW_READY_ROUTES: readonly CoreRoutePath[] = [
  "/hoc-cau-long-cho-nguoi-moi/",
  "/lop-cau-long-binh-thanh/",
  "/lop-cau-long-thu-duc/",
  "/lop-cau-long-tre-em/",
  "/lop-cau-long-cho-nguoi-di-lam/",
  "/cau-long-doanh-nghiep/",
  "/lop-he-cau-long-tphcm/",     // ← thêm
] as const;
```

---

## Cách verify

### Phase 1 (sau Bước 1–2)

1. `npm run lint` — pass
2. `npm run build` — pass
3. Truy cập `/lop-he-cau-long-tphcm/` → 404 (đúng, doc chưa publish)
4. Sanity degraded (test bằng cách tắt SANITY_API_READ_TOKEN tạm) → fallback content render, không 404

### Phase 2 (sau Bước 3–4)

5. Kiểm tra `sitemap.xml` → có `/lop-he-cau-long-tphcm/`
6. Homepage → SeoLinksBlock → có card "Lớp hè"
7. Truy cập `/lop-he-cau-long-tphcm/` → render MoneyPageTemplate với Sanity content
