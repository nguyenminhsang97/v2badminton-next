import Link from "next/link";
import type { SiteChromeSettings } from "@/components/layout/siteSettings";

type FooterProps = {
  siteSettings: SiteChromeSettings;
};

export function Footer({ siteSettings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <strong>{siteSettings.siteName}</strong>
          <p>Dạy cầu lông tại Bình Thạnh &amp; Thủ Đức, TP.HCM.</p>
        </div>

        <div className="site-footer__links">
          <a href={`tel:${siteSettings.phoneE164}`} className="site-footer__link">
            ĐT/Zalo: {siteSettings.phoneDisplay}
          </a>
          <a
            href={`https://zalo.me/${siteSettings.zaloNumber}`}
            className="site-footer__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Zalo
          </a>
          <a
            href={siteSettings.facebookUrl}
            className="site-footer__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <Link href="/hoc-cau-long-cho-nguoi-moi/" className="site-footer__link">
            Trang cho người mới
          </Link>
          <Link href="/lop-cau-long-binh-thanh/" className="site-footer__link">
            Lớp Bình Thạnh
          </Link>
          <Link href="/lop-cau-long-thu-duc/" className="site-footer__link">
            Lớp Thủ Đức
          </Link>
        </div>

        <div className="site-footer__meta">
          <span>Thông tin đăng ký được dùng để tư vấn lớp học phù hợp.</span>
          <span>&copy; {currentYear} {siteSettings.siteName}.</span>
        </div>
      </div>
    </footer>
  );
}
