import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { JsonLd } from "@/components/ui/JsonLd";
import { getStaticPage } from "@/lib/sanity";
import { canonicalUrl } from "@/lib/routes";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

const PATH = "/chinh-sach-bien-tap/";

// ─── Fallback constants ────────────────────────────────────────────────────
// Render when no static_page doc with slug "chinh-sach-bien-tap" is published.
// Content is factually grounded in V2 Badminton's actual editorial process.

const FALLBACK_SEO_TITLE = "Chính sách biên tập | V2 Badminton";
const FALLBACK_SEO_DESCRIPTION =
  "Quy trình biên soạn, kiểm tra chuyên môn và cập nhật nội dung kỹ thuật cầu lông của V2 Badminton.";
const FALLBACK_EYEBROW = "Nội dung & biên tập";
const FALLBACK_H1 = "Chính sách biên tập";
const FALLBACK_LEAD =
  "Nội dung kỹ thuật cầu lông trên V2 Badminton được biên soạn bởi đội ngũ HLV của học viện, dựa trên hướng dẫn huấn luyện của Liên đoàn Cầu lông Thế giới (BWF) và kinh nghiệm giảng dạy thực tế từ năm 2012.";
const FALLBACK_BREADCRUMB_LABEL = "Chính sách biên tập";

// ─── Metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getStaticPage("chinh-sach-bien-tap");
  const title = doc?.seoTitle ?? FALLBACK_SEO_TITLE;
  const description = doc?.seoDescription ?? FALLBACK_SEO_DESCRIPTION;

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
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default async function EditorialPolicyPage() {
  const doc = await getStaticPage("chinh-sach-bien-tap");

  const eyebrow = doc?.eyebrow ?? FALLBACK_EYEBROW;
  const h1 = doc?.title ?? FALLBACK_H1;
  const lead = doc?.lead ?? FALLBACK_LEAD;
  const breadcrumbLabel =
    doc?.breadcrumbLabel ?? doc?.title ?? FALLBACK_BREADCRUMB_LABEL;
  const hasBody = doc?.body != null && doc.body.length > 0;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Trang chủ", item: canonicalUrl("/") },
    { name: breadcrumbLabel, item: canonicalUrl(PATH) },
  ]);

  return (
    <article className="legal-page">
      <JsonLd id="editorial-policy-breadcrumb" data={breadcrumbSchema} />

      <div className="legal-page__hero">
        <p className="legal-page__eyebrow">{eyebrow}</p>
        <h1 className="legal-page__title">{h1}</h1>
        <p className="legal-page__lead">{lead}</p>
      </div>

      <div className="legal-page__content">
        {hasBody ? (
          <PortableText value={doc.body as PortableTextBlock[]} />
        ) : (
          <>
            <section className="legal-page__section">
              <h2>Ai biên soạn nội dung?</h2>
              <p>
                Toàn bộ bài viết kỹ thuật trên website do đội ngũ HLV V2
                Badminton biên soạn. Nội dung dựa trên tài liệu kỹ thuật chính
                thức của BWF (Liên đoàn Cầu lông Thế giới) và kinh nghiệm
                giảng dạy thực tế. HLV trưởng Bùi Trần Quốc Việt cùng các HLV
                Nguyễn Minh Sang và Đinh Nguyễn Nhật Nam có chứng chỉ BWF Coach
                Level 1.
              </p>
            </section>

            <section className="legal-page__section">
              <h2>Quy trình kiểm tra và review chuyên môn</h2>
              <p>
                Nội dung được đội ngũ HLV kiểm tra trước khi đăng lên website.
                Các bài viết được review bởi một HLV cụ thể sẽ hiển thị dòng
                &ldquo;Review chuyên môn&rdquo; kèm tên HLV và ngày review gần
                nhất trong phần thông tin bài viết. Bài viết không có dòng này
                là nội dung biên soạn chung của đội ngũ V2 Badminton.
              </p>
            </section>

            <section className="legal-page__section">
              <h2>Cập nhật nội dung</h2>
              <p>
                Kỹ thuật cầu lông và quy tắc BWF có thể thay đổi theo thời
                gian. Khi có cập nhật đáng kể, bài viết được chỉnh sửa và ngày
                &ldquo;Cập nhật&rdquo; trong phần thông tin bài sẽ phản ánh
                lần chỉnh sửa gần nhất.
              </p>
            </section>

            <section className="legal-page__section">
              <h2>Phản hồi và đính chính</h2>
              <p>
                Nếu bạn phát hiện thông tin chưa chính xác hoặc cần bổ sung,
                vui lòng liên hệ trực tiếp với V2 Badminton qua số điện thoại
                hoặc Zalo trên website. Chúng tôi sẽ xem xét và cập nhật trong
                thời gian sớm nhất.
              </p>
            </section>
          </>
        )}
      </div>
    </article>
  );
}
