import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponentProps } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { FaqList } from "@/components/blocks/FaqList";
import { loadSiteChromeSettings } from "@/components/layout/siteSettings";
import { getCourt } from "@/lib/sanity";
import type {
  SanityCourtBestFor,
  SanityCourtLighting,
  SanityCourtParking,
  SanityCourtSurface,
} from "@/lib/sanity";
import { slugifyHeading } from "@/lib/slugify";
import { ContentBreadcrumbs } from "./ContentBreadcrumbs";
import { ContentStructuredData } from "./ContentStructuredData";

const COURT_DISCLAIMER_TEXT =
  "Thông tin sân có thể thay đổi theo thời điểm. Vui lòng liên hệ trực tiếp với sân để xác nhận giá thuê, giờ hoạt động và tình trạng đặt sân.";

const SURFACE_LABEL: Record<SanityCourtSurface, string> = {
  wood: "Sàn gỗ",
  synthetic: "Sàn tổng hợp",
  acrylic: "Sàn acrylic",
  concrete: "Sàn bê tông",
  other: "Khác",
};

const LIGHTING_LABEL: Record<SanityCourtLighting, string> = {
  excellent: "Rất tốt",
  good: "Tốt",
  adequate: "Đạt yêu cầu",
  poor: "Yếu",
};

const PARKING_LABEL: Record<SanityCourtParking, string> = {
  free: "Miễn phí",
  paid: "Có phí",
  street_only: "Đậu đường",
  none: "Không có",
};

const BEST_FOR_LABEL: Record<SanityCourtBestFor, string> = {
  beginner: "Người mới",
  intermediate: "Trung cấp",
  advanced: "Nâng cao",
  kids: "Trẻ em",
  evening_play: "Chơi buổi tối",
  morning_play: "Chơi buổi sáng",
  tournament_practice: "Tập thi đấu",
};

const WEEKDAY_LABELS: Array<{
  key: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  label: string;
}> = [
  { key: "monday", label: "T2" },
  { key: "tuesday", label: "T3" },
  { key: "wednesday", label: "T4" },
  { key: "thursday", label: "T5" },
  { key: "friday", label: "T6" },
  { key: "saturday", label: "T7" },
  { key: "sunday", label: "CN" },
];

type CourtViewProps = {
  id: string;
  path: string;
};

