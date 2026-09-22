# Việc đang mở

Danh sách việc còn mở sau đợt làm skill ngày 2026-09-17. Mỗi việc tự đủ để làm: có bằng chứng đã kiểm, quyết định của chủ, và điều kiện để coi là xong. Không cần đọc lại hội thoại nào.

## Cách dùng file này

- **Trước khi nhận việc**, chạy `gh pr list` xem đã có ai làm chưa. Trạng thái trong file này chỉ lên `main` khi PR merge, nên PR đang mở mới là dấu hiệu sớm nhất.
- **Nhận việc:** đổi dòng `Trạng thái` của việc đó thành `đang làm — <tên nhánh>` trong commit đầu tiên của nhánh, rồi mở PR sớm (draft cũng được).
- **Xong:** đổi thành `xong — #<số PR>` ngay trong PR đó. Không xoá mục.
- Chỉ sửa dòng `Trạng thái` của việc mình làm. Mỗi việc có dòng riêng, cách xa nhau, nên các PR chạy song song không conflict. Bảng tổng quan cố ý không có cột trạng thái, để trạng thái chỉ nằm ở một chỗ.
- **Bằng chứng dưới đây kiểm ngày 2026-09-17.** Kiểm lại trước khi sửa, vì số dòng code và nội dung Sanity có thể đã đổi.
- Chủ (HLV Nguyễn Minh Sang) là nguồn có thẩm quyền về dữ kiện kinh doanh. Điều gì không có ở đây thì hỏi chủ, không tự suy ra.

## Tổng quan

| ID | Việc | Loại | Ưu tiên |
|---|---|---|---|
| T1 | Giá "từ" trên 10 money page sai | Code | Cao |
| T2 | Gói 1 kèm 1 ghi "Học viên tự lo sân" | Sanity | Cao |
| T3 | Quy mô lớp nhóm 2-6 → 4-8 | Sanity + code | Cao |
| T4 | Thời lượng buổi học: chỉ báo 120 phút | Sanity + code | Trung bình |
| T5 | Gỡ trang nháp `preview-version-c.html` | Code | Trung bình |
| T6 | Guard CI cho đường dẫn trong skill | Skill | Thấp |
| T7 | Quy tắc mâu thuẫn kiểm bằng máy, chạy E9 | Skill | Thấp |
| T8 | Link bản đồ và tọa độ hai sân Thủ Đức sai | Sanity + code | Trung bình |
| T9 | Việc lặt vặt còn lại của bộ skill | Skill | Thấp |

T1–T5 và T8 đang sai trước mặt khách. T6, T7 và T9 là gia cố bộ skill: skill hiện dùng được và đã được đo; các việc này giữ cho nó không hỏng dần và vá những điểm yếu đã đo được.

## Quyết định của chủ (2026-09-17)

Dùng chung cho các việc bên dưới. Đây là dữ kiện đã chốt, không phải đề xuất.

- **Gói rẻ nhất** là lớp nhóm 2 buổi/tuần, **1.000.000 VNĐ/tháng**.
- **Lớp nhóm luôn 4-8 người.** "2-6" là số cũ.
- **1 kèm 1 (400.000 VNĐ/giờ/học viên):** khách hoặc V2 đặt sân đều được, không bên nào bắt buộc. **Tiền thuê sân luôn do khách trả.** V2 chỉ cung cấp HLV và cầu. Lớp nhóm thì khác: học phí đã gồm sân.
- **Buổi học nhóm chuẩn là 120 phút:** 15-20 phút khởi động, 15 phút cuối để học viên đánh tự do với nhau, phần giữa là tập. Mọi lớp buổi tối đều 120 phút. Buổi học thử cũng 120 phút.
- **Bốn khung ngắn hơn trong lịch là lớp custom, có thật — lịch không sai:** Green 14:00-15:30 (T3-T5-T7), Phúc Lộc 14:00-15:30 (T2-T4-T6), Khang Sport 11:30-13:00 (Thứ 7) dài 90 phút; Huệ Thiên 17:00-18:00 (T7-CN) dài 60 phút. **Không sửa giờ các khung này.**
- **Ra bên ngoài chỉ báo buổi chuẩn 120 phút**, cả trong nội dung web lẫn dữ liệu cấu trúc cho Google. Không liệt kê thời lượng lớp custom, không ghi chữ "custom".
- **Chưa biết:** lớp custom giá bao nhiêu và dành cho ai.

