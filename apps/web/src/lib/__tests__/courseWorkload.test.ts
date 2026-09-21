import { describe, expect, it } from "vitest";
import { buildCoursePageSchema, buildCourseSchemas } from "@/lib/schema";
import type {
  SanityLocation,
  SanityPricingTier,
  SanityScheduleBlock,
} from "@/lib/sanity";

/**
 * T4 in docs/tasks-in-progress.md. The owner's ruling (2026-09-17): a group
 * class is 120 minutes, and structured data states only that standard session
 * even though the schedule holds real 90- and 60-minute custom slots.
 */

const location: SanityLocation = {
  id: "location.hue_thien",
  slug: "hue_thien",
  name: "Sân Huệ Thiên",
  shortName: "Huệ Thiên",
  district: "binh_thanh",
  districtLabel: "Bình Thạnh",
  localPage: "/lop-cau-long-binh-thanh/",
  addressText: "Bình Thạnh, TP.HCM",
  mapsUrl: "https://maps.example/hue-thien",
  imageUrl: null,
  imageAlt: null,
  geoLat: 10.8,
  geoLng: 106.7,
  order: 1,
};

function block(id: string, dayGroup: string, timeLabel: string): SanityScheduleBlock {
  return {
    id,
    slug: id,
    locationId: location.id,
    locationName: location.name,
    locationShortName: location.shortName,
    locationDistrict: location.district,
    dayGroup,
    timeLabel,
    timeSlotId: id,
    levels: ["co_ban"],
    order: 1,
  };
}

/** A standard evening class, plus the two kinds of custom slot the ruling excludes. */
const scheduleBlocks: SanityScheduleBlock[] = [
  block("evening-120", "T2 – T4 – T6", "18:00 – 20:00"),
  block("custom-90", "T3 – T5 – T7", "14:00 – 15:30"),
  block("custom-60", "T7 – CN", "17:00 – 18:00"),
];

const groupTier: SanityPricingTier = {
  id: "pricingTier.group-basic-2x",
  slug: "group-basic-2x",
  name: "2 buổi / tuần",
  shortLabel: "2 buổi / tuần",
  description: "",
  kind: "group",
  billingModel: "monthly_package",
  displayPrice: "1.000.000 VNĐ / tháng",
  features: [],
  ctaLabel: "Đăng ký học thử",
  ctaAction: "dang_ky_hoc_thu",
  order: 1,
  groupSize: "4-8 người",
  pricePerMonth: 1_000_000,
  sessionsPerWeek: 2,
  sessionsPerMonth: 8,
  pricePerHour: null,
};

const enterpriseTier: SanityPricingTier = {
  id: "pricingTier.enterprise",
  slug: "enterprise",
  name: "Doanh nghiệp",
  shortLabel: "Doanh nghiệp",
  description: "",
  kind: "enterprise",
  billingModel: "quote",
  displayPrice: "Giá thương lượng",
  features: [],
  ctaLabel: "Nhận báo giá",
  ctaAction: "nhan_bao_gia",
  order: 2,
  groupSize: null,
  pricePerMonth: null,
  sessionsPerWeek: null,
  sessionsPerMonth: null,
  pricePerHour: null,
};

type Instance = { courseWorkload?: string; courseSchedule?: unknown[] };

function instanceOf(course: unknown): Instance | undefined {
  return (course as { hasCourseInstance?: Instance[] }).hasCourseInstance?.[0];
}

function pageInstance(path: Parameters<typeof buildCoursePageSchema>[0]) {
  return instanceOf(
    buildCoursePageSchema(path, "Khóa học", "Mô tả.", {
      locations: [location],
      pricingTiers: [groupTier],
      scheduleBlocks,
    }),
  );
}

describe("courseWorkload", () => {
  it("states the standard 120-minute session for a group course, not the custom range", () => {
    expect(pageInstance("/lop-cau-long-tre-em/")?.courseWorkload).toBe(
      "2 hours per session",
    );
  });

  it("states no workload for 1 kèm 1, which is billed by the hour", () => {
    const instance = pageInstance("/hoc-cau-long-1-kem-1/");

    expect(instance).toBeDefined();
    expect(instance?.courseWorkload).toBeUndefined();
  });

  it("states no workload for enterprise courses", () => {
    expect(pageInstance("/cau-long-doanh-nghiep/")?.courseWorkload).toBeUndefined();

    const [, enterpriseCourse] = buildCourseSchemas([groupTier, enterpriseTier], {
      locations: [location],
      scheduleBlocks,
    });
    expect(instanceOf(enterpriseCourse)?.courseWorkload).toBeUndefined();
  });

  it("gives every group tier on the homepage the standard session", () => {
    const [groupCourse] = buildCourseSchemas([groupTier], {
      locations: [location],
      scheduleBlocks,
    });

    expect(instanceOf(groupCourse)?.courseWorkload).toBe("2 hours per session");
  });

  it("still states nothing when there are no sessions to describe", () => {
    const instance = instanceOf(
      buildCoursePageSchema("/lop-cau-long-tre-em/", "Khóa học", "Mô tả.", {
        locations: [location],
        pricingTiers: [groupTier],
        scheduleBlocks: [],
      }),
    );

    expect(instance?.courseWorkload).toBeUndefined();
  });

  it("leaves courseSchedule alone — the custom slots are real classes", () => {
    const schedule = JSON.stringify(pageInstance("/lop-cau-long-tre-em/")?.courseSchedule);

    expect(schedule).toContain("14:00");
    expect(schedule).toContain("17:00");
  });
});
