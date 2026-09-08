import { describe, expect, it } from "vitest";
import { isWebVitalMetric, toGa4Value } from "../WebVitals";

describe("toGa4Value", () => {
  it("scales CLS by 1000 so it survives GA4 integer rounding", () => {
    // The whole point: a real-world CLS of 0.08 must not arrive as 0, which
    // would make every page look perfect and hide genuine layout shift.
    expect(toGa4Value("CLS", 0.08)).toBe(80);
    expect(toGa4Value("CLS", 0.253)).toBe(253);
    expect(toGa4Value("CLS", 0.0004)).toBe(0);
  });

  it("keeps the 0.1 good/needs-improvement boundary distinguishable", () => {
    expect(toGa4Value("CLS", 0.099)).toBe(99);
    expect(toGa4Value("CLS", 0.1)).toBe(100);
    expect(toGa4Value("CLS", 0.101)).toBe(101);
  });

  it("rounds millisecond metrics without scaling them", () => {
    expect(toGa4Value("LCP", 4012.7)).toBe(4013);
    expect(toGa4Value("INP", 199.4)).toBe(199);
    expect(toGa4Value("TTFB", 506)).toBe(506);
    expect(toGa4Value("FCP", 0)).toBe(0);
  });
});

describe("isWebVitalMetric", () => {
  it("accepts the Core Web Vitals", () => {
    for (const name of ["LCP", "CLS", "INP", "FCP", "TTFB", "FID"]) {
      expect(isWebVitalMetric(name)).toBe(true);
    }
  });

  it("rejects the Next.js timings that share the same callback", () => {
    // useReportWebVitals also emits these; they carry no rating and would
    // otherwise be reported as if they were Web Vitals.
    for (const name of [
      "Next.js-hydration",
      "Next.js-route-change-to-render",
      "Next.js-render",
    ]) {
      expect(isWebVitalMetric(name)).toBe(false);
    }
  });
});