## Quy ước chung

- Sanity: project `w58s0f53`, dataset `production`. **Chốt câu chữ với chủ trước, rồi tạo bản nháp, chủ publish trong Studio** tại cms.v2badminton.com. Script chỉ được tạo bản nháp, không publish — cách làm và các bước an toàn ở `skills/sanity-cms/SKILL.md`, mục "Writing content".
- **Đọc Sanity phải có xác thực.** Đọc ẩn danh trả về một tập con mà trông như dữ liệu đầy đủ.
- **Quét nội dung phải gồm cả trường chữ thường** (`description`, `features`, `quickAnswer`, `excerpt`, `metaDescription`, `seoDescription`), không chỉ Portable Text (`answer`, `body`). Một lần quét chỉ xem `answer`/`body` đã bỏ sót câu sai trong `pricing_tier.description`.
- Bản nháp cũ của money page `gia-hoc-cau-long-tphcm` đã được chủ publish ngày 2026-09-21, không còn treo. Quy tắc vẫn giữ: tài liệu nào đang có bản nháp thì hỏi chủ trước, đừng publish đè.
- Nội dung tiếng Việt người đọc thấy: đọc `skills/noi-dung-vi/SKILL.md`. Làm việc với Sanity: đọc `skills/sanity-cms/SKILL.md`.

---

## T1 — Giá "từ" trên 10 money page sai

**Trạng thái:** xong — #125
**Đọc trước:** `skills/v2badminton-next/SKILL.md`, `skills/sanity-cms/SKILL.md`

**Hiện trạng.** Khối tóm tắt nhanh (QuickAnswer) ghi **"Học phí từ 1.300.000 VNĐ / tháng."** trên cả 10 money page có lớp nhóm. Đã kiểm từng trang trên web thật: `gia-hoc-cau-long-tphcm`, `hoc-cau-long-1-kem-1`, `hoc-cau-long-cho-nguoi-moi`, `lop-cau-long-binh-thanh`, `lop-cau-long-buoi-toi`, `lop-cau-long-cho-nguoi-di-lam`, `lop-cau-long-cuoi-tuan`, `lop-cau-long-thu-duc`, `lop-cau-long-tre-em`, `lop-he-cau-long-tphcm`. Gói rẻ nhất là 1.000.000, nên khách thấy giá **cao hơn** thực tế. Trên trang bảng giá, bảng so sánh và FAQ `4021af86-64ac-401e-9129-e083c505b675` ngay cạnh đó đều ghi 1.000.000, nên trang tự mâu thuẫn.

**Nguyên nhân.**
- `apps/web/src/components/money-page/QuickAnswer.tsx:22` lấy `page.relatedPricing[0]`, tức gói **đầu tiên**, rồi gắn chữ "từ".
- Câu truy vấn ở `apps/web/src/lib/sanity/queries/shared.ts` (khoảng dòng 352) không giữ thứ tự mảng tham chiếu. Nó sắp các gói theo `order(coalesce(order, 9999) asc, _createdAt asc)`.
- Trong Sanity, `pricingTier.group-basic-3x` (1.300.000) có `order: 1`, còn `pricingTier.group-basic-2x` (1.000.000) có `order: 3`. Vì vậy gói rẻ nhất không bao giờ đứng đầu.
- Đổi `order` trong Sanity **không** phải cách sửa: `order` còn quyết định thứ tự hiển thị các gói ở chỗ khác.

