# S5B-A3 - Schedule section rewrite

**Muc tieu:** Rewrite `ScheduleSection` thanh table-first desktop layout theo Figma, co level tags mau, time hierarchy manh, mobile fallback dung duoc.

**Thoi gian uoc luong:** 1.5 gio

**Phu thuoc:** `S5A-A1`

**Rui ro:** Trung binh-cao. Day la section conversion quan trong, can dep hon nhung khong duoc lam kho dung tren mobile.

## Files chinh

- `src/components/home/ScheduleSection.tsx`
- `src/app/globals.css`

## Scope

1. Desktop: table-like layout thay cho card grid cu
2. Time duoc nhan manh ro
3. Level tags co mau phan biet
4. Mobile: scroll / stacked fallback van scan duoc
5. Filter tabs neu dang co thi restyle theo design moi

## Acceptance criteria

1. Desktop schedule co dang table-first, khong phai dark card wall
2. Time, day, location, level scan nhanh bang mat thuong
3. Mobile van usable
4. Existing filter logic va click behavior khong vo
5. Click vao schedule card/row van prefill ContactForm dung

## Implementation notes

### Click-to-prefill behavior (PHAI GIU NGUYEN — conversion-critical)

- `handleCardClick()` goi `buildSchedulePrefill()` → tao `SchedulePrefill` object
- `buildSchedulePrefill()` resolve legacy court ID + construct prefill voi: `courtId`, `timeSlotId`, `message`, optional `levelHint`
- Prefill duoc truyen qua `setPrefill()` tu `useHomepageConversion()` hook
- Khi user click 1 schedule block → ContactForm tu dong dien san thong tin lich hoc

### Filter tabs logic

- Tabs build tu unique `locationId` trong schedule blocks
- Tab order dua vao `LEGACY_COURT_TAB_ORDER` mapping
- "Tat ca" tab hien all blocks, hoac loc theo `selectedCourseIntent` level neu user da chon khoa hoc truoc do
- Hien banner "Dang loc theo trinh do..." khi filtering active

### Sanity fields dung

- Per block: `id`, `locationId`, `locationShortName`, `locationName`, `dayGroup`, `timeLabel`, `levels[]`, `timeSlotId`
