# Sprint 1: CMS Foundation - Ticket Groups

## Status

- Sprint 1 status: `DONE`
- Closed on: `2026-04-09`
- Final Sanity state: `1 site_settings`, `4 locations`, `5 pricing_tier`, `15 schedule_block`, `21 faq`
- Final validation: `46 valid documents`, `0 errors`
- Acceptance: editor account completed browser-based CRUD/reference checks in Studio

## Group A: Sanity Project Setup
**Muc tieu:** Co Sanity project chay duoc, Studio truy cap duoc, dataset san sang

**Vi sao di cung nhau:** Day la infrastructure. Khong co nhom nay thi khong the lam cac buoc tiep theo.

**Output:**
- Sanity project tao xong
- Sanity Studio chay duoc
- Dataset `production` tao xong
- Owner account moi xong

**Dependency:** Khong

---

## Group B: Schema Definitions
**Muc tieu:** Tat ca content models da chot duoc define thanh Sanity schemas

**Vi sao di cung nhau:** Schemas phai co truoc khi nhap data. Cac schemas cung phu thuoc vao mot bo spec nen can chot nhat quan.

**Output:**
- 10 schemas live trong Sanity: `site_settings`, `location`, `pricing_tier`, `schedule_block`, `faq`, `coach`, `testimonial`, `campaign`, `money_page`, `post`
- Studio hien thi dung fields, dung types, dung references
- Chua co data, chi co cau truc

**Dependency:** Group A

---

## Group C: Data Migration
**Muc tieu:** Toan bo data hien tai tu hard-code files duoc nhap vao Sanity

**Vi sao di cung nhau:** Tat ca data sources hien tai (`pricing.ts`, `locations.ts`, `schedule.ts`, `faqs.ts`, `site.ts`) can migrate cung luc vi chung lien quan den nhau.

**Output:**
- 4 locations nhap xong
- 5 pricing tiers nhap xong
- 15 schedule blocks nhap xong va link dung location
- 21 FAQs nhap xong va tag dung pages
- 1 `site_settings` document nhap xong
- Data trong Sanity khop 100% voi data dang live

**Dependency:** Group B

---

## Group D: Operator Verification
**Muc tieu:** Confirm nguoi khong biet code thuc su edit duoc

**Vi sao di cung nhau:** Day la acceptance test cho ca sprint. Neu operator khong edit duoc thi sprint chua xong.

**Output:**
- Operator login Sanity Studio thanh cong
- Operator tu doi gia 1 goi hoc phi va thay thay doi trong Sanity
- Operator tu sua 1 FAQ va thay thay doi trong Sanity
- Operator tu them 1 location moi va thay hien thi dung fields

**Dependency:** Group C

---

## Execution Order

```text
Group A  Setup Project     <- khong dependency
   |
   v
Group B  Define Schemas    <- can A
   |
   v
Group C  Migrate Data      <- can B
   |
   v
Group D  Operator Test     <- can C
```

## Final Result

- Group A done
- Group B done
- Group C done
- Group D done
- Sprint 1 can be treated as complete and ready for Sprint 2
