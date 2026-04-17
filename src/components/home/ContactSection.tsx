import { ContactForm } from "./ContactForm";
import { HomepageScrollCoordinator } from "./HomepageScrollCoordinator";
import { resolveHomeContactSettings } from "./contactSettings";
import type { HomepageContactSectionProps } from "./sectionProps";

export function ContactSection({
  siteSettings,
  locations,
  scheduleBlocks,
}: HomepageContactSectionProps) {
  const contactSettings = resolveHomeContactSettings(siteSettings);

  return (
    <section className="section contact-section" id="lien-he">
      <HomepageScrollCoordinator />
      <ContactForm
        contactSettings={contactSettings}
        locations={locations}
        scheduleBlocks={scheduleBlocks}
      />
    </section>
  );
}
