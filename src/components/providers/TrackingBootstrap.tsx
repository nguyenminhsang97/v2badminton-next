"use client";

import { useEffect } from "react";
import { registerGlobalTracker } from "@/lib/tracking";

export function TrackingBootstrap() {
  useEffect(() => {
    registerGlobalTracker();
  }, []);

  return null;
}
