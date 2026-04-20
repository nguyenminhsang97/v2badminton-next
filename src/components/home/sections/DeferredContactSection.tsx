"use client";

import dynamic from "next/dynamic";
import { HomepageDeferredSectionSkeleton } from "./HomepageDeferredSectionSkeleton";
import type { HomepageContactSectionProps } from "./sectionProps";

const LazyContactSection = dynamic<HomepageContactSectionProps>(
  () =>
    import("./HomepageContactSection").then(
      (module) => module.HomepageContactSection,
    ),
  {
    ssr: true,
    loading: () => <HomepageDeferredSectionSkeleton variant="contact" />,
  },
);

export function DeferredContactSection(props: HomepageContactSectionProps) {
  return <LazyContactSection {...props} />;
}
