import Link from "next/link";
import { coreRouteMap, type CoreRoutePath } from "@/lib/routes";

export type BreadcrumbProps = {
  currentPath: CoreRoutePath;
};

export function Breadcrumb({ currentPath }: BreadcrumbProps) {
  const route = coreRouteMap[currentPath];

  if (!route || currentPath === "/") {
    return null;
  }

  return (
    <div className="breadcrumb-block">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol className="breadcrumb__list">
          <li className="breadcrumb__item">
            <Link href="/" className="breadcrumb__link">
              Trang chủ
            </Link>
          </li>
          <li
            className="breadcrumb__item breadcrumb__item--current"
            aria-current="page"
          >
            {route.navLabel}
          </li>
        </ol>
      </nav>
      <p className="page-kicker">{route.navLabel}</p>
    </div>
  );
}
