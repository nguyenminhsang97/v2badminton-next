"use client";

import dynamic from "next/dynamic";
import { HomepageDeferredSectionSkeleton } from "./HomepageDeferredSectionSkeleton";
import type { HomepageScheduleSectionProps } from "./sectionProps";

const LazyScheduleSection = dynamic<HomepageScheduleSectionProps>(
  () => import("./ScheduleSection").then((module) => module.ScheduleSection),
  {
    ssr: true,
    loading: () => <HomepageDeferredSectionSkeleton variant="schedule" />,
  },
);

export function DeferredScheduleSection(props: HomepageScheduleSectionProps) {
  return <LazyScheduleSection {...props} />;
}
