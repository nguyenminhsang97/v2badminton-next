import Link from "next/link";
import {
  CameraIcon,
  FacebookIcon,
  FeatherMarkIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
  PlayIcon,
} from "@/components/ui/BrandIcons";
import type { SiteChromeSettings } from "@/components/layout/siteSettings";
import { coreRoutes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

type FooterProps = {
  siteSettings: SiteChromeSettings;
};

const legalLinks = [
  { href: siteConfig.privacyPolicyPath, label: "Chính sách bảo mật" },
  { href: "/#lien-he", label: "Điều khoản hỗ trợ" },
  { href: "/#hoc-phi", label: "Học phí & hoàn phí" },
] as const;

export function Footer({ siteSettings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const academyLinks = [
    { href: "/#khoa-hoc", label: "Khóa học" },
    { href: "/#lich-hoc", label: "Lịch học" },
    { href: "/#dia-diem", label: "Địa điểm" },
    { href: "/#hoi-dap", label: "Hỏi đáp" },
    { href: "/blog/", label: "Blog" },
  ] as const;
  const featuredRoutes = coreRoutes.filter((route) =>
    [
      "/hoc-cau-long-cho-nguoi-moi/",
      "/lop-cau-long-binh-thanh/",
      "/lop-cau-long-thu-duc/",
      "/lop-cau-long-tre-em/",
      "/lop-cau-long-cho-nguoi-di-lam/",
      "/cau-long-doanh-nghiep/",
    ].includes(route.path),
  );

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <div className="site-footer__logo">
            <span className="site-footer__logo-mark">
              <FeatherMarkIcon className="site-footer__logo-icon" />
            </span>
            <div className="site-footer__logo-copy">
              <strong className="site-footer__brand-name">{siteSettings.siteName}</strong>
              <span className="site-footer__brand-subtitle">Bình Thạnh · Thủ Đức</span>
            </div>
          </div>
          <p className="site-footer__brand-copy">
            Lộ trình học cầu lông rõ ràng cho người mới, trẻ em, người đi làm và doanh nghiệp tại
            Bình Thạnh và Thủ Đức.
          </p>
          <div className="site-footer__socials">
            <a
              href={siteSettings.facebookUrl}
              className="site-footer__social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook V2 Badminton"
            >
              <FacebookIcon className="site-footer__social-icon" />
            </a>
            <a
              href={`https://zalo.me/${siteSettings.zaloNumber}`}
              className="site-footer__social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Zalo V2 Badminton"
            >
              <MessageCircleIcon className="site-footer__social-icon" />
            </a>
            <a
              href={`tel:${siteSettings.phoneE164}`}
              className="site-footer__social-link"
              aria-label="Hotline V2 Badminton"
            >
              <PhoneIcon className="site-footer__social-icon" />
            </a>
          </div>
        </div>

        <div className="site-footer__columns">
          <section className="site-footer__column">
            <h3 className="site-footer__heading">Lộ trình nổi bật</h3>
            <div className="site-footer__stack">
              {featuredRoutes.map((route) => (
                <Link key={route.path} href={route.path} className="site-footer__link">
                  {route.navLabel}
                </Link>
              ))}
            </div>
          </section>

          <section className="site-footer__column">
            <h3 className="site-footer__heading">Đi nhanh trong site</h3>
            <div className="site-footer__stack">
              {academyLinks.map((link) => (
                <Link key={link.href} href={link.href} className="site-footer__link">
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="site-footer__column">
            <h3 className="site-footer__heading">Liên hệ</h3>
            <div className="site-footer__stack">
              <span className="site-footer__detail">
                <MapPinIcon className="site-footer__detail-icon" />
                Bình Thạnh &amp; Thủ Đức, TP.HCM
              </span>
              <a href={`tel:${siteSettings.phoneE164}`} className="site-footer__detail">
                <PhoneIcon className="site-footer__detail-icon" />
                {siteSettings.phoneDisplay}
              </a>
              <a
                href={`https://zalo.me/${siteSettings.zaloNumber}`}
                className="site-footer__detail"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircleIcon className="site-footer__detail-icon" />
                Zalo {siteSettings.zaloNumber}
              </a>
              <span className="site-footer__detail">
                <PlayIcon className="site-footer__detail-icon" />
                Phản hồi trong ngày
              </span>
            </div>
          </section>

          <section className="site-footer__column">
            <h3 className="site-footer__heading">Tài nguyên</h3>
            <div className="site-footer__stack">
              <Link href="/blog/" className="site-footer__link">
                Xem bài viết hướng dẫn
              </Link>
              <Link href="/#hoi-dap" className="site-footer__link">
                Câu hỏi thường gặp
              </Link>
              <Link href="/#hoc-phi" className="site-footer__link">
                Học phí và lịch học
              </Link>
              <span className="site-footer__detail">
                <CameraIcon className="site-footer__detail-icon" />
                Cập nhật nội dung hằng tuần
              </span>
            </div>
          </section>
        </div>

        <div className="site-footer__meta">
          <span className="site-footer__meta-copy">
            &copy; {currentYear} {siteSettings.siteName}. Mọi thông tin đăng ký được dùng để tư vấn
            lớp học phù hợp.
          </span>
          <div className="site-footer__legal-links">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="site-footer__legal-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
