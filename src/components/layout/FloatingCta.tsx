"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { SiteChromeSettings } from "@/components/layout/siteSettings";
import { MessageCircleIcon, PhoneIcon } from "@/components/ui/BrandIcons";
import { trackEvent } from "@/lib/tracking";

type FloatingCtaProps = {
  siteSettings: SiteChromeSettings;
};

const SUPPRESS_FLOATING_CTA_SELECTOR =
  "[data-floating-cta-suppress], .hero, .contact-section, .site-footer";

export function FloatingCta({ siteSettings }: FloatingCtaProps) {
  const pathname = usePathname();
  const [isSuppressed, setIsSuppressed] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      return;
    }

    const suppressionTargets = Array.from(
      document.querySelectorAll<HTMLElement>(SUPPRESS_FLOATING_CTA_SELECTOR),
    );

    if (suppressionTargets.length === 0) {
      queueMicrotask(() => setIsSuppressed(false));
      return;
    }

    const visibleTargets = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleTargets.add(entry.target);
          } else {
            visibleTargets.delete(entry.target);
          }
        }

        setIsSuppressed(visibleTargets.size > 0);
      },
      {
        root: null,
        rootMargin: "0px 0px -96px 0px",
        threshold: 0,
      },
    );

    for (const target of suppressionTargets) {
      observer.observe(target);
    }

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <nav
      className={`floating-cta ${isSuppressed ? "floating-cta--suppressed" : ""}`}
      aria-label="Liên hệ nhanh"
      aria-hidden={isSuppressed}
    >
      <a
        href={`tel:${siteSettings.phoneE164}`}
        className="floating-cta__button floating-cta__button--phone"
        aria-label={`Gọi ${siteSettings.phoneDisplay}`}
        onClick={() =>
          trackEvent("cta_click", {
            cta_name: "dang_ky_ngay",
            cta_location: "floating_cta:phone",
            page_path: typeof window !== "undefined" ? window.location.pathname : "/",
          })
        }
      >
        <PhoneIcon className="floating-cta__icon" />
        <span className="floating-cta__copy">
          <span className="floating-cta__label">Gọi ngay</span>
          <strong className="floating-cta__value">{siteSettings.phoneDisplay}</strong>
        </span>
      </a>

      <a
        href={`https://zalo.me/${siteSettings.zaloNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-cta__button floating-cta__button--zalo"
        aria-label="Nhắn Zalo cho V2 Badminton"
        onClick={() =>
          trackEvent("cta_click", {
            cta_name: "nhan_zalo_tu_van",
            cta_location: "floating_cta:zalo",
            page_path: typeof window !== "undefined" ? window.location.pathname : "/",
          })
        }
      >
        <MessageCircleIcon className="floating-cta__icon" />
        <span className="floating-cta__copy">
          <span className="floating-cta__label">Tư vấn Zalo</span>
          <strong className="floating-cta__value">Nhắn V2</strong>
        </span>
      </a>
    </nav>
  );
}
