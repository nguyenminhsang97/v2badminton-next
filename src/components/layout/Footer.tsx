import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <strong>{siteConfig.name}</strong>
          <p>Dạy cầu lông tại Bình Thạnh &amp; Thủ Đức, TP.HCM.</p>
        </div>

        <div className="site-footer__links">
          <a href={`tel:${siteConfig.phoneE164}`} className="site-footer__link">
            ĐT/Zalo: {siteConfig.phoneDisplay}
          </a>
          <a
            href={`https://zalo.me/${siteConfig.zaloNumber}`}
            className="site-footer__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Zalo
          </a>
          <a
            href={siteConfig.facebookUrl}
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
          <span>&copy; 2026 {siteConfig.name}.</span>
        </div>
      </div>
    </footer>
  );
}
