import {
  EMPTY_LEAD_FORM_VALUES,
  INITIAL_SUBMIT_LEAD_RESULT,
  type SubmitLeadResult,
} from "@/lib/leadSubmission";
import type { SiteChromeSettings } from "@/components/layout/siteSettings";
import type {
  HomepageLocation,
  HomepageScheduleBlock,
} from "@/domain/homepage";
import type { ScheduleLevel } from "@/lib/schedule";
import type { LeadFieldErrors, LeadFormValues } from "@/lib/validation/lead";

export type FormValues = LeadFormValues & {
  _gotcha: string;
};

export type FormErrors = LeadFieldErrors;
export type SubmitState = "idle" | "submitting" | "success" | "error";

export type ContactFormProps = {
  contactSettings: SiteChromeSettings;
  locations: HomepageLocation[];
  scheduleBlocks: HomepageScheduleBlock[];
};

export type ContactFormServerState = SubmitLeadResult;

export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export const BUSINESS_MESSAGE =
  "Quan tâm chương trình cầu lông dành cho doanh nghiệp, cần tư vấn thêm về lịch và báo giá.";

export const LEVEL_OPTIONS: readonly { value: ScheduleLevel; label: string }[] = [
  { value: "co_ban", label: "Cơ bản" },
  { value: "nang_cao", label: "Nâng cao" },
  { value: "doanh_nghiep", label: "Doanh nghiệp" },
] as const;

export const INITIAL_VALUES: FormValues = {
  ...EMPTY_LEAD_FORM_VALUES,
  _gotcha: "",
};

export const INITIAL_SERVER_STATE = INITIAL_SUBMIT_LEAD_RESULT;

type SchedulePrefillLevelSource = {
  levels: readonly ScheduleLevel[];
  levelHint?: ScheduleLevel;
};

/**
 * Quyết định `level` sau khi user bấm một dòng lịch.
 *
 * Dòng lịch được bấm là nguồn chân lý: giữ trình độ user đã chọn nếu dòng đó
 * thực sự nhận trình độ đó, ngược lại thay bằng trình độ duy nhất của dòng
 * (nếu có) hoặc để trống cho user tự chọn.
 *
 * Nếu không có bước này, `level` từ chế độ doanh nghiệp sẽ kẹt lại và lead
 * chọn lịch nhóm bị `buildLeadType()` phân loại nhầm thành `corporate`.
 */
export function resolveSchedulePrefillLevel(
  previousLevel: FormValues["level"],
  prefill: SchedulePrefillLevelSource,
): FormValues["level"] {
  if (previousLevel !== "" && prefill.levels.includes(previousLevel)) {
    return previousLevel;
  }

  return prefill.levelHint ?? "";
}

export function buildLeadType(
  level: LeadFormValues["level"],
  businessMode: boolean,
) {
  if (businessMode || level === "doanh_nghiep") {
    return "corporate" as const;
  }

  return "individual" as const;
}
