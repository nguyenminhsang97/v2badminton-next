export const DISTRICT_OPTIONS = [
  { title: "Bình Thạnh", value: "binh_thanh" },
  { title: "Thủ Đức", value: "thu_duc" },
] as const;

export const PRICING_KIND_OPTIONS = [
  { title: "Nhóm", value: "group" },
  { title: "Kèm riêng (1:1)", value: "private" },
  { title: "Doanh nghiệp", value: "enterprise" },
] as const;

export const BILLING_MODEL_OPTIONS = [
  { title: "Gói tháng", value: "monthly_package" },
  { title: "Theo giờ", value: "per_hour" },
  { title: "Báo giá", value: "quote" },
] as const;

export const CTA_ACTION_OPTIONS = [
  { title: "Đăng ký học thử", value: "dang_ky_hoc_thu" },
  { title: "Nhận báo giá", value: "nhan_bao_gia" },
] as const;

export const SCHEDULE_LEVEL_OPTIONS = [
  { title: "Cơ bản", value: "co_ban" },
  { title: "Nâng cao", value: "nang_cao" },
  { title: "Doanh nghiệp", value: "doanh_nghiep" },
] as const;

export const FAQ_PAGE_OPTIONS = [
  { title: "Trang chủ", value: "homepage" },
  { title: "Người mới", value: "nguoi_moi" },
  { title: "Bình Thạnh", value: "binh_thanh" },
  { title: "Thủ Đức", value: "thu_duc" },
  { title: "Trẻ em", value: "tre_em" },
  { title: "Người đi làm", value: "nguoi_di_lam" },
  { title: "Doanh nghiệp", value: "doanh_nghiep" },
  { title: "Hè", value: "summer" },
] as const;

export const STUDENT_GROUP_OPTIONS = [
  { title: "Trẻ em", value: "tre_em" },
  { title: "Người mới", value: "nguoi_moi" },
  { title: "Người đi làm", value: "nguoi_di_lam" },
  { title: "Doanh nghiệp", value: "doanh_nghiep" },
] as const;

export const AUDIENCE_OPTIONS = [
  { title: "Trẻ em", value: "tre_em" },
  { title: "Người mới", value: "nguoi_moi" },
  { title: "Người đi làm", value: "nguoi_di_lam" },
  { title: "Doanh nghiệp", value: "doanh_nghiep" },
  { title: "Địa phương (quận/khu vực)", value: "local" },
] as const;

export const DISTRICT_LABEL_BY_VALUE = Object.fromEntries(
  DISTRICT_OPTIONS.map((option) => [option.value, option.title]),
) as Record<string, string>;

export const PRICING_KIND_LABEL_BY_VALUE = Object.fromEntries(
  PRICING_KIND_OPTIONS.map((option) => [option.value, option.title]),
) as Record<string, string>;

export const SCHEDULE_LEVEL_LABEL_BY_VALUE = Object.fromEntries(
  SCHEDULE_LEVEL_OPTIONS.map((option) => [option.value, option.title]),
) as Record<string, string>;

export function slugifyValue(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}
