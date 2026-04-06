# V2 Badminton — Task Breakdown

> Từ MASTERPLAN.md + NEXTJS_MIGRATION_PLAN.md → actionable tasks.
> Scaffold đã có: routes, font, CSS vars, sitemap, robots, api/lead placeholder, site.ts.

---

## Sprint 1 — Data Layer & Foundation

Mục tiêu: tạo single source of truth cho toàn bộ data, layout chung, và JSON-LD component.

### 1.1 `src/lib/locations.ts`

Tạo typed data cho 4 sân:

- Sân Green (Bình Thạnh) → localPage `/lop-cau-long-binh-thanh`
- Sân Huệ Thiên (Thủ Đức) → localPage `/lop-cau-long-thu-duc`
- Sân Khang Sport Bình Triệu (Thủ Đức) → localPage `/lop-cau-long-thu-duc`
- Sân Phúc Lộc (Thủ Đức) → localPage `/lop-cau-long-thu-duc`

Mỗi sân cần:

- `id`, `name`, `shortName`, `schemaName`
- `district` enum: `binh_thanh` | `thu_duc`
- `districtLabel` display string
- `mapsUrl` (Google Maps link)
- `mapsLabel` text cho CTA / schema label
- `localPage` slug
- `primaryForSchema?` cho root LocalBusiness fallback
- `geo` { lat, lng }
- `image` path + `imageAlt`
- `addressText` (display only)
- `streetAddress`, `addressLocality`, `addressRegion`, `addressCountry`

Source: extract từ `D:\V2\landing-page\index.html` location cards + local pages.

Ghi chú:

- `mapsEmbed` defer khỏi Sprint 1, chưa đưa vào type
- data phải đủ để render card UI + JSON-LD mà không parse lại freeform address string

### 1.2 `src/lib/pricing.ts`

Tạo typed pricing data phản ánh đúng mô hình bán thực tế:

**Tiers:**

- Nhóm nhỏ (2-6 người): gói tháng, giá/tháng
- 1 kèm 1: giá/giờ (không có gói tháng)
- Doanh nghiệp: báo giá riêng, không có giá cố định

**Type shape** — dùng discriminated union, không ép flat fields:

```ts
type BaseTier = {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  features: string[];
  cta: {
    label: string;
    ctaName: "dang_ky_hoc_thu" | "nhan_bao_gia";
  };
};

type GroupTier = {
  kind: "group";
  billingModel: "monthly_package";
  id: string; name: string; shortLabel: string; description: string;
  groupSize: string;           // "2-6 người"
  sessionsPerWeek: 2 | 3;
  pricePerMonth: number;       // VND
  sessionsPerMonth: number;
  displayPrice: string;
  priceRangeContribution: { min: number; max: number };
  features: string[];
  cta: { label: string; ctaName: "dang_ky_hoc_thu" | "nhan_bao_gia" };
};

type PrivateTier = {
  kind: "private";
  billingModel: "per_hour";
  id: string; name: string; shortLabel: string; description: string;
  pricePerHour: number;        // VND
  displayPrice: string;
  priceRangeContribution: { min: number; max: number };
  features: string[];
  cta: { label: string; ctaName: "dang_ky_hoc_thu" | "nhan_bao_gia" };
};

type EnterpriseTier = {
  kind: "enterprise";
  billingModel: "quote";
  id: string; name: string; shortLabel: string; description: string;
  priceLabel: string;          // "Liên hệ báo giá"
  displayPrice: string;
  priceRangeContribution: null;
  features: string[];
  cta: { label: string; ctaName: "dang_ky_hoc_thu" | "nhan_bao_gia" };
};

type PricingTier = GroupTier | PrivateTier | EnterpriseTier;
```

Render logic switch trên `kind` — không dùng `pricePerSession ?? pricePerMonth ?? priceLabel`.

Derived export cần có:

```ts
export const sitePriceRange = buildPriceRange(pricingTiers);
```

`buildPriceRange()` lấy min/max từ `priceRangeContribution`, tránh rebuild schema `priceRange` ở nhiều nơi.

Source: extract từ homepage pricing section + nguoi-moi pricing chips.

