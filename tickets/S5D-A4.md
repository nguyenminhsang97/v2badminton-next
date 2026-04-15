# S5D-A4 - GTM / GA4 integration

**Muc tieu:** Noi GTM / GA4 vao app de event model hien tai co noi nhan that.

**Thoi gian uoc luong:** 1 gio

**Phu thuoc:** Khong phu thuoc visual track, nhung co the lam sau khi layout frame on dinh

**Rui ro:** Trung binh. Can dung env gating de local / preview khong bi noise.

## Files chinh

- site layout file
- component analytics moi neu can
- `.env.example`

## Scope

1. Init GTM script qua env
2. Khong hardcode container ID
3. Reuse `dataLayer` events dang co
4. Document env var can thiet

## Acceptance criteria

1. Khong co GTM code duplicate
2. App khong crash khi env chua set
3. Tracking layer san sang de container bat conversion

## Implementation notes

### Hien trang

- GTM **DA DUOC implement** trong `src/components/analytics/GoogleTagManager.tsx`
- Layout da render `<GoogleTagManager />` va `<GoogleTagManagerNoscript />`
- Env var: `NEXT_PUBLIC_GTM_ID` — return null neu khong set
- Script strategy: `afterInteractive`

### Scope thuc te cua ticket nay

Vi GTM da co, ticket nay thuc chat la:
1. **Audit**: xac nhan khong co duplicate GTM code (trong layout, _document, hoac head)
2. **Env gating**: xac nhan local/preview khong fire GTM khi env chua set
3. **`.env.example`**: document `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX`
4. **dataLayer events**: xac nhan `trackEvent()` calls hien tai push dung vao `window.dataLayer`
5. **Khong can viet lai** GTM script — chi audit + document
