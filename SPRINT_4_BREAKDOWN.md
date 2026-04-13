# Sprint 4: Campaign Layer + Production Cutover

## Status

- Sprint 4 status: `BLOCKED_ON_INFRA`
- Dependency: `Sprint 3 DONE`
- Codebase state: `main` already includes Sprint 2 + Sprint 3

## Current State

Đã hoàn tất ở mức code/local QA:

- Homepage và money pages đã chạy bằng Sanity trên production code path.
- Các route đang publish:
  - `/`
  - `/hoc-cau-long-cho-nguoi-moi/`
  - `/lop-cau-long-binh-thanh/`
  - `/lop-cau-long-thu-duc/`
  - `/lop-cau-long-tre-em/`
  - `/lop-cau-long-cho-nguoi-di-lam/`
  - `/cau-long-doanh-nghiep/`
- Money page fallback đã được harden:
  - Sanity degraded không làm published pages 404
  - structured data đã có cho các route mới
  - enterprise CTA đã đưa đúng về business-mode flow trên homepage
- Campaign layer code đã xong:
  - schema `campaign` đã Việt hóa
  - query `getActiveCampaign()` đã có
  - homepage hero đã nhận optional campaign override
- Route evergreen `/lop-he-cau-long-tphcm/` đã có ở Phase 1:
  - route file compile an toàn
  - degraded fallback hoạt động
  - structured data và metadata đã có
  - chưa publish vào `coreRoutes` / `SeoLinksBlock`
- Mobile overflow ở contact section đã được fix trong code local
- Lead form runtime đã có:
  - honeypot
  - form token
  - Turnstile optional
  - Postgres insert
  - dedupe
  - Telegram / email notification
  - Upstash rate-limit path

Còn thiếu hoặc đang bị chặn ngoài repo:

- Production Vercel hiện vẫn thiếu:
  - `POSTGRES_URL` hoặc `POSTGRES_URL_NON_POOLING`
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`
- `https://v2badminton.com` chưa trỏ vào Vercel project này:
  - `vercel domains ls` trên team hiện trả `0 domains`
  - custom domain vẫn phục vụ sitemap cũ, chưa có các route mới từ Sprint 3/4
- Chưa có published `campaign` active để verify hero override bằng dữ liệu thật
- Chưa có published `money_page` slug `lop-he-cau-long-tphcm`, nên `S4A-A4` mới xong Phase 1, chưa thể publish gate Phase 2

## Sprint 4 Goal

Sprint 4 chốt 3 việc:

1. Thêm campaign layer đủ để homepage có thể chạy seasonal override an toàn.
2. Chuẩn bị landing page mùa hè theo pattern money page, nhưng publish theo gate rõ ràng.
3. Verify cutover production thật:
   - env
   - lead pipeline
   - mobile UX

## Planning Notes

- Sprint 4 chia thành 3 nhóm:
  - `4A`: Campaign + summer landing page
  - `4B`: Production cutover verification
  - `4C`: Mobile UX review
- `S4B-A2` phải chạy trước `S4B-A1`.
- `S4A-A4` phải đi theo 2 phase:
  - Phase 1: tạo route file + fallback path + type support
  - Phase 2: chỉ publish vào `coreRoutes` / `SeoLinksBlock` sau khi content đã live và verified
- Campaign chỉ override visual hero homepage:
  - không đổi metadata homepage
  - không ảnh hưởng money pages
- `linkedPageSlug` trong campaign query là fallback cho CTA:
  - `primaryCtaUrl`
  - rồi tới `/${linkedPageSlug}/`
  - rồi tới `#lien-he`
- Production verification phải chạy trên Vercel/prod thật, không dùng localhost thay thế.
- Mobile UX review ưu tiên thiết bị thật hơn responsive mode trên desktop.

---

## Sprint 4A: Campaign Layer

**Mục tiêu:** Cho phép business owner bật chiến dịch từ Sanity để override hero homepage, đồng thời chuẩn bị landing page mùa hè theo đúng publish gating.

### Group A1: Campaign Schema Polish

**Mục tiêu:** Việt hóa `campaign.ts`, thêm descriptions rõ ràng, và sửa preview subtitle để Studio hiển thị label đúng.

**Output:**

- Sidebar Studio hiển thị `Chiến dịch`
- Labels / descriptions có tiếng Việt đầy đủ
- Preview hiển thị `Nháp` / `Đang chạy` / `Đã kết thúc` thay vì raw value

### Group A2: Active Campaign Query

**Mục tiêu:** Thêm `getActiveCampaign()` và type tương ứng trong query layer.

**Output:**

- Query published-only cho campaign active theo ngày Việt Nam
- Trả `null` khi không có campaign
- Không cần degraded mode riêng

### Group A3: Homepage Campaign Integration

**Mục tiêu:** Homepage hero nhận optional campaign prop và override title / description / CTA / badge khi campaign active.

**Output:**

