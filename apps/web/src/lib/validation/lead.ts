import type { CourtId } from "@/lib/locations";
import type { ScheduleLevel, TimeSlotId } from "@/lib/schedule";
import type { FormFieldName } from "@/lib/tracking";
import { courtLocations } from "@/lib/locations";
import { scheduleItems } from "@/lib/schedule";

export type LeadFormValues = {
  name: string;
  phone: string;
  level: ScheduleLevel | "";
  court: CourtId | "";
  time_slot: TimeSlotId | "";
  message: string;
};

export type RawLeadFormValues = {
  name: string;
  phone: string;
  level: string;
  court: string;
  time_slot: string;
  message: string;
};

export type LeadFieldErrors = Partial<Record<FormFieldName, string>>;

export const VN_MOBILE_REGEX = /^(0|\+84)(3|5|7|8|9)\d{8}$/;

const KNOWN_LEVELS = ["co_ban", "nang_cao", "doanh_nghiep"] as const;
const KNOWN_COURT_IDS = new Set(courtLocations.map((court) => court.id));
const KNOWN_TIME_SLOT_IDS = new Set(
  scheduleItems.map((item) => item.timeSlotId),
);

function readTextValue(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

export function readRawLeadFormValues(formData: FormData): RawLeadFormValues {
  return {
    name: readTextValue(formData, "name"),
    phone: readTextValue(formData, "phone"),
    level: readTextValue(formData, "level"),
    court: readTextValue(formData, "court"),
    time_slot: readTextValue(formData, "time_slot"),
    message: readTextValue(formData, "message"),
  };
}

export function coerceLeadFormValues(raw: RawLeadFormValues): LeadFormValues {
  return {
    name: raw.name,
    phone: raw.phone,
    level: KNOWN_LEVELS.includes(raw.level as ScheduleLevel)
      ? (raw.level as ScheduleLevel)
      : "",
    court: KNOWN_COURT_IDS.has(raw.court as CourtId)
      ? (raw.court as CourtId)
      : "",
    time_slot: KNOWN_TIME_SLOT_IDS.has(raw.time_slot as TimeSlotId)
      ? (raw.time_slot as TimeSlotId)
      : "",
    message: raw.message,
  };
}

export function validateLeadFields(values: LeadFormValues): LeadFieldErrors {
  const errors: LeadFieldErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Vui lòng nhập họ tên từ 2 ký tự trở lên.";
  }

  if (!VN_MOBILE_REGEX.test(values.phone.trim())) {
    errors.phone = "Số điện thoại chưa đúng định dạng di động Việt Nam.";
  }

  if (values.message.trim().length > 500) {
    errors.message = "Lời nhắn tối đa 500 ký tự.";
  }

  return errors;
}

export function validateLeadFieldEnums(
  raw: RawLeadFormValues,
): LeadFieldErrors {
  const errors: LeadFieldErrors = {};

  if (raw.level !== "" && !KNOWN_LEVELS.includes(raw.level as ScheduleLevel)) {
    errors.level = "Trình độ không hợp lệ.";
  }

  if (raw.court !== "" && !KNOWN_COURT_IDS.has(raw.court as CourtId)) {
    errors.court = "Sân tập không hợp lệ.";
  }

  if (
    raw.time_slot !== "" &&
    !KNOWN_TIME_SLOT_IDS.has(raw.time_slot as TimeSlotId)
  ) {
    errors.time_slot = "Khung giờ không hợp lệ.";
  }

  return errors;
}
