"use client";

import { trackEvent } from "@/lib/tracking";
import { useHomepageConversion } from "./HomepageConversionProvider";

const PROOF_POINTS = [
  "Thiet ke theo so luong nguoi va thoi luong",
  "Tuy bien theo ngan sach doanh nghiep",
  "Phu hop team building va lop noi bo",
] as const;

export function BusinessSection() {
  const { enterBusinessMode } = useHomepageConversion();

  return (
    <section className="section" id="doanh-nghiep">
      <div className="section__header">
        <h2 className="section__title">Chuong trinh doanh nghiep</h2>
        <p className="section__subtitle">
          Team building, lop noi bo, lich theo ngan sach cua cong ty ban.
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
        Nhan bao gia
      </button>
    </section>
  );
}
