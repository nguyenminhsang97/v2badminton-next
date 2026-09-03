import Link from "next/link";
import { CoachCardsGrid, getUsableCoaches } from "@/components/coaches/CoachCardsGrid";
import { HOME_SECTION_IDS } from "@/lib/anchors";
import type { HomepageCoachSectionProps } from "./sectionProps";

export function CoachSection({ coaches, content }: HomepageCoachSectionProps) {
  const resolvedCoaches = getUsableCoaches(coaches);

  if (resolvedCoaches.length === 0) {
    return null;
  }

  const eyebrow = content?.eyebrow ?? "HLV đồng hành";
  const title = content?.title ?? "Đội ngũ đồng hành từng nhóm học viên";
  // description is null today (no desc in component); only render if CMS provides one
  const description = content?.description ?? null;

  return (
    <section className="section coach-section" id={HOME_SECTION_IDS.coaches}>
      <div className="section__header">
        <p className="section__eyebrow">{eyebrow}</p>
        <h2 className="section__title">{title}</h2>
        {description ? <p className="section__desc">{description}</p> : null}
      </div>

      <CoachCardsGrid coaches={resolvedCoaches} variant="compact" />

      <div className="coach-section__footer">
        <Link href="/huan-luyen-vien/" className="coach-section__link">
          Xem toàn bộ đội ngũ →
        </Link>
      </div>
    </section>
  );
}
