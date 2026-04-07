import type { SubmissionMethod } from "@/lib/tracking";
import type { LeadFieldErrors, LeadFormValues } from "@/lib/validation/lead";

export type SubmitLeadErrorCode =
  | "validation"
  | "rate_limited"
  | "captcha_failed"
  | "invalid_form_token"
  | "server_error";

export const EMPTY_LEAD_FORM_VALUES: LeadFormValues = {
  name: "",
  phone: "",
  level: "",
  court: "",
  time_slot: "",
  message: "",
};

export type SubmitLeadResult = {
  success: boolean;
  deduped: boolean;
  message: string | null;
  error: SubmitLeadErrorCode | null;
  errors: LeadFieldErrors;
  values: LeadFormValues;
  submissionMethod: SubmissionMethod | null;
  submittedAt: string | null;
};

export const INITIAL_SUBMIT_LEAD_RESULT: SubmitLeadResult = {
  success: false,
  deduped: false,
  message: null,
  error: null,
  errors: {},
  values: EMPTY_LEAD_FORM_VALUES,
  submissionMethod: null,
  submittedAt: null,
};