**Làm.**
- `apps/web/src/components/money-page/MoneyPageTemplate.tsx:55` đã tính đúng: lọc các gói nhóm rồi `reduce` theo `pricePerMonth`. Tách phần đó thành một hàm dùng chung và cho QuickAnswer dùng.
- Chỉ so các gói cùng đơn vị. Không lấy giá theo giờ của 1 kèm 1 làm con số "từ" trên trang có gói tháng.
- Trang chỉ có gói private thì không dùng chữ "từ".
- Thêm test trong `apps/web/src/lib/__tests__/` cho trường hợp gói rẻ nhất không đứng đầu mảng.

**Xong khi:** cả 10 trang ghi "từ 1.000.000", và test chặn được lỗi thứ tự.

---

## T2 — Gói 1 kèm 1 ghi "Học viên tự lo sân"

**Trạng thái:** xong — nội dung Sanity chủ publish 2026-09-22; file mẫu trong repo và `check-facts.mjs`: #127
**Đọc trước:** `skills/noi-dung-vi/SKILL.md`, `skills/sanity-cms/SKILL.md`

**Hiện trạng.** Web tự mâu thuẫn về chuyện ai đặt sân cho 1 kèm 1.

Sai so với quyết định của chủ, vì bắt khách phải tự đặt sân:
- `pricing_tier` `pricingTier.private-1-1`, trường `description`: "Học viên tự lo sân, phù hợp khi cần lịch riêng và theo sát."
- Cùng tài liệu đó, một mục trong `features`: "Học viên tự lo sân tập".

Thiếu, vì đúng là V2 hỗ trợ và giá chưa gồm sân, nhưng không nói khách cũng tự đặt được:
- faq `d448f416-8f73-4bd0-938c-e09003324bf5`: "…Học phí chưa gồm phí thuê sân — V2 sẽ hỗ trợ học viên đặt sân thuận tiện tại…"
- faq `faq.home-pricing` và faq `faq.nguoi-moi-pricing`: "(chưa gồm phí thuê sân — V2 sẽ hỗ trợ đặt sân thuận tiện)".

Chỉ nói về chi phí, nên xem có cần bổ sung không:
- money_page `d5e50a00-ed4d-445e-9690-6387a68cd707` (`hoc-cau-long-1-kem-1`): "chưa gồm phí thuê sân".
- money_page `f4d5515c-…` (`gia-hoc-cau-long-tphcm`): "chưa gồm phí thuê sân" và "(chưa gồm sân)". Trang này có bản nháp.

Không hiển thị trên web nhưng có thể bị nạp lại vào Sanity: `tickets/C4_faqs.json` (hai chỗ) và `apps/web/public/preview-version-c.html` (xem T5).

**Làm.**
- Viết lại `description` và mục `features` theo quyết định của chủ: ai đặt sân cũng được, tiền sân khách trả, V2 lo HLV và cầu.
- Tìm chỗ hiển thị hai trường này trong `apps/web/src` và kiểm tra câu mới vừa với bố cục.
- Sửa 3 FAQ cho mọi nguồn nói cùng một điều.
- Cân nhắc thêm FAQ riêng "Ai đặt sân cho buổi 1 kèm 1?". Đã có FAQ `566fd37f-7277-4cf7-8187-f2608faa0f16` liệt kê 4 sân; FAQ mới không lặp lại nội dung đó.

**Xong khi:** một lượt quét Sanity (có cả trường chữ thường) và `grep` repo không còn chỗ nào ghi "tự lo sân", và mọi nguồn khớp quyết định của chủ. Khi `grep`, bỏ qua file này và `skills/_evals/evals.json`: cả hai cố ý trích nguyên văn câu sai để làm bằng chứng.

---

## T3 — Quy mô lớp nhóm 2-6 → 4-8

**Trạng thái:** xong — code và file mẫu: #126; nội dung Sanity chủ publish 2026-09-22
**Đọc trước:** `skills/sanity-cms/SKILL.md`, `skills/noi-dung-vi/SKILL.md`

**Hiện trạng.** Trường `groupSize` của cả ba gói nhóm trong Sanity đã đúng là "4-8 người". Số cũ "2-6" còn sót lại ở:

