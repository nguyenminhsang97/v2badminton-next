import type { Metadata } from "next";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { JsonLd } from "@/components/ui/JsonLd";
import { loadSiteChromeSettings } from "@/components/layout/siteSettings";
import { getStaticPage } from "@/lib/sanity";
import { canonicalUrl } from "@/lib/routes";
import { buildBreadcrumbSchema, buildOrganizationSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

const PATH = "/gioi-thieu/";

// ─── Fallback constants ────────────────────────────────────────────────────
// Values match the previous hardcoded JSX exactly.
// Every CMS field falls back to these when the doc is absent or the field is
// null, keeping the output sanitized-diff-clean against the pre-W3b baseline.

const FALLBACK_SEO_TITLE =
  "Giới thiệu V2 Badminton | Học viện cầu lông Bình Thạnh & Thủ Đức";
const FALLBACK_SEO_DESCRIPTION =
  "V2 Badminton là học viện dạy cầu lông tại Bình Thạnh và Thủ Đức, TP.HCM. Đào tạo trẻ em, người mới, người đi làm và doanh nghiệp.";
const FALLBACK_EYEBROW = "Giới thiệu";
const FALLBACK_TITLE_H1 =
  "Về V2 Badminton — học viện cầu lông tại Bình Thạnh & Thủ Đức";
const FALLBACK_LEAD =
  "V2 Badminton là học viện dạy cầu lông tại Bình Thạnh và Thủ Đức, TP.HCM. Chúng tôi tập trung đào tạo trẻ em và người mới bắt đầu, đồng thời hỗ trợ người đi làm và doanh nghiệp có nhu cầu tập luyện.";
const FALLBACK_BREADCRUMB_LABEL = "Giới thiệu";

// ─── Metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const [doc, chromeSettings] = await Promise.all([
    getStaticPage("gioi-thieu"),
    loadSiteChromeSettings(),
  ]);
  const title = doc?.seoTitle ?? FALLBACK_SEO_TITLE;
  const description = doc?.seoDescription ?? FALLBACK_SEO_DESCRIPTION;
  // Prefer per-page OG image, then CMS site-wide default, then static file fallback.
  const ogImageUrl =
    doc?.ogImage?.url ??
    chromeSettings.defaultOgImageUrl ??
    canonicalUrl(siteConfig.defaultOgImagePath);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl(PATH) },
    openGraph: {
      title,
      description,
      url: canonicalUrl(PATH),
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      type: "article",
      images: [ogImageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function AboutPage() {
  const [doc, chromeSettings] = await Promise.all([
    getStaticPage("gioi-thieu"),
    loadSiteChromeSettings(),
  ]);

  const contact = {
    phoneE164: chromeSettings.phoneE164,
    facebookUrl: chromeSettings.facebookUrl,
  };

  const eyebrow = doc?.eyebrow ?? FALLBACK_EYEBROW;
  const h1 = doc?.title ?? FALLBACK_TITLE_H1;
  const lead = doc?.lead ?? FALLBACK_LEAD;
  const breadcrumbLabel =
    doc?.breadcrumbLabel ?? doc?.title ?? FALLBACK_BREADCRUMB_LABEL;
  const body =
    doc?.body && doc.body.length > 0
      ? (doc.body as PortableTextBlock[])
      : null;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Trang chủ", item: canonicalUrl("/") },
    { name: breadcrumbLabel, item: canonicalUrl(PATH) },
  ]);

  return (
    <article className="legal-page">
      <JsonLd
        id="about-schema"
        data={[buildOrganizationSchema(contact), breadcrumbSchema]}
      />

      <div className="legal-page__hero">
        <p className="legal-page__eyebrow">{eyebrow}</p>
        <h1 className="legal-page__title">{h1}</h1>
        <p className="legal-page__lead">{lead}</p>
      </div>

      <div className="legal-page__content">
        {body ? (
          <PortableText value={body} />
        ) : (
          <>
            <section className="legal-page__section">
              <h2>V2 Badminton là ai?</h2>
              <p>
                V2 Badminton là học viện dạy cầu lông tại Bình Thạnh và Thủ
                Đức, TP.HCM. Chúng tôi duy trì đội ngũ HLV riêng và tổ chức
                lớp theo nhóm nhỏ để HLV có thời gian theo sát từng học viên.
                Nội dung chi tiết về lịch sử, quy trình đào tạo và đội ngũ
                đang được cập nhật trong Studio.
              </p>
            </section>

            <section className="legal-page__section">
              <h2>V2 Badminton dạy ai?</h2>
              <ul>
                <li>
                  <strong>Trẻ em:</strong> làm quen kỹ thuật cơ bản và phát
                  triển thể chất an toàn.
                </li>
                <li>
                  <strong>Người mới:</strong> nhóm nhỏ, học từ cách cầm vợt và
                  di chuyển đến đánh đôi cơ bản.
                </li>
                <li>
                  <strong>Người đi làm:</strong> khung giờ tối và cuối tuần để
                  duy trì tập luyện đều đặn.
                </li>
                <li>
                  <strong>Doanh nghiệp:</strong> buổi cầu lông team building và
                  lớp theo nhóm công ty.
                </li>
              </ul>
            </section>

            <section className="legal-page__section">
              <h2>Đội ngũ huấn luyện viên</h2>
              <p>
                Xem danh sách HLV, chứng chỉ và khoá lớp phụ trách tại{" "}
                <Link href="/huan-luyen-vien/">
                  trang đội ngũ huấn luyện viên
                </Link>
                . Nội dung chi tiết trên trang này (lịch sử đội ngũ, chứng chỉ
                của từng HLV) đang được cập nhật.
              </p>
            </section>

            <section className="legal-page__section">
              <h2>Học ở đâu?</h2>
              <p>
                V2 Badminton tổ chức lớp tại các sân ở Bình Thạnh và Thủ Đức,
                TP.HCM. Danh sách sân cụ thể và địa chỉ được cập nhật ở phần
                Sân tập trên trang chủ; liên hệ V2 để được tư vấn sân gần nhất.
              </p>
            </section>

            <section className="legal-page__section">
              <h2>Liên hệ V2 Badminton bằng cách nào?</h2>
              <ul>
                <li>
                  Điện thoại:{" "}
                  <a href={`tel:${chromeSettings.phoneE164}`}>
                    {chromeSettings.phoneDisplay}
                  </a>
                </li>
                <li>
                  Zalo:{" "}
                  <a
                    href={`https://zalo.me/${chromeSettings.zaloNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {chromeSettings.zaloNumber}
                  </a>
                </li>
                <li>
                  Facebook:{" "}
                  <a
                    href={chromeSettings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    facebook.com/v2badmintonhcm
                  </a>
                </li>
                <li>Khu vực: Bình Thạnh &amp; Thủ Đức, TP.HCM.</li>
              </ul>
            </section>
          </>
        )}
      </div>
    </article>
  );
}
