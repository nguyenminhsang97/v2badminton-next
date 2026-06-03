import type { SanitySiteSettings } from "@/lib/sanity";
import { getSiteSettings } from "@/lib/sanity";
import { siteConfig } from "@/lib/site";

// ─── Nav ─────────────────────────────────────────────────────────────────────

export type SiteNavSettings = {
  ctaLabel: string;
};

const FALLBACK_NAV: SiteNavSettings = {
  ctaLabel: "Đăng ký học thử",
};

// ─── Footer ──────────────────────────────────────────────────────────────────

export type SiteFooterSettings = {
  brandSubtitle: string;
  brandCopy: string;
  col1Heading: string;
  col2Heading: string;
  col3Heading: string;
};

const FALLBACK_FOOTER: SiteFooterSettings = {
  brandSubtitle: "Bình Thạnh · Thủ Đức",
  brandCopy:
    "Lớp cầu lông tại Bình Thạnh & Thủ Đức cho trẻ em, người mới và người đi làm.",
  col1Heading: "Lộ trình nổi bật",
  col2Heading: "Khám phá",
  col3Heading: "Liên hệ nhanh",
};

// ─── CMS UI Strings ───────────────────────────────────────────────────────────

export type SiteCmsUiStrings = {
  // Shared
  quickAnswerLabel: string;
  readArticleCta: string;
  exploreNodeCta: string;
  // Hub portal
  hubEyebrow: string;
  // Article FAQ section
  faqEyebrow: string;
  faqTitle: string;
  // Article aside (related money page)
  articleAsideLabel: string;
  articleAsideTitle: string;
  articleAsideCta: string;
  // Tech docs section (money page)
  techDocEyebrow: string;
  techDocTitle: string;
  techDocCategory: string;
  // Money page sections
  moneyPricingEyebrow: string;
  moneyPricingTitle: string;
  moneyLocationsEyebrow: string;
  moneyLocationsTitle: string;
  moneyFaqEyebrow: string;
  moneyFaqTitle: string;
  moneyRelatedPagesEyebrow: string;
  moneyRelatedPagesTitle: string;
  moneyCtaEyebrow: string;
  moneyCtaTitle: string;
};

const FALLBACK_CMS_UI_STRINGS: SiteCmsUiStrings = {
  quickAnswerLabel: "Tóm tắt nhanh",
  readArticleCta: "Đọc bài viết →",
  exploreNodeCta: "Khám phá chuyên mục →",
  hubEyebrow: "Trung tâm nội dung",
  faqEyebrow: "Hỏi & đáp",
  faqTitle: "Câu hỏi thường gặp",
  articleAsideLabel: "Lớp học liên quan",
  articleAsideTitle: "Sẵn sàng học cùng huấn luyện viên?",
  articleAsideCta: "Xem lớp học phù hợp",
  techDocEyebrow: "Tài liệu kỹ thuật",
  techDocTitle: "Bài viết kỹ thuật liên quan",
  techDocCategory: "Kỹ thuật cầu lông",
  moneyPricingEyebrow: "Chi phí rõ ràng",
  moneyPricingTitle: "Chọn gói học phù hợp",
  moneyLocationsEyebrow: "Địa điểm tập",
  moneyLocationsTitle: "Chọn sân gần bạn nhất",
  moneyFaqEyebrow: "Giải đáp trước khi đăng ký",
  moneyFaqTitle: "Câu hỏi thường gặp",
  moneyRelatedPagesEyebrow: "Lộ trình liên quan",
  moneyRelatedPagesTitle: "Lớp khác bạn có thể quan tâm",
  moneyCtaEyebrow: "Tư vấn nhanh",
  moneyCtaTitle: "Nhận lộ trình phù hợp với nhu cầu của bạn",
};

// ─── Main type ────────────────────────────────────────────────────────────────

export type SiteChromeSettings = {
  siteName: string;
  phoneDisplay: string;
  phoneE164: string;
  zaloNumber: string;
  facebookUrl: string;
  /**
   * CMS-managed default OG image URL (`site_settings.defaultOgImage`).
   * Null when the field is unset in Sanity — callers fall back to
   * `canonicalUrl(siteConfig.defaultOgImagePath)` in that case.
   */
  defaultOgImageUrl: string | null;
  nav: SiteNavSettings;
  footer: SiteFooterSettings;
  cmsUiStrings: SiteCmsUiStrings;
};

export const FALLBACK_SITE_SETTINGS: SiteChromeSettings = {
  siteName: siteConfig.name,
  phoneDisplay: siteConfig.phoneDisplay,
  phoneE164: siteConfig.phoneE164,
  zaloNumber: siteConfig.zaloNumber,
  facebookUrl: siteConfig.facebookUrl,
  defaultOgImageUrl: null,
  nav: FALLBACK_NAV,
  footer: FALLBACK_FOOTER,
  cmsUiStrings: FALLBACK_CMS_UI_STRINGS,
};

// ─── Resolver ─────────────────────────────────────────────────────────────────

