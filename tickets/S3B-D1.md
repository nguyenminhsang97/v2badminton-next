# S3B-D1: Convert 3 Live Pages voi Safe Fallback

## Objective

Nang cap 3 routes dang live sang `MoneyPageTemplate` khi co document Sanity, nhung van fallback ve implementation Sprint 2 neu content chua san sang.

## Input

- `getMoneyPage(slug)` tu S3B-B1
- `MoneyPageTemplate` tu S3B-C1
- 3 page files dang live:
  - `src/app/(site)/hoc-cau-long-cho-nguoi-moi/page.tsx`
  - `src/app/(site)/lop-cau-long-binh-thanh/page.tsx`
  - `src/app/(site)/lop-cau-long-thu-duc/page.tsx`

## Output

```text
src/app/(site)/hoc-cau-long-cho-nguoi-moi/page.tsx
src/app/(site)/lop-cau-long-binh-thanh/page.tsx
src/app/(site)/lop-cau-long-thu-duc/page.tsx
```

## Dependency

- S3B-C1

## Priority

- P0

## Acceptance Criteria

1. Moi page goi `getMoneyPage(slug)` theo slug tuong ung.
2. Neu `getMoneyPage(slug)` co data:
   - render `MoneyPageTemplate`
   - emit metadata tu `metaTitle` / `metaDescription`
3. Neu `getMoneyPage(slug)` la `null`:
   - khong `notFound()`
   - fallback ve implementation Sprint 2 hien tai
   - fallback metadata ve `buildMetadata(...)`
4. Breadcrumb schema va FAQ schema van duoc giu o page level.
5. 3 routes live khong bao gio bi 404 chi vi `money_page` document chua co.
6. Xoa static `export const metadata = buildMetadata(...)` khi chuyen sang `generateMetadata()`.
7. `generateMetadata()` phai branch:
   - co `money_page` -> doc `metaTitle` / `metaDescription` tu Sanity
   - khong co `money_page` -> return `buildMetadata(...)` nhu truoc
8. `npm run lint` va `npm run build` pass.

## Fallback Rule

Pattern mong muon:

```ts
const moneyPage = await getMoneyPage(slug);

if (!moneyPage) {
  return <LegacyImplementation ... />;
}

return <MoneyPageTemplate page={moneyPage} />;
```

## Edge Cases

### 1. Metadata

`generateMetadata()` phai support ca 2 branch:

- branch co document
- branch fallback Sprint 2

### 2. Legacy implementation

Khong rewrite skeleton fallback thanh component moi neu khong can. Uu tien giu behavior Sprint 2.

### 3. Next.js metadata export

Khong duoc giu dong thoi:

- `export const metadata = ...`
- `export async function generateMetadata()`

Moi file page chi duoc co mot trong hai.

### 4. Route stability

Day la ticket SEO-sensitive. Bat ky 404 nao tren 3 routes nay deu coi la fail.

## Non-Scope

- Chua create routes moi
- Chua publish route moi trong `routes.ts`

## Risk / Luu y

- De tranh bug, co the tach helper render legacy block rieng trong file, nhung khong duoc mat behavior Sprint 2.
