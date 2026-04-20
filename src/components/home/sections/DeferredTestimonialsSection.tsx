"use client";

import dynamic from "next/dynamic";
import { HomepageDeferredSectionSkeleton } from "./HomepageDeferredSectionSkeleton";
import type { HomepageTestimonialsSectionProps } from "./sectionProps";

const LazyTestimonialsSection = dynamic<HomepageTestimonialsSectionProps>(
  () =>
    import("./TestimonialsSection").then(
      (module) => module.TestimonialsSection,
    ),
  {
    ssr: true,
    loading: () => (
      <HomepageDeferredSectionSkeleton variant="testimonials" />
    ),
  },
);

export function DeferredTestimonialsSection(
  props: HomepageTestimonialsSectionProps,
) {
  return <LazyTestimonialsSection {...props} />;
}
