import { getFaqsForPage, type FaqPageId } from "@/lib/faqs";
import {
  courtLocations,
  getCourtsForLocalPage,
  type CourtLocation,
} from "@/lib/locations";
import { pricingTiers, sitePriceRange } from "@/lib/pricing";
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

const siteFacebook = [siteConfig.facebookUrl];

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

export function buildFaqPageSchema(page: FaqPageId): JsonLdNode {
  const mainEntity = getFaqsForPage(page)
    .filter((faq) => faq.schemaEligible)
    .map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answerText,
      },
    }));

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}

export function buildBreadcrumbSchema(items: readonly BreadcrumbItem[]): JsonLdNode {
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

export function buildSportsLocationSchema(court: CourtLocation): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: court.schemaName,
    address: buildPostalAddress(court),
  };
}

export function buildHomepageLocalBusinessSchema(): JsonLdNode {
  const primaryCourt = courtLocations.find((court) => court.primaryForSchema) ?? courtLocations[0];

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SportsActivityLocation"],
    "@id": `${siteConfig.siteUrl}/#location`,
    name: siteConfig.name,
    description:
      "Lớp dạy cầu lông chuyên nghiệp tại Bình Thạnh và Thủ Đức, TP.HCM, dành cho người mới bắt đầu, nhân viên văn phòng và doanh nghiệp.",
    url: siteConfig.siteUrl,
    telephone: siteConfig.phoneE164,
    priceRange: sitePriceRange ?? undefined,
    sport: "Badminton",
    address: buildPostalAddress(primaryCourt),
    sameAs: siteFacebook,
    location: courtLocations.map((court) => ({
      "@type": "SportsActivityLocation",
      name: court.schemaName,
      address: buildPostalAddress(court),
    })),
  };
}

export function buildLocalPageBusinessSchema(path: Extract<
  CoreRoutePath,
  "/lop-cau-long-binh-thanh/" | "/lop-cau-long-thu-duc/"
>): JsonLdNode {
  const courts = getCourtsForLocalPage(path);
  const primaryCourt =
    courts.find((court) => court.primaryForSchema) ?? courts[0];
  const areaServed = path === "/lop-cau-long-binh-thanh/" ? "Bình Thạnh" : "Thủ Đức";

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
    priceRange: sitePriceRange ?? undefined,
    sport: "Badminton",
    address: buildPostalAddress(primaryCourt),
    areaServed: {
      "@type": "AdministrativeArea",
      name: areaServed,
    },
    sameAs: siteFacebook,
    location: courts.map((court) => ({
      "@type": "SportsActivityLocation",
      name: court.schemaName,
      address: buildPostalAddress(court),
    })),
  };
}

export function buildCourseSchemas(): JsonLdNode[] {
  const groupCourses = pricingTiers.filter(
    (tier) => tier.kind === "group" || tier.kind === "enterprise",
  );

  return groupCourses.map((tier) => {
    const name = buildCourseSchemaName(tier);

    return {
      "@context": "https://schema.org",
      "@type": "Course",
      name,
      provider: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.siteUrl,
      },
      courseMode: "Offline",
      availableLanguage: "vi",
      description: tier.description,
    };
  });
}

function buildCourseSchemaName(
  tier: (typeof pricingTiers)[number],
): string {
  if (tier.kind === "enterprise") {
    return "Chương trình Cầu Lông Doanh Nghiệp";
  }

  if (tier.id === "group-advanced-3x") {
    return "Khóa Cầu Lông Nâng Cao 3 Buổi/Tuần";
  }

  if (tier.id === "group-basic-2x") {
    return "Khóa Cầu Lông Cơ Bản 2 Buổi/Tuần";
  }

  return "Khóa Cầu Lông Cơ Bản 3 Buổi/Tuần";
}

function buildPostalAddress(court: CourtLocation) {
  return {
    "@type": "PostalAddress",
    streetAddress: court.streetAddress,
    addressLocality: court.addressLocality,
    addressRegion: court.addressRegion,
    addressCountry: court.addressCountry,
  };
}
