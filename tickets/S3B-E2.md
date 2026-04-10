# S3B-E2: Final Verification

## Objective

Day la gate cuoi cua Sprint 3B. Xac nhan homepage wrappers khong regression, money pages render dung, va publish gating hoat dong dung.

## Input

- S3B-A1, S3B-A2, S3B-A3
- S3B-B1
- S3B-C1
- S3B-D1
- S3B-D2
- S3B-E1

## Output

```text
Sprint 3B verified
```

## Dependency

- S3B-E1

## Priority

- P0

## Acceptance Criteria

### Homepage regression

1. Homepage pricing van render dung sau khi tach `PricingCards`.
2. Homepage locations van render dung sau khi tach `LocationsGrid`.
3. Homepage FAQ van render dung sau khi tach `FaqList`.
4. Homepage enterprise CTA van trigger business mode dung.

### Money pages

5. Money page template render dung khi co document Sanity.
6. 3 routes dang live van hoat dong khi `money_page` document chua co.
7. 3 routes moi `404` khi chua co content.
8. 3 routes moi mo duoc khi da co content.

### Publish gating

9. Route da publish xuat hien trong `coreRoutes`.
10. Route da publish xuat hien trong `SeoLinksBlock`.
11. Route da publish xuat hien trong sitemap.
12. Route chua publish khong xuat hien trong 3 noi tren.

### Build

13. `npm run lint` pass.
14. `npm run build` pass.

## Edge Cases

### 1. Mixed state

Co the co route da co file va co content, nhung chua publish metadata. Day la state hop le trong qua trinh rollout.

### 2. Cross-page CTA

Money page CTA `/#lien-he` phai dieu huong dung ve homepage contact section.

### 3. Metadata split

3 routes live co the dang o branch money-page mode hoac legacy fallback mode. Ca hai deu phai render metadata hop le.

## Non-Scope

- Khong them feature moi
- Khong them per-page contact section
- Khong toi uu images

## Risk / Luu y

- Neu bat ky verify nao fail, quay lai fix ticket nguon. Khong nhet code ngau nhien vao E2.
