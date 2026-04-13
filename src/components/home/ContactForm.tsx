"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  useActionState,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";
import { submitLead } from "@/app/actions/submitLead";
import {
  EMPTY_LEAD_FORM_VALUES,
  INITIAL_SUBMIT_LEAD_RESULT,
} from "@/lib/leadSubmission";
import type { SanityLocation, SanityScheduleBlock } from "@/lib/sanity";
import type { ScheduleLevel } from "@/lib/schedule";
import {
  trackEvent,
  type FormFieldName,
  type SubmissionMethod,
} from "@/lib/tracking";
import {
  validateLeadFields,
  type LeadFieldErrors,
  type LeadFormValues,
} from "@/lib/validation/lead";
import { useHomepageConversion } from "./HomepageConversionProvider";
import type { HomeContactSettings } from "./contactSettings";
import {
  buildLegacyCourtOptions,
  buildLegacyTimeSlotOptions,
} from "./legacyScheduleCompatibility";

type FormValues = LeadFormValues & {
  _gotcha: string;
};

type FormErrors = LeadFieldErrors;
type SubmitState = "idle" | "submitting" | "success" | "error";
type ContactFormProps = {
  contactSettings: HomeContactSettings;
  locations: SanityLocation[];
  scheduleBlocks: SanityScheduleBlock[];
};

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const BUSINESS_MESSAGE =
  "Quan tâm chương trình cầu lông dành cho doanh nghiệp, cần tư vấn thêm về lịch và báo giá.";

const LEVEL_OPTIONS: readonly { value: ScheduleLevel; label: string }[] = [
  { value: "co_ban", label: "Cơ bản" },
  { value: "nang_cao", label: "Nâng cao" },
  { value: "doanh_nghiep", label: "Doanh nghiệp" },
] as const;

const INITIAL_VALUES: FormValues = {
  ...EMPTY_LEAD_FORM_VALUES,
  _gotcha: "",
};

function buildLeadType(level: LeadFormValues["level"], businessMode: boolean) {
  if (businessMode || level === "doanh_nghiep") {
    return "corporate" as const;
  }

  return "individual" as const;
}

