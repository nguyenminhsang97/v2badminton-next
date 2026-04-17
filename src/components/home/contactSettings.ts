import type { SanitySiteSettings } from "@/lib/sanity";
import { siteConfig } from "@/lib/site";

export type HomeContactSettings = {
  siteName: string;
  phoneDisplay: string;
  phoneE164: string;
  zaloNumber: string;
  facebookUrl: string;
};

export function resolveHomeContactSettings(
  siteSettings: SanitySiteSettings | null,
): HomeContactSettings {
  if (siteSettings === null) {
    return {
      siteName: siteConfig.name,
      phoneDisplay: siteConfig.phoneDisplay,
      phoneE164: siteConfig.phoneE164,
      zaloNumber: siteConfig.zaloNumber,
      facebookUrl: siteConfig.facebookUrl,
    };
  }

  return {
    siteName: siteSettings.siteName,
    phoneDisplay: siteSettings.phoneDisplay,
    phoneE164: siteSettings.phoneE164,
    zaloNumber: siteSettings.zaloNumber,
    facebookUrl: siteSettings.facebookUrl,
  };
}
