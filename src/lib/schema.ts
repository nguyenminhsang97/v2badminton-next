import type {
  SanityFaq,
  SanityLocation,
  SanityPricingTier,
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
  };
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
): JsonLdNode {
  const primaryLocation = locations[0];
  const priceRange = buildPriceRange(pricingTiers);

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SportsActivityLocation"],
    "@id": `${siteConfig.siteUrl}/#location`,
    name: siteConfig.name,
    description:
      "Lớp dạy cầu lông chuyên nghiệp tại Bình Thạnh và Thủ Đức, TP.HCM, dành cho người mới bắt đầu, người đi làm và doanh nghiệp.",
    url: siteConfig.siteUrl,
    telephone: siteConfig.phoneE164,
    ...(priceRange ? { priceRange } : {}),
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
): JsonLdNode {
  const primaryLocation = locations[0];
  const priceRange = buildPriceRange(pricingTiers);
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
    ...(priceRange ? { priceRange } : {}),
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
): JsonLdNode[] {
  const courseTiers = pricingTiers.filter(
    (tier): tier is CourseSchemaTier =>
      tier.kind === "group" || tier.kind === "enterprise",
  );

  return courseTiers.map((tier) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    name: buildCourseSchemaName(tier),
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.siteUrl,
    },
    courseMode: "Offline",
    availableLanguage: "vi",
    description: tier.description,
  }));
}
