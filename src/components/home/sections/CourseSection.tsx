"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "@/components/ui/BrandIcons";
import {
  useHomepageBusinessMode,
  useHomepageConversionIntent,
} from "@/components/home/conversion/HomepageConversionProvider";
import { HOME_SECTION_IDS, toHash } from "@/lib/anchors";
import type { SanityPricingTier } from "@/lib/sanity";
import { trackEvent } from "@/lib/tracking";
import { EnterpriseTeaser } from "./EnterpriseTeaser";
import { PricingStrip } from "./PricingStrip";

type CourseCardId =
  | "course-kids"
  | "course-beginner"
  | "course-working"
  | "course-private";

type CoursePriceDisplay = {
  amount: string;
  suffix: string;
};

type CourseCardDef = {
  id: CourseCardId;
  categoryBadge: string;
  levelChip: string;
  title: string;
  subtitle: string;
  description: string;
  price: CoursePriceDisplay;
  meta: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  tone: "lime" | "orange" | "teal" | "emerald";
};

type CourseSectionProps = {
  pricingTiers: SanityPricingTier[];
};

const CARD_LEVEL_MAP: Partial<Record<CourseCardId, "co_ban" | "nang_cao">> = {
  "course-kids": "co_ban",
  "course-beginner": "co_ban",
  "course-working": "co_ban",
};

