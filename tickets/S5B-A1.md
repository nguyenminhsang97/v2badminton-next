# S5B-A1 - Why section rewrite

**Muc tieu:** Rewrite `WhySection` theo Figma: 2-column layout, feature list co icon treatment, image support, stat box 98%.

**Thoi gian uoc luong:** 1.5 gio

**Phu thuoc:** `S5A-A1`

**Rui ro:** Trung binh. Section nay hien dang la simple card grid, can doi structure ro.

## Files chinh

- `src/components/home/WhySection.tsx`
- `src/app/globals.css`

## Scope

1. Chuyen tu grid cards don gian sang 2-column composition
2. Column text: section kicker, title, desc, feature list
3. Column visual: image cluster va stat box
4. Copy van la V2, khong generic school marketing
5. Chi surface 4 differentiators chinh tren homepage

## Acceptance criteria

1. Why section khop Figma direction ro rang
2. Stat box 98% / trust metric duoc hien ro
3. Co image support thay vi chi text cards
4. Chi co 4 differentiators visible tren homepage
5. Mobile collapse van hop ly

## Implementation notes

### Data migration

- Hien tai: hardcoded `DIFFERENTIATORS` array voi 6 items
- Figma cho thay 4 feature items trong layout 2-column
- Quyet dinh: giam xuong 4 differentiators visible cho khop Figma va scanability cua homepage
- Component khong co props, khong co hooks, thay doi an toan

### Content handling

- Chon 4 differentiators manh nhat de dua len homepage
- 2 differentiators con lai co the dua xuong FAQ, BusinessSection, hoac copy ho tro khac
