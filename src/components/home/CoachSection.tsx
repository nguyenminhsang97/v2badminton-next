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
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coach.photoUrl}
                alt={coach.photoAlt ?? coach.name}
                className="coach-card__photo"
                width={120}
                height={120}
                loading="lazy"
              />
            ) : (
              <div className="coach-card__photo coach-card__photo--placeholder" />
            )}
            <div className="coach-card__body">
              <h3 className="coach-card__name">{coach.name}</h3>
              <p className="coach-card__group">{coach.teachingGroup}</p>
              <p className="coach-card__approach">{coach.approach}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
