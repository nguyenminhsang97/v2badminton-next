---
name: noi-dung-vi
description: Quy tắc viết nội dung tiếng Việt cho v2badminton.com — bảng thuật ngữ cầu lông chuẩn do HLV xác nhận, cấm bịa dữ kiện kinh doanh, tác giả và review trung thực (E-E-A-T), cấu trúc trả lời trước cho SEO/AEO, và giới hạn từng trường trong Sanity Studio. Dùng skill này mỗi khi viết hoặc sửa chữ tiếng Việt mà người đọc sẽ thấy — bài kỹ thuật, money page, FAQ, tiêu đề và mô tả SEO, quick answer, nhãn nút, alt ảnh, slug, nhãn trong code hoặc Studio — kể cả khi người dùng chỉ nói "viết bài", "sửa đoạn giới thiệu", "thêm câu hỏi thường gặp", "dịch sang tiếng Việt", hoặc đưa một đoạn tiếng Anh về kỹ thuật cầu lông. Use for any Vietnamese-language copy on the V2 Badminton site.
---

# Nội dung tiếng Việt — V2 Badminton

Người đọc là phụ huynh, người đi làm và người mới chơi ở TP.HCM đang cân nhắc có đăng ký học hay không. Họ tin nội dung vì nó đến từ HLV. Ba thứ làm mất niềm tin nhanh nhất:

- thuật ngữ nghe "không phải dân cầu lông";
- con số sai;
- danh nghĩa chuyên môn không có thật.

Skill này chặn cả ba.

HLV Nguyễn Minh Sang (chủ repo) quyết định về chuyên môn và dữ kiện kinh doanh. Cách diễn đạt, bố cục, SEO thì tự quyết và làm luôn.

## 1. Thuật ngữ chuẩn

Bảng dưới do HLV Sang xác nhận. Dùng ở mọi nơi: bài viết, money page, FAQ, nhãn giao diện, slug, nhãn Studio, và khi trao đổi với chủ repo.

### Di chuyển

| Tiếng Anh | Tiếng Việt chuẩn |
|---|---|
| Split step | Tách chân / Tách nhịp |
| Lunge | Bước rướn |

### Cầm vợt

| Tiếng Anh | Tiếng Việt chuẩn |
|---|---|
| Basic grip / V grip | Cầm vợt thuận tay |
| Thumb grip | Cầm vợt ngón cái |
| Panhandle grip / Hammer grip | Cầm vợt cán búa |

### Cú đánh

| Tiếng Anh | Tiếng Việt chuẩn |
|---|---|
| Clear | Phông cầu |
| Smash | Đập cầu |
| Dropshot | Bỏ nhỏ |
| Net shot | Kê cầu |
| Net kill | Chụp lưới |
| Net lift | Bung cầu |
| Drive | Tạt cầu |
| Flick serve | Giao cầu bắn |
| Low serve | Giao cầu thấp |
| Block | Chặn cầu |
| Spin net shot | Sủi cầu |
| Slice | Cắt cầu |

### Vị trí sân và tay

| Tiếng Anh | Tiếng Việt chuẩn |
|---|---|
| Forehand | Thuận tay |
| Backhand | Trái tay |
| Forecourt | Dàn lưới |
| Midcourt | Giữa sân |
| Rearcourt | Cuối sân |

**Không dùng** các từ tự dịch như "lốp cầu", "giết lưới", "bốc lưới", vì cộng đồng cầu lông Việt Nam không nói vậy. Gặp kỹ thuật không có trong bảng thì hỏi HLV Sang; đừng tự đặt tên.

**Tiếng Anh đi kèm.** Thuật ngữ Việt luôn là chữ chính. Tên tiếng Anh chỉ xuất hiện:

- trong ngoặc ở lần nhắc đầu, khi nó giúp người đọc hoặc tìm kiếm — "Đập cầu (smash)";
- trong slug, khi người tìm hay gõ từ đó — như `ky-thuat-dap-cau-smash`.

Không để tiếng Anh đứng thay thuật ngữ Việt trong câu. Chữ hiển thị của link cũng vậy: viết "kỹ thuật đập cầu", không viết "kỹ thuật đập cầu smash" — chỉ đường dẫn của link được giữ nguyên slug.

Soát trước khi bàn giao (chạy từ gốc repo):

```bash
node skills/noi-dung-vi/scripts/check-terms.mjs <tệp>
```

