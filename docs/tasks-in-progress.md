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
| T10 | Loại tài liệu "Sự kiện" cho giải nội bộ | Sanity + code | Thấp — làm khi có giải |
| T11 | P1.7 — fail-closed khi Sanity không truy cập được | Code | Trung bình |
| T12 | CSP cho origin của Studio | Code | Thấp |
| T13 | Dọn hồ sơ Google Maps trước khi xin đánh giá | Chủ | Cao |
| T14 | Nối Google Maps với website | Code + chủ | Cao — sau T13 |
| T15 | Xin đánh giá thật trên Google Maps | Chủ + agent | Cao — sau T13 |
| T16 | Đo lường: biết khách đến từ đâu | Code + chủ | Cao |
| T17 | Hai trang quận nhắm "học cầu lông + quận" | Sanity + code | Cao |
| T18 | Poster QR ở sân và fanpage của chủ sân | Chủ + agent | Trung bình |
| T19 | Danh bạ sân cho 4 sân đối tác | Sanity + chủ | Trung bình |
| T20 | Có tên trong bài "Top", trang danh bạ và nhóm Facebook | Chủ + agent | Trung bình |
| T21 | Tin tức: phạm vi `/tin-tuc/` và index của hub `/tin-v2/` | Chủ + Sanity + code | Thấp |
| T22 | Báo cáo SEO ở mốc 30, 60, 90 ngày | Báo cáo | Trung bình |
| T23 | Rà danh sách trang dịch vụ sau mốc 90 ngày | Quyết định + code | Thấp — sau T22 |

T1–T9 đã xong (2026-09-22). T10–T12 là phần còn mở của workstream CMS. T1–T5 và T8 từng sai trước mặt khách; T6, T7 và T9 là gia cố bộ skill: skill hiện dùng được và đã được đo; các việc này giữ cho nó không hỏng dần và vá những điểm yếu đã đo được.

T13–T23 là workstream SEO, mở ngày 2026-09-24. Chiến lược, số liệu gốc và các quyết định nằm ở `docs/seo-strategy.md`; bằng chứng trong từng việc kiểm ngày 2026-09-23/24, không phải ngày 2026-09-17 như các việc trên. Thứ tự hợp lý: T13 và T16 trước, vì hồ sơ Maps phải đúng quy định trước khi xin đánh giá, và phải đo được thì mới biết việc nào có tác dụng.

## Quyết định của chủ (2026-09-17)

Dùng chung cho các việc bên dưới. Đây là dữ kiện đã chốt, không phải đề xuất.

- **Gói rẻ nhất** là lớp nhóm 2 buổi/tuần, **1.000.000 VNĐ/tháng**.
- **Lớp nhóm luôn 4-8 người.** "2-6" là số cũ.
- **1 kèm 1 (400.000 VNĐ/giờ/học viên):** khách hoặc V2 đặt sân đều được, không bên nào bắt buộc. **Tiền thuê sân luôn do khách trả.** V2 chỉ cung cấp HLV và cầu. Lớp nhóm thì khác: học phí đã gồm sân.
- **Buổi học nhóm chuẩn là 120 phút:** 15-20 phút khởi động, 15 phút cuối để học viên đánh tự do với nhau, phần giữa là tập. Mọi lớp buổi tối đều 120 phút. Buổi học thử cũng 120 phút.
- **Ba khung ngắn hơn trong lịch là lớp custom, có thật — lịch không sai:** Green 14:00-15:30 (T3-T5-T7), Phúc Lộc 14:00-15:30 (T2-T4-T6), Huệ Thiên 17:00-18:00 (T7-CN) dài 60 phút. **Không sửa giờ các khung này.** Khung Khang Sport 11:30-13:00 (Thứ 7) cũng từng nằm ở đây: chủ cho biết ngày 2026-09-23 rằng đó là lớp 1 kèm 1, không nhận thêm người, và đã ẩn khỏi Sanity ngày 22/09. Đừng đưa nó trở lại.
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

**Trạng thái:** xong — mục 1: #119; mục 2 và 3: #130; vòng eval 4 chạy ngày 2026-09-22: #135. Cách ly bộ nhớ vẫn chưa giải được, xem "Known weaknesses" trong `skills/_evals/README.md`
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

## T10 — Loại tài liệu "Sự kiện" cho giải nội bộ

**Trạng thái:** chưa nhận — **chủ quyết ngày 2026-09-23: mỗi năm chỉ 2-3 giải, để đó, khi nào cần thì làm**. Ghi lại trong #137.
**Đọc trước:** `skills/sanity-cms/SKILL.md`, `skills/seo/SKILL.md`, `skills/v2badminton-next/SKILL.md`

