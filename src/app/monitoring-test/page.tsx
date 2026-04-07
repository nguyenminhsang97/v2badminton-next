import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MonitoringTestPanel } from "@/components/debug/MonitoringTestPanel";
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
  if (process.env.ENABLE_MONITORING_TEST_ROUTES !== "true") {
    notFound();
  }

  return <MonitoringTestPanel />;
}
