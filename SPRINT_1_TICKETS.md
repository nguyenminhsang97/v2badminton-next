# Sprint 1: CMS Foundation - Tickets

## Status

- Sprint 1 status: `DONE`
- Closed on: `2026-04-09`
- Sanity project: `w58s0f53`
- Dataset: `production`
- Final validation: `46 valid documents`, `0 errors`
- Acceptance: `S1-D1` passed with browser-based editor-account verification

## Group A: Sanity Project Setup

### S1-A1: Init Sanity Project
- **Objective:** Tao Sanity project moi, dataset production san sang
- **Scope:** Tao project tren sanity.io, chon free plan, tao dataset `production`, invite owner
- **Dependency:** Khong
- **Priority:** P0
- **Expected output:** Sanity project ID co the truy cap, owner da login duoc

### S1-A2: Setup Sanity Studio trong repo
- **Objective:** Sanity Studio chay duoc local, embedded trong v2badminton-next
- **Scope:** Install sanity packages, tao studio config, chay `sanity dev` thanh cong
- **Dependency:** S1-A1
- **Priority:** P0
- **Expected output:** `npm run sanity:dev` mo Studio tren localhost, ket noi dung dataset

---

## Group B: Schema Definitions

### S1-B1: Schemas cho core business data
- **Objective:** Define schemas cho data dang co san va can migrate ngay
- **Scope:** 5 schemas: `site_settings`, `location`, `pricing_tier`, `schedule_block`, `faq`
- **Dependency:** S1-A2
- **Priority:** P0
- **Expected output:** Studio hien thi 5 document types, fields dung theo content models v2 spec

### S1-B2: Schemas cho trust + conversion data
- **Objective:** Define schemas cho data can thu thap, chua co san
- **Scope:** 2 schemas: `coach`, `testimonial`
- **Dependency:** S1-A2
- **Priority:** P1
- **Expected output:** Studio hien thi 2 document types, san sang nhap khi co data

### S1-B3: Schemas cho pages + campaign
- **Objective:** Define schemas cho content pages va campaign model
- **Scope:** 3 schemas: `money_page`, `campaign`, `post`
- **Dependency:** S1-B1, vi `money_page` reference toi `location`, `pricing_tier`, `faq`
- **Priority:** P1
- **Expected output:** Studio hien thi 3 document types, references link dung toi B1 schemas

---

## Group C: Data Migration

### S1-C1: Migrate locations + site settings
- **Objective:** Nhap 4 locations va site settings vao Sanity
- **Scope:** Nhap tu `locations.ts` + `site.ts`, verify tung record khop data live
- **Dependency:** S1-B1
- **Priority:** P0
- **Expected output:** 4 locations + 1 `site_settings` document trong Sanity, data khop 100%

### S1-C2: Migrate pricing tiers
- **Objective:** Nhap 5 pricing tiers vao Sanity
- **Scope:** Nhap tu `pricing.ts`, verify gia, billing model, display price, va features khop data live
- **Dependency:** S1-B1
- **Priority:** P0
- **Expected output:** 5 `pricing_tier` documents trong Sanity, data khop 100%

### S1-C3: Migrate schedule blocks
- **Objective:** Nhap 15 schedule blocks vao Sanity, link dung location references
- **Scope:** Nhap tu `schedule.ts`, moi block phai reference dung location document va dung field `timeSlotId`
- **Dependency:** S1-C1, can locations nhap truoc de reference
- **Priority:** P0
- **Expected output:** 15 `schedule_block` documents, moi cai link dung toi location

### S1-C4: Migrate FAQs
- **Objective:** Nhap 21 FAQs vao Sanity voi dung page targeting
- **Scope:** Nhap tu `faqs.ts`, tag dung `pages` array cho moi FAQ
- **Dependency:** S1-B1
- **Priority:** P0
- **Expected output:** 21 `faq` documents, page tags khop voi data hien tai

---

## Group D: Operator Verification

### S1-D1: Operator acceptance test
- **Objective:** Confirm nguoi khong biet code van edit duoc content trong Sanity Studio
- **Scope:** Operator tu thuc hien 4 test cases:
  1. Doi gia 1 goi hoc phi -> verify thay doi saved
  2. Sua noi dung 1 FAQ -> verify thay doi saved
  3. Them 1 location test -> verify hien thi dung fields -> xoa sau
  4. Mo `schedule_block` va verify `location` reference navigate dung document
- **Dependency:** S1-C1 + S1-C2 + S1-C3 + S1-C4
- **Priority:** P0
- **Expected output:** Operator confirm "toi edit duoc, khong can dev ho tro"

---

## Execution Order

```text
S1-A1 -> S1-A2 -> S1-B1 --> S1-C1 -> S1-C3
                  |         S1-C2
                  |         S1-C4
                  +--> S1-B2
                  +--> S1-B3
                              |
                            S1-D1
```

- B2 va B3 co the lam song song voi C group.
- C1, C2, C4 co the lam song song. C3 cho C1.
- D1 cho tat ca C xong.

## Summary

| ID | Title | Priority | Dependency |
|---|---|---|---|
| S1-A1 | Init Sanity Project | P0 | - |
| S1-A2 | Setup Studio trong repo | P0 | A1 |
| S1-B1 | Schemas core business | P0 | A2 |
| S1-B2 | Schemas trust + conversion | P1 | A2 |
| S1-B3 | Schemas pages + campaign | P1 | B1 |
| S1-C1 | Migrate locations + settings | P0 | B1 |
| S1-C2 | Migrate pricing | P0 | B1 |
| S1-C3 | Migrate schedule | P0 | C1 |
| S1-C4 | Migrate FAQs | P0 | B1 |
| S1-D1 | Operator acceptance test | P0 | C1+C2+C3+C4 |
