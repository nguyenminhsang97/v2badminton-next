"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FeatherMarkIcon, PhoneIcon } from "@/components/ui/BrandIcons";
import type { SiteChromeSettings } from "@/components/layout/siteSettings";
import { coreRoutes } from "@/lib/routes";
import { trackEvent } from "@/lib/tracking";

const primaryLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/#khoa-hoc", label: "Khóa học" },
  { href: "/#hlv", label: "Huấn luyện viên" },
  { href: "/#lich-hoc", label: "Lịch tập" },
  { href: "/blog/", label: "Blog" },
  { href: "/#lien-he", label: "Liên hệ" },
] as const;

type NavProps = {
  siteSettings: Pick<
    SiteChromeSettings,
    "siteName" | "phoneDisplay" | "phoneE164"
  >;
};

export function Nav({ siteSettings }: NavProps) {
  const pathname = usePathname();
  const mobileNavRef = useRef<HTMLDetailsElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const normalizedPath = withTrailingSlash(pathname);
  const pageType = coreRoutes.find(
    (route) => route.path === normalizedPath,
  )?.pageType;

  useEffect(() => {
    mobileNavRef.current?.removeAttribute("open");
  }, [pathname]);

  useEffect(() => {
    const forceSolid = normalizedPath !== "/";

    function syncScrollState() {
      setIsScrolled(forceSolid || window.scrollY > 20);
    }

    syncScrollState();
    window.addEventListener("scroll", syncScrollState, { passive: true });
    return () => window.removeEventListener("scroll", syncScrollState);
  }, [normalizedPath]);

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
    <header
      className={`site-header ${isScrolled ? "site-header--scrolled" : "site-header--floating"}`}
    >
      <div className="site-header__inner">
        <Link href="/" className="site-logo" aria-label={siteSettings.siteName}>
          <span className="site-logo__mark">
            <FeatherMarkIcon className="site-logo__icon" />
          </span>
          <span className="site-logo__copy">
            <strong className="site-logo__title">{siteSettings.siteName}</strong>
            <span className="site-logo__subtitle">BÌNH THẠNH · THỦ ĐỨC</span>
          </span>
        </Link>

        <div className="site-header__desktop-shell">
          <nav className="site-nav site-nav--desktop" aria-label="Điều hướng chính">
            {primaryLinks.map((link) => (
              <Link key={link.href} href={link.href} className="site-nav__link">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="site-nav__actions">
            <a href={`tel:${siteSettings.phoneE164}`} className="site-nav__phone">
              <PhoneIcon className="site-nav__phone-icon" />
              <strong>{siteSettings.phoneDisplay}</strong>
            </a>
            <Link
              href="/#lien-he"
              className="site-nav__cta"
              data-cta-name="dang_ky_ngay"
              data-cta-location="nav"
              onClick={trackNavCtaClick}
            >
              Đăng ký học thử
            </Link>
          </div>
        </div>

        <details ref={mobileNavRef} className="site-nav site-nav--mobile">
          <summary className="site-nav__summary" aria-label="Mở menu">
            <span />
            <span />
            <span />
          </summary>
          <div className="site-nav__panel">
            <p className="site-nav__group-title">Menu</p>
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

            <a href={`tel:${siteSettings.phoneE164}`} className="site-nav__mobile-phone">
              Gọi {siteSettings.phoneDisplay}
            </a>

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
              Đăng ký học thử
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