export function ContactForm({
  contactSettings,
  locations,
  scheduleBlocks,
}: ContactFormProps) {
  const pathname = usePathname();
  const {
    selectedSchedulePrefill,
    autoPrefilledMessage,
    businessMode,
    markMessageUserEdited,
    setAutoPrefilledMessage,
  } = useHomepageConversion();
  const [serverState, formAction, isPending] = useActionState(
    submitLead,
    INITIAL_SUBMIT_LEAD_RESULT,
  );
  const [values, setValues] = useState<FormValues>(() => ({
    ...INITIAL_VALUES,
    ...serverState.values,
  }));
  const [errors, setErrors] = useState<FormErrors>(serverState.errors);
  const [optionalOpen, setOptionalOpen] = useState(
    Boolean(
      serverState.values.level ||
        serverState.values.court ||
        serverState.values.time_slot ||
        serverState.values.message,
    ),
  );
  const [submitMessage, setSubmitMessage] = useState<string | null>(
    serverState.message,
  );
  const [dirtySinceServer, setDirtySinceServer] = useState(false);
  const [formToken, setFormToken] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);

  const startedAtRef = useRef<number | null>(null);
  const hasTrackedStartRef = useRef(false);
  const hasSubmittedRef = useRef(false);
  const lastFocusedFieldRef = useRef<FormFieldName | null>(null);
  const lastAppliedPrefillKeyRef = useRef<string | null>(null);
  const lastBusinessModeRef = useRef(false);
  const lastHandledServerStateRef = useRef<string | null>(null);
  const lastTrackedServerErrorRef = useRef<string | null>(null);
  const lastTrackedSuccessRef = useRef<string | null>(null);

  const businessHeading = businessMode
    ? "Nhận tư vấn cho doanh nghiệp"
    : "Đăng ký học thử";
  const courtOptions = useMemo(
    () => buildLegacyCourtOptions(locations),
    [locations],
  );
  const timeSlotOptions = useMemo(
    () => buildLegacyTimeSlotOptions(scheduleBlocks),
    [scheduleBlocks],
  );

  const canAutoOverwriteMessage = useMemo(
    () =>
      autoPrefilledMessage === null || autoPrefilledMessage === values.message,
    [autoPrefilledMessage, values.message],
  );
  const shouldRenderCaptcha = Boolean(turnstileSiteKey);

  const applySelectedSchedulePrefill = useEffectEvent(() => {
    if (selectedSchedulePrefill === null) {
      return;
    }

    setOptionalOpen(true);
    setDirtySinceServer(true);

    setValues((prev) => {
      const nextValues: FormValues = {
        ...prev,
        court: selectedSchedulePrefill.courtId,
        time_slot: selectedSchedulePrefill.timeSlotId,
      };

      if (prev.level === "" && selectedSchedulePrefill.levelHint) {
        nextValues.level = selectedSchedulePrefill.levelHint;
      }

      if (
        autoPrefilledMessage === null ||
        autoPrefilledMessage === prev.message
      ) {
        nextValues.message = selectedSchedulePrefill.message;
      }

      return nextValues;
    });

    if (canAutoOverwriteMessage) {
      setAutoPrefilledMessage(selectedSchedulePrefill.message);
    }

    setErrors((prev) => ({
      ...prev,
      court: undefined,
      time_slot: undefined,
      level: undefined,
      message: undefined,
    }));
    setSubmitMessage(null);
  });

  const applyBusinessMode = useEffectEvent(() => {
    setOptionalOpen(true);
    setDirtySinceServer(true);

    setValues((prev) => {
      const nextValues: FormValues = {
        ...prev,
        level: "doanh_nghiep",
        court: "",
        time_slot: "",
      };

      if (
        autoPrefilledMessage === null ||
        autoPrefilledMessage === prev.message
      ) {
        nextValues.message = BUSINESS_MESSAGE;
      }

      return nextValues;
    });

    if (canAutoOverwriteMessage) {
      setAutoPrefilledMessage(BUSINESS_MESSAGE);
    }

    setErrors((prev) => ({
      ...prev,
      court: undefined,
      time_slot: undefined,
      level: undefined,
      message: undefined,
    }));
    setSubmitMessage(null);
  });

  const applyServerActionState = useEffectEvent(() => {
    setDirtySinceServer(false);
    setErrors(serverState.errors);
    setSubmitMessage(serverState.message);
    setValues((prev) => ({
      ...prev,
      ...serverState.values,
      _gotcha: "",
    }));

    if (serverState.success) {
      hasSubmittedRef.current = true;

      if (
        !serverState.deduped &&
        lastTrackedSuccessRef.current !== serverState.submittedAt
      ) {
        lastTrackedSuccessRef.current = serverState.submittedAt;
        const elapsed = startedAtRef.current
          ? performance.now() - startedAtRef.current
          : 0;
        const submissionMethod =
          serverState.submissionMethod ?? (formToken ? "js" : "no_js");

        trackEvent("time_to_submit", {
          time_to_submit_ms: elapsed,
          page_type: "homepage",
          page_path: pathname || "/",
        });
        trackEvent("generate_lead", {
          page_type: "homepage",
          page_path: pathname || "/",
          lead_type: buildLeadType(values.level, businessMode),
          has_court_preference: values.court !== "",
          has_time_preference: values.time_slot !== "",
          submission_method: submissionMethod as SubmissionMethod,
          time_to_submit_ms: elapsed,
        });
      }

      return;
    }

    if (
      serverState.error &&
      serverState.error !== "validation" &&
      lastTrackedServerErrorRef.current !== serverState.submittedAt
    ) {
      lastTrackedServerErrorRef.current = serverState.submittedAt;
      trackEvent("form_error", {
        error_code: serverState.error,
        page_type: "homepage",
        page_path: pathname || "/",
      });
    }
  });

  const submitState: SubmitState = isPending
    ? "submitting"
    : serverState.success && !dirtySinceServer
      ? "success"
      : submitMessage || Object.keys(errors).length > 0
        ? "error"
        : "idle";

  useEffect(() => {
    let cancelled = false;

    async function loadFormToken() {
      try {
        const response = await fetch("/api/form-token", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { token?: unknown };
        if (!cancelled && typeof data.token === "string") {
          setFormToken(data.token);
        }
      } catch (error) {
        console.error("Failed to load form token", error);
      }
    }

    void loadFormToken();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (selectedSchedulePrefill === null) {
      return;
    }

    const nextKey = [
      selectedSchedulePrefill.courtId,
      selectedSchedulePrefill.timeSlotId,
      selectedSchedulePrefill.message,
      selectedSchedulePrefill.levelHint ?? "",
    ].join("|");

    if (lastAppliedPrefillKeyRef.current === nextKey) {
      return;
    }

    lastAppliedPrefillKeyRef.current = nextKey;
    applySelectedSchedulePrefill();
  }, [selectedSchedulePrefill]);

  useEffect(() => {
    if (!businessMode || lastBusinessModeRef.current) {
      lastBusinessModeRef.current = businessMode;
      return;
    }

    lastBusinessModeRef.current = true;
    applyBusinessMode();
  }, [businessMode]);

  useEffect(() => {
    if (!businessMode) {
      lastBusinessModeRef.current = false;
    }
  }, [businessMode]);

  useEffect(() => {
    return () => {
      if (hasTrackedStartRef.current && !hasSubmittedRef.current) {
        trackEvent("form_abandon", {
          last_focused_field: lastFocusedFieldRef.current ?? undefined,
          page_type: "homepage",
          page_path: pathname || "/",
        });
      }
    };
  }, [pathname]);

  useEffect(() => {
    if (
      !serverState.submittedAt ||
      lastHandledServerStateRef.current === serverState.submittedAt
    ) {
      return;
    }

    lastHandledServerStateRef.current = serverState.submittedAt;
    applyServerActionState();
  }, [serverState.submittedAt]);

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setDirtySinceServer(true);
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitMessage(null);

    if (
      field === "message" &&
      autoPrefilledMessage !== null &&
      value !== autoPrefilledMessage
    ) {
      markMessageUserEdited();
    }
  }

  function handleFocus(fieldName: FormFieldName) {
    lastFocusedFieldRef.current = fieldName;

    if (!hasTrackedStartRef.current) {
      hasTrackedStartRef.current = true;
      startedAtRef.current = performance.now();
      trackEvent("form_start", {
        page_type: "homepage",
        page_path: pathname || "/",
      });
    }

    trackEvent("form_field_focus", {
      field_name: fieldName,
      page_type: "homepage",
      page_path: pathname || "/",
    });
  }

  function handleInputFocus(
    event: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const fieldName = event.currentTarget.dataset.fieldName as
      | FormFieldName
      | undefined;
    if (fieldName) {
      handleFocus(fieldName);
    }
  }

  function handleMessageChange(event: ChangeEvent<HTMLTextAreaElement>) {
    updateField("message", event.currentTarget.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (isPending) {
      event.preventDefault();
      return;
    }

    if (shouldRenderCaptcha && formToken) {
      const captchaToken = formRef.current
        ?.querySelector<HTMLInputElement>("input[name='cf-turnstile-response']")
        ?.value;

      if (!captchaToken?.trim()) {
        event.preventDefault();
        setDirtySinceServer(true);
        setSubmitMessage("Vui lòng hoàn tất captcha trước khi gửi thông tin.");
        trackEvent("form_error", {
          error_code: "captcha_required",
          page_type: "homepage",
          page_path: pathname || "/",
        });
        return;
      }
    }

    const clientErrors = validateLeadFields({
      name: values.name,
      phone: values.phone,
      level: values.level,
      court: values.court,
      time_slot: values.time_slot,
      message: values.message,
    });

    setErrors(clientErrors);

    if (Object.keys(clientErrors).length > 0) {
      event.preventDefault();
      setDirtySinceServer(true);
      setSubmitMessage("Vui lòng kiểm tra lại thông tin trước khi gửi.");

      for (const [fieldName, errorMessage] of Object.entries(clientErrors)) {
        trackEvent("form_error", {
          field_name: fieldName as FormFieldName,
          error_code: errorMessage ?? "validation_error",
          page_type: "homepage",
          page_path: pathname || "/",
        });
      }

      return;
    }

    setDirtySinceServer(false);
    setSubmitMessage(null);
  }

  return (
    <div className="contact-form-shell">
      <div className="contact-form-shell__header">
        <p className="contact-form-shell__eyebrow">
          {businessMode ? "Chế độ doanh nghiệp" : "Đăng ký nhanh"}
        </p>
        <h3 className="contact-form-shell__title">{businessHeading}</h3>
        <p className="contact-form-shell__subtitle">
          Điền thông tin cần thiết. Lịch học, sân tập và lời nhắn sẽ được lưu sẵn
          khi bạn chọn từ lịch.
        </p>
      </div>

      {submitState === "success" ? (
        <div className="contact-form__success" role="status" aria-live="polite">
          <strong>Cảm ơn bạn đã để lại thông tin.</strong>
          <p>{submitMessage}</p>
          <a
            href={`https://zalo.me/${contactSettings.zaloNumber}`}
            className="btn btn--outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nhắn Zalo tư vấn
          </a>
        </div>
      ) : (
        <form
          id="contact-form"
          className="contact-form"
          noValidate
          action={formAction}
          onSubmit={handleSubmit}
          aria-busy={isPending}
          ref={formRef}
        >
          <input type="hidden" name="landing_page" value={pathname || "/"} />
          <input type="hidden" name="_form_token" value={formToken} readOnly />

          <div className="contact-form__grid">
            <label className="contact-form__field">
              <span className="contact-form__label">Họ tên *</span>
              <input
                data-field-name="name"
                name="name"
                type="text"
                value={values.name}
                onChange={(event) => updateField("name", event.currentTarget.value)}
                onFocus={handleInputFocus}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-error-name" : undefined}
                placeholder="Nhập họ tên"
                disabled={isPending}
              />
              {errors.name && (
                <span id="contact-error-name" className="contact-form__error">
                  {errors.name}
                </span>
              )}
            </label>

            <label className="contact-form__field">
              <span className="contact-form__label">Số điện thoại *</span>
              <input
                data-field-name="phone"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={(event) => updateField("phone", event.currentTarget.value)}
                onFocus={handleInputFocus}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "contact-error-phone" : undefined}
                placeholder="0907 911 886"
                disabled={isPending}
              />
              {errors.phone && (
                <span id="contact-error-phone" className="contact-form__error">
                  {errors.phone}
                </span>
              )}
            </label>
          </div>

          <details
            className="contact-form__optional"
            open={optionalOpen}
            onToggle={(event) =>
              setOptionalOpen((event.currentTarget as HTMLDetailsElement).open)
            }
            data-optional-fields="true"
          >
            <summary>Bổ sung mục tiêu học và khung giờ mong muốn</summary>

            <div className="contact-form__optional-grid">
              <label className="contact-form__field">
                <span className="contact-form__label">Trình độ</span>
                <select
                  data-field-name="level"
                  name="level"
                  value={values.level}
                  onChange={(event) =>
                    updateField("level", event.currentTarget.value as FormValues["level"])
                  }
                  onFocus={handleInputFocus}
                  disabled={isPending}
                >
                  <option value="">Chọn trình độ</option>
                  {LEVEL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {!businessMode && (
                <>
                  <label className="contact-form__field">
                    <span className="contact-form__label">Sân tập</span>
                    <select
                      data-field-name="court"
                      name="court"
                      value={values.court}
                      onChange={(event) =>
                        updateField(
                          "court",
                          event.currentTarget.value as FormValues["court"],
                        )
                      }
                      onFocus={handleInputFocus}
                      disabled={isPending}
                    >
                      <option value="">Chọn sân tập</option>
                      {courtOptions.map((court) => (
                        <option key={court.value} value={court.value}>
                          {court.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="contact-form__field">
                    <span className="contact-form__label">Khung giờ</span>
                    <select
                      data-field-name="time_slot"
                      name="time_slot"
                      value={values.time_slot}
                      onChange={(event) =>
                        updateField(
                          "time_slot",
                          event.currentTarget.value as FormValues["time_slot"],
                        )
                      }
                      onFocus={handleInputFocus}
                      disabled={isPending}
                    >
                      <option value="">Chọn khung giờ</option>
                      {timeSlotOptions.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              )}
            </div>
          </details>

          <label className="contact-form__field">
            <span className="contact-form__label">
              {businessMode ? "Nhu cầu doanh nghiệp" : "Lời nhắn"}
            </span>
            <textarea
              data-field-name="message"
              name="message"
              rows={5}
              value={values.message}
              onChange={handleMessageChange}
              onFocus={handleInputFocus}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "contact-error-message" : undefined}
              placeholder={
                businessMode
                  ? "Mô tả số lượng người, mục tiêu và ngân sách dự kiến"
                  : "Bạn muốn học vào khung giờ nào, ở khu vực nào?"
              }
              disabled={isPending}
            />
            {errors.message && (
              <span id="contact-error-message" className="contact-form__error">
                {errors.message}
              </span>
            )}
          </label>

          <input
            name="_gotcha"
            type="text"
            value={values._gotcha}
            onChange={(event) => updateField("_gotcha", event.currentTarget.value)}
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            className="contact-form__honeypot"
          />

          {shouldRenderCaptcha ? (
            <>
              <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                strategy="afterInteractive"
              />
              <div
                className="contact-form__captcha"
                data-turnstile-container="true"
              >
                <div
                  className="cf-turnstile"
                  data-sitekey={turnstileSiteKey}
                  data-theme="dark"
                />
              </div>
              <p className="contact-form__captcha-note">
                {formToken
                  ? "Hoàn tất captcha để gửi form bằng luồng JS an toàn."
                  : "Đang khởi tạo lớp bảo vệ. Nếu token chưa sẵn sàng, form sẽ rơi sang luồng dự phòng."}
              </p>
            </>
          ) : null}

          {submitMessage && (
            <p
              className={`contact-form__status contact-form__status--${submitState}`}
              role="status"
              aria-live="polite"
            >
              {submitMessage}
            </p>
          )}

          <div className="contact-form__actions">
            <button
              type="submit"
              className="btn btn--primary btn--lg"
              disabled={isPending}
            >
              {isPending ? "Đang gửi..." : "Gửi thông tin"}
            </button>
            <p className="contact-form__hint">
              Bạn có thể để trống các trường tùy chọn. V2 sẽ gọi lại để chốt lịch
              phù hợp.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