function formatVnd(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function findFromGroupPrice(
  tiers: readonly SanityPricingTier[],
): CoursePriceDisplay {
  const groupPrices = tiers
    .filter(
      (tier): tier is Extract<SanityPricingTier, { kind: "group" }> =>
        tier.kind === "group",
    )
    .map((tier) => tier.pricePerMonth);

  if (groupPrices.length === 0) {
    return {
      amount: "Tư vấn",
      suffix: "trực tiếp",
    };
  }

  return {
    amount: `${formatVnd(Math.min(...groupPrices))}đ`,
    suffix: "/tháng",
  };
}

function findPrivatePrice(
  tiers: readonly SanityPricingTier[],
): CoursePriceDisplay {
  const privateTier = tiers.find(
    (tier): tier is Extract<SanityPricingTier, { kind: "private" }> =>
      tier.kind === "private",
  );

  if (!privateTier) {
    return {
      amount: "Tư vấn",
      suffix: "trực tiếp",
    };
  }

  return {
    amount: `${formatVnd(privateTier.pricePerHour)}đ`,
    suffix: "/giờ",
  };
}

export function CourseSection({ pricingTiers }: CourseSectionProps) {
  const { enterBusinessMode } = useHomepageBusinessMode();
  const { setCourseIntent } = useHomepageConversionIntent();
  const groupPrice = findFromGroupPrice(pricingTiers);
  const privatePrice = findPrivatePrice(pricingTiers);

  const courseCards: CourseCardDef[] = [
    {
      id: "course-kids",
      categoryBadge: "Phổ biến nhất",
      levelChip: "Thiếu nhi",
      title: "Thiếu nhi cơ bản",
      subtitle: "7 - 12 tuổi",
      description: "Xây nền kỹ thuật và phản xạ cho những buổi đầu tiên.",
      price: groupPrice,
      meta: "3 buổi/tuần",
      href: "/lop-cau-long-tre-em/",
      imageSrc: "/images/course-basic.webp",
      imageAlt: "Hướng dẫn học viên nhỏ tuổi tập cầu lông với huấn luyện viên",
      tone: "lime",
    },
    {
      id: "course-beginner",
      categoryBadge: "Dễ bắt đầu",
      levelChip: "Mới bắt đầu",
      title: "Người lớn mới học",
      subtitle: "Mới bắt đầu",
      description: "Lộ trình rõ ràng cho người mới cầm vợt và muốn theo đều.",
      price: groupPrice,
      meta: "2 - 3 buổi/tuần",
      href: "/hoc-cau-long-cho-nguoi-moi/",
      imageSrc: "/images/course-advanced.webp",
      imageAlt: "Nhóm học viên người lớn đang tập cầu lông cùng huấn luyện viên",
      tone: "orange",
    },
    {
      id: "course-working",
      categoryBadge: "Tối & cuối tuần",
      levelChip: "Đi làm",
      title: "Người đi làm",
      subtitle: "Tối & cuối tuần",
      description: "Giữ nhịp tập đều với khung giờ sau giờ làm và cuối tuần.",
      price: groupPrice,
      meta: "Tối & cuối tuần",
      href: "/lop-cau-long-cho-nguoi-di-lam/",
      imageSrc: "/images/green.webp",
      imageAlt: "Học viên tham gia lớp cầu lông buổi tối tại sân trong nhà",
      tone: "teal",
    },
    {
      id: "course-private",
      categoryBadge: "Theo lịch riêng",
      levelChip: "Mọi trình độ",
      title: "1 kèm 1",
      subtitle: "Theo mục tiêu riêng",
      description: "Theo mục tiêu riêng và tăng tốc đúng phần bạn cần.",
      price: privatePrice,
      meta: "Theo lịch riêng",
      href: "/hoc-cau-long-1-kem-1/",
      imageSrc: "/images/course-enterprise.webp",
      imageAlt: "Hướng dẫn học viên trong buổi học 1 kèm 1",
      tone: "emerald",
    },
  ];

  return (
    <section className="section course-section" id={HOME_SECTION_IDS.courses}>
      <div className="section__header course-section__header">
        <p className="section__eyebrow">Chương trình & học phí</p>
        <h2 className="section__title">Chọn lộ trình phù hợp ngay từ buổi đầu</h2>
        <p className="section__desc">
          4 lộ trình chính để bạn chọn nhanh theo nhu cầu, rồi so mức học phí ngay
          bên dưới trước khi để lại thông tin.
        </p>
      </div>

      <div className="course-grid course-grid--figma">
        {courseCards.map((card) => (
          <article key={card.id} className={`course-card course-card--${card.tone}`}>
            <div className="course-card__media">
              <Image
                src={card.imageSrc}
                alt={card.imageAlt}
                className="course-card__image"
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
              />
              <div className="course-card__media-overlay" />
              <div className="course-card__media-topline">
                <span
                  className={`course-card__category-badge course-card__category-badge--${card.tone}`}
                >
                  {card.categoryBadge}
                </span>
              </div>
              <div className="course-card__media-bottomline">
                <span className="course-card__level-chip">{card.levelChip}</span>
              </div>
            </div>

            <div className="course-card__body">
              <div className="course-card__headline-copy">
                <h3 className="course-card__title">{card.title}</h3>
                <p className="course-card__subtitle">{card.subtitle}</p>
                <p className="course-card__desc">{card.description}</p>
              </div>

              <div className="course-card__meta-row">
                <span className="course-card__meta">
                  <ClockIcon className="course-card__meta-icon" />
                  {card.meta}
                </span>
                <span className="course-card__price">
                  <strong className="course-card__price-amount">
                    {card.price.amount}
                  </strong>
                  <span className="course-card__price-suffix">
                    {card.price.suffix}
                  </span>
                </span>
              </div>

              <div className="course-card__actions">
                <Link
                  href={card.href}
                  className="course-card__cta course-card__cta--primary"
                  onClick={() =>
                    trackEvent("cta_click", {
                      cta_name: "xem_khoa_hoc",
                      cta_location: "course_cards",
                      page_type: "homepage",
                      page_path: "/",
                    })
                  }
                >
                  Xem chi tiết
                  <ArrowRightIcon className="course-card__cta-icon" />
                </Link>

                {CARD_LEVEL_MAP[card.id] ? (
                  <button
                    type="button"
                    className="course-card__cta course-card__cta--ghost"
                    onClick={() => {
                      setCourseIntent(CARD_LEVEL_MAP[card.id]!);
                      trackEvent("cta_click", {
                        cta_name: "xem_khoa_hoc",
                        cta_location: "course_schedule_jump",
                        page_type: "homepage",
                        page_path: "/",
                      });
                    }}
                  >
                    Xem lịch phù hợp
                  </button>
                ) : (
                  <Link
                    href={toHash(HOME_SECTION_IDS.contact)}
                    className="course-card__cta course-card__cta--ghost"
                    onClick={() =>
                      trackEvent("cta_click", {
                        cta_name: "xem_khoa_hoc",
                        cta_location: "course_private_contact",
                        page_type: "homepage",
                        page_path: "/",
                      })
                    }
                  >
                    Trao đổi lịch riêng
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <PricingStrip tiers={pricingTiers} />
      <EnterpriseTeaser onRequestQuote={enterBusinessMode} />
    </section>
  );
}
