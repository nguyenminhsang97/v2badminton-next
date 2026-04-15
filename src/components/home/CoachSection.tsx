import Image from "next/image";
import type { HomepageCoachSectionProps } from "./sectionProps";

export function CoachSection({ coaches }: HomepageCoachSectionProps) {
  if (coaches.length === 0) {
    return null;
  }

  return (
    <section className="section" id="hlv">
      <div className="section__header">
        <p className="section__eyebrow">Đội ngũ huấn luyện viên</p>
        <h2 className="section__title">HLV V2 BADMINTON</h2>
        <p className="section__desc">
          Đồng hành cùng bạn từ những buổi đầu làm quen đến giai đoạn nâng
          trình, với lộ trình rõ ràng và cách hướng dẫn sát từng học viên.
        </p>
      </div>
      <div className="coach-grid">
        {coaches.map((coach) => (
          <article key={coach.id} className="coach-card">
            {coach.photoUrl ? (
              <div className="coach-card__photo-wrap">
                <Image
                  src={coach.photoUrl}
                  alt={coach.photoAlt ?? coach.name}
                  className="coach-card__photo"
                  width={720}
                  height={900}
                  sizes="(max-width: 959px) 100vw, 33vw"
                />
              </div>
            ) : (
              <div className="coach-card__photo coach-card__photo--placeholder" />
            )}
            <div className="coach-card__body">
              <p className="coach-card__badge">HLV phụ trách</p>
              <h3 className="coach-card__name">{coach.name}</h3>
              <div className="coach-card__meta">
                <span className="coach-card__group">{coach.teachingGroup}</span>
                <span className="coach-card__rating">4.9 ★ phản hồi tốt</span>
              </div>
              <blockquote className="coach-card__quote">
                “{coach.approach}”
              </blockquote>
              <p className="coach-card__approach">{coach.approach}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
