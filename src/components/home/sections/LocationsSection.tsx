import { LocationsGrid } from "@/components/blocks/LocationsGrid";
import { HOME_SECTION_IDS } from "@/lib/anchors";
import { QuickContactCard } from "./QuickContactCard";
import type { HomepageLocationsSectionProps } from "./sectionProps";

export function LocationsSection({
  locations,
  siteSettings,
}: HomepageLocationsSectionProps) {
  return (
    <section className="section locations-section" id={HOME_SECTION_IDS.locations}>
      <div className="section__header">
        <p className="section__eyebrow">4 sân đang hoạt động</p>
        <h2 className="section__title">Chọn sân gần bạn trước</h2>
      </div>

      <div className="locations-cluster">
        <LocationsGrid locations={locations} showSupportCard={false} />
        <QuickContactCard contactSettings={siteSettings} />
      </div>
    </section>
  );
}
