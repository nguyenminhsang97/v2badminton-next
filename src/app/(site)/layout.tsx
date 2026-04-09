import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { TrackingBootstrap } from "@/components/providers/TrackingBootstrap";

export default function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="app-shell">
      <TrackingBootstrap />
      <Nav />
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  );
}
