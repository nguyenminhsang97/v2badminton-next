"use client";

import { useEffect } from "react";
import { registerDelegatedTracking, registerGlobalTracker } from "@/lib/tracking";

export function TrackingBootstrap() {
  useEffect(() => {
    registerGlobalTracker();
    return registerDelegatedTracking();
  }, []);

  return null;
}