Code:
- `apps/web/src/lib/routes.ts:58`: meta description viết cứng "lớp nhỏ 2-6 người". Câu này đi thẳng lên Google.
- `apps/studio/src/sanity/schemaTypes/pricingTier.ts:96`: hướng dẫn trong Studio ghi "Nhóm: lớp 2–6 người". Editor đang được dạy sai số.

Nội dung Sanity:
- money_page `f4d5515c-…` (`gia-hoc-cau-long-tphcm`): "· 2-6 học viên" hai lần trong phần "Bảng so sánh các gói học". Dòng gói nâng cao lại không ghi quy mô. Trang này có bản nháp.
- money_page `d5e50a00-…` (`hoc-cau-long-1-kem-1`): "Quy mô. Lớp nhóm: 2-6 học viên."
- faq `faq.nguoi-moi-group-size` ("Lớp học mấy người?"): "…lớp nhóm nhỏ từ 2 đến 6 người…"

File mẫu, không hiển thị trên web: `docs/sanity-content/01-hoc-cau-long-1-kem-1.json`, `docs/sanity-content/02-gia-hoc-cau-long-tphcm.json`, `tickets/C2_pricing_tiers.json`, và `preview-version-c.html` (xem T5).

**Làm.**
- Sửa hết các chỗ trên.
- Lỗi gốc là quy mô lớp được lưu ở hai nơi: `pricing_tier.groupSize` và chữ gõ tay trong thân bài. Nên cân nhắc cho bảng so sánh đọc `groupSize` từ gói được tham chiếu, thay vì chép lại. Làm vậy thì loại lỗi này không xảy ra được nữa.

**Xong khi:** `grep` repo và quét Sanity không còn "2-6", "2–6" hay "2 đến 6" nói về quy mô lớp. Khi `grep`, bỏ qua file này và `skills/_evals/evals.json`: cả hai cố ý trích nguyên văn số cũ để làm bằng chứng.

---

## T4 — Thời lượng buổi học: chỉ báo 120 phút

**Trạng thái:** xong — dữ liệu cấu trúc: #126; nội dung Sanity chủ publish 2026-09-22; mục eval: #127
**Đọc trước:** `skills/noi-dung-vi/SKILL.md`, `skills/sanity-cms/SKILL.md`, `skills/seo/SKILL.md`

**Hiện trạng.**

Nội dung Sanity:
- faq `17d14303-2aa8-4536-ad41-e8bf99052d43` ("Một buổi tối học V2 kéo dài bao lâu?"): "Buổi học 90-120 phút…". Sai, vì buổi tối là 120 phút.
- faq `4021af86-64ac-401e-9129-e083c505b675` ("Gói học cầu lông rẻ nhất tại V2 là gói nào?"): "…8 buổi tập 60-90 phút/tháng." Sai.
- faq `c539e0c4-52a1-426d-adf8-57ae218f7d95` ("Một buổi cuối tuần V2 kéo dài bao lâu?"): liệt kê 120 / 90 / 60 phút theo từng khung. Đúng với lịch, nhưng trái với quyết định chỉ báo buổi chuẩn.
- Lỗi chính tả cùng đợt: static_page `78678bff-a870-42df-abf7-7b70a3310d67` (`gioi-thieu`), đoạn cuối, "những nhút \"Liên hệ\"" phải là "những nút \"Liên hệ\"".

Dữ liệu cấu trúc:
- `apps/web/src/lib/schema.ts:298` có hàm `buildCourseWorkload`, chỉ được gọi ở dòng 366 trong `buildCourseInstances`.
- Hàm này lấy thời lượng ngắn nhất và dài nhất của mọi `schedule_block` đang bật. Vì gộp cả lớp custom, JSON-LD Course hiện báo "1 đến 2 tiếng mỗi buổi".

