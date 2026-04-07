"use client";

import { siteConfig } from "@/lib/site";
import { trackEvent } from "@/lib/tracking";
import { ContactForm } from "./ContactForm";
import { HomepageScrollCoordinator } from "./HomepageScrollCoordinator";

/**
 * S2-A8: Contact section wrapper.
 * Contains direct contact CTAs (phone, Zalo, Facebook) alongside the form.
 * The form itself (S2-C1) will be added inside this section in a later ticket.
 * Contact section MUST NOT be reduced to only a form.
 */
export function ContactSection() {
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
        <ContactForm />

        <aside className="contact-direct">
          <h3 className="contact-direct__title">Lien he truc tiep</h3>
          <div className="contact-direct__channels">
            <a
              href={`tel:${siteConfig.phoneE164}`}
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
                {siteConfig.phoneDisplay}
              </span>
            </a>
            <a
              href={`https://zalo.me/${siteConfig.zaloNumber}`}
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
                {siteConfig.zaloNumber}
              </span>
            </a>
            <a
              href={siteConfig.facebookUrl}
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
              <span className="contact-direct__value">V2 Badminton</span>
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
