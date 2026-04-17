# Sprint 6 — Figma Fidelity Tickets

**Muc tieu:** Close gap giua localhost hien tai va Figma design (https://lemon-speck-28354326.figma.site/). Figma export: `D:\V2\Badminton Academy Enrollment Screens\src\app\pages\HomePage.tsx`

**Trang thai:** DRAFT — cho review

**Tham chieu Figma:**
- HomePage.tsx: hero, stats bar, courses (4 cards), why choose us (image collage + 98% badge), coaches (3 cards + certs + quote box), testimonials (dark gradient + glass cards), schedule (green header table), locations (3 cards + CTA card)
- Navbar.tsx: feather icon logo, transparent-to-solid scroll, 5 links, phone, orange gradient CTA
- Footer.tsx: dark green bg, 4-column, social icons (FB/YT/IG), legal links bar

---

## Tickets

### S6-A1 — Stats bar section (MISSING)

**Gap:** Figma co stats bar ngay duoi hero (green bg, 4 stats: 1,200+ hoc vien, 8 HLV, 4 san, 7+ nam). Localhost **khong co section nay**.

**Scope:**
- Them section moi giua hero va courses
- 4 stats voi icon trong green-tinted boxes
- Background: `#0d4a28`
- Grid 4 col desktop, 2 col mobile

**Files:** `src/app/(site)/page.tsx`, `src/app/globals.css`, co the tao `src/components/home/StatsBar.tsx`

---

### S6-A2 — Hero: lime gradient text + badge pill + scroll indicator

**Gap:** Figma hero co:
1. Lime gradient text tren chu "cau long" (`background: linear-gradient(90deg, #84cc16, #a3e635)` + `-webkit-background-clip: text`)
2. Badge pill phia tren heading voi animated pulse dot ("V2 BADMINTON · BINH THANH & THU DUC")
3. Scroll indicator o bottom (animated bounce)

**Localhost:** Co eyebrow text nhung khong co lime gradient, khong co pulse dot, khong co scroll indicator.

**Scope:** Chi sua visual treatment trong HeroSection, khong doi structure/logic.

**Files:** `src/components/home/HeroSection.tsx`, `src/app/globals.css`

---

### S6-A3 — Hero CTA buttons: gradient + glass effect

**Gap:** Figma CTA buttons co:
1. Primary: orange gradient (`linear-gradient(135deg, #f97316, #ea580c)`) + glow shadow (`box-shadow: 0 8px 32px rgba(249,115,22,0.4)`) + hover scale
2. Secondary: glass effect (`background: rgba(255,255,255,0.12)`, `border: 1.5px solid rgba(255,255,255,0.25)`, `backdrop-filter: blur(8px)`)
3. Tertiary: lime border (`border: 1.5px solid rgba(132,204,22,0.5)`, `color: #a3e635`)

**Localhost:** Co 3 CTA nhung style la solid buttons, khong co gradient/glass/glow.

**Files:** `src/components/home/HeroSection.tsx`, `src/app/globals.css`

---

### S6-B1 — Courses: 4-card grid + image gradient overlay + price per card

**Gap:**
1. Figma co **4 courses** (Thieu nhi, Thanh thieu nien, Nguoi lon, Nguoi di lam). Localhost co **3 cards** (Co ban, Nang cao, Doanh nghiep).
2. Figma cards co image gradient overlay (color → transparent) + badge + level tag overlay
3. Figma hien price truc tiep tren card (`750.000d/thang`) + sessions (`3 buoi/tuan`)
4. CTA: "Xem chi tiet →" (Figma) vs "Xem lich hoc" (localhost)
5. "Xem tat ca khoa hoc" button phia duoi grid (Figma) — localhost khong co

**Luu y:** Localhost dung hardcoded COURSE_CARDS (3 cards). Can quyet dinh: them card thu 4 hay giu 3?

**Files:** `src/components/home/CourseSection.tsx`, `src/app/globals.css`

---

### S6-B2 — Why section: image collage + 98% floating badge

**Gap:**
1. Figma: left = **2 images** trong grid (image collage) + **"98% hoc vien hai long"** floating badge. Localhost: left = **1 image**.
2. Figma: benefits co icons trong green-tinted boxes. Localhost: co so thu tu (01, 02...) thay vi icon boxes.
3. Figma: co orange gradient CTA "Dang ky hoc thu ngay" o cuoi. Localhost: khong co CTA trong section nay.

**Files:** `src/components/home/WhySection.tsx`, `src/app/globals.css`

---

### S6-B3 — Coaches: cert badges + styled quote box + stars footer

**Gap:**
1. Figma: moi coach co **3 cert badges** (vd: "Cuu VDV quoc gia", "HLV cap quoc gia", "12 nam kinh nghiem") — dang pill voi check icon. Localhost: khong co cert badges.
2. Figma: quote trong green background box voi Quote icon. Localhost: quote trong plain blockquote + **bug duplicate approach**.
3. Figma: footer co stars + student count. Localhost: co rating text nhung khong co actual star icons.
4. Figma: name + title overlay tren image gradient. Localhost: name + group trong card body.

**Bug can fix dong thoi:** `coach.approach` render 2 lan (blockquote + p tag).

**Luu y Sanity:** Schema chi co `name`, `photoUrl`, `teachingGroup`, `approach`. Certs, rating, studentCount can hardcoded hoac bridge data.

**Files:** `src/components/home/CoachSection.tsx`, `src/app/globals.css`

---

### S6-B4 — Testimonials: dark gradient background + glass cards

**Gap:** Figma testimonials co:
1. **Dark gradient background** (`linear-gradient(135deg, #071f10 0%, #0d4a28 50%, #1e2d5c 100%)`)
2. **Glass-morphism cards** (`background: rgba(255,255,255,0.06)`, `border: 1px solid rgba(255,255,255,0.1)`, `backdrop-filter: blur(8px)`)
3. **Lime accent** cho eyebrow + heading highlight
4. **Yellow stars** + **avatar circle** voi initials + **name + role**

**Localhost:** Testimonials section co nhung style la white cards tren light background — hoan toan khac Figma.

**Files:** `src/components/home/TestimonialsSection.tsx`, `src/app/globals.css`

---

### S6-C1 — Schedule: green header bar + colored level pills + alternating rows

**Gap:**
1. Figma: table header co **solid green background** (`#0d4a28`) voi white text. Localhost: khong co green header bar.
2. Figma: time trong **green pill** background. Localhost: time bold nhung khong co pill.
3. Figma: level pills co **mau phan biet** (blue cho co ban, purple cho moi trinh do, orange cho thi dau). Localhost: co level tags nhung mau khac.
4. Figma: **alternating row backgrounds** (white / #fafffe). Localhost: rows co the chua co alternation.
5. Figma: 5 cot (Ngay, Gio hoc, Khoa hoc, Co so, Trinh do). Localhost: 4 cot (Buoi hoc, Khung gio, San tap, Trinh do).

**Bug can fix dong thoi:** `<button role="row">` — invalid ARIA. Bo `role="row"` tren button.

**Files:** `src/components/home/ScheduleSection.tsx`, `src/app/globals.css`

---

### S6-C2 — Locations: card list + CTA card

**Gap:**
1. Figma: 2-column layout — left = **3 location cards** (icon + name + address + phone + hours), right = **dark CTA card** ("Thu ngay – Mien phi" voi orange gradient button).
2. Localhost: image-led grid cards, khong co CTA card ben canh.
3. Figma cards co MapPin icon trong green box, phone, hours info. Localhost khong co (Sanity schema khong co phone/hours).

**Decision:** Giu phone/hours hardcoded (cung so cho tat ca san) hay skip? Figma dung cung `0907 911 886` va `T2–CN: 6:00 – 21:00` cho tat ca.

**Files:** `src/components/home/LocationsSection.tsx`, `src/components/blocks/LocationsGrid.tsx`, `src/app/globals.css`

---

### S6-D1 — Nav: feather icon logo + transparent-to-solid scroll transition

**Gap:**
1. Figma: logo co **feather icon** trong gradient box (lime → green) + "BINH THANH · THU DUC" subtitle. Localhost: text-only "V2 BADMINTON".
2. Figma: nav **transparent on top → solid green on scroll** (`backdrop-filter: blur(12px)` khi scrolled). Localhost: luon solid green.
3. Figma: CTA co **orange gradient** (`linear-gradient(135deg, #f97316, #ea580c)`). Localhost: co the da la orange nhung kiem tra gradient.

**Luu y:** Nav hien tai la Server Component voi `<details>` mobile menu. Transparent-to-solid can client-side scroll listener → can chuyen sang `"use client"` (da la client component roi).

**Files:** `src/components/layout/Nav.tsx`, `src/app/globals.css`

---

### S6-D2 — Footer: social icons + legal links + feather logo

**Gap:**
1. Figma: logo co **feather icon** giong nav. Localhost: text-only.
2. Figma: **3 social icons** (Facebook, YouTube, Instagram) voi hover effect. Localhost: chi co text link Facebook.
3. Figma: **copyright bar** co 3 legal links (Chinh sach bao mat, Dieu khoan dich vu, Hoan tien). Localhost: chi co 1 link privacy.
4. Figma: column "Khoa hoc" co 5 course links. Localhost: column "Lo trinh noi bat" co 4 route links.
5. Figma: column "Lien he" co **icons** (MapPin, Phone, MessageCircle, Clock). Localhost: khong co icons.

**Files:** `src/components/layout/Footer.tsx`, `src/app/globals.css`

---

### S6-D3 — FloatingCta: semantic fix + visual refinement

**Gap:**
1. `<div aria-label="Lien he nhanh">` — div khong support aria-label. Doi sang `<nav>`.
2. Xem xet visual alignment voi Figma (Figma khong co floating CTA rieng — no dung CTA card trong Locations section).

**Files:** `src/components/layout/FloatingCta.tsx`

---

### S6-E1 — globals.css: body background fix

**Gap:** Body van co dark gradient tu Sprint cu:
```css
body {
  background: linear-gradient(180deg, var(--v2-black) 0%, var(--v2-dark) 100%);
  color: var(--v2-light);
}
```
Ma `color-scheme` da chuyen sang `light`. Can doi body background sang white de khop Sprint 5 light design.

**Files:** `src/app/globals.css`

---

### S6-E2 — Section background alternation

**Gap:** Figma su dung pattern background ro rang:
- Hero: dark overlay
- Stats bar: `#0d4a28`
- Courses: `#f0fdf4` (light green)
- Why: `white`
- Coaches: `#f0fdf4`
- Testimonials: dark gradient
- Schedule: `white`
- Locations: `#f0fdf4`

Localhost can kiem tra va align theo pattern nay.

**Files:** `src/app/globals.css`

---

## Bug fixes (nen lam cung Sprint 6)

| Bug | File | Fix |
|-----|------|-----|
| `coach.approach` render 2 lan | CoachSection.tsx | Xoa `<p>` duplicate |
| `<button role="row">` invalid ARIA | ScheduleSection.tsx | Bo `role="row"` tren button |
| `<div aria-label>` khong co effect | FloatingCta.tsx | Doi sang `<nav>` |
| `getCategoryLabel` duplicate | blog/page.tsx + blog/[slug]/page.tsx | Move ra shared util |

---

## Estimation

| Ticket | Effort |
|--------|--------|
| S6-A1 Stats bar | 0.5h |
| S6-A2 Hero text/badge | 0.5h |
| S6-A3 Hero CTA buttons | 0.5h |
| S6-B1 Courses cards | 1.5h |
| S6-B2 Why section | 1h |
| S6-B3 Coaches | 1.5h |
| S6-B4 Testimonials | 1h |
| S6-C1 Schedule | 1h |
| S6-C2 Locations | 1h |
| S6-D1 Nav | 1h |
| S6-D2 Footer | 0.5h |
| S6-D3 FloatingCta | 0.25h |
| S6-E1 Body bg fix | 0.25h |
| S6-E2 Section alternation | 0.5h |
| Bug fixes | 0.5h |
| **Total** | **~11h** |
