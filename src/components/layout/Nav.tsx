import Link from "next/link";
import { siteConfig } from "@/lib/site";

const primaryLinks = [
  { href: "/#hoc-phi", label: "Học phí" },
  { href: "/#khoa-hoc", label: "Khóa học" },
  { href: "/#lich-hoc", label: "Lịch học" },
  { href: "/#dia-diem", label: "Địa điểm" },
  { href: "/#doanh-nghiep", label: "Doanh nghiệp" },
  { href: "/#hoi-dap", label: "Hỏi đáp" },
] as const;

export function Nav() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-logo" aria-label="V2 Badminton">
          {siteConfig.name}
        </Link>

        <nav className="site-nav site-nav--desktop" aria-label="Điều hướng chính">
          {primaryLinks.map((link) => (
            <Link key={link.href} href={link.href} className="site-nav__link">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/#lien-he" className="site-nav__cta">
          Đăng ký ngay
        </Link>

        <details className="site-nav site-nav--mobile">
          <summary className="site-nav__summary" aria-label="Mở menu">
            Menu
          </summary>
          <div className="site-nav__panel">
            {primaryLinks.map((link) => (
              <Link key={link.href} href={link.href} className="site-nav__mobile-link">
                {link.label}
              </Link>
            ))}
            <Link href="/#lien-he" className="site-nav__mobile-cta">
              Đăng ký ngay
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
