"use client";

import { siteConfig } from "@/lib/site";
import { trackEvent } from "@/lib/tracking";
import { ContactForm } from "./ContactForm";
import { HomepageScrollCoordinator } from "./HomepageScrollCoordinator";
import type { HomeContactSettings } from "./contactSettings";
import type { HomepageContactSectionProps } from "./sectionProps";

/**
 * S2-A8: Contact section wrapper.
 * Contains direct contact CTAs (phone, Zalo, Facebook) alongside the form.
 * Contact section MUST NOT be reduced to only a form.
 */

const FALLBACK_CONTACT_SETTINGS: HomeContactSettings = {
  siteName: siteConfig.name,
  phoneDisplay: siteConfig.phoneDisplay,
  phoneE164: siteConfig.phoneE164,
  zaloNumber: siteConfig.zaloNumber,
  facebookUrl: siteConfig.facebookUrl,
};

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
        <h2 className="section__title">Lien he</h2>
        <p className="section__subtitle">
          Dang ky hoc thu hoac lien he truc tiep voi V2 Badminton.
        </p>
      </div>

      <div className="contact-section__body">
        <ContactForm
          contactSettings={contactSettings}
          locations={locations}
          scheduleBlocks={scheduleBlocks}
        />

        <aside className="contact-direct">
          <h3 className="contact-direct__title">Lien he truc tiep</h3>
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
              <span className="contact-direct__label">Goi dien</span>
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
