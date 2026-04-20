# S8 SEO Technical Audit

Audit branch: `feat/seo-technical`  
Audit date: `2026-04-20`

Scope covered:

- Homepage `/`
- Money pages:
  - `/hoc-cau-long-cho-nguoi-moi/`
  - `/lop-cau-long-tre-em/`
  - `/lop-cau-long-cho-nguoi-di-lam/`
  - `/cau-long-doanh-nghiep/`
  - `/hoc-cau-long-1-kem-1/`
  - `/lop-cau-long-binh-thanh/`
  - `/lop-cau-long-thu-duc/`
- Coach pages
- Blog listing and blog post route
- Sitemap, robots, canonical
- Image `alt`

Method:

- Code audit of:
  - `src/app/(site)/**/*`
  - `src/components/money-page/*`
  - `src/lib/{schema,routes,moneyPageMetadata,site}.ts`
  - `src/components/ui/JsonLd.tsx`
- Runtime spot check on local HTML for title/meta/canonical/schema tags.

## Summary Findings

1. Homepage schema coverage is strong: `Organization`, `WebSite`, `LocalBusiness`, `FAQPage`, and `Course` are already present.
2. Service-type money pages are missing `Course` schema. Current shared money-page structured data only emits `BreadcrumbList`, `LocalBusiness`, and optional `FAQPage`.
3. Blog post pages emit `Article` schema but do not emit `BreadcrumbList`.
4. Blog listing page emits no structured data and has no `openGraph` image or twitter tags.
5. `src/app/sitemap.ts` exists, but runtime sitemap currently omits several published money pages. In-scope omission: `/hoc-cau-long-1-kem-1/`.
6. `src/app/robots.ts` exists, but it does not disallow `/api/`.
7. Runtime audit of `/hoc-cau-long-1-kem-1/` returned default site head with no canonical and no JSON-LD. This needs manual re-check before code changes in commit 2/3 because the route file itself looks wired correctly.
8. Internal linking from homepage to money pages exists, but money page to money page cross-linking is absent.
9. Image alt coverage is clean: no missing `alt` attribute and no empty `alt=""` found in `src/**/*.tsx`.

## 1. Schema Audit

| Page | Current schema types | Recommended schema types | Status | Concrete gap |
| --- | --- | --- | --- | --- |
| `/` | `Organization`, `WebSite`, `LocalBusiness`, `SportsActivityLocation`, `FAQPage`, `Course x4` | `Organization`, `WebSite`, `LocalBusiness`, `FAQPage`, `Course` | Pass | Homepage already covers the required baseline in `src/app/(site)/page.tsx`. |
| `/hoc-cau-long-cho-nguoi-moi/` | `BreadcrumbList`, `FAQPage` | `Course`, `FAQPage`, `BreadcrumbList` | Missing | No `Course` schema. Route is custom and only emits breadcrumb + FAQ in `src/app/(site)/hoc-cau-long-cho-nguoi-moi/page.tsx`. |
| `/lop-cau-long-tre-em/` | `BreadcrumbList`, `LocalBusiness`, `SportsActivityLocation` | `Course`, `FAQPage`, `BreadcrumbList` | Missing | Missing `Course`. `FAQPage` also absent in runtime output. Shared route uses generic business schema via `MoneyPageStructuredData`. |
| `/lop-cau-long-cho-nguoi-di-lam/` | `BreadcrumbList`, `LocalBusiness`, `SportsActivityLocation`, `FAQPage` | `Course`, `FAQPage`, `BreadcrumbList` | Missing | Missing `Course`. Shared route uses business schema where course schema is expected. |
| `/cau-long-doanh-nghiep/` | `BreadcrumbList`, `LocalBusiness`, `SportsActivityLocation`, `FAQPage` | `BreadcrumbList` + enterprise-specific schema if available | Needs review | Reuses homepage-style `LocalBusiness`. No dedicated B2B/Service schema builder exists yet. |
| `/hoc-cau-long-1-kem-1/` | Runtime: none detected | `Course`, `FAQPage`, `BreadcrumbList` | Missing / runtime anomaly | Local runtime returned default head without JSON-LD. Code path points to shared money-page helper, so this needs re-check before patching. |
| `/lop-cau-long-binh-thanh/` | `BreadcrumbList`, `LocalBusiness`, `SportsActivityLocation`, `FAQPage` | `LocalBusiness`, `BreadcrumbList` | Pass | Local page already uses `buildLocalPageBusinessSchema` in `src/app/(site)/lop-cau-long-binh-thanh/page.tsx`. |
| `/lop-cau-long-thu-duc/` | `BreadcrumbList`, `LocalBusiness`, `SportsActivityLocation`, `FAQPage` | `LocalBusiness`, `BreadcrumbList` | Pass | Local page already uses `buildLocalPageBusinessSchema` in `src/app/(site)/lop-cau-long-thu-duc/page.tsx`. |
| `/huan-luyen-vien/` | none | Coach detail route: `Person`, `BreadcrumbList` | Route absent | There is a listing page only. No coach detail route exists, so `Person` schema cannot be emitted yet. |
| `/blog/` | none | Listing schema optional, not required by current brief | Weak coverage | No JSON-LD on the listing page. Not a blocker for commit 2 if we keep scope to current minimums. |
| `/blog/[slug]/` | `Article` | `Article`, `BreadcrumbList` | Missing | `Article` schema exists, but no breadcrumb schema is emitted in `src/app/(site)/blog/[slug]/page.tsx`. |

