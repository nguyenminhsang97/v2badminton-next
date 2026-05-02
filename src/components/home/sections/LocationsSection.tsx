import { LocationsGrid } from "@/components/blocks/LocationsGrid";
import { HOME_SECTION_IDS } from "@/lib/anchors";
import type { HomepageLocationsSectionProps } from "./sectionProps";

export function LocationsSection({
  locations,
}: HomepageLocationsSectionProps) {
  return (
    <section className="section locations-section" id={HOME_SECTION_IDS.locations}>
      <div className="section__header">
        <p className="section__eyebrow">4 sân đang hoạt động</p>
        <h2 className="section__title">Chọn sân gần bạn trước</h2>
        <p className="section__desc">
          4 sân tại Bình Thạnh và Thủ Đức, chọn sân gần nhà hoặc chỗ làm.
        </p>
      </div>

      <div className="locations-cluster">
        <LocationsGrid
          locations={locations}
          showSupportCard={false}
          variant="summary"
        />
      </div>
    </section>
  );
}
