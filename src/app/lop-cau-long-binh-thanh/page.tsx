import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lớp Cầu Lông Bình Thạnh | Sân Green",
  description:
    "Skeleton route for the Bình Thạnh local landing page. Will preserve Green-centric local SEO intent and schema.",
};

export default function BinhThanhPage() {
  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "64px 24px", display: "grid", gap: "20px" }}>
      <p style={{ color: "var(--v2-lime)", textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "0.8rem", fontWeight: 700 }}>
        Local SEO Skeleton
      </p>
      <h1 style={{ color: "var(--v2-white)", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
        Lớp Cầu Lông Tại Bình Thạnh — V2 Badminton
      </h1>
      <p style={{ color: "var(--v2-muted)", lineHeight: 1.8 }}>
        Route placeholder cho local page Bình Thạnh. Khi port nội dung thật, cần giữ deep links,
        Green-specific decision support, FAQ, LocalBusiness schema và CTA theo ngữ cảnh.
      </p>
    </main>
  );
}
