# S4A-A2 · `getActiveCampaign()` query + type

**Mục tiêu:** Thêm Sanity query lấy campaign đang active (nếu có). Trả về `null` khi không có campaign nào đang chạy → homepage render bình thường.

**Thời gian ước lượng:** 30 phút

**Rủi ro:** Thấp. Thêm query mới, không sửa code hiện tại. Nếu query trả null thì hero giữ nguyên.

---

## Context cho junior

Campaign schema đã có `status`, `startDate`, `endDate`. Nhưng chưa có query nào fetch campaign từ Sanity, và chưa có TypeScript type cho kết quả trả về. Ticket này tạo cả hai.

Pattern cần follow: xem cách `getMoneyPage()` được viết trong `src/lib/sanity/queries.ts` dòng 618–632. Nó dùng `cache()` + `sanityFetchOrFallback()`. Campaign query cũng làm y vậy.

---

## File cần sửa

`src/lib/sanity/queries.ts`

---

## Bước 1 — Thêm `SanityActiveCampaign` type

Đặt ngay dưới block `SanityMoneyPageLoadResult` (khoảng dòng 182):

```ts
export type SanityActiveCampaign = {
  id: string;
  slug: string;
  name: string;
  status: "active";
  startDate: string;
  endDate: string;
  badgeText: string | null;
  heroTitle: string | null;
  heroDescription: string | null;
  primaryCtaLabel: string | null;
  primaryCtaUrl: string | null;
  secondaryCtaLabel: string | null;
  secondaryCtaUrl: string | null;
  featuredAudience: SanityAudience | null;
  linkedPageSlug: string | null;
};
```

**Tại sao `linkedPageSlug` thay vì cả object?** Vì hero chỉ cần URL để tạo link CTA. Không cần dereference toàn bộ money_page.

---

## Bước 2 — Thêm GROQ query

Đặt sau `MONEY_PAGE_QUERY` (khoảng dòng 529):

```ts
const ACTIVE_CAMPAIGN_QUERY = defineQuery(`
  *[
    _type == "campaign" &&
    status == "active" &&
    startDate <= $today &&
    endDate >= $today &&
    ${PUBLISHED_ONLY_FILTER}
  ]
  | order(startDate desc)[0]{
    "id": _id,
    "slug": slug.current,
    name,
    status,
    startDate,
    endDate,
    "badgeText": coalesce(badgeText, null),
    "heroTitle": coalesce(heroTitle, null),
    "heroDescription": coalesce(heroDescription, null),
    "primaryCtaLabel": coalesce(primaryCtaLabel, null),
    "primaryCtaUrl": coalesce(primaryCtaUrl, null),
    "secondaryCtaLabel": coalesce(secondaryCtaLabel, null),
    "secondaryCtaUrl": coalesce(secondaryCtaUrl, null),
    "featuredAudience": coalesce(featuredAudience, null),
    "linkedPageSlug": linkedPage->slug.current
  }
`);
```

**Giải thích GROQ:**
- `startDate <= $today && endDate >= $today` — chỉ lấy campaign trong khoảng thời gian
- `| order(startDate desc)[0]` — nếu có nhiều campaign active, lấy cái bắt đầu gần nhất
- `linkedPage->slug.current` — dereference reference lấy slug thôi, không lấy hết

---

## Bước 3 — Thêm fetch function

Đặt sau `getMoneyPage` (khoảng dòng 632):

```ts
export const getActiveCampaign = cache(
  async (): Promise<SanityActiveCampaign | null> => {
    // Vietnam is UTC+7 with no daylight saving.
    // new Date().toISOString() returns UTC — can be 1 day behind local time
    // between midnight and 01:00 ICT. Use explicit offset to get the correct date.
    const now = new Date();
    const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const today = vnTime.toISOString().split("T")[0]; // e.g. "2026-06-15"

    return sanityFetchOrFallback<SanityActiveCampaign>({
      query: ACTIVE_CAMPAIGN_QUERY,
      params: { today },
      fallback: null,
      tags: ["sanity:campaign"],
    });
  },
);
```

**Tại sao dùng `sanityFetchOrFallback` thay vì `sanityFetchWithStatus`?**
Vì campaign không có fallback nào cần show. Nếu Sanity lỗi → return null → hero render bình thường. Không cần degraded mode.

**Tại sao tính Vietnam timezone thủ công?**
Vietnam là UTC+7, không có daylight saving. `new Date().toISOString()` trả UTC — có thể lệch 1 ngày so với giờ Việt Nam trong khoảng 00:00–01:00 ICT. Nếu không xử lý: campaign bắt đầu ngày 1/6 có thể không active cho đến 01:00 sáng ngày 1/6 ICT. Cộng thêm 7 giờ (= 25200 giây × 1000ms) trước khi split.

---

## Bước 4 — Export từ index

Mở `src/lib/sanity/index.ts`. File này đang re-export everything từ queries:

```ts
export * from "./queries";
```

Vì dùng wildcard export, `getActiveCampaign` và `SanityActiveCampaign` sẽ tự động được export. Không cần sửa file này.

---

## Cách verify

1. `npm run lint` — pass
2. `npm run build` — pass
3. Test nhanh trong `page.tsx` (chưa wire vào hero, chỉ log):
   - Thêm `getActiveCampaign` vào import
   - Thêm vào `Promise.all`
   - `console.log("campaign:", campaign)` trong component body
   - Dev server → terminal hiện `campaign: null` (vì chưa có doc active)
   - Xóa test log trước khi commit

---

## Lưu ý

- **Không sửa** homepage `page.tsx` hay `HeroSection.tsx` ở ticket này. Đó là S4A-A3.
- Query dùng `$today` param chứ không hardcode date, nên ISR cache vẫn hoạt động đúng theo `SANITY_REVALIDATE_SECONDS` (300s).