### 1.3 `src/lib/schedule.ts`

Tạo typed schedule data:

- Lịch theo sân + ngày + khung giờ
- `courtId` reference sang locations
- `dayGroup` (T2-T6, T7-CN)
- `timeSlotId` machine value cho form state
- `timeLabel` display string cho UI
- `level` enum
- `levelLabel` display string cho UI
- `prefillMessage` string (dùng cho schedule→form prefill)
- `prefillCourtId` (khớp form select sân)
- `prefillTimeSlotId` (khớp form select khung giờ)

Ghi chú:

- tách `timeSlotId` và `timeLabel` để UI copy có thể thay đổi mà không làm drift form value
- `prefillTimeSlotId` phải khớp `timeSlotId` để flow schedule → form không cần mapping lại ở component

Source: extract từ homepage schedule section + filter tabs.

### 1.4 `src/lib/faqs.ts`

Tạo typed FAQ data, chia theo page:

- `homepage` FAQs
- `nguoiMoi` FAQs
- `binhThanh` FAQs
- `thuDuc` FAQs

Mỗi FAQ:

- `question`
- `answerText`
- `answerHtml?`
- `schemaEligible`
- `order`
- `page` identifier

Source: extract từ 4 HTML files.

### 1.5 `src/lib/routes.ts`

Tạo route registry + canonical helpers:

- source of truth cho 4 production URLs hiện tại
- export `pageType` type và page metadata helpers
- `tracking.ts` import `pageType` type từ đây, không tự define lại
- helper build canonical URL theo policy `trailingSlash: true`

### 1.6 `src/lib/tracking.ts`

Tạo tracking contract:

- `trackEvent(name, params)` function push to dataLayer
- Type-safe event names (parity): `cta_click`, `contact_click`, `map_click`, `form_start`, `generate_lead`, `form_error`
- Type-safe event names (new, wired in Sprint 4.3): `form_field_focus`, `form_abandon`, `time_to_submit`
- Type-safe `cta_name` enum
- Type-safe `cta_location` enum
- Export `window.v2TrackEvent` cho generate_lead

### 1.7 Port images vào `public/`

