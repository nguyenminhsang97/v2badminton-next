"use client";

import type { SiteChromeSettings } from "@/components/layout/siteSettings";
import { trackEvent } from "@/lib/tracking";

type FloatingCtaProps = {
  siteSettings: SiteChromeSettings;
};

export function FloatingCta({ siteSettings }: FloatingCtaProps) {
  return (
    <nav className="floating-cta" aria-label="Liên hệ nhanh">
      <a
        href={`tel:${siteSettings.phoneE164}`}
        className="floating-cta__button floating-cta__button--phone"
        onClick={() =>
          trackEvent("cta_click", {
            cta_name: "dang_ky_ngay",
            cta_location: "floating_cta:phone",
            page_path: typeof window !== "undefined" ? window.location.pathname : "/",
          })
        }
      >
        <span className="floating-cta__label">Gọi ngay</span>
        <strong className="floating-cta__value">{siteSettings.phoneDisplay}</strong>
      </a>

      <a
        href={`https://zalo.me/${siteSettings.zaloNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-cta__button floating-cta__button--zalo"
        onClick={() =>
          trackEvent("cta_click", {
            cta_name: "nhan_zalo_tu_van",
            cta_location: "floating_cta:zalo",
            page_path: typeof window !== "undefined" ? window.location.pathname : "/",
          })
        }
      >
        <span className="floating-cta__label">Tư vấn Zalo</span>
        <strong className="floating-cta__value">Nhắn V2</strong>
      </a>
    </nav>
  );
}
