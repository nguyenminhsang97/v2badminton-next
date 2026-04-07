import type { CourtId } from "@/lib/locations";
import type { ScheduleLevel, TimeSlotId } from "@/lib/schedule";
import type { SubmissionMethod } from "@/lib/tracking";

export type LeadNotificationPayload = {
  name: string;
  phone: string;
  level: ScheduleLevel | null;
  court: CourtId | null;
  time_slot: TimeSlotId | null;
  message: string | null;
  landing_page: string;
  submission_method: SubmissionMethod;
};

export type LeadInsertPayload = LeadNotificationPayload & {
  dedupe_key: string;
};
