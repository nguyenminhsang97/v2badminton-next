"use client";

import Image from "next/image";
import { trackEvent } from "@/lib/tracking";
import { useHomepageConversion } from "./HomepageConversionProvider";

type CourseCardDef = {
  id: string;
  badge?: string;
  title: string;
  description: string;
  tags: readonly string[];
  imageSrc: string;
  imageAlt: string;
  ctaLabel: string;
  action: "basic" | "advanced" | "enterprise";
};

const COURSE_CARDS: CourseCardDef[] = [
  {
    id: "course-basic",
    badge: "Phổ biến",
    title: "KHÓA CƠ BẢN",
    description:
      "Dành cho người mới bắt đầu. Học cầm vợt đúng cách, tư thế đứng, di chuyển chân, phát cầu và các đường đánh cơ bản.",
    tags: ["Người mới", "1 kèm 1 / Nhóm nhỏ", "Linh hoạt lịch"],
    imageSrc: "/images/course-basic.webp",
    imageAlt: "HLV đang hướng dẫn học viên mới tập cầu lông",
    ctaLabel: "Xem lịch học →",
    action: "basic",
  },
  {
    id: "course-advanced",
    title: "KHÓA NÂNG CAO",
    description:
      "Dành cho người đã có nền tảng. Tập trung vào kỹ thuật đập cầu, cắt cầu, phòng thủ và chiến thuật thi đấu đơn hoặc đôi.",
    tags: ["Có kinh nghiệm", "Chiến thuật", "Thi đấu"],
    imageSrc: "/images/course-advanced.webp",
    imageAlt: "Nhóm học viên đang tập cầu lông nâng cao trên sân",
    ctaLabel: "Xem lịch học →",
    action: "advanced",
  },
  {
    id: "course-enterprise",
    title: "CẦU LÔNG DOANH NGHIỆP",
    description:
      "Chương trình team building qua cầu lông. Tổ chức giải đấu nội bộ, huấn luyện theo nhóm và hoạt động gắn kết đội ngũ.",
    tags: ["Team building", "Giải đấu nội bộ", "Linh hoạt"],
    imageSrc: "/images/course-enterprise.webp",
    imageAlt: "Nhóm nhân sự công ty tham gia hoạt động cầu lông doanh nghiệp",
    ctaLabel: "Liên hệ tư vấn →",
    action: "enterprise",
  },
];

export function CourseSection() {
  const { setCourseIntent, enterBusinessMode } = useHomepageConversion();

  function handleClick(card: CourseCardDef) {
    switch (card.action) {
      case "basic":
        setCourseIntent("co_ban");
        trackEvent("cta_click", {
          cta_name: "xem_khoa_hoc",
          cta_location: "course_cards",
          page_type: "homepage",
          page_path: "/",
        });
        break;
      case "advanced":
        setCourseIntent("nang_cao");
        trackEvent("cta_click", {
          cta_name: "xem_khoa_hoc",
          cta_location: "course_cards",
          page_type: "homepage",
          page_path: "/",
        });
        break;
      case "enterprise":
        enterBusinessMode();
        trackEvent("cta_click", {
          cta_name: "nhan_bao_gia",
          cta_location: "course_cards",
          page_type: "homepage",
          page_path: "/",
        });
        break;
    }
  }

  return (
    <section className="section" id="khoa-hoc">
      <div className="section__header">
        <p className="section__eyebrow">Chương trình đào tạo</p>
        <h2 className="section__title">KHÓA HỌC CẦU LÔNG</h2>
        <p className="section__desc">
          Chọn khóa phù hợp với trình độ và mục tiêu của bạn. Mỗi khóa đều có
          HLV hướng dẫn trực tiếp và CTA riêng để chuyển nhanh sang lịch hoặc
          form phù hợp.
        </p>
      </div>
      <div className="course-grid">
        {COURSE_CARDS.map((card) => (
          <article key={card.id} className="course-card">
            <div className="course-card__media">
              <Image
                src={card.imageSrc}
                alt={card.imageAlt}
                className="course-card__image"
                width={720}
                height={480}
                sizes="(max-width: 959px) 100vw, 33vw"
              />
            </div>
            <div className="course-card__body">
              {card.badge && (
                <div className="course-card__badge">{card.badge}</div>
              )}
              <h3 className="course-card__title">{card.title}</h3>
              <p className="course-card__desc">{card.description}</p>
              <div className="course-card__tags">
                {card.tags.map((tag) => (
                  <span key={tag} className="course-card__tag">
                    {tag}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className="course-card__action"
                onClick={() => handleClick(card)}
              >
                {card.ctaLabel}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
