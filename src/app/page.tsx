import { JsonLd } from "@/components/ui/JsonLd";
import Link from "next/link";
import { getFaqsForPage } from "@/lib/faqs";
import { courtLocations } from "@/lib/locations";
import { pricingTiers, sitePriceRange } from "@/lib/pricing";
import { buildMetadata, routeCards } from "@/lib/routes";
import { scheduleItems } from "@/lib/schedule";
import {
  buildCourseSchemas,
  buildFaqPageSchema,
  buildHomepageLocalBusinessSchema,
  buildOrganizationSchema,
  buildWebsiteSchema,
} from "@/lib/schema";
import { moneyPages } from "@/lib/site";

export const metadata = buildMetadata("/");

export default function Home() {
  const homepageFaqCount = getFaqsForPage("homepage").length;
  const courseSchemas = buildCourseSchemas();

  return (
    <div className="page-shell">
      <JsonLd id="organization-schema" data={buildOrganizationSchema()} />
      <JsonLd id="website-schema" data={buildWebsiteSchema()} />
      <JsonLd id="homepage-business-schema" data={buildHomepageLocalBusinessSchema()} />
      <JsonLd id="homepage-faq-schema" data={buildFaqPageSchema("homepage")} />
      <JsonLd id="homepage-course-schema" data={courseSchemas} />

      <section className="page-shell__section">
        <p className="page-shell__eyebrow">Sprint 1 Workspace</p>
        <h1 className="page-shell__title">
          V2 Badminton
          <br />
          Next.js Foundation
        </h1>
        <p className="page-shell__text">
          Repo này là bản rebuild song song để thay thế website HTML hiện tại khi đã
          đủ parity cho SEO, tracking và conversion flow. Sprint 1 tập trung khóa dữ
          liệu, route metadata, layout shell và JSON-LD foundation trước khi port UI
          thật của homepage.
        </p>
      </section>

      <section className="page-shell__section">
        <p className="page-shell__eyebrow">Acceptance Contract</p>
        <h2 className="page-card__title">Những gì bản Next phải giữ nguyên trước khi cutover</h2>
        <ul className="page-list">
          <li>Preserve schedule → form prefill → scroll → focus.</li>
          <li>Preserve GTM/GA4/Meta tracking semantics của production.</li>
          <li>Form submit dùng Server Action với progressive enhancement, không mất lead khi JS tắt.</li>
          <li>Zalo mobile dùng deeplink, desktop có fallback rõ ràng.</li>
          <li>Location cards có cả Google Maps link và deep link nội bộ tới local pages.</li>
          <li>Schema, sitemap, robots và canonical phải đi từ cùng source of truth.</li>
        </ul>
      </section>

      <section className="page-shell__section">
        <p className="page-shell__eyebrow">Current Scope</p>
        <h2 className="page-card__title">4 route production cần giữ nguyên</h2>
        <div className="page-shell__grid">
          {routeCards.map((route) => (
            <Link key={route.href} href={route.href} className="page-card">
              <span className="page-card__meta">{route.href}</span>
              <strong className="page-card__title">{route.title}</strong>
              <p className="page-card__text">{route.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell__section">
        <p className="page-shell__eyebrow">Foundation Status</p>
        <div className="page-shell__grid">
          <article className="page-card">
            <span className="page-card__meta">Locations</span>
            <strong className="page-card__title">{courtLocations.length} sân đã vào source of truth</strong>
            <p className="page-card__text">
              Bao gồm structured address fields, maps links, image paths, local-page mapping
              và root LocalBusiness fallback.
            </p>
          </article>
          <article className="page-card">
            <span className="page-card__meta">Pricing</span>
            <strong className="page-card__title">
              {pricingTiers.length} tier • {sitePriceRange ?? "n/a"}
            </strong>
            <p className="page-card__text">
              Pricing dùng discriminated union để không làm drift giữa nhóm, 1 kèm 1 và
              doanh nghiệp.
            </p>
          </article>
          <article className="page-card">
            <span className="page-card__meta">Schedule</span>
            <strong className="page-card__title">{scheduleItems.length} slot đã normalize</strong>
            <p className="page-card__text">
              Schedule data đã có `prefillCourtId`, `prefillTimeSlotId` và message template
              để Sprint 2 giữ nguyên flow conversion hiện tại.
            </p>
          </article>
          <article className="page-card">
            <span className="page-card__meta">FAQs</span>
            <strong className="page-card__title">{homepageFaqCount} FAQ homepage schema-safe</strong>
            <p className="page-card__text">
              FAQ data tách riêng `answerText` và `schemaEligible` để UI và JSON-LD không bị
              drift.
            </p>
          </article>
        </div>
      </section>

      <section className="page-shell__section">
        <p className="page-shell__eyebrow">Money Pages</p>
        <h2 className="page-card__title">Mở rộng sau khi core migration pass</h2>
        <div className="page-shell__grid">
          {moneyPages.map((page) => (
            <article key={page.slug} className="page-card">
              <strong className="page-card__title">{page.title}</strong>
              <p className="page-card__text">{page.intent}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
