# S5A-A3 - Courses section rewrite

**Muc tieu:** Rewrite `CourseSection` thanh image-led Figma cards: co anh, badge, metadata, gia inline, CTA full-width.

**Thoi gian uoc luong:** 2 gio

**Phu thuoc:** `S5A-A1`

**Rui ro:** Trung binh. Can giu data mapping cua section trong khi doi presentation.

## Files chinh

- `src/components/home/CourseSection.tsx`
- `src/app/globals.css`
- `public/images/*` hoac asset mapping helper neu can

## Scope

1. Moi course card co image slot
2. Badge / label system ro rang
3. Title + subtitle + metadata + pricing hierarchy ro
4. CTA full-width theo Figma
5. Grid desktop / tablet / mobile theo Figma direction

## Acceptance criteria

1. Cards khong con la dark utility cards kieu cu
2. Moi course card co image treatment ro
3. Badge, metadata, price, CTA duoc nhin thay ro bang mat thuong
4. Existing course data van dung, khong hardcode content sai schema
5. Mobile cards van de doc va de tap

## Implementation notes

- Neu current schema chua co image per course, duoc phep map tam tu local asset layer.

### Conversion hooks (PHAI GIU NGUYEN)

- Component dung `useHomepageConversion()` hook — KHONG co props
- Click handlers map action sang conversion state:
  - "basic" → `setCourseIntent("co_ban")`
  - "advanced" → `setCourseIntent("nang_cao")`  
  - "enterprise" → `enterBusinessMode()`
- Tat ca CTAs track event voi `cta_location="course_cards"`
- Hardcoded `COURSE_CARDS` array (3 cards: basic, advanced, enterprise) — chi doi presentation, khong doi data structure

### Image mapping

- Hien co assets: `course-basic.webp`, `course-advanced.webp`, `course-enterprise.webp` trong `/public/images/`
- Map truc tiep vao cards tuong ung
