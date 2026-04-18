import Link from "next/link";
import type { SiteChromeSettings } from "@/components/layout/siteSettings";
import {
  FacebookIcon,
  FeatherMarkIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
} from "@/components/ui/BrandIcons";
import { HOME_SECTION_IDS, toHomepageHash } from "@/lib/anchors";
import { coreRoutes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

type FooterProps = {
  siteSettings: SiteChromeSettings;
};

const legalLinks = [
  { href: siteConfig.privacyPolicyPath, label: "Chính sách bảo mật" },
  { href: toHomepageHash(HOME_SECTION_IDS.contact), label: "Điều khoản hỗ trợ" },
  { href: toHomepageHash(HOME_SECTION_IDS.pricing), label: "Học phí & hoàn phí" },
] as const;

export function Footer({ siteSettings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const academyLinks = [
    { href: toHomepageHash(HOME_SECTION_IDS.courses), label: "Khóa học" },
    { href: toHomepageHash(HOME_SECTION_IDS.schedule), label: "Lịch học" },
    { href: toHomepageHash(HOME_SECTION_IDS.faq), label: "Hỏi đáp" },
    { href: "/huan-luyen-vien/", label: "Đội ngũ HLV" },
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
            Lớp cầu lông tại Bình Thạnh &amp; Thủ Đức cho trẻ em, người mới và
            người đi làm.
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
            <h3 className="site-footer__heading">Khám phá</h3>
            <div className="site-footer__stack">
              {academyLinks.map((link) => (
                <Link key={link.href} href={link.href} className="site-footer__link">
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="site-footer__column">
            <h3 className="site-footer__heading">Liên hệ nhanh</h3>
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
            </div>
          </section>
        </div>

        <div className="site-footer__meta">
          <span className="site-footer__meta-copy">
            &copy; {currentYear} {siteSettings.siteName}. Mọi thông tin đăng ký được
            dùng để tư vấn lớp học phù hợp.
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