**Làm.**
1. **Nội dung:**
   - Sửa hai FAQ sai thành 120 phút, kèm cách chia giờ của chủ. Chủ mô tả 15 phút cuối là học viên đánh tự do với nhau; không khẳng định gì thêm về việc HLV có kèm hay không.
   - Viết lại FAQ cuối tuần theo buổi chuẩn 120 phút.
   - Sửa lỗi "nhút".
   - Quét thêm mọi chỗ khác nói về thời lượng: tìm "phút" và "tiếng" trong repo và Sanity, gồm cả trường chữ thường.
   - Bỏ qua: FAQ 1 kèm 1 `20dcf6ca-…` (buổi 60 phút, tính theo giờ, là sản phẩm khác), thời lượng team building, thời gian bài tập trong bài kỹ thuật.
2. **Dữ liệu cấu trúc:**
   - Cho `courseWorkload` báo buổi chuẩn 120 phút. Một hằng số đặt tên rõ ràng, có chú thích dẫn quyết định của chủ ngày 2026-09-17, là đủ.
   - Không thêm cờ "custom" vào schema `schedule_block` cho việc này.
   - Giữ định dạng chuỗi hiện có (kết quả của `formatDuration`).
   - Cập nhật hoặc thêm test trong `apps/web/src/lib/__tests__/`.
   - Kiểm JSON-LD đã render trên một money page có lịch.
   - Giữ nguyên `courseSchedule`: nó liệt kê giờ các lớp đang diễn ra, và các khung đó có thật. Nếu thấy nó trái với quyết định của chủ thì ghi vào mô tả PR, không tự sửa.
3. **Dữ liệu gốc của bộ eval** (cùng PR với bước 2): trong `skills/_evals/evals.json` → `ground_truth_notes`, sửa mục `"published FAQ policies"` cho khớp nội dung FAQ sau khi publish. Mục `"owner rulings 2026-09-17"` đã ghi đủ quyết định, không cần đụng. Không đọc phần còn lại của `skills/_evals/`.

**Xong khi:** mọi câu nói về thời lượng buổi học nhóm ghi 120 phút; JSON-LD báo buổi chuẩn; mục `"published FAQ policies"` trong bộ eval khớp nội dung đã publish.

---

## T5 — Gỡ trang nháp `preview-version-c.html`

**Trạng thái:** xong — #131. Search Console ngày 2026-09-22: "URL is unknown to Google", 90 ngày không có lượt hiển thị nào, nên xoá thẳng, không cần redirect hay 410
**Đọc trước:** `skills/seo/SKILL.md`

**Hiện trạng.**
- https://v2badminton.com/preview-version-c.html trả về **HTTP 200**. Đây là file `apps/web/public/preview-version-c.html`, một bản thiết kế thử cũ đang được phục vụ như trang thật.
- Nội dung sai: thẻ giá "1.300.000đ", "2-6 người" ở sáu chỗ, "học viên tự lo sân".
- `apps/web/src/app/robots.ts` chỉ chặn `/api/` và cho phép rõ ràng GPTBot, ClaudeBot, PerplexityBot. Trang này mở cho cả Google lẫn các bot AI.

**Làm.**
- Kiểm Search Console trước (property `sc-domain:v2badminton.com`): URL đã được index chưa, có lượt hiển thị không.
- Nếu **chưa** index: xoá file.
- Nếu **đã** index: trả 410 hoặc redirect về trang bảng giá thật, theo đúng trình tự gỡ URL trong `skills/seo/SKILL.md`. Không xoá lặng lẽ.
- Xem `apps/web/public/` còn file HTML thử nghiệm nào khác trong tình trạng tương tự không.

**Xong khi:** URL không còn phục vụ bản nháp, và tình trạng Search Console được ghi vào mô tả PR.

---

## T6 — Guard CI cho đường dẫn trong skill

**Trạng thái:** xong — #123. `scripts/check-skill-paths.mjs`, job CI "Skill paths". Lần chạy đầu bắt được skill mô tả draft preview trước khi PR #119 merge.
**Đọc trước:** `skills/v2badminton-next/SKILL.md`