- Copy tất cả images từ `D:\V2\landing-page\` sang `public/images/`
- Verify WebP/AVIF formats
- Hero images, court photos, logo, favicon

### 1.8 Nav + Footer components

- `src/components/layout/Nav.tsx` — logo, nav links, CTA button, mobile menu
- `src/components/layout/Footer.tsx` — phone 0907 911 886, Zalo, Facebook, address, copyright
- Update `src/app/layout.tsx` để dùng Nav + Footer

### 1.9 `src/components/ui/JsonLd.tsx`

Generic component render `<script type="application/ld+json">`:

- Accept typed schema object
- Stringify + escape
- Dùng cho LocalBusiness, SportsActivityLocation, FAQPage, BreadcrumbList, Course, Organization, WebSite

---

## Sprint 2 — Homepage Port + Lead Backend + Monitoring Baseline

Mục tiêu: port toàn bộ homepage content + conversion flows từ production HTML,
đồng thời dựng luôn lead backend và monitoring baseline để preview QA có observability
thật từ ngày đầu.

### 2.1 Hero section

- Animated heading "BẮT ĐẦU / HÀNH TRÌNH / CẦU LÔNG"
- Subheading + CTA buttons
- `cta_click` tracking trên CTA buttons
- Responsive layout mobile-first

### 2.2 Pricing section

- Pricing cards từ `lib/pricing.ts`
- Hover/active states
- CTA per card với `cta_click` tracking
- Mobile: stack vertical

### 2.3 "Khác biệt của V2" section

- Why-choose cards
- Icon + heading + description per card
- Từ production content

### 2.4 Course cards

- Khóa cơ bản, nâng cao, doanh nghiệp
- Links tới relevant pages/sections
- `cta_click` tracking

### 2.5 Schedule section với filter tabs

- Tab filter: Tất cả / Bình Thạnh / Thủ Đức (hoặc by court)
- Schedule cards từ `lib/schedule.ts`
- **CRITICAL**: Click schedule card → prefill form (sân + giờ + message) → scroll to form → focus empty field
- Client component vì cần interactivity
- `form_start` tracking khi prefill triggers focus

### 2.6 Location cards với deep links

- 4 court cards từ `lib/locations.ts`
- Mỗi card: ảnh, tên, địa chỉ, maps link + **deep link nội bộ**
  - Green → `/lop-cau-long-binh-thanh/`
  - Huệ Thiên/Khang Sport/Phúc Lộc → `/lop-cau-long-thu-duc/`
- `map_click` tracking cho maps link
- `cta_click` tracking cho deep link

### 2.7 SEO links + Business section + FAQ accordion

- SEO internal links block linking to local pages + nguoi-moi
- Business/doanh nghiệp section
- FAQ accordion từ `lib/faqs.ts` (homepage set)
- Accessible: keyboard nav, aria-expanded

### 2.8 ContactForm + Server Action + Lead pipeline (full vertical)

> **Architecture decision**: Server Action là canonical submit path duy nhất.
> Không có `/api/lead` route handler cho form. Server Action cho progressive
> enhancement tự nhiên (form works without JS), CSRF protection built-in,
> và không cần origin check thủ công.
>
> `/api/lead` route handler bị xóa. Thay bằng `/api/health` (Sprint 2.13).

**Form UI:**

- Fields: name, phone, level (select), court (select), time_slot (select), message (textarea)
- Honeypot field (hidden, CSS-hidden, tabindex=-1)
- Client-side validation trước submit
- Phone regex: `/^(0[35789])\d{8}$/`
- Success/error state UI
- Anti-double-submit: disable button after click, re-enable on error

**Server Action (`src/app/actions/submitLead.ts`):**

1. Re-validate toàn bộ server-side (không tin client)
2. Check honeypot → reject nếu filled
3. **Anti-spam tiered** (xem chi tiết ở 2.14)
4. **Save to DB first** (Vercel Postgres)
5. Async: notify Telegram (5s timeout, log failure, never block)
6. Async: notify email backup (Resend or similar)
7. Return `{ success: true, leadId }` hoặc `{ success: false, errors }`
8. Client fires `generate_lead` ONLY when `success: true`

**Tracking hooks trong form:**

- `form_start` (once on first focusin)
- `generate_lead` ONLY after Server Action returns success
- `form_error` on validation fail or Server Action error

### 2.9 Schedule → form prefill flow

- **MIGRATION ACCEPTANCE CRITERION**
- Click schedule card → set form values (court, time_slot, message) → smooth scroll to form → focus first empty field
- Must work on mobile
- Corporate card click → clear schedule prefill → set business mode → scroll to form
- Client-side state management (useState or useRef)

### 2.10 Database setup (Vercel Postgres)

- Lead table with all fields from MASTERPLAN §19.2:
  - id, name, phone, level, court, time_slot, message
  - landing_page, page_type, referrer
  - utm_source, utm_medium, utm_campaign, utm_content
  - created_at, device_type, submission_method
- Migration script (Drizzle or raw SQL)
- Env vars: `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`

### 2.11 Telegram notification module

- `src/lib/notify/telegram.ts`
- Bot token + chat ID via env vars
- Message format: name, phone, court, time, page, UTM source
- Timeout: 5s max
- Return success/fail, never throw

### 2.12 Email backup notification module

- `src/lib/notify/email.ts`
- Via Resend (or similar)
- Fires when Telegram fails OR always as backup
- Same info as Telegram message
- Env vars: `RESEND_API_KEY`, `NOTIFY_EMAIL_TO`

### 2.13 `/api/health` endpoint

- `src/app/api/health/route.ts`
- Check DB connection
- Return 200 + `{ ok: true, timestamp }`

### 2.14 Anti-spam tiered strategy (Turnstile + no-JS fallback)

> **Vấn đề**: Turnstile cần JS để render widget và tạo token. Nhưng form phải
> submit được khi JS tắt (progressive enhancement). Nếu Server Action reject
> mọi request không có token → no-JS fallback vô nghĩa.
>
> **Giải pháp**: Server Action branch theo có/không có token.

**Khi JS hoạt động (majority path):**

- Turnstile widget render trong ContactForm (client component)
- Token gửi kèm form data qua hidden field `cf-turnstile-response`
- Server Action verify token via Turnstile `/siteverify` API
- Rate limit: 5 req / IP / hour

**Khi JS tắt (progressive enhancement path):**

- Không có Turnstile token → Server Action detect `!turnstileToken`
- Không reject — thay vào đó apply **stricter controls**:
  - Rate limit thắt hơn: **2 req / IP / hour**
  - Honeypot vẫn active (CSS-hidden field, hoạt động cả khi no-JS)
  - Timing check **không áp dụng** (xem lý do SSG bên dưới)
  - Flag lead trong DB: `submission_method: "no_js"` để dễ audit
- Lead vẫn được save bình thường nếu pass các check trên

**Timing check — SSG constraint:**

> **Vấn đề với Server Component token**: Homepage là SSG. Nếu `issueFormToken()`
> chạy trong Server Component lúc build, một token duy nhất bị bake vào HTML
> tĩnh cho mọi user đến khi rebuild. Token hết hạn hàng loạt, timing check
> mất hoàn toàn ý nghĩa per-request.
>
> **Giải pháp**: timing check chỉ áp dụng cho JS path qua `/api/form-token`
> (dynamic route). No-JS path không có timing check — dùng rate limit + honeypot.

**JS path — token qua dynamic endpoint:**

1. ContactForm (client component) fetch `GET /api/form-token` lúc mount
2. `/api/form-token` là **dynamic route** (không cache), issue signed JWT `{ iat }` mỗi request
3. Token nhét vào hidden field, gửi kèm Server Action
4. Server Action verify chữ ký + `elapsed < 3_000ms` → reject nếu quá nhanh

```ts
// app/api/form-token/route.ts — dynamic, không SSG
export const dynamic = "force-dynamic";

