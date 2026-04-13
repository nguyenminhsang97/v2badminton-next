"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useHomepageConversion } from "./HomepageConversionProvider";

export function HomepageBusinessModeInitializer() {
  const searchParams = useSearchParams();
  const { enterBusinessMode } = useHomepageConversion();
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
