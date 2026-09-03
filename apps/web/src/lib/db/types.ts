import type { CourtId } from "@/lib/locations";
import type { ScheduleLevel, TimeSlotId } from "@/lib/schedule";
import type { SubmissionMethod } from "@/lib/tracking";

export type LeadDeliveryStatus = "pending" | "sent" | "failed" | "skipped";

export type LeadRow = {
  id: string;
  name: string;
  phone: string;
  level: ScheduleLevel | null;
  court: CourtId | null;
  time_slot: TimeSlotId | null;
  message: string | null;
  submission_method: SubmissionMethod;
  landing_page: string | null;
  dedupe_key: string | null;
  telegram_status: LeadDeliveryStatus;
  telegram_attempted_at: string | null;
  telegram_error: string | null;
  email_status: LeadDeliveryStatus;
  email_attempted_at: string | null;
  email_error: string | null;
  created_at: string;
};