export async function CourtView({ id, path }: CourtViewProps) {
  const [court, siteSettings] = await Promise.all([
    getCourt(id),
    loadSiteChromeSettings(),
  ]);

  if (!court) {
    notFound();
  }

  const { cmsUiStrings } = siteSettings;

  const areaLabel = court.nodeTitle ?? court.hubTitle;

  const trail = [
    { label: "Trang chủ", href: "/" },
    { label: court.hubTitle, href: court.hubFullPath },
    ...(court.nodeTitle && court.nodeFullPath
      ? [{ label: court.nodeTitle, href: court.nodeFullPath }]
      : []),
    { label: court.shortName },
  ];

  function blockText(block: PortableTextBlock): string {
    return ((block.children ?? []) as Array<{ text?: string }>)
      .map((span) => span.text ?? "")
      .join("");
  }
  const seenSlugs: Record<string, number> = {};
  function makeHeadingId(value: PortableTextBlock): string {
    const base = slugifyHeading(blockText(value));
    const count = (seenSlugs[base] = (seenSlugs[base] ?? 0) + 1);
    return count === 1 ? base : `${base}-${count}`;
  }

  const portableTextComponents = {
    block: {
      h2: ({ children, value }: PortableTextComponentProps<PortableTextBlock>) => (
        <h2 id={makeHeadingId(value)}>{children}</h2>
      ),
      h3: ({ children, value }: PortableTextComponentProps<PortableTextBlock>) => (
        <h3 id={makeHeadingId(value)}>{children}</h3>
      ),
    },
  };

  return (
    <>
      <ContentStructuredData
        path={path}
        breadcrumbTrail={trail}
        court={court}
        courtAreaLabel={areaLabel}
        faqs={court.relatedFaqs}
      />

      <article className="blog-post">
        <ContentBreadcrumbs trail={trail} />

        {/* 3D — Hero */}
        <header className="blog-post__hero">
          <div className="blog-post__hero-copy">
            <span className="blog-post__category">{areaLabel}</span>
            <h1 className="blog-post__title">{court.name}</h1>
            {court.lastReviewedAt ? (
              <p className="blog-post__meta">
                Đánh giá ngày{" "}
                {new Intl.DateTimeFormat("vi-VN", {
                  dateStyle: "long",
                }).format(new Date(court.lastReviewedAt))}
              </p>
            ) : null}
          </div>

          {court.coverImageUrl ? (
            <div className="blog-post__hero-media">
              <Image
                src={court.coverImageUrl}
                alt={court.coverImageAlt ?? court.name}
                className="blog-post__cover"
                width={1120}
                height={630}
                priority
                sizes="(max-width: 959px) calc(100vw - 32px), 42vw"
              />
            </div>
          ) : null}
        </header>

        {/* 3D — v2PartnerNote disclosure (Q5) */}
        {court.v2PartnerNote ? (
          <aside
            className="quick-answer"
            role="note"
            aria-label="V2 Badminton partnership disclosure"
          >
            <p>{court.v2PartnerNote}</p>
          </aside>
        ) : null}

        {/* 3E — Quick answer */}
        {court.quickAnswer ? (
          <section className="blog-post__content-shell">
            <div className="quick-answer">
              <p className="quick-answer__label">
                {cmsUiStrings.quickAnswerLabel}
              </p>
              <p className="quick-answer__body">{court.quickAnswer}</p>
            </div>
          </section>
        ) : null}

        {/* 3E — Factual fact-block */}
        <section className="blog-post__content-shell" aria-label="Thông tin sân">
          <h2 className="section__title">Thông tin sân</h2>
          <dl>
            <div>
              <dt>Địa chỉ</dt>
              <dd>
                <p>{court.addressText}</p>
                <a
                  href={court.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Xem trên Google Maps
                </a>
              </dd>
            </div>

            {court.openingHours ? (
              <div>
                <dt>Giờ hoạt động</dt>
                <dd>
                  <ul>
                    {WEEKDAY_LABELS.map(({ key, label }) => {
                      const day = court.openingHours?.[key];
                      let timeText: string;
                      if (!day || (day.open === null && day.close === null)) {
                        timeText = "Đóng cửa";
                      } else if (day.open && day.close) {
                        timeText = `${day.open} – ${day.close}`;
                      } else {
                        timeText = "—";
                      }
                      return (
                        <li key={key}>
                          {label}: {timeText}
                        </li>
                      );
                    })}
                  </ul>
                </dd>
              </div>
            ) : null}

            {court.courtCount !== null ? (
              <div>
                <dt>Số sân</dt>
                <dd>{court.courtCount}</dd>
              </div>
            ) : null}

            {court.surfaceType ? (
              <div>
                <dt>Mặt sân</dt>
                <dd>{SURFACE_LABEL[court.surfaceType]}</dd>
              </div>
            ) : null}

            {court.lighting ? (
              <div>
                <dt>Đèn chiếu sáng</dt>
                <dd>{LIGHTING_LABEL[court.lighting]}</dd>
              </div>
            ) : null}

            {court.parking ? (
              <div>
                <dt>Chỗ đỗ xe</dt>
                <dd>{PARKING_LABEL[court.parking]}</dd>
              </div>
            ) : null}

            {court.priceRangeText ? (
              <div>
                <dt>Giá thuê</dt>
                <dd>{court.priceRangeText}</dd>
              </div>
            ) : null}

            {court.contactInfo?.phone ? (
              <div>
                <dt>Điện thoại</dt>
                <dd>
                  <a href={`tel:${court.contactInfo.phone}`}>
                    {court.contactInfo.phone}
                  </a>
                </dd>
              </div>
            ) : null}

            {court.contactInfo?.facebookUrl ? (
              <div>
                <dt>Facebook</dt>
                <dd>
                  <a
                    href={court.contactInfo.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Trang Facebook
                  </a>
                </dd>
              </div>
            ) : null}

            {court.contactInfo?.bookingUrl ? (
              <div>
                <dt>Đặt sân</dt>
                <dd>
                  <a
                    href={court.contactInfo.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Đặt sân trực tuyến
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </section>

        {/* 3F — Review section */}
        {court.reviewSummary.length > 0 ? (
          <section
            className="blog-post__content-shell"
            aria-label="Đánh giá của V2 Badminton"
          >
            <h2 className="section__title">Đánh giá của V2</h2>
            <div className="blog-post__body">
              <PortableText
                value={court.reviewSummary as PortableTextBlock[]}
                components={portableTextComponents}
              />
            </div>
            {court.pros.length > 0 ? (
              <div>
                <h3>Điểm cộng</h3>
                <ul>
                  {court.pros.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {court.cons.length > 0 ? (
              <div>
                <h3>Điểm trừ</h3>
                <ul>
                  {court.cons.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {court.bestFor.length > 0 ? (
              <div>
                <h3>Phù hợp với</h3>
                <ul>
                  {court.bestFor.map((b) => (
                    <li key={b}>{BEST_FOR_LABEL[b]}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}

        {/* 3F — Gallery */}
        {court.gallery.length > 0 ? (
          <section
            className="blog-post__content-shell"
            aria-label="Thư viện ảnh"
          >
            <h2 className="section__title">Thư viện ảnh</h2>
            <div>
              {court.gallery.map((img) => (
                <Image
                  key={img.url}
                  src={img.url}
                  alt={img.alt ?? court.name}
                  width={560}
                  height={315}
                  sizes="(max-width: 959px) calc(100vw - 32px), 33vw"
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* 3G — FAQ */}
        {court.relatedFaqs.length > 0 ? (
          <section
            className="blog-post__content-shell"
            aria-label={cmsUiStrings.faqTitle}
          >
            <p className="section__eyebrow">{cmsUiStrings.faqEyebrow}</p>
            <h2 className="section__title">{cmsUiStrings.faqTitle}</h2>
            <FaqList faqs={court.relatedFaqs} />
          </section>
        ) : null}

        {/* 3G — Money-page CTA (PR4-ready data attrs, no tracking listener) */}
        {court.relatedMoneyPageSlug ? (
          <aside className="blog-post__related">
            <p className="blog-post__related-label">
              {cmsUiStrings.articleAsideLabel}
            </p>
            <h2 className="section__title">
              {cmsUiStrings.articleAsideTitle}
            </h2>
            <p className="section__desc">
              Bạn muốn được hướng dẫn cá nhân hóa tại khu vực này? Xem chương
              trình lớp học phù hợp.
            </p>
            <Link
              href={`/${court.relatedMoneyPageSlug}/`}
              className="btn btn--primary"
              data-track-event="cms_court_cta_click"
              data-court-slug={court.slug}
              data-court-hub={court.hubSlug}
              data-target-money-page={court.relatedMoneyPageSlug}
              data-page-path={path}
            >
              {cmsUiStrings.articleAsideCta}
            </Link>
          </aside>
        ) : null}

        {/* 3G — Q6 disclaimer footer */}
        <footer>
          <p className="section__desc">{COURT_DISCLAIMER_TEXT}</p>
        </footer>
      </article>
    </>
  );
}
