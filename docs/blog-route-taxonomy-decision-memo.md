# Blog + Content Hub Strategy for SEO, AEO, and Future CMS

> **2026-07-09 draft addendum:** [Blog vs Content Platform Addendum](./blog-content-platform-addendum-2026-07-09.md) narrows blog scope to news-only and moves evergreen content to the content platform. Do not implement conflicting blog-route work until the addendum is approved or rejected.

> **Revision 2** — incorporates business decisions on the 12 questions from §14 of the original memo. Key shift: **all blog publishing is deferred to a post-CMS-migration launch**. The current 30-day SEO + AEO plan focuses on service pages, About page, coach/trust content, schema, and indexing cleanup — no blog posts produced during the 30 days.
>
> **Status:** Approved canonical blog strategy memo. Incorporated by reference into the [Unified SEO + AEO 30-Day Plan](./seo-aeo-30-day-unified-plan.md). Implementation is deferred until CMS migration / post-CMS blog launch.

---

## 1. Strategic Goal

The blog exists to do **four jobs**, in order of business impact for V2 Badminton:

1. **Capture top-of-funnel informational searches** that money/service pages cannot reach (e.g. "bao lâu thì đánh được", "vợt cầu lông cho người mới"), then route the user to the right service page.
2. **Build topical authority** so Google + AI engines treat v2badminton.com as a credible source for badminton-in-TP.HCM queries beyond just classes.
3. **Provide trust + recency signals** (events, coach content, center updates) so the brand looks active and legitimate to AI engines and human visitors.
4. **Support existing students** with technique and supplemental exercise content — reduces churn and increases word-of-mouth referrals (indirect SEO value via brand searches).

**Timing:** the blog launches **after CMS migration is complete**, not during the current 30-day SEO + AEO plan. Until then, the existing `/blog/` route remains conditionally `noindex` (already enforced in code).

**What the blog will NOT do:**
- Compete with service/money pages for commercial keywords.
- Write competitor-comparison content. V2 does not compare itself against other coaching centers, nor review competitor courts negatively.
- Be a generic "tips" dumping ground.
- Try to rank for every long-tail badminton query — focus on what serves V2's audiences.

**Key principle:** the blog is a *spoke system* around the *hub* of service pages. Every blog post has a clear "next step" page (a service, location, pricing, or coach page) it intends to send the reader to.

---

## 2. User Intent Map

The 8 user-story groups from the brief collapse into **5 distinct intent clusters** that map cleanly to navigation:

| Cluster | Who | What they want | Maps to category |
|---|---|---|---|
| **Prospective student** | Adults asking "should I start", "is this for me", "how long", "how much" | Decision-support content before signing up | `nguoi-moi` |
| **Active student** | Already in a class — wants to improve technique, exercises at home | Skill content | `ky-thuat` |
| **Equipment buyer** | Beginner-to-intermediate buying first racket / shoes / accessories | Buying-decision support | `thiet-bi` |
| **Local search** | Searching "sân cầu lông Bình Thạnh", "sân cầu lông Thủ Đức" | Court info — facilities, parking, suitability for V2 classes | `san-tap` |
| **Trust seeker** | Hovering on the homepage, checking if V2 is legit and active | Center news, events, coach features | `tin-v2` |

Parents fold into "prospective student" with a child-specific lens — handled at post level, not as its own category.

**Why audience-based categories are rejected** (e.g. `/blog/phu-huynh/`, `/blog/nguoi-di-lam/`): audiences overlap massively (a working adult IS often a beginner), causing cannibalization. Intent is a cleaner cut.

---

## 3. Route Structure Options

| Option | SEO benefit | AEO benefit | CMS-ready | URL stability | Breadcrumb clarity | Archive potential | Recat. risk | Duplicate risk | Cannibal. risk | Ops complexity | Fits V2? |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **A. `/blog/[slug]/`** *(current code)* | Low — no topical signal in URL | Neutral — AI ignores URL depth | High — minimal CMS surface | Highest — slug-only | Weak — Home > Blog > Post | Weak — single /blog/ archive | Zero | Low | Low | Lowest | Adequate today, weak at 50+ posts |
| **B. `/blog/[category]/[slug]/`** | High — category in URL signals topic | Mild — breadcrumb JSON-LD enriches snippet | High — natural primary-category field | Moderate — slug stable, category mobile | Strong — 3-level | Strong — one archive per category | Medium — slug changes if category changes (mitigated by 301) | Low if canonical correct | Low | Moderate | **Yes — scales to 200+ posts** |
| **C. `/blog/[content-type]/[slug]/`** | Medium — but content-type is operational, not user-facing intent | Neutral | High | Moderate | Strong | Strong | Medium | Low | Medium | Moderate | No — confuses users; format isn't intent |
| **D. `/blog/[audience]/[slug]/`** | Low — audiences overlap | Negative — same content rewritten per audience risks duplication | Medium | Moderate | OK | Medium | High | High | High | High | No |
| **E. `/blog/[category]/[subcategory]/[slug]/`** | High but premature | Mild | Medium — more CMS state to manage | Lower — two levels can change | Excellent | Strong per subcategory | High | Higher | Medium | High | No — overkill until 200+ posts |

### Decision

**Option B wins.** Topical clustering with manageable operational cost. Subcategories (Option E) deferred until any single category exceeds 25-30 posts.

---

## 4. Recommended Route Strategy

### Codebase findings (May 2026 inspection)

| Check | Result |
|---|---|
| Blog post documents in repo | **None** — no seed files, no checked-in posts |
| Code paths that depend on `/blog/<slug>/` flat pattern | Four call sites total: (1) the route file [blog/[slug]/page.tsx](../src/app/(site)/blog/[slug]/page.tsx); (2) the sitemap loop at [sitemap.ts:71](../src/app/sitemap.ts:71) (`canonicalUrl(\`/blog/${post.slug}/\`)`); (3) the blog index list card link at [blog/page.tsx:165](../src/app/(site)/blog/page.tsx:165); (4) the canonical URL in the blog post `generateMetadata` at [blog/[slug]/page.tsx:44](../src/app/(site)/blog/[slug]/page.tsx:44). CMS migration must update all four. |
| Existing category enum (`tips | how-to | beginner | campaign`) external dependencies | **None** — referenced in 5 internal files only (Sanity Studio dropdown, TS types, display labels, blog-list filter chips, GROQ projections). No analytics, no sitemap, no schema, no GSC properties. |
| Sitemap behavior when zero posts | Auto-excludes `/blog/` and any post URLs ([sitemap.ts:58](../src/app/sitemap.ts:58)) |
| Blog index behavior when zero posts | Auto-`noindex` ([blog/page.tsx:82-92](../src/app/(site)/blog/page.tsx:82)) |

**One thing I cannot verify from code:** how many posts exist in your *production* Sanity dataset. **One-shot check the team needs to run before CMS migration:** open Sanity Studio → query `*[_type == "post" && status == "published"]` → confirm count + slugs + any traffic in Search Console.

### Recommended path (assuming the pre-migration check shows zero or near-zero production posts)

**Clean cutover. No legacy `/blog/<slug>/` preservation needed.**

The blog will launch directly at `/blog/<category>/<slug>/` after CMS migration completes. Because:
- No production content is at risk.
- Category enum is purely internal — replacing it touches 5 files, all controlled by the team.
- Avoiding a legacy/nested coexistence layer eliminates an entire class of redirect bugs.

### Fallback path (if the pre-migration check shows existing posts)