export async function GET() {
  const token = await issueFormToken(); // signs { iat: now }
  return Response.json({ token }, { headers: { "Cache-Control": "no-store" } });
}
```

**No-JS path — timing check bị drop, đây là tradeoff có chủ đích:**

- Không có JS → không fetch `/api/form-token` → không có token
- Server Action detect `!formToken` và `!turnstileToken` → no-JS path
- Áp dụng: rate limit 2/h + honeypot
- Timing check **không áp dụng** vì không có cách lấy per-request timestamp mà không phá SSG
- Tradeoff chấp nhận được: no-JS bot traffic rất thấp, rate limit đủ để chặn

```ts
// In submitLead.ts
const hasTurnstile = Boolean(formData.get("cf-turnstile-response"));
const hasFormToken = Boolean(formData.get("form_token"));

if (hasTurnstile) {
  // JS path: full protection
  await verifyTurnstile(formData.get("cf-turnstile-response"));
  if (hasFormToken) await verifyFormToken(formData.get("form_token")); // timing check
  await checkRateLimit(ip, { max: 5, window: "1h" });
} else {
  // no-JS path: stricter rate limit + honeypot only, no timing check
  await checkRateLimit(ip, { max: 2, window: "1h" });
}
```

**Env vars:** `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `FORM_TOKEN_SECRET`

### 2.15 Sentry + uptime monitoring (from day 1)

> **Tại sao ở Sprint 2, không phải Sprint 7**: DB + Server Action + notify
> đều được build ở Sprint 2. Nếu monitoring chỉ vào lúc cutover thì mọi
> bug trong form/lead pipeline ở giai đoạn preview đều im lặng.

**Sentry:**

- `@sentry/nextjs` init trong `next.config.ts` + `instrumentation.ts`
- Client error tracking (form JS errors, hydration errors)
- Server error tracking (Server Action failures, DB errors, notify failures)
- Env vars: `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`

**Uptime monitoring:**

- Monitor `/api/health` endpoint (created in 2.13)
- Alert channel: Telegram ops (same bot, different chat ID or thread)
- Check interval: 5 phút
- Dùng Vercel Cron, UptimeRobot, hoặc Better Stack — chọn 1

**Lead failure alerting:**

- Trong Server Action: nếu DB save fail → Sentry capture + alert
- Nếu cả Telegram lẫn email notify đều fail → Sentry capture + alert
- Daily: verify ít nhất 1 health check pass