**Vì sao.** Hiện không có gì hỏng: mọi đường dẫn trong các skill đều tồn tại (đã kiểm ngày 2026-09-17). Nhưng khi code dời chỗ, đường dẫn trong skill âm thầm sai mà không ai biết. Bản tiền nhiệm `.codex/skills` chết đúng kiểu này: 25/26 đường dẫn vẫn trỏ vào layout `src/` cũ, chỉ lộ ra khi nó làm một lượt eval cho ra đáp án sai.

**Làm.**
- Viết script (khoảng 40 dòng Node, không thêm dependency) quét các chuỗi trong backtick trông giống đường dẫn repo trong `skills/**/SKILL.md`: bắt đầu bằng `apps/`, `packages/`, `docs/`, `skills/`, `tickets/`, `.github/`, hoặc có đuôi mã nguồn.
- Kiểm từng đường dẫn tính từ gốc repo. Có đường dẫn không tồn tại thì in file, dòng, đường dẫn đó và thoát với mã khác 0.
- Lấy `skills/noi-dung-vi/scripts/check-terms.mjs` làm mẫu cho định dạng output và quy ước mã thoát.
- Đặt script ở chỗ trung lập như `scripts/`, vì nó kiểm tất cả skill chứ không riêng skill nào.
- Nối vào workflow "Lint, typecheck, build" hoặc tạo job riêng chạy nhanh.
- Tránh báo sai: đường dẫn ví dụ như `apps/web/src/app/<slug>/page.tsx` là cố ý, không được làm fail. Bỏ qua chuỗi có `<`, `>` hoặc `*`.
- Nên làm thêm: kiểm mọi skill khai báo trong `.codex/config.toml` và `.claude/skills/*/SKILL.md` đều trỏ tới một thư mục có thật trong `skills/`.

**Xong khi:** CI fail khi một skill trích đường dẫn không tồn tại, và không báo sai trên các skill hiện tại.

---

## T7 — Quy tắc mâu thuẫn kiểm bằng máy, và chạy E9

**Trạng thái:** xong — #123. `skills/noi-dung-vi/scripts/check-facts.mjs`, thành một bước riêng trong quy trình của skill. Vòng eval 3: E8 có skill 9/9, không có skill 7/9 (vòng 2 là 7/9 cả hai); E9 7/7 so với 5/7. Phần tuỳ chọn, siết lại E2/E4/E6, chưa làm; đã ghi trong `skills/_evals/README.md`.
**Đọc trước:** `skills/noi-dung-vi/SKILL.md`, `skills/_evals/README.md`

**Vì sao.** Đây là điểm yếu thật của bộ skill, đã đo được.
- `skills/noi-dung-vi/SKILL.md` có quy tắc "Hai nguồn mâu thuẫn thì không tự chọn".
- Ở vòng eval 2, bài E8: agent **có đọc quy tắc đó mà vẫn tự chọn** một con số, và được 7/9 điểm, bằng hệt agent không có skill.
- Riêng ngày 2026-09-17 đã tìm ra 4 mâu thuẫn thật trên web (giá "từ", quy mô lớp, ai đặt sân, thời lượng). Agent viết nội dung sẽ lặng lẽ chọn bừa đúng trong những tình huống như vậy.

**Làm.**
- Thay hoặc bổ sung văn xuôi bằng một bước máy móc, để agent không thể bỏ qua chỉ vì không nhận ra có mâu thuẫn. Chọn cái hiệu quả, không cần làm hết:
  - Một script trong `skills/noi-dung-vi/scripts/`: trước khi viết câu có giá, quy mô, thời lượng hoặc số đếm, truy vấn mọi tài liệu Sanity nhắc cùng dữ kiện đó rồi so sánh.
  - Một danh sách ngắn các dữ kiện đang được lưu ở nhiều nơi.
  - Đặt quy tắc vào đúng một bước trong quy trình của skill, thay vì để thành nguyên tắc chung chung.
