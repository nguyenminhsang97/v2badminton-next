"use client";

import Image from "next/image";
import type { SanityPricingTier } from "@/lib/sanity";
import { trackEvent } from "@/lib/tracking";
import { ArrowRightIcon } from "@/components/ui/BrandIcons";
import { useHomepageConversion } from "./HomepageConversionProvider";

type CourseCardId =
  | "course-kids"
  | "course-beginner"
  | "course-working"
  | "course-private";

type CourseCardDef = {
  id: CourseCardId;
  badge: string;
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
        <h3 className="pricing-strip__title">So sánh nhanh các mức học phí hiện tại</h3>
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
          <h3 className="enterprise-teaser__title">
            Team building, lớp nội bộ và chương trình cầu lông theo ngân sách
          </h3>
          <p className="enterprise-teaser__desc">
            Giữ phần B2B ở dạng compact trên homepage, còn chi tiết đầy đủ vẫn đi về money page
            doanh nghiệp hoặc form báo giá.
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
        <a
          href="/cau-long-doanh-nghiep/"
          className="enterprise-teaser__link"
          onClick={() =>
            trackEvent("cta_click", {
              cta_name: "xem_khoa_hoc",
              cta_location: "enterprise_teaser",
              page_type: "homepage",
              page_path: "/",
            })
          }
        >
          Xem chi tiết
          <ArrowRightIcon className="enterprise-teaser__link-icon" />
        </a>
      </div>
    </div>
  );
}

export function CourseSection({ pricingTiers }: CourseSectionProps) {
  const { enterBusinessMode, setCourseIntent } = useHomepageConversion();
  const groupPrice = findFromGroupPrice(pricingTiers);
  const privatePrice = findPrivatePrice(pricingTiers);

  const courseCards: CourseCardDef[] = [
    {
      id: "course-kids",
      badge: "Trẻ em",
      title: "Thiếu nhi nền tảng",
      subtitle: "7-12 tuổi · Nhóm nhỏ theo sát",
      description:
        "Xây tư thế, di chuyển, cảm giác vợt và phản xạ đầu tiên theo nhịp dễ theo cho phụ huynh lẫn học viên mới.",
      price: groupPrice,
      meta: "2-3 buổi/tuần · Bình Thạnh & Thủ Đức",
      href: "/lop-cau-long-tre-em/",
      imageSrc: "/images/course-basic.webp",
      imageAlt: "Hướng dẫn học viên nhỏ tuổi tập cầu lông với huấn luyện viên",
      tone: "lime",
    },
    {
      id: "course-beginner",
      badge: "Người mới",
      title: "Người lớn bắt đầu từ đầu",
      subtitle: "Lộ trình cầm vợt tới di chuyển",
      description:
        "Dành cho người muốn học bài bản ngay từ buổi đầu, sửa lỗi sớm và vào nhịp tập ổn định thay vì tự mò kéo dài.",
      price: groupPrice,
      meta: "Nhóm 4-6 người · Có lớp tối và cuối tuần",
      href: "/hoc-cau-long-cho-nguoi-moi/",
      imageSrc: "/images/course-advanced.webp",
      imageAlt: "Nhóm học viên người lớn đang tập cầu lông cùng huấn luyện viên",
      tone: "orange",
    },
    {
      id: "course-working",
      badge: "Người đi làm",
      title: "Lớp tối và cuối tuần",
      subtitle: "Giữ nhịp tập đều dù lịch bận",
      description:
        "Phù hợp người đi làm cần lịch ổn định sau giờ hành chính, gần sân, ít phải thay đổi nhịp sinh hoạt hằng tuần.",
      price: groupPrice,
      meta: "Ca tối 18:00-21:00 · Ưu tiên sân gần bạn",
      href: "/lop-cau-long-cho-nguoi-di-lam/",
      imageSrc: "/images/green.webp",
      imageAlt: "Học viên tham gia lớp cầu lông buổi tối tại sân trong nhà",
      tone: "teal",
    },
    {
      id: "course-private",
      badge: "1 kèm 1",
      title: "Lộ trình cá nhân hóa",
      subtitle: "Tăng tốc kỹ thuật theo mục tiêu riêng",
      description:
        "Khi bạn cần HLV theo sát, chỉnh lỗi trực tiếp theo trình độ hiện tại và linh hoạt theo lịch công việc riêng.",
      price: privatePrice,
      meta: "Linh hoạt khung giờ · Tiến độ cá nhân",
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
          V2 giữ cách chọn theo &quot;bạn là ai&quot; để dễ matching, rồi đặt bảng học phí chi tiết ngay bên
          dưới để bạn biết nhanh mức phù hợp trước khi để lại thông tin.
        </p>
      </div>

      <div className="course-grid course-grid--figma">
        {courseCards.map((card) => (
          <article key={card.id} className={`course-card course-card--${card.tone}`}>
            <div className="course-card__media course-card__media--overlay">
              <Image
                src={card.imageSrc}
                alt={card.imageAlt}
                className="course-card__image"
                width={720}
                height={640}
                sizes="(max-width: 959px) 100vw, (max-width: 1279px) 50vw, 25vw"
              />
              <div className="course-card__media-overlay" />
              <div className="course-card__media-topline">
                <span className="course-card__badge">{card.badge}</span>
                <span className="course-card__subtitle">{card.subtitle}</span>
              </div>
              <div className="course-card__price-chip">
                <strong className="course-card__price-value">{card.price}</strong>
                <span className="course-card__price-unit">{card.meta}</span>
              </div>
            </div>

            <div className="course-card__body">
              <div className="course-card__headline-copy">
                <h3 className="course-card__title">{card.title}</h3>
                <p className="course-card__desc">{card.description}</p>
              </div>

              <div className="course-card__actions">
                <a
                  href={card.href}
                  className="course-card__action course-card__action--link"
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
                  <ArrowRightIcon className="course-card__action-icon" />
                </a>

                {CARD_LEVEL_MAP[card.id] ? (
                  <button
                    type="button"
                    className="course-card__action course-card__action--schedule"
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
                    Xem lịch học
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
