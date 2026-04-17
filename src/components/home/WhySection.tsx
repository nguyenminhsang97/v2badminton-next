import Image from "next/image";
import { ArrowRightIcon, CalendarIcon, MapPinIcon, UsersIcon } from "@/components/ui/BrandIcons";

const DIFFERENTIATORS = [
  {
    title: "Giáo trình rõ bước",
    description:
      "Mỗi buổi đều có mục tiêu rõ, từ cầm vợt và di chuyển tới kiểm soát nhịp đánh.",
    icon: CalendarIcon,
  },
  {
    title: "Nhóm nhỏ dễ theo",
    description:
      "Lớp 2-6 người hoặc 1 kèm 1 để HLV chỉnh trực tiếp, không bị bỏ quên giữa buổi.",
    icon: UsersIcon,
  },
  {
    title: "4 sân thuận tiện",
    description:
      "Phủ Bình Thạnh và Thủ Đức để phụ huynh hoặc người đi làm dễ giữ lịch đều hằng tuần.",
    icon: MapPinIcon,
  },
  {
    title: "Khung giờ linh hoạt",
    description:
      "Sáng, tối và cuối tuần đều có lựa chọn phù hợp với từng nhóm học viên.",
    icon: ArrowRightIcon,
  },
] as const;

export function WhySection() {
  return (
    <section className="section why-section" id="gioi-thieu">
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
              Nhịp lớp được giữ vừa phải để HLV còn đủ thời gian quan sát và chỉnh kỹ thuật ngay
              trên sân.
            </p>
          </article>
        </div>

        <div className="why-section__copy">
          <div className="section__header section__header--left">
            <p className="section__eyebrow">Vì sao nhiều người chọn V2</p>
            <h2 className="section__title">Nền tảng bài bản nhưng vẫn gần gũi và dễ theo</h2>
            <p className="section__desc">
              Điều quan trọng không phải buổi học thật khó, mà là ai cũng hiểu mình đang sửa gì và
              tiến bộ dần theo từng tuần.
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
