# UX Audit: Homepage Section Flow, Content Redundancy & CTA Overload

## Tổng quan hiện trạng

| Metric | Giá trị | Đánh giá |
|--------|---------|----------|
| Tổng chiều cao trang | **16,117px** | ❌ Quá dài |
| Số lần scroll cần thiết | **18 viewport scrolls** | ❌ Cực kỳ dài |
| Số section | **13 sections** (+ nav/footer) | ❌ Nên ≤ 8 |
| CTA "Đăng ký" | **17 lần** | ❌ CTA fatigue |
| CTA "Zalo" | **7 lần** | ⚠️ Lặp |
| CTA "Phone" | **7 lần** | ⚠️ Lặp |
| Hero height | **3,517px** (~4 scrolls) | ❌ Hero quá dài |

---

## Phân tích chi tiết theo từng section

### Current order:
```
1.  Hero (3517px)          — 3 CTAs + sidebar "Lộ trình" + "Tìm nhanh" + trust stats
2.  StatsBar (92px)        — 4 stats
3.  Courses (1014px)       — 4 cards + giá + "Xem toàn bộ học phí"
4.  Why (1029px)           — 4 benefits + 98% badge + "Đăng ký học thử ngay" + "Xem lịch"
5.  Coaches (1020px)       — 3 coach cards
6.  Pricing (1500px)       — 3 pricing cards (4+1 CTA "Đăng ký") + "Nhận báo giá"
7.  Testimonials (684px)   — 3 testimonial cards
8.  Schedule (1783px)      — 15 schedule rows + tabs
9.  Locations (1136px)     — 3 location cards + CTA card
10. FAQ (661px)            — accordion
11. Contact (1107px)       — form + direct contact
12. Business (899px)       — doanh nghiệp panel
13. SeoLinks (718px)       — 6 money page links
```

---

## Vấn đề 1: Nội dung trùng lặp nghiêm trọng

### 🔴 Courses vs Pricing — Trùng 70%

| Khía cạnh | CourseSection | PricingSection |
|-----------|-------------|----------------|
| Mục đích | "Lộ trình phù hợp cho bạn" | "Chọn gói học phù hợp" |
| Hiển thị | 4 cards: Trẻ em, Người mới, Người đi làm, 1-kèm-1 | 3 cards: Nhóm nhỏ, 1-kèm-1, Doanh nghiệp |
| Giá | ✅ Có giá trên mỗi card | ✅ Có giá trên mỗi card |
| CTA | "Xem chi tiết" → money page | "Đăng ký học thử" → #lien-he |
| Target | Phân theo đối tượng (ai?) | Phân theo hình thức (gói nào?) |

**Vấn đề:** User thấy giá 2 lần, thấy phân loại khóa học 2 lần, bị confused vì cách phân nhóm khác nhau (Courses chia theo đối tượng, Pricing chia theo hình thức). Cùng sản phẩm nhưng kể theo 2 câu chuyện khác nhau → mâu thuẫn.

**Ví dụ conflict:**
- CourseSection: "Thiếu nhi nền tảng" = 1.300.000 VNĐ/tháng
- PricingSection: "Nhóm nhỏ" = cùng giá nhưng label khác
- User không biết "Thiếu nhi" thuộc gói "Nhóm nhỏ" hay riêng

### 🔴 Business vs Enterprise Pricing Card — Trùng 90%

| | PricingSection (Enterprise card) | BusinessSection |
|--|----------------------------------|-----------------|
| Target | Doanh nghiệp | Doanh nghiệp |
| CTA | "Nhận báo giá" → enterBusinessMode() | "Nhận báo giá" → enterBusinessMode() |
| Nội dung | Features doanh nghiệp | Features doanh nghiệp |

**Vấn đề:** Cùng 1 đối tượng (doanh nghiệp), cùng 1 CTA, cùng 1 action (enterBusinessMode). Nhưng nằm cách nhau **~7000px** (section 6 vs section 12). Hoàn toàn trùng lặp.

### 🟡 Hero sidebar vs SeoLinksBlock — Trùng 80%

