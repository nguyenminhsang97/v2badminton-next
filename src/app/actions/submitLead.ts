"use server";

import * as Sentry from "@sentry/nextjs";
import { after } from "next/server";
import { headers } from "next/headers";
import {
  checkHoneypot,
  isFormTokenProtectionEnabled,
  isTurnstileProtectionEnabled,
  verifyFormToken,
  verifyTurnstile,
} from "@/lib/antispam";
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
      const requiresFormToken = isFormTokenProtectionEnabled();
      const requiresTurnstile = isTurnstileProtectionEnabled();
      const submissionMethod: SubmissionMethod =
        requiresFormToken || requiresTurnstile || formToken.trim()
          ? "js"
          : "no_js";
      const landingPage = getLandingPage(requestHeaders, formData);

      if (checkHoneypot(formData)) {
        return buildResult({
          success: true,
          message: "V2 đã nhận thông tin. Chúng tôi sẽ liên hệ sớm.",
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
          "Vui lòng kiểm tra lại thông tin trước khi gửi.",
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
          "Bạn đã gửi quá nhiều lần trong một thời gian ngắn. Thử lại sau ít phút nhé.",
        );
      }

      if (requiresFormToken) {
        const formTokenCheck = await verifyFormToken(formToken);
        if (!formTokenCheck.ok) {
          return buildErrorResult(
            values,
            submissionMethod,
            "invalid_form_token",
            "Form đăng ký đã hết hạn hoặc chưa sẵn sàng. Vui lòng tải lại trang và thử lại.",
          );
        }

      }

      if (requiresTurnstile) {
        const turnstileCheck = await verifyTurnstile(turnstileToken, clientIp);
        if (!turnstileCheck.ok) {
          return buildErrorResult(
            values,
            submissionMethod,
            "captcha_failed",
            "Không thể xác minh captcha. Vui lòng thử lại.",
          );
        }
      }

      if (!isDatabaseConfigured()) {
        return buildErrorResult(
          values,
          submissionMethod,
          "server_error",
          "Hệ thống lưu lead chưa sẵn sàng. Vui lòng thử lại sau ít phút.",
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
            message: "V2 đã nhận thông tin. Chúng tôi sẽ liên hệ sớm.",
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
          message: "V2 đã nhận thông tin. Chúng tôi sẽ liên hệ sớm.",
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
          "Không thể gửi form lúc này. Vui lòng thử lại sau ít phút.",
        );
      }
    },
  );
}
