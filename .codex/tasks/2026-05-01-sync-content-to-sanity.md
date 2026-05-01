# Task: Đồng bộ nội dung FAQ + địa chỉ sân tập từ code fallback lên Sanity

**Người giao**: nguyenminhsang15@gmail.com
**Ngày**: 2026-05-01
**Mức ưu tiên**: Cao (đang hiển thị nội dung cũ trên production)
**Ước lượng**: 30–60 phút (manual via Studio) hoặc 15 phút (migration script)

---

## 1. Bối cảnh

Trang web V2 Badminton có 2 nguồn nội dung cho FAQ và Location:

1. **Sanity dataset** (CMS) — production đang đọc từ đây.
2. **Static fallback** trong code: [`src/lib/faqs.ts`](../../src/lib/faqs.ts) và [`src/lib/locations.ts`](../../src/lib/locations.ts) — chỉ kick in khi Sanity rỗng/sập.

Trong session trước, fallback files đã được cập nhật (xem commit gần nhất hoặc git diff trên 2 file này). Nhưng vì Sanity vẫn có data → page hiển thị nội dung cũ.

**Mục tiêu của task này**: copy/sync nội dung mới từ fallback files lên Sanity dataset để production hiển thị đúng nội dung đã review.

Code pipeline tham chiếu: [`src/lib/sanity/queries/catalog.ts:54-113`](../../src/lib/sanity/queries/catalog.ts#L54).

---

## 2. Nội dung cần sync

Nguồn chân lý (source of truth) là 2 file fallback đã được sửa:

- [`src/lib/faqs.ts`](../../src/lib/faqs.ts) — 21 FAQ items (5 homepage, 6 nguoi_moi, 5 binh_thanh, 5 thu_duc).
- [`src/lib/locations.ts`](../../src/lib/locations.ts) — field `addressText` của 4 sân (Green, Huệ Thiên, Khang Sport, Phúc Lộc).

### 2.1. FAQ — diff so với data Sanity hiện tại

Đối với mỗi FAQ trong `faqs.ts`, match với Sanity document `_type=="faq"` qua trường `id` (lưu ý: trong Sanity field tên có thể là `id` custom hoặc `_id` — kiểm tra schema [`src/sanity/schemaTypes/faq.ts`](../../src/sanity/schemaTypes/faq.ts) trước khi map).

Field mapping fallback → Sanity:

| Fallback (faqs.ts)        | Sanity (faq schema)              | Ghi chú                                              |
| ------------------------- | -------------------------------- | ---------------------------------------------------- |
| `id`                      | `_id` hoặc field id custom       | Dùng để match document, không thay đổi               |
| `question`                | `question` (string)              | Cập nhật nguyên văn                                  |
| `answerText`              | `answer` (Portable Text array)   | **Phải convert** plain text → block array (xem 4.2)  |
| `page`                    | `pages` (array string)           | Wrap thành `[item.page]`                             |
| `order`                   | `order`, `homepageOrder`         | Cập nhật cả 2                                        |
| `schemaEligible`          | `includeInSchema` (boolean)      |                                                      |

Các thay đổi nội dung quan trọng (xem `git log -p src/lib/faqs.ts` để xem chi tiết):
- 2× `từ zero` → `từ con số 0`
- Q1 homepage rút gọn câu hỏi
- Q2 homepage thêm phân vùng quận
- Q3 homepage tách bullet pricing + soften phí thuê sân
- Q5 homepage thêm reference trang `/cau-long-doanh-nghiep/`
- Q4 nguoi_moi thêm timeframe `(≈ 4–6 tuần với lịch 2 buổi/tuần)`
- Q6 nguoi_moi soften phí sân
- BT Q1 bỏ `điểm tập chính` → neutral
- BT/TD FAQ giờ học cứng → mô tả tổng quát + ref `phần Lịch học`
- TD Q2 gộp địa chỉ về phường Hiệp Bình

### 2.2. Location — chỉ cập nhật `addressText`

| `slug` (Sanity)  | `addressText` mới                                          |
| ---------------- | ---------------------------------------------------------- |
| `green`          | `154/9 đường Nguyễn Xí, phường 26, Bình Thạnh, TP.HCM`     |
| `hue_thien`      | `520 Quốc Lộ 13, phường Hiệp Bình, TP.HCM`                 |
| `khang_sport`    | `8 Đường số 20, phường Hiệp Bình, TP.HCM`                  |
| `103/11B Đường số 20...` (slug `phuc_loc`) | `103/11B Đường số 20, phường Hiệp Bình, TP.HCM` |

Các field khác (name, geo, image…) **không thay đổi**.

---

## 3. Hai hướng thực hiện — chọn 1

### Hướng A — Manual via Sanity Studio (ưu tiên nếu chỉ vài chục item)

**Khi nào nên dùng**: nếu bạn không có `SANITY_AUTH_TOKEN` quyền write, hoặc muốn review từng thay đổi trực quan.

1. Chạy dev server: `npm run dev` (server đang chạy thì skip).
2. Mở `http://localhost:3000/studio/`.
3. Vào tab **Câu hỏi thường gặp**:
   - Với mỗi document, đối chiếu `question` + `answer` với entry tương ứng trong [`src/lib/faqs.ts`](../../src/lib/faqs.ts).
   - Nếu khác → edit `question` field, rebuild `answer` (Portable Text editor) bằng cách paste lại `answerText` (xuống dòng được giữ tự nhiên trong block editor).
   - Click **Publish** sau mỗi document.
4. Vào tab **Địa điểm / Sân tập**:
   - Sửa field `addressText` của 4 sân theo bảng ở mục 2.2.
   - **Publish** từng document.
5. Verify ở mục 5.

### Hướng B — Migration script (nhanh hơn nếu có write token)

**Khi nào nên dùng**: nếu có `SANITY_AUTH_TOKEN` quyền write, hoặc cần idempotent cho lần chạy lại.

#### Bước 1 — Cấp token write

1. Vào https://sanity.io/manage → project V2 Badminton → **API** → **Tokens**.
2. Tạo token mới với role **Editor** (đủ để write document; không cần Admin).
3. Add vào `.env.local` (file đã tồn tại, đừng commit):
   ```
   SANITY_AUTH_TOKEN=skXXXXXXXXXX...
   ```
4. **KHÔNG commit token**. Sau khi xong task có thể revoke trong Sanity manage.

#### Bước 2 — Tạo script

Tạo file `scripts/sync-faqs-locations-to-sanity.mts`:

```ts
/**
 * One-off migration: sync FAQ + Location content from src/lib fallback to Sanity dataset.
 * Run: npx tsx scripts/sync-faqs-locations-to-sanity.mts
 *
 * Requires SANITY_AUTH_TOKEN with write access in .env.local.
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { faqs } from "../src/lib/faqs";
import { courtLocations } from "../src/lib/locations";

config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_AUTH_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error(
    "Missing one of NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_AUTH_TOKEN",
  );
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

function toPortableText(plain: string) {
  // FAQ schema accepts portable text "block" array; one block per paragraph.
  return plain
    .split(/\n{2,}/)
    .map((para, blockIndex) => ({
      _type: "block",
      _key: `block-${blockIndex}`,
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: `span-${blockIndex}`,
          text: para.trim(),
          marks: [],
        },
      ],
    }));
}

async function syncFaqs() {
  console.log(`\nSyncing ${faqs.length} FAQs...`);

  for (const item of faqs) {
    // Match Sanity doc by id field (matches faqs.ts id like "home-zero").
    // Adjust query if your Sanity uses _id directly or another custom field.
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "faq" && _id == $id][0]{_id}`,
      { id: item.id },
    );

    const payload = {
      _type: "faq" as const,
      _id: item.id,
      question: item.question,
      answer: toPortableText(item.answerText),
      pages: [item.page],
      includeInSchema: item.schemaEligible,
      order: item.order,
      homepageOrder: item.order,
      featured: item.page === "homepage",
    };

    if (existing) {
      await client.createOrReplace(payload);
      console.log(`  ✓ updated: ${item.id}`);
    } else {
      await client.create(payload);
      console.log(`  + created: ${item.id}`);
    }
  }
}