| | Hero aside "Tìm nhanh" | SeoLinksBlock |
|--|------------------------|---------------|
| Nội dung | 6 links: Người mới, Bình Thạnh, Thủ Đức, Trẻ em, Người đi làm, Doanh nghiệp | 6 links: Cùng money pages |
| Mục đích | Navigation nhanh theo nhu cầu | Navigation theo nhu cầu |

**Vấn đề:** Hoàn toàn trùng lặp. User đã thấy "Tìm nhanh" ở Hero, rồi scroll 14,000px xuống lại thấy y hệt.

### 🟡 Hero sidebar "Lộ trình nổi bật" vs CourseSection — Trùng 60%

Hero aside có 3 highlight cards (Bắt đầu từ cơ bản, Lịch tối cuối tuần, Chương trình doanh nghiệp) → đây chính là teaser cho CourseSection ngay bên dưới. Nhưng cả 2 đều visible cùng lúc trên desktop → dư thừa.

### 🟡 Locations CTA card vs Contact section — Trùng mục đích

Locations CTA card: "Đăng ký học thử" → #lien-he
Contact section: Form đăng ký → submit

Cả 2 đều serve cùng mục đích conversion, chỉ cách nhau ~2 sections.

---

## Vấn đề 2: CTA Fatigue — 17 lần "Đăng ký"

### Bản đồ CTA theo scroll depth:

```
Scroll 0-4 (Hero):
  ├─ "Đăng ký học thử" (primary CTA)
  ├─ "Xem lộ trình" (secondary)
  ├─ "Tư vấn qua Zalo" (tertiary)
  ├─ Nav: "Đăng ký ngay"
  └─ Floating: "Gọi ngay" + "Tư vấn Zalo"

Scroll 4-5 (Courses):
  └─ "Xem toàn bộ học phí"

Scroll 5-6 (Why):
  ├─ "Đăng ký học thử ngay" ← LẶP LẠI
  └─ "Xem lịch đang mở"

Scroll 7-9 (Pricing):
  ├─ "Đăng ký học thử" × 3 cards ← LẶP × 3
  └─ "Nhận báo giá" × 1

Scroll 10-12 (Schedule → Locations):
  ├─ 15 schedule rows (clickable)
  ├─ "Đăng ký học thử" ← LẶP
  ├─ "Tư vấn Zalo" ← LẶP
  └─ "Xem trước học phí" ← LẶP

Scroll 13-15 (Contact):
  ├─ Form "Gửi thông tin"
  ├─ "Gọi điện" ← LẶP
  └─ "Zalo" ← LẶP

Scroll 15-17 (Business):
  └─ "Nhận báo giá" ← LẶP (đã có ở Pricing)
```

**Tác hại:**
1. **Banner blindness** — Sau lần thứ 5 thấy "Đăng ký", user bắt đầu ignore tất cả CTA
2. **Decision paralysis** — Quá nhiều nút cùng chức năng → user không biết nhấn cái nào
3. **Giảm perceived value** — Doanh nghiệp uy tín không cần "cầu xin" đăng ký 17 lần
4. **Mất trust** — Cảm giác desperate, pushy sales

---

## Vấn đề 3: Hero quá nặng (3,517px)

Hero hiện tại chứa:
- Status pill + eyebrow text
- H1 heading + subheading
- 3 CTA buttons
- Social proof (avatars + rating + stats)
- Trust strip (3 stats)
- Aside panel: "Lộ trình nổi bật" (3 highlight cards)
- Aside panel: "Tìm nhanh theo nhu cầu" (6 links)
- Aside panel: Text block ("Một form chung cho mọi nhu cầu học")
- Scroll indicator

**Vấn đề:** Hero cố nhồi nhét quá nhiều thông tin. Trên desktop, phần aside chiếm ~50% width → Hero hành xử như 2 sections ghép lại. Trên mobile, hero trải dài thành 4+ viewport scrolls.

**Best practice:** Hero nên là **1 viewport** (max 100vh), chỉ chứa: heading, 1 dòng mô tả, 1-2 CTA, 1 visual element. Mọi thứ khác nên ở section riêng.

---

## Vấn đề 4: Flow không theo user journey

### User journey tự nhiên:
```
Ai là V2? (Trust) → Có gì cho tôi? (Relevance) → Bao nhiêu tiền? (Price) → Khi nào? Ở đâu? (Logistics) → Người khác nói gì? (Social proof) → Tôi muốn thử (Action)
```

