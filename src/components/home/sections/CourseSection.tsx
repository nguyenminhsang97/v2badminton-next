"use client";

import Link from "next/link";
import Image from "next/image";
import type { SanityPricingTier } from "@/lib/sanity";
import { trackEvent } from "@/lib/tracking";
import { ArrowRightIcon, ClockIcon } from "@/components/ui/BrandIcons";
import {
  useHomepageBusinessMode,
  useHomepageConversionIntent,
} from "../conversion/HomepageConversionProvider";

type CourseCardId =
  | "course-kids"
  | "course-beginner"
  | "course-working"
  | "course-private";

type CourseCardDef = {
  id: CourseCardId;
  categoryBadge: string;
  levelChip: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
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

function findFromGroupPrice(tiers: readonly SanityPricingTier[]): string {
  const groupPrices = tiers
    .filter((tier): tier is Extract<SanityPricingTier, { kind: "group" }> => tier.kind === "group")
    .map((tier) => tier.pricePerMonth);

  if (groupPrices.length === 0) {
    return "Tư vấn trực tiếp";
  }

  return `Từ ${formatVnd(Math.min(...groupPrices))}/tháng`;
}

function findPrivatePrice(tiers: readonly SanityPricingTier[]): string {
  return tiers.find((tier) => tier.kind === "private")?.displayPrice ?? "Tư vấn trực tiếp";
}

function getSortedPricingTiers(tiers: readonly SanityPricingTier[]) {
  const groupTiers = tiers
    .filter((tier): tier is Extract<SanityPricingTier, { kind: "group" }> => tier.kind === "group")
    .sort((left, right) => {
      if (left.sessionsPerWeek !== right.sessionsPerWeek) {
        return left.sessionsPerWeek - right.sessionsPerWeek;
      }

      return left.pricePerMonth - right.pricePerMonth;
    });

  const privateTier =
    tiers.find(
      (tier): tier is Extract<SanityPricingTier, { kind: "private" }> =>
        tier.kind === "private",
    ) ?? null;

  return {
    groupTiers,
    privateTier,
  };
}

function buildPricingMeta(tier: Extract<SanityPricingTier, { kind: "group" }>): string {
  const sessionsLabel = `${tier.sessionsPerWeek} buổi/tuần`;
  return tier.groupSize ? `${sessionsLabel} · ${tier.groupSize}` : sessionsLabel;
}

function PricingStrip({ tiers }: { tiers: readonly SanityPricingTier[] }) {
  const { groupTiers, privateTier } = getSortedPricingTiers(tiers);

  return (
    <div className="pricing-strip" id="hoc-phi">
      <div className="pricing-strip__header">
        <p className="pricing-strip__eyebrow">Chi tiết học phí</p>
        <h3 className="pricing-strip__title">4 mức học phí hiện tại</h3>
      </div>
      <div className="pricing-strip__grid">
        {groupTiers.map((tier) => (
          <article key={tier.id} className="pricing-strip__item">
            <div className="pricing-strip__copy">
              <strong className="pricing-strip__name">{tier.name}</strong>
              <span className="pricing-strip__meta">{buildPricingMeta(tier)}</span>
            </div>
            <strong className="pricing-strip__price">{tier.displayPrice}</strong>
          </article>
        ))}
        {privateTier ? (
          <article className="pricing-strip__item pricing-strip__item--private">
            <div className="pricing-strip__copy">
              <strong className="pricing-strip__name">{privateTier.name}</strong>
              <span className="pricing-strip__meta">Linh hoạt theo lịch riêng</span>
            </div>
            <strong className="pricing-strip__price">{privateTier.displayPrice}</strong>
          </article>
        ) : null}
      </div>
    </div>
  );
}

function EnterpriseTeaser({ onRequestQuote }: { onRequestQuote: () => void }) {
  return (
    <div className="enterprise-teaser" id="doanh-nghiep">
      <div className="enterprise-teaser__copy">
        <span className="enterprise-teaser__badge">Doanh nghiệp</span>
        <div className="enterprise-teaser__headline">
          <h3 className="enterprise-teaser__title">Giải pháp cho doanh nghiệp</h3>
          <p className="enterprise-teaser__desc">
            Team building, lớp nội bộ hoặc hoạt động sức khỏe định kỳ, tư vấn theo quy mô
            và ngân sách đội ngũ bạn.
          </p>
        </div>
      </div>

      <div className="enterprise-teaser__actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            onRequestQuote();
            trackEvent("cta_click", {
              cta_name: "nhan_bao_gia",
              cta_location: "enterprise_teaser",
              page_type: "homepage",
              page_path: "/",
            });
          }}
        >
          Nhận báo giá
        </button>
      </div>
    </div>
  );
}

