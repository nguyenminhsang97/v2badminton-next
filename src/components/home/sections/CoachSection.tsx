import Link from "next/link";
import { CoachCardsGrid, getUsableCoaches } from "@/components/coaches/CoachCardsGrid";
import { HOME_SECTION_IDS } from "@/lib/anchors";
import type { HomepageCoachSectionProps } from "./sectionProps";

export function CoachSection({ coaches }: HomepageCoachSectionProps) {
  const resolvedCoaches = getUsableCoaches(coaches);

  if (resolvedCoaches.length === 0) {
    return null;
  }

  return (
    <section className="section coach-section" id={HOME_SECTION_IDS.coaches}>
      <div className="section__header">
        <p className="section__eyebrow">HLV đồng hành</p>
        <h2 className="section__title">Đội ngũ theo sát từng nhóm học viên</h2>
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
