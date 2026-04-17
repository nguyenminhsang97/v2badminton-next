/**
 * SPRINT 2 STATUS: Partially active.
 * ScheduleLevel, TimeSlotId types are still depended on by:
 *   - src/lib/validation/lead.ts
 *   - src/lib/leadPipeline.ts
 *   - src/lib/db/types.ts
 *   - src/components/home/compat/legacyScheduleCompatibility.ts
 *   - src/components/home/forms/ContactForm.tsx
 * scheduleItems data also used in queries.ts for fallback.
 * Full deprecation blocked until lead pipeline migrates to Sanity-native IDs (Sprint 4+).
 */
import { courtLocationMap, type CourtId, type DistrictId } from "@/lib/locations";

export type ScheduleLevel = "co_ban" | "nang_cao" | "doanh_nghiep";
export type TimeSlotId =
  | "sang-07-09"
  | "sang-08-10"
  | "sang-09-11"
  | "trua-1130-13"
  | "trua-12-14"
  | "chieu-14-1530"
  | "chieu-17-18"
  | "toi-18-20"
  | "toi-20-22";

export type ScheduleItem = {
  id: string;
  courtId: CourtId;
  dayGroup: string;
  timeSlotId: TimeSlotId;
  timeLabel: string;
  level: ScheduleLevel;
  levelLabel: string;
  levels: ScheduleLevel[];
  levelLabels: string[];
  prefillMessage: string;
  prefillCourtId: CourtId;
  prefillTimeSlotId: TimeSlotId;
};

function createScheduleItem(input: {
  id: string;
  courtId: CourtId;
  dayGroup: string;
  timeSlotId: TimeSlotId;
  timeLabel: string;
  levels: ScheduleLevel[];
  levelLabels: string[];
}): ScheduleItem {
  return {
    ...input,
    level: input.levels[0],
    levelLabel: input.levelLabels.join(", "),
    prefillMessage: `Quan tâm lịch: ${input.dayGroup} | ${input.timeLabel} | ${courtLocationMap[input.courtId].name}`,
    prefillCourtId: input.courtId,
    prefillTimeSlotId: input.timeSlotId,
  };
}