Hoặc truyền đoạn văn qua stdin. Tệp JSON (bản xuất Sanity, Portable Text như `docs/sanity-content/*.json`) được soát theo từng chuỗi nội dung. Script bỏ qua khóa cấu trúc như `_type`, `style`, `slug`, và báo vị trí theo đường dẫn trường, ví dụ `moneyPage.body[3].children[0].text`.

Kết quả có hai mức:

- **LỖI** (mã thoát 1): từ tự dịch không chuẩn.
- **CẢNH BÁO**: thuật ngữ tiếng Anh đứng một mình. Sửa hết cảnh báo trong phần người đọc thấy (thân bài, FAQ, tiêu đề, chữ của link). Chỉ bỏ qua khi từ đó mang nghĩa thường, không phải tên kỹ thuật — "block", "drive", "clear" đôi khi là vậy.

## 2. Không bịa dữ kiện

Không bao giờ tự nghĩ ra: học phí, lịch học, địa chỉ sân, sĩ số lớp, tên HLV, chứng chỉ, số năm kinh nghiệm, số học viên, số người theo dõi, đánh giá hay số sao, cam kết kết quả.

| Dữ kiện | Lấy từ |
|---|---|
| Học phí, hình thức tính phí | Sanity `pricing_tier` |
| Lịch học, trình độ | Sanity `schedule_block` |
| Sân, quận, địa chỉ | Sanity `location` |
| HLV, vai trò, chứng chỉ | Sanity `coach` (chỉ HLV có `isActive`) |
| Điện thoại, Zalo, Facebook | Sanity `site_settings`; giá trị mặc định ở `apps/web/src/lib/site.ts` |
| Chính sách đã công bố (học phí gồm gì, sân trong nhà, đặt chỗ, đổi lịch) | FAQ đã publish trong Sanity và trang `/gia-hoc-cau-long-tphcm/` đang chạy |
| Lịch sử học viện, đội ngũ biên soạn | Trang `/gioi-thieu/` và `/chinh-sach-bien-tap/` đang chạy |

- Đọc Sanity phải kèm token. Đọc ẩn danh chỉ trả về **một phần** dữ liệu mà không báo lỗi (xem `sanity-cms`).
- **Buổi học nhóm: ra ngoài chỉ nói buổi chuẩn 120 phút.** Quyết định của chủ ngày 2026-09-17: buổi nhóm chuẩn dài 120 phút — 15-20 phút khởi động, phần giữa là tập, 15 phút cuối học viên đánh tự do với nhau. Trong `schedule_block` vẫn còn bốn khung 90 và 60 phút: đó là lớp custom có thật, **lịch không sai**, nhưng nội dung cho người đọc và dữ liệu cấu trúc **không liệt kê thời lượng của chúng** và không dùng chữ "custom". Giờ của các khung đó thì cứ nêu bình thường.
- Thiếu dữ kiện thì để chỗ trống ghi rõ `[CẦN HLV XÁC NHẬN: …]` và nêu ra khi bàn giao. Không điền một con số "nghe hợp lý".
- **Hai nguồn mâu thuẫn thì không tự chọn, kể cả khi cả hai đều đã publish.** Mâu thuẫn kiểu này có thật trong dữ liệu: bảng giá và FAQ nói khác nhau về việc ai lo sân, một trang ghi hai sĩ số lớp khác nhau, hai FAQ ghi hai thời lượng buổi học. Khi gặp:
  - chỉ viết phần mà các nguồn khớp nhau;
  - không lặp lại vế nào đang bị nguồn khác phủ nhận;
  - nêu rõ mâu thuẫn (nguồn nào nói gì) trong phần bàn giao để chủ repo chốt.
- **Đừng trông vào việc tự nhận ra mâu thuẫn — chạy script.** Đọc từng tài liệu thì mâu thuẫn không lộ ra: mỗi nguồn đều trông hợp lý khi đứng một mình. Lần đo trước, bản viết có đọc quy tắc trên vẫn chọn một vế, vì không thấy vế kia. Xem mục "Kiểm mâu thuẫn" ngay dưới.

### Kiểm mâu thuẫn: `check-facts.mjs`

```bash
node skills/noi-dung-vi/scripts/check-facts.mjs                  # mọi chủ đề
node skills/noi-dung-vi/scripts/check-facts.mjs si-so thoi-luong # chỉ vài chủ đề
```

Script đọc **mọi tài liệu đã publish** trên Sanity, quét **mọi trường chữ** (cả Portable Text lẫn `description`, `features`, `quickAnswer`… — mâu thuẫn hay nằm ở chỗ ít ai đọc), rồi đặt mọi câu nói về cùng một dữ kiện cạnh nhau:

| Chủ đề | Kiểm gì |
|---|---|
| `hoc-phi` | Câu "từ X" / "rẻ nhất" có khớp gói tháng rẻ nhất trong `pricing_tier` không; `displayPrice` có khớp giá lưu dạng số không; số tiền trong câu về học phí mà không khớp gói nào (ví dụ phí học thử) |
| `si-so` | Sĩ số lớp nhóm ở mọi nơi |
| `thoi-luong` | Thời lượng buổi học nhóm (không tính 1 kèm 1 và team building) |
| `san-1-kem-1` | Ai đặt sân, và tiền sân đã gồm trong học phí chưa, với 1 kèm 1 |

- **MÂU THUẪN** (mã thoát 1): làm đúng như quy tắc trên. Không viết vế nào như sự thật; ghi `[CẦN HLV XÁC NHẬN: …]`; chép danh sách nguồn mà script in ra vào phần bàn giao.
- **CẦN XEM**: không hẳn sai, nhưng phải biết con số đó đến từ đâu trước khi dùng lại.
- Script chỉ gửi GET. Cần `SANITY_API_READ_TOKEN` (biến môi trường, hoặc `.env.local` ở gốc repo — script tự dò lên các thư mục cha). Không có token thì nó từ chối chạy (mã thoát 2) thay vì đọc ẩn danh ra kết quả thiếu. Khi đó: `--print-query` in truy vấn, chạy bằng Sanity MCP, lưu mảng kết quả ra file, rồi chạy lại với `--input <file>`.
- Script dò bằng mẫu câu, nên chỉ phủ bốn chủ đề trên. Dữ kiện khác (lịch, địa chỉ, HLV) vẫn phải tự đối chiếu các nguồn trong bảng ở đầu mục này.
- Một dữ kiện có thể nằm ở nhiều chỗ. Mỗi gói học phí lưu giá hai lần (`displayPrice` dạng chữ, `pricePerMonth`/`pricePerHour` dạng số), và một số câu trả lời FAQ ghi lại giá bằng chữ. Khi viết về thay đổi giá, liệt kê mọi chỗ cần sửa theo.
- Cách viết số tiền, khung giờ: theo đúng định dạng đang dùng trên site (xem bảng giá ở `/gia-hoc-cau-long-tphcm/`), không tự đặt định dạng mới.

## 3. Tác giả và review: chỉ ghi điều có thật

Bài viết (`content_article`) có các trường tác giả trong Studio:

- **`authorKind`** mặc định `organization`, hiển thị "Đội ngũ V2 Badminton". Giữ nguyên, trừ khi một HLV cụ thể thực sự viết bài và đồng ý đứng tên.
- **`authorCoach`**: chỉ chọn HLV có hồ sơ `coach` thật và đang hoạt động.
- **`reviewer` + `lastReviewed`**: chỉ điền khi một HLV đã thực sự đọc và duyệt chuyên môn bài đó, vào đúng ngày đó. Không điền cho đẹp; không mặc định ngày hôm nay.

Để trống một cách trung thực tốt hơn điền giả. Trang `/chinh-sach-bien-tap/` đã cam kết công khai: bài không có dòng "Review chuyên môn" là nội dung biên soạn chung, không phải xác nhận của cá nhân HLV.

Nội dung kỹ thuật dựa trên giáo trình huấn luyện BWF (Level 1–3) và kinh nghiệm dạy thực tế của học viện. Mô tả đúng cơ chế động tác và lỗi thường gặp. Không đưa lời khuyên y tế hay điều trị chấn thương vượt quá vai trò HLV.

## 4. Cấu trúc: trả lời trước

Người đọc và công cụ AI cần câu trả lời ngay ở đoạn đầu.

- **Đoạn mở đầu** trả lời thẳng: trang nói về gì, dành cho ai, ở đâu, và (với money page) giá bao nhiêu.
- **H2 là câu hỏi** người đọc thật sự gõ: "Học 1 kèm 1 phù hợp với ai?" thay vì "Đối tượng phù hợp".
- **Mỗi phần có dữ kiện cụ thể**: tên sân, quận, số tiền, khung giờ.
- **Money page**:
  - độ dài theo các trang cùng loại đang chạy (thân bài hiện khoảng 120–290 từ). Viết đủ ý để trả lời, không độn cho dài;
  - nhắm 5 FAQ bật `includeInSchema`, như phần lớn money page đang có. Xem `relatedFaqs` hiện tại trước: có trang đang gắn ít hơn, có trang mượn FAQ của trang khác;
  - thêm khối so sánh khi người đọc đang phải chọn (học nhóm hay 1 kèm 1, các hình thức học phí).
