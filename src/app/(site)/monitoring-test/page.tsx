import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MonitoringTestPanel } from "@/components/debug/MonitoringTestPanel";
import { isMonitoringTestRoutesEnabled } from "@/lib/env";
import { canonicalUrl } from "@/lib/routes";

export const metadata: Metadata = {
  title: {
    absolute: "Monitoring Test | V2 Badminton",
  },
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: canonicalUrl("/monitoring-test/"),
  },
};

export default function MonitoringTestPage() {
  if (!isMonitoringTestRoutesEnabled()) {
    notFound();
  }

  return <MonitoringTestPanel />;
}
