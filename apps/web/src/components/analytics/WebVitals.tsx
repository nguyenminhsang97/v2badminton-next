"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackEvent } from "@/lib/tracking";
import type { WebVitalName, WebVitalRating } from "@/lib/tracking";

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0];

const WEB_VITAL_NAMES: ReadonlySet<string> = new Set<WebVitalName>([
  "LCP",
  "CLS",
  "INP",
  "FCP",
  "TTFB",
  "FID",
]);

/**
 * GA4 aggregates integers only. CLS is a unitless ratio in the 0–1 range, so it
 * would round to 0 and every page would look perfect; x1000 keeps its
 * resolution. Everything else is already milliseconds.
 */
export function toGa4Value(name: WebVitalName, value: number): number {
  return Math.round(name === "CLS" ? value * 1000 : value);
}

/** Exported for tests — the hook emits Next's own timings on the same channel. */
export function isWebVitalMetric(name: string): boolean {
  return WEB_VITAL_NAMES.has(name);
}

/**
 * Declared at module scope on purpose. `useReportWebVitals` replays every
 * metric collected so far to any *new* callback reference it is handed, so a
 * callback re-created each render would report the same metric repeatedly and
 * inflate the numbers. See node_modules/next/dist/docs — "ensure that the
 * callback function reference does not change".
 */
const reportWebVital: ReportWebVitalsCallback = (metric) => {
  // The hook also emits Next's own timings (Next.js-hydration, -render,
  // -route-change-to-render). Those carry no `rating` and are not Web Vitals,
  // so they would pollute the same event. Report only the real ones.
  if (!WEB_VITAL_NAMES.has(metric.name)) {
    return;
  }

  const name = metric.name as WebVitalName;
  const rating = (metric as { rating?: WebVitalRating }).rating;
  if (!rating) {
    return;
  }

  trackEvent("web_vitals", {
    metric_name: name,
    value: toGa4Value(name, metric.value),
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_rating: rating,
    metric_id: metric.id,
    navigation_type: metric.navigationType,
    page_path:
      typeof window === "undefined" ? undefined : window.location.pathname,
    non_interaction: true,
  });
};

/**
 * Reports Core Web Vitals from real visitors into the existing GA4 property.
 *
 * Until this shipped the site had no field-performance data at all: GA4 was
 * installed and firing, but nothing fed it vitals, so every perf decision was
 * made on synthetic lab runs. See tickets/S12-FIELD-CWV-MONITOR.md.
 */
export function WebVitals() {
  useReportWebVitals(reportWebVital);
  return null;
}
