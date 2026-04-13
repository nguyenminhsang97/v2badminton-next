# Sprint 4: Campaign Layer + Production Cutover - Tickets

## Status

- Sprint 4 status: `BLOCKED_ON_INFRA`
- Dependency: `Sprint 3 DONE`
- Codebase state: `main` already includes Sprint 2 + Sprint 3

## Current Result

- `S4A-A1` done
- `S4A-A2` done
- `S4A-A3` done
- `S4A-A4` Phase 1 done
- `S4B-A2` audited and documented
- `S4B-A1` blocked by missing production DB + Telegram credentials
- `S4C-A1` local/mobile issue triaged and patched in code, but public custom domain cutover is still blocked outside repo

## Sprint 4A: Campaign Layer

### S4A-A1: Campaign Schema → Tiếng Việt + Descriptions
- **Objective:** Việt hóa `campaign.ts`, thêm descriptions rõ ràng, và sửa preview subtitle để Studio hiển thị label đúng.
- **Scope:**
  - `src/sanity/schemaTypes/campaign.ts`
  - đổi document title
  - đổi option labels `draft/active/ended`
  - đổi field titles / descriptions
  - đổi validation message ngày kết thúc
  - thêm `STATUS_LABEL` map trong `preview.prepare()`
- **Dependency:** Sprint 3
- **Priority:** P0
- **Expected output:** Campaign schema trong Studio hoàn toàn bằng tiếng Việt, preview không còn raw status.

### S4A-A2: Add `getActiveCampaign()` Query + Type
- **Objective:** Thêm typed query lấy campaign active theo ngày Việt Nam.
- **Scope:**
  - `src/lib/sanity/queries.ts`
  - thêm `SanityActiveCampaign`
  - thêm `ACTIVE_CAMPAIGN_QUERY`
  - thêm `getActiveCampaign()`
  - dùng ngày Việt Nam (`UTC+7`) thay vì raw UTC date
  - trả `null` khi không có campaign active
- **Dependency:** S4A-A1
- **Priority:** P0
- **Expected output:** Query layer có `getActiveCampaign()` an toàn và không bị lệch ngày `00:00–06:59 ICT`.

### S4A-A3: Homepage Campaign Integration
- **Objective:** Wire campaign vào homepage hero theo kiểu optional override.
- **Scope:**
  - `src/components/home/sectionProps.ts`
  - `src/components/home/HeroSection.tsx`
  - `src/app/(site)/page.tsx`
  - `src/app/globals.css`
  - campaign badge
  - title override
  - description override
  - CTA override
  - fallback CTA chain:
    - `primaryCtaUrl`
    - `/${linkedPageSlug}/`
    - `#lien-he`
- **Dependency:** S4A-A2
- **Priority:** P0
- **Expected output:** Có campaign thì hero đổi đúng; không có campaign thì homepage giữ nguyên như Sprint 3.

### S4A-A4: Summer Landing Page `/lop-he-cau-long-tphcm/`
- **Objective:** Tạo route evergreen cho chiến dịch hè với publish gate 2 phase.
- **Scope Phase 1:**
  - `src/lib/routes.ts`
    - thêm path vào `CoreRoutePath` type only
    - chưa thêm `coreRoutes` array
  - `src/lib/moneyPageFallback.ts`
    - thêm fallback config cho route hè
  - `src/app/(site)/lop-he-cau-long-tphcm/page.tsx`
    - route file mới
    - `getMoneyPage()`
    - degraded fallback
    - `notFound()` khi doc chưa tồn tại
    - structured data + metadata
- **Scope Phase 2:**
  - `src/lib/routes.ts`
    - thêm entry vào `coreRoutes`
  - `src/components/home/SeoLinksBlock.tsx`
    - thêm vào `PREVIEW_READY_ROUTES`
  - chỉ làm sau khi Sanity doc đã publish và route đã verify trên production
- **Dependency:** S4A-A2
- **Priority:** P0
- **Expected output:** Route hè tồn tại an toàn ở Phase 1; chỉ được publish vào sitemap/nav/homepage links ở Phase 2.

---

## Sprint 4B: Production Cutover Verification

