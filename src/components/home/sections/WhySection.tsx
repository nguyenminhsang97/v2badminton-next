import { HOME_SECTION_IDS } from "@/lib/anchors";
import { ArrowRightIcon, CalendarIcon, MapPinIcon, UsersIcon } from "@/components/ui/BrandIcons";

const DIFFERENTIATORS = [
  {
    title: "Rõ từng bước",
    description: "Biết rõ buổi này sửa gì, buổi sau tiến tiếp ở đâu.",
    icon: CalendarIcon,
  },
  {
    title: "Nhóm nhỏ dễ theo",
    description: "HLV có thời gian quan sát, chỉnh lỗi và giữ nhịp cho từng người.",
    icon: UsersIcon,
  },
  {
    title: "4 sân thuận tiện",
    description: "Ưu tiên sân gần nhà hoặc chỗ làm để đi học thuận hơn mỗi tuần.",
    icon: MapPinIcon,
  },
  {
    title: "Khung giờ linh hoạt",
    description: "Sáng, tối và cuối tuần đều có lựa chọn theo từng nhóm.",
    icon: ArrowRightIcon,
  },
] as const;

export function WhySection() {
  return (
    <section className="section why-section" id={HOME_SECTION_IDS.why}>
      <div className="why-section__layout">
        <div className="section__header section__header--left why-section__header">
          <p className="section__eyebrow">Tại sao chọn V2</p>
          <h2 className="section__title">Nền tảng bài bản nhưng vẫn dễ theo</h2>
          <p className="section__desc">
            Mỗi buổi học có mục tiêu rõ, nhóm nhỏ và khung giờ đủ linh hoạt để theo đều.
          </p>
        </div>

        <div className="why-section__proof">
          <article className="why-section__stat">
            <span className="why-section__stat-value">2-6</span>
            <div className="why-section__stat-copy">
              <strong className="why-section__stat-title">học viên mỗi nhóm</strong>
              <p>HLV có đủ thời gian quan sát và chỉnh kỹ thuật ngay trên sân.</p>
            </div>
          </article>

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