- **Bài kỹ thuật**: chọn `contentFormat` theo cách trình bày bài.
  - `guide`: hướng dẫn tổng quát.
  - `how_to`: các bước có thứ tự.
  - `explainer`: giải thích một khái niệm.

  Trường này ảnh hưởng cách trình bày trên trang. JSON-LD hiện luôn là Article cho mọi định dạng, nên đừng hứa `how_to` sẽ ra rich result HowTo.
- Gắn **`relatedMoneyPage`** khi có lớp học liên quan, để bài kỹ thuật dẫn người đọc về trang đăng ký.

Mẫu cấu trúc tham khảo: `docs/sanity-content/*.json` (9 money page). Chỉ học bố cục; không dùng lại con số trong đó, vì có thể đã cũ.

## 5. Giới hạn từng trường

| Trường | Quy tắc |
|---|---|
| `h1` (money page), `title` (bài viết) | Duy nhất trên toàn site, chứa từ khóa chính |
| `seoTitle` (bài viết, hub, nhánh, sân) | Khoảng 60 ký tự. **Không** thêm "\| V2 Badminton" hay "— V2 Badminton": layout tự gắn thương hiệu |
| `metaTitle` (money page) | Khoảng 60 ký tự **tính cả** đuôi "\| V2 Badminton". Money page dùng `title.absolute`, layout không tự gắn, nên tự viết đuôi như các money page đang chạy |
| `metaDescription`, `seoDescription` | Tối đa 160 ký tự (Studio chặn khi vượt). Một câu trả lời cộng lý do để bấm vào |
| `quickAnswer` | 40–70 từ, bắt đầu bằng chủ thể ("Phông cầu là…"). Studio đếm số từ |
| `excerpt` | 1–2 câu, dùng cho danh sách bài và khi chia sẻ mạng xã hội |
| `slug` | Studio tự tạo (bỏ dấu, `đ` → `d`, chữ thường, gạch nối). Ngắn, có từ khóa. Không đổi sau khi đã đăng (xem `seo`) |
| `ctaLabel` | Ngắn, là một hành động: "Đăng ký học thử", "Nhận báo giá" |
| Alt ảnh | Bắt buộc. Mô tả nội dung ảnh trong ngữ cảnh bài, không lặp lại H1 |
| Chú thích ảnh | Tối đa 140 ký tự |
| Kích thước ảnh | Ảnh trong bài rộng từ 1440px, dưới 800 KB. Ảnh đầu money page 1200×630 |
| FAQ | Câu hỏi viết như người thật hỏi; câu trả lời mở bằng ý trả lời; chọn đúng `pages` |

## 6. Giọng văn

- Gọi người đọc là **"bạn"**. Học viện xưng **"V2 Badminton"** hoặc **"chúng tôi"**.
- Câu ngắn, rõ, như HLV giải thích ngoài sân. Mỗi đoạn một ý.
- Không phóng đại. Tránh "tốt nhất", "số 1", "giỏi sau X buổi", "cam kết 100%". Thay bằng dữ kiện kiểm chứng được: năm thành lập, chứng chỉ BWF có thật, lịch học cụ thể.

## 7. Quy trình

1. Xác định loại trang (money page, bài kỹ thuật, FAQ, trang tĩnh) và câu hỏi chính người đọc mang tới.
2. Thu thập dữ kiện thật (mục 2), ghi lại chỗ còn thiếu.
3. **Nếu văn bản sẽ nhắc tới học phí, sĩ số, thời lượng buổi học hay chuyện ai lo sân: chạy `check-facts.mjs` trước khi viết câu nào** (mục 2). Chủ đề nào báo MÂU THUẪN thì dữ kiện đó chưa được viết như sự thật.
4. Viết theo cấu trúc trả lời trước (mục 4), đúng thuật ngữ (mục 1).
5. Chạy `check-terms.mjs`: sửa hết LỖI và mọi CẢNH BÁO trong phần người đọc thấy.
6. Điền các trường theo giới hạn (mục 5), với tác giả và review trung thực (mục 3).
7. Nếu đưa lên Sanity: tạo hoặc sửa **bản nháp**, không publish. Mọi thao tác ghi cần chủ repo đồng ý trước (xem `sanity-cms`). Chủ repo xem bằng "Xem bản nháp" rồi tự publish.
8. Khi bàn giao: liệt kê mọi chỗ `[CẦN HLV XÁC NHẬN]` và mọi mâu thuẫn dữ kiện, kèm nguồn mà `check-facts.mjs` đã in ra.
