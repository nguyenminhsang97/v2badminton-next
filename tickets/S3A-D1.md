# S3A-D1: Data Entry + Smoke Test

## Objective

Day la gate cuoi cua Sprint 3A. Xac nhan trust layer co data that, homepage khong regression, va enterprise level tag van render dung class.

## Input

- S3A-A1, S3A-B3, S3A-C3 da xong
- Sanity Studio co the tao / sua documents

## Output

```text
Homepage runtime verified
Coach data entered
Testimonial data entered
```

## Dependency

- S3A-A1
- S3A-B3
- S3A-C3

## Priority

- P0

## Acceptance Criteria

### Content entry

1. Tao it nhat `2` coach documents trong Sanity.
2. Tao it nhat `3` testimonial documents trong Sanity.

### Smoke test

3. Homepage render `CoachSection` dung data.
4. Homepage render `TestimonialsSection` dung data.
5. Khong co JS error hoac Next error overlay khi load homepage.
6. Xoa het coach data -> coach section tu an.
7. Xoa het testimonial data -> testimonials section tu an.
8. Khong co layout gap vo ly khi mot trong hai section bi an.

### Regression check

9. Tao `schedule_block` co `levels: ["doanh_nghiep"]`.
10. Card schedule render class `level-tag--doanh-nghiep`.
11. Card schedule khong render nham `level-tag--nang-cao`.

### Build

12. `npm run lint` pass.
13. `npm run build` pass.

## Verification Notes

- Regression check nay thay the old fix ticket cua Sprint 3A.
- Neu dataset that chua san sang, can verify it nhat voi records test va xoa / disable sau do neu can.

## Non-Scope

- Khong them feature moi
- Khong polish content ngoai trust layer
- Khong verify money pages

## Risk / Luu y

- Day la gate runtime, neu fail thi quay lai fix ticket nguon, khong nhet random code vao D1.
