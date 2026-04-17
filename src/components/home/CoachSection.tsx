import Image from "next/image";
import { CheckBadgeIcon, StarIcon } from "@/components/ui/BrandIcons";
import type { HomepageCoachSectionProps } from "./sectionProps";

const FALLBACK_COACH_IMAGES = [
  "/images/course-basic.webp",
  "/images/course-advanced.webp",
  "/images/course-enterprise.webp",
] as const;

const COACH_CREDENTIALS = [
  ["Kèm sát buổi đầu", "Nhóm nhỏ 2-6 người", "Phụ huynh dễ theo dõi"],
  ["Nâng trình thực chiến", "Sửa lỗi theo video", "Lộ trình rõ theo tuần"],
  ["Lịch linh hoạt", "Cá nhân hóa mục tiêu", "Phù hợp người bận rộn"],
] as const;

const COACH_SUMMARY = [
  "Hơn 180 buổi hướng dẫn mỗi quý",
  "4.9/5 từ học viên theo lớp",
  "Lộ trình rõ cho từng nhóm trình độ",
] as const;

const FALLBACK_COACHES = [
  {
    id: "fallback-coach-kids",
    name: "HLV Minh An",
    teachingGroup: "Phụ trách lớp trẻ em",
    approach:
      "Đi từng bước, giữ buổi học vui nhưng vẫn sửa đúng nền tảng để học viên nhỏ tuổi theo được ngay từ buổi đầu.",
    photoUrl: null,
    photoAlt: "Huấn luyện viên V2 đồng hành cùng lớp trẻ em",
    order: 90,
  },
  {
    id: "fallback-coach-working",
    name: "HLV Quốc Hưng",
    teachingGroup: "Phụ trách lớp tối & người đi làm",
    approach:
      "Giữ buổi học gọn, rõ lỗi và dễ bám theo để người bận rộn vẫn thấy tiến bộ đều sau mỗi tuần.",
    photoUrl: null,
    photoAlt: "Huấn luyện viên V2 đồng hành cùng lớp người đi làm",
    order: 91,
  },
  {
    id: "fallback-coach-private",
    name: "HLV Anh Tú",
    teachingGroup: "Phụ trách 1 kèm 1",
    approach:
      "Tập trung vào lỗi hiện tại và mục tiêu cá nhân để rút ngắn thời gian chỉnh kỹ thuật và giữ nhịp luyện tập bền hơn.",
    photoUrl: null,
    photoAlt: "Huấn luyện viên V2 đồng hành cùng lớp 1 kèm 1",
    order: 92,
  },
] satisfies HomepageCoachSectionProps["coaches"];

export function CoachSection({ coaches }: HomepageCoachSectionProps) {
  const resolvedCoaches = [...coaches];

  while (resolvedCoaches.length < 3) {
    resolvedCoaches.push(FALLBACK_COACHES[resolvedCoaches.length]);
  }

  return (
    <section className="section coach-section" id="hlv">
      <div className="section__header">
        <p className="section__eyebrow">Đội ngũ huấn luyện viên</p>
        <h2 className="section__title">Người đồng hành cùng từng bước tiến bộ</h2>
        <p className="section__desc">
          Mỗi HLV ở V2 không chỉ đứng sân để thị phạm. Vai trò chính là nhìn đúng lỗi,
          chia nhỏ kỹ thuật và giữ cho học viên thấy tự tin khi quay lại buổi sau.
        </p>
      </div>

      <div className="coach-grid coach-grid--figma">
        {resolvedCoaches.slice(0, 3).map((coach, index) => {
          const fallbackImage =
            FALLBACK_COACH_IMAGES[index % FALLBACK_COACH_IMAGES.length];
          const photoSrc = coach.photoUrl ?? fallbackImage;
          const photoAlt = coach.photoAlt ?? `${coach.name} tại V2 Badminton`;
          const credentials =
            COACH_CREDENTIALS[index % COACH_CREDENTIALS.length];
          const summary = COACH_SUMMARY[index % COACH_SUMMARY.length];

          return (
            <article key={coach.id} className="coach-card coach-card--figma">
              <div className="coach-card__photo-wrap">
                <Image
                  src={photoSrc}
                  alt={photoAlt}
                  className="coach-card__photo"
                  fill
                  sizes="(max-width: 959px) 100vw, 33vw"
                />
                <div className="coach-card__photo-overlay" />
                <div className="coach-card__photo-copy">
                  <p className="coach-card__badge">HLV phụ trách</p>
                  <h3 className="coach-card__name">{coach.name}</h3>
                  <span className="coach-card__group">{coach.teachingGroup}</span>
                </div>
              </div>

              <div className="coach-card__body">
                <div className="coach-card__meta">
                  {credentials.map((credential) => (
                    <span key={credential} className="coach-card__credential">
                      <CheckBadgeIcon className="coach-card__credential-icon" />
                      {credential}
                    </span>
                  ))}
                </div>

                <blockquote className="coach-card__quote">
                  <span className="coach-card__quote-mark" aria-hidden="true">
                    “
                  </span>
                  <span>{coach.approach}</span>
                </blockquote>

                <footer className="coach-card__footer">
                  <div className="coach-card__stars" aria-label="Đánh giá 5 sao">
                    <StarIcon className="coach-card__star" />
                    <StarIcon className="coach-card__star" />
                    <StarIcon className="coach-card__star" />
                    <StarIcon className="coach-card__star" />
                    <StarIcon className="coach-card__star" />
                  </div>
                  <span className="coach-card__summary">{summary}</span>
                </footer>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
