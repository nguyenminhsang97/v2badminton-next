# S5B-A4 - Testimonials upgrade

**Muc tieu:** Nang cap `TestimonialsSection` theo Figma: stars, rich quote cards, avatar + role, hierarchy trust tot hon.

**Thoi gian uoc luong:** 1 gio

**Phu thuoc:** `S5A-A1`

**Rui ro:** Thap-den-trung-binh. Section da co data path, can doi presentation.

## Files chinh

- `src/components/home/TestimonialsSection.tsx`
- `src/app/globals.css`

## Scope

1. Star rating treatment
2. Quote-led card layout
3. Avatar / name / role footer
4. Empty state van hide section neu data rong

## Acceptance criteria

1. Cards giong trust testimonials thuc su, khong chi la text box
2. Section dung duoc voi testimonials co va khong co avatar
3. Typography / spacing khop card system moi

## Implementation notes

### Sanity schema gap (QUAN TRONG)

- `SanityTestimonial` hien tai CHI co: `id`, `studentName`, `studentGroup`, `contextLabel`, `content`
- **KHONG co**: `starRating`, `avatarUrl`
- Ticket mention "stars, avatar + role" nhung schema chua support

### Giai phap bridge data

- **Stars**: render 5-star default cho tat ca testimonials (visual-only, khong tu Sanity)
- **Avatar**: render initial/placeholder circle tu `studentName` (vd: "N" tu "Nguyen Van A")
- **Role**: map `studentGroup` qua switch (tre_em → "Phu huynh & tre em", nguoi_di_lam → "Nguoi di lam", etc.) — logic nay DA CO trong code hien tai
- Khi Sanity schema duoc update sau nay, chi can swap sang real data
