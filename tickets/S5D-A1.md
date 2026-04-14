# S5D-A1 · GTM/GA4 integration

**Muc tieu:** Wire Google Tag Manager container vao site de nhan tracking events tu `window.dataLayer`. Sau ticket nay, moi event da push qua `trackEvent()` se tu dong gui len GA4.

**Thoi gian uoc luong:** 1 gio

**Phu thuoc:** S5A-A1~A4 va S5B (UI can on truoc de do conversion tren nen moi)

**Rui ro:** Trung binh. GTM snippet phai load sau consent/cookie check. Can test khong block page render.

---

## Context cho junior

`src/lib/tracking.ts` da push events vao `window.dataLayer` (dong 109-113):

```ts
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: eventName,
  ...(params ?? {}),
});
```

Nhung chua co GTM container nao doc `dataLayer`. Events push vao void. Ticket nay connect GTM de events chay len GA4.

**Nguon tham chieu analytics can giu:** `D:\V2\landing-page\tracking.js`

Static site dang dung cac event names cuc ky thuc dung cho business:

- `cta_click`
- `contact_click`
- `map_click`
- `form_start`

Sprint 5 nen uu tien giu continuity voi naming do, roi moi bo sung event moi tren tracking layer hien tai neu can.

**GTM vs GA4 direct:** Dung GTM (khong paste GA4 snippet truc tiep) vi:
1. Co the them/sua tags khong can deploy code
2. Co the them Facebook Pixel, Hotjar, etc. sau ma khong can code
3. Consent mode de quan ly hon

---

## Setup yeu cau truoc khi code

1. Tao GTM account tai https://tagmanager.google.com/
2. Tao container cho website (Web container)
3. Lay **Container ID** (format: `GTM-XXXXXXX`)
4. Trong GTM, tao GA4 Configuration tag:
   - Tag type: Google Analytics: GA4 Configuration
   - Measurement ID: `G-XXXXXXXXXX` (tu GA4 property)
   - Trigger: All Pages
5. Publish GTM container

---

## Files can tao/sua

1. `src/components/analytics/GoogleTagManager.tsx` — tao moi
2. `src/app/(site)/layout.tsx` — them GTM component
3. `.env.local` — them `NEXT_PUBLIC_GTM_ID`

---

## Buoc 1 — Them env var

Them vao `.env.local`:

```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

**Tai sao `NEXT_PUBLIC_`?** GTM ID can accessible o client-side (browser load GTM script). Khong phai secret.

---

## Buoc 2 — Tao GTM component

Tao `src/components/analytics/GoogleTagManager.tsx`:

```tsx
import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function GoogleTagManager() {
  if (!GTM_ID) {
    return null;
  }

  return (
    <Script
      id="gtm-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `,
      }}
    />
  );
}

export function GoogleTagManagerNoscript() {
  if (!GTM_ID) {
    return null;
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
```

**`strategy="afterInteractive"`:** GTM load sau page interactive — khong block initial render. Performance-safe.

**Tai sao 2 components?** GTM can `<script>` trong `<head>` va `<noscript>` trong `<body>`. Next.js App Router xu ly khac nhau.

---

## Buoc 3 — Integrate vao layout

Mo `src/app/(site)/layout.tsx`:

```tsx
import { GoogleTagManager, GoogleTagManagerNoscript } from "@/components/analytics/GoogleTagManager";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <GoogleTagManager />
      <Nav />
      <main className="site-main">
        <GoogleTagManagerNoscript />
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

---

## Buoc 4 — Verify dataLayer connection

1. Deploy hoac chay dev server
2. Mo browser DevTools → Console
3. Go: `window.dataLayer` → thay array co `gtm.start` event
4. Click bat ky CTA → `window.dataLayer` co them `cta_click` event
5. Mo GTM Preview mode → thay events fire

---

## Buoc 5 — Them vao S4B-A2 env vars checklist

Cap nhat `tickets/S5D-A1.md` khong can — nhung khi deploy, them `NEXT_PUBLIC_GTM_ID` vao Vercel env vars.

---

## Cach verify

1. `npm run build` — pass
2. Dev server **khong co GTM_ID** → khong co GTM script (graceful skip)
3. Dev server **co GTM_ID** → GTM script load, `dataLayer` co events
4. Lighthouse Performance → score khong giam qua 5 diem (GTM afterInteractive)
5. GTM Preview mode → tat ca events hien