**Default for every previously published post — regardless of traffic:** ship a 308 redirect from `/blog/<old-slug>/` → `/blog/<new-category>/<new-slug>/` in `src/proxy.ts` (Next.js 16 calls this Proxy, not Middleware — see W1.4 of the unified plan). Preserve the post body content in CMS migration. Keep the redirect for 12 months minimum (Google guidance for permanent moves).

Rationale for redirecting even low-traffic posts:
- External backlinks may exist that Search Console doesn't show.
- Search Console impressions are a lagging indicator and can miss long-tail queries.
- A 308 is cheap to maintain; data loss from deletion is not recoverable.
- It preserves any latent link equity the URL has accumulated.

**410 (Gone) is reserved for the narrow case** where a post is being **intentionally deleted with no replacement content** (e.g. outdated promotional content, content that violates current editorial standards, factually wrong content that's been retracted). Do not use 410 as a default for "no traffic" — that's what 308 to the migrated URL is for.

If a post is being deleted because its topic is fully covered by a different post or by a service page:
- Use a 308 redirect to the closest replacement, not 410.

### URL hygiene rules (apply forever)

- Never delete a published URL silently — always redirect.
- Vietnamese unaccented slugs only (matches the rest of the site: `hoc-cau-long-1-kem-1`).
- Trailing slash on every URL (`next.config.ts` already enforces this).
- Each post's canonical URL is its nested path — no canonical-tag-only redirects.

### Why not stay on flat forever?

Flat works at 10-20 posts. At 50+ posts across 5 content types, Google has zero URL-level signal of what each post is about. Breadcrumb JSON-LD partially mitigates but doesn't replace URL clustering. Locking in the nested pattern at launch means every post is future-proof from day 1.

---

## 5. Proposed Blog Taxonomy

**Five launch categories.** Vietnamese unaccented slugs. Each maps to one intent cluster from §2.

> **Note on category archive indexing:** because the editorial cadence is unknown (per business answer Q3), **all category archives stay `noindex` until both** (a) ≥5 published posts in the category, AND (b) a confirmed publishing rhythm of ≥1 post per category per month sustained for 3+ months. This is stricter than the original draft.

### 5.1 `nguoi-moi` — Người mới bắt đầu

| Field | Value |
|---|---|
| Slug | `nguoi-moi` |
| Main intent | Prospective students researching before signing up |
| Business goal | Capture top-of-funnel informational queries; route to service pages |
| Content types | Beginner guides, pricing/comparison guides (linking to `/gia-hoc-cau-long-tphcm/`), "should I" decision posts, parent-oriented intro content |
| Example titles | "Người mới học cầu lông bao lâu thì đánh được?", "Học cầu lông nhóm vs 1 kèm 1", "Trẻ em mấy tuổi học cầu lông được?" |
| Links to | `/hoc-cau-long-cho-nguoi-moi/`, `/hoc-cau-long-1-kem-1/`, `/gia-hoc-cau-long-tphcm/`, `/lop-cau-long-tre-em/` |
| Archive indexable? | **No** until ≥5 strong posts + confirmed publishing cadence |
| Cannibalization risk | Medium — must avoid duplicating service page's QuickAnswer |
| Launch | After CMS migration |

### 5.2 `ky-thuat` — Kỹ thuật & luyện tập

| Field | Value |
|---|---|
| Slug | `ky-thuat` |
| Main intent | Active students improving skills |
| Business goal | Reduce churn, increase word-of-mouth, build authority |
| Content types | Technique tutorials, supplemental exercises (footwork, wrist, shoulder, stamina, injury prevention), training drills |
| Example titles | "Cách cầm vợt cầu lông đúng cho người mới", "5 bài tập chân cầu lông tập ở nhà", "Sửa lỗi phát cầu trái tay" |
| Links to | `/hoc-cau-long-1-kem-1/` (for "I want a coach to fix this"), coach pages |
| Archive indexable? | **No** until ≥5 strong posts + confirmed cadence |
| Cannibalization risk | Low — competes mostly with YouTube, not own pages |
| Launch | After CMS migration |

### 5.3 `thiet-bi` — Vợt, giày & thiết bị

| Field | Value |
|---|---|
| Slug | `thiet-bi` |
| Main intent | Equipment buyers, mostly beginner-to-intermediate |
| Business goal | Capture commercial-investigation queries; bring readers into V2's ecosystem |
| Content types | Racket reviews, shoe reviews, gear guides ("best ... under ... VNĐ"), accessory recommendations |
| Example titles | "Cách chọn vợt cầu lông cho người mới (dưới 1 triệu)", "Top 5 giày cầu lông cho người chơi nghiệp dư", "Vợt Yonex Astrox 88D Pro: review từ HLV V2" |
| Links to | `/hoc-cau-long-cho-nguoi-moi/`, `/hoc-cau-long-1-kem-1/` |
| Archive indexable? | **No** until ≥5 strong posts + confirmed cadence |
| Cannibalization risk | Medium — equipment reviews compete with retailer sites; differentiate via coach perspective |
| Affiliate? | **Allowed with mandatory disclosure** (see §6.3 and §11) |
| Launch | After CMS migration |

### 5.4 `san-tap` — Sân tập của V2

| Field | Value |
|---|---|
| Slug | `san-tap` |
| Main intent | Local search — "sân cầu lông [district]" — and student decision support for V2's courts |
| Business goal | Local SEO surface area for V2's teaching locations; help students choose the right court |
| Content types | **Reviews of courts where V2 currently teaches** — facilities, parking, location, suitability for V2 classes, what to expect as a student |
| Example titles | "Sân Green Bình Thạnh: mọi điều bạn cần biết trước buổi học đầu", "Sân Huệ Thiên Thủ Đức: cơ sở vật chất và cách di chuyển", "Học cầu lông tại sân Khang Sport: phù hợp với ai?" |
| Links to | `/lop-cau-long-binh-thanh/`, `/lop-cau-long-thu-duc/` — always to the matching V2 location service page |
| Archive indexable? | **No** until ≥4 strong posts + confirmed cadence |
| Cannibalization risk | **High** — court content can drift into location-service-page territory. See §8 boundary rules. |
| **Scope rule** | **V2 teaching locations only.** No competitor courts. No "top X courts in district Y" comparison roundups. |
| Launch | After CMS migration |

### 5.5 `tin-v2` — Tin tức & sự kiện V2

| Field | Value |
|---|---|
| Slug | `tin-v2` |
| Main intent | Trust-building visitors, returning students, parents checking activity |
| Business goal | Show recency, legitimacy, and student progress |
| Content types | Center updates, course announcements, event recaps, student spotlights, coach features (no competitor coaches) |
| Example titles | "Giải nội bộ V2 tháng 5: tổng kết", "Khai giảng khóa hè 2026 tại sân Green", "HLV Sang chia sẻ về phương pháp dạy người đi làm" |
| Links to | `/`, `/huan-luyen-vien/`, `/gioi-thieu/`, event-specific service pages |
| Archive indexable? | **Permanent `noindex`** until cadence is sustained at ≥2 posts/month for 6+ months. News archives with stale single posts hurt more than help. |
| Cannibalization risk | Low |
| Launch | **Delayed**: do not launch until V2 has a confirmed publishing rhythm (per business answer Q3). Posts in this category can be drafted in CMS but should not be published until rhythm is real. |

### 5.6 Categories explicitly NOT proposed

| Rejected category | Why |
|---|---|
| `huong-dan` (separate from `ky-thuat`) | Overlaps with `ky-thuat` and `nguoi-moi` — unclear editorial home |
| `phu-huynh` (parents) | Audience-based; cannibalizes `nguoi-moi` |
| `nguoi-di-lam` | Same issue |
| `doanh-nghiep` | Too narrow — team-building content belongs on `/team-building-cau-long/`; rare announcements fit `tin-v2` |
| `khuyen-mai` | Promotions are time-sensitive — homepage banners, not blog |
| `campaign` (legacy code value) | Too vague — covered by `tin-v2` |
| `so-sanh-cua-hang` / `review-doi-thu` (competitor reviews) | **Explicitly rejected per business policy.** No competitor content of any kind. |

### Migration mapping from current enum

The existing [SanityPostCategory](../src/lib/sanity/types.ts:221) enum (`tips | how-to | beginner | campaign`) is internal-only (confirmed via §4 codebase inspection). It can be replaced cleanly during CMS migration:

| Old | New | Migration action |
|---|---|---|
| `tips` | mostly → `ky-thuat`; equipment tips → `thiet-bi` | Manual review per draft, if any drafts exist |
| `how-to` | → `ky-thuat` | Direct map |
| `beginner` | → `nguoi-moi` | Direct map |
| `campaign` | → `tin-v2` | Direct map |

Drop old enum values after migration (no external dependencies discovered).

---

## 6. Blog Post Templates

Each template specifies URL, H1, Quick Answer, H2s, FAQ usage, links, CTA, schema, image alt. Templates are starting points — adapt to topic.

> **Editorial workflow rule (applies to every template, per business answer Q4):** every post requires sign-off from the business owner OR a qualified coach before publish. **Mandatory coach review** for: technique tutorials (6.5), supplemental exercise posts (6.6), equipment reviews (6.3), court reviews (6.4). The reviewer is recorded in the CMS `reviewedBy` field at publish time.

### 6.1 Question-led guide

**Use for:** "How long…", "What age…", "Should I…", "Can I…" questions.

- **URL:** `/blog/<category>/<question-as-slug>/` e.g. `/blog/nguoi-moi/nguoi-moi-hoc-cau-long-bao-lau-thi-danh-duoc/`
- **H1:** the question itself, verbatim, with TP.HCM context if relevant
- **Opening direct answer (first 40-70 words):** sentence 1 = the answer. Sentence 2-3 = qualifier. Example: *"Trung bình 6-8 tuần với lịch 2 buổi/tuần là đủ để người mới đánh được kỹ thuật cơ bản: cầm vợt, di chuyển, phát cầu thấp/cao, đánh trái-phải tay. Tốc độ thực tế phụ thuộc vào nền thể chất, độ thường xuyên tập và việc có HLV theo sát hay không."*
- **Quick Answer block:** styled callout repeating the first sentence with key qualifiers. Use the same component as money pages.
- **H2 sections (4-6):** "Câu trả lời ngắn" / lộ trình theo tuần / yếu tố ảnh hưởng / khi nào nên chuyển / kết luận
- **FAQ:** 3-5 questions, only if answers are visible in body. Use `FAQPage` schema only if `includeInSchema` confirmed.
- **Internal links:** 2-3, of which ≥1 to a money page
- **CTA:** soft — "Đăng ký buổi học thử để được HLV đánh giá nền tảng"
- **Schema:** `Article`, `BreadcrumbList`. NOT `FAQPage` unless 3+ visible Q&As exist.
- **Image alt:** descriptive — *"Học viên người mới luyện phát cầu tại V2 Badminton Bình Thạnh"*
- **Reviewer:** business owner OR senior coach

### 6.2 Comparison article

**Use for:** "X vs Y" decisions where **both X and Y are V2 services or V2-adjacent options.**

- **URL:** `/blog/<category>/<a>-vs-<b>/` e.g. `/blog/nguoi-moi/lop-nhom-vs-1-kem-1/`
- **H1:** "X vs Y — nên chọn loại nào?" or "So sánh X và Y"
- **Direct answer:** one-sentence recommendation. *"Lớp nhóm phù hợp với người mới muốn lịch ổn định và chi phí thấp; 1 kèm 1 phù hợp với người cần sửa kỹ thuật nhanh hoặc lịch linh hoạt."*
- **Quick Answer:** the recommendation + "khi nào chọn X" + "khi nào chọn Y" in one block
- **H2 sections (4-5):** so sánh nhanh (table) / khi nào chọn X / khi nào chọn Y / chi phí và lịch / kết luận
- **Comparison table (required):** 4-6 rows — quy mô, học phí, phù hợp với, tốc độ tiến bộ, lịch học
- **FAQ:** optional
- **Internal links:** 2-3, both compared options' money pages + pricing page
- **CTA:** "Liên hệ V2 để được tư vấn loại phù hợp"
- **Schema:** `Article`, `BreadcrumbList`. NOT `Product` or `Service`.
- **Image alt:** comparison-themed
- **Forbidden:** comparison of V2 vs. another coaching center. Not allowed under any framing. Per business policy.

### 6.3 Equipment review (racket / shoe)

**Use for:** "Best racket for ...", "Yonex X review", "Shoes under Y VNĐ".

- **URL:** `/blog/thiet-bi/<product-or-category-slug>/`
- **H1:** product name + qualifier OR "Top X for Y"
- **Direct answer:** verdict in 1-2 sentences. *"Yonex Astrox 77 Pro là vợt offensive phù hợp với người chơi trung cấp đang chuyển sang lối đánh tấn công, nặng 88g, cân bằng nhẹ về đầu vợt."*
- **Quick Answer:** verdict + "phù hợp với ai" + "giá tham khảo"
- **H2 sections (5-7):** đánh giá tổng quan / thông số (table) / **trải nghiệm thực tế (V2 coach perspective — the differentiator)** / ưu điểm / nhược điểm / phù hợp với ai / mua ở đâu, giá tham khảo
- **FAQ:** optional
- **Internal links:** related service page (`/hoc-cau-long-cho-nguoi-moi/`), other equipment posts in same axis
- **CTA:** soft — "Tham gia lớp tại V2 để được HLV hướng dẫn dùng vợt"
- **Schema:** `Article`, `BreadcrumbList`. **`Product` + `Review` schema only if** the post reviews a single product AND V2 publishes a real numeric rating AND legal disclosure is in place. Default off.
- **Image alt:** specific to the product + use context
- **Reviewer:** **mandatory coach review** before publish (per Q4)

#### Mandatory affiliate disclosure (per business answer Q1)

If the post contains affiliate links OR sponsored content OR a product was provided free by the brand, the post **must include an Affiliate Disclosure block** placed above the fold (above or immediately below the H1). Disclosure is required even if only one link is affiliate.

**Disclosure block template** (Vietnamese — transparent affiliate disclosure aligned with Google E-E-A-T expectations; **legal/compliance review recommended before publishing any affiliate or sponsored content**, especially for the Vietnamese consumer-protection regime):

```
[ICON: ℹ️]  Tiết lộ liên kết tiếp thị
Bài viết này có chứa liên kết tiếp thị liên kết (affiliate link). Khi bạn
mua sản phẩm thông qua các liên kết này, V2 Badminton có thể nhận được
một khoản hoa hồng nhỏ, không làm thay đổi giá sản phẩm. Nội dung đánh
giá phản ánh ý kiến độc lập của đội ngũ HLV V2 dựa trên trải nghiệm
thực tế giảng dạy. [Đọc chính sách đánh giá của chúng tôi →]
```

Variants for sponsored content / gifted product:

| `disclosureType` | Visible disclosure text |
|---|---|
| `affiliate` | as above |
| `sponsored` | *"Bài viết này được tài trợ bởi [Brand]. V2 Badminton nhận thù lao để đăng bài, nhưng giữ toàn quyền biên tập về nội dung và đánh giá."* |
| `gifted_product` | *"Sản phẩm trong bài được nhãn hàng [Brand] cung cấp miễn phí cho V2 Badminton để đánh giá. Đánh giá là độc lập, không có ràng buộc với nhãn hàng."* |
| `none` | (no block — only if zero affiliate links and zero sponsorship) |

The disclosure block links to a single `/chinh-sach-danh-gia/` page (a static review-policy page at the **top-level URL, not under `/blog/`** — to avoid colliding with the `/blog/[category]/[slug]/` route pattern; see §11.11).

#### Technical link rules for affiliate / sponsored / external links

These rules apply to every blog post, not just `thiet-bi`:

- **Affiliate or sponsored outbound links** must use `rel="sponsored nofollow"`. Google added `sponsored` specifically for this case in 2019; using only `nofollow` is the older fallback but is no longer the preferred signal.
- **External links opened in a new tab** (`target="_blank"`) must include `rel="noopener noreferrer"`. `noopener` prevents the new page from accessing `window.opener` (security), `noreferrer` blocks the referrer header (privacy + occasionally avoids attribution issues).
- **Combined affiliate + new-tab link** → `rel="sponsored nofollow noopener noreferrer"`. Order doesn't matter to browsers.
- **Internal links** (to V2's own service pages, blog posts, etc.) do **not** need any of the above `rel` values and should not have `target="_blank"` by default.
- The post template / CMS migration plan must enforce these `rel` values automatically based on the `affiliateLinks` array (§11.7) — editors should not have to remember to add them by hand.

### 6.4 Court review — V2 teaching locations only

**Use for:** student decision-support content about courts where V2 currently teaches. **Not** for comparing courts where V2 doesn't teach, and **not** for negative reviews of competitor courts.

- **URL:** `/blog/san-tap/<court-slug>/` (one post per V2 teaching court, not roundup posts)
- **H1:** court name + framing focused on student usefulness, not competitive ranking. Example: *"Sân Green Bình Thạnh: cơ sở vật chất và lưu ý cho học viên V2"*
- **Direct answer:** 1-2 sentences. *"Sân Green tại Bình Thạnh có 8 sân tiêu chuẩn, ánh sáng tốt và chỗ để xe rộng. V2 Badminton dạy các lớp người mới và 1 kèm 1 tại sân này từ T2-T7, khung 17h30-21h00."*
- **Quick Answer:** location + facilities + V2 classes offered there
- **H2 sections (5-6):**
  - "Vị trí và cách di chuyển"
  - "Cơ sở vật chất" (số sân, mặt sân, ánh sáng, thay đồ, wifi)
  - "Bãi xe và tiện ích xung quanh"
  - "Lớp V2 đang dạy tại sân này"
  - "Cần chuẩn bị gì cho buổi đầu"
- **FAQ:** include if real Q&As (parking cost, registration, what to bring)
- **Internal links:** the V2 location service page for that district + any specific class pages held at this court
- **CTA:** "Xem lịch lớp V2 tại sân Green" → direct link to schedule/contact
- **Schema:** `Article`, `BreadcrumbList`. **`SportsActivityLocation` allowed** (already implemented as a builder) since this is V2's own teaching location.
- **Image alt:** real photo of the court, alt describes what's visible
- **Reviewer:** **mandatory coach review** before publish — coach who actually teaches there.
- **Forbidden framings:**
  - No "Top X courts in [district]" roundup comparing multiple courts.
  - No mention of competitor coaching centers operating at the same court.
  - No negative comments about court owner/staff/policy unless materially relevant to student safety.

### 6.5 Technique tutorial

**Use for:** step-by-step skill content.

- **URL:** `/blog/ky-thuat/<technique-slug>/`
- **H1:** technique name + "đúng cách" or "cho người mới"
- **Direct answer:** one-sentence outcome + one-sentence prerequisite
- **Quick Answer:** "Bạn sẽ làm được" + "Mất bao lâu" + "Cần gì"
- **H2 sections (5-8):** tại sao kỹ thuật này quan trọng / chuẩn bị dụng cụ / bước 1-4 (numbered subsections) / lỗi thường gặp và cách sửa / bài tập tại nhà
- **Images / video:** **strongly recommended.** Each step has a still image. Embedded video if available.
- **FAQ:** 3-4
- **Internal links:** `/hoc-cau-long-1-kem-1/` for "I want a coach to verify my form"
- **CTA:** "Đặt buổi học 1 kèm 1 để HLV kiểm tra kỹ thuật của bạn"
- **Schema:** `Article`, `BreadcrumbList`. **`HowTo` schema only if** post is clearly step-by-step instructional AND each step has a name + image.
- **Image alt:** describe the step the image shows
- **Reviewer:** **mandatory coach review** (technique accuracy is a liability if wrong)

### 6.6 Supplemental exercise article

**Use for:** off-court training, conditioning, injury prevention.

- **URL:** `/blog/ky-thuat/<exercise-or-goal-slug>/`
- Template: same as Technique tutorial (6.5).
- **Schema:** same as 6.5. Avoid `ExercisePlan` schema.
- **Reviewer:** **mandatory coach review** with sports-medicine awareness (injury risk).

### 6.7 Center update / event post

**Use for:** announcements, recaps, news.

- **URL:** `/blog/tin-v2/<event-or-update-slug>/`
- **H1:** event name + date OR announcement headline
- **Direct answer:** what + when + who
- **Quick Answer:** the 5W (what / when / where / who / how to register)
- **H2 sections (3-5):** thông tin chi tiết / lịch và địa điểm / đối tượng tham gia / đăng ký
- **FAQ:** rarely needed
- **Internal links:** relevant service page + `/huan-luyen-vien/` if coach-led
- **CTA:** event-specific registration link
- **Schema:** `Article`, `BreadcrumbList`. **`Event` schema only if** dates/locations/prices are firm AND post is updated when changes occur.
- **Image alt:** real event photo
- **Reviewer:** business owner

### 6.8 Coach-related post (V2 coaches only)

**Use for:** V2 coach features, interviews, philosophy posts. **No posts about competitor coaches.**

- **URL:** `/blog/tin-v2/<coach-slug>-<topic-slug>/`
- **H1:** coach name + topic angle
- **Direct answer:** who + what they teach + what makes their approach distinct
- **Quick Answer:** name + role + main classes + 1-line philosophy
- **H2 sections (4-6):** giới thiệu HLV / phương pháp giảng dạy / lớp đang phụ trách / lời khuyên cho học viên mới / đặt lớp với HLV
- **FAQ:** optional
- **Internal links:** `/huan-luyen-vien/`, specific service pages the coach teaches
- **CTA:** "Đặt lớp với HLV [Name]"
- **Schema:** `Article`, `BreadcrumbList`. Reference coach's `Person` schema (built per W3.3 of the 30-day plan) via `about: { "@id": "<coach-id>" }`.
- **Reviewer:** business owner + the coach being profiled (consent + accuracy check)

---

## 7. SEO + AEO Writing Rules

Universal rules applied to every post regardless of template.

### Direct answer rules

1. **Answer the title question in the first 40-70 words.** Not paragraph 3.
2. **Sentence 1 = the answer. Sentence 2-3 = the qualifier or context.**
3. **No "Trong bài viết này, chúng ta sẽ tìm hiểu…"** — cut every meta-introduction.
4. **No "tự hào", "đẳng cấp", "uy tín"** in the first paragraph. Specific, factual, plain.

### Specificity rules

1. **Use real names, prices, times, durations** wherever possible.
2. **If a number is uncited, either cite it or remove it.**
3. **Local geo signal** in every post that has any geographical relevance.

### Structure rules

1. **H2s should be questions** for posts in `nguoi-moi`, `ky-thuat`, `thiet-bi`. Statement H2s allowed for `san-tap` and `tin-v2`.
2. **Use comparison tables** in any post that compares two or more options.
3. **Use numbered steps** in any technique/exercise post (H3 level).
4. **Use bullet lists** for "ưu/nhược điểm", "phù hợp với ai", "cần chuẩn bị".
5. **No important content hidden inside images only.**

### FAQ rules

1. **Only add `FAQPage` schema when the page has visible Q&A blocks.** Hidden or accordion-collapsed answers must still be in the initial HTML.
2. **Minimum 3 FAQs to add the schema.**
3. **Don't duplicate the body's H2s as FAQs.**

### Trust signal rules

1. **Author byline encouraged.** Attribute posts to named coaches or the business owner.
2. **Last updated date visible** on every post — *"Cập nhật: 12/05/2026"*. Surface `dateModified` in schema.
3. **Photo/video credit** where applicable.
4. **Reviewer attribution** in CMS (not necessarily visible on page, but recorded).

### Editorial review workflow (per business answer Q4)

1. Draft → submit for review.
2. Reviewer (business owner or qualified coach per template's specific rule) reads the full draft, verifies factual claims, signs off in CMS via `reviewedBy` + `reviewedAt` fields.
3. SEO check: keyword cannibalization scan (see §13), schema validation.
4. Publish.

No post bypasses the reviewer. If a coach is unavailable, the business owner can review — but technique tutorials, equipment reviews, and court reviews specifically require coach review (not just owner).

### Anti-patterns to avoid

- Generic AI-written intros that don't answer the title
- Title in question form but body never directly answers it
- Comparison post that hedges and recommends nothing
- Equipment review that reads like marketing copy
- Technique tutorial without images
- FAQPage schema with answers not visible in HTML
- Multiple posts targeting the exact same question (cannibalization)
- **Competitor framing of any kind** (per business policy)

---

## 8. Service Page vs Blog Boundary Rules

### Hard rules

1. **Commercial intent → service page.** Any query where the intent is "I want to buy/sign up for [V2's service]" lives on a service page.
2. **Informational intent → blog post.** Any query where intent is "I want to understand/decide/learn" lives on the blog.
3. **Mixed intent → blog post that links to service pages.** The blog answers "which type", the service pages answer "what + how to sign up".

### Specific boundary examples

| Query | Lives at | Why |
|---|---|---|
| "học cầu lông 1 kèm 1 tphcm" | `/hoc-cau-long-1-kem-1/` (service) | Commercial |
| "nên học lớp nhóm hay 1 kèm 1" | `/blog/nguoi-moi/lop-nhom-vs-1-kem-1/` | Decision-support |
| "giá học cầu lông tphcm" | `/gia-hoc-cau-long-tphcm/` (service) | Commercial |
| "học cầu lông có đắt không" | `/blog/nguoi-moi/hoc-cau-long-co-dat-khong/` | Decision-support |
| "sân cầu lông bình thạnh" | `/lop-cau-long-binh-thanh/` (service) — primary commercial intent target | Commercial — V2's classes in BT |
| "sân Green Bình Thạnh review" | `/blog/san-tap/san-green-binh-thanh/` (only if V2 teaches there) | Student decision-support for V2's court |
| "lớp cầu lông buổi tối" | `/lop-cau-long-buoi-toi/` (service) | Commercial |
| "tập cầu lông sau giờ làm có lợi gì" | `/blog/nguoi-moi/loi-ich-tap-cau-long-cho-nguoi-di-lam/` | Wellness/decision content |

### Cannibalization tripwire

Before publishing any blog post, search the existing site for the target keyword in `metaTitle` fields. If a service page already targets it, the blog post must either:
- Target a different *intent* (decision vs commercial), OR
- Be rejected.

A blog post is never the "main page" for a commercial query V2 can serve via a service page.

---

## 9. Internal Linking Strategy

### From blog → service pages (the main flow)

Every blog post links *out* to at least:
- 1 money page (the primary "next step")
- 1 location page (if the post mentions a district where V2 teaches)
- 1 pricing page (if cost is in the post)

The first internal link should appear within the first 200 words. Anchor text must be descriptive and contain the target page's keyword.

| Blog category | Default primary money page link |
|---|---|
| `nguoi-moi` | `/hoc-cau-long-cho-nguoi-moi/` |
| `ky-thuat` | `/hoc-cau-long-1-kem-1/` |
| `thiet-bi` | `/hoc-cau-long-cho-nguoi-moi/` |
| `san-tap` | `/lop-cau-long-binh-thanh/` or `/lop-cau-long-thu-duc/` per district |
| `tin-v2` | `/` or `/huan-luyen-vien/` |

### From service pages → blog (sparingly)

Service pages must **not** distract the converting user. Rules:
- At most **1 blog link in the body** of a money page, placed *after* pricing/CTA sections.
- "Related Posts" rail (if shown) appears in a footer-style block below the main CTA.
- Money pages link to a blog post only if it answers a question the page itself doesn't cover.

| Service page | Best supporting blog post type |
|---|---|
| `/hoc-cau-long-cho-nguoi-moi/` | "Bao lâu thì đánh được" Q-led guide |
| `/hoc-cau-long-1-kem-1/` | "Lớp nhóm vs 1 kèm 1" comparison |
| `/gia-hoc-cau-long-tphcm/` | "Học cầu lông có đắt không" decision post |
| `/lop-cau-long-binh-thanh/` | Court reviews of V2's BT courts |
| `/lop-cau-long-tre-em/` | "Trẻ em mấy tuổi học cầu lông được" Q-led guide |

### Anchor text rules

- **Descriptive, never "click here" or "tại đây".**
- Include the target page's primary keyword when natural.
- Vary anchor text across posts linking to the same page.

### Orphan prevention

- Every published post must be linked from at least one other published page.
- Audit quarterly: list posts with zero incoming links, add references.

---

## 10. Category Archive Indexing Rules

### Indexing thresholds (stricter than original draft, per business answer Q3)

All category archives stay `noindex` until **all three** conditions are met:

1. **Volume:** ≥5 published posts in the category (`san-tap` and `tin-v2` use thresholds noted in §5).
2. **Quality:** archive page has a unique intro paragraph (≥80 words) — not just a list of posts.
3. **Cadence:** ≥1 post per category per month sustained for **3+ months prior to indexing decision**. Stale archives hurt more than help.

### Archive page requirements (when promoted to indexable)

1. Unique intro paragraph (≥80 words) explaining the category.
2. Custom `<title>` and `<meta description>`.
3. `BreadcrumbList` schema: Home > Blog > [Category].
4. ≥1 internal link from another indexable page.
5. Pagination handled cleanly — `rel="next"`/`rel="prev"` or single-page archive ≤30 posts.

### Filter URLs and tag URLs

- Query-parameter filters (`/blog/?category=tips`, `/blog/?tag=footwork`) are **always `noindex`**.
- **Tag URLs (`/blog/tag/<slug>/`) are NOT created.** Tags are CMS-internal only (per business answer Q9). They power internal search and related-post logic, not public URLs.

### Canonical rules

- Archive page canonical = itself.
- Posts canonical = full nested URL.
- Pagination pages canonical = page 1 of the archive.

### Sitemap inclusion

- Indexable category archives included with `changeFrequency: "weekly"` and priority 0.5.
- `noindex` archives excluded.
- Pagination pages 2+ excluded.
- Tag URLs never exist, never in sitemap.

---

## 11. CMS-Ready Requirements

> This is a list of fields the post Sanity document should support after CMS migration. **Not the migration plan itself** — migration will be planned in a separate CMS migration document.

### 11.1 Core identification

- `_id`, `_type` (Sanity standard)
- `title` (string, required)
- `slug` (slug, required, lowercase, hyphenated, Vietnamese unaccented, regex `^[a-z0-9-]+$`)
- `primaryCategory` (reference or enum from §5: `nguoi-moi | ky-thuat | thiet-bi | san-tap | tin-v2`, required — controls URL `/blog/<primaryCategory>/<slug>/`)
- `secondaryTags` (array of references to `tag` documents, optional, controlled vocabulary per §11.2 — **not URL-routable**)

### 11.2 Controlled tag vocabulary (per business answer Q9)

Tags are CMS documents (`type: "tag"`) with `name`, `slug`, `axis`, `description`. Posts reference tags via array of references — no free-form strings. New tags require business-owner approval to add.

**Launch vocabulary (~30 tags across 6 axes).** Add new tags only when ≥3 posts need them.

#### Axis 1: Skill level (`skill-level`)
`nguoi-moi`, `trung-cap`, `nang-cao`

#### Axis 2: Body part / focus (`body-focus`)
`chan`, `tay`, `co-tay`, `vai`, `the-luc`, `tim-mach`, `phan-xa`

#### Axis 3: Technique (`technique`)
`cam-vot`, `phat-cau`, `dap-cau`, `bo-tro`, `phong-thu`, `tan-cong`, `di-chuyen`, `chien-thuat`

#### Axis 4: Equipment type (`equipment-type`)
`vot`, `giay`, `cuoc-vot`, `tui`, `phu-kien`

#### Axis 5: Equipment brand (`equipment-brand`)
`yonex`, `victor`, `lining` *(add new brands only when V2 reviews ≥3 products of that brand)*

#### Axis 6: Topic modifier (`topic-modifier`)
`chi-phi`, `lich-hoc`, `chan-thuong`, `chuan-bi`, `lich-trinh`, `dinh-duong`

#### Axis 7: Location modifier (`location`)
`binh-thanh`, `thu-duc` *(only V2 teaching districts; no other districts)*

#### Axis 8: Audience modifier (`audience`)
`tre-em`, `phu-huynh`, `nguoi-di-lam`, `doanh-nghiep`

**Tag rules:**
- A post should have **3-7 tags** drawn from 2-4 different axes.
- Tags do **not** create indexable URLs.
- Tag pages (if rendered internally for related-post logic) are `noindex, nofollow` and excluded from sitemap.
- Adding a new tag requires: business-owner approval + ≥3 posts that will use it.

### 11.3 Editorial metadata

- `excerpt` (text, max 200 chars)
- `publishedAt` (datetime)
- `updatedAt` (datetime, auto-managed)
- `lastReviewedAt` (date, manual)
- `status` (`draft | published | unlisted | archived`)
- `author` (reference to coach or `null` for editorial)
- `reviewedBy` (reference to coach or business owner, required at publish per §7 workflow)
- `reviewedAt` (datetime, set automatically when `reviewedBy` populated)

### 11.4 SEO fields

- `metaTitle` (string, optional override of `title`)
- `metaDescription` (text, max 160 chars)
- `canonicalUrl` (URL, optional)
- `noIndex` (boolean, explicit override)
- `ogImage` (image, optional override of `coverImage`)

### 11.5 AEO fields

- `quickAnswer` (text or Portable Text, 40-100 words)
- `targetQuestion` (string, optional)
- `faqs` (array of `{ question, answer, includeInSchema }`)

### 11.6 Schema fields

- `schemaTypes` (array; allowed: `Article`, `HowTo`, `Product`, `Review`, `Event`)
- `productRef`, `reviewRating`, `eventDetails` — only used when matching `schemaTypes` is selected
- **`AggregateRating` is NOT in this list** (per business answer Q7) — disabled by default and never to be added unless reviews are real, visible, third-party-verifiable, and compliant.

### 11.7 Affiliate / disclosure fields (per business answer Q1)

- `disclosureType` — enum: `none | affiliate | sponsored | gifted_product` (required on every `thiet-bi` post; defaults to `none`)
- `affiliateLinks` — array of `{ url, brand, productName, network }` (e.g. Yonex official, Shopee affiliate). Sanity validates that the `url` matches one of the recognized affiliate domains.
- `sponsoredStatus` — object: `{ isSponsored: boolean, sponsorName: string|null, sponsorDisclosurePolicy: string|null }` (the policy text shown in the disclosure block)
- `reviewPolicy` — reference to a static `reviewPolicy` document (singleton, lives at `/chinh-sach-danh-gia/` at the top level — **not** under `/blog/`, see §11.11) — every disclosure block links here
- `productProvidedFreeBy` — string|null (brand that gifted the reviewed product, if any)

**Render rule:** the disclosure block is rendered automatically by the post template based on `disclosureType`. The editor cannot disable the rendering when `disclosureType !== "none"` — this is V2's editorial policy. Legal/compliance review recommended before going live with the first affiliate or sponsored post.

### 11.8 Relationship fields

- `relatedServices` (array of references to money pages — primary CTA targets, required ≥1 for `nguoi-moi`, `ky-thuat`, `thiet-bi`)
- `relatedLocations` (array of references to location docs)
- `relatedCoaches` (array of references to coach docs)
- `relatedProducts` (array of references to product docs, for reviews)
- `featuredImage` (image, with `alt` field, required)
- `inlineImages` (managed within Portable Text; each image must have alt text)

### 11.9 Migration support fields

- `legacyFlatSlug` (string or `null`) — populated only if a legacy `/blog/<slug>/` URL needs to redirect to the new nested URL (rare per §4 finding).
- `redirectsFrom` (array of strings) — additional old slugs that redirect to this post.

### 11.10 Validation rules (Sanity)

- `slug` unique across all `post` documents.
- `primaryCategory` required before publish.
- `metaDescription` required before publish.
- `quickAnswer` required before publish on `nguoi-moi`, `ky-thuat`, `thiet-bi`.
- `faqs.length >= 3` required if `schemaTypes` includes `FAQPage`.
- `relatedServices.length >= 1` required before publish on `nguoi-moi`, `ky-thuat`, `thiet-bi`.
- `disclosureType` required on all `thiet-bi` posts.
- `reviewedBy` required at publish (workflow gate per §7).
- For `thiet-bi`: if any `affiliateLinks` entry exists, `disclosureType` cannot be `none`.

### 11.11 New static page to ship with CMS

- `/chinh-sach-danh-gia/` — review policy page explaining V2's editorial standards, affiliate disclosure practices, conflict-of-interest policy, and reviewer credentials. Linked from every disclosure block. Single static page in `src/app/(site)/chinh-sach-danh-gia/page.tsx`.

**Why top-level (not `/blog/chinh-sach-danh-gia/`):** under the long-term `/blog/[category]/[slug]/` pattern, any URL under `/blog/` should be either a category archive (`/blog/<category>/`) or a post (`/blog/<category>/<slug>/`). `/blog/chinh-sach-danh-gia/` would be parsed as a category called `chinh-sach-danh-gia`, which doesn't exist. Putting the policy page at the top level avoids the route collision and matches existing top-level static pages like `/chinh-sach-bao-mat/`.

---

## 12. Post-CMS Launch Backlog

> **Status:** This is the launch backlog of the first 10 posts to publish **after CMS migration completes**. Per business answers Q11 and Q12, **none of these posts are part of the current 30-day SEO + AEO plan**.

Priority-ordered for SEO impact + AEO citation potential + editorial feasibility once cadence is real.

| # | Suggested title | URL | Main intent | Links to | Why SEO/AEO |
|---|---|---|---|---|---|
| 1 | Người mới học cầu lông bao lâu thì đánh được cơ bản? | `/blog/nguoi-moi/nguoi-moi-hoc-cau-long-bao-lau-thi-danh-duoc/` | "Should I start, how long" | `/hoc-cau-long-cho-nguoi-moi/`, `/hoc-cau-long-1-kem-1/` | Single-question Q-led format — high AI Overview pickup |
| 2 | Học cầu lông nhóm vs 1 kèm 1 — nên chọn loại nào? | `/blog/nguoi-moi/lop-nhom-vs-1-kem-1/` | Comparison decision | `/hoc-cau-long-1-kem-1/`, `/gia-hoc-cau-long-tphcm/` | Comparison extracts cleanly on Perplexity |
| 3 | Trẻ em mấy tuổi học cầu lông được? Lộ trình đề xuất | `/blog/nguoi-moi/tre-em-may-tuoi-hoc-cau-long-duoc/` | Parent intent | `/lop-cau-long-tre-em/`, `/huan-luyen-vien/` | High-intent parent query, low competition VN |
| 4 | Cách chọn vợt cầu lông cho người mới (dưới 1 triệu) | `/blog/thiet-bi/vot-cau-long-cho-nguoi-moi-duoi-1-trieu/` | Equipment buying | `/hoc-cau-long-cho-nguoi-moi/` | Commercial-investigation query; sets `thiet-bi` editorial + disclosure template |
| 5 | Sân Green Bình Thạnh: cơ sở vật chất và lưu ý cho học viên V2 | `/blog/san-tap/san-green-binh-thanh/` | Student court info | `/lop-cau-long-binh-thanh/` | V2 teaching location; local SEO |
| 6 | Sân Huệ Thiên Thủ Đức: cơ sở vật chất và cách di chuyển | `/blog/san-tap/san-hue-thien-thu-duc/` | Student court info | `/lop-cau-long-thu-duc/` | V2 teaching location |
| 7 | Cách cầm vợt forehand đúng cho người mới | `/blog/ky-thuat/cach-cam-vot-forehand-cho-nguoi-moi/` | Beginner technique | `/hoc-cau-long-1-kem-1/` | Anchor `ky-thuat`; visual content |
| 8 | 5 bài tập chân cầu lông tập tại nhà cho người mới | `/blog/ky-thuat/bai-tap-chan-cau-long-tai-nha/` | At-home practice | `/hoc-cau-long-cho-nguoi-moi/`, `/hoc-cau-long-1-kem-1/` | Pairs with #7 |
| 9 | Chọn giày cầu lông cho người mới và trung cấp | `/blog/thiet-bi/chon-giay-cau-long-nguoi-moi-trung-cap/` | Equipment buying | `/hoc-cau-long-cho-nguoi-moi/` | Second equipment review |
| 10 | Học cầu lông buổi tối có lợi gì cho người đi làm? | `/blog/nguoi-moi/loi-ich-tap-cau-long-cho-nguoi-di-lam/` | Wellness decision | `/lop-cau-long-buoi-toi/`, `/lop-cau-long-cuoi-tuan/` | Routes working-adult traffic |

### Category distribution

- `nguoi-moi`: 4 posts (40%)
- `ky-thuat`: 2 posts (20%)
- `thiet-bi`: 2 posts (20%) — both with mandatory disclosure blocks
- `san-tap`: 2 posts (20%) — both V2 teaching locations only
- `tin-v2`: 0 posts — delayed until cadence is proven

### Sequencing & launch timing

- **Not part of the 30-day plan.** Launch begins after CMS migration is complete and editorial cadence is committed.
- **First 3 posts** (#1, #2, #3) publish in the same week of launch to anchor `nguoi-moi` toward the 5-post archive threshold.
- **Posts #4-#10** drip-release at 1-2 per week if cadence sustains.
- **Category archive indexing decisions** revisited 3 months after launch per §10 rules.

### Out-of-scope post types for the first 10

- Single-product racket reviews (e.g. Yonex Astrox 88D) — defer to month 2-3 of post-launch
- Coach interview posts — pending coach bios shipped in W3.3 of the 30-day plan, plus coach consent
- Event recap posts — none scheduled
- Court roundup posts ("Top X courts in district Y") — **never** per §5.4 scope rule

---

## 13. Risks and Things to Avoid

| Risk | Why dangerous | Mitigation |
|---|---|---|
| **Publishing blog posts during the current 30-day plan** | Diverts effort from service pages, About, coach bios, and CMS prep | All blog work deferred to post-CMS launch per business answer Q11+Q12 |
| **Too many launch categories** | Each needs ≥5 strong posts + cadence to indexable archive; spreading thin = no archive ever indexes | Five-category cap; tin-v2 explicitly delayed |
| **Audience-based slugs** | Audiences overlap; duplicate signal | Rejected in §5 |
| **Court reviews drifting into roundup/comparison territory** | Competitor framing risk; scope creep | V2 teaching locations only per §5.4 + §6.4 |
| **Affiliate links without disclosure** | Google E-E-A-T penalty + Vietnamese consumer-protection regulatory risk | Mandatory `disclosureType` field + auto-rendered disclosure block (§6.3 + §11.7). Legal/compliance review recommended before going live with first affiliate or sponsored post. |
| **Reviewing competitor courts or centers** | Legal risk + Google's "helpful content" penalty + business policy | Explicit prohibition per business answer Q8 |
| **Equipment review without coach perspective** | Just rewrites specs; nothing differentiated | Mandatory "Trải nghiệm thực tế" section + coach review per §6.3 |
| **FAQ schema on hidden accordion content** | Google may flag as deceptive | All FAQ Q&As must be in initial HTML |
| **Cannibalization** | Multiple posts splitting authority on same query | Pre-publish keyword check + reviewer enforcement |
| **Slug changes without redirects** | Lost backlinks | `legacyFlatSlug` + `redirectsFrom` + Proxy (Next 16 `src/proxy.ts`) |
| **Indexable category filter URLs** | Infinite duplicate-content variants | Permanent `noindex` on query-param filters per §10 |
| **Indexable tag URLs** | Multiplicative thin pages | Tag URLs **not created** per §10 + Q9 |
| **Coach posts duplicating /huan-luyen-vien/** | Page competition | Coach pages = directory bios; blog posts = interviews/philosophy, not bio copy |
| **`tin-v2` launched without cadence** | Stale archive | Delay until ≥2 posts/month sustained 6+ months per §5.5 |
| **Promoting category archive to indexable too early** | Thin archive | All thresholds in §10 must hit |
| **`AggregateRating` added prematurely** | Schema/visible mismatch penalty | Disabled by default per Q7 + §11.6 |
| **Untested Product/Review/Event schema** | GSC errors | Default to `["Article"]`; opt-in per post |
| **Brand bias in equipment reviews** | E-E-A-T flag | Cover multiple brands per axis (`thiet-bi/giay/` should review Yonex AND Victor AND Lining over time, not Yonex exclusively) |
| **Publishing without reviewer sign-off** | Liability for technique/equipment claims | `reviewedBy` is a hard publish gate (§11.10) |

---

## 14. Open Questions

### Answered by business (Revision 2)

| # | Question | Answer | Reflected in |
|---|---|---|---|
| 1 | Affiliate links on equipment reviews? | **Yes**, with mandatory disclosure | §6.3, §11.7, §13 |
| 2 | Are court reviews about competitors? | **No** — V2 teaching locations only | §5.4, §6.4, §8 |
| 3 | Editorial cadence? | Unknown — assume conservative | §5 (all archives noindex), §10 thresholds |
| 4 | Reviewer? | Business owner or qualified coach | §6 mandatory reviewer per template, §7 workflow, §11.3 |
| 5 | Existing /blog/<slug>/ posts? | **None checked in to repo; production count unverified** | §4 codebase findings + pre-migration check |
| 6 | Existing category enum referenced externally? | **No — internal only** | §4 codebase findings, §5 migration table |
| 7 | Verifiable reviews on third-party platforms? | Yes (planned), AggregateRating disabled until they exist | §11.6, §13 |
| 8 | Competitor content? | **None** — no competitor coaches, no competitor centers | §1, §5.4, §5.6, §6.2, §6.4, §6.8, §13 |
| 9 | Tag vocabulary? | **Controlled from launch** | §11.2 (30-tag launch vocabulary across 8 axes) |
| 10 | Route migration approach? | **Clean cutover recommended** (zero production posts pending verification) | §4 short/long-term path |
| 11 | First 10 posts in 30-day plan? | **No — move to post-CMS launch backlog** | §12 reframed |
| 12 | Post swaps? | **No — defer entire blog launch** | §12 reframed |

### Remaining open question

| # | Question | Asked of | Why needed |
|---|---|---|---|
| 13 | Confirm production Sanity has zero published posts at `_type == "post"` | Business / Sanity admin | Determines whether §4 clean-cutover path is safe or whether legacy redirects need to be planned. Run query: `*[_type == "post" && status == "published"]{ slug, publishedAt }` in Sanity Vision. Results must be captured in the [CMS Migration Handoff Brief](./cms-migration-handoff-brief.md) §4 before migration begins. |

If question 13's answer reveals existing published posts, those need a per-post decision: preserve URL (308 redirect from new structure → old slug, keep old URL canonical) OR migrate URL (308 from old → new). The default recommendation is to migrate URLs unless a post has demonstrable Search Console traffic.

---

## Summary of changes from Revision 1

(For my approval check at the end — these are the changes I made in this revision.)

1. **Top-level reframing:** all blog publishing moved to post-CMS launch backlog. The current 30-day plan does no blog work beyond preserving the existing noindex-when-empty behavior.
2. **§4 route strategy:** added codebase inspection results showing zero checked-in posts and zero external references to the category enum. Recommended clean cutover with one pre-migration check.
3. **§5.4 court reviews:** rewrote scope to V2 teaching locations only. Removed "top X courts" roundup framing. Court reviews now help students decide whether a court is right for them.
4. **§5.5 tin-v2:** strengthened delay rules — permanent `noindex` until ≥2 posts/month sustained 6+ months.
5. **§6.2, §6.4, §6.8:** added explicit "no competitor framing" rule across comparison, court, and coach templates.
6. **§6.3 equipment reviews:** added mandatory affiliate disclosure block, three variants (`affiliate`, `sponsored`, `gifted_product`), technical link rules (`rel="sponsored nofollow"`, `rel="noopener noreferrer"`), required `/chinh-sach-danh-gia/` policy page at top-level URL.
7. **§6 templates:** added per-template `Reviewer` line. Technique/equipment/court reviews require mandatory coach review.
8. **§7 writing rules:** added editorial review workflow as explicit step.
9. **§10 archive indexing:** tightened thresholds — added cadence requirement (3+ months of ≥1 post/month per category). Tag URLs explicitly excluded.
10. **§11.2 controlled tag vocabulary:** new section listing ~30 launch tags across 8 axes (skill-level, body-focus, technique, equipment-type, equipment-brand, topic-modifier, location, audience).
11. **§11.7 affiliate fields:** new section — `disclosureType`, `affiliateLinks`, `sponsoredStatus`, `reviewPolicy`, `productProvidedFreeBy`.
12. **§11.10 validation:** added `reviewedBy` as hard publish gate, plus disclosure-required rule.
13. **§11.11:** new static `/chinh-sach-danh-gia/` policy page added as a required deliverable (top-level URL, not under `/blog/`).
14. **§11.6:** `AggregateRating` explicitly excluded from default `schemaTypes`.
15. **§12 first 10 posts:** reframed as "Post-CMS Launch Backlog". Removed Week 4 sequencing language. Replaced post #5 and #6 (district roundups) with single-court reviews for `san-tap` per §5.4 scope rule.
16. **§13 risks:** added: launching blog work during 30-day plan, court-review scope creep, brand bias in reviews, missing reviewer sign-off, indexable tag URLs.
17. **§14 questions:** marked Q1-Q12 as answered, added Q13 (production post count confirmation).

---

## Proposed changes to the Unified SEO + AEO 30-Day Plan

> **Awaiting your approval before applying these.**

If you approve this revised memo, I would update [seo-aeo-30-day-unified-plan.md](./seo-aeo-30-day-unified-plan.md) as follows:

1. **§4 Blog Route + Taxonomy Standard** — replace the current "stay on flat URLs, keep existing categories" recommendation with: "blog publishing deferred to post-CMS launch; see [blog memo](./blog-route-taxonomy-decision-memo.md); current plan only preserves the empty-blog noindex behavior."
2. **§8 Week 4 — Topical Authority, Sitemap Freshness, Monitoring** — remove Task W4.1 (5 blog posts) entirely. Remove Task W4.5 (category filter noindex threshold) since no posts will exist. Repurpose Week 4 with these tasks instead:
   - W4.1 (new): **CMS migration preparation deliverable** — produce the CMS migration plan as a separate doc, including: tag taxonomy seed data, schema definitions for new post fields (§11.7 affiliate fields, §11.2 tags), migration script for old enum → new enum, route file restructure plan, `/chinh-sach-danh-gia/` policy page draft.
   - W4.2 (unchanged): Stabilize sitemap `lastModified`.
   - W4.3 (modified): Submit to GSC — but only for the money pages from Week 2 and the new About page from Week 3 (no blog URLs).
   - W4.4 (modified): AI search citation tracking — same monitoring spreadsheet, but blog-specific queries deferred to post-launch.
3. **§9 Unified Tracking Checklist** — update Week 4 entries to reflect the above.
4. **§11 Final Recommendation** — clarify that blog launch is a post-CMS milestone, not a 30-day deliverable. Update "Can wait for the CMS migration plan" list with the now-explicit blog launch backlog.

I would **not** change Weeks 1-3 of the unified plan — those remain focused on service pages, schema, About, coaches, indexing cleanup.

---

**Next step:** review this memo and confirm whether to proceed with the unified-plan updates listed above. If you spot anything to adjust in the memo first, let me know before I touch the unified plan.
