import { LocationsGrid } from "@/components/blocks/LocationsGrid";
import type { HomepageLocationsSectionProps } from "./sectionProps";

export function LocationsSection({ locations }: HomepageLocationsSectionProps) {
  return (
    <section className="section" id="dia-diem">
      <div className="section__header">
        <p className="section__eyebrow">4 sân đang hoạt động</p>
        <h2 className="section__title">ĐỊA ĐIỂM TẬP</h2>
        <p className="section__desc">
          Phủ sóng Bình Thạnh và Thủ Đức. Chọn sân gần nhà hoặc gần nơi làm việc,
          rồi đi tiếp vào form để V2 xếp lịch phù hợp.
        </p>
      </div>
      <LocationsGrid locations={locations} />
    </section>
  );
}
