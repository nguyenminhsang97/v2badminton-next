# Sprint 6 - Figma Fidelity Refactor Plan

## Muc tieu

Sprint 6 khong chi sua 7 gap nho. Muc tieu that su la:

1. dua UI ve muc Figma-faithful on dinh
2. xoa tinh trang `globals.css` bi chong 5-6 lop cascade
3. giu nguyen SEO, CWV, App Router, Sanity, form flow, tracking, money-page fallback

Neu chi tiep tuc them override vao `globals.css`, localhost co the "giong hon" trong 1 lan xem, nhung sau do se van bat on va kho giu dung khi sua them.

Vi vay, Sprint 6 phai duoc coi la:

- **mot dot refactor CSS architecture**
- **mot dot visual parity pass**
- khong phai chi la "them them vai rule cho dep"

---

## Danh gia S6 plan cu

Plan cu dung huong, nhung **chua du** de dam bao ra dung Figma:

1. Co de xuat tach `globals.css`, nhung **chua co cascade architecture** ro rang.
   - Neu chi tach file roi `@import` vao lai, conflict van co.

2. Co noi "bo legacy selectors", nhung **chua co quy trinh xoa trong luc migrate**.
   - Rat de roi vao tinh trang file moi da co, file cu van con, conflict giu nguyen.

3. Tap trung homepage la chinh, nhung **chua lock ro blog + money page** trong refactor.
   - Sprint 5 chi dong khi tat ca public pages cung mot visual system.

4. Chua co **exit criteria do duoc**.
   - Chua co tieu chi nhu "moi selector goc chi con 1 canonical definition".
   - Chua co screenshot checklist theo section.

5. Chua nhac lai cac **guardrail SEO/CWV/accessibility**.
   - Day la bat buoc vi Sprint 5/6 dang dien ra tren pages public.

Ket luan:

- **S6 plan cu can duoc nang cap**
- Sau khi nang cap, plan moi moi du an toan de implement

---

## Nguyen tac thuc hien

### 1. Figma la source of truth cho visual

Nguon chot:

- visual: `D:\\V2\\Badminton Academy Enrollment Screens\\src\\app\\pages\\HomePage.tsx`
- structure / conversion / SEO architecture: `VERSION_C_BLUEPRINT.md`
- content ownership: Sanity + V2 content hien co

### 2. Khong doi interface public

Khong duoc doi:

- query shape / schema types
- App Router structure
- form payloads / server actions
- tracking event names
- route paths / sitemap / canonical / JSON-LD
- publish gating / fallback logic

### 3. Sprint 6 chi thanh cong khi hybrid UI bien mat

Khong duoc de cung mot page co:

- Figma rounded white cards
- nhung van con dark V2 cards / clip-path / lime-first old rules

---

## Guardrail bat buoc

### Semantic / SEO

- moi block lon van dung `section`
- page title van la `h1`
- section title van la `h2`
- card title van la `h3`
- khong doi heading thanh `div/span` chi vi Figma la text layer

### Core Web Vitals

- moi page chi co **1 priority image above-the-fold**
- anh con lai de lazy theo mac dinh
- moi image slot phai co reserved dimensions / aspect ratio
- khong them layout shift sau hydration

### SEO content visibility

Khong duoc `display:none`, conditional render, mobile-only hide, truncate cho:

- hero subheading chinh
- money page intro/body
- blog article body
- FAQ answers

### Alt / fallback assets

- moi `Image` phai co `alt`
- fallback assets phai co alt policy ro rang

---

## Phase 0 - Freeze va inventory truoc khi sua

### 0.1 Chot root selectors dang duoc giu lai

Lap inventory cho cac root classes sau:

- `.site-header`
- `.hero`
- `.stats-bar`
- `.course-section`
- `.why-section`
- `.coach-section`
- `.pricing-grid` / `.pricing-card`
- `.schedule-*`
- `.testimonials-section`
- `.locations-section`
- `.faq-section`
- `.contact-section`
- `.business-section`
- `.seo-links`
- `.site-footer`
- `.floating-cta`
- `.money-page*`
- `.blog-list*`
- `.blog-post*`

