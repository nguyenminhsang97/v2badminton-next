"use client";

import { useEffect, useRef, useState } from "react";

export function useDeferredSectionHydration(rootMargin = "400px 0px") {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const [shouldHydrate, setShouldHydrate] = useState(false);

  useEffect(() => {
    if (shouldHydrate) {
      return;
    }

    const boundary = boundaryRef.current;
    if (!boundary) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      const fallbackTimer = setTimeout(() => setShouldHydrate(true), 1500);
      return () => clearTimeout(fallbackTimer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldHydrate(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(boundary);

    return () => observer.disconnect();
  }, [rootMargin, shouldHydrate]);

  function hydrateNow() {
    setShouldHydrate(true);
  }

  return { boundaryRef, hydrateNow, shouldHydrate };
}
