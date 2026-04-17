"use client";

import { siteConfig } from "@/lib/site";
import { trackEvent } from "@/lib/tracking";
import { ContactForm } from "./ContactForm";
import { HomepageScrollCoordinator } from "./HomepageScrollCoordinator";
import type { HomeContactSettings } from "./contactSettings";
import type { HomepageContactSectionProps } from "./sectionProps";

const FALLBACK_CONTACT_SETTINGS: HomeContactSettings = {
  siteName: siteConfig.name,
  phoneDisplay: siteConfig.phoneDisplay,
  phoneE164: siteConfig.phoneE164,
  zaloNumber: siteConfig.zaloNumber,
  facebookUrl: siteConfig.facebookUrl,
};

const CONTACT_PROOF_POINTS = [
  "Phản hồi trong ngày",
  "Gợi ý sân & lịch phù hợp",
] as const;

export function ContactSection({
  siteSettings,
  locations,
  scheduleBlocks,
}: HomepageContactSectionProps) {
  const contactSettings: HomeContactSettings =
    siteSettings === null
      ? FALLBACK_CONTACT_SETTINGS
      : {
          siteName: siteSettings.siteName,
          phoneDisplay: siteSettings.phoneDisplay,
          phoneE164: siteSettings.phoneE164,
          zaloNumber: siteSettings.zaloNumber,
          facebookUrl: siteSettings.facebookUrl,
        };

  return (
    <section className="section contact-section" id="lien-he">
      <HomepageScrollCoordinator />

      <div className="section__header">
        <p className="section__eyebrow">Đăng ký & tư vấn</p>
        <h2 className="section__title">LIÊN HỆ</h2>
        <p className="section__subtitle">
          Để lại thông tin một lần để V2 gọi lại đúng lịch, đúng sân và đúng nhu cầu bạn đã chọn ở
          các phần bên trên.
        </p>
      </div>

      <div className="contact-section__body">
        <ContactForm
          contactSettings={contactSettings}
          locations={locations}
          scheduleBlocks={scheduleBlocks}
        />

        <aside className="contact-direct">
          <div className="contact-direct__header">
            <h3 className="contact-direct__title">Nếu cần chốt nhanh hơn</h3>
            <p className="contact-direct__intro">
              Muốn chốt nhanh sân, lịch học hoặc hỏi riêng về lộ trình? Gọi, nhắn Zalo hoặc
              Facebook đều được.
            </p>
          </div>

          <div className="contact-direct__badges">
            {CONTACT_PROOF_POINTS.map((point) => (
              <span key={point} className="contact-direct__badge">
                {point}
              </span>
            ))}
          </div>

          <div className="contact-direct__channels">
            <a
              href={`tel:${contactSettings.phoneE164}`}
              className="contact-direct__link"
              onClick={() =>
                trackEvent("contact_click", {
                  method: "phone",
                  page_type: "homepage",
                  page_path: "/",
                })
              }
            >
              <span className="contact-direct__label">Gọi điện</span>
              <span className="contact-direct__value">
                {contactSettings.phoneDisplay}
              </span>
            </a>
            <a
              href={`https://zalo.me/${contactSettings.zaloNumber}`}
              className="contact-direct__link"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("contact_click", {
                  method: "zalo",
                  page_type: "homepage",
                  page_path: "/",
                })
              }
            >
              <span className="contact-direct__label">Zalo</span>
              <span className="contact-direct__value">
                {contactSettings.zaloNumber}
              </span>
            </a>
            <a
              href={contactSettings.facebookUrl}
              className="contact-direct__link"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("contact_click", {
                  method: "messenger",
                  page_type: "homepage",
                  page_path: "/",
                })
              }
            >
              <span className="contact-direct__label">Facebook</span>
              <span className="contact-direct__value">
                {contactSettings.siteName}
              </span>
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
