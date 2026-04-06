# V2 Badminton — Next.js Parallel Migration Plan

> Mục tiêu: dựng bản Next.js chạy song song trên Vercel, test ổn định trước khi thay thế bản HTML hiện tại đang live trên Cloudflare.
> Cập nhật lần cuối: 2026-04-06.

---

## 1. Quyết định kiến trúc

### Chọn mô hình triển khai

Giữ song song 2 hệ:

- **Production hiện tại**
  - static HTML
  - đang live trên `v2badminton.com`
  - host trên Cloudflare

- **Bản mới**
  - Next.js App Router
  - deploy riêng trên Vercel
  - test trên domain tạm trước khi cutover

### Vì sao chọn deploy song song

- không làm rơi lead hiện tại
- không phải rewrite đè lên site live
- test được UX, tracking, SEO, performance trong môi trường thật
- rollback đơn giản nếu bản Next.js chưa ổn

### Khuyến nghị repo

Tạo repo riêng:

- `v2badminton-website` = bản HTML hiện tại
- `v2badminton-next` = bản Next.js mới

Không khuyến nghị bắt đầu bằng monorepo ở giai đoạn này.

---

## 2. Mục tiêu migration

Bản Next.js chỉ được xem là sẵn sàng cutover khi:

1. Giữ nguyên intent SEO và URL structure.
2. Không làm giảm conversion flow hiện tại.
3. Không làm rơi tracking.
4. Có form submit an toàn hơn bản cũ.
5. Mobile performance tốt bằng hoặc hơn bản hiện tại.

---

## 3. URL strategy

Các route production phải giữ nguyên:

- `/`
- `/hoc-cau-long-cho-nguoi-moi`
- `/lop-cau-long-binh-thanh`
- `/lop-cau-long-thu-duc`

Không đổi slug khi replatform.

### Domain strategy

Giai đoạn test:

- dùng domain preview của Vercel
  - ví dụ: `v2badminton-next.vercel.app`
- hoặc dùng subdomain test:
  - `next.v2badminton.com`

Chỉ khi pass checklist mới cutover:

- `v2badminton.com`

---

## 4. App architecture đề xuất

### Stack

- Next.js App Router
- TypeScript
- Vercel
- phần lớn page dùng SSG

### Cấu trúc thư mục gợi ý

```txt
app/
  page.tsx
  hoc-cau-long-cho-nguoi-moi/page.tsx
  lop-cau-long-binh-thanh/page.tsx
  lop-cau-long-thu-duc/page.tsx
  robots.ts
  sitemap.ts
  api/
    lead/route.ts

components/
  layout/
  sections/
  ui/
  analytics/

lib/
  site.ts
  locations.ts
  pricing.ts
  faqs.ts
  schedule.ts
  tracking.ts

public/
  image/
  og-image.jpg
```

### Component hóa tối thiểu

- `JsonLd`
- `CTAButton`
- `LocationCard`
- `ScheduleCard`
- `FAQSection`
- `ContactForm`
- `TrustStrip`
- `SeoPageLayout`

---

## 5. Những thứ bắt buộc phải preserve

### 5.1 Schedule → form prefill

Flow hiện tại là asset conversion mạnh nhất:

`click schedule card -> prefill sân + khung giờ + message -> scroll xuống form -> focus field trống`

Yêu cầu:

- giữ nguyên logic này
- không làm phiên bản React “đẹp hơn” nhưng mất prefill
- phải test cả desktop và mobile

### 5.2 Corporate card flow

Khi click card doanh nghiệp:

- clear prefill lịch trước đó
- set mode doanh nghiệp
- scroll xuống form

### 5.3 Tracking semantics

Giữ nguyên các event hiện tại:

- `cta_click`
- `contact_click`
- `map_click`
- `form_start`
- `generate_lead`
- `form_error`

Planned additions:

- `form_field_focus`
- `form_abandon`
- `time_to_submit`

### 5.4 CTA param contract

Allowed values hiện tại:

#### `cta_name`

- `dang_ky_ngay`
- `dang_ky_hoc_thu`
- `xem_khoa_hoc`
- `nhan_bao_gia`
- `nhan_zalo_tu_van`

