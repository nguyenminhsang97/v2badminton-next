export const DISTRICT_OPTIONS = [
  { title: "Binh Thanh", value: "binh_thanh" },
  { title: "Thu Duc", value: "thu_duc" },
] as const;

export const PRICING_KIND_OPTIONS = [
  { title: "Group", value: "group" },
  { title: "Private", value: "private" },
  { title: "Enterprise", value: "enterprise" },
] as const;

export const BILLING_MODEL_OPTIONS = [
  { title: "Monthly Package", value: "monthly_package" },
  { title: "Per Hour", value: "per_hour" },
  { title: "Quote", value: "quote" },
] as const;

export const CTA_ACTION_OPTIONS = [
  { title: "Dang ky hoc thu", value: "dang_ky_hoc_thu" },
  { title: "Nhan bao gia", value: "nhan_bao_gia" },
] as const;

export const SCHEDULE_LEVEL_OPTIONS = [
  { title: "Co ban", value: "co_ban" },
  { title: "Nang cao", value: "nang_cao" },
  { title: "Doanh nghiep", value: "doanh_nghiep" },
] as const;

export const FAQ_PAGE_OPTIONS = [
  { title: "Homepage", value: "homepage" },
  { title: "Nguoi moi", value: "nguoi_moi" },
  { title: "Binh Thanh", value: "binh_thanh" },
  { title: "Thu Duc", value: "thu_duc" },
  { title: "Tre em", value: "tre_em" },
  { title: "Nguoi di lam", value: "nguoi_di_lam" },
  { title: "Doanh nghiep", value: "doanh_nghiep" },
  { title: "Summer", value: "summer" },
] as const;

export const STUDENT_GROUP_OPTIONS = [
  { title: "Tre em", value: "tre_em" },
  { title: "Nguoi moi", value: "nguoi_moi" },
  { title: "Nguoi di lam", value: "nguoi_di_lam" },
  { title: "Doanh nghiep", value: "doanh_nghiep" },
] as const;

export const AUDIENCE_OPTIONS = [
  { title: "Tre em", value: "tre_em" },
  { title: "Nguoi moi", value: "nguoi_moi" },
  { title: "Nguoi di lam", value: "nguoi_di_lam" },
  { title: "Doanh nghiep", value: "doanh_nghiep" },
  { title: "Local (quan/khu vuc)", value: "local" },
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
