"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { coreRoutes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";
import { trackEvent } from "@/lib/tracking";

const primaryLinks = [
  { href: "/#hoc-phi", label: "Học phí" },
  { href: "/#khoa-hoc", label: "Khóa học" },
  { href: "/#lich-hoc", label: "Lịch học" },
  { href: "/#dia-diem", label: "Địa điểm" },
  { href: "/#doanh-nghiep", label: "Doanh nghiệp" },
  { href: "/#hoi-dap", label: "Hỏi đáp" },
] as const;

const seoPageLinks = coreRoutes
  .filter((route) => route.path !== "/")
  .map((route) => ({
    href: route.path,
    label: route.navLabel,
  })) as readonly { href: string; label: string }[];

export function Nav() {
  const pathname = usePathname();
  const mobileNavRef = useRef<HTMLDetailsElement>(null);
  const pageType = coreRoutes.find(
    (route) => route.path === withTrailingSlash(pathname),
  )?.pageType;

  useEffect(() => {
    mobileNavRef.current?.removeAttribute("open");
  }, [pathname]);

  function trackNavCtaClick() {
    trackEvent("cta_click", {
      cta_name: "dang_ky_ngay",
      cta_location: "nav",
      page_type: pageType,
      page_path: pathname ?? "/",
    });
  }

  function closeMobileMenu() {
    mobileNavRef.current?.removeAttribute("open");
  }

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
          {seoPageLinks.map((link) => (
            <Link key={link.href} href={link.href} className="site-nav__link">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#lien-he"
          className="site-nav__cta"
          data-cta-name="dang_ky_ngay"
          data-cta-location="nav"
          onClick={trackNavCtaClick}
        >
          Đăng ký ngay
        </Link>

        <details ref={mobileNavRef} className="site-nav site-nav--mobile">
          <summary className="site-nav__summary" aria-label="Mở menu">
            Menu
          </summary>
          <div className="site-nav__panel">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="site-nav__mobile-link"
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
            {seoPageLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="site-nav__mobile-link"
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#lien-he"
              className="site-nav__mobile-cta"
              data-cta-name="dang_ky_ngay"
              data-cta-location="nav"
              onClick={() => {
                trackNavCtaClick();
                closeMobileMenu();
              }}
            >
              Đăng ký ngay
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}

function withTrailingSlash(pathname: string | null): string {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}