- Đo lại:
  - **Chạy lại ít nhất E8** để chứng minh cách mới đổi được kết quả. Sửa mà không đo thì vẫn là vấn đề văn xuôi cũ, chỉ đổi hình thức.
  - **Chạy E9** (`analytics-report`). Bài này chưa chạy lần nào, nên chưa có bằng chứng skill đó giúp được gì.
  - *(Tuỳ chọn)* Siết lại hoặc bỏ các bài E2, E4, E6: cả hai cấu hình đều đạt nên chúng không phân biệt được gì.

**Lưu ý.**
- Định nghĩa eval ở `skills/_evals/evals.json`; cách chạy ở `skills/_evals/README.md`.
- Kết quả vòng 2 (bị ignore) **chỉ có trên máy của chủ**, tại `D:\V2\v2badminton-next\.claude\skill-evals\iteration-2\eval-8-faq-working-adults\`. Worktree mới không có thư mục này.
- **Làm T2, T3, T4 trước:** chúng sửa chính những mâu thuẫn mà E8 chấm. Trước khi chạy lại phải thu thập lại `ground_truth_notes`, như README yêu cầu.

**Xong khi:** E8 chạy lại cho thấy agent có skill không còn tự chọn giữa hai nguồn mâu thuẫn, và E9 có kết quả cả hai cấu hình.

---

## T8 — Link bản đồ và tọa độ của hai sân ở Thủ Đức sai

**Trạng thái:** xong — toạ độ trong code và file mẫu: #129; toạ độ và link bản đồ trong Sanity chủ publish 2026-09-22
**Đọc trước:** `skills/sanity-cms/SKILL.md`, `skills/seo/SKILL.md`

**Hiện trạng** (tìm ra trong lượt eval E9 ngày 2026-09-18, đã kiểm lại bằng cách mở từng link):
- `location.phuc_loc` có `mapsUrl` là `https://share.google/5w1gPPvDQbyTm3CxB`. Link này mở **trang tìm kiếm Google**, không phải Google Maps. Khách bấm "Xem bản đồ" không thấy bản đồ.
- `apps/web/src/lib/locations.ts` có một link khác cho Phúc Lộc, `https://maps.app.goo.gl/pU2Zr72N1s612v5b7`. Link này mở đúng ghim "Sân Cầu Lông Phúc Lộc" trên Google Maps, tại 10.82406, 106.72472.
- Tọa độ lưu trong Sanity (`geoLat`/`geoLng`) lệch xa ghim Google Maps của chính sân đó:
  - Phúc Lộc: Sanity ghi 10.84495, 106.70385, cách ghim **khoảng 3,3 km**.
  - Khang Sport: Sanity ghi 10.8443035, 106.703096, cách ghim "KHANG Sport Center" mà `mapsUrl` của sân trỏ tới (10.82684, 106.72270) **khoảng 2,9 km**.
  - Green và Huệ Thiên chỉ lệch 160 m và 86 m, bình thường.
- Tọa độ này đi vào JSON-LD (`apps/web/src/lib/schema.ts`: `latitude`/`longitude`, và link bản đồ dự phòng khi không có `mapsUrl`). Google và các công cụ AI đang nhận sai vị trí hai sân.

**Chủ đã chốt 2026-09-22: ghim Google Maps đúng cho cả hai sân.** Tọa độ trong Sanity lẫn trong code đều sai và phải sửa theo ghim: Khang Sport `10.8268392, 106.7227008`, Phúc Lộc `10.8240557, 106.7247193`.

Hai chỗ trong phần trên cần đính chính, đo lại ngày 2026-09-22: Sanity và `apps/web/src/lib/locations.ts` ghi **cùng** tọa độ chứ không lệch nhau; và tra ngược OpenStreetMap thì tọa độ cũ của Khang Sport lại rơi đúng "Đường số 20" như địa chỉ đang công bố, nên bằng chứng máy móc không đủ để kết luận — chỉ chủ mới chốt được.

