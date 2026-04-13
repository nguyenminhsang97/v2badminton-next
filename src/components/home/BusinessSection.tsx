"use client";

import { trackEvent } from "@/lib/tracking";
import { useHomepageConversion } from "./HomepageConversionProvider";

const PROOF_POINTS = [
  "Thiết kế theo số lượng người và thời lượng",
  "Tuỳ biến theo ngân sách doanh nghiệp",
  "Phù hợp team building và lớp nội bộ",
  "Tổ chức giải đấu nội bộ — gắn kết đội ngũ, rèn sức khỏe",
] as const;

export function BusinessSection() {
  const { enterBusinessMode } = useHomepageConversion();

  return (
    <section className="section" id="doanh-nghiep">
      <div className="section__header">
        <h2 className="section__title">CHƯƠNG TRÌNH DOANH NGHIỆP</h2>
        <p className="section__desc">
          Team building, lớp nội bộ, lịch theo ngân sách của công ty bạn.
        </p>
      </div>
      <ul className="business__points">
        {PROOF_POINTS.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <button
        type="button"
        className="btn btn--primary btn--lg"
        onClick={() => {
          enterBusinessMode();
          trackEvent("cta_click", {
            cta_name: "nhan_bao_gia",
            cta_location: "business",
            page_type: "homepage",
            page_path: "/",
          });
        }}
      >
        Nhận báo giá
      </button>
    </section>
  );
}
