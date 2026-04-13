import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import type { SiteChromeSettings } from "@/components/layout/siteSettings";
import { TrackingBootstrap } from "@/components/providers/TrackingBootstrap";
import { getSiteSettings } from "@/lib/sanity";
import { siteConfig } from "@/lib/site";

const FALLBACK_SITE_SETTINGS: SiteChromeSettings = {
  siteName: siteConfig.name,
  phoneDisplay: siteConfig.phoneDisplay,
  phoneE164: siteConfig.phoneE164,
  zaloNumber: siteConfig.zaloNumber,
  facebookUrl: siteConfig.facebookUrl,
};

export default async function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const siteSettings = await resolveSiteChromeSettings();

  return (
    <div className="app-shell">
      <TrackingBootstrap />
      <Nav siteSettings={siteSettings} />
      <main className="site-main">{children}</main>
      <Footer siteSettings={siteSettings} />
    </div>
  );
}

async function resolveSiteChromeSettings(): Promise<SiteChromeSettings> {
  const siteSettings = await getSiteSettings();

  if (!siteSettings) {
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
