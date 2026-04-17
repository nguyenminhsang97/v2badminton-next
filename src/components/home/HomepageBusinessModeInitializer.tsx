"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useHomepageBusinessMode } from "./HomepageConversionProvider";

export function HomepageBusinessModeInitializer() {
  const searchParams = useSearchParams();
  const { enterBusinessMode } = useHomepageBusinessMode();
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

    if (searchParams.get("mode") !== "business") {
      return;
    }

    hasInitializedRef.current = true;
    enterBusinessMode();
  }, [enterBusinessMode, searchParams]);

  return null;
}