async function syncLocations() {
  console.log(`\nSyncing ${courtLocations.length} locations (addressText only)...`);

  for (const court of courtLocations) {
    // Match by slug.current — adjust if your Sanity uses different identifier.
    const doc = await client.fetch<{ _id: string } | null>(
      `*[_type == "location" && slug.current == $slug][0]{_id}`,
      { slug: court.id },
    );

    if (!doc) {
      console.warn(`  ! skipped (not found in Sanity): ${court.id}`);
      continue;
    }

    await client.patch(doc._id).set({ addressText: court.addressText }).commit();
    console.log(`  ✓ updated: ${court.id} → ${court.addressText}`);
  }
}

(async () => {
  await syncFaqs();
  await syncLocations();
  console.log("\nDone. Verify on http://localhost:3000/ and Sanity Studio.");
})();
```

#### Bước 3 — Cài deps + chạy

```bash
npm install --save-dev tsx dotenv @sanity/client
npx tsx scripts/sync-faqs-locations-to-sanity.mts
```

Script sẽ log từng FAQ / location đã update. Nếu có lỗi `not found`, kiểm tra lại field match (xem mục 4.1).

#### Bước 4 — Cleanup

- Xoá hoặc revoke `SANITY_AUTH_TOKEN` sau khi xong (bảo mật).
- Quyết định: giữ script trong repo (idempotent, dùng lại được) hoặc xoá. **Recommend**: giữ trong `scripts/` + add `.env.local` đã trong `.gitignore`.

---

## 4. Lưu ý kỹ thuật

### 4.1. Match strategy (id vs slug vs _id)

Trước khi chạy script (Hướng B), **kiểm tra schema thực tế trong Sanity**:

```bash
# Kiểm tra cấu trúc 1 FAQ doc
curl "https://$NEXT_PUBLIC_SANITY_PROJECT_ID.api.sanity.io/v2024-01-01/data/query/$NEXT_PUBLIC_SANITY_DATASET?query=*%5B_type%3D%3D%22faq%22%5D%5B0%5D"
```

Có 3 khả năng cho identifier:
- `_id` chính là `home-zero` (literal id) → script trên works.
- `_id` là UUID, có field custom `id` lưu `home-zero` → đổi query sang `_id == "..."` thành `id == $id`.
- Sanity dùng tự sinh `_id` (UUID) và không có field id → cần map qua `question` (kém reliable) hoặc tạo mới.

Nếu unsure, chạy 1 FAQ trước (comment `for` loop, hardcode 1 item) để test.

### 4.2. Portable Text format

Schema FAQ ở [`src/sanity/schemaTypes/faq.ts:19-55`](../../src/sanity/schemaTypes/faq.ts#L19) yêu cầu `answer` là array of block. Function `toPortableText()` ở script chuyển `answerText` (string) thành format đúng. Nếu nội dung có `\n\n` → tách thành nhiều block.

### 4.3. `_id` rules

- Document mới: `_id` không có dot/dấu cách. `home-zero` ok, `home.zero` thì sẽ thành "draft.home.zero" (drafts).
- `createOrReplace` overwrite hoàn toàn document — sẽ mất các field không có trong payload (image, custom fields). Nếu Sanity FAQ có field bonus như image attachment, dùng `client.patch().set(...).commit()` thay vì `createOrReplace`.

Recommend: đổi sang patch-only nếu document đã tồn tại:

```ts
if (existing) {
  await client.patch(existing._id).set({
    question: item.question,
    answer: toPortableText(item.answerText),
    pages: [item.page],
    includeInSchema: item.schemaEligible,
    order: item.order,
    homepageOrder: item.order,
  }).commit();
}
```

### 4.4. Cache invalidation

Sau khi push lên Sanity, Next.js dev server tự revalidate (vì `getFaqs` dùng `cache()` + tags `sanity:faqs:...`). Production cần webhook revalidate nếu đã setup. Verify bằng cách reload page sau ~30s.

---

## 5. Acceptance criteria

Sau khi xong, verify trên `http://localhost:3000/`:

