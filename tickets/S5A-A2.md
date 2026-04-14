# S5A-A2 · Loading UX hardening

**Muc tieu:** Khi trang dang load data, user thay feedback visual thay vi blank screen. Khong yeu cau full per-section skeleton — chi can route-level loading va targeted improvements.

**Thoi gian uoc luong:** 1 gio

**Phu thuoc:** Khong (co the lam song song voi S5A-A1)

**Rui ro:** Thap. Them file moi, khong sua logic hien tai.

---

## Context cho junior

Hien tai homepage `page.tsx` (dong 38-58) dung 1 `Promise.all` voi 8 data sources. Trong khi cho response, user thay **blank page** vi:

1. Khong co `loading.tsx` file nao trong project (da verify: `src/app/**/loading.tsx` khong ton tai)
2. `Suspense fallback={null}` (dong 74) chi wrap `HomepageBusinessModeInitializer`, khong wrap content chinh

**Khong refactor data fetching vong nay.** Muon per-section streaming can tach moi section thanh async component rieng + Suspense boundary — do la refactor lon, de sprint sau. Vong nay chi lam:

1. Route-level `loading.tsx` — App Router convention, tu dong hien khi route dang load
2. `not-found.tsx` — custom 404 page thay vi Next.js default
3. CSS cho loading skeleton

---

## Files can tao

1. `src/app/(site)/loading.tsx` — tao moi
2. `src/app/(site)/not-found.tsx` — tao moi
3. `src/app/globals.css` — them loading skeleton styles

---

## Buoc 1 — Tao route-level loading.tsx

Tao file `src/app/(site)/loading.tsx`:

```tsx
export default function Loading() {
  return (
    <div className="loading-shell">
      <div className="loading-shell__hero">
        <div className="skeleton skeleton--eyebrow" />
        <div className="skeleton skeleton--heading" />
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--text skeleton--text-short" />
      </div>
      <div className="loading-shell__grid">
        <div className="skeleton skeleton--card" />
        <div className="skeleton skeleton--card" />
        <div className="skeleton skeleton--card" />
      </div>
    </div>
  );
}
```

**Tai sao minimal skeleton?** Loading state chi hien trong khoang 0.5-2 giay (Sanity + DB response time). Khong can replicate chinh xac layout homepage — chi can cho user biet "dang load" va giu layout shift thap.

**Tai sao khong dung Suspense per section?** Vi page.tsx hien fetch tat ca data trong 1 `Promise.all` roi render dong bo. De stream tung section can tach thanh async components — refactor lon, khong phu hop vong nay.

---

## Buoc 2 — Tao custom not-found.tsx

Tao file `src/app/(site)/not-found.tsx`:

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found__title">404</h1>
      <p className="not-found__desc">
        Trang ban tim khong ton tai hoac da duoc di chuyen.
      </p>
      <Link href="/" className="btn btn--primary">
        Ve trang chu
      </Link>
    </div>
  );
}
```

---

## Buoc 3 — CSS cho loading skeleton + 404

Them vao `globals.css`, truoc `@media` block (khoang dong 958):

```css
/* Loading skeleton */
.loading-shell {
  display: grid;
  gap: 48px;
  padding: 88px 0 48px;
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
}

.loading-shell__hero {
  display: grid;
  gap: 16px;
  max-width: 640px;
}

.loading-shell__grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.skeleton {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
  animation: skeletonPulse 1.8s ease-in-out infinite;
}

.skeleton--eyebrow {
  height: 14px;
  width: 120px;
}

.skeleton--heading {
  height: 48px;
  width: 80%;
}

.skeleton--text {
  height: 16px;
  width: 100%;
}

.skeleton--text-short {
  width: 60%;
}

.skeleton--card {
  height: 200px;
}

@keyframes skeletonPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

/* 404 page */
.not-found {
  display: grid;
  gap: 16px;
  justify-items: center;
  text-align: center;
  padding: 120px 24px;
}

.not-found__title {
  color: var(--v2-lime);
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 800;
  line-height: 1;
}

.not-found__desc {
  color: var(--v2-muted);
  font-size: 1.1rem;
  max-width: 400px;
}
```

Them vao `@media (prefers-reduced-motion: reduce)`:

```css
@media (prefers-reduced-motion: reduce) {
  .hero__shuttle-ring {
    animation: none;
  }

  .skeleton {
    animation: none;
    opacity: 0.6;
  }
}
```

---

## Cach verify

1. `npm run build` — pass
2. Dev server → homepage: load binh thuong (loading.tsx chi flash nhanh)
3. Test loading state: them `await new Promise(r => setTimeout(r, 3000))` tam vao `page.tsx` truoc `Promise.all` → thay skeleton
4. Xoa `setTimeout` sau khi test
5. Truy cap URL khong ton tai (VD: `/abc-xyz/`) → thay custom 404 voi brand styling
6. Mobile: skeleton va 404 hien dung tren man hinh nho
