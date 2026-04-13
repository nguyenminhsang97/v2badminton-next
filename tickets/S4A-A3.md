# S4A-A3 · Homepage campaign integration

**Mục tiêu:** Khi có campaign active trong Sanity, homepage hero tự động swap title, description, CTA và hiển thị badge. Khi không có campaign → hero render y chang hiện tại, không break gì.

**Thời gian ước lượng:** 1–2 giờ

**Phụ thuộc:** S4A-A2 (cần `getActiveCampaign` query và `SanityActiveCampaign` type)

**Rủi ro:** Trung bình. Sửa `HeroSection.tsx` — component hiện tại là client component (`"use client"`). Cần chuyển campaign data từ server vào qua props. Phải test kỹ trường hợp `campaign = null` để đảm bảo hero không bị break.

---

## Context cho junior

`HeroSection` hiện hardcode mọi thứ: title, subheading, CTA label/URL. Không nhận props.

Sau ticket này:
- `page.tsx` (server) fetch campaign → pass vào `HeroSection` qua props
- `HeroSection` nhận optional `campaign` prop
- Có campaign → render campaign content
- Không có campaign → render default content (y chang hiện tại)

**Nguyên tắc quan trọng:** Default hero content giữ nguyên dưới dạng constants trong file. Campaign chỉ _override_, không _replace_.

---

## Files cần sửa

1. `src/components/home/sectionProps.ts` — thêm props type
2. `src/components/home/HeroSection.tsx` — nhận props, conditional render
3. `src/app/(site)/page.tsx` — fetch campaign, truyền props
4. `src/app/globals.css` — thêm style cho campaign badge

---

## Bước 1 — Thêm props type

Mở `src/components/home/sectionProps.ts`. Thêm:

```ts
import type { SanityActiveCampaign } from "@/lib/sanity";

// ... existing props types ...

export type HomepageHeroSectionProps = {
  campaign: SanityActiveCampaign | null;
};
```

---

## Bước 2 — Sửa HeroSection

Mở `src/components/home/HeroSection.tsx`.

### 2a. Thêm import + nhận props

```ts
import type { HomepageHeroSectionProps } from "./sectionProps";

// Giữ nguyên constants DEFAULT:
const DEFAULT_HERO_EYEBROW = "Bình Thạnh & Thủ Đức — TP.HCM";

const DEFAULT_HERO_SUBHEADING =
  "V2 Badminton có lớp cho người mới bắt đầu, ...";
  
// ... TRUST_STATS giữ nguyên ...

export function HeroSection({ campaign }: HomepageHeroSectionProps) {
```

**Lưu ý:** Rename constants từ `HERO_EYEBROW` → `DEFAULT_HERO_EYEBROW`, `HERO_SUBHEADING` → `DEFAULT_HERO_SUBHEADING` để tránh nhầm với campaign override.

### 2b. Derive values từ campaign (hoặc default)

Ngay đầu function body, trước `return`:

```ts
const heroSubheading = campaign?.heroDescription ?? DEFAULT_HERO_SUBHEADING;

// primaryCtaUrl fallback chain:
//   1. Explicit URL set by editor (e.g. "/lop-he-cau-long-tphcm/")
//   2. Slug của linked money page (nếu editor chọn linkedPage thay vì gõ URL)
//   3. Default anchor "#lien-he"
const primaryCtaHref =
  campaign?.primaryCtaUrl ??
  (campaign?.linkedPageSlug ? `/${campaign.linkedPageSlug}/` : null) ??
  "#lien-he";

const primaryCta = {
  label: campaign?.primaryCtaLabel ?? "Đăng ký học thử →",
  href: primaryCtaHref,
};

const secondaryCta = {
  label: campaign?.secondaryCtaLabel ?? "Xem khóa học",
  href: campaign?.secondaryCtaUrl ?? "#khoa-hoc",
};
```

**Tại sao dùng `linkedPageSlug` làm fallback?** Editor có hai cách chỉ định CTA URL: gõ thẳng vào `primaryCtaUrl` hoặc chọn money page qua `linkedPage` reference. Nếu dùng `linkedPage` mà không gõ URL → CTA vẫn dẫn đúng trang thay vì fallback về `#lien-he`.

### 2c. Campaign badge

Nếu `campaign?.badgeText` có giá trị, render badge ngay trên eyebrow:

```tsx
{campaign?.badgeText ? (
  <span className="hero__campaign-badge">{campaign.badgeText}</span>
) : null}
<p className="hero__eyebrow">{DEFAULT_HERO_EYEBROW}</p>
```

**Tại sao eyebrow giữ nguyên?** Vì eyebrow chứa local intent ("Bình Thạnh & Thủ Đức") — luôn cần hiển thị cho SEO. Campaign badge là _thêm vào_, không thay thế eyebrow.

