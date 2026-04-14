# S5B-A1 · Error UX hardening

**Muc tieu:** Khi page loi (component crash, data fetch fail ngoai Sanity fallback), user thay branded error UI thay vi Next.js default error page trang. Focus vao page-level error handling, khong wrap tung section.

**Thoi gian uoc luong:** 45 phut

**Phu thuoc:** S5A-A2 (can loading.tsx + not-found.tsx pattern de follow)

**Rui ro:** Thap. Them file convention moi, khong sua logic.

---

## Context cho junior

Next.js App Router co error handling convention:
- `error.tsx` — catch render errors trong route segment, hien fallback UI
- `not-found.tsx` — custom 404 (da lam o S5A-A2)
- `loading.tsx` — loading state (da lam o S5A-A2)

Hien tai project **khong co `error.tsx` nao**. Neu component throw error → user thay Next.js default error page (trang, khong co branding, khong co link ve trang chu).

**Khong can wrap tung section trong ErrorBoundary.** Ly do:
1. Sanity queries da co `sanityFetchOrFallback` — data fetch fail → return fallback, khong throw
2. Chi khi component render crash (bug code) thi error propagate len page
3. Page-level `error.tsx` catch tat ca render errors trong route segment
4. Section-level ErrorBoundary chi can cho `ContactForm` (client component phuc tap nhat, nhieu user interaction)

---

## Files can tao/sua

1. `src/app/(site)/error.tsx` — tao moi
2. `src/app/globals.css` — them error page styles
3. `src/components/home/ContactFormErrorBoundary.tsx` — tao moi (optional, cho ContactForm)

---

## Buoc 1 — Tao page-level error.tsx

Tao `src/app/(site)/error.tsx`:

```tsx
"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-page">
      <h1 className="error-page__title">Co loi xay ra</h1>
      <p className="error-page__desc">
        Trang khong the hien thi. Vui long thu lai hoac quay ve trang chu.
      </p>
      <div className="error-page__actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={reset}
        >
          Thu lai
        </button>
        <a href="/" className="btn btn--outline">
          Ve trang chu
        </a>
      </div>
    </div>
  );
}
```

**`"use client"` bat buoc:** Next.js App Router yeu cau `error.tsx` la client component. Day la convention, khong the bo.

**`reset()`:** Re-render route segment — neu loi la transient (network blip), page co the hien lai binh thuong.

**`error` param:** Khong hien error.message cho user (security + UX). Sentry da capture error tu dong qua instrumentation.

---

## Buoc 2 — CSS cho error page

Them vao `globals.css` (gan `.not-found` styles da them o S5A-A2):

```css
.error-page {
  display: grid;
  gap: 16px;
  justify-items: center;
  text-align: center;
  padding: 120px 24px;
}

.error-page__title {
  color: var(--v2-white);
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 800;
}

.error-page__desc {
  color: var(--v2-muted);
  font-size: 1.1rem;
  max-width: 400px;
  line-height: 1.7;
}

.error-page__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
```

---

## Buoc 3 (Optional) — ContactForm error boundary

Neu muon them bao ve cho ContactForm (component phuc tap nhat):

Tao `src/components/home/ContactFormErrorBoundary.tsx`:

```tsx
"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ContactFormErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="contact-form-shell">
          <p className="contact-form__status contact-form__status--error">
            Form tam thoi khong kha dung. Vui long lien he qua Zalo hoac dien thoai.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

Sau do wrap `ContactSection` trong `page.tsx`:

```tsx
import { ContactFormErrorBoundary } from "@/components/home/ContactFormErrorBoundary";

// ...

<ContactFormErrorBoundary>
  <ContactSection
    siteSettings={siteSettings}
    locations={locations}
    scheduleBlocks={scheduleBlocks}
  />
</ContactFormErrorBoundary>
```

**Tai sao class component?** React error boundaries bat buoc dung `getDerivedStateFromError` hoac `componentDidCatch` — chi co trong class components. Day khong phai style preference, ma la React API constraint.

---

## Cach verify

1. `npm run build` — pass
2. Test error page: tam throw error trong `page.tsx` (VD: `throw new Error("test")`) → thay branded error page voi "Thu lai" va "Ve trang chu"
3. Click "Thu lai" → page re-render (neu error la tam, page hien binh thuong)
4. Click "Ve trang chu" → ve `/`
5. Xoa test error
6. (Optional) Test ContactForm boundary: tam throw trong ContactForm render → thay fallback message, page khong crash
