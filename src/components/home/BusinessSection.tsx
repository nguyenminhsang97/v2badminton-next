"use client";

import Image from "next/image";
import { trackEvent } from "@/lib/tracking";
import { useHomepageConversion } from "./HomepageConversionProvider";

const PROOF_POINTS = [
  "Thiết kế theo số lượng người và thời lượng",
  "Tùy biến theo ngân sách doanh nghiệp",
  "Phù hợp team building và lớp nội bộ",
  "Tổ chức giải đấu nội bộ, gắn kết đội ngũ và rèn sức khỏe",
] as const;

export function BusinessSection() {
  const { enterBusinessMode } = useHomepageConversion();

  return (
    <section className="section business-section" id="doanh-nghiep">
      <div className="section__header">
        <p className="section__eyebrow">Giải pháp theo đội nhóm</p>
        <h2 className="section__title">CHƯƠNG TRÌNH DOANH NGHIỆP</h2>
        <p className="section__desc">
          Team building, lớp nội bộ hoặc hoạt động sức khỏe định kỳ cho công ty
          của bạn. V2 giúp biến cầu lông thành một chương trình dễ triển khai và
          có mục tiêu rõ ràng.
        </p>
      </div>

      <div className="business__panel">
        <div className="business__media">
          <Image
            src="/images/biz-team-building.webp"
            alt="Nhóm tham gia hoạt động cầu lông doanh nghiệp"
            className="business__image"
            width={960}
            height={640}
            sizes="(max-width: 959px) 100vw, 42vw"
          />
        </div>

        <div className="business__content">
          <p className="business__kicker">Một chương trình, nhiều mục tiêu</p>
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
        </div>
      </div>
    </section>
  );
}
