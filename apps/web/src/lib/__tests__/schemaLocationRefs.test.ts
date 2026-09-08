import { describe, expect, it } from "vitest";
import {
  buildCoursePageSchema,
  buildCourseSchemas,
  buildHomepageLocalBusinessSchema,
} from "@/lib/schema";
import type {
  SanityLocation,
  SanityPricingTier,
  SanityScheduleBlock,
} from "@/lib/sanity";
import { siteConfig } from "@/lib/site";

const contact = {
  phoneE164: "+84900000000",
  facebookUrl: "https://www.facebook.com/v2badmintonhcm/",
};

const locations: SanityLocation[] = [
  {
    id: "loc-hue-thien",
    slug: "hue-thien",
    name: "San cau long Hue Thien",
    shortName: "Hue Thien",
    district: "binh_thanh",
    districtLabel: "Binh Thanh",
    localPage: "/lop-cau-long-binh-thanh/",
    addressText: "12 Dinh Bo Linh",
    mapsUrl: "https://maps.example/hue-thien",
    imageUrl: "/images/locations/hue-thien.webp",
    imageAlt: "San Hue Thien",
    geoLat: 10.8,
    geoLng: 106.7,
    order: 1,
  },
  {
    id: "loc-thu-duc",
    slug: "thu-duc-arena",
    name: "San cau long Thu Duc Arena",
    shortName: "Thu Duc Arena",
    district: "thu_duc",
    districtLabel: "Thu Duc",
    localPage: "/lop-cau-long-thu-duc/",
    addressText: "88 Vo Van Ngan",
    mapsUrl: "https://maps.example/thu-duc",
    imageUrl: null,
    imageAlt: null,
    geoLat: 10.85,
    geoLng: 106.75,
    order: 2,
  },
];

const pricingTiers: SanityPricingTier[] = [
  {
    id: "tier-basic",
    slug: "nhom-2-buoi",
    name: "Lop nhom co ban",
    shortLabel: "Co ban",
    description: "Hai buoi moi tuan.",
    kind: "group",
    billingModel: "monthly_package",
    displayPrice: "1.000.000 d",
    features: [],
    ctaLabel: "Dang ky",
    ctaAction: "scroll_to_form",
    order: 1,
    groupSize: "6-8 hoc vien",
    pricePerMonth: 1_000_000,
    sessionsPerWeek: 2,
    sessionsPerMonth: 8,
    pricePerHour: null,
  },
  {
    id: "tier-advanced",
    slug: "nhom-3-buoi",
    name: "Lop nhom nang cao",
    shortLabel: "Nang cao",
    description: "Ba buoi moi tuan.",
    kind: "group",
    billingModel: "monthly_package",
    displayPrice: "1.500.000 d",
    features: [],
    ctaLabel: "Dang ky",
    ctaAction: "scroll_to_form",
    order: 2,
    groupSize: "6-8 hoc vien",
    pricePerMonth: 1_500_000,
    sessionsPerWeek: 3,
    sessionsPerMonth: 12,
    pricePerHour: null,
  },
];

const scheduleBlocks: SanityScheduleBlock[] = [
  {
    id: "sb-1",
    slug: "hue-thien-t2-t4",
    locationId: "loc-hue-thien",
    locationName: "San cau long Hue Thien",
    locationShortName: "Hue Thien",
    locationDistrict: "binh_thanh",
    dayGroup: "T2 – T4",
    timeLabel: "18:00 – 20:00",
    timeSlotId: "evening",
    levels: ["co_ban"],
    order: 1,
  },
  {
    id: "sb-2",
    slug: "thu-duc-t7-cn",
    locationId: "loc-thu-duc",
    locationName: "San cau long Thu Duc Arena",
    locationShortName: "Thu Duc Arena",
    locationDistrict: "thu_duc",
    dayGroup: "T7 – CN",
    timeLabel: "07:00 – 09:00",
    timeSlotId: "morning",
    levels: ["co_ban", "nang_cao"],
    order: 2,
  },
];

