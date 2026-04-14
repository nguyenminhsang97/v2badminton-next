# S5A-A4 · Next.js Image migration + heroImage rendering

**Muc tieu:** Chuyen raw `<img>` sang Next.js `<Image>` de duoc optimize tu dong (WebP/AVIF, responsive srcset, lazy loading). Dong thoi render `heroImage` trong MoneyPageTemplate.

**Thoi gian uoc luong:** 1 gio

**Phu thuoc:** Khong

**Rui ro:** Thap. Next.js Image co the can cau hinh `remotePatterns` cho Sanity CDN.

---

## Context cho junior

### Van de 1: Raw `<img>` trong CoachSection

`src/components/home/CoachSection.tsx` dong 22-29 dung raw `<img>` va bypass ESLint:

```tsx
// eslint-disable-next-line @next/next/no-img-element
<img
  src={coach.photoUrl}
  alt={coach.photoAlt ?? coach.name}
  className="coach-card__photo"
  width={120}
  height={120}
  loading="lazy"
/>
```

Next.js `<Image>` component tu dong:
- Convert sang WebP/AVIF (nho hon ~30-50%)
- Tao responsive `srcset` cho nhieu screen sizes
- Lazy load voi IntersectionObserver (tot hon `loading="lazy"`)
- Prevent layout shift voi width/height

### Van de 2: Money page heroImage khong render

### Visual direction cho ticket nay

- `D:\V2\landing-page\hoc-cau-long-cho-nguoi-moi\index.html` cho thay money/SEO page can hero ngan, de scan, khong qua "editorial".
- `D:\V2\Badminton Academy Enrollment Screens\src\app\pages\HomePage.tsx` cho thay image placement co the tang hierarchy neu duoc dat gon.

Vi vay, hero image can ho tro H1 va intro, khong duoc day content chinh xuong qua xa.

`moneyPage.ts` schema co field `heroImage` (type `image` voi hotspot). Nhung `MoneyPageTemplate.tsx` khong render no — hero chi co `<h1>` va `<PortableText>` intro.

---

## Files can sua

1. `src/components/home/CoachSection.tsx` — chuyen sang `<Image>`
2. `src/components/money-page/MoneyPageTemplate.tsx` — render `heroImage`
3. `next.config.ts` (hoac `next.config.js`) — them Sanity CDN vao `images.remotePatterns`

---

## Buoc 1 — Cau hinh remotePatterns

Mo `next.config.ts`. Them Sanity CDN vao allowed image domains:

```ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // ... existing config
};
```

**Tai sao can remotePatterns?** Next.js `<Image>` chi optimize images tu domains duoc allow. Coach photos va money page hero images den tu Sanity CDN (`cdn.sanity.io`).

---

## Buoc 2 — CoachSection: chuyen sang Image

Mo `src/components/home/CoachSection.tsx`:

### 2a. Them import

```tsx
import Image from "next/image";
```

### 2b. Thay `<img>` bang `<Image>`

```tsx
{coach.photoUrl ? (
  <Image
    src={coach.photoUrl}
    alt={coach.photoAlt ?? coach.name}
    className="coach-card__photo"
    width={120}
    height={120}
  />
) : (
  <div className="coach-card__photo coach-card__photo--placeholder" />
)}
```

**Thay doi:**
- Xoa `// eslint-disable-next-line` — khong can nua
- Xoa `loading="lazy"` — `<Image>` tu dong lazy load (day la default behavior)
- Giu `width={120} height={120}` — can cho layout calculation

---

## Buoc 3 — MoneyPageTemplate: render heroImage

Mo `src/components/money-page/MoneyPageTemplate.tsx`:

### 3a. Them import

```tsx
import Image from "next/image";
```

### 3b. Render heroImage trong hero section

Sua `.money-page__hero` section:

```tsx
<section className="money-page__hero">
  {page.heroImageUrl ? (
    <Image
      src={page.heroImageUrl}
      alt={page.h1}
      className="money-page__hero-image"
      width={1120}
      height={400}
      priority
    />
  ) : null}
  <h1 className="money-page__title">{page.h1}</h1>
  {page.intro.length > 0 ? (
    <div className="money-page__intro">
      <PortableText value={page.intro as PortableTextBlock[]} />
    </div>
  ) : null}
</section>
```

**`priority`:** Hero image la LCP (Largest Contentful Paint) — `priority` bat preload, khong lazy load.

### 3c. Kiem tra SanityMoneyPage type

Mo `src/lib/sanity/queries.ts` va kiem tra `SanityMoneyPage` type co field `heroImageUrl` khong. Neu chua co:

- Them `heroImageUrl: string | null;` vao type
- Them `"heroImageUrl": heroImage.asset->url` vao GROQ query projection

### 3d. CSS cho hero image

Them vao `globals.css`:

```css
.money-page__hero-image {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
}
```

---

## Cach verify

1. `npm run build` — pass (khong co ESLint warning ve `<img>`)
2. Dev server → homepage → CoachSection:
   - Photos hien binh thuong
   - Inspect element → `<img>` co `srcset` attribute (Next.js Image output)
   - Network tab → image format la WebP hoac AVIF (khong phai JPEG/PNG goc)
3. Dev server → money page bat ky:
   - Neu Sanity doc co heroImage → image hien tren h1
   - Neu khong co heroImage → chi hien h1 (khong break)
4. Lighthouse → Performance score khong giam (Image optimization cai thien LCP)
