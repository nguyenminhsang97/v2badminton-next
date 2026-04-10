# S3A-B3: Wire `CoachSection` vao Homepage

## Objective

Dua coach data vao homepage tree dung thu tu moi cua trust layer, sau `CourseSection` va truoc `ScheduleSection`.

## Input

- `src/app/(site)/page.tsx`
- `getCoaches()` tu S3A-B1
- `CoachSection` tu S3A-B2

## Output

```text
src/app/(site)/page.tsx
```

## Dependency

- S3A-B2

## Priority

- P0

## Acceptance Criteria

1. Homepage `Promise.all` co them `getCoaches()`.
2. `CoachSection` duoc import vao homepage.
3. Render order moi tren homepage la:
   - `HeroSection`
   - `PricingSection`
   - `WhySection`
   - `CourseSection`
   - `CoachSection`
   - `TestimonialsSection` se vao sau o ticket S3A-C3
   - `ScheduleSection`
4. Coach section khong chen vao sau `BusinessSection`.
5. Khi `coaches` rong, homepage van render binh thuong vi `CoachSection` tu `return null`.
6. `npm run lint` va `npm run build` pass.

## Edge Cases

### 1. Empty dataset

Khong can check rieng o page level. Component da tu handle empty.

### 2. Render order

Thu tu section la mot phan acceptance quan trong cua ticket nay, khong chi can "co render".

## Non-Scope

- Chua wire testimonials
- Chua nhap data that vao Studio
- Chua smoke test section moi

## Risk / Luu y

- Homepage file da co nhieu imports va queries. Nho giu `Promise.all` gon va dung thu tu de review de do.
