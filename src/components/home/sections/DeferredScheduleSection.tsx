import { DeferredScheduleHydrationBoundary } from "./DeferredScheduleHydrationBoundary";
import type { HomepageScheduleSectionProps } from "./sectionProps";
import { StaticScheduleSection } from "./StaticScheduleSection";

export function DeferredScheduleSection(props: HomepageScheduleSectionProps) {
  return (
    <DeferredScheduleHydrationBoundary {...props}>
      <StaticScheduleSection {...props} />
    </DeferredScheduleHydrationBoundary>
  );
}
