# S3B-E1: Content Entry + Atomic Publish Gate

## Objective

Nhap content `money_page` vao Sanity va chi publish route khi da verify bang mot commit atomic cap nhat routing metadata.

## Input

- `money_page` schema da co
- Route files da xong o S3B-D1 / S3B-D2
- `routes.ts`
- `src/components/home/SeoLinksBlock.tsx`

## Output

```text
Sanity money_page documents
src/lib/routes.ts
src/components/home/SeoLinksBlock.tsx
```

## Dependency

- S3B-D1
- S3B-D2

## Priority

- P0

## Acceptance Criteria

1. Tao `money_page` documents cho:
   - `hoc-cau-long-cho-nguoi-moi`
   - `lop-cau-long-binh-thanh`
   - `lop-cau-long-thu-duc`
   - `lop-cau-long-tre-em`
   - `lop-cau-long-cho-nguoi-di-lam`
   - `cau-long-doanh-nghiep`
2. Route moi nao chua verified thi khong duoc them vao publish metadata.
3. Khi publish route moi nao, commit gate phai gom dong thoi:
   - them vao `CoreRoutePath`
   - them vao `coreRoutes`
   - them vao `PREVIEW_READY_ROUTES`
4. Khong mo rong `CoreRoutePath` som hon `coreRoutes`.
5. `sitemap.ts` tu dong pick up route moi qua `coreRoutes`, khong can hardcode rieng.
6. Route da publish se:
   - accessible
   - xuat hien trong `SeoLinksBlock`
   - xuat hien trong sitemap

## Publish Rule

Atomic commit nghia la:

- khong co commit trung gian chi them route type
- khong co commit trung gian chi them `SeoLinksBlock`
- khong co commit trung gian chi them sitemap exposure

## Edge Cases

### 1. Partial rollout

Co the publish tung route mot, khong can doi du 6 route.

### 2. 3 route dang live

3 route dang live da ton tai san trong:

- `CoreRoutePath`
- `coreRoutes`
- `PREVIEW_READY_ROUTES`

Khong can commit publish gate cho chung.

Khi `money_page` document co data trong Sanity, 3 page nay tu dong switch sang `MoneyPageTemplate`.

Publish gate chi ap dung cho 3 route moi.

## Non-Scope

- Chua verify browser cuoi cung
- Chua tiep tuc campaign pages

## Risk / Luu y

- Day la ticket de dam bao type safety va publish safety. Neu lam khong atomic se tao route state lech giua runtime va metadata.