### 2.16 Floating CTAs + Scroll reveal

- Floating CTA buttons (Zalo, phone, scroll-to-form)
- Appear after scroll threshold
- Zalo: mobile → `zalo.me/0907911886` deeplink, desktop → show phone + QR
- `contact_click` tracking

### 2.17 Delete `/api/lead` route placeholder

- Remove `src/app/api/lead/route.ts` (501 scaffold)
- Server Action (`src/app/actions/submitLead.ts`) is the only submit path
- No route handler needed for form submission

### 2.18 Homepage JSON-LD

Render via JsonLd component:

- `LocalBusiness` (primary, with all locations)
- `SportsActivityLocation`
- `FAQPage` (homepage FAQs)
- `Organization` (new)
- `WebSite` (new)

---

## Sprint 3 — SEO Pages Parity

Mục tiêu: port 3 trang SEO với full content, metadata, schema.

### 3.1 `SeoPageLayout` component

Shared layout cho SEO pages:

- Breadcrumb (visual + BreadcrumbList schema)
- Hero with H1 + intro
- Content sections
- FAQ accordion
- CTA block
- Consistent spacing/typography

### 3.2 Port `/hoc-cau-long-cho-nguoi-moi/`

Từ `D:\V2\landing-page\hoc-cau-long-cho-nguoi-moi\index.html`:

- H1: "Học Cầu Lông Cho Người Mới Bắt Đầu Tại TP.HCM"
- Sections: buổi đầu học gì, lộ trình (nhóm nhỏ, 1 kèm 1, 8-12 buổi), học phí pricing chips
- FAQ with pricing FAQ
- Schema: BreadcrumbList + FAQPage
- Metadata: title, description, OG

### 3.3 Port `/lop-cau-long-binh-thanh/`

Từ `D:\V2\landing-page\lop-cau-long-binh-thanh\index.html`:

- H1: "Lớp Cầu Lông Bình Thạnh — Sân Green"
- Sections: Ai phù hợp với Sân Green, Nên chọn khung giờ nào
- FAQ
- Schema: LocalBusiness + SportsActivityLocation + BreadcrumbList + FAQPage
- priceRange in schema

### 3.4 Port `/lop-cau-long-thu-duc/`

Từ `D:\V2\landing-page\lop-cau-long-thu-duc\index.html`:

- H1: "Lớp Cầu Lông Thủ Đức"
- 3 courts: Huệ Thiên, Khang Sport, Phúc Lộc
- Sections: Nên chọn sân nào, Nên chọn khung giờ nào
- FAQ with "Nếu học tại Thủ Đức thì nên chọn sân nào?"
- Schema: LocalBusiness (root: Huệ Thiên) + SportsActivityLocation + BreadcrumbList + FAQPage
- priceRange in schema

### 3.5 Course structured data

Add `Course` schema cho:

- Khóa cơ bản (nhóm nhỏ)
- Khóa nâng cao
- Chương trình doanh nghiệp

Render trên homepage hoặc relevant pages.

### 3.6 OG images per page

Tạo OG image riêng cho:

- Homepage
- nguoi-moi
- binh-thanh
- thu-duc

Dùng `next/og` hoặc static images.

---

## Sprint 4 — Tracking & Analytics

Mục tiêu: GA4 + Meta Pixel parity với production.

### 4.1 GTM / GA4 loading