### 0.2 Chot token final

Truoc khi tach file, khoa token final:

- body bg: `#ffffff`
- alt section bg: `#f0fdf4`
- hero overlay: `linear-gradient(135deg, rgba(7,31,16,0.92) 0%, rgba(13,74,40,0.75) 50%, rgba(30,45,92,0.55) 100%)`
- footer bg: `#071f10`
- status pill bg: lime tint, khong dung white tint
- nav CTA: orange gradient
- cards: white + soft shadow
- buttons: rounded, khong con clip-path legacy

### 0.3 Khoanh vung section order final

Homepage order khoa lai thanh:

1. Hero
2. Stats
3. Courses
4. Why
5. Coaches
6. Pricing
7. Testimonials
8. Schedule
9. Locations
10. FAQ
11. Contact
12. Business
13. SeoLinks

Note:

- Pricing duoc giu lai du khong co trong Figma vi can cho conversion
- Testimonials phai nam truoc Schedule de dung Figma flow va giup momentum conversion

---

## Phase 1 - Dung lai CSS architecture

### 1.1 Muc tieu

`globals.css` sau refactor chi con:

- tokens / root vars
- base reset
- typography base
- generic `.section`
- generic `.btn`
- imports

Target:

- `globals.css` < 400 dong

### 1.2 File structure moi

```text
src/app/globals.css
src/styles/tokens.css
src/styles/base.css
src/styles/layout.css
src/styles/components/nav.css
src/styles/components/hero.css
src/styles/components/stats-bar.css
src/styles/components/courses.css
src/styles/components/why.css
src/styles/components/coaches.css
src/styles/components/pricing.css
src/styles/components/schedule.css
src/styles/components/testimonials.css
src/styles/components/locations.css
src/styles/components/faq.css
src/styles/components/contact.css
src/styles/components/business.css
src/styles/components/seo-links.css
src/styles/components/footer.css
src/styles/components/floating-cta.css
src/styles/pages/blog.css
src/styles/pages/money-page.css
```

### 1.3 Cascade architecture bat buoc

Khong import tung file mot cach vo to chuc. Phai xep tang lop ro rang:

1. `tokens.css`
2. `base.css`
3. `layout.css`
4. `components/*.css`
5. `pages/*.css`

Va moi file chi duoc style ben duoi root class cua no.

Vi du:

- `hero.css` chi style `.hero ...`
- `testimonials.css` chi style `.testimonials-section ...`
- `money-page.css` chi style `.money-page ...`

### 1.4 Quy tac migrate

Moi cluster migrate phai di kem:

1. move rule can thiet sang file moi
2. xoa rule cu khoi `globals.css` trong cung pass
3. re-run lint/build
4. screenshot compare

**Khong duoc** move rule ma de ban cu lai roi "de sau xoa".

Do la cai bay lon nhat cua plan cu.

---

## Phase 2 - Migrate theo cluster, khong migrate tung selector roi rac

### Cluster A - Frame shell

Files:

- `nav.css`
- `footer.css`
- `floating-cta.css`
- `layout.css`

Acceptance:

- nav transparent -> solid scroll on homepage
- nav solid on subpages
- footer flat dark, khong gradient
- floating CTA giu semantic `<nav>` va cung visual system

### Cluster B - Hero system

Files:

- `hero.css`
- `stats-bar.css`

Acceptance:

- lime gradient heading
- lime-tinted status pill
- exact hero overlay gradient
- CTA hierarchy dung Figma
- stats bar full-width, khong floating-card feel

### Cluster C - Homepage content sections

Files:

- `courses.css`
- `why.css`
- `coaches.css`
- `pricing.css`
- `schedule.css`
- `testimonials.css`
- `locations.css`
- `faq.css`
- `contact.css`
- `business.css`
- `seo-links.css`

