# S5C-A1 - Nav upgrade

**Muc tieu:** Restyle `Nav` theo Figma: dark green frame, clear hierarchy, phone / CTA ro rang, mobile menu gon hon.

**Thoi gian uoc luong:** 1 gio

**Phu thuoc:** `S5A-A1`

**Rui ro:** Trung binh. Nav lien quan den route exposure va mobile interaction.

## Files chinh

- `src/components/layout/Nav.tsx`
- `src/app/globals.css`

## Scope

1. Desktop nav visual theo Figma
2. CTA mau cam noi bat
3. Giu logic links cua V2, khong dua item khong lien quan tu Figma
4. Mobile menu clean hon va de dung hon

## Acceptance criteria

1. Nav khong con day dac va utility-heavy nhu hien tai
2. CTA duoc nhan ra ro ngay
3. Mobile nav van hoat dong dung
4. Existing route links / SEO gating khong bi vo

## Implementation notes

### Desktop nav links hien tai

```
primaryLinks = [
  { href: "/#hoc-phi",       label: "Học phí" },
  { href: "/#khoa-hoc",      label: "Khóa học" },
  { href: "/#lich-hoc",      label: "Lịch học" },
  { href: "/#dia-diem",      label: "Địa điểm" },
  { href: "/#doanh-nghiep",  label: "Doanh nghiệp" },
  { href: "/#hoi-dap",       label: "Hỏi đáp" },
  { href: "/blog/",          label: "Blog" },
]
```

- `seoPageLinks`: build dynamic tu `coreRoutes` (exclude homepage) — giu nguyen logic, chi doi visual
- CTA button: text **"Đăng ký ngay"**, href `/#lien-he`, tracking `dang_ky_ngay` / `nav`

### Phone number trong nav

- Figma cho thay phone visible trong nav bar
- Hien tai `NavProps` chi nhan `{ siteName }` tu `SiteChromeSettings`
- Can mo rong `NavProps` de nhan them `phoneDisplay` + `phoneE164`
- Phone: `0907 911 886` / `+84907911886` (tu siteConfig)
- Render dang: icon phone + phoneDisplay, link `tel:{phoneE164}`

### Mobile menu

- Dung `<details>` element, tu dong close khi `pathname` thay doi (useEffect)
- Tracking voi dynamic `page_type` lookup
- Giu behavior nay, chi doi styling
- Mobile menu hien thi ca `primaryLinks` + `seoPageLinks` + CTA