export const scheduleItems: readonly ScheduleItem[] = [
  createScheduleItem({
    id: "hue-thien-sang-07-09-t7-cn",
    courtId: "hue_thien",
    dayGroup: "T7 – CN",
    timeSlotId: "sang-07-09",
    timeLabel: "07:00 – 09:00",
    levels: ["co_ban", "nang_cao"],
    levelLabels: ["Cơ bản", "Nâng cao"],
  }),
  createScheduleItem({
    id: "green-sang-08-10-t7-cn",
    courtId: "green",
    dayGroup: "T7 – CN",
    timeSlotId: "sang-08-10",
    timeLabel: "08:00 – 10:00",
    levels: ["co_ban"],
    levelLabels: ["Cơ bản"],
  }),
  createScheduleItem({
    id: "hue-thien-sang-09-11-t7-cn",
    courtId: "hue_thien",
    dayGroup: "T7 – CN",
    timeSlotId: "sang-09-11",
    timeLabel: "09:00 – 11:00",
    levels: ["co_ban", "nang_cao"],
    levelLabels: ["Cơ bản", "Nâng cao"],
  }),
  createScheduleItem({
    id: "khang-sport-trua-1130-13-t7",
    courtId: "khang_sport",
    dayGroup: "Thứ 7",
    timeSlotId: "trua-1130-13",
    timeLabel: "11:30 – 13:00",
    levels: ["co_ban"],
    levelLabels: ["Cơ bản"],
  }),
  createScheduleItem({
    id: "khang-sport-trua-12-14-t7-cn",
    courtId: "khang_sport",
    dayGroup: "T7 – CN",
    timeSlotId: "trua-12-14",
    timeLabel: "12:00 – 14:00",
    levels: ["co_ban", "nang_cao"],
    levelLabels: ["Cơ bản", "Nâng cao"],
  }),
  createScheduleItem({
    id: "phuc-loc-chieu-14-1530-t2-t4-t6",
    courtId: "phuc_loc",
    dayGroup: "T2 – T4 – T6",
    timeSlotId: "chieu-14-1530",
    timeLabel: "14:00 – 15:30",
    levels: ["co_ban"],
    levelLabels: ["Cơ bản"],
  }),
  createScheduleItem({
    id: "green-chieu-14-1530-t3-t5-t7",
    courtId: "green",
    dayGroup: "T3 – T5 – T7",
    timeSlotId: "chieu-14-1530",
    timeLabel: "14:00 – 15:30",
    levels: ["co_ban"],
    levelLabels: ["Cơ bản"],
  }),
  createScheduleItem({
    id: "hue-thien-chieu-17-18-t7-cn",
    courtId: "hue_thien",
    dayGroup: "T7 – CN",
    timeSlotId: "chieu-17-18",
    timeLabel: "17:00 – 18:00",
    levels: ["co_ban", "nang_cao"],
    levelLabels: ["Cơ bản", "Nâng cao"],
  }),
  createScheduleItem({
    id: "phuc-loc-toi-18-20-t2-t4-t6",
    courtId: "phuc_loc",
    dayGroup: "T2 – T4 – T6",
    timeSlotId: "toi-18-20",
    timeLabel: "18:00 – 20:00",
    levels: ["co_ban"],
    levelLabels: ["Cơ bản"],
  }),
  createScheduleItem({
    id: "hue-thien-toi-18-20-t2-t4-t6",
    courtId: "hue_thien",
    dayGroup: "T2 – T4 – T6",
    timeSlotId: "toi-18-20",
    timeLabel: "18:00 – 20:00",
    levels: ["co_ban", "nang_cao"],
    levelLabels: ["Cơ bản", "Nâng cao"],
  }),
  createScheduleItem({
    id: "green-toi-18-20-t3-t5",
    courtId: "green",
    dayGroup: "T3 – T5",
    timeSlotId: "toi-18-20",
    timeLabel: "18:00 – 20:00",
    levels: ["co_ban", "nang_cao"],
    levelLabels: ["Cơ bản", "Nâng cao"],
  }),
  createScheduleItem({
    id: "hue-thien-toi-18-20-t3-t5-t7",
    courtId: "hue_thien",
    dayGroup: "T3 – T5 – T7",
    timeSlotId: "toi-18-20",
    timeLabel: "18:00 – 20:00",
    levels: ["co_ban"],
    levelLabels: ["Cơ bản"],
  }),
  createScheduleItem({
    id: "hue-thien-toi-20-22-t2-t4-t6",
    courtId: "hue_thien",
    dayGroup: "T2 – T4 – T6",
    timeSlotId: "toi-20-22",
    timeLabel: "20:00 – 22:00",
    levels: ["co_ban", "nang_cao"],
    levelLabels: ["Cơ bản", "Nâng cao"],
  }),
  createScheduleItem({
    id: "phuc-loc-toi-20-22-t2-t4-t6",
    courtId: "phuc_loc",
    dayGroup: "T2 – T4 – T6",
    timeSlotId: "toi-20-22",
    timeLabel: "20:00 – 22:00",
    levels: ["co_ban"],
    levelLabels: ["Cơ bản"],
  }),
  createScheduleItem({
    id: "green-toi-20-22-t3-t5",
    courtId: "green",
    dayGroup: "T3 – T5",
    timeSlotId: "toi-20-22",
    timeLabel: "20:00 – 22:00",
    levels: ["co_ban"],
    levelLabels: ["Cơ bản"],
  }),
] as const;

export function getScheduleForDistrict(
  districtId: DistrictId,
): readonly ScheduleItem[] {
  return scheduleItems.filter(
    (item) => courtLocationMap[item.courtId].district === districtId,
  );
}
