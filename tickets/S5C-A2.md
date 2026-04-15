# S5C-A2 - Contact + FAQ + Business cluster rewrite

**Muc tieu:** Rewrite bottom-funnel cluster theo Figma-first system: `ContactSection`, `FaqSection`, va `BusinessSection` phai di cung mot visual language moi thay vi giu 3 block roi rac kieu cu.

**Thoi gian uoc luong:** 1 gio

**Phu thuoc:** `S5A-A1`

**Rui ro:** Trung binh. Contact co client form logic phuc tap, con FAQ va Business la support blocks nhung van phai giu behavior hien tai.

## Files chinh

- `src/components/home/ContactSection.tsx`
- `src/components/home/ContactForm.tsx`
- `src/components/home/FaqSection.tsx`
- `src/components/home/BusinessSection.tsx`
- `src/app/globals.css`

## Scope

1. Contact section dung split layout channels + form
2. FAQ section duoc redesign theo he card / accordion moi
3. Business section duoc redesign theo he support-section moi
4. 3 sections nay phai nhin nhu mot bottom-funnel cluster thong nhat
5. CTA framing ro hon cho user moi / phu huynh

## Acceptance criteria

1. Contact section trong nhu mot conversion block hoan chinh
2. FAQ va Business khong con giu style cu
3. Form validation, submit, business mode, anti-spam, tracking khong bi anh huong
4. Mobile stack hop ly

## Notes

- `FaqSection` nen xuat hien truoc `ContactSection` trong homepage order
- `BusinessSection` la secondary audience block, nen dat sau `ContactSection`

## Implementation notes

### ContactSection (PHAI GIU LOGIC)

- Props: `{ siteSettings: SanitySiteSettings | null, locations: SanityLocation[], scheduleBlocks: SanityScheduleBlock[] }`
- Fallback: khi `siteSettings` null → dung `FALLBACK_CONTACT_SETTINGS` tu `siteConfig`
- Contact channels hien tai: phone (`tel:`), Zalo (`zalo.me/`), Messenger (`facebookUrl`) — data tu siteSettings
- `locations` va `scheduleBlocks` truyen xuong `ContactForm` de support prefill logic
- Tracking: direct contact links track `method` (phone, zalo, messenger)

### ContactForm (KHONG DOI LOGIC — chi doi visual shell)

- Form validation, submission endpoint, business mode toggle, anti-spam honeypot, schedule prefill — tat ca giu nguyen
- Form nhan prefill tu `useHomepageConversion().prefill` (schedule click → auto-fill)
- Business mode: toggle qua `useHomepageConversion().isBusinessMode`
- Chi doi: input styles, button styles, layout wrapper cho khop design system moi

### FaqSection

- Props: `{ faqs: SanityFaq[] }` — tu Sanity, fetch `getFaqs("homepage")`
- Render qua `FaqList` block component
- `FaqList` dung `<details>` native element cho accordion
- SanityFaq fields: `id`, `question`, `answer` (PortableTextBlock[]), `answerPlainText`
- Conditional: neu `answer.length > 0` → PortableText, else → plain text fallback
- Redesign: doi visual cua `<details>/<summary>` theo card system moi, giu native accordion behavior

### BusinessSection

- Khong co props — dung `useHomepageConversion().enterBusinessMode`
- Hardcoded `PROOF_POINTS` array (4 items)
- CTA: `enterBusinessMode()` + track `cta_name="nhan_bao_gia"`
- Hardcoded image: `biz-team-building.webp`
- Redesign: doi visual treatment, giu conversion hook va tracking
