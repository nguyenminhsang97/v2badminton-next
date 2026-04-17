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
  "Kèm sát từ buổi đầu để sửa nền tảng",
  "Giữ nhịp sửa lỗi rõ trong từng buổi",
  "Phù hợp người bận rộn cần lịch đều",
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
        <p className="section__eyebrow">Ai sẽ đồng hành cùng bạn</p>
        <h2 className="section__title">HLV theo sát từng nhóm trình độ, không dạy kiểu đại trà</h2>
        <p className="section__desc">
          Mỗi HLV ở V2 giữ một vai trò rõ ràng: người kèm trẻ em, người giữ nhịp cho lớp tối,
          hoặc người phụ trách lộ trình 1 kèm 1. Cách dạy được chia theo đối tượng chứ không gom
          tất cả vào một khuôn.
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
