import type { SanitySiteSettings } from "@/lib/sanity";
import { getSiteSettings } from "@/lib/sanity";
import { siteConfig } from "@/lib/site";

export type SiteChromeSettings = {
  siteName: string;
  phoneDisplay: string;
  phoneE164: string;
  zaloNumber: string;
  facebookUrl: string;
};

export const FALLBACK_SITE_SETTINGS: SiteChromeSettings = {
  siteName: siteConfig.name,
  phoneDisplay: siteConfig.phoneDisplay,
  phoneE164: siteConfig.phoneE164,
  zaloNumber: siteConfig.zaloNumber,
  facebookUrl: siteConfig.facebookUrl,
};

export function resolveSiteChromeSettings(
  siteSettings: SanitySiteSettings | null,
): SiteChromeSettings {
  if (siteSettings === null) {
    return FALLBACK_SITE_SETTINGS;
  }

  return {
    siteName: siteSettings.siteName,
    phoneDisplay: siteSettings.phoneDisplay,
    phoneE164: siteSettings.phoneE164,
    zaloNumber: siteSettings.zaloNumber,
    facebookUrl: siteSettings.facebookUrl,
  };
}

export async function loadSiteChromeSettings(): Promise<SiteChromeSettings> {
  return resolveSiteChromeSettings(await getSiteSettings());
}