### Hiện tại:
```
Hero (mọi thứ) → Stats (trust) → Courses (relevance) → Why (trust lại) → Coaches (trust lại) → Pricing (price) → Testimonials (social proof) → Schedule (logistics) → Locations (logistics) → FAQ (objections) → Contact (action) → Business (niche) → SeoLinks (navigation)
```

**Vấn đề:**
1. **Trust bị lặp 3 lần** liên tiếp (Stats → Why → Coaches) — quá nặng ở đầu, thiếu ở cuối
2. **Social proof (Testimonials) ở quá xa** — nên gần Pricing/Schedule để giảm friction
3. **FAQ → Contact** đúng logic, nhưng **Business sau Contact** vô lý — ai scroll qua form liên hệ rồi mới thấy "doanh nghiệp"?
4. **SeoLinks ở cuối cùng** — ít ai scroll tới

---

## Đề xuất cải tiến

### A. Gộp & loại bỏ section trùng lặp

| Hành động | Lý do |
|-----------|-------|
| **Gộp Courses + Pricing** thành 1 section | Cùng trả lời "V2 có gì, giá bao nhiêu?" — chọn 1 trong 2 cách trình bày |
| **Xóa BusinessSection** | Enterprise pricing card + 1 dòng mô tả là đủ. enterBusinessMode() đã có ở PricingSection |
| **Xóa SeoLinksBlock khỏi homepage** | Hero "Tìm nhanh" + footer links đã đủ. SEO links có giá trị cho crawler nhưng gây noise cho user |
| **Giảm Hero aside** | Bỏ "Lộ trình nổi bật" cards (trùng Courses). Giữ "Tìm nhanh" nếu cần, hoặc chuyển thành nav pills |

### B. Sắp xếp lại theo user journey

**Đề xuất 8 sections (giảm từ 13):**

```
1. Hero (compact)        — H1 + 1-2 CTA + 1 visual. Max 100vh
2. StatsBar              — Quick trust signal (giữ nguyên, compact)
3. Courses/Pricing       — "Chương trình & học phí" — 1 section duy nhất
4. Schedule              — "Khi nào, ở đâu" — logistics
5. Coaches + Testimonials — "Ai dạy & học viên nói gì" — gộp trust + social proof
6. Locations             — Sân tập (bỏ CTA card, vì Contact ở ngay dưới)
7. FAQ                   — Objection handling
8. Contact               — Form duy nhất (đích đến cuối cùng)
```

**Ưu điểm:**
- **8 sections** thay vì 13 → giảm ~35% chiều dài trang
- Mỗi section có **1 mục đích rõ ràng**, không trùng lặp
- User journey tự nhiên: Know → Like → Trust → Act
- CTA giảm từ 17 → ~6-7 lần "Đăng ký" (hero, pricing card, location, contact)

### C. Quy tắc CTA cho homepage

| Vị trí | CTA cho phép | Lý do |
|--------|-------------|-------|
| Nav | 1× "Đăng ký ngay" | Global CTA, always visible |
| Hero | 1× Primary "Đăng ký học thử" + 1× Secondary "Xem khóa học" | Entry point |
| Courses/Pricing | 1× per card "Xem chi tiết" hoặc "Chọn gói này" | Product selection |
| Schedule | Rows clickable → auto-scroll to Contact | Contextual, không phải button |
| Locations | 1× "Xem bản đồ" per card | Utility, không phải conversion CTA |
| Contact | 1× "Gửi thông tin" + 1× "Gọi" + 1× "Zalo" | Final conversion |
| Floating | 1× Phone + 1× Zalo | Persistent fallback |
| **Tổng** | **~10-12 CTAs** (giảm từ 31) | |

**Quy tắc:**
1. **"Đăng ký học thử"** chỉ xuất hiện ở Hero + Contact. Các section khác dùng action khác (Xem chi tiết, Xem lịch, etc.)
2. **Không có 2 section liên tiếp** cùng có primary CTA "Đăng ký"
3. **Mỗi section tối đa 2 CTA** (1 primary + 1 secondary)

