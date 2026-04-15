# S5B-A2 - Coach section rewrite

**Muc tieu:** Rewrite `CoachSection` theo Figma: anh lon, credentials, quote, rating, visual trust ro hon.

**Thoi gian uoc luong:** 1.5 gio

**Phu thuoc:** `S5A-A1`

**Rui ro:** Trung binh. Section dung du lieu Sanity nen presentation moi phai work voi optional fields.

## Files chinh

- `src/components/home/CoachSection.tsx`
- `src/app/globals.css`

## Scope

1. Card layout lon hon, image-led
2. Overlay / name hierarchy hop ly
3. Credentials, quote, rating, student count treatment
4. Empty state van hide section neu khong co data

## Acceptance criteria

1. Coach cards trong giau trust hon ban cu
2. Raw `<img>` da duoc thay / align voi image strategy hien tai
3. Optional fields khong lam vo layout
4. Section tu an khi khong co data van dung

## Implementation notes

### Sanity schema hien tai (`SanityCoach`)

- Fields co: `id`, `name`, `photoUrl`, `photoAlt`, `teachingGroup`, `approach`
- Fields **KHONG co** trong schema: `credentials`, `quote`, `rating`, `studentCount`
- Ticket mention "credentials, quote, rating" → can dung hardcoded fallback hoac bridge data
- `teachingGroup` co the render nhu credential label
- `approach` co the render nhu quote
- Rating / student count: hardcoded placeholder hoac skip cho den khi Sanity schema duoc update