export function resolveSiteChromeSettings(
  siteSettings: SanitySiteSettings | null,
): SiteChromeSettings {
  if (siteSettings === null) {
    return FALLBACK_SITE_SETTINGS;
  }

  const raw = siteSettings;

  return {
    siteName: raw.siteName,
    phoneDisplay: raw.phoneDisplay,
    phoneE164: raw.phoneE164,
    zaloNumber: raw.zaloNumber,
    facebookUrl: raw.facebookUrl,
    defaultOgImageUrl: raw.defaultOgImageUrl ?? null,
    nav: {
      ctaLabel: raw.nav?.ctaLabel ?? FALLBACK_NAV.ctaLabel,
    },
    footer: {
      brandSubtitle: raw.footer?.brandSubtitle ?? FALLBACK_FOOTER.brandSubtitle,
      brandCopy: raw.footer?.brandCopy ?? FALLBACK_FOOTER.brandCopy,
      col1Heading: raw.footer?.col1Heading ?? FALLBACK_FOOTER.col1Heading,
      col2Heading: raw.footer?.col2Heading ?? FALLBACK_FOOTER.col2Heading,
      col3Heading: raw.footer?.col3Heading ?? FALLBACK_FOOTER.col3Heading,
    },
    cmsUiStrings: {
      quickAnswerLabel:
        raw.cmsUiStrings?.quickAnswerLabel ?? FALLBACK_CMS_UI_STRINGS.quickAnswerLabel,
      readArticleCta:
        raw.cmsUiStrings?.readArticleCta ?? FALLBACK_CMS_UI_STRINGS.readArticleCta,
      exploreNodeCta:
        raw.cmsUiStrings?.exploreNodeCta ?? FALLBACK_CMS_UI_STRINGS.exploreNodeCta,
      hubEyebrow: raw.cmsUiStrings?.hubEyebrow ?? FALLBACK_CMS_UI_STRINGS.hubEyebrow,
      faqEyebrow: raw.cmsUiStrings?.faqEyebrow ?? FALLBACK_CMS_UI_STRINGS.faqEyebrow,
      faqTitle: raw.cmsUiStrings?.faqTitle ?? FALLBACK_CMS_UI_STRINGS.faqTitle,
      articleAsideLabel:
        raw.cmsUiStrings?.articleAsideLabel ?? FALLBACK_CMS_UI_STRINGS.articleAsideLabel,
      articleAsideTitle:
        raw.cmsUiStrings?.articleAsideTitle ?? FALLBACK_CMS_UI_STRINGS.articleAsideTitle,
      articleAsideCta:
        raw.cmsUiStrings?.articleAsideCta ?? FALLBACK_CMS_UI_STRINGS.articleAsideCta,
      techDocEyebrow:
        raw.cmsUiStrings?.techDocEyebrow ?? FALLBACK_CMS_UI_STRINGS.techDocEyebrow,
      techDocTitle: raw.cmsUiStrings?.techDocTitle ?? FALLBACK_CMS_UI_STRINGS.techDocTitle,
      techDocCategory:
        raw.cmsUiStrings?.techDocCategory ?? FALLBACK_CMS_UI_STRINGS.techDocCategory,
      moneyPricingEyebrow:
        raw.cmsUiStrings?.moneyPricingEyebrow ?? FALLBACK_CMS_UI_STRINGS.moneyPricingEyebrow,
      moneyPricingTitle:
        raw.cmsUiStrings?.moneyPricingTitle ?? FALLBACK_CMS_UI_STRINGS.moneyPricingTitle,
      moneyLocationsEyebrow:
        raw.cmsUiStrings?.moneyLocationsEyebrow ??
        FALLBACK_CMS_UI_STRINGS.moneyLocationsEyebrow,
      moneyLocationsTitle:
        raw.cmsUiStrings?.moneyLocationsTitle ?? FALLBACK_CMS_UI_STRINGS.moneyLocationsTitle,
      moneyFaqEyebrow:
        raw.cmsUiStrings?.moneyFaqEyebrow ?? FALLBACK_CMS_UI_STRINGS.moneyFaqEyebrow,
      moneyFaqTitle: raw.cmsUiStrings?.moneyFaqTitle ?? FALLBACK_CMS_UI_STRINGS.moneyFaqTitle,
      moneyRelatedPagesEyebrow:
        raw.cmsUiStrings?.moneyRelatedPagesEyebrow ??
        FALLBACK_CMS_UI_STRINGS.moneyRelatedPagesEyebrow,
      moneyRelatedPagesTitle:
        raw.cmsUiStrings?.moneyRelatedPagesTitle ??
        FALLBACK_CMS_UI_STRINGS.moneyRelatedPagesTitle,
      moneyCtaEyebrow:
        raw.cmsUiStrings?.moneyCtaEyebrow ?? FALLBACK_CMS_UI_STRINGS.moneyCtaEyebrow,
      moneyCtaTitle: raw.cmsUiStrings?.moneyCtaTitle ?? FALLBACK_CMS_UI_STRINGS.moneyCtaTitle,
    },
  };
}

export async function loadSiteChromeSettings(): Promise<SiteChromeSettings> {
  return resolveSiteChromeSettings(await getSiteSettings());
}
