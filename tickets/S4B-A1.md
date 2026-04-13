# S4B-A1 · Production lead pipeline verification

**Mục tiêu:** Xác nhận form liên hệ trên Next.js production site hoạt động end-to-end: submit → Postgres → Telegram → Email. Nếu có bug → fix ngay.

**Thời gian ước lượng:** 1–2 giờ (phụ thuộc vào có bug hay không)

**Phụ thuộc:** S4B-A2 (env vars audit nên làm trước để đảm bảo config đúng)

**Rủi ro:** CAO. Nếu pipeline không hoạt động, toàn bộ conversion flow của Version C vô nghĩa. Đây là ticket blocking trước cutover.

---

## Context cho junior

Form liên hệ trong Version C chạy qua:

1. **Client:** `ContactForm.tsx` → submit form data
2. **Server Action:** `src/app/actions/submitLead.ts` → xử lý tất cả
3. **Anti-spam:** honeypot + form token + Turnstile CAPTCHA
4. **Database:** `src/lib/db/index.ts` → Vercel Postgres `leads` table
5. **Dedup:** `src/lib/dedupe.ts` → check duplicate submissions
6. **Notifications:**
   - `src/lib/notify/telegram.ts` → Telegram bot message
   - `src/lib/notify/email.ts` → email notification (optional)
7. **Rate limit:** `src/lib/rateLimit.ts`

**Toàn bộ pipeline này chưa bao giờ được test trên production Next.js.** Chỉ test trên static site cũ.

---

## KHÔNG phải code ticket — đây là checklist test

Ticket này chủ yếu là test thủ công + fix nếu cần. Không viết code mới trừ khi tìm thấy bug.

---

## Bước 1 — Verify Vercel deployment có form hoạt động

1. Mở production URL (Vercel)
2. Scroll xuống form liên hệ (#lien-he)
3. Form phải render được: tên, SĐT, trình độ, sân, khung giờ, tin nhắn

**Nếu form không render:** Check Vercel build logs, có thể thiếu env vars.

---

## Bước 2 — Submit test lead

Điền form với data test:

| Field | Giá trị test |
|-------|-------------|
| Tên | `Test Lead Sprint4` |
| SĐT | `0999888777` |
| Trình độ | Người mới |
| Sân | (chọn bất kỳ) |
| Khung giờ | (chọn bất kỳ) |
| Tin nhắn | `Test pipeline verification S4B-A1` |

Bấm Submit.

### Kết quả mong đợi

- Form hiện success state ("Cảm ơn bạn đã đăng ký...")
- Không hiện lỗi validation
- Không bị block bởi rate limit (lần submit đầu tiên)

### Nếu lỗi xảy ra

- **"Có lỗi xảy ra" generic:** Mở Vercel Function Logs → tìm error chi tiết
- **Validation error:** Check field mapping giữa form và server action
- **Timeout:** Có thể Postgres connection chậm → check connection string

---

## Bước 3 — Verify Postgres

Kiểm tra row đã insert vào `leads` table:

```bash
# Cần Vercel CLI hoặc database admin tool
# Option 1: Vercel Postgres dashboard
# Option 2: psql với POSTGRES_URL từ Vercel env

SELECT * FROM leads ORDER BY created_at DESC LIMIT 5;
```

**Mong đợi:** Row mới nhất có `name = 'Test Lead Sprint4'`, `phone = '0999888777'`, `message = 'Test pipeline verification S4B-A1'`

**Nếu không có row:** Pipeline bị lỗi ở bước insert. Kiểm tra:
- `POSTGRES_URL` env var set đúng trên Vercel
- Table `leads` tồn tại (chạy schema.sql nếu chưa)
- Vercel Function Logs cho error chi tiết

---

## Bước 4 — Verify Telegram notification

Kiểm tra Telegram chat/group đã nhận message:

**Mong đợi:** Message có chứa tên, SĐT, tin nhắn của test lead

**Nếu không nhận được:**
- Check `TELEGRAM_BOT_TOKEN` và `TELEGRAM_CHAT_ID` trên Vercel env
- Check bot có quyền gửi message trong group không
- Vercel Function Logs: tìm `[telegram]` logs

---

## Bước 5 — Verify Email notification (nếu configured)

Nếu email notification đã setup:
- Check inbox nhận được email với lead info

Nếu chưa setup:
- Ghi chú: "Email notification chưa configured" → không phải bug

---

## Bước 6 — Test rate limit

**Lưu ý trước khi test:** Dedupe check (15 phút) xảy ra TRƯỚC rate limit check. Nếu submit cùng phone + name + nội dung, request sẽ bị chặn bởi dedupe — không phải rate limit. Để test đúng rate limit, phải dùng data khác nhau mỗi lần.

Submit form **6 lần từ cùng một IP** trong vòng 1 giờ, mỗi lần dùng số điện thoại khác nhau (VD: 0999000001, 0999000002, ...). Lần submit thứ 6 phải trigger rate limit (giới hạn là 5/giờ cho JS client).

**Mong đợi:** Lần submit thứ 6 hiện error message trên form (VD: "Bạn đã gửi yêu cầu gần đây..."). Vì form dùng Next.js Server Action, không phải REST endpoint — không có HTTP 429. Lỗi trả về qua structured error state, hiển thị trong UI.

**Nếu lần thứ 6 submit thành công bình thường:** Rate limit không hoạt động. Kiểm tra:
- `UPSTASH_REDIS_REST_URL` và `UPSTASH_REDIS_REST_TOKEN` đã set trên Vercel chưa (xem S4B-A2)
- Nếu thiếu 2 biến này: `src/lib/rateLimit.ts` fail open (cho phép tất cả requests) — đây là bug cần fix trước cutover

---

## Bước 7 — Test honeypot

Mở browser DevTools → tìm hidden field `_gotcha` trong form HTML. Điền giá trị vào hidden field rồi submit.

**Mong đợi:** Form reject submission silently hoặc hiện error

---

## Bước 8 — Test Turnstile

Nếu `NEXT_PUBLIC_TURNSTILE_SITE_KEY` đã set:
- Widget CAPTCHA phải hiển thị trong form
- Submit phải verify token server-side

Nếu chưa set:
- Form phải vẫn hoạt động (Turnstile là optional protection)

**Nếu CAPTCHA hiển thị nhưng submit fail:** Check `TURNSTILE_SECRET_KEY` trên Vercel env và domain whitelist trên Cloudflare Turnstile dashboard.

---

## Output của ticket này

Sau khi test xong, ghi lại kết quả:

```
✅/❌ Form render
✅/❌ Submit success
✅/❌ Postgres row inserted
✅/❌ Telegram notification received
✅/❌ Email notification received (hoặc N/A)
✅/❌ Rate limit working
✅/❌ Honeypot working
✅/❌ Turnstile working (hoặc N/A)
```

Nếu tất cả ✅ → ticket done, không cần code changes.
Nếu có ❌ → fix ngay trong ticket này, ghi lại bug + fix vào commit message.

---

## Sau khi verify xong — xóa test data

Xóa row test lead trong Postgres:

```sql
DELETE FROM leads WHERE name = 'Test Lead Sprint4';
```
