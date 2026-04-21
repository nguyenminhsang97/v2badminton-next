"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import type { HomepageScheduleSectionProps } from "./sectionProps";
import { useDeferredSectionHydration } from "./useDeferredSectionHydration";

type ScheduleComponent = ComponentType<HomepageScheduleSectionProps>;

type DeferredScheduleHydrationBoundaryProps = HomepageScheduleSectionProps & {
  children: ReactNode;
};

export function DeferredScheduleHydrationBoundary({
  children,
  scheduleBlocks,
}: DeferredScheduleHydrationBoundaryProps) {
  const { boundaryRef, hydrateNow, shouldHydrate } =
    useDeferredSectionHydration();
  const [HydratedSchedule, setHydratedSchedule] =
    useState<ScheduleComponent | null>(null);

  useEffect(() => {
    if (!shouldHydrate || HydratedSchedule) {
      return;
    }

    let isCancelled = false;

    void import("./ScheduleSection").then((module) => {
      if (!isCancelled) {
        setHydratedSchedule(() => module.ScheduleSection);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [HydratedSchedule, shouldHydrate]);

  return (
    <div
      ref={boundaryRef}
      onFocusCapture={hydrateNow}
      onPointerEnter={hydrateNow}
    >
      {HydratedSchedule ? (
        <HydratedSchedule scheduleBlocks={scheduleBlocks} />
      ) : (
        children
      )}
    </div>
  );
}
