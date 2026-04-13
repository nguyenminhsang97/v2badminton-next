import Link from "next/link";
import { coreRoutes, type CoreRoutePath } from "@/lib/routes";

/**
 * Routes that are preview-ready in Sprint 2.
 * Maintain this list: only expose links that resolve 200 in preview.
 * When Sprint 3 pages land, add their paths here.
 */
const PREVIEW_READY_ROUTES: readonly CoreRoutePath[] = [
  "/hoc-cau-long-cho-nguoi-moi/",
  "/lop-cau-long-binh-thanh/",
  "/lop-cau-long-thu-duc/",
] as const;

const seoPageRoutes = coreRoutes.filter(
  (r): r is (typeof coreRoutes)[number] =>
    r.path !== "/" && PREVIEW_READY_ROUTES.includes(r.path),
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
