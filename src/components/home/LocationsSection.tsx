import { LocationsGrid } from "@/components/blocks/LocationsGrid";
import type { HomepageLocationsSectionProps } from "./sectionProps";

export function LocationsSection({ locations }: HomepageLocationsSectionProps) {
  return (
    <section className="section locations-section" id="dia-diem">
      <div className="section__header">
        <p className="section__eyebrow">4 sân đang hoạt động</p>
        <h2 className="section__title">Chọn sân gần nhà để bắt đầu dễ hơn</h2>
        <p className="section__desc">
          Ưu tiên chọn sân gần nhà hoặc gần nơi làm việc trước. Khi khu vực đã rõ, phần đăng ký bên
          dưới sẽ dễ chốt lịch phù hợp hơn nhiều.
        </p>
      </div>
      <LocationsGrid locations={locations} showSupportCard={false} />
    </section>
  );
}