#### `cta_location`

- `nav`
- `hero`
- `business`
- `seo_cta_block`

Không được tự ý tạo biến thể tự phát.

---

## 6. Form architecture mới

### Trạng thái hiện tại

Bản cũ đang submit qua Web3Forms bằng JS fetch.

### Yêu cầu cho bản Next.js

Form phải có **server-side fallback**:

- dùng `action="/api/lead"` hoặc Server Action
- vẫn submit được khi JS load chậm hoặc lỗi

### Notification ngày 1

Khi lead vào:

- notify Telegram ngay lập tức
- lưu đủ metadata tối thiểu:
  - page
  - source
  - utm
  - sân/giờ nếu có prefill

### Data tối thiểu cần lưu

- tên
- số điện thoại/Zalo
- trình độ
- sân
- khung giờ
- ghi chú
- landing page
- timestamp
- UTM params

---

## 7. Zalo strategy

### Mobile

Giữ:

- `https://zalo.me/0907911886`

### Desktop

Không nên chỉ deeplink thẳng như mobile.

Desktop UX nên:

- hiện số điện thoại rõ
- hiện QR Zalo
- hoặc mở modal/contact card thay vì nhảy vào luồng Zalo mơ hồ

---

## 8. Internal linking requirements

### Homepage location cards

Hiện tại các location cards không nên chỉ link Google Maps.

Mỗi card cần có:

- 1 link Google Maps
- 1 deep link nội bộ tới local page phù hợp

Mapping:

- `Sân Green` -> `/lop-cau-long-binh-thanh`
- `Sân Huệ Thiên` -> `/lop-cau-long-thu-duc`
- `Sân Khang Sport (Bình Triệu)` -> `/lop-cau-long-thu-duc`
- `Sân Phúc Lộc` -> `/lop-cau-long-thu-duc`

---

## 9. Structured data requirements

### Giữ nguyên

- `LocalBusiness`
- `SportsActivityLocation`
- `FAQPage`
- `BreadcrumbList`

### Thêm mới

#### `Course` structured data

Áp dụng cho:

- khóa cơ bản
- khóa nâng cao
- chương trình doanh nghiệp

Mục tiêu:

- tăng độ rõ ràng cho query kiểu “khóa học cầu lông”, “lớp cầu lông cơ bản”

---

## 10. Mobile-first performance targets

Budget tối thiểu:

- LCP `< 2.5s`
- mục tiêu tốt: `< 2.0s`
- CLS `< 0.1`
- INP `< 200ms`

### Asset rules

- ảnh dùng WebP hoặc AVIF
- responsive image sizes
- lazy loading hợp lý
- không bundle JS dư thừa
- ưu tiên server components khi phù hợp

---

## 11. Migration safety checklist

### Trước khi build

- chụp baseline traffic hiện tại
- export các URL live hiện tại
- chụp metadata/schema hiện tại
- note current lead flow behavior

### Khi có bản preview

Kiểm tra:

- URL
- canonical
- title
- meta description
- OG tags
- JSON-LD
- sitemap
- robots
- internal links
- form submit
- Telegram notification
- tracking events
- Zalo behavior mobile/desktop
- schedule prefill flow

### Trước khi cutover production

- GSC inspect từng URL chính
- test mobile thật
- test `generate_lead`
- test Meta `Lead`
- test route parity với bản cũ

### Rollback plan

Nếu sau cutover có:

- tracking lỗi
- lead rơi
- page index lỗi
- canonical lỗi
- SEO tụt mạnh trong 7-14 ngày

thì phải có khả năng rollback tạm về bản HTML trên Cloudflare.

---

## 12. Build order

### Sprint 1 — Skeleton

- scaffold Next.js app
- dựng layout chung
- dựng homepage route
- import ảnh / assets / metadata

### Sprint 2 — Critical conversion parity

- port contact form
- port schedule prefill flow
- port doanh nghiệp card behavior
- cắm tracking parity

### Sprint 3 — SEO parity

- port 3 trang SEO
- port schema đầy đủ
- port sitemap / robots
- kiểm tra internal links