**Làm** (sau khi chủ xác nhận):
- Đổi `mapsUrl` của Phúc Lộc trong Sanity sang link Google Maps đúng.
- Sửa `geoLat`/`geoLng` của hai sân theo vị trí chủ xác nhận.
- Đồng bộ `apps/web/src/lib/locations.ts` với Sanity, hoặc ghi rõ nguồn nào là chuẩn. Các giá trị viết cứng ở đây đang lệch với Sanity (xem thêm cảnh báo về sân viết cứng trong `skills/v2badminton-next/SKILL.md`).

**Xong khi:** mọi link bản đồ mở đúng ghim trên Google Maps, và tọa độ trong Sanity cách ghim dưới 200 m.

---

## T9 — Việc lặt vặt còn lại của bộ skill

**Trạng thái:** mục 1 xong — #119; mục 2 và 3 xong — #130 (mục 2 sửa định nghĩa eval; việc chạy lại vòng 4 vẫn còn, phải chạy từ session không nạp bộ nhớ dự án)
**Đọc trước:** `skills/_evals/README.md`, `skills/v2badminton-next/SKILL.md`

Bộ skill đang dùng được và đã được đo (#120–#123). Các việc dưới đây là dọn dẹp và gia cố, không chặn gì, làm lúc nào cũng được.

1. **Khi PR #119 merge, gỡ ghi chú "PR #119".** Làm ngay trong PR #119 hoặc ngay sau khi nó merge. CI job "Skill paths" sẽ cảnh báo để nhắc.
   - Xoá 2 mục trong `PENDING` của `scripts/check-skill-paths.mjs`.
   - Xoá các ghi chú "PR #119" trong 4 skill: `grep -rn "PR #119" skills/`.
   - Sửa luôn câu cảnh báo của script. Hiện nó ghi "PR #119 đã merge" ngay khi file xuất hiện, kể cả trên chính nhánh của PR #119, lúc PR chưa merge. Nên ghi "đã có trên nhánh này".
2. **Siết bộ eval.** Chi tiết ở mục "Known weaknesses" trong `skills/_evals/README.md`:
   - E2, E4, E6 không phân biệt được có skill hay không có skill: siết lại hoặc bỏ.
   - Kỳ vọng 3, 4, 7 của E9 cũng chưa phân biệt được.
   - Thêm cho E8 một kỳ vọng về quyết định "chỉ báo buổi chuẩn 120 phút". Làm sau T4.
   - Chạy eval từ một session không nạp bộ nhớ dự án: ở vòng 3, bộ nhớ của chủ đã lọt vào cả hai cấu hình.
3. **Ghi quy ước làm PR vào `skills/v2badminton-next/SKILL.md`**, khoảng 10 dòng:
   - squash merge, tiêu đề có `(#số PR)`;
   - commit message giải thích *vì sao*, không chỉ *cái gì*;
   - merge đúng commit đã qua CI (`gh pr merge --match-head-commit <sha>`);
   - xoá nhánh sau khi merge;
   - nhánh đang làm dở thì merge `main` vào khi cần.

   Hiện các quy ước này chỉ nằm trong lịch sử git, nên Codex và các model khác không thấy.

**Xong khi:** CI không còn cảnh báo "PR #119"; từng mục yếu trong README của bộ eval đã được xử lý, hoặc có ghi lý do giữ nguyên; skill `v2badminton-next` có mục quy ước PR.

---

## Chờ chủ

Những việc agent không làm thay được:

- **Thử Codex nạp skill:** mở Codex trong repo, hỏi "liệt kê skill của dự án". Kể ra đủ 5 skill là đạt.
- **Publish màn hình đồng ý OAuth** trong Google Cloud Console (project chứa client `528367442606-…`) trước khoảng 2026-09-24, nếu không token GA4 lại hết hạn. Đã có lịch nhắc lúc 09:00 ngày 22/09.
- **`.codex/tmp/` chưa bị ignore:** thư mục chứa khoảng 480KB dump SEO audit và node_modules, chỉ một lần `git add -A` là vào repo. Thêm `.codex/tmp/` vào `.gitignore`.
- *(Không gấp)* **Cấp quyền cho Cloudflare, Sentry và Vercel MCP** để agent xem được deploy và lỗi.
