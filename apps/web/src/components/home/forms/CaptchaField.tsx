"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

type CaptchaFieldProps = {
  shouldRenderCaptcha: boolean;
  formToken: string;
  turnstileSiteKey: string;
};

const TURNSTILE_DOMAIN_NOT_AUTHORIZED = "110200";

declare global {
  interface Window {
    onV2TurnstileError?: (errorCode: string) => boolean;
  }
}

if (
  typeof window !== "undefined" &&
  typeof window.onV2TurnstileError !== "function"
) {
  window.onV2TurnstileError = (errorCode: string) => {
    console.warn("Turnstile widget error", { errorCode });
    return true;
  };
}

export function CaptchaField({
  shouldRenderCaptcha,
  formToken,
  turnstileSiteKey,
}: CaptchaFieldProps) {
  const [captchaErrorCode, setCaptchaErrorCode] = useState<string | null>(null);

  useEffect(() => {
    const handleTurnstileError = (errorCode: string) => {
      setCaptchaErrorCode(errorCode);
      console.warn("Turnstile widget error", { errorCode });
      return true;
    };

    window.onV2TurnstileError = handleTurnstileError;

    return () => {
      if (window.onV2TurnstileError === handleTurnstileError) {
        delete window.onV2TurnstileError;
      }
    };
  }, []);

  if (!shouldRenderCaptcha) {
    return null;
  }

  const captchaNote =
    captchaErrorCode === TURNSTILE_DOMAIN_NOT_AUTHORIZED
      ? "Captcha chưa sẵn sàng trên tên miền hiện tại. Vui lòng mở trang bằng domain chính thức."
      : captchaErrorCode
        ? "Captcha đang gặp lỗi tạm thời. Vui lòng tải lại trang hoặc thử lại sau."
        : formToken
          ? "Hoàn tất captcha để gửi form bằng luồng JS an toàn."
          : "Đang khởi tạo lớp bảo vệ. Nếu token chưa sẵn sàng, form sẽ rơi sang luồng dự phòng.";

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div className="contact-form__captcha" data-turnstile-container="true">
        <div
          className="cf-turnstile"
          data-sitekey={turnstileSiteKey}
          data-theme="dark"
          data-error-callback="onV2TurnstileError"
        />
      </div>
      <p className="contact-form__captcha-note">{captchaNote}</p>
    </>
  );
}
