import type { ReactNode } from "react";
import { GoogleTagManager, GoogleTagManagerNoscript } from "@/components/analytics/GoogleTagManager";
import { Footer } from "@/components/layout/Footer";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { Nav } from "@/components/layout/Nav";
import { loadSiteChromeSettings } from "@/components/layout/siteSettings";
import { TrackingBootstrap } from "@/components/providers/TrackingBootstrap";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const siteSettings = await loadSiteChromeSettings();

  return (
    <div className="app-shell">
      <GoogleTagManager />
      <TrackingBootstrap />
      <Nav siteSettings={siteSettings} />
      <main className="site-main">
        <GoogleTagManagerNoscript />
        {children}
      </main>
      <FloatingCta siteSettings={siteSettings} />
      <Footer siteSettings={siteSettings} />
    </div>
  );
}
