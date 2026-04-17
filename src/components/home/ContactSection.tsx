import { ContactForm } from "./ContactForm";
import { HomepageScrollCoordinator } from "./HomepageScrollCoordinator";
import type { HomepageContactSectionProps } from "./sectionProps";

export function ContactSection({
  siteSettings,
  locations,
  scheduleBlocks,
}: HomepageContactSectionProps) {
  return (
    <section className="section contact-section" id="lien-he">
      <HomepageScrollCoordinator />
      <ContactForm
        contactSettings={siteSettings}
        locations={locations}
        scheduleBlocks={scheduleBlocks}
      />
    </section>
  );
}
