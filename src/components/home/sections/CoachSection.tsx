import Link from "next/link";
import { CoachCardsGrid, getUsableCoaches } from "@/components/coaches/CoachCardsGrid";
import type { HomepageCoachSectionProps } from "./sectionProps";

export function CoachSection({ coaches }: HomepageCoachSectionProps) {
  const resolvedCoaches = getUsableCoaches(coaches);

  if (resolvedCoaches.length === 0) {
    return null;
  }

  return (
    <section className="section coach-section" id="hlv">
      <div className="section__header">
        <p className="section__eyebrow">HLV đồng hành</p>
        <h2 className="section__title">Đội ngũ theo sát từng nhóm học viên</h2>
        <p className="section__desc">
          Mỗi HLV giữ một vai trò rõ ràng để buổi học bám đúng trình độ, mục tiêu và
          nhịp tiến bộ của từng nhóm.
        </p>
      </div>

      <CoachCardsGrid coaches={resolvedCoaches} />

      <div className="coach-section__footer">
        <Link href="/huan-luyen-vien/" className="coach-section__link">
          Xem toàn bộ đội ngũ →
        </Link>
      </div>
    </section>
  );
}
