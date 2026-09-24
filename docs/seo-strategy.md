# Chiến lược SEO — v2badminton.com

> **Tài liệu sống.** Khi quyết định hay số liệu thay đổi thì sửa ngay ở đây, ghi kèm ngày. Bản đầu viết
> ngày 2026-09-24, dựa trên báo cáo Search Console và GA4 ngày 2026-09-23, lần kiểm Google Maps và trang kết quả
> tìm kiếm ngày 2026-09-24, và câu trả lời của chủ trong hai ngày đó.
>
> - Việc cụ thể: `docs/tasks-in-progress.md`, T13–T23.
> - Luật kỹ thuật SEO (canonical, sitemap, JSON-LD, đổi URL): `skills/seo/SKILL.md`.
> - Cách lấy và đọc số liệu: `skills/analytics-report/SKILL.md`.
> - Các kế hoạch SEO cũ trong `docs/` là lịch sử (mục 9).

## 1. Mục tiêu

Có thêm học viên mới từ Google, cả kết quả web lẫn Google Maps, và từ các trợ lý AI như ChatGPT.

- **Ưu tiên của chủ (2026-09-24):** lớp nhóm Thủ Đức, lớp nhóm Bình Thạnh, và 1 kèm 1.
- **Nguồn lực:** không chi tiền (không chạy quảng cáo, không trả phí để lên bài). HLV có thể chụp ảnh và quay
  clip lớp. Chủ nhờ được hầu hết chủ sân.
- **Hiện nay học viên mới chưa đến từ Google.** Họ đến chủ yếu qua người quen giới thiệu, Facebook và gặp V2
  ở sân (chủ, 2026-09-24). Với V2, SEO là một kênh cần xây mới, không phải kênh cũ cần sửa.

## 2. Số liệu gốc

Mọi so sánh sau này đều đối chiếu với bảng này. Nguồn: Search Console property `sc-domain:v2badminton.com`
và GA4 `properties/530684211`.

| Chỉ số | Giá trị | Cửa sổ |
|---|---|---|
| Lượt hiển thị trên Google | 1.023 (28 ngày trước đó: 836) | 25/8–21/9 |
| Click từ Google | 19 (28 ngày trước đó: 30) | 25/8–21/9 |
| Lượt hiển thị mỗi ngày | tháng 7: 13 · tháng 8: 31 · 1–21/9: 40 | theo tháng |
| Tìm tên sân (Phúc Lộc, Green Nguyễn Xí, Huệ Thiên…) | khoảng 366 lượt hiển thị, 0 click | 25/8–21/9 |
| Tìm lớp học (truy vấn có chữ "học") | khoảng 86 lượt hiển thị trong 6 tháng, đa số ở vị trí 30–50 | 1/4–22/9 |
| Vị trí "học cầu lông thủ đức" | khoảng 11 | 25/8–21/9 |
| Vị trí "học cầu lông bình thạnh" | khoảng 40 | 25/8–21/9 |
| Vị trí "học cầu lông 1 kèm 1" | khoảng 5,6 | 1/4–22/9 |
| URL trong sitemap đã được index | 20/24 | kiểm 2026-09-23 |
| Phiên truy cập mỗi ngày (mọi nguồn) | tháng 7: 2,7 · tháng 8: 4,1 · 1–22/9: 4,2 | theo tháng |
| Phiên từ công cụ tìm kiếm | tháng 7: 18 · tháng 8: 35 · 1–22/9: 28 | theo tháng |
| Phiên từ ChatGPT | tháng 7: 20 · tháng 8: 16 · 1–22/9: 13 | theo tháng |
| Form gửi (`generate_lead`) | 8, trong đó 3 từ Google (lần gần nhất 10/8) | 24/6–22/9 |
| Bấm Zalo hoặc gọi (`contact_click`) | tháng 7: 4 · tháng 8: 4 · 1–22/9: 8 | theo tháng |
| Bấm mở Google Maps từ web | tháng 7: 10 · tháng 8: 16 · 1–22/9: 19 | theo tháng |
| Đánh giá trên Google Maps | 0, trên cả 4 hồ sơ | kiểm 2026-09-24 |

Lưu ý khi đọc số:

- GA4 mất dữ liệu từ 14/5 đến khoảng 7/6 (lỗi theo dõi, đã sửa ở #83). Số tháng 4 chủ yếu là lượt truy cập lúc
  ra mắt. Vì vậy không so với tháng 4 đến tháng 6.
- GA4 không lọc lượt truy cập của chính chủ. Số nhỏ như hiện nay thì vài lượt cũng đủ làm lệch kết quả.
- Search Console ẩn các truy vấn ít người tìm. Trong 19 click gần nhất, chỉ biết được từ khóa của 3 click.
- GA4 chỉ tính form là chuyển đổi (Key Event). Lượt bấm Zalo hoặc gọi chưa được tính (T16).

## 3. Chẩn đoán

1. **Kỹ thuật không còn là chỗ nghẽn.** 20/24 URL đã được index, dữ liệu cấu trúc đầy đủ, mỗi trang dịch vụ dài
   730–1.160 chữ. Làm thêm phần kỹ thuật gần như không tạo ra thay đổi.
2. **V2 gần như không có mặt ở trang 1 cho các truy vấn tìm lớp học.** Ngoại lệ duy nhất là "học cầu lông 1 kèm 1".
3. **Trang 1 đang thuộc về các trang khác.** Tìm thử ngày 2026-09-24 các cụm "học cầu lông thủ đức", "lớp học
   cầu lông bình thạnh" và "học cầu lông 1 kèm 1 tphcm". Kết quả gồm:
   - bài "Top N lớp dạy cầu lông" của các shop vợt (ShopVNB, Siêu Thị Cầu Lông, votcaulongshop);
   - trang danh bạ (Eduoka, Baodep, Sài Gòn Review);
   - trang dạy kèm thể thao;
   - một bài hỏi trong nhóm Facebook "Học cầu lông".

   V2 không có tên trong bài nào. Lưu ý: công cụ tìm chạy từ máy chủ ở Mỹ, nên thứ tự có thể khác Google Việt
   Nam, và không thấy khối bản đồ. Một site mới, ít trang khác trỏ link về, sẽ mất rất lâu mới vượt được các
   trang này. Cách nhanh hơn là có tên ngay trong chính các bài đó. Đây cũng là các bài ChatGPT hay dẫn khi được
   hỏi "học cầu lông ở đâu".
4. **Google Maps chưa mang lại gì.** Có 4 hồ sơ nhưng 0 đánh giá, 3 hồ sơ chưa xác minh, và số điện thoại trên
   hồ sơ chính khác với web. Các sân quanh đó có từ 44 đến 1.442 đánh giá.
5. **Ngày càng nhiều người tìm tên sân, nhưng chưa có trang đúng thứ họ cần.** Google đưa trang lớp Bình Thạnh và
   Thủ Đức ra cho người tìm sân, và họ không bấm. Đếm cùng một cách thì 28 ngày trước đó có khoảng 200 lượt hiển
   thị, còn 28 ngày gần nhất khoảng 366.

## 4. Quyết định

### Đã chốt

| Ngày | Quyết định | Nguồn |
|---|---|---|
| 2026-06-15 | Danh bạ sân chỉ hiện trên menu khi có ít nhất 3 khu vực và 5 sân | spec Phase 2 trong `.claude/CMS/`, chỉ có trên máy của chủ |
| 2026-09-17 | Gói rẻ nhất 1.000.000 VNĐ/tháng (2 buổi/tuần); lớp nhóm 4-8 người; buổi chuẩn 120 phút; 1 kèm 1 400.000 VNĐ/giờ, tiền sân khách trả | `docs/tasks-in-progress.md`, mục "Quyết định của chủ" |
| 2026-09-24 | V2 có hồ sơ Google Maps đã xác minh; các "chi nhánh" được tạo cạnh sân ở từng khu vực | chủ |
| 2026-09-24 | Chưa công khai tên và ảnh HLV | chủ |
| 2026-09-24 | Nhờ được hầu hết chủ sân (treo poster, nhắc tên V2 trên fanpage) | chủ |
| 2026-09-24 | Không chi tiền; HLV có thể chụp ảnh, quay clip lớp | chủ |
| 2026-09-24 | 3 lời chứng thực trên web là lời thật, nhưng khó nhờ những người đó viết thêm | chủ |
| 2026-09-24 | `/tin-tuc/` chỉ dành cho tin các giải đấu chuyên nghiệp, mục đích là thu hút thêm lượt truy cập; `/tin-v2/` là tin về V2; trang của các giải V2 tổ chức đặt ở `/su-kien/` (T10) | chủ; ghi trong phụ lục blog (#148) |
| 2026-09-24 | Cả hai số 0907 911 886 và 0982 093 947 đều là số của chủ V2 | chủ |
| 2026-09-24 | Ba hồ sơ Maps ở Thủ Đức được tạo theo hướng dẫn của các model AI khác lúc mới làm; chủ sẽ tự dọn sau (T13) | chủ |

Các chính sách giữ nguyên từ tài liệu cũ:

- không có nội dung về đối thủ;
- không dùng `AggregateRating` khi chưa có đánh giá xác minh được;
- không dùng `llms.txt` hay file riêng cho AI;
- không trang tạm nào được index;
- muốn đổi URL thì phải có redirect trước (`docs/cms/url-rename-runbook.md`).

### Chờ chủ quyết

1. Có gộp 3 hồ sơ Maps ở Thủ Đức thành 1 không, và giữ ở sân nào? Đề xuất: gộp, giữ ở sân có nhiều lớp nhất.
   Chủ sẽ làm sau. (T13)
2. Số điện thoại chính cho các hồ sơ Maps. Đề xuất: dùng 0907 911 886 làm số chính ở mọi nơi, vì số này trùng
   với web, với Zalo và với dữ liệu cấu trúc. 0982 093 947 để làm số phụ trong hồ sơ. Lý do ghi ở T13.
3. Có mở danh bạ sân với 4 sân V2 đang dạy không? Spec cũ đặt mức 5 sân và tính cả sân V2 không dạy. Đề xuất: mở với 4 sân. (T19)

## 5. Chiến lược — năm hướng, theo thứ tự ưu tiên

### 5.1 Google Maps đúng quy định và có đánh giá thật — T13, T14, T15

- **Vì sao đứng đầu:** khi người ta tìm thứ ở gần mình, khối Google Maps thường nằm trên kết quả web. Google
  xếp hạng khối này dựa vào độ liên quan, khoảng cách và độ nổi bật. Số lượng và điểm đánh giá là phần quan
  trọng của độ nổi bật.
- **Sửa hồ sơ trước, xin đánh giá sau.**
  - Google không cho lập hồ sơ cho lớp học định kỳ ở địa điểm mình không sở hữu hoặc không có quyền đại diện
    ([nguồn](https://support.google.com/business/answer/13763036)).
  - Tên hồ sơ phải là tên thật, không được thêm địa danh hay tên doanh nghiệp khác
    ([nguồn](https://support.google.com/business/answer/3038177)).
  - Hồ sơ bị khóa thì mất luôn đánh giá. Vì vậy nên sửa ngay bây giờ, khi còn chưa có đánh giá nào để mất.
- **Cách giảm rủi ro:**
  - chỉ giữ 2 hồ sơ: một ở Bình Thạnh, một ở Thủ Đức;
  - đặt tên đúng "V2 Badminton";
  - chủ sân đồng ý bằng tin nhắn;
  - treo banner V2 cố định ở sân;
  - giờ mở cửa ghi đúng giờ lớp thật.

  Làm vậy vẫn chưa an toàn tuyệt đối, nhưng khác hẳn tình trạng hiện nay.
- **Xin đánh giá:** HLV hỏi trực tiếp vào cuối buổi, kèm thẻ QR quét là mở thẳng khung viết đánh giá. Không tặng
  quà để đổi đánh giá, không soạn sẵn nội dung cho học viên.

### 5.2 Tận dụng quan hệ với chủ sân — T18, T19

Đây là lợi thế đối thủ không có: V2 dạy ở sân của người khác và quen với chủ sân.

- **Poster có mã QR ở từng sân:** lần đầu tiên đo được số khách đến vì gặp V2 ở sân.
- **Chủ sân nhắc tên lớp V2 và gắn link trên fanpage của sân:** V2 có link thật từ một trang liên quan.
- **Danh bạ sân `/san-cau-long/` cho 4 sân đối tác:** đón người tìm tên sân. Chủ sân cũng có lý do để chia sẻ
  trang về sân của mình.

### 5.3 Có tên ở nơi người tìm lớp đang đọc — T20

Đó là các bài "Top lớp cầu lông" của shop vợt, các trang danh bạ (Eduoka có mục "Đăng ký dạy") và các nhóm
Facebook. Cách làm không tốn tiền: gửi thông tin chính xác để họ đưa V2 vào lần cập nhật bài tới, và trả lời
thật lòng khi có người hỏi trong nhóm. Việc này có ích cho cả Google lẫn các trợ lý AI.

### 5.4 Website — T17, T23

- Hai trang quận nhắm đúng cách người ta gõ tìm ("học cầu lông Thủ Đức", "học cầu lông Bình Thạnh"). Tên sân để
  cho danh bạ sân lo. Các trang khác trỏ link về hai trang này, và dùng ảnh lớp thật.
- Giữ nguyên hướng đang tốt của trang 1 kèm 1.
- Không mở thêm trang dịch vụ. Sau mốc 90 ngày thì rà lại danh sách trang theo quy tắc ở mục 6.

### 5.5 Đo cho đúng — T16, T22

Cần biết khách đến từ đâu:

- hỏi thêm một câu trong form;
- gắn mã UTM cho link trên Maps và trên poster, để GA4 phân biệt được nguồn;
- tính lượt bấm Zalo là chuyển đổi.

Xem lại kết quả ở các mốc 30, 60 và 90 ngày.

### Tạm chưa làm

- Viết thêm bài kỹ thuật.
- Mở thêm trang dịch vụ hay hồ sơ Maps.
- Tối ưu tốc độ thêm.
- Làm các mảng thiết bị, công cụ, hay đăng tin tức hàng loạt.
- Mua đánh giá, hoặc tặng quà để đổi lấy đánh giá.

## 6. Danh sách trang dịch vụ

Số liệu Search Console từ 25/8 đến 21/9; trạng thái index kiểm ngày 2026-09-23.

| Trang | Hiển thị | Click | Vị trí TB | Index | Hướng |
|---|---:|---:|---:|---|---|
| `/hoc-cau-long-1-kem-1/` | 161 | 9 | 6,5 | có | Giữ nguyên hướng đang tốt |
| `/lop-cau-long-binh-thanh/` | 320 | 0 | 8,6 | có | T17 |
| `/lop-cau-long-thu-duc/` | 279 | 0 | 9,5 | có | T17 |
| `/hoc-cau-long-cho-nguoi-moi/` | 21 | 1 | 14,5 | có | Theo dõi |
| `/cau-long-doanh-nghiep/` | 11 | 1 | 5,2 | có | Xét chung với team building (T23) |
| `/lop-cau-long-tre-em/` | 6 | 1 | 8,7 | có | Theo dõi |
| `/lop-cau-long-cho-nguoi-di-lam/` | 6 | 0 | 16,3 | có | Xét chung với buổi tối và cuối tuần (T23) |
| `/gia-hoc-cau-long-tphcm/` | 3 | 0 | 3,3 | có | Giữ: Google gần như không hiện trang này, nhưng ChatGPT đã gửi 8 lượt truy cập tới đây kể từ tháng 6 |
| `/lop-he-cau-long-tphcm/` | 3 | 0 | 4,3 | có | Lớp hè đã đóng, chờ mùa 2027 (chủ, 2026-09-23) |
| `/team-building-cau-long/` | 3 | 0 | 1,3 | có | T23 |
| `/lop-cau-long-cuoi-tuan/` | 0 | 0 | — | có | T23 |
| `/lop-cau-long-buoi-toi/` | 0 | 0 | — | **chưa** (Google đã thu thập nhưng chưa index; ghé lần cuối 2026-05-12) | Yêu cầu Google index (T16), rồi xét ở T23 |

Trang chủ có 207 lượt hiển thị và 7 click, cộng thêm 27 lượt hiển thị cho bản `http://`, bản này đang được
Google gộp dần về bản https. Trong 8 form gửi từ 24/6 đến 22/9, có 6 form bắt đầu từ trang chủ.

**Quy tắc gộp trang** (áp dụng ở T23, có thể chỉnh khi có thêm số liệu). Một trang dịch vụ là ứng viên để gộp
khi thỏa cả bốn điều kiện:

- đã được index ít nhất 90 ngày;
- có dưới 30 lượt hiển thị mỗi 28 ngày;
- không mang về form nào trong GA4;
- trùng mục đích với một trang mạnh hơn.

Gộp nghĩa là chuyển phần nội dung riêng sang trang được giữ lại, rồi đặt redirect 308 theo
`docs/cms/url-rename-runbook.md`. Trang lớp hè không đưa ra xét cho tới khi chủ quyết về mùa 2027.

## 7. Đo lường

| Chỉ số | Gốc | Mục tiêu ở mốc 90 ngày (khoảng 2026-12-23) | Lấy ở đâu |
|---|---|---|---|
| Số đánh giá trên các hồ sơ Maps được giữ lại | 0 | 25–30 | Google Maps |
| Vị trí "học cầu lông thủ đức" | khoảng 11 | từ 10 trở lên (trang 1) | Search Console |
| Vị trí "học cầu lông bình thạnh" | khoảng 40 | từ 20 trở lên | Search Console |
| Click từ người tìm tên sân | 0 click / 366 lượt hiển thị | có click, sau khi mở danh bạ sân | Search Console |
| Click từ Google mỗi 28 ngày | 19 | cao hơn 30 (mức của kỳ 28/7–24/8) | Search Console |
| Khách đến từ Maps (UTM `gbp-…`) | chưa đo được | có số liệu | GA4 |
| Khách đến từ poster ở sân (UTM `poster`) | chưa đo được | có số liệu | GA4 |
| Form gửi, bấm Zalo và gọi mỗi tháng | form 2–3; Zalo và gọi 4–8 | tăng, và biết được nguồn nhờ câu hỏi trong form | GA4 và form |
| Trang bên ngoài có tên V2 kèm link | 0 | ít nhất 3 | theo dõi tay (mục 10) |
| Fanpage hoặc web của chủ sân có link V2 | 0 | ít nhất 2 | theo dõi tay (mục 10) |

**Các mốc xem lại:** khoảng 2026-10-24, 2026-11-23 và 2026-12-23 (T22). Mỗi mốc lấy đúng một cửa sổ 28 ngày,
lùi lại 2 ngày vì Search Console có độ trễ. Ghi kết quả vào mục 10.

**Truy vấn cần theo dõi trên Google, ChatGPT và Perplexity:**

- "học cầu lông thủ đức"
- "học cầu lông bình thạnh"
- "học cầu lông 1 kèm 1 tphcm"
- "giá học cầu lông tphcm"
- "lớp cầu lông cho người mới tphcm"
- "lớp cầu lông buổi tối tphcm"
- "học cầu lông ở đâu tphcm"
- "sân cầu lông phúc lộc"
- "sân green nguyễn xí"

## 8. Rủi ro

- **Hồ sơ Maps bị khóa** vì vi phạm quy định về địa điểm, kéo theo mất đánh giá. Đó là lý do T13 phải làm trước T15.
- **Đánh giá giả hoặc đổi quà lấy đánh giá:** Google sẽ gỡ các đánh giá đó và có thể phạt hồ sơ.
- **Các trang dịch vụ na ná nhau:** Google có thể coi chúng là trang lập ra chỉ để bắt từ khóa. Trang buổi tối
  chưa được index là dấu hiệu sớm.
- **Đổi tiêu đề hai trang quận** có thể làm giảm lượt hiển thị khi người ta tìm tên sân. Điều này chấp nhận
  được, vì các lượt đó chưa từng mang lại click nào, và danh bạ sân sẽ đón lại nhóm người tìm này.
- **Số liệu còn nhỏ:** một kỳ 28 ngày có thể dao động mạnh, nên không kết luận chỉ từ một kỳ.

## 9. Tài liệu cũ

Đọc như lịch sử. Mỗi file có nhãn trạng thái ở đầu (#148):

- `docs/seo-aeo-30-day-unified-plan.md` — đã thực hiện (#42–#45). Các quy tắc thực thi ở §2 vẫn đúng.
- `docs/seo-30-day-execution-plan.md`, `docs/aeo-30-day-additions.md` — đã bị thay thế.
- `docs/blog-route-taxonomy-decision-memo.md` — bị thay thế một phần; nhãn đầu file ghi rõ mục nào còn hiệu lực.
- `docs/blog-content-platform-addendum-2026-07-09.md` — đang hiệu lực.
- `docs/cms-migration-handoff-brief.md` — đã bị thay thế.
- `docs/strategic-review-2026-07-06.md`, `docs/architecture-review-2026-07-06.md` — phân tích tại thời điểm viết.
- `docs/sanity-content/` — bản nháp gốc tháng 5; không nạp lại vào Sanity.
- `.claude/CMS/` — spec CMS, chỉ có trên máy của chủ. Spec danh bạ sân sẽ được đưa vào repo ở T19.

## 10. Nhật ký kết quả

Mỗi mốc của T22, và mỗi kết quả từ bên ngoài (bài "Top", fanpage chủ sân, trang danh bạ), đều ghi vào đây.

| Ngày | Việc | Kết quả |
|---|---|---|
| 2026-09-24 | Lập số liệu gốc (mục 2) | — |