### 2d. Hero title — conditional render

H1 là phần phức tạp nhất vì hiện đang hardcode 3 dòng + accent span:

```tsx
{campaign?.heroTitle ? (
  <h1 className="hero__heading">{campaign.heroTitle}</h1>
) : (
  <h1 className="hero__heading">
    HỌC CẦU LÔNG
    <br />
    TẠI TP.HCM
    <br />
    <span className="hero__heading-accent">BÌNH THẠNH &amp; THỦ ĐỨC</span>
  </h1>
)}
```

**Tại sao không format campaign title với `<br />` và accent?** Vì campaign title là free-form text từ CMS. Business owner gõ gì hiển thị đó. Không cần multi-line formatting.

### 2e. CTA buttons — sử dụng derived values

```tsx
<a
  href={primaryCta.href}
  className="btn btn--primary btn--lg"
  onClick={() =>
    trackEvent("cta_click", {
      cta_name: campaign ? "campaign_primary" : "dang_ky_hoc_thu",
      cta_location: "hero",
      page_type: "homepage",
      page_path: "/",
    })
  }
>
  {primaryCta.label}
</a>
<a
  href={secondaryCta.href}
  className="btn btn--outline btn--lg"
  onClick={() =>
    trackEvent("cta_click", {
      cta_name: campaign ? "campaign_secondary" : "xem_khoa_hoc",
      cta_location: "hero",
      page_type: "homepage",
      page_path: "/",
    })
  }
>
  {secondaryCta.label}
</a>
```

**Tracking:** `cta_name` dùng `"campaign_primary"` / `"campaign_secondary"` khi có campaign, để phân biệt với evergreen CTA trong analytics.

---

## Bước 3 — Wire campaign vào page.tsx

Mở `src/app/(site)/page.tsx`:

### 3a. Thêm import

```ts
import {
  getActiveCampaign,   // ← thêm
  getCoaches,
  getFaqs,
  // ...
} from "@/lib/sanity";
```

### 3b. Thêm vào Promise.all

```ts
const [
  pricingTiers,
  scheduleBlocks,
  locations,
  faqs,
  siteSettings,
  coaches,
  testimonials,
  campaign,          // ← thêm
] = await Promise.all([
  getPricingTiers(),
  getScheduleBlocks(),
  getLocations(),
  getFaqs("homepage"),
  getSiteSettings(),
  getCoaches(),
  getTestimonials(),
  getActiveCampaign(),  // ← thêm
]);
```

### 3c. Truyền props

```tsx
<HeroSection campaign={campaign} />
```

---

## Bước 4 — CSS cho campaign badge

Mở `src/app/globals.css`. Thêm style cho badge:

```css
.hero__campaign-badge {
  display: inline-block;
  padding: 0.375rem 1rem;
  background: var(--color-accent, #f59e0b);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
  letter-spacing: 0.02em;
}
```

**Vị trí đặt:** Trong block `.hero` styling (tìm `.hero__eyebrow` rồi thêm trước nó).

Badge dùng pill shape (`border-radius: 9999px`) và màu accent để nổi bật trên hero.

---

## Những gì KHÔNG làm trong ticket này

- Không thêm campaign vào money pages
- Không thay đổi nav
- Không thay đổi metadata/SEO — campaign chỉ ảnh hưởng visual hero
- Không fetch campaign trong `generateMetadata` — homepage vẫn dùng static `buildMetadata("/")`

---

## Cách verify

1. `npm run lint` — pass
2. `npm run build` — pass

### Test case 1: Không có campaign active

- Sanity Studio: không có campaign nào hoặc tất cả status = "Nháp"
- Homepage hero: render y chang hiện tại — title hardcode, CTA mặc định, không có badge
- **Đây là regression test quan trọng nhất**

### Test case 2: Có campaign active

- Sanity Studio: tạo 1 campaign doc:
  - Status: "Đang chạy"
  - Start date: hôm nay hoặc trước
  - End date: ngày trong tương lai
  - Badge: "Lớp hè đang mở đăng ký"
  - Hero title: "LỚP HÈ CẦU LÔNG 2026"
  - Primary CTA label: "Đăng ký lớp hè →"
  - Primary CTA URL: `/lop-he-cau-long-tphcm/`
- Homepage hero: badge hiển thị, title thay đổi, CTA thay đổi
- Eyebrow "Bình Thạnh & Thủ Đức" vẫn hiển thị
- Trust stats vẫn hiển thị
- Quick links vẫn hiển thị

### Test case 3: Campaign hết hạn

- Sửa end date sang hôm qua
- Chờ cache (300s) hoặc restart dev server
- Homepage hero: về lại mặc định
