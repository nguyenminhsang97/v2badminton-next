import Image from "next/image";
import { HOME_SECTION_IDS } from "@/lib/anchors";
import { ArrowRightIcon, CalendarIcon, MapPinIcon, UsersIcon } from "@/components/ui/BrandIcons";

const DIFFERENTIATORS = [
  {
    title: "Giáo trình rõ bước",
    description: "Biết rõ buổi này đang sửa gì, buổi sau cần tiến tiếp ở đâu.",
    icon: CalendarIcon,
  },
  {
    title: "Nhóm nhỏ dễ theo",
    description: "HLV có thời gian quan sát, chỉnh lỗi và giữ nhịp cho từng người.",
    icon: UsersIcon,
  },
  {
    title: "4 sân thuận tiện",
    description: "Ưu tiên Bình Thạnh và Thủ Đức để giữ lịch đều dễ hơn mỗi tuần.",
    icon: MapPinIcon,
  },
  {
    title: "Khung giờ linh hoạt",
    description: "Sáng, tối và cuối tuần đều có lựa chọn phù hợp cho từng nhóm.",
    icon: ArrowRightIcon,
  },
] as const;

export function WhySection() {
  return (
    <section className="section why-section" id={HOME_SECTION_IDS.why}>
      <div className="why-section__layout">
        <div className="why-section__visual">
          <div className="why-section__images">
            <div className="why-section__image-frame why-section__image-frame--large">
              <Image
                src="/images/course-basic.webp"
                alt="Huấn luyện viên đang hướng dẫn học viên nhỏ tuổi tập nền tảng"
                fill
                className="why-section__image"
                sizes="(max-width: 959px) 100vw, 28vw"
              />
            </div>
            <div className="why-section__image-frame why-section__image-frame--small">
              <Image
                src="/images/course-advanced.webp"
                alt="Nhóm học viên đang tập di chuyển và kiểm soát nhịp đánh"
                fill
                className="why-section__image"
                sizes="(max-width: 959px) 100vw, 22vw"
              />
            </div>
          </div>

          <article className="why-section__stat">
            <span className="why-section__stat-value">2-6</span>
            <strong className="why-section__stat-title">học viên mỗi nhóm để HLV kèm sát</strong>
            <p className="why-section__stat-copy">
              Nhịp lớp vừa phải để ai cũng được chỉnh kỹ thuật ngay trên sân.
            </p>
          </article>
        </div>

        <div className="why-section__copy">
          <div className="section__header section__header--left">
            <p className="section__eyebrow">Tại sao chọn V2</p>
            <h2 className="section__title">Nền tảng bài bản nhưng vẫn dễ theo</h2>
            <p className="section__desc">
              Mục tiêu của V2 là để mỗi buổi học đều rõ ràng, gần gũi và đủ nhịp để
              bạn tiến bộ đều.
            </p>
          </div>

          <div className="why-grid">
            {DIFFERENTIATORS.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="why-card">
                  <span className="why-card__icon">
                    <Icon className="why-card__icon-svg" />
                  </span>
                  <div className="why-card__content">
                    <h3 className="why-card__title">{item.title}</h3>
                    <p className="why-card__desc">{item.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