### Schema Source Notes

- Homepage schemas are emitted in `src/app/(site)/page.tsx`.
- Shared money-page schema lives in `src/components/money-page/MoneyPageStructuredData.tsx`.
- Shared money-page schema currently reuses `buildHomepageLocalBusinessSchema`, which is too generic for course/service pages.
- Location pages already have a dedicated builder: `buildLocalPageBusinessSchema`.

## 2. Meta / Open Graph Audit

Runtime target:

- Title: `50-60`
- Description: `150-160`

| Page | Title length | Description length | OG image | OG type | Twitter card | Canonical | Status | Finding |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | `58` | `174` | Pass | `website` | Pass | Pass | Needs trim | Homepage description is too long. |
| `/hoc-cau-long-cho-nguoi-moi/` | `60` | `112` | Pass | `website` | Pass | Pass | Too short | Description is short for target range. |
| `/lop-cau-long-tre-em/` | `45` | `110` | Pass | `website` | Pass | Pass | Short / too short | Title and description are both under target. |
| `/lop-cau-long-cho-nguoi-di-lam/` | `55` | `118` | Pass | `website` | Pass | Pass | Too short | Description is under target. |
| `/cau-long-doanh-nghiep/` | `60` | `122` | Pass | `website` | Pass | Pass | Too short | Description is under target. |
| `/hoc-cau-long-1-kem-1/` | Runtime: `12` | Runtime: `57` | Missing in runtime | Missing in runtime | Missing in runtime | Missing in runtime | Manual review | Runtime output fell back to default site head during audit. Source file exists, but this route needs manual confirmation. |
| `/lop-cau-long-binh-thanh/` | `50` | `116` | Pass | `website` | Pass | Pass | Too short | Description is under target. |
| `/lop-cau-long-thu-duc/` | `70` | `111` | Pass | `website` | Pass | Pass | Too long / too short | Title is too long; description is under target. |
| `/blog/` | `19` | `79` | Missing | Missing | Missing | Pass | Weak | Listing page has title and description, but no OG image, no OG type, and no twitter card. |
| `/blog/[slug]/` | Dynamic | Dynamic | Conditional | `article` | Not explicit | Pass | Source-dependent | Description comes from `metaDescription ?? excerpt ?? ""`; can be blank if both are missing. Breadcrumb schema also missing. |
| `/huan-luyen-vien/` | `38` | `85` | Pass | `website` | Pass | Pass | Short / too short | Listing page metadata exists but both title and description are short. |

### Meta Infrastructure Findings

- `src/lib/routes.ts` provides canonical + openGraph coverage for `coreRoutes`, but description lengths vary widely.
- `src/lib/moneyPageMetadata.ts` sets canonical and OG image, but does not add its own twitter config.
- Blog listing and coach listing use hand-written `metadata` objects instead of shared builders.
- `public/og-image.jpg` exists, so a default OG asset is available.

## 3. Internal Linking Audit

### Homepage → Money Pages

| Source | Route targets | Count | Finding |
| --- | --- | --- | --- |
| `CourseSection` | `/lop-cau-long-tre-em/`, `/hoc-cau-long-cho-nguoi-moi/`, `/lop-cau-long-cho-nguoi-di-lam/`, `/hoc-cau-long-1-kem-1/` | `4` | Main decision-gate links are present. |
| Footer featured routes | `/hoc-cau-long-cho-nguoi-moi/`, `/lop-cau-long-binh-thanh/`, `/lop-cau-long-thu-duc/`, `/lop-cau-long-tre-em/`, `/lop-cau-long-cho-nguoi-di-lam/`, `/cau-long-doanh-nghiep/` | `6` | Footer covers six core money pages. |
| Homepage main content | `/lop-cau-long-binh-thanh/`, `/lop-cau-long-thu-duc/`, `/cau-long-doanh-nghiep/` | `0` | These routes are only discoverable from the footer, not from homepage content blocks. |

### Money Pages → Homepage