export function CourseSection({ pricingTiers }: CourseSectionProps) {
  const { enterBusinessMode } = useHomepageBusinessMode();
  const { setCourseIntent } = useHomepageConversionIntent();
  const groupPrice = findFromGroupPrice(pricingTiers);
  const privatePrice = findPrivatePrice(pricingTiers);

  const courseCards: CourseCardDef[] = [
    {
      id: "course-kids",
      categoryBadge: "Thiếu nhi",
      levelChip: "Mới học",
      title: "Thiếu nhi nền tảng",
      subtitle: "7 - 12 tuổi",
      description:
        "Phát triển kỹ năng nền tảng, phản xạ và vận động theo nhịp dễ theo ngay từ buổi đầu.",
      price: groupPrice,
      meta: "3 buổi/tuần · Nhóm nhỏ",
      href: "/lop-cau-long-tre-em/",
      imageSrc: "/images/course-basic.webp",
      imageAlt: "Hướng dẫn học viên nhỏ tuổi tập cầu lông với huấn luyện viên",
      tone: "lime",
    },
    {
      id: "course-beginner",
      categoryBadge: "Người mới",
      levelChip: "Cơ bản",
      title: "Người lớn bắt đầu từ đầu",
      subtitle: "Cầm vợt tới di chuyển",
      description:
        "Lộ trình rõ ràng cho người mới để theo kịp lớp nhỏ, sửa lỗi sớm và tự tin hơn sau vài tuần.",
      price: groupPrice,
      meta: "2 - 3 buổi/tuần · 4 - 6 người",
      href: "/hoc-cau-long-cho-nguoi-moi/",
      imageSrc: "/images/course-advanced.webp",
      imageAlt: "Nhóm học viên người lớn đang tập cầu lông cùng huấn luyện viên",
      tone: "orange",
    },
    {
      id: "course-working",
      categoryBadge: "Người đi làm",
      levelChip: "Cơ bản - nâng cao",
      title: "Lớp tối và cuối tuần",
      subtitle: "Giữ nhịp tập đều",
      description:
        "Ưu tiên khung giờ dễ theo cho người bận, chọn sân gần và giữ nhịp tập ổn định dài hơn.",
      price: groupPrice,
      meta: "Ca tối · Cuối tuần",
      href: "/lop-cau-long-cho-nguoi-di-lam/",
      imageSrc: "/images/green.webp",
      imageAlt: "Học viên tham gia lớp cầu lông buổi tối tại sân trong nhà",
      tone: "teal",
    },
    {
      id: "course-private",
      categoryBadge: "1 kèm 1",
      levelChip: "Mọi trình độ",
      title: "Lộ trình cá nhân hóa",
      subtitle: "Theo mục tiêu riêng",
      description:
        "HLV theo sát từng lỗi và mục tiêu cá nhân để bạn tăng tốc kỹ thuật theo lịch riêng của mình.",
      price: privatePrice,
      meta: "Linh hoạt theo lịch cá nhân",
      href: "/hoc-cau-long-1-kem-1/",
      imageSrc: "/images/course-enterprise.webp",
      imageAlt: "Hướng dẫn học viên trong buổi học 1 kèm 1",
      tone: "emerald",
    },
  ];

  return (
    <section className="section course-section" id="khoa-hoc">
      <div className="section__header course-section__header">
        <p className="section__eyebrow">Chương trình & học phí</p>
        <h2 className="section__title">Chọn lộ trình phù hợp ngay từ buổi đầu</h2>
        <p className="section__desc">
          4 lộ trình chính để bạn chọn nhanh theo nhu cầu, rồi so mức học phí ngay bên
          dưới trước khi để lại thông tin.
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
                <strong className="course-card__price">{card.price}</strong>
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
                ) : null}
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
