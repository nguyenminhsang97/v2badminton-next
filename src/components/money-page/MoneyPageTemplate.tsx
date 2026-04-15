import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { FaqList } from "@/components/blocks/FaqList";
import { LocationsGrid } from "@/components/blocks/LocationsGrid";
import { PricingCards } from "@/components/blocks/PricingCards";
import type { CoreRoutePath } from "@/lib/routes";
import type { SanityMoneyPage } from "@/lib/sanity";
import { Breadcrumb } from "./Breadcrumb";

export type MoneyPageTemplateProps = {
  page: SanityMoneyPage;
  path?: CoreRoutePath;
};

export function MoneyPageTemplate({ page, path }: MoneyPageTemplateProps) {
  const ctaHref =
    page.audience === "doanh_nghiep"
      ? "/?mode=business#lien-he"
      : "/#lien-he";

  return (
    <div className="money-page">
      {path ? <Breadcrumb currentPath={path} /> : null}
      <section className="money-page__hero">
        {page.heroImageUrl ? (
          <Image
            src={page.heroImageUrl}
            alt={page.h1}
            className="money-page__hero-image"
            width={1120}
            height={400}
            priority
            sizes="(max-width: 1120px) calc(100vw - 32px), 1120px"
          />
        ) : null}
        <h1 className="money-page__title">{page.h1}</h1>
        {page.intro.length > 0 ? (
          <div className="money-page__intro">
            <PortableText value={page.intro as PortableTextBlock[]} />
          </div>
        ) : null}
      </section>

      {page.relatedPricing.length > 0 ? (
        <section className="money-page__section">
          <PricingCards
            tiers={page.relatedPricing}
            ctaHref="/#lien-he"
            enterpriseCtaHref="/?mode=business#lien-he"
            trackingLocation={`money_page:${page.slug}:pricing`}
          />
        </section>
      ) : null}

      <section className="money-page__body">
        <PortableText value={page.body as PortableTextBlock[]} />
      </section>

      {page.relatedLocations.length > 0 ? (
        <section className="money-page__section">
          <LocationsGrid locations={page.relatedLocations} />
        </section>
      ) : null}

      {page.relatedFaqs.length > 0 ? (
        <section className="money-page__section">
          <FaqList faqs={page.relatedFaqs} />
        </section>
      ) : null}

      <section className="money-page__cta">
        <Link href={ctaHref} className="btn btn--primary btn--lg">
          {page.ctaLabel}
        </Link>
      </section>
    </div>
  );
}
