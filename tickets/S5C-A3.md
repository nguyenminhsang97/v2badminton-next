# S5C-A3 - Locations section upgrade

**Muc tieu:** Nang cap `LocationsSection` / `LocationsGrid` theo Figma: image support, phone / hours treatment neu data co, card hierarchy ro rang.

**Thoi gian uoc luong:** 0.5 gio

**Phu thuoc:** `S5A-A1`

**Rui ro:** Thap-den-trung-binh. Can ton trong data model hien tai.

## Files chinh

- `src/components/home/LocationsSection.tsx`
- `src/components/blocks/LocationsGrid.tsx`
- `src/app/globals.css`

## Scope

1. Location cards dep hon, co image slot
2. Address / CTA hierarchy ro
3. Neu schema co phone / hours thi hien ro; neu khong co thi khong overpromise

## Acceptance criteria

1. Locations section khop visual system moi
2. Card co image-led presentation
3. Khong hardcode field schema khong ton tai

## Implementation notes

### Sanity schema thuc te (`SanityLocation`)

| Field | Co trong schema | Render |
|-------|----------------|--------|
| `id` | ✅ | key |
| `name` | ✅ | card title |
| `slug` | ✅ | image fallback lookup |
| `imageUrl` | ✅ | card image (primary) |
| `imageAlt` | ✅ | alt text, fallback = name |
| `districtLabel` | ✅ | subtitle / tag |
| `addressText` | ✅ | address line |
| `mapsUrl` | ✅ | "Xem bản đồ" CTA, target=_blank |
| `phone` | ❌ | KHONG render |
| `hours` | ❌ | KHONG render |
| `email` | ❌ | KHONG render |

### Image fallback

- `LocationsGrid` da co `LOCATION_IMAGE_FALLBACKS` record: lookup by slug → `/images/{slug}.webp`
- Slugs co fallback: `green`, `hue-thien`, `khang-sport`, `phuc-loc`
- Logic nay giu nguyen, chi doi card visual treatment
