"use server";

import * as Sentry from "@sentry/nextjs";
import { after } from "next/server";
import { headers } from "next/headers";
import { checkHoneypot, verifyFormToken, verifyTurnstile } from "@/lib/antispam";
import { insertLead, isDatabaseConfigured } from "@/lib/db";
import { findRecentDuplicate, buildDedupeKey } from "@/lib/dedupe";
import {
  EMPTY_LEAD_FORM_VALUES,
  type SubmitLeadErrorCode,
  type SubmitLeadResult,
} from "@/lib/leadSubmission";
import type { LeadInsertPayload, LeadNotificationPayload } from "@/lib/leadPipeline";
import { captureException } from "@/lib/monitoring";
import { notifyEmail } from "@/lib/notify/email";
import { notifyTelegram } from "@/lib/notify/telegram";
import { checkRateLimit } from "@/lib/rateLimit";
import type { SubmissionMethod } from "@/lib/tracking";
import {
  coerceLeadFormValues,
  readRawLeadFormValues,
  validateLeadFieldEnums,
  validateLeadFields,
} from "@/lib/validation/lead";

function buildResult(
  partial: Partial<SubmitLeadResult> = {},
): SubmitLeadResult {
  return {
    success: false,
    deduped: false,
    message: null,
    error: null,
    errors: {},
    values: EMPTY_LEAD_FORM_VALUES,
    submissionMethod: null,
    submittedAt: new Date().toISOString(),
    ...partial,
  };
}

function getClientIp(requestHeaders: Headers) {
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return requestHeaders.get("x-real-ip")?.trim() || "127.0.0.1";
}

function getLandingPage(requestHeaders: Headers, formData: FormData) {
  const explicitLandingPage = formData.get("landing_page");
  if (
    typeof explicitLandingPage === "string" &&
    explicitLandingPage.trim().length > 0
  ) {
    return explicitLandingPage.trim();
  }

  const referer = requestHeaders.get("referer");
  if (!referer) {
    return "/";
  }

  try {
    return new URL(referer).pathname || "/";
  } catch {
    return "/";
  }
}

function buildErrorResult(
  values: SubmitLeadResult["values"],
  submissionMethod: SubmissionMethod,
  error: SubmitLeadErrorCode,
  message: string,
  errors: SubmitLeadResult["errors"] = {},
) {
  return buildResult({
    success: false,
    error,
    message,
    errors,
    values,
    submissionMethod,
  });
}

export async function submitLead(
  _previousState: SubmitLeadResult,
  formData: FormData,
): Promise<SubmitLeadResult> {
  const requestHeaders = await headers();
  return Sentry.withServerActionInstrumentation(
    "submitLead",
    {},
    async () => {
      const rawValues = readRawLeadFormValues(formData);
      const values = coerceLeadFormValues(rawValues);
      const formToken = String(formData.get("_form_token") ?? "");
      const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");
      const submissionMethod: SubmissionMethod = formToken.trim() ? "js" : "no_js";
      const landingPage = getLandingPage(requestHeaders, formData);

      if (checkHoneypot(formData)) {
        return buildResult({
          success: true,
          message: "V2 da nhan thong tin. Chung toi se lien he som.",
          values,
          submissionMethod,
        });
      }

      const validationErrors = {
        ...validateLeadFieldEnums(rawValues),
        ...validateLeadFields(values),
      };

      if (Object.keys(validationErrors).length > 0) {
        return buildErrorResult(
          values,
          submissionMethod,
          "validation",
          "Vui long kiem tra lai thong tin truoc khi gui.",
          validationErrors,
        );
      }

      const clientIp = getClientIp(requestHeaders);
      const rateLimit = await checkRateLimit(clientIp, submissionMethod);
      if (!rateLimit.allowed) {
        return buildErrorResult(
          values,
          submissionMethod,
          "rate_limited",
          "Ban da gui qua nhieu lan trong mot thoi gian ngan. Thu lai sau it phut nhe.",
        );
      }

      if (submissionMethod === "js") {
        const formTokenCheck = await verifyFormToken(formToken);
        if (!formTokenCheck.ok) {
          return buildErrorResult(
            values,
            submissionMethod,
            "invalid_form_token",
            "Form dang ky da het han hoac chua san sang. Vui long tai lai trang va thu lai.",
          );
        }

        const turnstileCheck = await verifyTurnstile(turnstileToken, clientIp);
        if (!turnstileCheck.ok) {
          return buildErrorResult(
            values,
            submissionMethod,
            "captcha_failed",
            "Khong the xac minh captcha. Vui long thu lai.",
          );
        }
      }

      if (!isDatabaseConfigured()) {
        return buildErrorResult(
          values,
          submissionMethod,
          "server_error",
          "He thong luu lead chua san sang. Vui long thu lai sau it phut.",
        );
      }

      const dedupeKey = buildDedupeKey({
        name: values.name,
        phone: values.phone,
        court: values.court,
        time_slot: values.time_slot,
        message: values.message,
        landing_page: landingPage,
      });

      try {
        const duplicateLead = await findRecentDuplicate(dedupeKey);
        if (duplicateLead) {
          return buildResult({
            success: true,
            deduped: true,
            message: "V2 da nhan thong tin. Chung toi se lien he som.",
            values,
            submissionMethod,
          });
        }

        const leadPayload: LeadInsertPayload = {
          name: values.name.trim(),
          phone: values.phone.trim(),
          level: values.level || null,
          court: values.court || null,
          time_slot: values.time_slot || null,
          message: values.message.trim() || null,
          landing_page: landingPage,
          submission_method: submissionMethod,
          dedupe_key: dedupeKey,
        };

        const leadId = await insertLead(leadPayload);
        if (!leadId) {
          throw new Error("Lead insert did not return an id.");
        }

        const notifyPayload: LeadNotificationPayload = {
          name: leadPayload.name,
          phone: leadPayload.phone,
          level: leadPayload.level,
          court: leadPayload.court,
          time_slot: leadPayload.time_slot,
          message: leadPayload.message,
          landing_page: leadPayload.landing_page,
          submission_method: leadPayload.submission_method,
        };

        after(async () => {
          await Promise.allSettled([
            notifyTelegram(leadId, notifyPayload),
            notifyEmail(leadId, notifyPayload),
          ]);
        });

        return buildResult({
          success: true,
          message: "V2 da nhan thong tin. Chung toi se lien he som.",
          values,
          submissionMethod,
        });
      } catch (error) {
        console.error("submitLead failed", error);
        captureException(error, {
          tags: {
            area: "submitLead",
            submission_method: submissionMethod,
          },
          extras: {
            landing_page: landingPage,
          },
        });
        return buildErrorResult(
          values,
          submissionMethod,
          "server_error",
          "Khong the gui form luc nay. Vui long thu lai sau it phut.",
        );
      }
    },
  );
}
