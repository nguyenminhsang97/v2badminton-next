# Version C Implementation Plan

## Executive Summary

Version C should be built as a **growth-ready website**, not as a rushed redesign and not as an overbuilt platform.

Because there is **no urgency to replace the live static site**, the right move is:

- build the new site properly in parallel
- keep the long-term architecture clean
- include a **small but real CMS** from the start
- support **OpenClaw draft operations**
- avoid building commerce, complex permissions, or a full internal platform too early

This plan assumes:

- the current static site remains live on `v2badminton.com`
- Version C is built and validated in parallel
- the north star remains: **increase offline student registrations**
- audience priority remains:
  1. children
  2. beginners
  3. working adults
  4. corporate

In short:

**Build a strong conversion site with a lightweight content operating system.**

---

## 1. What Version C Is

Version C is not just a homepage redesign.

It is a site with 4 connected layers:

1. **Conversion layer**
   - homepage
   - money pages
   - contact and lead flow

2. **Content layer**
   - support posts
   - beginner education content
   - future review and product content

3. **Campaign layer**
   - summer campaign mode
   - seasonal landing pages

4. **CMS layer**
   - editable business content
   - OpenClaw draft workflow
   - human review and publish

What Version C is **not** in Phase 1:

- not a commerce platform
- not a membership system
- not a custom admin product
- not a multi-role editorial system

---

## 2. North Star and Success Criteria

### North Star

Increase the number of people who register to study at V2 Badminton.

### Phase 1 success means

Version C is successful when it can do all of the following:

- clearly communicate what V2 offers in the first screen
- help users self-identify by audience
- surface pricing, schedule, and location early
- preserve or improve lead generation behavior
- preserve or improve SEO foundations
- let non-technical operators update core business content without touching layout code

### Metrics to watch

- form submissions
- Zalo clicks
- phone clicks
- primary CTA clicks
- audience-card clicks
- schedule-to-form interactions
- leads by page
- leads by audience type
- eventual student conversion, if tracked manually

---

## 3. Strategic Decisions Already Locked

These decisions should remain stable:

- `B` provides the visual shell
- `A` provides the concrete decision-support content
- homepage must show local intent and business facts early
- money pages matter more than blog pages
- summer is the first required campaign
- OpenClaw may create and update drafts, but humans publish
- CMS should support content and campaign operations, not layout editing

---

## 4. Recommended Technical Direction

## 4.1 Core stack

Recommended direction:

- **Next.js**
- **headless CMS**
- **fixed frontend layout**
- **structured content models**
- **OpenClaw through CMS/API draft flow**

Recommended CMS class:

- something like **Sanity**

Why this is the best fit:

- non-technical people can edit content
- OpenClaw can create or update drafts
- content models stay structured
- campaign content can be scheduled and edited
- frontend remains stable and maintainable

What not to build now:

- custom admin dashboard
- custom workflow engine
- custom role system beyond basic needs
- payment or membership backend
- product catalog logic

---

## 5. Phase 1 Scope: Build Before Cutover

This is the correct **no-rush but still realistic** Phase 1.

## 5.1 Homepage

Build the homepage as the main conversion page with these sections:

1. Hero
2. Proof bar
3. Course chooser
4. Pricing + schedule snapshot
5. Why V2
6. Coach / trust section
7. Testimonials
8. Locations
9. FAQ
10. Final contact block

Rules:

- one primary CTA
- one secondary CTA
- one utility contact path
- navigation must include a visible phone number — Vietnamese users often call directly before deciding
- hero should use real photography (court or class photos) to communicate intent instantly, not CSS-only decoration
- local intent visible immediately
- pricing, schedule, and locations visible early

Coach / trust section direction:

- focus on: who they teach, teaching method, coaching philosophy — not competition achievements
- if a coach does not have strong competitive credentials, prioritize student testimonials or method descriptions over CV-style profile cards
- each coach entry needs only: name, student group they handle, one short statement about their approach

## 5.2 Core money pages

Build these first:

- `/hoc-cau-long-cho-nguoi-moi/`
- `/lop-cau-long-tre-em/`
- `/lop-cau-long-cho-nguoi-di-lam/`
- `/cau-long-doanh-nghiep/`
- `/lop-cau-long-binh-thanh/`
- `/lop-cau-long-thu-duc/`

These are more important than a large blog at launch.

## 5.3 Lead and tracking parity

The new site must preserve or improve:

- form submit flow
- Zalo contact flow
- phone click flow
- schedule-related conversion logic
- analytics and event tracking

## 5.4 CMS minimum viable scope

Phase 1 CMS should manage only business-critical content:

- homepage copy
- money page content
- pricing
- schedule blocks
- locations
- FAQs
- testimonials
- coaches
- campaign content
- SEO fields

Do **not** model every future content type deeply in Phase 1.

