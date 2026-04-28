import type { Metadata } from "next";
import type { SanityMoneyPage } from "@/lib/sanity";
import { getGeneratedRouteImage } from "@/lib/generatedImages";
import { canonicalUrl } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

type MoneyPageMetadataSource = Pick<
  SanityMoneyPage,
  "heroImageUrl" | "metaDescription" | "metaTitle"
>;

export function buildMoneyPageMetadata(
  path: string,
  page: MoneyPageMetadataSource,
): Metadata {
  const url = canonicalUrl(path);
  const ogImage = page.heroImageUrl ?? canonicalUrl(getGeneratedRouteImage(path));

  return {
    title: {
      absolute: page.metaTitle,
    },
    description: page.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url,
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      type: "website",
      images: [ogImage],
    },
  };
}
