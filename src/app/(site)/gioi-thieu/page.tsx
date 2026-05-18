import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/ui/JsonLd";
import { canonicalUrl } from "@/lib/routes";
import { buildBreadcrumbSchema, buildOrganizationSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

const PATH = "/gioi-thieu/";
const TITLE = "Giới thiệu V2 Badminton | Học viện cầu lông Bình Thạnh & Thủ Đức";
const DESCRIPTION =
  "V2 Badminton là học viện dạy cầu lông tại Bình Thạnh và Thủ Đức, TP.HCM, hoạt động từ năm 2012. Đào tạo trẻ em, người mới, người đi làm và doanh nghiệp.";

export const metadata: Metadata = {
  title: {
    absolute: TITLE,
  },
  description: DESCRIPTION,
  alternates: {
    canonical: canonicalUrl(PATH),
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: canonicalUrl(PATH),
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    type: "article",
    images: [canonicalUrl(siteConfig.defaultOgImagePath)],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [canonicalUrl(siteConfig.defaultOgImagePath)],
  },
};

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Trang chủ", item: canonicalUrl("/") },
  { name: "Giới thiệu", item: canonicalUrl(PATH) },
]);

export default function AboutPage() {
  return (
    <article className="legal-page">
      <JsonLd
        id="about-schema"
        data={[buildOrganizationSchema(), breadcrumbSchema]}
      />

      <div className="legal-page__hero">
        <p className="legal-page__eyebrow">Giới thiệu</p>
        <h1 className="legal-page__title">
          Về V2 Badminton — học viện cầu lông tại Bình Thạnh &amp; Thủ Đức
        </h1>
        <p className="legal-page__lead">
          V2 Badminton là học viện dạy cầu lông tại TP.HCM, hoạt động liên tục
          từ năm 2012 và do HLV trưởng Bùi Trần Quốc Việt sáng lập. Chúng tôi
          dạy trẻ em, người mới, người đi làm và doanh nghiệp tại các sân ở
          Bình Thạnh và Thủ Đức.
        </p>
      </div>

      <div className="legal-page__content">
        <section className="legal-page__section">
          <h2>V2 Badminton là ai?</h2>
          <p>
            V2 Badminton là một hệ thống đào tạo cầu lông, không phải một lớp
            học lẻ. Được thành lập năm 2012 bởi HLV trưởng Bùi Trần Quốc Việt,
            V2 xây dựng lộ trình học theo cấp độ và duy trì đội ngũ HLV riêng
            thay vì thuê giáo viên thời vụ. Toàn bộ hoạt động tập trung tại
            Bình Thạnh và Thủ Đức, TP.HCM.
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
              <strong>Người mới:</strong> nhóm nhỏ, học từ cách cầm vợt và di
              chuyển đến đánh đôi cơ bản.
            </li>
            <li>
              <strong>Người đi làm:</strong> khung giờ tối và cuối tuần để duy
              trì tập luyện đều đặn.
            </li>
            <li>
              <strong>Doanh nghiệp:</strong> buổi cầu lông team building và lớp
              theo nhóm công ty.
            </li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2>Đội ngũ huấn luyện viên gồm những ai?</h2>
          <p>
            Điểm khác biệt của V2 là phần lớn huấn luyện viên trưởng thành từ
            chính học viên do V2 đào tạo, nên cách dạy thống nhất qua từng cấp
            độ:
          </p>
          <ul>
            <li>
              <strong>2012:</strong> HLV trưởng Bùi Trần Quốc Việt thành lập V2
              Badminton.
            </li>
            <li>
              <strong>2016:</strong> bắt đầu đào tạo học viên thành HLV nội bộ
              và huấn luyện thêm các HLV mới.
            </li>
            <li>
              <strong>2020:</strong> HLV Nguyễn Minh Sang phụ trách lớp thiếu
              nhi.
            </li>
            <li>
              <strong>2023:</strong> HLV Đinh Nguyễn Nhật Nam tham gia đội ngũ.
            </li>
            <li>
              <strong>2024:</strong> HLV Nguyễn Thị Hoàng Mai và Dương Đức Huy
              ra mắt, đều trưởng thành từ học viên V2.
            </li>
          </ul>
          <p>
            HLV trưởng Bùi Trần Quốc Việt cùng các HLV Nguyễn Minh Sang và
            Đinh Nguyễn Nhật Nam có chứng chỉ BWF Coach Level 1 của Liên đoàn
            Cầu lông Thế giới (BWF).
          </p>
          <p>
            Xem chi tiết tại{" "}
            <Link href="/huan-luyen-vien/">trang đội ngũ huấn luyện viên</Link>.
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
              <a href={`tel:${siteConfig.phoneE164}`}>
                {siteConfig.phoneDisplay}
              </a>
            </li>
            <li>
              Zalo:{" "}
              <a
                href={`https://zalo.me/${siteConfig.zaloNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {siteConfig.zaloNumber}
              </a>
            </li>
            <li>
              Facebook:{" "}
              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                facebook.com/v2badmintonhcm
              </a>
            </li>
            <li>Khu vực: Bình Thạnh &amp; Thủ Đức, TP.HCM.</li>
          </ul>
        </section>
      </div>
    </article>
  );
}