**Bối cảnh.** Đề bài này do agent bịa ra làm đề chấm skill (eval 6), không phải yêu cầu của chủ. Nhưng hai lượt chạy ngày 2026-09-22 đã cho ra code gần đủ dùng, nên giữ lại thay vì bỏ.

**Chủ xác nhận ngày 2026-09-24:** dùng `/su-kien/` cho các giải V2 tổ chức là được. Tin tức và thông báo về V2 vẫn đăng ở hub `/tin-v2/`. Để hai trang không tranh nhau cùng một giải, trang `/su-kien/` là trang chính của giải đó; nếu có bài ở `/tin-v2/` thì chỉ tóm tắt ngắn và link sang trang `/su-kien/`. Xem T21 và phụ lục blog (#148).

**Code đang nằm ở đâu.** Hai nhánh trong máy chủ repo, chưa push, chưa review, **không merge nguyên trạng**:
- `worktree-agent-a2d2fbb4d7f55ba07` — bản có skill. Lấy bản này làm gốc.
- `worktree-agent-a6f21c897b2b496b0` — bản không skill. Có hai thứ tốt hơn nên ghép sang: component thẻ sự kiện (`EventBadge`, `EventCard`) và bản sửa lỗi ảnh bìa cao 405px do thuộc tính `height` đè `aspect-ratio`.

Cả hai bản còn kèm bản diff và file mới trong `.claude/skill-evals/iteration-4/eval-6-new-event-doc-type/*/run-1/outputs/files/` (gitignored, chỉ có trên máy chủ repo).

**Bản có skill gồm gì.** ~1.400 dòng mới, 8 file, cộng sửa 28 file: schema `event` 5 tab trong Studio (tổng quan, thời gian & địa điểm, nội dung, kết quả & ảnh, SEO); `/su-kien/` và `/su-kien/<slug>/`; nhãn "sắp diễn ra / đang diễn ra / đã kết thúc" tự tính theo giờ Việt Nam; nút đăng ký tự ẩn khi hết hạn; link chân trang chỉ hiện khi đã có sự kiện publish; vào sitemap; test riêng.

**Quyết định đúng cần giữ:** chỉ phát JSON-LD `SportsEvent` khi sự kiện mở cho người ngoài CLB. Google chỉ chấp nhận sự kiện ai cũng đăng ký được; khai giải nội bộ là khai sai. Bản không skill phát cho mọi giải — đừng lấy phần đó.

**Làm (khi có giải thật, ước lượng nửa buổi):**
- Dựng lại trên `main` lúc đó. Sẽ đụng độ ở `dashboardQueries.ts`, `DashboardTool.tsx`, `ContentOpsTable.tsx` vì #134 đã sửa các file này sau khi hai nhánh kia tách ra.
- Soát toàn bộ; bỏ phần agent tự ý sửa file skill và file này trong worktree của nó.
- Kiểm thật: build, test, mở form trong Studio, tạo một sự kiện nháp, bấm "Xem bản nháp", xem ở 390px và 1440px.
- Chủ cần duyệt các nhãn tiếng Việt ("Vô địch / Á quân / Hạng ba", "Giải đấu nội bộ / Giao lưu") và thêm `event` vào bộ lọc webhook trong Sanity, nếu không publish xong web chờ tới 1 giờ mới đổi.
- Cân nhắc tách hai PR: schema + hai trang trước, kết quả và thư viện ảnh sau.

**Xong khi:** đăng được một giải thật từ Studio, trang hiện đúng trạng thái, và giải nội bộ không phát `SportsEvent`.

---

## T11 — P1.7: fail-closed khi Sanity không truy cập được

**Trạng thái:** xong — #138. Chủ quyết ngày 2026-09-23: lịch và sân giữ bản dự phòng (vì khách cần địa chỉ và lịch đang khớp Sanity), FAQ cũ ẩn hẳn, toạ độ dự phòng không gửi cho Google
**Đọc trước:** `skills/sanity-cms/SKILL.md`, `skills/v2badminton-next/SKILL.md`

**Hiện trạng.** Khi Sanity không đọc được, trang vẫn dựng bằng JSX và dữ liệu viết cứng thay vì báo hỏng. Nghĩa là một sự cố Sanity không hiện ra ngay, mà âm thầm phục vụ nội dung cũ — đúng loại lỗi đã làm mất cả buổi hôm 2026-09-20, khi đọc thiếu token trông y như dữ liệu đầy đủ. Ghi trong `docs/cms/gate-b-completion-2026-09-10.md` §4.

**Cần quyết trước khi làm:** trang nào được phép fallback (trang chủ? money page?) và trang nào nên trả lỗi. Hỏi chủ.

---

## T12 — CSP cho origin của Studio

**Trạng thái:** chưa nhận
**Đọc trước:** `skills/sanity-cms/SKILL.md`

**Hiện trạng.** `apps/studio/next.config.ts` cố ý không có CSP (xem `docs/cms/gate-b-addendum-2026-09-09.md` §B-8): Sanity Studio cần `unsafe-eval`, worker `blob:` và `connect-src` rộng, nên CSP viết tay dễ làm hỏng trình soạn. Hiện quyền vào cms.v2badminton.com chỉ dựa vào đăng nhập Sanity.

**Cân nhắc trước khi làm:** so giữa viết CSP đủ rộng cho Studio và bật Vercel Deployment Protection cho project studio. Cách sau đơn giản hơn nhiều; chủ đã từ chối một lần ngày 2026-09-10 vì nó chặn cả việc mở Studio từ máy khác.

---

## T13 — Dọn hồ sơ Google Maps trước khi xin đánh giá

**Trạng thái:** chưa nhận — chủ sẽ tự làm sau (2026-09-24); còn chờ chủ quyết điểm 1 và 3 bên dưới
**Đọc trước:** `docs/seo-strategy.md` (mục 4 và 5.1)

**Hiện trạng** (Google Maps, không đăng nhập, 2026-09-24):

| Hồ sơ | Địa chỉ | Xác minh | Điện thoại | Đánh giá |
|---|---|---|---|---|
| V2 Badminton | 154/9 Nguyễn Xí, Bình Thạnh (địa chỉ sân Green) | đã xác minh | +84 982 093 947 | 0 |
| V2 Badminton cơ sở Thủ Đức -Sân cầu lông Huệ Thiên | 520 QL13, Hiệp Bình | chưa — Google hiện nút "Xác nhận doanh nghiệp này" | — | 0 |
| V2Badminton cơ sở Thủ Đức - sân Phúc Lộc | 103/11B Đường Số 20, Hiệp Bình (trùng địa chỉ sân Phúc Lộc) | chưa | — | 0 |
| V2Badminton cơ sở Thủ Đức - Sân Bình Triệu | Đường Số 20, Hiệp Bình, cách hồ sơ Phúc Lộc khoảng 370 m | chưa | +84 907 911 886 | 0 |

- Web dùng số 0907 911 886 (`apps/web/src/lib/site.ts`), cũng là số ghi trong phần xác minh dữ kiện tháng 5/2026.
- Chủ cho biết (2026-09-24):
  - các chi nhánh được tạo "ngay kế bên sân ở từng khu vực", theo hướng dẫn của các model AI khác lúc mới làm;
  - cả hai số 0907 911 886 và 0982 093 947 đều là số của chủ;
  - chủ nhờ được hầu hết chủ sân.
- Quy định của Google:
  - Lớp học định kỳ tại địa điểm mình không sở hữu hoặc không có quyền đại diện thì không đủ điều kiện có hồ sơ (https://support.google.com/business/answer/13763036, mục "Ineligible businesses").
  - Tên hồ sơ phải là tên thật, không thêm địa danh hay tên doanh nghiệp khác (https://support.google.com/business/answer/3038177).
  - Hồ sơ bị khoá thì mất luôn đánh giá, nên phải sửa trước khi xin đánh giá (T15).

**Cần chủ quyết:**
1. Có gộp 3 hồ sơ Thủ Đức thành 1 không, và giữ ở sân nào? Đề xuất: gộp, giữ ở sân có nhiều lớp nhất.
2. ~~Hồ sơ chính nên dùng số điện thoại nào?~~ Đề xuất (2026-09-24): dùng **0907 911 886 làm số chính trên mọi hồ sơ**. Nếu muốn, thêm 0982 093 947 vào ô số điện thoại phụ của hồ sơ. Lý do:
   - Google và các trợ lý AI đối chiếu tên, địa chỉ và số điện thoại giữa hồ sơ Maps, web, Facebook và các trang danh bạ để xác định đó là cùng một doanh nghiệp. Số chính khớp nhau ở mọi nơi thì việc đối chiếu chắc chắn hơn.
   - 0907 911 886 đã có trên web, ở nút Zalo và trong dữ liệu cấu trúc (`apps/web/src/lib/site.ts`), nên chọn số này thì không phải sửa web.
   - Khách thấy cùng một số ở mọi nơi, và gọi hay nhắn Zalo đều trúng.
   - Khi đo (T16, T22), dễ biết lượt gọi đến từ đâu hơn.
3. Chủ sân của các hồ sơ được giữ lại có đồng ý (một tin nhắn là đủ) và cho treo banner V2 cố định không?

**Làm** (chủ làm trong Google Business Profile; agent không đăng nhập được):
- Hồ sơ giữ lại:
  - đặt tên đúng "V2 Badminton";
  - số điện thoại khớp với web;
  - giờ mở cửa bằng giờ lớp thật;
  - link web lấy từ T14;
  - có mô tả dịch vụ và ảnh lớp.
- Hồ sơ Thủ Đức được giữ lại phải được xác minh. Google có thể yêu cầu quay video tại địa điểm, nên cần treo banner V2 ở sân trước.
- Gỡ hai hồ sơ còn lại: nhận quyền quản lý rồi đóng, hoặc vào "Đề xuất chỉnh sửa" → "Đóng cửa hoặc xoá".
- Lưu tin nhắn đồng ý của chủ sân.

**Xong khi:** chỉ còn các hồ sơ đã chọn; tất cả đã được xác minh; tên, số điện thoại và giờ đều đúng; có banner V2 ở sân.

---

## T14 — Nối Google Maps với website

**Trạng thái:** chưa nhận — làm sau T13, khi đã biết hồ sơ nào còn lại
**Đọc trước:** `skills/seo/SKILL.md` (mục JSON-LD), `skills/analytics-report/SKILL.md`

**Hiện trạng** (2026-09-24):
- JSON-LD chỉ khai Facebook trong `sameAs` (`apps/web/src/lib/schema.ts`, ba chỗ `sameAs: [contact.facebookUrl]`), chưa có link hồ sơ Maps.
- Link web trên các hồ sơ Maps không có mã UTM (hồ sơ Bình Triệu còn trỏ tới bản `http://`). Vì vậy GA4 không tách được khách đến từ Maps với khách đến từ tìm kiếm Google.
- Place ID của hồ sơ chính: `ChIJIZbkb80pdTERglAcyJiRR9Y` (lấy từ URL Google Maps ngày 2026-09-24).

**Làm.**
- Thêm URL hồ sơ Maps đã xác minh vào `sameAs`. Nếu lưu URL này trong `site_settings` thì đọc từ Sanity giống `facebookUrl`, không viết cứng vào code.
- Soạn cho mỗi hồ sơ một link có UTM, ví dụ `https://v2badminton.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp-binh-thanh`. Chủ dán link này vào ô "Trang web" của hồ sơ.
- Kiểm: JSON-LD đọc được, Rich Results Test không báo lỗi mới.

**Xong khi:** JSON-LD trỏ tới hồ sơ Maps, và GA4 có phiên với `sessionCampaignName` bắt đầu bằng `gbp-`.

---

## T15 — Xin đánh giá thật trên Google Maps

**Trạng thái:** chưa nhận — bắt đầu sau T13 (không xin đánh giá cho hồ sơ có thể bị gộp hay bị khoá)
**Đọc trước:** `docs/seo-strategy.md` (mục 5.1 và 7), `skills/noi-dung-vi/SKILL.md` (chữ trên thẻ)

**Hiện trạng** (2026-09-24):
- Cả 4 hồ sơ đều có 0 đánh giá. Các sân quanh đó: Phúc Lộc 4,1★ (44 đánh giá), Vạn Phúc 4,8★ (121), Tấn Phúc 4,4★ (207), PooC 4,8★ (1.442).
- 3 lời chứng thực trên web là lời thật, nhưng khó nhờ những người đó viết thêm (chủ, 2026-09-24).
- HLV chưa muốn công khai tên và ảnh.

**Làm.**
- Agent: làm thẻ khổ A6 để in. Mỗi hồ sơ một mã QR, quét là mở thẳng khung viết đánh giá (`https://search.google.com/local/writereview?placeid=<Place ID>`). Chữ trên thẻ ngắn, chủ duyệt.
- HLV hỏi trực tiếp học viên đang học vào cuối buổi, lúc họ vừa đạt một mốc (làm được kỹ thuật mới, tròn tháng đầu). Học viên học ở sân nào thì đánh giá cho hồ sơ của sân đó.
- Trả lời mọi đánh giá trong vài ngày.
- Không tặng quà, không giảm giá, không soạn sẵn nội dung, không nhờ người không học. Những việc này trái chính sách đánh giá của Google, và Google gỡ các đánh giá đó.

**Xong khi:** thẻ QR đã được đặt ở các sân và hồ sơ có ít nhất 10 đánh giá. Mục tiêu 25–30 đánh giá ở mốc 90 ngày được theo dõi ở T22.

---

## T16 — Đo lường: biết khách đến từ đâu

**Trạng thái:** chưa nhận
**Đọc trước:** `skills/analytics-report/SKILL.md`, `skills/v2badminton-next/SKILL.md` (đường xử lý lead)

**Hiện trạng** (2026-09-23/24):
- Chỉ `generate_lead` là Key Event: mỗi tháng từ tháng 6 đến tháng 9, số `keyEvents` bằng đúng số `generate_lead`. Vì vậy lượt bấm Zalo hoặc gọi (`contact_click`) không được tính là chuyển đổi.
- Hai nút cuối trang dịch vụ (`apps/web/src/components/money-page/MoneyPageTemplate.tsx`, quanh dòng 254 và 257) là `<Link>` nội bộ, chưa gắn `trackEvent`.
- Form không hỏi khách biết V2 qua đâu. Ba nguồn khách chính (người quen, Facebook, gặp ở sân — chủ, 2026-09-24) GA4 không đo được.
- `/lop-cau-long-buoi-toi/`: Search Console báo "Crawled – currently not indexed", Google ghé lần cuối ngày 2026-05-12.
- Trong code không có thẻ xác minh Bing Webmaster Tools. Chưa kiểm bản ghi DNS.

**Làm.**

Agent (một PR):
- Thêm câu hỏi không bắt buộc "Bạn biết V2 qua đâu?" vào form, với các lựa chọn: người quen giới thiệu, Facebook, gặp ở sân, Google, Google Maps, ChatGPT hoặc AI khác, khác.
  - Đi đúng đường xử lý lead hiện có (validation → DB → email), và kiểm xem DB có cần thêm cột không.
  - Câu chữ theo `skills/noi-dung-vi/SKILL.md`, chủ duyệt.
- Gắn `cta_click` cho hai nút cuối trang dịch vụ, thêm giá trị `CtaLocation` mới nếu cần.

Chủ (mỗi việc vài phút):
- GA4 Admin → Events → đánh dấu `contact_click` là Key Event.
- Search Console → kiểm tra URL `/lop-cau-long-buoi-toi/` → "Yêu cầu lập chỉ mục". Ghi ngày làm vào dòng Trạng thái.
- Đăng ký Bing Webmaster Tools và nhập site từ Search Console. Một số trợ lý AI tìm web qua Bing.

**Xong khi:**
- GA4 tính `contact_click` là Key Event.
- Form lưu được nguồn khách, và email báo lead có dòng nguồn.
- Hai nút cuối trang có event.
- Trang buổi tối đã được yêu cầu index.
- Site đã có trong Bing Webmaster Tools.

---

## T17 — Hai trang quận nhắm "học cầu lông + quận"

**Trạng thái:** chưa nhận
**Đọc trước:** `skills/seo/SKILL.md`, `skills/noi-dung-vi/SKILL.md`, `skills/sanity-cms/SKILL.md` (mục "Writing content")

**Hiện trạng** (Search Console, 25/8–21/9):
- `/lop-cau-long-thu-duc/`: 279 lượt hiển thị, 0 click, vị trí 9,5. Tiêu đề: "Lớp Cầu Lông Thủ Đức | Huệ Thiên, Bình Triệu, Phúc Lộc".
- `/lop-cau-long-binh-thanh/`: 320 lượt hiển thị, 0 click, vị trí 8,6. Tiêu đề: "Lớp Cầu Lông Bình Thạnh | Sân Green | V2 Badminton".
- Phần lớn lượt hiển thị đến từ người tìm tên sân. Với người tìm lớp: "học cầu lông thủ đức" ở vị trí khoảng 11 (8 lượt), "học cầu lông bình thạnh" khoảng 40 (4 lượt).

**Làm.**
- Viết lại `metaTitle`, H1 và đoạn mở đầu theo cụm "học cầu lông Thủ Đức" và "học cầu lông Bình Thạnh".
  - Đoạn mở đầu nói rõ lớp gì, cho ai, ở sân nào, giá từ bao nhiêu (quy tắc AEO trong `skills/seo/SKILL.md`).
  - `metaTitle` của money page phải tự có "| V2 Badminton".
  - Chốt câu chữ với chủ, tạo bản nháp trong Sanity, chủ publish.
- Thêm link nội bộ tới hai trang này từ trang chủ, trang người mới, trang người đi làm, trang 1 kèm 1 và trang bảng giá, với chữ neo có mô tả.
- Khi có ảnh lớp thật (từ T15 hoặc T18) thì đưa lên trang.
- Ghi số trước và sau: lượt hiển thị và vị trí của hai truy vấn trên, trong 28 ngày trước và 28 ngày sau khi publish.

**Xong khi:** tiêu đề mới đã publish, link nội bộ đã có, và số trước/sau đã ghi vào mục 10 của `docs/seo-strategy.md`.

---

## T18 — Poster QR ở sân và fanpage của chủ sân

**Trạng thái:** chưa nhận
**Đọc trước:** `docs/seo-strategy.md` (mục 5.2), `skills/noi-dung-vi/SKILL.md`

**Hiện trạng** (2026-09-24): "gặp ở sân" là một trong ba nguồn học viên chính nhưng chưa đo được. Chủ nhờ được hầu hết chủ sân. Chưa có poster nào dẫn khách về web.

**Làm.**
- Agent: làm mẫu poster khổ A4 cho từng sân (Green, Huệ Thiên, Phúc Lộc, Khang Sport).
  - Nội dung: "Lớp cầu lông V2 tại sân này", giá "từ" lấy từ Sanity, và mã QR tới trang quận có UTM (`utm_source=poster&utm_medium=offline&utm_campaign=<tên sân>`).
  - Không in lịch chi tiết vì dễ lỗi thời; mã QR dẫn tới lịch trên web.
  - Chủ duyệt câu chữ.
- Chủ: in và dán ở sân; nhờ chủ sân đăng một bài hoặc nhắc lớp V2 kèm link trên fanpage của sân (và trên web của sân nếu có).
- Ghi lại sân nào đã dán, fanpage nào đã nhắc, vào mục 10 của `docs/seo-strategy.md`.

**Xong khi:** poster đã có ở các sân; GA4 có phiên với `utm_source=poster`; có ít nhất một fanpage sân nhắc V2 kèm link.

---

## T19 — Danh bạ sân cho 4 sân đối tác

**Trạng thái:** chưa nhận — chờ chủ quyết mở với 4 sân
**Đọc trước:** `skills/sanity-cms/SKILL.md`, `skills/seo/SKILL.md`; spec Phase 2 `.claude/CMS/v2badminton-cms-phase-2-locked-spec.md` (chỉ có trên máy của chủ)

**Hiện trạng.**
- Code của `/san-cau-long/` đã xong từ 2026-06-17 (Phase 2 PR1–PR4): schema `court`, loader, trang, JSON-LD `SportsActivityLocation`, event `cms_court_cta_click`.
- Mục trên menu đang tắt bằng `EXPOSE_SAN_CAU_LONG = false` (`apps/web/src/components/layout/Nav.tsx`). Sanity có 0 tài liệu `court` (2026-09-23).
- Người tìm tên sân: khoảng 366 lượt hiển thị, 0 click (25/8–21/9). Các lượt này đang rơi vào hai trang quận.
- Spec đặt mức mở là 5 sân đã kiểm, kèm phần nhận xét do chủ viết, và định làm danh bạ gồm cả sân V2 không dạy. Menu chỉ hiện khi có ít nhất 3 khu vực và 5 sân (quyết định 2026-06-15). V2 dạy ở 4 sân.

**Làm.**
- Đưa spec Phase 2 từ `.claude/CMS/` vào `docs/`, để máy khác cũng đọc được.
- Chủ quyết: mở với 4 sân đối tác.
- Xin chủ sân thông tin: giờ mở cửa, giá thuê, số điện thoại đặt sân, ảnh. Chủ viết phần nhận xét theo spec §9 (PR5b).
- Tạo bản nháp `court` trong Sanity, chủ publish. Menu vẫn ẩn; hai trang quận link sang các trang sân.
- Gửi link trang sân cho chủ sân để họ chia sẻ (nối với T18).

**Xong khi:** 4 trang sân đã publish và được index, hai trang quận đã link tới, và mốc T22 kế tiếp thấy có click từ người tìm tên sân.

---

## T20 — Có tên trong bài "Top", trang danh bạ và nhóm Facebook

**Trạng thái:** chưa nhận
**Đọc trước:** `docs/seo-strategy.md` (mục 3 và 5.3), `skills/noi-dung-vi/SKILL.md`

**Hiện trạng** (tìm ngày 2026-09-24 từ máy chủ ở Mỹ; thứ tự có thể khác Google Việt Nam):
- Trang 1 cho "học cầu lông thủ đức", "lớp học cầu lông bình thạnh" và "học cầu lông 1 kèm 1 tphcm" là các bài tổng hợp và trang danh bạ: ShopVNB, Siêu Thị Cầu Lông, votcaulongshop, Eduoka, Baodep, Sài Gòn Review. Có thêm một bài hỏi trong nhóm Facebook "Học cầu lông".
- V2 không có tên trong bài nào.
- Bài ShopVNB về Thủ Đức cập nhật ngày 2026-06-04. Eduoka có mục "Đăng ký dạy".

**Làm.**
- Đăng ký V2 trên Eduoka (miễn phí).
- Agent soạn tin nhắn hoặc email ngắn cho từng trang, kèm dữ kiện đúng lấy từ Sanity (lịch, giá từ 1.000.000đ/tháng, sân, ảnh). Chủ gửi. Không trả phí (chủ, 2026-09-24).
- Khi có người hỏi lớp ở Thủ Đức hoặc Bình Thạnh trong nhóm Facebook, trả lời thật và kèm link trang quận. Không đăng quảng cáo hàng loạt.
- Ghi nơi đã gửi, ngày gửi và kết quả vào mục 10 của `docs/seo-strategy.md`.

**Xong khi:** có ít nhất 3 trang bên ngoài ghi tên V2 kèm link.

---

## T21 — Tin tức: phạm vi `/tin-tuc/` và index của hub `/tin-v2/`

**Trạng thái:** chưa nhận
**Đọc trước:** `docs/blog-content-platform-addendum-2026-07-09.md` (biên bản 2026-09-24, #148), `skills/seo/SKILL.md`, `skills/sanity-cms/SKILL.md`

**Hiện trạng** (2026-09-24):
- Chủ quyết:
  - `/tin-tuc/` chỉ dành cho tin các giải đấu chuyên nghiệp. Mục đích duy nhất là thu hút thêm lượt truy cập.
  - Tin về V2 đăng ở `/tin-v2/`.
  - Trang của các giải V2 tổ chức đặt ở `/su-kien/` (T10).
- `/tin-tuc/` (loại `post`): 0 bài, `noindex, follow`. Tiêu đề, H1 và mô tả của trang vẫn nói về tin V2: "Thông báo, cập nhật chương trình và tin hoạt động của V2 Badminton tại TP.HCM."
- Hub `/tin-v2/` ("Tin V2 Badminton", tạo ngày 2026-06-17): `isIndexed: true`, có trong sitemap cùng 2 bài áo kỷ niệm. Ngày 2026-09-23, Search Console chưa biết tới cả ba URL.
- Ngưỡng index giữ từ memo blog (§10): trang tổng hợp tin chỉ bật index khi đã đăng đều; hub cần khoảng 4–5 bài tốt.

**Làm.**
- Viết lại tiêu đề, H1 và mô tả của `/tin-tuc/` cho tin giải đấu chuyên nghiệp. Đây là trang file-routed nên sửa trong code; câu chữ theo `skills/noi-dung-vi/SKILL.md`, chủ duyệt.
- Tắt index của hub `/tin-v2/` (`isIndexed: false`) cho tới khi đủ bài và đăng đều, vẫn giữ index cho từng bài. Tạo bản nháp, chủ publish.
- Đề xuất SEO cho `/tin-tuc/` (2026-09-24, đã ghi trong phụ lục): **ưu tiên thấp**, vì những lý do sau.
  - Tin giải chuyên nghiệp phải cạnh tranh với báo thể thao và trang của BWF. Một site mới hiếm khi lên được trang 1 cho loại tin này.
  - Người đọc tin giải phần lớn không ở gần sân V2 và không tìm lớp học, nên lượt vào này gần như không thành học viên.
  - Lượt đọc tin giải không tự làm trang lớp học lên hạng. Thứ giúp trang lớp học là link từ trang khác và đánh giá trên Maps.
  - Tin viết lại từ nguồn khác không có gì riêng, và có thể kéo điểm chất lượng của cả site xuống.
  - Không đăng lại ảnh hay video của BWF hoặc báo khác (bản quyền); chỉ nhúng.

  Nếu vẫn đăng thì viết bài phân tích theo góc nhìn HLV, gắn với kỹ thuật V2 đang dạy, mỗi tuần tối đa một bài. Giữ `/tin-tuc/` ở trạng thái `noindex` cho tới khi đăng đều. Ghi chú pre-think ngày 2026-05-20 (trong `.claude/CMS/`, lúc đó dự kiến ở `/tin-cau-long/`) cũng theo hướng này.

**Xong khi:** câu chữ trang `/tin-tuc/` khớp phạm vi tin giải chuyên nghiệp, hub `/tin-v2/` không còn được index khi chưa đủ bài, và cách làm đã được ghi trong phụ lục.

---

## T22 — Báo cáo SEO ở mốc 30, 60, 90 ngày

**Trạng thái:** chưa nhận — mốc đầu khoảng 2026-10-24
**Đọc trước:** `skills/analytics-report/SKILL.md`, `docs/seo-strategy.md` (mục 2 và 7)

**Làm** ở mỗi mốc (khoảng 2026-10-24, 2026-11-23 và 2026-12-23):
- Kéo số Search Console và GA4 đúng cửa sổ 28 ngày, lùi lại 2 ngày vì Search Console có độ trễ. So với số gốc ở mục 2.
- Số đánh giá trên Maps, và mục "Hiệu suất" của hồ sơ Maps (chủ đọc trong Google Business Profile rồi gửi số).
- Tra các truy vấn ở mục 7 trên Google, ChatGPT và Perplexity; ghi lại V2 có được nhắc tên hay dẫn link không. Việc này thay cho W4.4 cũ.
- Ghi kết quả vào mục 10 của `docs/seo-strategy.md`, và sửa chiến lược nếu số liệu cho thấy điều khác.

**Xong khi:** đã ghi kết quả mốc 90 ngày, và `docs/seo-strategy.md` đã được sửa theo kết quả đó.

---

## T23 — Rà danh sách trang dịch vụ sau mốc 90 ngày

**Trạng thái:** chưa nhận — làm sau mốc 90 ngày của T22
**Đọc trước:** `docs/cms/url-rename-runbook.md`, `skills/seo/SKILL.md` (mục "Changing or retiring a URL"), `docs/seo-strategy.md` (mục 6)

**Hiện trạng** (25/8–21/9):
- 9 trong 12 trang dịch vụ có không quá 21 lượt hiển thị.
- `/lop-cau-long-buoi-toi/` chưa được index.
- Các nhóm trang gần nghĩa nhau: buổi tối, người đi làm, cuối tuần; và doanh nghiệp với team building.

**Làm.**
- Áp quy tắc gộp ở mục 6 của `docs/seo-strategy.md` lên số liệu mốc 90 ngày. Lập danh sách đề xuất kèm số liệu, chủ duyệt.
- Gộp theo runbook: chuyển nội dung riêng sang trang được giữ lại, redirect 308, sửa sitemap và link nội bộ.
- Với money page còn phải đổi slug trong Sanity. Làm theo trình tự trong `skills/seo/SKILL.md`, để không lúc nào trang bị 404 hay rơi khỏi sitemap.

**Xong khi:** mỗi trang dịch vụ đều có quyết định giữ hay gộp, ghi kèm số liệu, và các trang bị gộp đã redirect đúng.

---

## Chờ chủ

Những việc agent không làm thay được:

- **Quyết định cho workstream SEO (2026-09-24)**, chi tiết ở mục 4 của `docs/seo-strategy.md`:
  - gộp các hồ sơ Maps ở Thủ Đức (T13). Chủ sẽ tự làm sau; số điện thoại chính đã có đề xuất trong T13;
  - mở danh bạ sân với 4 sân (T19).

  Thêm ba việc vài phút trong GA4, Search Console và Bing, liệt kê ở T16.
- ~~**Publish màn hình đồng ý OAuth** trong Google Cloud Console~~ — **xong 2026-09-23.** App ở project `gen-lang-client-0433014248` (client `528367442606-…`, dùng chung cho GA4 và Search Console) đã chuyển từ *Testing* sang *In production*, nên refresh token không còn hạn 7 ngày. Nút Publish ban đầu bị mờ vì trang Branding thiếu app name, support email, homepage và privacy policy — điền xong là sáng; **không tải logo lên**, vì có logo là Google bắt buộc xác minh app. Publish xong vẫn phải cấp lại token một lần nữa (token cũ giữ hạn của lúc cấp); đã làm, và cả hai API đọc được sau khi khởi động lại.
- **Hoãn tới 2027 — trang `/lop-he-cau-long-tphcm/`:** hai câu ghi lịch hè có "khung trưa (11:30-14:00)", trong khi lớp nhóm giờ chỉ còn 12:00-14:00 (khung 11:30 là lớp 1 kèm 1, chủ đã ẩn ngày 2026-09-22). Chủ quyết ngày 2026-09-23: lớp hè đã đóng, khi nào mở lại mùa hè 2027 thì sửa luôn một thể. Sửa trong Sanity, không phải trong code.
- *(Không gấp)* **Cấp quyền cho Cloudflare và Vercel MCP** để agent xem được deploy. Cả hai chỉ cấp bằng OAuth trong phiên tương tác, nên một lần cấp chỉ dùng được cho đúng client đó; riêng Vercel không có token chỉ-đọc (token nào cũng toàn quyền tài khoản) nên chủ quyết ngày 2026-09-23 là không phát token ra ngoài. **Sentry thì xong rồi** (2026-09-23): chạy bằng stdio với Personal Token chỉ-đọc trong `.mcp.json`, model AI nào đọc file đó cũng dùng được — cách cấu hình nằm trong `skills/v2badminton-next/SKILL.md`.