Acceptance:

- course 4-card grid giu price overlay
- why collage + 98% badge dung shell
- coaches = 3 cards on dinh
- testimonials dark glass
- schedule header/time pills/alternating rows dung
- locations = list cards + dark CTA card
- FAQ / Contact / Business / SeoLinks khong con dark-legacy treatment

### Cluster D - Public page shells

Files:

- `pages/blog.css`
- `pages/money-page.css`

Acceptance:

- blog listing/detail cung 1 visual system voi homepage
- money pages khong con copy-only blank feel
- khong con selector dark legacy chen vao page shell

---

## Phase 3 - Figma parity pass sau khi architecture on dinh

Chi sau khi xong Phase 1 va 2 moi lam phase nay.

### 3.1 Visual tokens chot chinh xac

- body bg `#ffffff`
- alt bg `#f0fdf4`
- footer bg `#071f10`
- hero overlay dung 135deg + green -> navy
- status pill lime tint
- testimonials gradient dung 3-stop

### 3.2 Section order

Swap trong `src/app/(site)/page.tsx`:

- `TestimonialsSection` len truoc `ScheduleSection`

### 3.3 Khoang cach va rhythm

Day la phan plan cu chua viet du:

- hero -> stats spacing
- stats -> courses spacing
- courses -> why spacing
- testimonials -> schedule spacing
- locations -> footer handoff

Can compare side-by-side voi Figma va chot:

- section top/bottom padding
- section header max-width
- card radius
- card shadow
- gap giua columns/cards

Neu khong co buoc nay, UI van "dung component" nhung nhin van khong ra Figma.

---

## Phase 4 - Verification co the do duoc

### 4.1 Build safety

- `npm run lint`
- `npm run build`

### 4.2 Selector hygiene

Can co 1 lan grep kiem tra:

- `.testimonial-card`
- `.hero__*`
- `.course-card`
- `.site-header`
- `.site-footer`
- `.money-page__hero`
- `.blog-card`

Exit criteria:

- moi selector goc chi con **1 canonical definition**
- responsive override duoc phep them, nhung khong con 3-5 ban "base" chong nhau

### 4.3 Browser screenshot checklist

Screenshot bat buoc:

- homepage hero + stats
- homepage courses + why
- homepage coaches + pricing
- homepage testimonials + schedule
- homepage locations + footer
- blog listing
- blog detail
- money page co image
- money page copy-only

### 4.4 Functional regression

Xac nhan van dung:

- hero CTA
- course links
- business mode entry
- schedule click-to-prefill
- contact form
- nav mobile open/close
- floating CTA actions
- blog navigation
- money-page fallback rendering

---

## Definition of Done

Sprint 6 chi duoc xem la done khi:

1. `globals.css` khong con la dump file 6000+ dong
2. moi cluster da duoc tach sang file rieng
3. rule cu da bi xoa, khong de dual definitions
4. homepage nhin ra dung Figma o muc section-by-section
5. money pages + blog cung he visual voi homepage
6. lint/build xanh
7. khong co regression SEO/CWV/accessibility

---

## Thu tu implement de xac suat thanh cong cao nhat

1. Freeze token + section order
2. Tach Frame shell (nav/footer/floating)
3. Tach Hero + Stats
4. Tach content clusters homepage
5. Tach blog + money page shells
6. Xoa legacy rules ngay trong luc migrate
7. Chot visual parity adjustments
8. Browser verify + regression pass

---

## Ket luan

**Plan moi nay du de implement.**

No khac plan cu o 3 diem quan trong:

1. co architecture, khong chi co danh sach file
2. co quy tac xoa legacy ngay trong luc move
3. co exit criteria do duoc de chung minh da thoat hybrid UI

Neu lam dung plan nay, minh moi co co hoi dua UI ve dung Figma mot cach on dinh, thay vi lai them mot lop override nua.
