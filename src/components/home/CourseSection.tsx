"use client";

import Image from "next/image";
import { trackEvent } from "@/lib/tracking";
import { useHomepageConversion } from "./HomepageConversionProvider";

type CourseCardDef = {
  id: string;
  badge?: string;
  title: string;
  description: string;
  priceHint: string;
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
    title: "Khóa cơ bản",
    description:
      "Dành cho người mới bắt đầu. Học cầm vợt, tư thế đứng, di chuyển chân, phát cầu và các đường đánh cần nền tảng.",
    priceHint: "Tư vấn theo lịch và sân",
    tags: ["Người mới", "Nhóm nhỏ", "Dễ theo"],
    imageSrc: "/images/course-basic.webp",
    imageAlt: "HLV dang huong dan hoc vien moi tap cau long",
    ctaLabel: "Xem lịch học",
    action: "basic",
  },
  {
    id: "course-advanced",
    badge: "Tiến trình rõ ràng",
    title: "Khóa nâng cao",
    description:
      "Dành cho người đã có nền tảng. Tập trung vào đập cầu, cắt cầu, phòng thủ và cách vào bài thông minh hơn.",
    priceHint: "Tư vấn theo trình độ hiện tại",
    tags: ["Nâng trình", "Chiến thuật", "Thi đấu"],
    imageSrc: "/images/course-advanced.webp",
    imageAlt: "Nhom hoc vien dang tap cau long nang cao tren san",
    ctaLabel: "Xem lịch học",
    action: "advanced",
  },
  {
    id: "course-enterprise",
    badge: "Linh hoạt theo quy mô",
    title: "Cầu lông doanh nghiệp",
    description:
      "Chương trình team building, lớp nội bộ hoặc giải đấu nhỏ để kết nối đội ngũ bằng vận động.",
    priceHint: "Báo giá theo nhu cầu",
    tags: ["Team building", "Nội bộ", "Báo giá riêng"],
    imageSrc: "/images/course-enterprise.webp",
    imageAlt: "Nhom nhan su cong ty tham gia hoat dong cau long doanh nghiep",
    ctaLabel: "Nhận báo giá",
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
    <section className="section course-section" id="khoa-hoc">
      <div className="section__header course-section__header">
        <p className="section__eyebrow">Chương trình phù hợp cho mọi nhóm</p>
        <h2 className="section__title">Khóa học cầu lông để chọn đúng ngay từ đầu</h2>
        <p className="section__desc">
          Mỗi khóa học đều được mô tả rõ đối tượng, mục tiêu và cách đi tiếp sang
          lịch học hoặc form tư vấn phù hợp.
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
              <div className="course-card__topline">
                {card.badge ? (
                  <span className="course-card__badge">{card.badge}</span>
                ) : (
                  <span />
                )}
                <span className="course-card__price">{card.priceHint}</span>
              </div>
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
