"use client";

import { HOME_SECTION_IDS } from "@/lib/anchors";
import { HomepageScrollCoordinator } from "../conversion/HomepageScrollCoordinator";
import { ContactForm } from "../forms/ContactForm";
import { ContactFormErrorBoundary } from "../forms/ContactFormErrorBoundary";
import type { HomepageContactSectionProps } from "./sectionProps";

export function HomepageContactSection({
  siteSettings,
  locations,
  scheduleBlocks,
}: HomepageContactSectionProps) {
  return (
    <ContactFormErrorBoundary>
      <section className="section contact-section" id={HOME_SECTION_IDS.contact}>
        <HomepageScrollCoordinator />
        <ContactForm
          contactSettings={siteSettings}
          locations={locations}
          scheduleBlocks={scheduleBlocks}
        />
      </section>
    </ContactFormErrorBoundary>
  );
}
