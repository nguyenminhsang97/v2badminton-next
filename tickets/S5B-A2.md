# S5B-A2 · Breadcrumbs on money pages

**Muc tieu:** Hien breadcrumb navigation tren money pages (`/lop-cau-long-tre-em/`, etc.) de user biet minh dang o dau va co the quay lai trang chu. Structured data BreadcrumbList da co trong `MoneyPageStructuredData.tsx` — chi can them visual breadcrumb.

**Thoi gian uoc luong:** 30 phut

**Phu thuoc:** S5A-A1 (CSS system can on truoc)

**Rui ro:** Thap. Them component nho, khong sua logic.

---

## Context cho junior

Money pages hien chi co `<h1>` lam dau dau page — khong co breadcrumb visual. User den tu Google khong biet site structure. JSON-LD BreadcrumbList da co (SEO), nhung user khong thay duoc.

Pattern: `Trang chu → [navLabel]`

VD: `Trang chu → Tre em` cho `/lop-cau-long-tre-em/`

**Nguon tham chieu:** `D:\V2\landing-page\seo-common.css` va cac static SEO pages da co visual breadcrumb + page-kicker kha ro rang. Ticket nay nen hoc dung rhythm do, khong chi them mot dong text don gian.

**Cac pattern cu the tu static site:**
- Separator dung `→` (arrow), khong phai `>` (chevron) — tao cam giac "flow" tu parent → child
- Link color dung `var(--v2-light)` (khong phai muted) — de user thay link ro hon
- Co "page-kicker" (eyebrow text) — dong text nho phia tren H1, lime color, uppercase, letter-spacing rong. Day la brand rhythm cua V2 tren tat ca SEO pages.

---

## Files can tao/sua

1. `src/components/money-page/Breadcrumb.tsx` — tao moi
2. `src/components/money-page/MoneyPageTemplate.tsx` — them breadcrumb
3. `src/app/globals.css` — them breadcrumb styles

---

## Buoc 1 — Tao Breadcrumb component

Tao `src/components/money-page/Breadcrumb.tsx`:

```tsx
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
              Trang chu
            </Link>
          </li>
          <li className="breadcrumb__item breadcrumb__item--current" aria-current="page">
            {route.navLabel}
          </li>
        </ol>
      </nav>
      <p className="page-kicker">{route.navLabel}</p>
    </div>
  );
}
```

**Tai sao `<nav aria-label="Breadcrumb">`?** WCAG landmark role — screen reader doc duoc "Breadcrumb navigation".

**Tai sao `<ol>` thay vi `<div>`?** Breadcrumb la ordered list — Google va screen readers hieu structure tot hon.

---

## Buoc 2 — Integrate vao MoneyPageTemplate

Mo `src/components/money-page/MoneyPageTemplate.tsx`:

### 2a. Them import + prop

```tsx
import { Breadcrumb } from "./Breadcrumb";
import type { CoreRoutePath } from "@/lib/routes";

export type MoneyPageTemplateProps = {
  page: SanityMoneyPage;
  path?: CoreRoutePath;  // ← optional — Phase 1 pages chua co trong coreRoutes
};
```

**Tai sao optional?** S5C-A3 tao 5 money pages moi theo Phase 1 (chi co type + fallback + page file). Cac pages nay chua nam trong `coreRoutes` va `coreRouteMap`, nen `Breadcrumb` component khong the look up route info. Khi path la `undefined`, Breadcrumb return null — page van render binh thuong, chi khong co breadcrumb.

Khi Phase 2 activate (them vao `coreRoutes`), chi can them `path={PATH}` vao `<MoneyPageTemplate>` call la breadcrumb tu dong hien.

### 2b. Render breadcrumb truoc hero

```tsx
export function MoneyPageTemplate({ page, path }: MoneyPageTemplateProps) {
  // ...

  return (
    <div className="money-page">
      {path ? <Breadcrumb currentPath={path} /> : null}
      <section className="money-page__hero">
        {/* ... existing */}
      </section>
      {/* ... rest */}
    </div>
  );
}
```

### 2c. Update existing money page files

Chi update cac money page **da co trong coreRoutes** (da qua Phase 2). Tim `<MoneyPageTemplate` va them `path={PATH}`:

```tsx
<MoneyPageTemplate page={resolvedPage} path={PATH} />
```

**Existing pages can sua:** `/lop-cau-long-tre-em/`, `/lop-cau-long-cho-nguoi-di-lam/`, `/cau-long-doanh-nghiep/`, va cac page khac da co trong `coreRoutes`.

**S5C-A3 Phase 1 pages:** Khong can them `path` — `<MoneyPageTemplate page={resolvedPage} />` van compile va render. Breadcrumb se tu dong hien khi Phase 2 activate va them `path` prop.

---

## Buoc 3 — CSS

Them vao `globals.css`:

```css
.breadcrumb-block {
  display: grid;
  gap: 8px;
  padding: 12px 0 24px;
}

.breadcrumb {
  /* no extra padding — breadcrumb-block owns spacing */
}

.breadcrumb__list {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  font-size: 0.85rem;
}

.breadcrumb__item::before {
  content: "→";
  color: var(--v2-muted);
  margin-right: 8px;
}

.breadcrumb__item:first-child::before {
  content: none;
}

.breadcrumb__link {
  color: var(--v2-light);
  transition: color 0.2s ease;
}

.breadcrumb__link:hover {
  color: var(--v2-lime);
}

.breadcrumb__item--current {
  color: var(--v2-light);
}

/* Page kicker — eyebrow text above H1 on money pages */
.page-kicker {
  color: var(--v2-lime);
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-top: 8px;
}
```

**Thay doi so voi ban dau:**
- Separator: `>` → `→` (theo static site pattern)
- Link color: `var(--v2-muted)` → `var(--v2-light)` (de user thay link ro hon)
- Padding bottom: `12px` → `24px` (them khoang cach truoc hero content)
- **Page kicker moi:** Dong text lime, uppercase, letter-spacing rong — brand rhythm cua V2 static site tren tat ca SEO pages. Hien navLabel lam eyebrow de user biet ngay page nay ve cai gi truoc khi doc H1.

---

## Cach verify

1. `npm run build` — pass
2. Dev server → `/lop-cau-long-tre-em/` → thay "Trang chu → Tre em" + page-kicker lime "TRE EM"
3. Click "Trang chu" → ve `/`
4. Homepage (`/`) → khong co breadcrumb (Breadcrumb return null khi path = "/")
5. Screen reader: doc duoc "Breadcrumb navigation" va list items
