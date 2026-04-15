import Link from "next/link";
import type { SiteChromeSettings } from "@/components/layout/siteSettings";
import { coreRoutes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

type FooterProps = {
  siteSettings: SiteChromeSettings;
};

export function Footer({ siteSettings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const academyLinks = [
    { href: "/#khoa-hoc", label: "Khóa học" },
    { href: "/#lich-hoc", label: "Lịch học" },
    { href: "/#hoi-dap", label: "Hỏi đáp" },
    { href: "/blog/", label: "Blog" },
  ] as const;
  const featuredRoutes = coreRoutes.filter((route) =>
    [
      "/hoc-cau-long-cho-nguoi-moi/",
      "/lop-cau-long-binh-thanh/",
      "/lop-cau-long-thu-duc/",
      "/lop-cau-long-tre-em/",
    ].includes(route.path),
  );

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <strong className="site-footer__brand-name">{siteSettings.siteName}</strong>
          <p className="site-footer__brand-copy">
            Lộ trình học cầu lông rõ ràng cho người mới, trẻ em, người đi làm và
            doanh nghiệp tại Bình Thạnh và Thủ Đức.
          </p>
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
            <h3 className="site-footer__heading">V2 Badminton</h3>
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
              <a href={`tel:${siteSettings.phoneE164}`} className="site-footer__link">
                Hotline: {siteSettings.phoneDisplay}
              </a>
              <a
                href={`https://zalo.me/${siteSettings.zaloNumber}`}
                className="site-footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Zalo: {siteSettings.zaloNumber}
              </a>
              <span className="site-footer__meta-copy">Bình Thạnh &amp; Thủ Đức, TP.HCM</span>
            </div>
          </section>

          <section className="site-footer__column">
            <h3 className="site-footer__heading">Kết nối</h3>
            <div className="site-footer__stack">
              <a
                href={siteSettings.facebookUrl}
                className="site-footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <Link href={siteConfig.privacyPolicyPath} className="site-footer__link">
                Chính sách bảo mật
              </Link>
            </div>
          </section>
        </div>

        <div className="site-footer__meta">
          <span className="site-footer__meta-copy">
            Thông tin đăng ký được dùng để tư vấn lớp học phù hợp.
          </span>
          <span className="site-footer__meta-copy">
            &copy; {currentYear} {siteSettings.siteName}.
          </span>
        </div>
      </div>
    </footer>
  );
}
