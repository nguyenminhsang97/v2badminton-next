"use client";

import { PlayIcon, PhoneIcon } from "@/components/ui/BrandIcons";
import type { SiteChromeSettings } from "@/components/layout/siteSettings";
import { HOME_SECTION_IDS, toHash } from "@/lib/anchors";
import { trackEvent } from "@/lib/tracking";

type QuickContactCardProps = {
  contactSettings: SiteChromeSettings;
};

export function QuickContactCard({ contactSettings }: QuickContactCardProps) {
  return (
    <aside className="quick-contact-card">
      <span className="quick-contact-card__icon" aria-hidden="true">
        <PlayIcon className="quick-contact-card__icon-svg" />
      </span>
      <h3 className="quick-contact-card__title">Thử ngay - Miễn phí</h3>
      <p className="quick-contact-card__copy">
        Đăng ký một buổi học thử để V2 gợi ý sân, khung giờ và lộ trình phù hợp nhất.
      </p>

      <div className="quick-contact-card__actions">
        <a
          href={toHash(HOME_SECTION_IDS.contact)}
          className="btn btn--primary btn--lg"
          onClick={() =>
            trackEvent("cta_click", {
              cta_name: "dang_ky_hoc_thu",
              cta_location: "locations_quick_contact",
              page_type: "homepage",
              page_path: "/",
            })
          }
        >
          Đăng ký học thử miễn phí
        </a>

        <a
          href={`tel:${contactSettings.phoneE164}`}
          className="quick-contact-card__secondary"
          onClick={() =>
            trackEvent("contact_click", {
              method: "phone",
              page_type: "homepage",
              page_path: "/",
            })
          }
        >
          <PhoneIcon className="quick-contact-card__secondary-icon" />
          Gọi tư vấn: {contactSettings.phoneDisplay}
        </a>
      </div>

      <p className="quick-contact-card__note">Phản hồi trong ngày làm việc.</p>
    </aside>
  );
}
