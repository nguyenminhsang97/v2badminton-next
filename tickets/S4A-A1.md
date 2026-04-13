# S4A-A1 · Campaign schema → tiếng Việt + descriptions

**Mục tiêu:** Cập nhật `campaign.ts` labels/descriptions sang tiếng Việt, giống hệt cách đã làm cho 9 schema khác trong commit `a209930`.

**Thời gian ước lượng:** 20 phút

**Rủi ro:** Thấp. Chỉ thay đổi `title`, `description`, và option titles trong schema. Không ảnh hưởng data đã lưu vì `name` (technical identifier) giữ nguyên.

---

## File cần sửa

`src/sanity/schemaTypes/campaign.ts`

---

## Hướng dẫn chi tiết

### 1. Document title

```ts
// Trước
title: "Campaign",

// Sau
title: "Chiến dịch",
```

### 2. CAMPAIGN_STATUS_OPTIONS — thêm dấu tiếng Việt

```ts
// Trước
const CAMPAIGN_STATUS_OPTIONS = [
  { title: "Draft", value: "draft" },
  { title: "Active", value: "active" },
  { title: "Ended", value: "ended" },
] as const;

// Sau
const CAMPAIGN_STATUS_OPTIONS = [
  { title: "Nháp", value: "draft" },
  { title: "Đang chạy", value: "active" },
  { title: "Đã kết thúc", value: "ended" },
] as const;
```

### 3. Field titles + descriptions

Bảng mapping — cột bên trái là `name` (giữ nguyên), cột giữa là `title` mới, cột phải là `description` cần thêm:

| `name` | `title` mới | `description` cần thêm |
|--------|-------------|----------------------|
| `slug` | `Slug (URL)` | `Tự động tạo từ tên chiến dịch.` |
| `name` | `Tên chiến dịch` | (không cần) |
| `status` | `Trạng thái` | `Chỉ chiến dịch "Đang chạy" mới hiển thị trên homepage.` |
| `startDate` | `Ngày bắt đầu` | (không cần) |
| `endDate` | `Ngày kết thúc` | (không cần) |
| `badgeText` | `Dòng badge trên hero` | `VD: Lớp hè đang mở đăng ký. Hiển thị dạng tag nhỏ trên hero homepage.` |
| `heroTitle` | `Tiêu đề hero (thay thế)` | `Nếu có: thay thế tiêu đề chính trên hero homepage trong suốt chiến dịch.` |
| `heroDescription` | `Mô tả hero (thay thế)` | `Nếu có: thay thế đoạn mô tả dưới tiêu đề hero homepage.` |
| `primaryCtaLabel` | `Nút CTA chính — nội dung` | `VD: Đăng ký lớp hè →. Thay thế nút "Đăng ký học thử" trên hero.` |
| `primaryCtaUrl` | `Nút CTA chính — link` | `Cho phép internal path như /lop-he-cau-long-tphcm/ hoặc anchor #lien-he.` |
| `secondaryCtaLabel` | `Nút CTA phụ — nội dung` | `VD: Xem lịch lớp hè` |
| `secondaryCtaUrl` | `Nút CTA phụ — link` | (không cần) |
| `featuredAudience` | `Đối tượng ưu tiên` | `Dùng để tùy chỉnh trải nghiệm form theo đối tượng (nếu có).` |
| `linkedPage` | `Trang nội dung liên kết` | `Trang money page gắn với chiến dịch này. VD: trang Lớp hè.` |

### 4. Validation message

```ts
// Trước
return "End date must be after start date";

// Sau
return "Ngày kết thúc phải sau ngày bắt đầu.";
```

### 5. Preview subtitle — phải sửa thủ công

Preview của campaign hiện trả raw `status` value ra, không qua options list:

```ts
// Hiện tại trong campaign.ts
preview: {
  select: {
    title: "name",
    subtitle: "status",    // ← raw value, không qua options
  },
  prepare({ title, subtitle }) {
    return { title, subtitle };    // subtitle = "draft" / "active" / "ended"
  },
},
```

Options list không tự map vào preview — Sanity Studio chỉ dùng options list để render dropdown, không phải preview subtitle. Phải map thủ công:

```ts
// Sau
const STATUS_LABEL: Record<string, string> = {
  draft: "Nháp",
  active: "Đang chạy",
  ended: "Đã kết thúc",
};

// Trong preview:
prepare({ title, subtitle }) {
  return {
    title,
    subtitle: STATUS_LABEL[subtitle] ?? subtitle,
  };
},
```

Đặt `STATUS_LABEL` ngay dưới `CAMPAIGN_STATUS_OPTIONS` (cùng file, không export).

---

## Cách verify

1. `npm run lint` — pass
2. `npm run build` — pass
3. Mở Sanity Studio → sidebar phải hiển thị "Chiến dịch" thay vì "Campaign"
4. Mở 1 campaign doc → tất cả labels tiếng Việt, descriptions hiển thị đúng