### Sprint 4 — Lead backend

- `/api/lead`
- Telegram notify
- submit fallback không phụ thuộc JS

### Sprint 5 — Preview QA

- test desktop/mobile
- compare với production cũ
- fix regressions

---

## 13. Cutover criteria

Chỉ cutover domain khi tất cả điều sau pass:

- 4 URL chính parity
- form submit pass
- Telegram notify pass
- `generate_lead` pass
- Meta `Lead` pass
- schedule prefill pass
- Zalo mobile/desktop pass
- sitemap + robots pass
- schema pass
- performance không tệ hơn bản cũ

---

## 14. Sau cutover

### 24-72 giờ đầu

- theo dõi GA4 Realtime
- theo dõi lead submit thật
- theo dõi Telegram notify
- kiểm tra GSC URL inspection
- kiểm tra page indexing

### 2 tuần đầu

- theo dõi ranking biến động
- theo dõi lead rate theo page
- theo dõi CWV mobile
- quyết định giữ hay rollback

---

## 15. Những gì không làm ngay

Chưa làm trong giai đoạn replatform:

- blog traffic rộng
- court pages riêng
- SSR phức tạp
- personalization
- CMS nặng

---

## 16. Deliverables

Khi hoàn tất giai đoạn migration song song, bạn phải có:

- 1 repo Next.js riêng
- 1 deployment Vercel preview/production riêng
- 1 checklist parity đã pass
- 1 phương án rollback rõ ràng
- 1 quyết định cutover có dữ liệu, không cảm tính

---

## 17. Locked Engineering Decisions Before Sprint 1

Những quyết định dưới đây không được để mơ hồ trong lúc implementation.

### 17.1 URL and routing

- `trailingSlash: true`
- giữ nguyên 4 URLs production hiện tại
- reserve route space:
  - `/san-pham/`
  - `/dich-vu/`
  - `/blog/`
  - `/khuyen-mai/`

### 17.2 Lead persistence

Default choice cho bản Vercel:

- **Vercel Postgres**

Lead record tối thiểu phải có:

- `id`
- `name`
- `phone`
- `level`
- `court`
- `time_slot`
- `message`
- `landing_page`
- `page_type`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `created_at`
- `device_type`
- `submission_method`

### 17.3 Validation contract

Client validate trước submit, server re-validate lại toàn bộ.

Rules tối thiểu:

- `name`: required, min 2, max 100
- `phone`: required, đúng format mobile Việt Nam
- `level`: optional enum
- `court`: optional enum
- `time_slot`: optional enum
- `message`: optional, max 500

### 17.4 Anti-spam stack

Form production phải có đủ:

- honeypot field
- Cloudflare Turnstile hoặc tương đương
- rate limit `5 requests / IP / hour`
- origin check nếu dùng Route Handler

Preferred implementation:

- ưu tiên Server Action nếu phù hợp

### 17.5 Lead delivery flow

Flow chuẩn của `/api/lead`:

1. validate
2. save DB
3. async notify Telegram
4. async notify email backup
5. return `2xx`
6. client fire `generate_lead`

Rule cứng:

- save first
- notify second
- notify failure không được block save

### 17.6 Analytics trigger definition

`generate_lead` chỉ fire khi:

- response API là `2xx`
- lead đã được lưu thành công

Planned analytics additions sau parity:

- `form_field_focus`
- `form_abandon`
- `time_to_submit`

### 17.7 Monitoring baseline

Trước cutover phải có:

- Sentry cho form/API/client errors
- uptime monitor cho homepage và `/api/health`
- post-deploy smoke test
- weekly DB lead count vs GA4 `generate_lead` audit

### 17.8 Privacy and consent

Trước production phải có:

- privacy policy page
- cookie consent tối thiểu cho GA4 / GTM / Meta
- rule không gửi PII vào analytics

### 17.9 SEO completeness extras

Ngoài parity với bản cũ, bản Next nên có:

- `Organization` schema trên homepage
- `WebSite` schema trên homepage
- OG image riêng cho từng page quan trọng nếu làm kịp trong Sprint 3