/** Every `@id` a schema block points at, without the nodes that define one. */
function referencedIds(schema: unknown): string[] {
  const found: string[] = [];
  const walk = (node: unknown) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node === null || typeof node !== "object") return;
    const record = node as Record<string, unknown>;
    const id = record["@id"];
    // A node carrying @type defines itself; one carrying only @id refers out.
    if (typeof id === "string" && record["@type"] === undefined) {
      found.push(id);
    }
    Object.values(record).forEach(walk);
  };
  walk(schema);
  return found;
}

/** Every `@id` a schema block defines (i.e. declares with a @type alongside). */
function definedIds(schema: unknown): string[] {
  const found: string[] = [];
  const walk = (node: unknown) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node === null || typeof node !== "object") return;
    const record = node as Record<string, unknown>;
    const id = record["@id"];
    if (typeof id === "string" && record["@type"] !== undefined) {
      found.push(id);
    }
    Object.values(record).forEach(walk);
  };
  walk(schema);
  return found;
}

describe("course schema location references (S10)", () => {
  it("repeats full location nodes when the caller does not opt in", () => {
    const [course] = buildCourseSchemas(pricingTiers, {
      locations,
      scheduleBlocks,
    });

    const instance = (
      course as unknown as {
        hasCourseInstance: Array<{ location: Array<Record<string, unknown>> }>;
      }
    ).hasCourseInstance[0];

    expect(instance.location).toHaveLength(locations.length);
    for (const node of instance.location) {
      expect(node["@type"]).toBe("SportsActivityLocation");
      expect(node.address).toBeTruthy();
    }
  });

  it("emits bare @id references when the caller opts in", () => {
    const [course] = buildCourseSchemas(pricingTiers, {
      locations,
      scheduleBlocks,
      locationsDefinedOnPage: true,
    });

    const instance = (
      course as unknown as {
        hasCourseInstance: Array<{ location: Array<Record<string, unknown>> }>;
      }
    ).hasCourseInstance[0];

    expect(instance.location).toEqual([
      { "@id": `${siteConfig.siteUrl}/#location-hue-thien` },
      { "@id": `${siteConfig.siteUrl}/#location-thu-duc-arena` },
    ]);
  });

  // The guard that matters: an @id pointing at a node no block on the page
  // defines is a dangling reference, and worse for SEO than the duplication
  // this optimisation removes. See tickets/S10-HOMEPAGE-HTML-SIZE.md, option 3.
  it("resolves every referenced @id against the homepage business schema", () => {
    const business = buildHomepageLocalBusinessSchema(
      locations,
      pricingTiers,
      scheduleBlocks,
      contact,
    );
    const courses = buildCourseSchemas(pricingTiers, {
      locations,
      scheduleBlocks,
      locationsDefinedOnPage: true,
    });

    const defined = new Set(definedIds([business, ...courses]));
    const referenced = referencedIds(courses);

    expect(referenced.length).toBeGreaterThan(0);
    for (const id of referenced) {
      expect(defined).toContain(id);
    }
  });

  it("resolves referenced @ids on a money page too", () => {
    const business = buildHomepageLocalBusinessSchema(
      locations,
      pricingTiers,
      scheduleBlocks,
      contact,
    );
    const course = buildCoursePageSchema(
      "/lop-cau-long-cuoi-tuan/",
      "Lop cau long cuoi tuan",
      "Lop cuoi tuan tai TP.HCM.",
      { locations, pricingTiers, scheduleBlocks, locationsDefinedOnPage: true },
    );

    const defined = new Set(definedIds([business, course]));
    const referenced = referencedIds(course);

    expect(referenced.length).toBeGreaterThan(0);
    for (const id of referenced) {
      expect(defined).toContain(id);
    }
  });

  it("keeps the location payload smaller than the inlined form", () => {
    const inlined = JSON.stringify(
      buildCourseSchemas(pricingTiers, { locations, scheduleBlocks }),
    );
    const referenced = JSON.stringify(
      buildCourseSchemas(pricingTiers, {
        locations,
        scheduleBlocks,
        locationsDefinedOnPage: true,
      }),
    );

    expect(referenced.length).toBeLessThan(inlined.length);
  });
});