| Page type | Home root link | Home anchor link | Finding |
| --- | --- | --- | --- |
| Money pages via `MoneyPageTemplate` | Yes, through breadcrumb `Trang chủ` | Yes, CTA to `/#lien-he` or `/?mode=business#lien-he` | Coverage exists, but only for contact intent. |
| Money pages | No links to `/#khoa-hoc`, `/#hoc-phi`, or `/#lich-hoc` | No | Relevant homepage anchors are not cross-linked yet. |

### Money Page ↔ Money Page Cross-linking

| Route group | Current state | Finding |
| --- | --- | --- |
| Money page template | None | No cross-link block exists in `MoneyPageTemplate.tsx`. |
| Blog post → money page | Conditional | `src/app/(site)/blog/[slug]/page.tsx` can link to one related money page via `relatedMoneyPageSlug`. |

## 4. H1 / H2 / H3 Hierarchy Audit

Runtime HTML counts from local dev server:

| Page | H1 | H2 | H3 | Status | Finding |
| --- | --- | --- | --- | --- | --- |
| `/` | `1` | `8` | `21` | Pass | Single H1 on homepage; hierarchy starts correctly from hero to section H2s. |
| `/hoc-cau-long-cho-nguoi-moi/` | `1` | `8` | `11` | Pass | Single H1. |
| `/lop-cau-long-tre-em/` | `1` | `6` | `10` | Pass | Single H1. |
| `/lop-cau-long-cho-nguoi-di-lam/` | `1` | `7` | `11` | Pass | Single H1. |
| `/cau-long-doanh-nghiep/` | `1` | `7` | `9` | Pass | Single H1. |
| `/hoc-cau-long-1-kem-1/` | `0` | `0` | `3` | Fail | Runtime page head/body did not expose page heading structure during audit; manual review required. |
| `/lop-cau-long-binh-thanh/` | `1` | `7` | `8` | Pass | Single H1. |
| `/lop-cau-long-thu-duc/` | `1` | `7` | `11` | Pass | Single H1. |
| `/blog/` | `1` | `1` | `3` | Pass | Single H1. |
| `/huan-luyen-vien/` | `1` | `0` | `10` | Pass | Listing page has one H1; H2 only appears in conditional empty state. |
| `/blog/[slug]/` | Code path only | Code path only | Code path only | Pass in source | `src/app/(site)/blog/[slug]/page.tsx` renders one H1 and one H2 in the related block. |

Notes:

- `HeroSection.tsx` contains two conditional `<h1>` branches in source, but runtime HTML only emits one H1.
- No runtime evidence of `>1` H1 was found on the audited pages, aside from the `/hoc-cau-long-1-kem-1/` anomaly where page metadata/body did not resolve correctly.

## 5. Sitemap / Robots / Canonical Audit

| Item | Current state | Status | Finding |
| --- | --- | --- | --- |
| `src/app/sitemap.ts` | Exists | Pass with gaps | Runtime sitemap returned `200`, but currently lists only homepage, six core money pages, blog index, and coach listing. In-scope omission: `/hoc-cau-long-1-kem-1/`. |
| Dynamic sitemap entries | Blog posts + coach listing | Partial | Blog posts are included when published posts exist. No coach detail entries because no coach detail route exists. |
| `src/app/robots.ts` | Exists | Needs fix | `robots.txt` allows all but does not disallow `/api/`. |
| Canonical tags | Homepage, core money pages, blog listing, coach listing | Mostly pass | Canonical is present on all audited runtime pages except `/hoc-cau-long-1-kem-1/`, which returned default site head during audit. |

Runtime `robots.txt`:

```txt
User-Agent: *
Allow: /

User-Agent: GPTBot
Allow: /

User-Agent: ChatGPT-User
Allow: /

User-Agent: ClaudeBot
Allow: /

User-Agent: PerplexityBot
Allow: /

Host: https://v2badminton.com
Sitemap: https://v2badminton.com/sitemap.xml
```

## 6. Image Alt Audit

Audit method:

- scanned `src/**/*.tsx` for `<Image>` without `alt`
- scanned `src/**/*.tsx` for empty `alt=""`

Results:

| Check | Result |
| --- | --- |
| Missing `alt` attribute | `0` |
| Empty `alt=""` | `0` |

## 7. Manual Review Flags Before Commit 2-6

1. `/hoc-cau-long-1-kem-1/` runtime returned default site title and no canonical/schema during audit, even though the route file exists. Re-check this route before trusting any meta/schema patch on top.
2. `/lop-cau-long-thu-duc/` title length is out of target range (`70` chars). Do not auto-rewrite title without human review.
3. Blog post description can be blank when both `metaDescription` and `excerpt` are missing in source data.
4. Coach detail pages do not exist yet, so `Person` schema work is blocked by routing/content model, not just markup.
5. Service-type money pages currently reuse a business schema path. Commit 2 should add missing `Course` schema without breaking the existing breadcrumb/FAQ output.
