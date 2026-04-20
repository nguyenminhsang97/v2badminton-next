import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { FaqList } from "@/components/blocks/FaqList";
import { LocationsGrid } from "@/components/blocks/LocationsGrid";
import { PricingCards } from "@/components/blocks/PricingCards";
import { HOME_SECTION_IDS, toHash, toHomepageHash } from "@/lib/anchors";
import { coreRoutes, type CoreRoutePath } from "@/lib/routes";
import type { SanityMoneyPage } from "@/lib/sanity";
import { Breadcrumb } from "./Breadcrumb";

export type MoneyPageTemplateProps = {
  page: SanityMoneyPage;
  path?: CoreRoutePath;
};

function getMoneyPageKicker(audience: SanityMoneyPage["audience"]): string {
  switch (audience) {
    case "tre_em":
      return "Lộ trình cho trẻ em";
    case "nguoi_di_lam":
      return "Lộ trình cho người đi làm";
    case "doanh_nghiep":
      return "Giải pháp cho doanh nghiệp";
    case "nguoi_moi":
    default:
      return "Lộ trình theo nhu cầu";
  }
}

function buildMoneyPageFacts(page: SanityMoneyPage): string[] {
  const facts: string[] = [];

  if (page.relatedLocations.length > 0) {
    facts.push(`${page.relatedLocations.length} sân có thể chọn`);
  }

  if (page.relatedPricing.length > 0) {
    facts.push("Học phí rõ ràng");
  }

  if (page.relatedFaqs.length > 0) {
    facts.push(`${page.relatedFaqs.length} câu hỏi thường gặp`);
  }

  if (facts.length === 0) {
    facts.push("Tư vấn theo lịch học thực tế");
  }

  return facts;
}

function getRelatedMoneyPages(
  path: CoreRoutePath | undefined,
  audience: SanityMoneyPage["audience"],
) {
  if (!path) {
    return [];
  }

  const serviceRoutes = coreRoutes.filter((route) => route.pageType === "seo_service");
  const localRoutes = coreRoutes.filter((route) => route.pageType === "seo_local");
  const supportRoutes = coreRoutes.filter((route) => route.pageType === "seo_support");

  const orderedPaths =
    audience === "doanh_nghiep"
      ? [
          ...supportRoutes.map((route) => route.path),
          ...serviceRoutes.map((route) => route.path),
          ...localRoutes.map((route) => route.path),
        ]
      : [
          ...serviceRoutes.map((route) => route.path),
          ...localRoutes.map((route) => route.path),
          ...supportRoutes.map((route) => route.path),
        ];

  const uniquePaths = Array.from(new Set(orderedPaths)).filter(
    (routePath) => routePath !== path,
  );

  return uniquePaths
    .map((routePath) => coreRoutes.find((route) => route.path === routePath))
    .filter((route): route is (typeof coreRoutes)[number] => Boolean(route))
    .slice(0, 3);
}

export function MoneyPageTemplate({ page, path }: MoneyPageTemplateProps) {
  const ctaHref =
    page.audience === "doanh_nghiep"
      ? `/?mode=business${toHash(HOME_SECTION_IDS.contact)}`
      : toHomepageHash(HOME_SECTION_IDS.contact);
  const scheduleHref = toHomepageHash(HOME_SECTION_IDS.schedule);
  const facts = buildMoneyPageFacts(page);
  const heroImageUrl = page.heroImageUrl ?? null;
  const hasHeroImage = heroImageUrl !== null;
  const relatedMoneyPages = getRelatedMoneyPages(path, page.audience);

  return (
    <article className="money-page">
      {path ? <Breadcrumb currentPath={path} /> : null}

      <section
        className={`money-page__hero${hasHeroImage ? "" : " money-page__hero--copy-only"}`}
      >
        <div className="money-page__hero-copy">
          {!path ? <p className="page-kicker">{getMoneyPageKicker(page.audience)}</p> : null}
          <h1 className="money-page__title">{page.h1}</h1>
          {page.intro.length > 0 ? (
            <div className="money-page__intro">
              <PortableText value={page.intro as PortableTextBlock[]} />
            </div>
          ) : null}
          <div className="money-page__facts" aria-label="Điểm nổi bật">
            {facts.map((fact) => (
              <span key={fact} className="money-page__fact">
                {fact}
              </span>
            ))}
          </div>
        </div>

        {heroImageUrl ? (
          <div className="money-page__hero-media">
            <Image
              src={heroImageUrl}
              alt={page.h1}
              className="money-page__hero-image"
              width={1120}
              height={720}
              priority
              sizes="(max-width: 959px) calc(100vw - 32px), 44vw"
            />
          </div>
        ) : null}
      </section>

      {page.relatedPricing.length > 0 ? (
        <section className="money-page__section">
          <div className="money-page__section-header">
            <p className="section__eyebrow">Chi phí rõ ràng</p>
            <h2 className="section__title">Chọn gói học phù hợp</h2>
          </div>
          <PricingCards
            tiers={page.relatedPricing}
            ctaHref={toHomepageHash(HOME_SECTION_IDS.contact)}
            enterpriseCtaHref={`/?mode=business${toHash(HOME_SECTION_IDS.contact)}`}
            trackingLocation={`money_page:${page.slug}:pricing`}
          />
        </section>
      ) : null}

      <section className="money-page__body-shell">
        <div className="money-page__body">
          <PortableText value={page.body as PortableTextBlock[]} />
        </div>
      </section>

      {page.relatedLocations.length > 0 ? (
        <section className="money-page__section">
          <div className="money-page__section-header">
            <p className="section__eyebrow">Địa điểm tập</p>
            <h2 className="section__title">Chọn sân gần bạn nhất</h2>
          </div>
          <LocationsGrid locations={page.relatedLocations} />
        </section>
      ) : null}

      {page.relatedFaqs.length > 0 ? (
        <section className="money-page__section">
          <div className="money-page__section-header">
            <p className="section__eyebrow">Giải đáp trước khi đăng ký</p>
            <h2 className="section__title">Câu hỏi thường gặp</h2>
          </div>
          <FaqList faqs={page.relatedFaqs} />
        </section>
      ) : null}

      {relatedMoneyPages.length > 0 ? (
        <section className="money-page__section">
          <div className="money-page__section-header">
            <p className="section__eyebrow">Lộ trình liên quan</p>
            <h2 className="section__title">Lớp khác bạn có thể quan tâm</h2>
          </div>
          <ul className="money-page__related-links">
            {relatedMoneyPages.map((route) => (
              <li key={route.path}>
                <Link href={route.path} className="money-page__related-link">
                  {route.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="money-page__cta">
        <div className="money-page__cta-copy">
          <p className="section__eyebrow">Tư vấn nhanh</p>
          <h2 className="section__title">Nhận lộ trình phù hợp với nhu cầu của bạn</h2>
          <p className="section__desc">
            Gửi nhu cầu học, khu vực và khung giờ mong muốn. V2 sẽ gọi lại để
            gợi ý lớp phù hợp nhất.
          </p>
        </div>
        <div className="money-page__cta-actions">
          <Link href={ctaHref} className="btn btn--primary btn--lg">
            {page.ctaLabel}
          </Link>
          <Link href={scheduleHref} className="btn btn--outline btn--lg">
            Xem lịch học
          </Link>
        </div>
      </section>
    </article>
  );
}
