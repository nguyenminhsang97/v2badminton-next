# S3B-D2: Create 3 New Page Files voi `notFound()` Gate

## Objective

Tao 3 route files moi cho money pages, nhung gate bang `notFound()` cho toi khi Sanity co content that.

## Input

- `getMoneyPage(slug)` tu S3B-B1
- `MoneyPageTemplate` tu S3B-C1

## Output

```text
src/app/(site)/lop-cau-long-tre-em/page.tsx
src/app/(site)/lop-cau-long-cho-nguoi-di-lam/page.tsx
src/app/(site)/cau-long-doanh-nghiep/page.tsx
```

## Dependency

- S3B-C1

## Priority

- P1

## Acceptance Criteria

1. Tao 3 route files moi.
2. Moi route goi `getMoneyPage(slug)` voi slug tuong ung.
3. Neu query tra `null` -> `notFound()`.
4. Neu co data -> render `MoneyPageTemplate`.
5. Co `generateMetadata()` async doc metadata tu Sanity khi co data.
6. Khong can dung `buildMetadata()` hay `CoreRoutePath` trong ticket nay.
7. Khong sua `routes.ts` trong ticket nay.
8. Khong them vao `coreRoutes`, `SeoLinksBlock`, hoac sitemap trong ticket nay.
9. `npm run lint` va `npm run build` pass.

## Slug Mapping

- `/lop-cau-long-tre-em/` -> `lop-cau-long-tre-em`
- `/lop-cau-long-cho-nguoi-di-lam/` -> `lop-cau-long-cho-nguoi-di-lam`
- `/cau-long-doanh-nghiep/` -> `cau-long-doanh-nghiep`

## Edge Cases

### 1. Metadata khi `notFound()`

Khong can force metadata fallback neu route chua co content. 404 la expected.

### 2. Breadcrumb / JSON-LD

Chua them trong ticket nay. Se chi bo sung khi content verified va page that su sap publish.

## Non-Scope

- Chua publish route moi
- Chua add vao navigation
- Chua add vao sitemap

## Risk / Luu y

- Ticket nay chi tao route shell co gate. Khong duoc vo tinh expose route tren homepage truoc khi content ready.
