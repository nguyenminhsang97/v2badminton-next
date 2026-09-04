# AEO 30-Day Plan — Additions to the SEO Plan

> ⚠️ **Status as of 2026-09-04 — this document no longer describes the live site.**
> The site went live on `v2badminton.com` and all 13 money pages are published and in `sitemap.xml`.
> Sources moved from `src/…` to `apps/web/src/…` in the workspace split (`d2797bd`), so every file path
> below is one level off. Weeks 1-4 of the code work shipped; what is unverified here is the operational
> follow-up (Search Console submission, Core Web Vitals review, coach bios). Treat this as a historical
> record of intent, not a to-do list — verify against production before acting on any item.
>

This document **adds** AEO (Answer Engine Optimization) tasks on top of [seo-30-day-execution-plan.md](./seo-30-day-execution-plan.md). Do the SEO tasks first each week; these AEO tasks layer on.

**Why a separate doc:** AEO success depends on the SEO foundations already in motion (real Sanity content, no thin pages, indexable HTML). Don't start the AEO content tasks until the matching SEO week's deliverables are in.

---

## What "AEO ready" actually means here

You are NOT implementing any special AI-only files (no `llms.txt`, no AI-only schema, no `AI-content` meta tag — those are not real standards).

You ARE making the site easier for Google AI Overviews, ChatGPT Search, Perplexity, and Bing Copilot to *quote a clean sentence from*. That requires:

1. The page answers the user's question in the first 100-150 words, in plain HTML.
2. The answer is specific (names, addresses, numbers) not vague ("nhiều sân", "linh hoạt").
3. The page entity is unambiguous (business name, service area, who it's for, what it costs).
4. Schema matches the visible content.
5. Trust signals (real names, photos, credentials) are visible to the crawler.

---

## Week 1 additions — Code: QuickAnswer block + service-area visibility

Do AFTER Week 1 SEO tasks 1.1-1.5 land.

### Task A.1 — Add service area to homepage body HTML

**Why:** Currently "Bình Thạnh · Thủ Đức" only appears inside the nav logo subtitle ([Nav.tsx:140](../src/components/layout/Nav.tsx:140)). AI crawlers prioritize body content. The homepage should explicitly state service area in a heading or paragraph.

**Files:** `src/components/home/sections/HeroSection.tsx` or whichever section directly follows the hero.

**Steps:**
1. Pick a sentence to add right after the hero CTA block. Suggested:
   ```tsx
   <p className="hero__service-area">
     V2 Badminton dạy cầu lông tại Bình Thạnh (sân Green) và Thủ Đức
     (Huệ Thiên, Khang Sport, Phúc Lộc), TP.HCM.
   </p>
   ```
2. Use concrete court names — they're entity signals AI can match.
3. Coordinate with design — this might fit better in the section directly *after* the hero rather than inside it.

**Verify:** `curl https://your-preview-url/` and `Select-String "Bình Thạnh"` on the response — must appear in body HTML, not just in `<title>` or nav.

**DoD:**
- [ ] Sentence visible in initial HTML (view-source).
- [ ] No CLS regression.

---

### Task A.2 — Build a reusable `QuickAnswer` component for money pages

**Why:** [MoneyPageTemplate.tsx:107-141](../src/components/money-page/MoneyPageTemplate.tsx:107) has no extractable answer block. AI must infer who/where/price from scattered sections. A single 2-3 sentence block at the top — generated automatically from existing Sanity fields — fixes this.

**Files:** new file `src/components/money-page/QuickAnswer.tsx`, plus edit `MoneyPageTemplate.tsx`.

**Steps:**
1. Create `src/components/money-page/QuickAnswer.tsx`:
   ```tsx
   import type { SanityMoneyPage } from "@/lib/sanity";

   const AUDIENCE_LABEL: Record<SanityMoneyPage["audience"], string> = {
     nguoi_moi: "người mới bắt đầu",
     tre_em: "trẻ em",
     nguoi_di_lam: "người đi làm",
     doanh_nghiep: "doanh nghiệp",
   };

   function buildLocationPhrase(locations: SanityMoneyPage["relatedLocations"]) {
     if (locations.length === 0) {
       return "tại Bình Thạnh và Thủ Đức";
     }
     const names = locations
       .map((loc) => `${loc.name} (${loc.districtLabel})`)
       .join(", ");
     return `tại ${names}`;
   }

   function buildPricePhrase(pricing: SanityMoneyPage["relatedPricing"]) {
     if (pricing.length === 0) return null;
     const tier = pricing[0];
     if (tier.kind === "group") {
       return `Học phí từ ${new Intl.NumberFormat("vi-VN").format(tier.pricePerMonth)} VNĐ/tháng`;
     }
     if (tier.kind === "private") {
       return `Học phí từ ${new Intl.NumberFormat("vi-VN").format(tier.pricePerHour)} VNĐ/buổi`;
     }
     return null;
   }

   export function QuickAnswer({ page }: { page: SanityMoneyPage }) {
     const audience = AUDIENCE_LABEL[page.audience];
     const location = buildLocationPhrase(page.relatedLocations);
     const price = buildPricePhrase(page.relatedPricing);

     return (
       <aside className="money-page__quick-answer" aria-label="Tóm tắt nhanh">
         <p className="money-page__quick-answer-eyebrow">Tóm tắt nhanh</p>
         <p>
           V2 Badminton mở <strong>{page.h1.toLowerCase()}</strong> cho{" "}
           {audience} {location}.
           {price ? ` ${price}.` : ""} Đăng ký buổi học thử để được tư vấn
           lộ trình và lịch phù hợp.
         </p>
       </aside>
     );
   }
   ```

2. In `MoneyPageTemplate.tsx`, render `<QuickAnswer page={page} />` immediately after the `money-page__intro` div (around line 117).
3. **Only render when not a fallback page.** Pass an `isFallback` flag or check `page.id.startsWith("fallback:")` and skip the QuickAnswer for fallback content — we don't want AI extracting a generic answer for unpublished pages.
4. Add styles to `src/styles/` (find the existing money-page stylesheet — match its pattern). The block should look like a callout box, not a banner.

**Verify:**
1. `npm run build && npm run start`.
2. Visit a published money page locally — confirm the QuickAnswer renders above the body content.
3. View source — the sentence must appear as plain text in initial HTML.
4. Run Google's Rich Results Test on the URL; no new schema warnings should appear (QuickAnswer is plain HTML, not schema).

**DoD:**
- [ ] Component compiles and types check.
- [ ] Renders on published money pages, hidden on fallback pages.
- [ ] Content is meaningful for at least 2 different audience values.
- [ ] No layout shift introduced.

---

## Week 2 additions — Content: answer-first writing

While the SEO plan asks you to publish 9 Sanity money pages with full content, **the order of sections inside each page matters for AEO**. Re-read the SEO plan's "Content template" — then apply these AEO-specific writing rules.

### Rule A.2.1 — Answer in the first paragraph, always

Every money page intro must answer the page's primary question in 2-3 sentences, plain language. Don't lead with marketing fluff. Example for `/hoc-cau-long-1-kem-1/`:

> ❌ **Avoid:** "V2 Badminton tự hào mang đến trải nghiệm học cầu lông đẳng cấp..."
>
> ✅ **Do:** "Học cầu lông 1 kèm 1 tại V2 Badminton phù hợp với học viên muốn HLV theo sát, sửa kỹ thuật nhanh hoặc cần lịch học linh hoạt. Mỗi buổi tập trung vào một mục tiêu cụ thể: cầm vợt, di chuyển, phát cầu, hoặc nâng trình. Lớp diễn ra tại sân Green (Bình Thạnh) và Huệ Thiên (Thủ Đức), TP.HCM."

### Rule A.2.2 — Use answer-shaped H2s

Each H2 should be a question users actually ask. Examples:
- "Học 1 kèm 1 phù hợp với ai?" not "Đối tượng phù hợp"
- "Mỗi buổi học diễn ra thế nào?" not "Quy trình buổi học"
- "Học phí bao nhiêu một buổi?" not "Học phí"
- "Bao lâu thì đánh được cơ bản?" not "Lộ trình"

### Rule A.2.3 — Include concrete entity data in every section

Always name actual courts, districts, prices, durations. AI engines reward specificity:
- "Sân Green ở Bình Thạnh, sân Huệ Thiên ở Thủ Đức" — not "nhiều sân"
- "Buổi học 90 phút" — not "thời lượng linh hoạt"
- "Học phí 2.500.000 VNĐ/tháng cho lớp nhóm 8 buổi" — not "học phí ưu đãi"

### Rule A.2.4 — Add a comparison section to `/hoc-cau-long-1-kem-1/` and `/gia-hoc-cau-long-tphcm/`

Comparison tables are the most-extracted format on Perplexity. Add a `<table>` (or styled grid) with 3-5 rows comparing:

| | Lớp nhóm | 1 kèm 1 |
|---|---|---|
| Quy mô | 2-6 học viên | 1 HLV / 1 học viên |
| Học phí | từ X VNĐ/tháng | từ Y VNĐ/buổi |
| Phù hợp với | người mới, học theo lịch cố định | người cần sửa kỹ thuật, lịch riêng |
| Tốc độ tiến bộ | đều đặn | nhanh hơn |

Store this as a structured block in Sanity (a new `comparisonTable` field) or just publish it as a Portable Text table for now.

### Rule A.2.5 — Each money page must have 5+ FAQs with `includeInSchema: true`

The fallback templates have `relatedFaqs: []` ([moneyPageFallback.ts](../src/lib/moneyPageFallback.ts)). When you publish the real Sanity content, attach minimum 5 FAQs. Pull from the [Missing Question Map](#d-missing-question-map) in the chat audit.

---

## Week 3 additions — About page + Person schema + service-area schema

### Task A.3 — Create `/gioi-thieu/` (About page)

**Why:** AI engines look for an entity-anchor page. Without one, the homepage gets used as a generic landing — making it harder to disambiguate "V2 Badminton" from other badminton businesses.

**Files:** new file `src/app/(site)/gioi-thieu/page.tsx` + a new Sanity document type OR a static page with handwritten content.

**Steps:**
1. Decide with the senior: Sanity-driven or static? Static is faster — go static unless the senior wants editability.
2. Create the page:
   ```tsx
   import type { Metadata } from "next";
   import { JsonLd } from "@/components/ui/JsonLd";
   import { buildBreadcrumbSchema, buildOrganizationSchema } from "@/lib/schema";
   import { canonicalUrl } from "@/lib/routes";
   import { siteConfig } from "@/lib/site";

   export const metadata: Metadata = {
     title: { absolute: "Giới thiệu V2 Badminton | Lớp cầu lông TP.HCM" },
     description:
       "V2 Badminton là đội ngũ huấn luyện cầu lông tại Bình Thạnh và Thủ Đức, TP.HCM, dạy người mới, trẻ em, người đi làm và doanh nghiệp.",
     alternates: { canonical: canonicalUrl("/gioi-thieu/") },
   };

   export default function AboutPage() {
     return (
       <article className="about-page">
         <JsonLd
           data={[
             buildOrganizationSchema(),
             buildBreadcrumbSchema([
               { name: "Trang chủ", item: canonicalUrl("/") },
               { name: "Giới thiệu", item: canonicalUrl("/gioi-thieu/") },
             ]),
           ]}
         />
         <h1>V2 Badminton — Lớp dạy cầu lông tại TP.HCM</h1>

         <section>
           <h2>V2 Badminton là ai?</h2>
           <p>{/* 2-3 sentences answering the entity question */}</p>
         </section>

         <section>
           <h2>Chúng tôi dạy ai?</h2>
           {/* List the 4 audiences with one-line each */}
         </section>

         <section>
           <h2>Đội ngũ huấn luyện viên</h2>
           {/* Short paragraph + link to /huan-luyen-vien/ */}
         </section>

         <section>
           <h2>Sân tập</h2>
           {/* Concrete court names with districts */}
         </section>

         <section>
           <h2>Cách liên hệ</h2>
           {/* Phone, Zalo, Facebook, address */}
         </section>
       </article>
     );
   }
   ```

3. Add `/gioi-thieu/` to the `ALWAYS_INDEX_PATHS` set you added in SEO Week 1 Task 1.2, OR add it directly to the sitemap as a legal-style entry. Coordinate with the senior on which.
4. Add a footer link to it.
5. Write the actual copy with the business lead — don't ship Lorem-style placeholders.

**Verify:** Page loads, schema validates, footer link works, no orphaned page warning.

**DoD:**
- [ ] Real content written.
- [ ] Page indexable.
- [ ] In sitemap.
- [ ] Linked from footer.

---

### Task A.4 — Add `buildPersonSchema()` for coaches

**Why:** Coach credentials live in [CoachCardsGrid.tsx](../src/components/coaches/CoachCardsGrid.tsx) as visible HTML but aren't in JSON-LD. Adding `Person` schema lets AI engines correlate coach names with the business.

**Files:** `src/lib/schema.ts`, `src/app/(site)/huan-luyen-vien/page.tsx`

**Steps:**
1. In `src/lib/schema.ts`, add:
   ```ts
   import type { HomepageCoach } from "@/domain/homepage";

   export function buildPersonSchema(coach: HomepageCoach): JsonLdNode {
     return {
       "@context": "https://schema.org",
       "@type": "Person",
       name: coach.name?.trim() ?? "HLV V2 Badminton",
       ...(coach.photoUrl ? { image: canonicalUrl(coach.photoUrl) } : {}),
       ...(coach.roleBadge ? { jobTitle: coach.roleBadge } : {}),
       worksFor: {
         "@type": "Organization",
         "@id": `${siteConfig.siteUrl}/#organization`,
       },
       ...(coach.credentialTags.length > 0
         ? { hasCredential: coach.credentialTags }
         : {}),
     };
   }
   ```
2. In `src/app/(site)/huan-luyen-vien/page.tsx`, when coaches exist, render `<JsonLd data={coaches.map(buildPersonSchema)} />` at the top of the page body.
3. Verify each rendered Person has a real name in Sanity — don't emit schema for `"HLV V2 Badminton"` placeholder names. Filter those out before mapping.

**Verify:** Rich Results Test on `/huan-luyen-vien/` shows `Person` entries with no warnings.

**DoD:**
- [ ] Builder typed and exported.
- [ ] Only emits for coaches with real names.
- [ ] Schema validates.

---

### Task A.5 — Add `Speakable` markers to homepage + About

**Why:** Voice assistants (Google Assistant, Bing voice) use `Speakable` to pick a sentence to read aloud. Low effort, real benefit.

**Files:** `src/app/(site)/page.tsx` and `src/app/(site)/gioi-thieu/page.tsx`

**Steps:**
1. Pick the sentence(s) most worth reading aloud on each page. Add a CSS class like `speakable` to those elements (the H1 + the QuickAnswer paragraph).
2. Add this to the existing homepage JsonLd array:
   ```ts
   {
     "@context": "https://schema.org",
     "@type": "WebPage",
     "@id": `${siteConfig.siteUrl}/#webpage`,
     speakable: {
       "@type": "SpeakableSpecification",
       cssSelector: [".hero__heading", ".hero__service-area"],
     },
   }
   ```
3. Do the same for the About page with its H1 and intro.

**Verify:** Validator passes. No visual change.

**DoD:**
- [ ] Two pages have Speakable schema.
- [ ] CSS selectors match real elements (test in dev tools).

---

## Week 4 additions — Question-led content + monitoring

### Task A.6 — Publish 2 question-led blog posts (in addition to the 3 in SEO Week 4)

These two are explicitly question-shaped — perfect for AI Overview pickup:

1. **`/blog/nguoi-moi-hoc-cau-long-bao-lau-thi-danh-duoc/`**
   - H1: "Người mới học cầu lông bao lâu thì đánh được cơ bản?"
   - First paragraph must answer in one sentence (e.g., "Trung bình 6-8 tuần với lịch học 2 buổi/tuần là đủ để người mới đánh được các kỹ thuật cơ bản: cầm vợt, di chuyển, phát cầu thấp/cao, và đánh trái-phải tay.")
   - Then expand with: "Phụ thuộc vào...", "Lộ trình tuần 1-2 / 3-4 / 5-8", "Khi nào nên chuyển sang nâng cao".
   - Internal links: `/hoc-cau-long-cho-nguoi-moi/`, `/hoc-cau-long-1-kem-1/`.

2. **`/blog/lop-cau-long-nhom-vs-1-kem-1/`**
   - H1: "Nên chọn lớp cầu lông nhóm hay học 1 kèm 1?"
   - First paragraph: direct comparison answer.
   - Add a comparison table.
   - Internal links: `/hoc-cau-long-1-kem-1/`, `/gia-hoc-cau-long-tphcm/`.

### Task A.7 — AI search monitoring

Set up a simple manual check on a calendar reminder:

1. **Weekly:** Search these queries in Google AI Overviews, ChatGPT Search, and Perplexity. Note whether V2 Badminton appears as a citation:
   - `học cầu lông tphcm`
   - `học cầu lông 1 kèm 1 sài gòn`
   - `lớp cầu lông cho người mới TP.HCM`
   - `lớp cầu lông bình thạnh`
   - `team building cầu lông`
2. **Track in a spreadsheet:** date / query / engine / citation Y/N / which page was cited.
3. **After 2 weeks:** review which pages are getting cited. Those are your AEO winners — apply their pattern to weaker pages.

**DoD:**
- [ ] Tracking spreadsheet exists.
- [ ] One full week of data collected before end of Week 4.

---

## Why this is sufficient (no llms.txt needed)

You may see advice online to add `llms.txt`, "AI-friendly robots", or special meta tags. None are real standards. Google AI Overviews, Bing Copilot, and Perplexity all crawl regular HTML. ChatGPT Search uses Bing's index. The actual levers are:

1. Server-rendered HTML — ✅ already done (Next.js App Router default).
2. Plain-language answers in the first paragraph — addressed in Tasks A.1, A.2, Week 2 rules.
3. Specific entity data — addressed in A.1, A.3.
4. Verifiable trust signals — addressed in A.3, A.4, SEO Week 3.
5. Schema that matches visible content — already mostly in place + A.4, A.5.
6. Indexable pages with no thin content — addressed in SEO Week 1 + 2.

If the senior wants you to add an `llms.txt` for completeness, it's harmless and takes 10 minutes — but don't let it substitute for the above.

---

## Tracking checklist (paste into your AEO PRs)

```
Week 1 AEO
- [ ] A.1 Service area added to homepage body HTML
- [ ] A.2 QuickAnswer component rendered on published money pages

Week 2 AEO
- [ ] All money pages follow answer-first intro rule
- [ ] All money pages use question-shaped H2s
- [ ] Comparison sections added to 1-kèm-1 and giá học
- [ ] All money pages have 5+ FAQs

Week 3 AEO
- [ ] A.3 /gioi-thieu/ page live with real content
- [ ] A.4 Person schema rendering on /huan-luyen-vien/
- [ ] A.5 Speakable schema on homepage + about

Week 4 AEO
- [ ] A.6 Two question-led blog posts live
- [ ] A.7 AI search citation tracking spreadsheet running
```
