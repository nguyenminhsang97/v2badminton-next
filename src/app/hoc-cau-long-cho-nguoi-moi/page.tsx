import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Học Cầu Lông Cho Người Mới Bắt Đầu Tại TP.HCM",
  description:
    "Skeleton route for the newbie SEO page. This route will preserve the current static page URL and search intent.",
};

export default function BeginnerPage() {
  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "64px 24px", display: "grid", gap: "20px" }}>
      <p style={{ color: "var(--v2-lime)", textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "0.8rem", fontWeight: 700 }}>
        SEO Page Skeleton
      </p>
      <h1 style={{ color: "var(--v2-white)", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
        Học Cầu Lông Cho Người Mới Bắt Đầu Tại TP.HCM
      </h1>
      <p style={{ color: "var(--v2-muted)", lineHeight: 1.8 }}>
        Đây là route placeholder cho trang người mới. Khi port nội dung thật, cần giữ nguyên intent,
        metadata, FAQ, pricing clarity và CTA structure của bản production hiện tại.
      </p>
    </main>
  );
}
