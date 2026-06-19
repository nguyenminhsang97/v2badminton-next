"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "@/components/ui/BrandIcons";
import { MobileDotCarousel } from "@/components/ui/MobileDotCarousel";
import { useHomepageConversionIntent } from "@/components/home/conversion/HomepageConversionProvider";
import { HOME_SECTION_IDS, toHash } from "@/lib/anchors";
import { generatedImages } from "@/lib/generatedImages";
import type { SanityPricingTier } from "@/lib/sanity";
import { trackEvent } from "@/lib/tracking";

type CourseCardId =
  | "course-kids"
  | "course-beginner"
  | "course-working"
  | "course-private";

type CoursePriceDisplay = {
  amount: string;
  suffix: string;
  isRange?: boolean;
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

import type { HomepageCourseSectionProps } from "./sectionProps";

// Slug → static asset/tone/level map (images stay hardcoded per W2 ticket §D5)
const COURSE_CARD_DEFAULTS: Record<
  string,
  {
    imageSrc: string;
    tone: "lime" | "orange" | "teal" | "emerald";
    level: "co_ban" | "nang_cao" | null;
  }
> = {
  "lop-cau-long-tre-em":           { imageSrc: generatedImages.kidsClass,       tone: "lime",    level: "co_ban" },
  "hoc-cau-long-cho-nguoi-moi":    { imageSrc: generatedImages.adultBeginner,   tone: "orange",  level: "co_ban" },
  "lop-cau-long-cho-nguoi-di-lam": { imageSrc: generatedImages.afterWorkClass,  tone: "teal",    level: "co_ban" },
  "hoc-cau-long-1-kem-1":          { imageSrc: generatedImages.privateCoaching, tone: "emerald", level: null     },
};

function priceForSlug(
  slug: string,
  tiers: readonly SanityPricingTier[],
): CoursePriceDisplay {
  switch (slug) {
    case "lop-cau-long-tre-em":
      return findGroupPriceBySlug(tiers, "group-basic-2x");
    case "hoc-cau-long-cho-nguoi-moi":
      return findGroupPriceRangeBySlugs(tiers, ["group-basic-2x", "group-basic-3x"]);
    case "lop-cau-long-cho-nguoi-di-lam":
      return findStartingGroupPrice(tiers);
    case "hoc-cau-long-1-kem-1":
      return findPrivatePrice(tiers);
    default:
      return findStartingGroupPrice(tiers);
  }
}


function formatVnd(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function findStartingGroupPrice(
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
    amount: `Từ ${formatVnd(Math.min(...groupPrices))}đ`,
    suffix: "/tháng",
  };
}

function findGroupPriceBySlug(
  tiers: readonly SanityPricingTier[],
  slug: string,
): CoursePriceDisplay {
  const tier = tiers.find(
    (item): item is Extract<SanityPricingTier, { kind: "group" }> =>
      item.kind === "group" && item.slug === slug,
  );

  if (!tier) {
    return findStartingGroupPrice(tiers);
  }

  return {
    amount: `${formatVnd(tier.pricePerMonth)}đ`,
    suffix: "/tháng",
  };
}

function findGroupPriceRangeBySlugs(
  tiers: readonly SanityPricingTier[],
  slugs: readonly string[],
): CoursePriceDisplay {
  const prices = tiers
    .filter(
      (item): item is Extract<SanityPricingTier, { kind: "group" }> =>
        item.kind === "group" && slugs.includes(item.slug),
    )
    .map((tier) => tier.pricePerMonth);

  if (prices.length === 0) {
    return findStartingGroupPrice(tiers);
  }

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return {
    amount:
      minPrice === maxPrice
        ? `${formatVnd(minPrice)}đ`
        : `Từ ${formatVnd(minPrice)} - ${formatVnd(maxPrice)}đ`,
    suffix: "/tháng",
    isRange: minPrice !== maxPrice,
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

// Hardcoded fallback card set — used when CMS cards are absent or any card is invalid
function buildHardcodedCards(tiers: readonly SanityPricingTier[]): CourseCardDef[] {
  return [
    {
      id: "course-kids",
      categoryBadge: "Phổ biến nhất",
      levelChip: "Thiếu nhi",
      title: "Thiếu nhi cơ bản",
      subtitle: "7 - 12 tuổi",
      description: "Xây nền kỹ thuật và phản xạ cho những buổi đầu tiên.",
      price: findGroupPriceBySlug(tiers, "group-basic-2x"),
      meta: "Sáng cuối tuần · 2 buổi",
      href: "/lop-cau-long-tre-em/",
      imageSrc: generatedImages.kidsClass,
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
      price: findGroupPriceRangeBySlugs(tiers, ["group-basic-2x", "group-basic-3x"]),
      meta: "2 - 3 buổi/tuần",
      href: "/hoc-cau-long-cho-nguoi-moi/",
      imageSrc: generatedImages.adultBeginner,
      imageAlt: "Nhóm học viên người lớn đang tập cầu lông cùng huấn luyện viên",
      tone: "orange",
    },
    {
      id: "course-working",
      categoryBadge: "Sau giờ làm",
      levelChip: "Đi làm",
      title: "Người đi làm",
      subtitle: "Tối & cuối tuần",
      description: "Giữ nhịp tập đều với khung giờ sau giờ làm và cuối tuần.",
      price: findStartingGroupPrice(tiers),
      meta: "Tối & cuối tuần",
      href: "/lop-cau-long-cho-nguoi-di-lam/",
      imageSrc: generatedImages.afterWorkClass,
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
      price: findPrivatePrice(tiers),
      meta: "Theo lịch riêng",
      href: "/hoc-cau-long-1-kem-1/",
      imageSrc: generatedImages.privateCoaching,
      imageAlt: "Hướng dẫn học viên trong buổi học 1 kèm 1",
      tone: "emerald",
    },
  ];
}

export function CourseSection({ pricingTiers, content }: HomepageCourseSectionProps) {
  const { setCourseIntent } = useHomepageConversionIntent();

  const eyebrow = content?.eyebrow ?? "Chương trình học";
  const title = content?.title ?? "Chọn lộ trình phù hợp ngay từ buổi đầu";

  // All-or-nothing CMS card logic (D3/D4):
  // - empty CMS → hardcoded fallback
  // - any card fails validation → hardcoded fallback + dev warn
  // - all cards valid → CMS cards
  let courseCards: CourseCardDef[];
  const cmsCards = content?.cards;

  if (!cmsCards || cmsCards.length === 0) {
    courseCards = buildHardcodedCards(pricingTiers);
  } else {
    let allValid = true;
    const validated: CourseCardDef[] = [];

    for (let i = 0; i < cmsCards.length; i++) {
      const card = cmsCards[i];
      const slug = card.linkedMoneyPageSlug;

      if (!slug) {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[CourseSection] CMS card at index ${i} has no linkedMoneyPageSlug — falling back to hardcoded cards.`);
        }
        allValid = false;
        break;
      }

      const defaults = COURSE_CARD_DEFAULTS[slug];
      if (!defaults) {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[CourseSection] CMS card at index ${i} has unknown slug "${slug}" — falling back to hardcoded cards.`);
        }
        allValid = false;
        break;
      }

      const cardId = `course-cms-${slug}` as CourseCardId;
      validated.push({
        id: cardId,
        categoryBadge: card.categoryBadge ?? "",
        levelChip: card.levelChip ?? "",
        title: card.title ?? "",
        subtitle: card.subtitle ?? "",
        description: card.description ?? "",
        price: priceForSlug(slug, pricingTiers),
        meta: card.meta ?? "",
        href: `/${slug}/`,
        imageSrc: defaults.imageSrc,
        imageAlt: card.imageAlt ?? "",
        tone: defaults.tone,
      });
    }

    courseCards = allValid ? validated : buildHardcodedCards(pricingTiers);
  }

  // Level map used for "Xem lịch phù hợp" button — keyed by href slug
  const HREF_LEVEL_MAP: Partial<Record<string, "co_ban" | "nang_cao">> = {
    "/lop-cau-long-tre-em/":           "co_ban",
    "/hoc-cau-long-cho-nguoi-moi/":    "co_ban",
    "/lop-cau-long-cho-nguoi-di-lam/": "co_ban",
  };

  return (
    <section className="section course-section" id={HOME_SECTION_IDS.courses}>
      <div className="section__header course-section__header">
        <p className="section__eyebrow">{eyebrow}</p>
        <h2 className="section__title">{title}</h2>
        <p className="section__desc">
          4 lộ trình chính để bạn chọn nhanh theo nhu cầu trước khi để lại
          thông tin.
        </p>
      </div>

      <MobileDotCarousel
        ariaLabel="Chọn lộ trình phù hợp"
        trackClassName="course-grid course-grid--figma"
      >
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

              <div
                className={`course-card__meta-row ${
                  card.price.isRange ? "course-card__meta-row--stacked" : ""
                }`}
              >
                <span className="course-card__meta">
                  <ClockIcon className="course-card__meta-icon" />
                  {card.meta}
                </span>
                <span
                  className={`course-card__price ${
                    card.price.isRange ? "course-card__price--range" : ""
                  }`}
                >
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

                {HREF_LEVEL_MAP[card.href] ? (
                  <button
                    type="button"
                    className="course-card__cta course-card__cta--ghost"
                    onClick={() => {
                      setCourseIntent(HREF_LEVEL_MAP[card.href]!);
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
      </MobileDotCarousel>
    </section>
  );
}