```js
// Run trong DevTools console:
[...document.querySelectorAll('.faq-section button, .faq-section summary')]
  .map(el => el.innerText.trim())
  .filter(Boolean)
  .slice(0, 5);
```

Phải trả về (đúng thứ tự):
1. `Người mới hoàn toàn có học được không?` ← **không phải** `Tôi chưa bao giờ chơi cầu lông...`
2. `V2 Badminton dạy ở đâu?`
3. `Học phí và lịch học như thế nào?`
4. `Tôi cần chuẩn bị gì khi đến học?`
5. `Công ty tôi muốn tổ chức team building, liên hệ thế nào?`

Mở Q3 → câu trả lời phải có cụm `1.000.000 đ/tháng`, `1.500.000 đ/tháng (nâng cao)`, `chưa gồm phí thuê sân — V2 sẽ hỗ trợ đặt sân`.

Mở Q5 → có cụm `xem trang Cầu lông doanh nghiệp`.

Vào section Sân tập, 4 địa chỉ phải có format `..., phường ..., TP.HCM` (không còn `Hồ Chí Minh` đầy đủ, không còn duplicate ward).

Test các trang con:
- `/hoc-cau-long-cho-nguoi-moi/` — Q4 phải có `(≈ 4–6 tuần với lịch 2 buổi/tuần)`.
- `/lop-cau-long-binh-thanh/` — Q1 không còn cụm `điểm tập chính`.
- `/lop-cau-long-thu-duc/` — Q2 phải gộp 3 địa chỉ về `phường Hiệp Bình`.

---

## 6. Rollback

Nếu sync sai:
- Hướng A (manual): Sanity giữ history, click **History** trong document → restore.
- Hướng B (script): cũng restore qua History UI từng doc. Hoặc viết script revert dùng snapshot trước khi chạy (nếu paranoid: thêm step backup `client.fetch('*[_type=="faq"]')` ghi ra JSON file trước khi `createOrReplace`).

---

## 7. Khi nào báo done

- [ ] 21 FAQ docs trong Sanity match với fallback content
- [ ] 4 location docs có `addressText` đã chuẩn hoá
- [ ] Verify ở mục 5 pass tất cả
- [ ] (Hướng B) script committed vào `scripts/` HOẶC xoá; token đã revoke khỏi `.env.local`
- [ ] Báo lại nếu phát hiện schema mismatch hoặc có fallback content khác cần sync
