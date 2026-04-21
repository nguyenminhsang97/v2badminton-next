import { DeferredTestimonialsHydrationBoundary } from "./DeferredTestimonialsHydrationBoundary";
import type { HomepageTestimonialsSectionProps } from "./sectionProps";
import { StaticTestimonialsSection } from "./StaticTestimonialsSection";

export function DeferredTestimonialsSection(
  props: HomepageTestimonialsSectionProps,
) {
  return (
    <DeferredTestimonialsHydrationBoundary {...props}>
      <StaticTestimonialsSection {...props} />
    </DeferredTestimonialsHydrationBoundary>
  );
}
