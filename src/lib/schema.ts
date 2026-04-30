import type {
  SanityFaq,
  SanityLocation,
  SanityPricingTier,
  SanityScheduleBlock,
} from "@/lib/sanity";
import { canonicalUrl, type CoreRoutePath } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

type Thing = {
  "@type": string | readonly string[];
  [key: string]: unknown;
};

export type JsonLdNode = {
  "@context": "https://schema.org";
} & Thing;

type BreadcrumbItem = {
  name: string;
  item?: string;
};

type CourseSchemaTier = Extract<
  SanityPricingTier,
  { kind: "group" | "enterprise" }
>;

const siteFacebook = [siteConfig.facebookUrl];
const schemaDayUrlPrefix = "https://schema.org/";
const courseMode = "Offline";

const dayTokenMap = {
  T2: "Monday",
  T3: "Tuesday",
  T4: "Wednesday",
  T5: "Thursday",
  T6: "Friday",
  T7: "Saturday",
  CN: "Sunday",
} as const;

type SchemaDayName = (typeof dayTokenMap)[keyof typeof dayTokenMap];

type TimeRange = {
  opens: string;
  closes: string;
};

type CourseSchemaOptions = {
  locations?: readonly SanityLocation[];
  pricingTiers?: readonly SanityPricingTier[];
  scheduleBlocks?: readonly SanityScheduleBlock[];
};

type CourseListSchemaOptions = CourseSchemaOptions & {
  url?: string;
};

function buildPriceRange(tiers: readonly SanityPricingTier[]): string | null {
  const prices = tiers
    .map((tier) => {
      switch (tier.kind) {
        case "group":
          return tier.pricePerMonth;
        case "private":
          return tier.pricePerHour;
        case "enterprise":
          return null;
      }
    })
    .filter((price): price is number => price !== null);

  if (prices.length === 0) {
    return null;
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  const formatVnd = (value: number) =>
    `${new Intl.NumberFormat("vi-VN").format(value)} VNĐ`;

  return min === max
    ? formatVnd(min)
    : `${formatVnd(min)} – ${formatVnd(max)}`;
}

function buildPostalAddress(location: SanityLocation) {
  return {
    "@type": "PostalAddress",
    streetAddress: location.addressText,
    addressLocality: location.districtLabel,
    addressRegion: "Hồ Chí Minh",
    addressCountry: "VN",
  };
}

function buildGeoCoordinates(location: SanityLocation) {
  return {
    "@type": "GeoCoordinates",
    latitude: location.geoLat,
    longitude: location.geoLng,
  };
}

function buildEmbeddedSportsLocation(location: SanityLocation) {
  return {
    "@type": "SportsActivityLocation",
    name: location.name,
    address: buildPostalAddress(location),
    geo: buildGeoCoordinates(location),
    ...(location.imageUrl ? { image: canonicalUrl(location.imageUrl) } : {}),
  };
}

function normalizeTime(value: string): string {
  const [hour = "0", minute = "0"] = value.split(":");
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

function timeToMinutes(value: string): number {
  const [hour = "0", minute = "0"] = value.split(":");
  return Number(hour) * 60 + Number(minute);
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }

  if (hours === 0) {
    return `${remainingMinutes} minutes`;
  }

  return `${hours} hour${hours === 1 ? "" : "s"} ${remainingMinutes} minutes`;
}

function parseScheduleDays(dayGroup: string): SchemaDayName[] {
  return Object.entries(dayTokenMap)
    .filter(([token]) => dayGroup.toUpperCase().includes(token))
    .map(([, day]) => day);
}

function parseScheduleTimeRange(block: SanityScheduleBlock): TimeRange | null {
  const match = block.timeLabel.match(/(\d{1,2}:\d{2}).*?(\d{1,2}:\d{2})/);

  if (!match) {
    return null;
  }

  return {
    opens: normalizeTime(match[1]),
    closes: normalizeTime(match[2]),
  };
}

function groupByRange(
  rangesByDay: Map<SchemaDayName, TimeRange>,
): Array<TimeRange & { dayOfWeek: string[] }> {
  const grouped = new Map<string, TimeRange & { dayOfWeek: string[] }>();

  for (const [day, range] of rangesByDay) {
    const key = `${range.opens}-${range.closes}`;
    const current = grouped.get(key);

    if (current) {
      current.dayOfWeek.push(`${schemaDayUrlPrefix}${day}`);
      continue;
    }

    grouped.set(key, {
      ...range,
      dayOfWeek: [`${schemaDayUrlPrefix}${day}`],
    });
  }

  return Array.from(grouped.values());
}

function buildOpeningHoursSpecification(
  scheduleBlocks: readonly SanityScheduleBlock[] = [],
) {
  const rangesByDay = new Map<SchemaDayName, TimeRange>();

  for (const block of scheduleBlocks) {
    const days = parseScheduleDays(block.dayGroup);
    const range = parseScheduleTimeRange(block);

    if (!range || days.length === 0) {
      continue;
    }

    for (const day of days) {
      const current = rangesByDay.get(day);

      if (!current) {
        rangesByDay.set(day, range);
        continue;
      }

      rangesByDay.set(day, {
        opens:
          timeToMinutes(range.opens) < timeToMinutes(current.opens)
            ? range.opens
            : current.opens,
        closes:
          timeToMinutes(range.closes) > timeToMinutes(current.closes)
            ? range.closes
            : current.closes,
      });
    }
  }

  return groupByRange(rangesByDay).map((range) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: range.dayOfWeek,
    opens: range.opens,
    closes: range.closes,
  }));
}

