"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import type { HomepageTestimonialsSectionProps } from "./sectionProps";
import { useDeferredSectionHydration } from "./useDeferredSectionHydration";

type TestimonialsComponent = ComponentType<HomepageTestimonialsSectionProps>;

type DeferredTestimonialsHydrationBoundaryProps =
  HomepageTestimonialsSectionProps & {
    children: ReactNode;
  };

export function DeferredTestimonialsHydrationBoundary({
  children,
  testimonials,
}: DeferredTestimonialsHydrationBoundaryProps) {
  const { boundaryRef, hydrateNow, shouldHydrate } =
    useDeferredSectionHydration();
  const [HydratedTestimonials, setHydratedTestimonials] =
    useState<TestimonialsComponent | null>(null);

  useEffect(() => {
    if (!shouldHydrate || HydratedTestimonials) {
      return;
    }

    let isCancelled = false;

    void import("./TestimonialsSection").then((module) => {
      if (!isCancelled) {
        setHydratedTestimonials(() => module.TestimonialsSection);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [HydratedTestimonials, shouldHydrate]);

  return (
    <div
      ref={boundaryRef}
      className="testimonials-section-boundary"
      onFocusCapture={hydrateNow}
      onPointerEnter={hydrateNow}
    >
      {HydratedTestimonials ? (
        <HydratedTestimonials testimonials={testimonials} />
      ) : (
        children
      )}
    </div>
  );
}
