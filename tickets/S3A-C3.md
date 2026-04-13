# S3A-C3: Wire `TestimonialsSection` vao Homepage

## Objective

Dua testimonials vao homepage tree ngay sau `CoachSection` de trust layer lien mach.

## Input

- `src/app/(site)/page.tsx`
- `getTestimonials()` tu S3A-C1
- `TestimonialsSection` tu S3A-C2

## Output

```text
src/app/(site)/page.tsx
```

## Dependency

- S3A-C2

## Priority

- P0

## Acceptance Criteria

1. Homepage `Promise.all` co them `getTestimonials()`.
2. `TestimonialsSection` duoc import va render tren homepage.
3. Render order moi:
   - `CourseSection`
   - `CoachSection`
   - `TestimonialsSection`
   - `ScheduleSection`
4. Khi testimonials rong, homepage van render binh thuong vi component tu hide.
5. `npm run lint` va `npm run build` pass.

## Edge Cases

### 1. Trust layer order

Section phai nam truoc `ScheduleSection`, khong day xuong sau `Locations` hay `FAQ`.

### 2. Empty dataset

Khong can if-check rieng o page level.

## Non-Scope

- Chua nhap content that
- Chua smoke test bang browser

## Risk / Luu y

- Nho giu homepage file readable sau khi them 2 queries moi va 2 section moi.
