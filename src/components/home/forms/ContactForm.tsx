"use client";

import { useActionState, useMemo, type FocusEvent, type FormEvent, type HTMLInputTypeAttribute } from "react";
import { usePathname } from "next/navigation";
import { submitLead } from "@/app/actions/submitLead";
import type { FormFieldName } from "@/lib/tracking";
import { trackEvent } from "@/lib/tracking";
import { validateLeadFields } from "@/lib/validation/lead";
import {
  useHomepageBusinessMode,
  useHomepageConversionIntent,
} from "../conversion/HomepageConversionProvider";
import {
  buildLegacyCourtOptions,
  buildLegacyTimeSlotOptions,
} from "../compat/legacyScheduleCompatibility";
import { CaptchaField } from "./CaptchaField";
import {
  ContactFormProps,
  type FormValues,
  INITIAL_SERVER_STATE,
  LEVEL_OPTIONS,
  turnstileSiteKey,
} from "./contactForm.shared";
import { useContactFormEffects } from "./useContactFormEffects";
import { useContactFormState } from "./useContactFormState";
import { useContactFormTracking } from "./useContactFormTracking";
import { useFormToken } from "./useFormToken";

type InputFieldProps = {
  label: string;
  name: string;
  fieldName: FormFieldName;
  type?: HTMLInputTypeAttribute;
  value: string;
  placeholder: string;
  disabled: boolean;
  error?: string;
  onChange: (value: string) => void;
  onFocus: (
    event: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
};

function ContactInputField({
  label,
  name,
  fieldName,
  type = "text",
  value,
  placeholder,
  disabled,
  error,
  onChange,
  onFocus,
}: InputFieldProps) {
  const errorId = error ? `contact-error-${fieldName}` : undefined;

  return (
    <label className="contact-form__field">
      <span className="contact-form__label">{label}</span>
      <input
        data-field-name={fieldName}
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        onFocus={onFocus}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error ? (
        <span id={errorId} className="contact-form__error">
          {error}
        </span>
      ) : null}
    </label>
  );
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
    markMessageUserEdited,
    setAutoPrefilledMessage,
  } = useHomepageConversionIntent();
  const { businessMode } = useHomepageBusinessMode();
  const [serverState, formAction, isPending] = useActionState(
    submitLead,
    INITIAL_SERVER_STATE,
  );

  const {
    values,
    setValues,
    errors,
    setErrors,
    optionalOpen,
    setOptionalOpen,
    submitMessage,
    setSubmitMessage,
    setDirtySinceServer,
    submitState,
    updateField,
    handleMessageChange,
  } = useContactFormState({
    serverState,
    isPending,
    autoPrefilledMessage,
    markMessageUserEdited,
  });

  const formToken = useFormToken();
  const shouldRenderCaptcha = Boolean(turnstileSiteKey);
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

  useContactFormEffects({
    selectedSchedulePrefill,
    autoPrefilledMessage,
    canAutoOverwriteMessage,
    businessMode,
    serverState,
    setAutoPrefilledMessage,
    setOptionalOpen,
    setDirtySinceServer,
    setValues,
    setErrors,
    setSubmitMessage,
  });

  const { handleFocus } = useContactFormTracking({
    pathname: pathname || "/",
    serverState,
    formToken,
    values,
    businessMode,
    setDirtySinceServer,
    setErrors,
    setSubmitMessage,
    setValues,
  });

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (isPending) {
      event.preventDefault();
      return;
    }

    if (shouldRenderCaptcha && formToken) {
      const captchaToken = event.currentTarget
        .querySelector<HTMLInputElement>("input[name='cf-turnstile-response']")
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
        <h2 className="contact-form-shell__title">{businessHeading}</h2>
        <p className="contact-form-shell__subtitle">
          Điền thông tin cần thiết. Lịch học, sân tập và lời nhắn sẽ được lưu
          sẵn khi bạn chọn từ lịch.
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
        >
          <input type="hidden" name="landing_page" value={pathname || "/"} />
          <input type="hidden" name="_form_token" value={formToken} readOnly />

          <div className="contact-form__grid">
            <ContactInputField
              label="Họ tên *"
              name="name"
              fieldName="name"
              value={values.name}
              placeholder="Nhập họ tên"
              disabled={isPending}
              error={errors.name}
              onChange={(value) => updateField("name", value)}
              onFocus={handleInputFocus}
            />

            <ContactInputField
              label="Số điện thoại *"
              name="phone"
              fieldName="phone"
              type="tel"
              value={values.phone}
              placeholder="0907 911 886"
              disabled={isPending}
              error={errors.phone}
              onChange={(value) => updateField("phone", value)}
              onFocus={handleInputFocus}
            />
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

              {!businessMode ? (
                <>
                  <label className="contact-form__field">
                    <span className="contact-form__label">Sân tập</span>
                    <select
                      data-field-name="court"
                      name="court"
                      value={values.court}
                      onChange={(event) =>
                        updateField("court", event.currentTarget.value as FormValues["court"])
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
              ) : null}
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
            {errors.message ? (
              <span id="contact-error-message" className="contact-form__error">
                {errors.message}
              </span>
            ) : null}
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

          <CaptchaField
            shouldRenderCaptcha={shouldRenderCaptcha}
            formToken={formToken}
            turnstileSiteKey={turnstileSiteKey}
          />

          {submitMessage ? (
            <p
              className={`contact-form__status contact-form__status--${submitState}`}
              role="status"
              aria-live="polite"
            >
              {submitMessage}
            </p>
          ) : null}

          <div className="contact-form__actions">
            <button
              type="submit"
              className="btn btn--primary btn--lg"
              disabled={isPending}
            >
              {isPending ? "Đang gửi..." : "Gửi thông tin"}
            </button>
            <p className="contact-form__hint">
              Bạn có thể để trống các trường tùy chọn. V2 sẽ gọi lại để chốt
              lịch phù hợp.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
