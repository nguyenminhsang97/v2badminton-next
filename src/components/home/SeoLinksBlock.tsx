import Link from "next/link";
import { coreRoutes, type CoreRoutePath } from "@/lib/routes";

const PREVIEW_READY_ROUTES: readonly CoreRoutePath[] = [
  "/hoc-cau-long-cho-nguoi-moi/",
  "/lop-cau-long-binh-thanh/",
  "/lop-cau-long-thu-duc/",
  "/lop-cau-long-tre-em/",
  "/lop-cau-long-cho-nguoi-di-lam/",
  "/cau-long-doanh-nghiep/",
] as const;

const seoPageRoutes = coreRoutes.filter(
  (route): route is (typeof coreRoutes)[number] =>
    route.path !== "/" && PREVIEW_READY_ROUTES.includes(route.path),
);

export function SeoLinksBlock() {
  if (seoPageRoutes.length === 0) return null;

  return (
    <section className="section seo-links" id="seo-links">
      <div className="section__header">
        <h2 className="section__title">Tìm lớp cầu lông phù hợp</h2>
      </div>
      <div className="seo-links__grid">
        {seoPageRoutes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className="seo-links__card"
          >
            <strong className="seo-links__card-title">{route.navLabel}</strong>
            <p className="seo-links__card-desc">{route.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