function buildCourseSchedules(scheduleBlocks: readonly SanityScheduleBlock[] = []) {
  return scheduleBlocks.flatMap((block) => {
    const days = parseScheduleDays(block.dayGroup);
    const range = parseScheduleTimeRange(block);

    if (!range || days.length === 0) {
      return [];
    }

    return {
      "@type": "Schedule",
      repeatFrequency: "P1W",
      byDay: days.map((day) => `${schemaDayUrlPrefix}${day}`),
      startTime: range.opens,
      endTime: range.closes,
    };
  });
}

function buildCourseWorkload(
  scheduleBlocks: readonly SanityScheduleBlock[] = [],
): string | null {
  const durations = scheduleBlocks
    .map(parseScheduleTimeRange)
    .filter((range): range is TimeRange => range !== null)
    .map((range) => timeToMinutes(range.closes) - timeToMinutes(range.opens))
    .filter((duration) => duration > 0);

  if (durations.length === 0) {
    return null;
  }

  const min = Math.min(...durations);
  const max = Math.max(...durations);

  return min === max
    ? `${formatDuration(min)} per session`
    : `${formatDuration(min)} to ${formatDuration(max)} per session`;
}

function buildSchemaImages(locations: readonly SanityLocation[]): string[] {
  const urls = [
    siteConfig.defaultOgImagePath,
    ...locations.map((location) => location.imageUrl),
  ]
    .filter((url): url is string => Boolean(url))
    .map(canonicalUrl);

  return Array.from(new Set(urls));
}

function buildOfferSchemas(
  pricingTiers: readonly SanityPricingTier[] = [],
  url: string,
) {
  return pricingTiers.flatMap((tier) => {
    const price =
      tier.kind === "group"
        ? tier.pricePerMonth
        : tier.kind === "private"
          ? tier.pricePerHour
          : null;

    if (price === null) {
      return [];
    }

    return {
      "@type": "Offer",
      category: "Paid",
      name: tier.name,
      description: tier.description,
      price,
      priceCurrency: "VND",
      url,
      availability: "https://schema.org/InStock",
    };
  });
}

function buildCourseInstances(pathOrUrl: string, options: CourseSchemaOptions) {
  const locations = options.locations ?? [];
  const scheduleBlocks =
    locations.length > 0
      ? filterScheduleBlocksForLocations(options.scheduleBlocks ?? [], locations)
      : (options.scheduleBlocks ?? []);
  const schedules = buildCourseSchedules(scheduleBlocks);
  const workload = buildCourseWorkload(scheduleBlocks);
  const offers = buildOfferSchemas(options.pricingTiers, canonicalUrl(pathOrUrl));

  if (
    locations.length === 0 &&
    schedules.length === 0 &&
    workload === null &&
    offers.length === 0
  ) {
    return [];
  }

  return [
    {
      "@type": "CourseInstance",
      courseMode,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      ...(schedules.length > 0 ? { courseSchedule: schedules } : {}),
      ...(workload ? { courseWorkload: workload } : {}),
      ...(locations.length > 0
        ? { location: locations.map(buildEmbeddedSportsLocation) }
        : {}),
      ...(offers.length > 0 ? { offers } : {}),
    },
  ];
}

export function filterScheduleBlocksForLocations(
  scheduleBlocks: readonly SanityScheduleBlock[],
  locations: readonly SanityLocation[],
): SanityScheduleBlock[] {
  const locationIds = new Set(locations.map((location) => location.id));
  return scheduleBlocks.filter((block) => locationIds.has(block.locationId));
}

function buildCourseSchemaName(tier: CourseSchemaTier): string {
  if (tier.kind === "enterprise") {
    return "Chương trình Cầu Lông Doanh Nghiệp";
  }

  const courseLevel = tier.name.toLowerCase().includes("nâng cao")
    ? "Nâng Cao"
    : "Cơ Bản";

  return `Khóa Cầu Lông ${courseLevel} ${tier.sessionsPerWeek} Buổi/Tuần`;
}

export function buildOrganizationSchema(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.siteUrl}/#organization`,
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    telephone: siteConfig.phoneE164,
    sameAs: siteFacebook,
  };
}

export function buildWebsiteSchema(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.siteUrl}/#website`,
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    inLanguage: siteConfig.language,
    publisher: {
      "@id": `${siteConfig.siteUrl}/#organization`,
    },
  };
}

export function buildFaqPageSchema(faqs: SanityFaq[]): JsonLdNode {
  const mainEntity = faqs
    .filter((faq) => faq.includeInSchema)
    .map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answerPlainText,
      },
    }));

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}