- Load GTM script trong layout
- Respect cookie consent (don't load until consent)
- Verify `dataLayer` available

### 4.2 Event tracking integration

Wire all events từ `lib/tracking.ts`:

- `cta_click` — all CTA buttons via data attributes
- `contact_click` — phone, Zalo, Facebook links
- `map_click` — Google Maps links
- `form_start` — once on first form focusin
- `generate_lead` — ONLY after Server Action returns `{ success: true }`
- `form_error` — on validation fail or Server Action error

### 4.3 Form analytics (new events)

Post-parity additions from MASTERPLAN §5.4 / §12.1:

- `form_field_focus` — fire when user focuses each field (name, phone, level, court, time_slot, message). Cho phép đo rơi ở field nào.
- `form_abandon` — fire khi user đã trigger `form_start` nhưng navigate away hoặc tab away mà chưa submit. Dùng `visibilitychange` + `beforeunload`.
- `time_to_submit` — đo thời gian (ms) từ `form_start` đến `generate_lead`. Gửi kèm `generate_lead` event params.

Implementation:

- Extend `lib/tracking.ts` type union với 3 events mới
- `form_field_focus`: listener trên mỗi field, fire mỗi field chỉ 1 lần per session
- `form_abandon`: `visibilitychange` handler, chỉ fire nếu `form_start` đã fire và `generate_lead` chưa fire
- `time_to_submit`: record timestamp lúc `form_start`, compute delta lúc `generate_lead`, gửi `time_to_submit_ms` param

### 4.4 Meta Pixel

- Load Meta Pixel (respect cookie consent)
- Fire `Lead` event synced with `generate_lead`
- No PII in event params (no name, no phone, no message)

### 4.5 UTM capture

- Capture UTM params on page load (from URL)
- Store in session/hidden fields
- Pass to Server Action on submit

---

## ~~Old "Lead Backend" sprint~~ — _(Absorbed into Sprint 2)_

> Lead backend (DB, Server Action, Telegram, email, Turnstile) giờ nằm trong
> Sprint 2.8–2.14 để form và backend được build cùng lúc, tránh rework.
> `/api/lead` route handler đã bị xóa — Server Action là canonical submit path.

---

## Sprint 5 — Polish & Compliance

### 5.1 Zalo mobile/desktop UX

- Mobile: `zalo.me/0907911886` deeplink
- Desktop: show phone number + QR code image
- Device detection (user-agent or media query)
- Test riêng trên cả hai

### 5.2 Cookie consent banner

- Show consent banner cho GA4 / GTM / Meta Pixel
- Block tracking scripts until consent
- Store consent in cookie/localStorage
- Required before production (Vietnam PDPD)

### 5.3 Privacy policy page

- Route: `/chinh-sach-bao-mat/`
- Content: how form data is used, what tracking is used
- Link from footer + form

### 5.4 robots.ts update

Add AI crawler rules matching production:

- Allow GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot
- Add sitemap directive

### 5.5 `llms.txt` port

Port `D:\V2\landing-page\llms.txt` → `public/llms.txt`

- Core info, pricing, locations, schedule, facts, indexable pages
- Update if any data changed

### 5.6 Update sitemap.ts

- Add `/chinh-sach-bao-mat` to routes
- Verify lastModified dates
- Verify trailing slashes

---

## Sprint 6 — QA & Preview Verification

Mục tiêu: pass toàn bộ migration safety checklist trước cutover.

### 6.1 Visual parity check

- Compare mỗi page side-by-side với production
- Mobile + Desktop
- Check: layout, spacing, typography, colors, images

### 6.2 Form testing

- Submit form with JS (Server Action + Turnstile) → verify DB save → verify Telegram → verify email
- Submit with JS disabled → verify progressive enhancement works, lead saved with `submission_method: "no_js"`
- Submit with bad data → verify server-side validation errors
- Double-click submit → verify no duplicate leads
- Honeypot filled → verify rejected silently
- Rate limit JS path → verify blocked after 5th request per IP/hour
- Rate limit no-JS path → verify blocked after 2nd request per IP/hour
- Turnstile invalid token → verify rejected
- No-JS path → verify only honeypot + stricter rate limit apply, no timing-check rejection

### 6.3 Tracking parity

- Verify 6 parity events fire correctly in GTM debug mode
- Verify 3 new form analytics events: `form_field_focus`, `form_abandon`, `time_to_submit`
- Verify `generate_lead` ONLY fires after Server Action success
- Verify `time_to_submit_ms` param accompanies `generate_lead`
- Verify no PII in event params
- Compare event payload structure with production

### 6.4 Schema validation

- Run Google Rich Results Test trên mỗi page
- Validate: LocalBusiness, SportsActivityLocation, FAQPage, BreadcrumbList, Course, Organization, WebSite
- No errors, no warnings

### 6.5 Core Web Vitals

- Lighthouse mobile score ≥ 90 performance
- LCP < 2.5s (target < 2.0s)
- CLS < 0.1
- INP < 200ms
- Compare with production baseline

### 6.6 Link check

- All internal links resolve (no 404)
- All external links valid
- Deep links from location cards work
- Breadcrumb links work

### 6.7 Deploy verification script

Script kiểm tra automated:

- All 4 routes return 200
- `/api/health` returns 200
- Sitemap accessible
- Robots accessible
- Canonical tags correct
- OG tags present
- JSON-LD parseable

---

## Sprint 7 — Production Cutover

### 7.1 Baseline snapshot

Trước cutover, chụp:

- Organic sessions (GA4)
- `generate_lead` count (GA4)
- Lead rate per page
- Top queries (GSC)
- CTR / average position (GSC)
- CWV mobile scores
- `form_start → generate_lead` rate

### 7.2 Monitoring verification & hardening

> Sentry + uptime + lead alerting đã chạy từ Sprint 2.15.
> Task này verify chúng sẵn sàng cho production traffic thật.

- Verify Sentry captures real errors (trigger test error, confirm alert)
- Verify uptime monitor đang ping `/api/health` mỗi 5 phút
- Verify lead failure alerts đến đúng Telegram ops channel
- Setup weekly audit process: DB lead count vs GA4 `generate_lead` (flag if >10% diff)
- Verify Sentry source maps upload đúng cho production build
- Confirm alert escalation: nếu uptime fail > 15 phút → second channel (email/SMS)

### 7.3 DNS cutover

- Point `v2badminton.com` to Vercel
- Verify www/non-www redirect
- Verify HTTP → HTTPS
- Verify trailing slash consistency
- Submit sitemap in GSC
- Inspect URLs in GSC

### 7.4 Post-cutover monitoring (14 days)

- Day 1-3: realtime GA4, lead submissions, Telegram notifications, GSC URL inspection
- Day 4-14: ranking changes, lead rate per page, CWV mobile, indexing status
- Decision point day 14: keep or rollback

### 7.5 Rollback plan

If critical issues after cutover:

- Point DNS back to Cloudflare (static HTML)
- Same URL structure = clean rollback
- Document trigger conditions: lead drop >30%, ranking crash, form broken, index errors

---

## Task Dependencies

```
Sprint 1 (data + foundation)
    ↓
Sprint 2 (homepage + form + lead backend) ←→ Sprint 3 (SEO pages) [overlap OK]
    ↓                                            ↓
Sprint 4 (tracking + form analytics) ←————— needs all pages + form
    ↓
Sprint 5 (polish + compliance) ←— needs tracking
    ↓
Sprint 6 (QA) ←— needs everything
    ↓
Sprint 7 (cutover) ←— needs QA pass
```

Sprint 2 bao gồm form + DB + notify + anti-spam + monitoring baseline — build cùng lúc, không rework.
Sprint 2 và Sprint 3 overlap được vì pages độc lập.
Sprint 4 cần pages + form xong để wire events và form analytics.

---

## Acceptance Criteria tổng

Migration chỉ pass khi:

- [ ] 4 URL chính parity content + metadata + schema
- [ ] Server Action submit → DB save → Telegram notify → email backup
- [ ] Form works without JS (progressive enhancement via Server Action)
- [ ] Schedule → form prefill flow giữ nguyên
- [ ] Corporate card → form flow giữ nguyên
- [ ] 6 parity tracking events fire đúng
- [ ] 3 new form analytics events wired (`form_field_focus`, `form_abandon`, `time_to_submit`)
- [ ] `generate_lead` chỉ fire sau Server Action success
- [ ] No PII in analytics
- [ ] Honeypot + Turnstile + rate limit active
- [ ] Cookie consent blocks tracking until accepted
- [ ] Privacy policy page exists
- [ ] Zalo mobile/desktop tested
- [ ] CWV mobile ≥ production baseline
- [ ] Schema validates (no errors)
- [ ] Sitemap + robots correct
- [ ] Sentry + uptime monitoring active before QA starts (setup in Sprint 2, verified in Sprint 7)
- [ ] Rollback plan documented and tested
