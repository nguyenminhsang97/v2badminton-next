import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lớp Cầu Lông Thủ Đức | Huệ Thiên, Khang Sport, Phúc Lộc",
  description:
    "Skeleton route for the Thủ Đức local landing page. Will preserve multi-location schema and decision-support sections.",
};

export default function ThuDucPage() {
  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "64px 24px", display: "grid", gap: "20px" }}>
      <p style={{ color: "var(--v2-lime)", textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "0.8rem", fontWeight: 700 }}>
        Local SEO Skeleton
      </p>
      <h1 style={{ color: "var(--v2-white)", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
        Lớp Cầu Lông Tại Thủ Đức — V2 Badminton
      </h1>
      <p style={{ color: "var(--v2-muted)", lineHeight: 1.8 }}>
        Route placeholder cho local page Thủ Đức. Khi port nội dung thật, phải giữ root address,
        location array schema, decision-support sections và FAQ parity của bản production hiện tại.
      </p>
    </main>
  );
}
