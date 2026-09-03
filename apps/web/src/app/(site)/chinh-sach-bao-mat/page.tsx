import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { getStaticPage } from "@/lib/sanity";
import { canonicalUrl } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

const PATH = siteConfig.privacyPolicyPath;

// ─── Fallback constants ────────────────────────────────────────────────────
// Values match the previous hardcoded JSX exactly.
// Every CMS field falls back to these when the doc is absent or the field is
// null, keeping the output sanitized-diff-clean against the pre-W5 baseline.

const FALLBACK_SEO_TITLE =
  "Chính sách bảo mật | V2 Badminton";
const FALLBACK_SEO_DESCRIPTION =
  "Chính sách bảo mật dữ liệu đăng ký học thử, tư vấn lớp học và liên hệ của V2 Badminton.";
const FALLBACK_EYEBROW = "Pháp lý & quyền riêng tư";
const FALLBACK_H1 = "Chính sách bảo mật";
const FALLBACK_LEAD =
  "V2 Badminton chỉ sử dụng thông tin bạn gửi để tư vấn lớp học phù hợp, xác nhận lịch học thử, và hỗ trợ liên hệ khi bạn cần thêm thông tin.";

// ─── Metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getStaticPage("chinh-sach-bao-mat");
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

export default async function PrivacyPolicyPage() {
  const doc = await getStaticPage("chinh-sach-bao-mat");

  const eyebrow = doc?.eyebrow ?? FALLBACK_EYEBROW;
  const h1 = doc?.title ?? FALLBACK_H1;
  const lead = doc?.lead ?? FALLBACK_LEAD;
  const hasBody = doc?.body != null && doc.body.length > 0;

  return (
    <article className="legal-page">
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
              <h2>1. Dữ liệu chúng tôi thu thập</h2>
              <p>
                Khi bạn điền form đăng ký, chúng tôi có thể lưu họ tên, số điện thoại,
                khu vực học mong muốn, thời gian phù hợp và nội dung bạn chủ động cung
                cấp trong phần ghi chú.
              </p>
            </section>

            <section className="legal-page__section">
              <h2>2. Mục đích sử dụng</h2>
              <p>Thông tin được dùng để:</p>
              <ul>
                <li>Tư vấn lớp học, sân tập và khung giờ phù hợp.</li>
                <li>Xác nhận lịch học thử hoặc hỗ trợ đăng ký.</li>
                <li>Liên hệ lại khi có thay đổi lịch, lớp hoặc thông tin bạn yêu cầu.</li>
              </ul>
            </section>

            <section className="legal-page__section">
              <h2>3. Cách chúng tôi bảo vệ dữ liệu</h2>
              <p>
                Dữ liệu được xử lý qua các dịch vụ vận hành website, chống spam, giới hạn
                tần suất gửi form và theo dõi lỗi để giảm rủi ro vận hành. Chúng tôi không
                bán dữ liệu cá nhân cho bên thứ ba.
              </p>
            </section>

            <section className="legal-page__section">
              <h2>4. Chia sẻ dữ liệu</h2>
              <p>
                Dữ liệu chỉ được chia sẻ với các công cụ cần thiết để vận hành website,
                lưu lead, gửi thông báo và theo dõi lỗi kỹ thuật. Các bên này chỉ nhận
                dữ liệu tối thiểu cần thiết để thực hiện chức năng của họ.
              </p>
            </section>

            <section className="legal-page__section">
              <h2>5. Quyền của bạn</h2>
              <p>
                Bạn có thể yêu cầu cập nhật, chỉnh sửa hoặc xóa thông tin đã gửi bằng cách
                liên hệ trực tiếp với V2 Badminton qua số điện thoại hoặc kênh liên hệ trên
                website.
              </p>
            </section>

            <section className="legal-page__section">
              <h2>6. Cập nhật chính sách</h2>
              <p>
                Chính sách này có thể được cập nhật khi quy trình vận hành hoặc công cụ kỹ
                thuật thay đổi. Phiên bản hiển thị trên website là phiên bản đang có hiệu lực.
              </p>
            </section>
          </>
        )}
      </div>
    </article>
  );
}