- Có campaign: hero override đúng
- Không có campaign: hero render y như hiện tại
- Eyebrow, trust stats, quick links vẫn giữ nguyên

### Group A4: Summer Landing Page

**Mục tiêu:** Tạo route evergreen `/lop-he-cau-long-tphcm/` theo pattern money page, với publish gate tách riêng.

**Phase 1 output:**

- Route file tồn tại
- Compile pass
- Chưa vào `coreRoutes`
- Chưa vào `SeoLinksBlock`
- Chưa vào sitemap/nav

**Phase 2 output:**

- Chỉ sau khi Sanity doc đã publish và production đã verify:
  - thêm vào `coreRoutes`
  - thêm vào `PREVIEW_READY_ROUTES`
  - route xuất hiện trong sitemap / homepage SEO links / nav-derived links

---

## Sprint 4B: Production Cutover Verification

**Mục tiêu:** Xác nhận toàn bộ conversion pipeline của Version C hoạt động thật trên production trước cutover.

### Group B2: Production Env Audit

**Mục tiêu:** Verify Vercel production env theo runtime hiện tại.

**Critical checks:**

- Sanity:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `SANITY_API_READ_TOKEN` nếu dataset private
- Database:
  - ít nhất một trong hai:
    - `POSTGRES_URL`
    - `POSTGRES_URL_NON_POOLING`
- Notification:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`
- Rate limiting:
  - `UPSTASH_REDIS_REST_URL` / `TOKEN`
  - hoặc KV alias tương ứng
- Anti-spam:
  - `FORM_TOKEN_SECRET`
  - Turnstile keys nếu dùng

### Group B1: Lead Pipeline Verification

**Mục tiêu:** Submit form trên production và verify end-to-end:

- UI success state
- Postgres row
- Telegram notification
- Email notification nếu configured
- rate limit
- honeypot
- Turnstile nếu configured

**Lưu ý:**

- dedupe chạy trước rate limit
- rate limit test phải dùng nhiều payload unique
- form dùng Server Action nên lỗi rate limit hiện qua structured UI state, không phải HTTP 429

---

## Sprint 4C: Mobile UX Review

**Mục tiêu:** Test production site trên thiết bị thật và ghi lại các vấn đề mobile trước cutover.

**Scope:**

- navigation
- hero
- pricing
- course
- coach
- schedule
- locations
- FAQ
- contact form
- 1-2 money pages
- footer

**Output:**

- Báo cáo issue có device + browser + severity
- Fix ngay nếu issue nhỏ
- Tách ticket riêng nếu issue lớn

---

## Execution Order

```text
Sprint 4A:
S4A-A1 -> S4A-A2 -> S4A-A3 -> S4A-A4

Sprint 4B:
S4B-A2 -> S4B-A1

Sprint 4C:
S4C-A1
```

Recommended rollout:

```text
S4A-A1
   -> S4A-A2
      -> S4A-A3
         -> S4A-A4 Phase 1

S4B-A2
   -> S4B-A1

S4C-A1

Sau khi:
- campaign flow đã ổn
- env audit pass
- production pipeline pass
- summer page content đã publish và verify

=> làm S4A-A4 Phase 2 publish gate
```

## Sprint 4 Definition Of Done

- Campaign schema dùng tiếng Việt đầy đủ trong Studio
- `getActiveCampaign()` hoạt động đúng theo ngày Việt Nam
- Homepage hero override được bằng campaign active mà không regression default hero
- Route `/lop-he-cau-long-tphcm/` tồn tại và compile an toàn
- Production env audit hoàn tất
- Lead pipeline production verify pass hoặc bug đã được fix
- Mobile UX review hoàn tất và issues đã được triage
- `npm run lint` + `npm run build` pass cho các ticket code

## Current Outcome

Những gì đã đạt được:

- `S4A-A1`, `S4A-A2`, `S4A-A3` đã xong
- `S4A-A4` đã xong `Phase 1`
- `S4B-A2` đã audit xong và xác định rõ biến production còn thiếu
- `S4C-A1` đã có triage:
  - local/mobile hết horizontal overflow sau patch
  - `v2badminton-next.vercel.app` render đúng
  - custom domain `v2badminton.com` chưa phản ánh deployment mới nên không thể coi là cutover hoàn tất

Những gì chưa thể đóng trong Sprint 4 nếu không có quyết định hạ tầng/content:

1. Cấp database production cho project này
2. Cấp Telegram bot credentials production
3. Gắn hoặc chuyển DNS `v2badminton.com` sang đúng Vercel project
4. Publish `campaign` active nếu muốn verify hero override thật
5. Publish `money_page` cho `lop-he-cau-long-tphcm` nếu muốn mở `Phase 2`

## Non-Scope

- Chưa migrate lead pipeline khỏi legacy `CourtId` / `TimeSlotId`
- Chưa thêm per-page contact section cho money pages
- Chưa đưa homepage metadata sang dynamic campaign metadata
- Chưa làm OpenClaw integration
- Chưa thay testimonial placeholder bằng content thật trong planning này
