# V2 Badminton — MASTERPLAN v2

> Single source of truth cho roadmap website, SEO, replatform, và tăng lead của V2 Badminton.
> Cập nhật lần cuối: 2026-04-06.

---

## 1. Mục tiêu kinh doanh

V2 Badminton là dịch vụ dạy cầu lông offline tại TP.HCM, trọng tâm ở:

- Bình Thạnh
- Thủ Đức
- Người mới bắt đầu
- Người đi làm / dân văn phòng
- Doanh nghiệp cần team building

Mục tiêu của website không phải là kéo traffic cho đẹp. Mục tiêu là:

1. Tăng lead đủ điều kiện từ Việt Nam, đặc biệt TP.HCM.
2. Tăng lead từ Google Search + Google Maps + branded search.
3. Giữ conversion flow ngắn, rõ, phản hồi nhanh.
4. Xây nền content và technical SEO đủ mạnh để scale thêm service pages sau này.

---

## 2. North Star Metrics

Các KPI chính của dự án:

- `generate_lead` từ organic search
- `generate_lead` từ Google Maps / branded search
- lead rate theo từng landing page
- tỷ lệ `form_start -> generate_lead`
- tỷ lệ lead -> học thử
- tỷ lệ học thử -> trả phí
- thời gian phản hồi lead đầu tiên
- số review thật trên Google Business Profile
- top 3 cho 8-12 query local/commercial chính

Không dùng vanity metrics làm KPI chính:

- pageviews tổng
- sessions tổng
- keyword volume lớn nhưng intent thấp
- social reach không gắn với lead

### 2.1 Operating cadence

Tần suất review tối thiểu:

- **Hàng ngày**
  - kiểm tra lead mới có vào không
  - kiểm tra notify có chạy không
  - kiểm tra form có lỗi rõ ràng không
- **Hàng tuần**
  - review GA4 theo page / source / device
  - review GSC query / CTR / indexing
  - review CWV / performance regressions
  - review GBP actions / review mới
- **Hàng tháng**
  - review backlog kỹ thuật
  - review content gaps
  - review CRO hypotheses và quyết định test tiếp theo

### 2.2 Baseline trước mọi thay đổi lớn

Trước khi thay đổi lớn về:

- replatform
- đổi form
- đổi CTA
- đổi structure nội dung

phải chụp baseline tối thiểu:

- organic sessions
- `generate_lead`
- lead rate theo page
- top queries trong GSC
- CTR / average position
- CWV mobile
- tỷ lệ `form_start -> generate_lead`

### 2.3 Observability & hardening minimum

Website phải có tối thiểu:

- uptime monitoring
- error monitoring cho form / client / API lead
- alert channel cho lead errors và downtime
- backup/rollback strategy
- security headers cơ bản

Không được để:

- file backup public
- secrets hardcode trong repo production
- error lead im lặng không có cảnh báo

### 2.4 Experimentation rules

Mỗi test CRO phải có:

- giả thuyết rõ
- primary metric
- guardrail metrics
- điều kiện rollout / rollback

Không chạy A/B test cảm tính.

Nếu dùng heatmap / session replay:

- phải mask PII
- không ghi thô tên / số điện thoại / ghi chú form

---

## 3. Trạng thái hiện tại

### 3.1 Website live

Các URL public hiện tại:

- `https://v2badminton.com/`
- `https://v2badminton.com/hoc-cau-long-cho-nguoi-moi/`
- `https://v2badminton.com/lop-cau-long-binh-thanh/`
- `https://v2badminton.com/lop-cau-long-thu-duc/`

### 3.2 Stack hiện tại

- Static HTML/CSS/JS
- Cloudflare Pages
- Web3Forms
- Cloudflare DNS
- GTM
- GA4
- Meta Pixel

### 3.3 Tracking hiện tại

Website đang push các event sau qua `dataLayer`:

- `cta_click`
- `contact_click`
- `map_click`
- `form_start`
- `generate_lead`
- `form_error`