### S4B-A2: Production Env Vars Audit
- **Objective:** Audit toàn bộ env vars production theo runtime thực tế.
- **Scope:**
  - Vercel dashboard hoặc Vercel CLI
  - verify:
    - `NEXT_PUBLIC_SANITY_PROJECT_ID`
    - `NEXT_PUBLIC_SANITY_DATASET`
    - `SANITY_API_READ_TOKEN`
    - `POSTGRES_URL` hoặc `POSTGRES_URL_NON_POOLING`
    - `TELEGRAM_BOT_TOKEN`
    - `TELEGRAM_CHAT_ID`
    - `UPSTASH_REDIS_REST_URL` / `TOKEN` hoặc KV aliases
    - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
    - `TURNSTILE_SECRET_KEY`
    - `FORM_TOKEN_SECRET`
    - `SENTRY_DSN` (optional)
    - `NEXT_PUBLIC_SITE_URL`
- **Dependency:** None
- **Priority:** P0
- **Expected output:** Có checklist env production rõ ràng trước khi test pipeline.

### S4B-A1: Production Lead Pipeline Verification
- **Objective:** Verify form production end-to-end và fix bug nếu có.
- **Scope:**
  - test form render
  - submit test lead
  - verify Postgres row
  - verify Telegram notification
  - verify email notification nếu configured
  - test rate limit
  - test honeypot
  - test Turnstile nếu configured
  - xóa test data sau khi xong
- **Important runtime notes:**
  - dedupe chạy trước rate limit
  - rate-limit test phải dùng `6` submissions unique từ cùng IP
  - form dùng Server Action nên lỗi rate limit hiện trên UI, không phải HTTP 429
- **Dependency:** S4B-A2
- **Priority:** P0
- **Expected output:** Conversion pipeline production được verify thật hoặc bug đã được fix trong cùng ticket.

---

## Sprint 4C: UX Review

### S4C-A1: Mobile UX Review
- **Objective:** Review UX thực tế trên điện thoại và triage issues.
- **Scope:**
  - test trên thiết bị thật
  - production URL
  - check:
    - navigation
    - hero
    - pricing cards
    - course
    - coach
    - schedule
    - locations
    - FAQ
    - contact form
    - 1-2 money pages
    - footer
  - output issue report gồm:
    - section
    - description
    - screenshot
    - device + browser
    - severity
- **Dependency:** None
- **Priority:** P1
- **Expected output:** Có report mobile UX rõ ràng để fix hoặc tách follow-up ticket.

---

## Summary

| ID | Title | Group | Dependency | Priority |
|---|---|---|---|---|
| S4A-A1 | Campaign Schema → Tiếng Việt + Descriptions | 4A | Sprint 3 | P0 |
| S4A-A2 | Add `getActiveCampaign()` Query + Type | 4A | S4A-A1 | P0 |
| S4A-A3 | Homepage Campaign Integration | 4A | S4A-A2 | P0 |
| S4A-A4 | Summer Landing Page `/lop-he-cau-long-tphcm/` | 4A | S4A-A2 | P0 |
| S4B-A2 | Production Env Vars Audit | 4B | None | P0 |
| S4B-A1 | Production Lead Pipeline Verification | 4B | S4B-A2 | P0 |
| S4C-A1 | Mobile UX Review | 4C | None | P1 |

## Execution Order

```text
Track 1: Campaign layer
S4A-A1 -> S4A-A2 -> S4A-A3 -> S4A-A4 Phase 1

Track 2: Production cutover
S4B-A2 -> S4B-A1

Track 3: QA
S4C-A1

After:
- campaign flow verified
- env audit pass
- production lead pipeline pass
- summer content published and verified

=> S4A-A4 Phase 2 publish gate
```

## Notes

- `S4A-A4` là ticket duy nhất có 2 phase rõ ràng:
  - Phase 1 để route compile và tồn tại an toàn
  - Phase 2 để publish route vào sitemap / nav-derived links / homepage SEO links
- `CoreRoutePath` type có thể được mở rộng ở Phase 1 vì đó chỉ là type support.
- `coreRoutes` array và `PREVIEW_READY_ROUTES` chỉ được sửa ở Phase 2.
- `S4B-A2` phải xong trước `S4B-A1`.
- `S4C-A1` không block code ticket, nhưng block cutover nếu có major mobile issues chưa fix.
