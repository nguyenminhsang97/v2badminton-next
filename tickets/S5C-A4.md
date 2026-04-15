# S5C-A4 - Footer rewrite + floating CTA

**Muc tieu:** Rewrite footer thanh 4-column footer theo Figma va implement floating CTA (Zalo / Phone) trong cung mot ticket frame.

**Thoi gian uoc luong:** 1.25 gio

**Phu thuoc:** `S5A-A1`

**Rui ro:** Thap-den-trung-binh. Footer la layout work, floating CTA can can bang voi readability va content overlap.

## Files chinh

- `src/components/layout/Footer.tsx` neu co, hoac file footer thuc te trong repo
- floating CTA component moi neu can
- `src/app/(site)/layout.tsx` hoac frame file lien quan
- `src/app/globals.css`

## Scope

1. Footer 4 cot day du
2. Social links ro rang
3. Legal / copyright / basic utility links
4. Visual tone theo Figma
5. Floating CTA cho Zalo / Phone
6. Placement va mobile behavior cua floating CTA

## Acceptance criteria

1. Footer khong con dang "simple closing strip"
2. 4 column desktop, collapse hop ly tren mobile
3. Brand, social, contact, links deu ro rang
4. Floating CTA hoat dong tren mobile va desktop ma khong che content quan trong
5. Floating CTA khong che footer content va ContactSection CTA

## Implementation notes

### Footer data source

- Props: `{ siteSettings: SiteChromeSettings }`
- `SiteChromeSettings` fields: `siteName`, `phoneDisplay`, `phoneE164`, `zaloNumber`, `facebookUrl`
- Hien tai render: brand text, phone link, Zalo link, Facebook link, 3 internal links, privacy disclaimer, copyright

### Footer 4-column layout

| Column 1 (Brand) | Column 2 (Links) | Column 3 (Contact) | Column 4 (Social) |
|---|---|---|---|
| Logo / siteName | primaryLinks subset | Phone: 0907 911 886 | Facebook |
| Tagline | SEO page links | Zalo: 0907911886 | Zalo |
| | Blog | Address | |

### Floating CTA spec

- **2 actions**: Phone (`tel:+84907911886`) + Zalo (`https://zalo.me/0907911886`)
- **Mobile**: fixed bottom-right, z-index cao, cach bottom ~16-20px
- **Desktop**: fixed bottom-right, nho gon hon mobile
- **Tracking**: `trackEvent` voi `cta_location="floating_cta"`, `cta_name="phone"` hoac `"zalo"`
- **Safe area**: khong overlap voi footer, ContactSection submit button, hoac cookie banner
- Phone/Zalo data lay tu `siteConfig` (khong hardcode truc tiep)