export function buildBreadcrumbSchema(
  items: readonly BreadcrumbItem[],
): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.item ? { item: item.item } : {}),
    })),
  };
}

export function buildSportsLocationSchema(location: SanityLocation): JsonLdNode {
  return {
    "@context": "https://schema.org",
    ...buildEmbeddedSportsLocation(location),
  };
}

export function buildHomepageLocalBusinessSchema(
  locations: SanityLocation[],
  pricingTiers: SanityPricingTier[],
  scheduleBlocks: SanityScheduleBlock[] = [],
): JsonLdNode {
  const primaryLocation = locations[0];
  const priceRange = buildPriceRange(pricingTiers);
  const openingHoursSpecification =
    buildOpeningHoursSpecification(scheduleBlocks);

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SportsActivityLocation"],
    "@id": `${siteConfig.siteUrl}/#location`,
    name: siteConfig.name,
    description:
      "Lớp dạy cầu lông chuyên nghiệp tại Bình Thạnh và Thủ Đức, TP.HCM, dành cho người mới bắt đầu, người đi làm và doanh nghiệp.",
    url: siteConfig.siteUrl,
    telephone: siteConfig.phoneE164,
    image: buildSchemaImages(locations),
    ...(priceRange ? { priceRange } : {}),
    ...(openingHoursSpecification.length > 0
      ? { openingHoursSpecification }
      : {}),
    sport: "Badminton",
    ...(primaryLocation
      ? {
          address: buildPostalAddress(primaryLocation),
          geo: buildGeoCoordinates(primaryLocation),
        }
      : {}),
    sameAs: siteFacebook,
    location: locations.map(buildEmbeddedSportsLocation),
  };
}

export function buildLocalPageBusinessSchema(
  path: Extract<
    CoreRoutePath,
    "/lop-cau-long-binh-thanh/" | "/lop-cau-long-thu-duc/"
  >,
  locations: SanityLocation[],
  pricingTiers: SanityPricingTier[],
  scheduleBlocks: SanityScheduleBlock[] = [],
): JsonLdNode {
  const primaryLocation = locations[0];
  const priceRange = buildPriceRange(pricingTiers);
  const openingHoursSpecification =
    buildOpeningHoursSpecification(scheduleBlocks);
  const areaServed =
    path === "/lop-cau-long-binh-thanh/" ? "Bình Thạnh" : "Thủ Đức";

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SportsActivityLocation"],
    "@id": `${canonicalUrl(path)}#location`,
    name:
      path === "/lop-cau-long-binh-thanh/"
        ? "V2 Badminton - Lớp cầu lông Bình Thạnh"
        : "V2 Badminton - Lớp cầu lông Thủ Đức",
    description:
      path === "/lop-cau-long-binh-thanh/"
        ? "Lớp cầu lông tại Bình Thạnh của V2 Badminton với sân Green, phù hợp cho người mới bắt đầu và người đi làm."
        : "Lớp cầu lông tại Thủ Đức của V2 Badminton với các sân Huệ Thiên, Khang Sport (Bình Triệu) và Phúc Lộc, phù hợp cho người mới bắt đầu và người đi làm.",
    url: canonicalUrl(path),
    telephone: siteConfig.phoneE164,
    image: buildSchemaImages(locations),
    ...(priceRange ? { priceRange } : {}),
    ...(openingHoursSpecification.length > 0
      ? { openingHoursSpecification }
      : {}),
    sport: "Badminton",
    ...(primaryLocation
      ? {
          address: buildPostalAddress(primaryLocation),
          geo: buildGeoCoordinates(primaryLocation),
        }
      : {}),
    areaServed: {
      "@type": "AdministrativeArea",
      name: areaServed,
    },
    sameAs: siteFacebook,
    location: locations.map(buildEmbeddedSportsLocation),
  };
}

export function buildCourseSchemas(
  pricingTiers: SanityPricingTier[],
  options: CourseListSchemaOptions = {},
): JsonLdNode[] {
  const courseTiers = pricingTiers.filter(
    (tier): tier is CourseSchemaTier =>
      tier.kind === "group" || tier.kind === "enterprise",
  );
  const url = options.url ?? "/";

  return courseTiers.map((tier) => {
    const hasCourseInstance = buildCourseInstances(url, {
      ...options,
      pricingTiers: [tier],
    });

    return {
      "@context": "https://schema.org",
      "@type": "Course",
      name: buildCourseSchemaName(tier),
      provider: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.siteUrl,
      },
      courseMode,
      availableLanguage: "vi",
      description: tier.description,
      ...(hasCourseInstance.length > 0 ? { hasCourseInstance } : {}),
    };
  });
}

export function buildCoursePageSchema(
  path: CoreRoutePath,
  name: string,
  description: string,
  options: CourseSchemaOptions = {},
): JsonLdNode {
  const hasCourseInstance = buildCourseInstances(path, options);

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${canonicalUrl(path)}#course`,
    name,
    description,
    url: canonicalUrl(path),
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.siteUrl,
    },
    courseMode,
    availableLanguage: "vi",
    ...(hasCourseInstance.length > 0 ? { hasCourseInstance } : {}),
  };
}
