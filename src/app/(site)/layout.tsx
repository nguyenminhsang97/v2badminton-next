import type { ReactNode } from "react";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { GoogleTagManager, GoogleTagManagerNoscript } from "@/components/analytics/GoogleTagManager";
import { Footer } from "@/components/layout/Footer";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { Nav } from "@/components/layout/Nav";
import { loadSiteChromeSettings } from "@/components/layout/siteSettings";
import { TrackingBootstrap } from "@/components/providers/TrackingBootstrap";
import { getCoaches, getPublishedPosts } from "@/lib/sanity";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [siteSettings, posts, coaches] = await Promise.all([
    loadSiteChromeSettings(),
    getPublishedPosts(),
    getCoaches(),
  ]);

  // getPublishedPosts() and getCoaches() return [] on Sanity fetch failure via
  // sanityFetchOrFallback. Hiding both nav/footer links on failure is intentional:
  // linking to a page we can't confirm has content is worse than temporarily
  // hiding the link during an outage.
  const showBlogLink = posts.length > 0;
  const showCoachesLink = coaches.length > 0;

  return (
    <div className="app-shell">
      <GoogleAnalytics />
      <GoogleTagManager />
      <TrackingBootstrap />
      <Nav
        siteSettings={siteSettings}
        showBlogLink={showBlogLink}
        showCoachesLink={showCoachesLink}
      />
      <main className="site-main">
        <GoogleTagManagerNoscript />
        {children}
      </main>
      <FloatingCta siteSettings={siteSettings} />
      <Footer
        siteSettings={siteSettings}
        showBlogLink={showBlogLink}
        showCoachesLink={showCoachesLink}
      />
    </div>
  );
}
