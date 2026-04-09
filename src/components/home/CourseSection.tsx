"use client";

import { trackEvent } from "@/lib/tracking";
import { useHomepageConversion } from "./HomepageConversionProvider";

/**
 * Course cards — static copy matching production HTML.
 *
 * - Cơ bản: setCourseIntent("co_ban") → scroll to #lich-hoc via HomepageConversionProvider
 * - Nâng cao: setCourseIntent("nang_cao") → scroll to #lich-hoc
 * - Doanh nghiệp: enterBusinessMode() → scroll to #lien-he
 */

type CourseCardDef = {
  id: string;
  badge?: string;
  title: string;
  description: string;
  tags: readonly string[];
  ctaLabel: string;
  action: "basic" | "advanced" | "enterprise";
};

const COURSE_CARDS: CourseCardDef[] = [
  {
    id: "course-basic",
    badge: "Phổ biến",
    title: "KHÓA CƠ BẢN",
    description:
      "Dành cho người mới bắt đầu. Học cầm vợt đúng cách, tư thế đứng, di chuyển chân, phát cầu và các đường đánh cơ bản. Xây dựng nền tảng vững chắc ngay từ đầu.",
    tags: ["Người mới", "1 kèm 1 / Nhóm nhỏ", "Linh hoạt lịch"],
    ctaLabel: "Xem lịch học →",
    action: "basic",
  },
  {
    id: "course-advanced",
    title: "KHÓA NÂNG CAO",
    description:
      "Dành cho người đã có nền tảng. Tập trung vào kỹ thuật đập cầu (smash), cắt cầu, phòng thủ, chiến thuật thi đấu đơn & đôi. Nâng trình rõ rệt.",
    tags: ["Có kinh nghiệm", "Chiến thuật", "Thi đấu"],
    ctaLabel: "Xem lịch học →",
    action: "advanced",
  },
  {
    id: "course-enterprise",
    title: "CẦU LÔNG DOANH NGHIỆP",
    description:
      "Chương trình team building qua cầu lông. Tổ chức giải đấu nội bộ, huấn luyện theo nhóm. Gắn kết đồng nghiệp, rèn sức khỏe — một chương trình, hai lợi ích.",
    tags: ["Team building", "Giải đấu nội bộ", "Linh hoạt"],
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
          Chọn khóa phù hợp với trình độ và mục tiêu của bạn. Mọi khóa đều có HLV hướng dẫn trực tiếp — nhấn vào thẻ để xem lịch học.
        </p>
      </div>
      <div className="course-grid">
        {COURSE_CARDS.map((card) => (
          <article key={card.id} className="course-card">
            {card.badge && (
              <div className="course-card__badge">{card.badge}</div>
            )}
            <div className="course-card__body">
              <h3 className="course-card__title">{card.title}</h3>
              <p className="course-card__desc">{card.description}</p>
              <div className="course-card__tags">
                {card.tags.map((tag) => (
                  <span key={tag} className="course-card__tag">{tag}</span>
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
