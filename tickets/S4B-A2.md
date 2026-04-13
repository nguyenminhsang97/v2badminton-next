# S4B-A2 · Production env vars audit

**Mục tiêu:** Xác nhận tất cả env vars cần thiết đã được set đúng trên Vercel production. Không có code change — chỉ verify và fix config.

**Thời gian ước lượng:** 20 phút

**Phụ thuộc:** Không. Nên làm TRƯỚC S4B-A1 (pipeline test) để đảm bảo config đúng trước khi test.

**Rủi ro:** CAO nếu thiếu vars. Thấp nếu đã set đúng — chỉ là verification.

---

## Cách check

### Option 1: Vercel Dashboard

1. Mở Vercel → project v2badminton-next → Settings → Environment Variables
2. Kiểm tra từng biến theo bảng bên dưới

### Option 2: Vercel CLI

```bash
vercel env ls production
```

---

## Bảng env vars cần có

### Nhóm 1 — Sanity CMS (CRITICAL)

| Biến | Ví dụ | Mục đích |
|------|-------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `abc123` | Project ID từ Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Dataset name |
| `SANITY_API_READ_TOKEN` | `sk...` | Token đọc data (nếu dataset private) |

**Nếu thiếu `PROJECT_ID` hoặc `DATASET`:** Sanity client không khởi tạo được → tất cả trang degrade về hardcoded fallback (HTTP 200, không phải 404). Người dùng thấy placeholder content, không thấy lỗi.

**Nếu thiếu `SANITY_API_READ_TOKEN` (dataset private):** Queries trả empty → tương tự degrade — fallback content, vẫn HTTP 200.

### Nhóm 2 — Database (CRITICAL)

| Biến | Ví dụ | Mục đích |
|------|-------|---------|
| `POSTGRES_URL` | `postgresql://...` | Connection string Vercel Postgres |

**Nếu thiếu:** Form submit thành công nhưng không lưu lead vào database. Mất data.

**Cách verify thêm:** Đảm bảo table `leads` tồn tại. Nếu chưa tạo, chạy SQL từ `src/lib/db/schema.sql`.

### Nhóm 3 — Notification (IMPORTANT)

| Biến | Ví dụ | Mục đích |
|------|-------|---------|
| `TELEGRAM_BOT_TOKEN` | `123456:ABC...` | Telegram bot token |
| `TELEGRAM_CHAT_ID` | `-100123456` | Group/chat ID nhận notification |

**Nếu thiếu:** Lead lưu vào DB nhưng không có thông báo. Business owner không biết có lead mới.

### Nhóm 3.5 — Rate limiting (IMPORTANT)

| Biến | Ví dụ | Mục đích |
|------|-------|---------|
| `UPSTASH_REDIS_REST_URL` | `https://...upstash.io` | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | `AX...` | Upstash Redis auth token |

Alias names (Vercel KV integration tự động inject):
- `UPSTASH_REDIS_REST_KV_REST_API_URL` (thay cho `UPSTASH_REDIS_REST_URL`)
- `UPSTASH_REDIS_REST_KV_REST_API_TOKEN` (thay cho `UPSTASH_REDIS_REST_TOKEN`)

`src/lib/rateLimit.ts` đọc cả hai dạng tên — chỉ cần 1 trong 2.

**Nếu thiếu cả hai:** Rate limiter fail open — mọi request đều được phép. Không có lỗi hiển thị, chỉ là form không bị rate limit. Đây là blocker trước cutover nếu muốn chống spam.

---

### Nhóm 4 — Anti-spam (RECOMMENDED)

| Biến | Ví dụ | Mục đích |
|------|-------|---------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `0x4AAA...` | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | `0x4AAA...` | Turnstile server verification |
| `FORM_TOKEN_SECRET` | `random-32-char-string` | Token HMAC signing |

**Nếu thiếu:** Form vẫn hoạt động nhưng ít protection chống spam. Không phải blocker nhưng nên có trước cutover.

**Lưu ý Turnstile:** Domain production phải được whitelist trên Cloudflare Turnstile dashboard. Nếu chỉ whitelist `localhost` thì production sẽ fail verification.

### Nhóm 5 — Monitoring (NICE TO HAVE)

| Biến | Ví dụ | Mục đích |
|------|-------|---------|
| `SENTRY_DSN` | `https://...@sentry.io/...` | Error tracking |
| `NEXT_PUBLIC_SENTRY_DSN` | (same) | Client-side error tracking |

### Nhóm 6 — Site config

| Biến | Ví dụ | Mục đích |
|------|-------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://v2badminton.com` | Canonical URL cho SEO |

**Nếu thiếu:** Fallback về `https://v2badminton.com` (hardcode trong `src/lib/site.ts`). OK nếu domain đúng.

---

## Output

Ghi lại kết quả:

```
✅/❌ NEXT_PUBLIC_SANITY_PROJECT_ID
✅/❌ NEXT_PUBLIC_SANITY_DATASET
✅/❌ SANITY_API_READ_TOKEN
✅/❌ POSTGRES_URL
✅/❌ TELEGRAM_BOT_TOKEN
✅/❌ TELEGRAM_CHAT_ID
✅/❌ UPSTASH_REDIS_REST_URL (hoặc KV alias)
✅/❌ UPSTASH_REDIS_REST_TOKEN (hoặc KV alias)
✅/❌ NEXT_PUBLIC_TURNSTILE_SITE_KEY
✅/❌ TURNSTILE_SECRET_KEY
✅/❌ FORM_TOKEN_SECRET
✅/❌ SENTRY_DSN (optional)
✅/❌ NEXT_PUBLIC_SITE_URL
```

Nếu thiếu biến nào ở nhóm CRITICAL hoặc IMPORTANT → set ngay trên Vercel dashboard trước khi chạy S4B-A1.
