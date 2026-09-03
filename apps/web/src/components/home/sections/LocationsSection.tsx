import { LocationsGrid } from "@/components/blocks/LocationsGrid";
import { HOME_SECTION_IDS } from "@/lib/anchors";
import type { HomepageLocationsSectionProps } from "./sectionProps";

export function LocationsSection({
  locations,
  content,
}: HomepageLocationsSectionProps) {
  const eyebrow = content?.eyebrow ?? "4 sân đang hoạt động";
  const title = content?.title ?? "Chọn sân gần bạn trước";
  const description =
    content?.description ??
    "4 sân tại Bình Thạnh và Thủ Đức, chọn sân gần nhà hoặc chỗ làm.";

  return (
    <section className="section locations-section" id={HOME_SECTION_IDS.locations}>
      <div className="section__header">
        <p className="section__eyebrow">{eyebrow}</p>
        <h2 className="section__title">{title}</h2>
        <p className="section__desc">{description}</p>
      </div>

      <LocationsGrid
        locations={locations}
        showSupportCard={false}
        variant="summary"
      />
    </section>
  );
}
