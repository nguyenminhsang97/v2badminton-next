# S5A-A2 - Hero section rewrite

**Muc tieu:** Rewrite homepage hero theo Figma: 2-column layout, hero image o ben phai, trust strip, 3 CTA, visual hierarchy ro rang hon.

**Thoi gian uoc luong:** 2 gio

**Phu thuoc:** `S5A-A1`

**Rui ro:** Trung binh. Hero la first paint quan trong nhat cua homepage.

## Files chinh

- `src/components/home/HeroSection.tsx`
- `src/app/globals.css`
- `src/app/(site)/page.tsx` chi neu can prop / layout wrapper nho

## Scope

1. Hero chuyen sang 2 cot desktop, stack tren mobile
2. Them image / visual panel theo direction Figma
3. Them trust strip: avatar stack, rating, hoc vien count
4. Giu 3 CTA nhung restyle theo Figma
5. Giu campaign override logic va quick links neu dang co business value

## Acceptance criteria

1. Hero nhin ro Figma-first bang mat thuong
2. Heading, subheading, CTA row, trust row co hierarchy ro
3. Hero image / panel co that, khong chi la background mau
4. Mobile stack khong vo layout
5. Existing CTA destinations va tracking behavior van dung

## Implementation notes

- Copy va route phai la V2, khong copy Eagle text tu Figma.
- Neu Figma co element khong phu hop conversion flow cua V2, uu tien giu conversion flow.

### Campaign override logic (PHAI GIU)

- Component nhan `{ campaign: SanityActiveCampaign | null }`
- Khi `campaign` ton tai: override hero title, subheading, primary CTA (label + url)
- Fallback chain: `primaryCtaUrl` → `linkedPageSlug` → `#lien-he`
- Tracking: `trackEvent` tren moi CTA voi location context (hero, hero_quick_links, hero_aside)

### Hardcoded data hien tai

- `QUICK_LINKS`: array of internal nav links — quyet dinh giu hay remove khi rewrite
- `HERO_HIGHLIGHTS`: trust signals — co the merge vao trust strip moi
- `TRUST_STATS`: so lieu nhu "500+ hoc vien" — map vao trust strip Figma

### Image source

- Hero image: dung asset tu `/public/images/` (vd: `hero-logo.webp`, `course-*.webp`, hoac new asset)
- Figma cho thay image panel ben phai — can chon 1 hero image phu hop
