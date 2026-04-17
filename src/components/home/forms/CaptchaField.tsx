"use client";

import Script from "next/script";

type CaptchaFieldProps = {
  shouldRenderCaptcha: boolean;
  formToken: string;
  turnstileSiteKey: string;
};

export function CaptchaField({
  shouldRenderCaptcha,
  formToken,
  turnstileSiteKey,
}: CaptchaFieldProps) {
  if (!shouldRenderCaptcha) {
    return null;
  }

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
        />
      </div>
      <p className="contact-form__captcha-note">
        {formToken
          ? "Hoàn tất captcha để gửi form bằng luồng JS an toàn."
          : "Đang khởi tạo lớp bảo vệ. Nếu token chưa sẵn sàng, form sẽ rơi sang luồng dự phòng."}
      </p>
    </>
  );
}
