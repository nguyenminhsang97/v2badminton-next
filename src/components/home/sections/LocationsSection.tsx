import { LocationsGrid } from "@/components/blocks/LocationsGrid";
import { QuickContactCard } from "./QuickContactCard";
import type { HomepageLocationsSectionProps } from "./sectionProps";

export function LocationsSection({
  locations,
  siteSettings,
}: HomepageLocationsSectionProps) {
  return (
    <section className="section locations-section" id="dia-diem">
      <div className="section__header">
        <p className="section__eyebrow">4 sân đang hoạt động</p>
        <h2 className="section__title">Chọn sân gần bạn trước</h2>
        <p className="section__desc">
          Ưu tiên khu vực gần nhà hoặc gần chỗ làm để giữ lịch đều hơn mỗi tuần.
        </p>
      </div>

      <div className="locations-cluster">
        <LocationsGrid locations={locations} showSupportCard={false} />
        <QuickContactCard contactSettings={siteSettings} />
      </div>
    </section>
  );
}