### D. Hero redesign

**Hiện tại (3,517px):**
```
┌─────────────────────────────┐
│ pill + eyebrow              │ ← Dư, pill đã có info
│ H1 + subheading             │
│ 3 CTAs                      │ ← 3 là quá nhiều
│ Social proof block           │
│ Trust strip (3 stats)       │ ← Trùng StatsBar
│─── aside ────────────────── │
│ "Lộ trình nổi bật" 3 cards  │ ← Trùng Courses
│ "Tìm nhanh" 6 links        │ ← Trùng SeoLinks
│ Text block                  │ ← Không ai đọc
└─────────────────────────────┘
```

**Đề xuất (<= 100vh):**
```
┌─────────────────────────────┐
│ [Background image + overlay]│
│                             │
│ Status pill (V2 · BT · TD) │
│ H1: Hành trình chinh phục  │
│     cầu lông bắt đầu...    │
│ Subheading (1-2 dòng)      │
│                             │
│ [Đăng ký học thử] [Xem ↓]  │ ← Chỉ 2 CTA
│                             │
│ ⭐4.9/5 · 1200+ học viên    │ ← 1 dòng social proof
│                             │
│ ↓ scroll indicator          │
└─────────────────────────────┘
```

**Bỏ:** aside panel, trust strip (chuyển sang StatsBar), "Tìm nhanh" links (có trong nav + footer).

---

## Tóm tắt hành động

| # | Hành động | Impact | Effort |
|---|-----------|--------|--------|
| 1 | **Compact Hero** — bỏ aside, trust strip, giữ chỉ heading + 2 CTA + 1 dòng proof | 🔴 High | 2h |
| 2 | **Gộp Courses + Pricing** — chọn 1 format, bỏ cái còn lại | 🔴 High | 3h |
| 3 | **Xóa BusinessSection** — gộp vào Enterprise pricing card | 🟡 Medium | 1h |
| 4 | **Xóa SeoLinksBlock** — đã có ở hero "Tìm nhanh" và footer | 🟢 Low | 15min |
| 5 | **Bỏ Locations CTA card** — Contact ngay bên dưới | 🟡 Medium | 30min |
| 6 | **Reorder sections** — theo user journey đề xuất | 🟡 Medium | 1h |
| 7 | **Giảm CTA** — áp dụng quy tắc CTA, bỏ "Đăng ký" ở Why section | 🟡 Medium | 1h |
| 8 | **Gộp Coaches + Testimonials** thành 1 section "Trust" | 🟡 Medium | 2h |

**Tổng effort: ~10-11h nếu làm hết, nhưng nên ưu tiên #1, #2, #3 trước.**

---

## Lưu ý kỹ thuật

### Khi gộp Courses + Pricing, chọn 1 trong 2:

**Option A: Giữ CourseSection, bỏ PricingSection**
- Ưu: Cards đẹp hơn (có image), user-centric (chia theo đối tượng)
- Nhược: Mất PricingCards component (dùng ở money pages). Cần ensure money pages vẫn có pricing riêng.
- Lưu ý: CourseSection đang hiện giá rồi → đủ info

**Option B: Giữ PricingSection, bỏ CourseSection**
- Ưu: PricingCards dùng chung với money pages, consistent
- Nhược: Mất visual cards, kém attractive

**Đề xuất: Option A** — giữ CourseSection (visual hơn, chia theo đối tượng = dễ chọn). PricingCards vẫn dùng cho money pages, chỉ bỏ PricingSection khỏi homepage.

### Khi bỏ BusinessSection:
- `enterBusinessMode()` vẫn hoạt động qua Enterprise pricing card
- Nếu bỏ PricingSection luôn (theo Option A), cần đảm bảo có 1 CTA doanh nghiệp ở đâu đó (có thể thêm 1 card trong CourseSection hoặc 1 banner nhỏ)

### HomepageConversionProvider:
- `setCourseIntent` + `enterBusinessMode` + `setPrefill` vẫn cần hoạt động
- Nếu bỏ PricingSection, kiểm tra `setCourseIntent` flow có bị break không (CourseSection không dùng setCourseIntent — đó là từ Sprint 5 mà Codex có thể đã thay đổi)