## 5.5 OpenClaw workflow

OpenClaw should be able to:

- create drafts
- update drafts
- suggest metadata
- suggest internal links

OpenClaw should **not**:

- change layout
- publish directly
- modify component structure

## 5.6 Campaign support

Include a real campaign model in Phase 1, but keep it narrow.

Campaigns may change:

- badge text
- hero copy
- CTA labels
- CTA targets
- featured audience
- featured course
- highlighted schedule/pricing
- linked landing page
- campaign dates

Campaigns may **not** change:

- layout structure
- component design
- homepage section order in Phase 1

---

## 6. CMS Model: Keep It Small

Recommended Phase 1 content types:

- `homepage_settings`
- `money_page`
- `campaign`
- `location`
- `schedule_block`
- `faq`
- `testimonial`
- `coach`
- `post`

Recommended Phase 1 post categories:

- `tips`
- `how-to`
- `beginner`
- `campaign`

Categories to prepare for later, but not prioritize yet:

- `review`
- `product`
- `comparison`
- `affiliate`

The key principle:

**Model what you will truly operate in the next 3-6 months, not what you might someday monetize.**

---

## 7. SEO Priorities

SEO should stay local-intent first.

## 7.1 Must-have SEO rules

- one clear H1 per page
- local intent visible early
- crawlable text, not image-only messaging
- pricing, schedule, and locations visible early
- internal links from support content to money pages
- stable slugs and canonical logic
- schema where it reflects real content

## 7.2 Required schema

- `LocalBusiness`
- `SportsActivityLocation`
- `Offer`
- `FAQPage`

## 7.3 SEO rollout order

1. homepage
2. beginner page
3. children page
4. working-adult page
5. Bình Thạnh page
6. Thủ Đức page
7. corporate page
8. summer landing page
9. support content
10. review/affiliate content later

---

## 8. Content Strategy and Timing

Content is part of the long-term plan, but it should not outrank money pages in priority.

## 8.1 Build first

- homepage
- money pages
- seasonal landing page
- a few support posts for beginners

## 8.2 Build after cutover

- content hub expansion
- support articles
- how-to content
- more FAQ clusters

## 8.3 Build later

- review posts
- product comparison posts
- affiliate content

Affiliate and review content are valid future layers, but they should come after the local service foundation is strong.

---

## 9. Summer Campaign Model

Summer should be treated as a real recurring campaign.

Required summer assets:

- homepage seasonal override
- `/lop-he-cau-long-tphcm/`
- CTA override: `Dang ky lop he`
- highlighted children/beginner path
- campaign window: June through August

Campaign mode should be:

- editable
- schedulable
- content-driven
- not a separate microsite

---

## 10. What Should Be Ready Before Cutover

Before replacing the live static site, Version C should have:

- completed homepage
- completed core money pages
- CMS for business-critical content
- working OpenClaw draft flow
- campaign model for summer
- tracking and lead flow parity
- mobile-safe layouts
- local SEO parity or better

This is the correct target for a no-rush launch.

---

## 11. What Should Be Prepared But Not Fully Enabled

These can be designed into the architecture, but do not need to be fully active before cutover:

- broader content hub taxonomy
- review/product content models
- richer campaign variations
- more advanced internal-link tooling
- richer reporting dashboards

In other words:

prepare the hooks, do not build the whole machine.

---

## 12. What Should Wait Until There Is Real Data

Do not prioritize these until the new site is live and producing real usage data:

- online payment
- membership
- product sales
- stringing workflow
- advanced upsell systems
- custom editorial permissions
- custom admin product
- multiple seasonal campaign systems
- microsites by audience

These are expansion ideas, not launch requirements.

---

## 13. Delivery Roadmap

## Stage A: Foundation

- finalize homepage structure
- finalize money page list
- define CMS models
- define OpenClaw draft workflow
- define tracking and lead requirements

## Stage B: Core build

- build homepage
- build money pages
- wire CMS content into frontend
- preserve contact and tracking flows

## Stage C: Trust and campaign

- add real testimonials
- add coach section
- add real location proof
- implement summer campaign model
- create summer landing page

## Stage D: Content expansion

- publish support content
- strengthen internal links
- expand beginner/helpful content

## Stage E: Monetization expansion

- review content
- affiliate content
- future commerce or membership if justified

---

## 14. Final Recommendation

The old version of this plan leaned too much toward a full growth platform.

The right no-rush version is:

- **build the architecture properly**
- **include CMS from the start**
- **support OpenClaw draft operations**
- **keep the frontend fixed and conversion-focused**
- **launch only when homepage, money pages, CMS, and campaign basics are truly ready**
- **defer commerce and advanced editorial complexity**

One-line summary:

**Version C should launch as a polished, conversion-first academy site with a lightweight CMS and campaign workflow, not as a full academy operating platform.**
