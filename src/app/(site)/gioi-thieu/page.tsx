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
  "V2 Badminton là học viện dạy cầu lông tại Bình Thạnh và Thủ Đức, TP.HCM, hoạt động từ năm 2012. Đào tạo trẻ em, người mới, người đi làm và doanh nghiệp.";
const FALLBACK_EYEBROW = "Giới thiệu";
const FALLBACK_TITLE_H1 =
  "Về V2 Badminton — học viện cầu lông tại Bình Thạnh & Thủ Đức";
const FALLBACK_LEAD =
  "V2 Badminton là học viện dạy cầu lông tại TP.HCM, hoạt động liên tục từ năm 2012 và do HLV trưởng Bùi Trần Quốc Việt sáng lập. Chúng tôi dạy trẻ em, người mới, người đi làm và doanh nghiệp tại các sân ở Bình Thạnh và Thủ Đức.";
const FALLBACK_BREADCRUMB_LABEL = "Giới thiệu";

// ─── Metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getStaticPage("gioi-thieu");
  const title = doc?.seoTitle ?? FALLBACK_SEO_TITLE;
  const description = doc?.seoDescription ?? FALLBACK_SEO_DESCRIPTION;
  const ogImageUrl =
    doc?.ogImage?.url ?? canonicalUrl(siteConfig.defaultOgImagePath);

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
                V2 Badminton là một hệ thống đào tạo cầu lông, không phải một
                lớp học lẻ. Được thành lập năm 2012 bởi HLV trưởng Bùi Trần
                Quốc Việt, V2 xây dựng lộ trình học theo cấp độ và duy trì đội
                ngũ HLV riêng thay vì thuê giáo viên thời vụ. Toàn bộ hoạt
                động tập trung tại Bình Thạnh và Thủ Đức, TP.HCM.
              </p>
            </section>

            <section className="legal-page__section">
              <h2>V2 Badminton dạy ai?</h2>
              <ul>
                <li>
                  <strong>Trẻ em:</strong> lộ trình theo nhóm tuổi, làm quen kỹ
                  thuật cơ bản và phát triển thể chất an toàn.
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
              <h2>Đội ngũ huấn luyện viên gồm những ai?</h2>
              <p>
                Điểm khác biệt của V2 là phần lớn huấn luyện viên trưởng thành
                từ chính học viên do V2 đào tạo, nên cách dạy thống nhất qua
                từng cấp độ:
              </p>
              <ul>
                <li>
                  <strong>2012:</strong> HLV trưởng Bùi Trần Quốc Việt thành
                  lập V2 Badminton.
                </li>
                <li>
                  <strong>2016:</strong> bắt đầu đào tạo học viên thành HLV nội
                  bộ và huấn luyện thêm các HLV mới.
                </li>
                <li>
                  <strong>2020:</strong> HLV Nguyễn Minh Sang phụ trách lớp
                  thiếu nhi.
                </li>
                <li>
                  <strong>2023:</strong> HLV Đinh Nguyễn Nhật Nam tham gia đội
                  ngũ.
                </li>
                <li>
                  <strong>2024:</strong> HLV Nguyễn Thị Hoàng Mai và Dương Đức
                  Huy ra mắt, đều trưởng thành từ học viên V2.
                </li>
              </ul>
              <p>
                HLV trưởng Bùi Trần Quốc Việt cùng các HLV Nguyễn Minh Sang và
                Đinh Nguyễn Nhật Nam có chứng chỉ BWF Coach Level 1 của Liên
                đoàn Cầu lông Thế giới (BWF).
              </p>
              <p>
                Xem chi tiết tại{" "}
                <Link href="/huan-luyen-vien/">
                  trang đội ngũ huấn luyện viên
                </Link>
                .
              </p>
            </section>

            <section className="legal-page__section">
              <h2>Học ở sân nào?</h2>
              <p>V2 Badminton tổ chức lớp tại các sân:</p>
              <ul>
                <li>
                  <strong>Bình Thạnh:</strong> Sân Green.
                </li>
                <li>
                  <strong>Thủ Đức:</strong> Sân Huệ Thiên, Sân Khang Sport (Bình
                  Triệu) và Sân Phúc Lộc.
                </li>
              </ul>
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
