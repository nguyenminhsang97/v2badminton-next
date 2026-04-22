"use client";

import type { ComponentType, ReactNode } from "react";
import type { HomepageScheduleSectionProps } from "./sectionProps";
import { IdleHydrationBoundary } from "./IdleHydrationBoundary";

type ScheduleComponent = ComponentType<HomepageScheduleSectionProps>;
type ScheduleSectionModule = typeof import("./ScheduleSection");

type DeferredScheduleHydrationBoundaryProps = HomepageScheduleSectionProps & {
  children: ReactNode;
};

let hydratedScheduleModulePromise: Promise<ScheduleSectionModule> | null = null;

function loadScheduleSection(): Promise<ScheduleComponent> {
  hydratedScheduleModulePromise ??= import("./ScheduleSection");

  return hydratedScheduleModulePromise.then((module) => module.ScheduleSection);
}

export function DeferredScheduleHydrationBoundary({
  children,
  scheduleBlocks,
}: DeferredScheduleHydrationBoundaryProps) {
  return (
    <IdleHydrationBoundary
      componentProps={{ scheduleBlocks }}
      loader={loadScheduleSection}
      timeoutMs={1200}
    >
      {children}
    </IdleHydrationBoundary>
  );
}