### 3.4 Conversion flow mạnh nhất hiện tại

Flow quan trọng nhất đang có sẵn trên homepage:

`User click schedule card -> auto prefill sân + khung giờ + message vào form -> scroll xuống form -> focus field trống`

Đây là conversion feature quan trọng. Khi replatform sang Next.js, **phải giữ nguyên behavior này**.

---

## 4. Strategic Principles

### 4.1 Local commercial intent trước vanity traffic

Ưu tiên query có khả năng mang lead:

- `lớp cầu lông bình thạnh`
- `lớp cầu lông thủ đức`
- `học cầu lông cho người mới`
- `học cầu lông 1 kèm 1`
- `lớp cầu lông buổi tối`
- `lớp cầu lông cuối tuần`
- `giá học cầu lông tphcm`
- `team building cầu lông`

Không ưu tiên sớm các chủ đề kiểu:

- review vợt
- review quần áo
- content tiêu dùng thuần

trừ khi gắn rất rõ với intent người mới chuẩn bị đi học.

### 4.2 Maps / GBP trước blog

Với local service business ở Việt Nam, Google Maps / Local Pack có thể mang lead nhanh hơn organic website.

Vì vậy:

- Google Business Profile là **Phase 0**
- review thật là asset SEO quan trọng
- ảnh thật và phản hồi review phải chạy song song với mọi phase khác

### 4.3 Giữ URL, đổi hạ tầng sau

Khi replatform:

- giữ nguyên slug hiện tại
- giữ nguyên canonical
- giữ nguyên intent từng page
- không đổi structure vì lý do “clean code” đơn thuần

### 4.4 Không tạo thin content

Chưa tạo page riêng cho từng sân như:

- `san-green`
- `san-hue-thien`
- `san-khang-sport`
- `san-phuc-loc`

trừ khi có đủ content riêng:

- ảnh thật
- review thật theo sân
- facility details
- parking / access
- lịch / proof / mô tả đủ sâu

Nếu chưa đủ, chi tiết sân sẽ nằm trong các trang local hiện có.

### 4.5 Mobile-first tuyệt đối

Phần lớn traffic Việt Nam là mobile. Mọi quyết định UX/SEO phải ưu tiên mobile trước.

Performance budget:

- LCP `< 2.5s`, mục tiêu tốt hơn là `< 2.0s`
- CLS `< 0.1`
- INP `< 200ms`
- tổng page weight gọn
- ảnh dùng WebP/AVIF
- lazy loading + responsive sizes

---

## 5. Tracking & Analytics Contract

### 5.1 Event names cố định

Chỉ dùng các event sau:

- `cta_click`
- `contact_click`
- `map_click`
- `form_start`
- `generate_lead`
- `form_error`
- `form_field_focus` (planned)
- `form_abandon` (planned)
- `time_to_submit` (planned)

### 5.2 Naming convention cho params

`cta_name` và `cta_location` phải dùng **snake_case**, không dùng free-form text.

### 5.3 Allowed values hiện tại

#### `cta_name`

- `dang_ky_ngay`
- `dang_ky_hoc_thu`
- `xem_khoa_hoc`
- `nhan_bao_gia`
- `nhan_zalo_tu_van`

Nếu thêm CTA mới:

- chỉ dùng động từ + ngữ cảnh, snake_case
- không dùng biến thể mơ hồ như `hero_primary`, `btn1`, `seo-footer`

#### `cta_location`

- `nav`
- `hero`
- `business`
- `seo_cta_block`

Nếu thêm vị trí mới:

- dùng location logic, không dùng visual-only labels
- ví dụ chấp nhận: `pricing`, `footer`, `location_cards`
- ví dụ không chấp nhận: `green_button`, `section3`

### 5.4 Form analytics roadmap

Sau replatform sẽ thêm:

- `form_field_focus`
- `form_abandon`
- `time_to_submit`

Mục tiêu:

- đo số người bắt đầu nhưng không gửi form
- đo rơi ở field nào
- đo mất bao lâu từ lúc bắt đầu đến lúc gửi form
- biết có nên chuyển multi-step form hay không

---

## 6. Recommended Replatform Direction

### 6.1 Khuyến nghị chính

Đối với V2 hiện tại, ưu tiên:

- **Option A — Recommended:** Next.js trên **Vercel**
- **Option B — Acceptable:** Next.js static export trên **Cloudflare Pages**

### 6.2 Không khuyến nghị lúc này

Chưa ưu tiên:

- Cloudflare Workers + OpenNext

Lý do:

- use case hiện tại gần như toàn bộ là SSG
- complexity cao hơn lợi ích
- rủi ro edge case không cần thiết ở giai đoạn này

### 6.3 Nguyên tắc kỹ thuật khi lên Next.js

- Dùng App Router
- Ưu tiên SSG
- Chỉ dùng dynamic/server logic cho lead submission và cases thật sự cần thiết
- Không làm SSR tràn lan

---

## 7. Phase 0 — Google Business Profile & Trust Layer

> Bắt đầu ngay, không cần đợi Next.js.

### Mục tiêu

- tăng lead từ Maps
- tăng local relevance
- tăng trust

### Việc phải làm

- tối ưu Google Business Profile
- chuẩn hóa NAP trên mọi bề mặt
- thêm dịch vụ rõ ràng
- cập nhật giờ hoạt động
- thêm ảnh thật:
  - sân
  - lớp học
  - HLV
  - học viên
- xin review thật đều đặn
- phản hồi review thật, không spam template
- dùng landing page phù hợp cho profile

### Deliverables

- 20+ review thật đầu tiên
- bộ ảnh thật tối thiểu cho homepage và GBP
- service description rõ ràng

---

## 8. Phase 1 — Next.js Replatform (Safe Migration)

> Thời gian mục tiêu: 2-4 tuần.

### 8.1 Mục tiêu

- đổi hạ tầng nhưng không làm rơi SEO và conversion
- tạo nền để scale thêm pages nhanh hơn

### 8.2 Route map phải giữ nguyên

- `/`
- `/hoc-cau-long-cho-nguoi-moi`
- `/lop-cau-long-binh-thanh`
- `/lop-cau-long-thu-duc`

### 8.3 Kiến trúc app

Đề xuất:

- `app/page.tsx`
- `app/hoc-cau-long-cho-nguoi-moi/page.tsx`
- `app/lop-cau-long-binh-thanh/page.tsx`
- `app/lop-cau-long-thu-duc/page.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- `app/api/lead/route.ts`

Data layer:

- `lib/site.ts`
- `lib/locations.ts`
- `lib/pricing.ts`
- `lib/faqs.ts`
- `lib/schedule.ts`

Shared components:

- `JsonLd`
- `Section`
- `LocationCard`
- `ScheduleCard`
- `FAQSection`
- `CTAButton`
- `ContactForm`

### 8.4 Features không được phép mất

#### Preserve schedule -> form prefill

Phải giữ nguyên flow:

`click schedule card -> prefill sân + giờ + message -> scroll -> focus`

Đây là **migration acceptance criterion**, không phải chi tiết UI tùy chọn. Nếu bản Next.js không giữ đúng flow này thì xem như chưa đạt parity conversion với bản cũ.

#### Preserve corporate card behavior

Click card doanh nghiệp:

- clear prefill lịch
- set mode doanh nghiệp cho form
- scroll xuống form

#### Preserve current tracking semantics

Replatform không được đổi tùy tiện:

- event names
- param names
- current `cta_name`
- current `cta_location`

### 8.5 Form architecture mới

Không dùng JS-only submit thuần như hiện tại.

Yêu cầu:

- có `action="/api/lead"` hoặc Server Action
- có fallback nếu JS fail / load chậm
- notify ngay sau submit

Đây là **hard requirement** cho audience mobile-heavy tại Việt Nam, không phải optional enhancement.

Notify channel ngay từ ngày 1:

- Telegram là tối thiểu
- Zalo OA / internal ops flow là bước sau nếu phù hợp

### 8.6 Zalo UX

Khi replatform:

- mobile: giữ deep link `zalo.me`
- desktop: tránh deeplink gây confuse
  - ưu tiên số điện thoại + QR Zalo
  - hoặc fallback UI rõ ràng

Desktop/mobile handling của Zalo phải được test riêng trong preview QA trước khi cutover.

### 8.7 Internal link fix bắt buộc

Homepage location cards phải deep-link tới local pages phù hợp, không chỉ link Google Maps.

Mapping:

- Green -> `/lop-cau-long-binh-thanh`
- Huệ Thiên / Khang Sport / Phúc Lộc -> `/lop-cau-long-thu-duc`

Maps link vẫn giữ.

Đây là yêu cầu vừa cho UX vừa cho internal linking; mỗi court card phải có đường đi rõ tới local landing page liên quan.

### 8.8 Structured data roadmap

Ngoài schema hiện có, thêm:

- `Course` structured data cho khóa cơ bản / nâng cao / doanh nghiệp

Mục tiêu:

- tăng độ rõ ràng cho query kiểu “khóa học cầu lông”

### 8.9 Migration safety checklist

Trước khi cutover:

- snapshot baseline traffic và rankings
- benchmark current CWV
- export current sitemap/canonicals/schema

Sau deploy preview:

- verify canonical từng page
- verify title / description / OG
- verify JSON-LD
- verify sitemap / robots
- verify internal links
- verify form submit + notify
- verify form submit khi JS bị chậm hoặc tắt
- verify tracking events
- verify `schedule -> prefill -> scroll -> focus`
- verify deep link từ homepage court cards sang local pages
- verify Zalo behavior riêng cho mobile và desktop

Production cutover:

- www/non-www redirect chuẩn
- HTTP -> HTTPS
- trailing slash policy nhất quán
- submit sitemap trong GSC
- inspect URL trong GSC
- theo dõi coverage / indexing / performance

Rollback plan:

- nếu rankings tụt mạnh hoặc lead flow lỗi sau 7-14 ngày
- có thể rollback về bản static gần nhất trong cùng URL structure

---

## 9. Phase 2 — Money Pages Expansion

> Thời gian mục tiêu: 1-2 tháng sau Phase 1.

### Pages nên làm trước

- `/hoc-cau-long-1-kem-1`
- `/lop-cau-long-cuoi-tuan`
- `/lop-cau-long-buoi-toi`
- `/gia-hoc-cau-long-tphcm`
- `/team-building-cau-long`
- `/lop-cau-long-cho-dan-van-phong` (chỉ làm nếu đủ depth)

### Quy tắc

- mỗi page phải có intent riêng
- không cannibalize page hiện có
- không làm page “copy rồi đổi vài chữ”

### Template money page tối thiểu

- H1 rõ intent
- ai phù hợp
- lịch / format học
- học phí
- địa điểm
- proof
- FAQ
- CTA theo ngữ cảnh

---

## 10. Phase 3 — Trust & Media Layer

> Chạy song song với Phase 2.

Mục tiêu:

- tăng trust
- tăng time-on-page
- tăng branded search

### Bắt buộc

- review thật
- ảnh thật
- proof cụ thể:
  - lớp bao nhiêu người
  - phản hồi trong bao lâu
  - người mới thường đạt gì sau bao nhiêu buổi

### Video plan

Quay 2-3 video ngắn đầu tiên:

- buổi đầu học gì
- lỗi cơ bản của người mới
- một buổi học thực tế tại sân

Workflow:

- upload YouTube
- embed vào:
  - homepage
  - `hoc-cau-long-cho-nguoi-moi`

Mục tiêu:

- tăng time-on-page
- mở thêm touchpoint YouTube -> branded search

---

## 11. Phase 4 — Support Content Cluster

> Chỉ làm sau khi money pages chính đã có.

### Nội dung nên viết

- người mới nên bắt đầu thế nào
- nên học nhóm hay 1 kèm 1
- học bao lâu thì đánh được
- buổi đầu cần chuẩn bị gì
- dân văn phòng nên học tối hay cuối tuần
- giá học cầu lông tại TP.HCM nên hiểu ra sao

### Quy tắc support content

- phải kéo được về money page
- phải giải quyết objection thật
- không viết cho đủ số lượng

### Không ưu tiên sớm

- review vợt
- review quần áo
- bài top list tiêu dùng thuần

trừ khi gắn chặt với người mới chuẩn bị đi học.

---

## 12. Phase 5 — CRO, Analytics, CRM

### 12.1 Form analytics

Thêm:

- `form_field_focus`
- `form_abandon`
- `time_to_submit`

### 12.2 CRO experiments

Không đổi form ngay lập tức. Thử nghiệm sau khi có data.

Experiment ưu tiên:

- multi-step form
- rút form mobile
- CTA copy theo page
- proof strip gần form

### 12.3 Multi-step form hypothesis

Step 1:

- tên
- số điện thoại / Zalo
- submit

Step 2:

- sân
- giờ
- trình độ
- note thêm

Mục tiêu:

- giảm friction trên mobile
- lấy contact trước, enrich data sau

### 12.4 CRM tối thiểu

Giai đoạn đầu:

- lead endpoint
- notify Telegram
- lưu source / page / CTA / page type

Giai đoạn sau:

- CRM hoặc dashboard lead pipeline
- lead -> trial -> paid

---

## 13. Phase 6 — Authority & Distribution

Kênh cần tính cùng SEO:

- Google Search
- Google Maps
- Zalo
- Facebook
- YouTube Shorts / TikTok

Mục tiêu:

- tăng branded search
- tăng entity prominence
- tăng trust ngoài website

Hoạt động:

- ảnh lớp học thật
- clip ngắn thật
- partnership với sân / CLB / doanh nghiệp
- local PR nhỏ
- cộng đồng khu vực

---

## 14. Homepage & UX priorities còn lại

Các việc content/UX quan trọng nhưng không chặn technical SEO:

- homepage H1 cần gần search intent hơn
- section “Khác biệt của V2” cần proof cụ thể hơn
- CTA nên context-specific hơn trên các SEO pages
- homepage footer có thể thêm số điện thoại cho UX consistency nếu muốn

---

## 15. Content rules

### 15.1 Viết cho người Việt, intent thật

- tránh viết chung chung
- tránh copywriting hoa mỹ quá đà
- ưu tiên rõ:
  - học gì
  - ở đâu
  - lịch nào
  - giá bao nhiêu
  - ai phù hợp

### 15.2 Dấu và không dấu

Content chính vẫn viết có dấu tự nhiên.

Không cần cố nhét bản không dấu vào content. Google hiểu mapping có dấu / không dấu.

Tuy nhiên, khi research từ khóa và đo hiệu quả, luôn kiểm cả hai dạng:

- `cầu lông bình thạnh`
- `cau long binh thanh`

---

## 16. 90-Day Execution Order

### 0-14 ngày

- GBP optimization
- ảnh thật cơ bản
- xin review thật
- chốt kiến trúc Next.js
- chốt hosting
- chốt form endpoint + notify flow

### 15-30 ngày

- build Next.js
- preserve analytics + prefill flow
- deploy preview
- migration QA
- production cutover

### 31-60 ngày

- làm 3-4 money pages mới đầu tiên
- bổ sung proof + review + video đầu tiên
- theo dõi lead rate theo page

### 61-90 ngày

- làm thêm 2-3 money pages
- bắt đầu support content
- chạy CRO experiment đầu tiên
- tăng branded distribution qua Zalo / Facebook / video

---

## 17. Out of Scope (for now)

Chưa ưu tiên:

- app/mobile app
- CMS phức tạp
- SSR nặng
- cá nhân hóa server-side
- dynamic pricing
- court pages riêng lẻ
- blog traffic rộng không gắn lead

---

## 18. Definition of Success

Kế hoạch này được xem là thành công khi:

- website giữ hoặc tăng index sau replatform
- lead không giảm sau migration
- organic + Maps lead tăng đều theo tháng
- V2 có mặt tốt cho các query local/commercial chính
- branded search tăng
- đội vận hành phản hồi lead nhanh và đo được pipeline từ query -> lead -> học thử -> trả phí

---

## 19. Critical Technical Controls Before Build

Những mục dưới đây phải được khóa rõ trước khi bắt đầu build production features.

### 19.1 Trailing slash policy

Chốt rõ:

- `trailingSlash: true`

Lý do:

- bản production hiện tại đang dùng URL có trailing slash
- canonical hiện tại cũng đang theo trailing-slash URLs
- tránh redirect chain và duplicate canonical state không cần thiết

### 19.2 Lead storage decision

Default recommendation cho phase replatform:

- **Vercel Postgres**

Chỉ dùng Supabase nếu sau này cần dashboard/data tooling riêng mạnh hơn.

Lead tối thiểu phải lưu được:

- `id`
- `name`
- `phone`
- `level`
- `court`
- `time_slot`
- `message`
- `landing_page`
- `page_type`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `created_at`
- `device_type`
- `submission_method`

Nguyên tắc:

- lưu lead trước
- notify sau
- notification failure không được làm mất lead

### 19.3 Form validation rules

Validation phải có cả client-side lẫn server-side.

Rules tối thiểu:

- `name`: required, trim, min 2, max 100
- `phone`: required, đúng format mobile Việt Nam
- `level`: optional, phải thuộc enum cho phép
- `court`: optional, phải thuộc enum cho phép
- `time_slot`: optional, phải thuộc enum cho phép
- `message`: optional, max 500

Server-side không được tin dữ liệu từ client.

### 19.4 Anti-spam and security controls

Lead endpoint bắt buộc có:

- honeypot field
- Cloudflare Turnstile hoặc tương đương
- rate limit
- origin check nếu dùng Route Handler

Rate limit mặc định:

- `5 requests / IP / hour` cho `/api/lead`

Kiến trúc ưu tiên:

- dùng Server Action nếu phù hợp vì có progressive enhancement tự nhiên và giảm rủi ro CSRF

### 19.5 Lead notification flow

Flow chuẩn:

1. submit tới `/api/lead`
2. validate dữ liệu
3. save vào database
4. notify Telegram
5. notify email backup
6. response `2xx`
7. client mới fire `generate_lead`

Rule quan trọng:

- **save first, notify second**
- Telegram không được là single point of failure

### 19.6 Monitoring and incident visibility

Trước khi cutover production phải có:

- Sentry cho client + API errors
- uptime monitoring cho homepage và `/api/health`
- alert channel cho lead failures
- daily lead verification

Audit tối thiểu mỗi tuần:

- so sánh lead trong DB với `generate_lead` trong GA4
- nếu lệch quá `10%` thì phải điều tra

### 19.7 Privacy and consent

Trước production cutover phải có:

- `/chinh-sach-bao-mat`
- disclosure form data dùng để làm gì
- cookie consent tối thiểu cho GA4 / GTM / Meta Pixel

Rule tracking:

- không gửi tên
- không gửi số điện thoại
- không gửi note form

vào GA4 hoặc Meta event params.

### 19.8 `generate_lead` definition

`generate_lead` chỉ được fire khi:

- API trả `2xx`
- lead đã được lưu thành công

Không fire khi:

- user click submit
- validation fail
- Telegram notify fail nhưng DB save chưa thành công

Phải có anti-double-fire nếu user double-click hoặc form re-render.

### 19.9 Reserved route space

Reserve từ sớm để tránh conflict sau này:

- `/san-pham/`
- `/dich-vu/`
- `/blog/`
- `/khuyen-mai/`

Chưa build ngay, nhưng không dùng các prefix này cho slugs hiện tại.
