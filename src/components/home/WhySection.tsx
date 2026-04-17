import Image from "next/image";
import { ArrowRightIcon, CalendarIcon, MapPinIcon, UsersIcon } from "@/components/ui/BrandIcons";

const DIFFERENTIATORS = [
  {
    title: "Giáo trình rõ bước",
    description:
      "Từng buổi đều có mục tiêu cụ thể, từ cầm vợt, di chuyển chân tới kiểm soát nhịp đánh.",
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
      "Sáng, tối, cuối tuần đều có lựa chọn phù hợp với trẻ em, người lớn và lớp cá nhân hóa.",
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
            <span className="why-section__stat-value">98%</span>
            <strong className="why-section__stat-title">
              học viên và phụ huynh hài lòng sau buổi đầu
            </strong>
            <p className="why-section__stat-copy">
              Cảm giác dễ theo, rõ lộ trình và được chỉnh đúng lỗi sớm là điều khiến phần lớn học
              viên tiếp tục ở lại cùng V2.
            </p>
          </article>
        </div>

        <div className="why-section__copy">
          <div className="section__header section__header--left">
            <p className="section__eyebrow">Vì sao nhiều người chọn V2</p>
            <h2 className="section__title">Nền tảng bài bản nhưng vẫn gần gũi và dễ theo</h2>
            <p className="section__desc">
              V2 không cố làm buổi học phức tạp. Mục tiêu là giúp người mới, trẻ em và người bận
              rộn nhìn thấy tiến bộ rõ ràng ngay từ những tuần đầu tiên.
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
