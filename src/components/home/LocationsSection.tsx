import { LocationsGrid } from "@/components/blocks/LocationsGrid";
import type { HomepageLocationsSectionProps } from "./sectionProps";

export function LocationsSection({ locations }: HomepageLocationsSectionProps) {
  return (
    <section className="section locations-section" id="dia-diem">
      <div className="section__header">
        <p className="section__eyebrow">4 sân đang hoạt động</p>
        <h2 className="section__title">Chọn sân gần nhà để bắt đầu dễ hơn</h2>
        <p className="section__desc">
          Phủ sóng Bình Thạnh và Thủ Đức. Chọn sân gần nhà hoặc gần nơi làm việc trước, rồi mình
          chốt câu hỏi cuối cùng ở form ngay bên dưới.
        </p>
      </div>
      <LocationsGrid locations={locations} showSupportCard={false} />
    </section>
  );
}
