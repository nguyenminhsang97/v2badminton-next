# S5D-A2 · Conversion tracking setup

**Muc tieu:** Cau hinh GA4 conversion events trong GTM de do:
1. Lead form submission thanh cong (`generate_lead`)
2. CTA click funnel (hero → pricing → form)

**Thoi gian uoc luong:** 45 phut

**Phu thuoc:** S5D-A1 (GTM container da deploy va nhan events)

**Rui ro:** Thap. Cau hinh trong GTM UI, khong can deploy code.

---

## Context cho junior

Sau S5D-A1, GTM nhan tat ca events tu `window.dataLayer`. Nhung GA4 chua biet event nao la "conversion". Can cau hinh trong GA4 va GTM.

**Events da co san** (tu `src/lib/tracking.ts`):

| Event | Khi nao fire | Params |
|-------|-------------|--------|
| `cta_click` | User click CTA | cta_name, cta_location, page_type, page_path |
| `form_start` | User tuong tac form lan dau | page_type, page_path |
| `generate_lead` | Form submit thanh cong | page_type, lead_type, submission_method, time_to_submit_ms |
| `form_error` | Validation error | field_name, error_code |
| `form_field_focus` | User focus vao field | field_name |
| `form_abandon` | User roi form | last_focused_field |
| `time_to_submit` | Thoi gian tu form_start → submit | time_to_submit_ms |
| `contact_click` | Click Zalo/phone/messenger | method |
| `map_click` | Click xem ban do | location |

**Analytics rule cho ticket nay:** funnel moi nen giu lien ket voi tu duy event cua static site (`D:\V2\landing-page\tracking.js`) thay vi tao he thong ten moi hoan toan.

Ly do:

1. de doi chieu voi website cu de hon
2. de business side doc event names quen thuoc hon
3. de phan tich CTA -> form -> lead it "thuong mai" hon, it technical hon

---

## Buoc 1 — GTM: Tao GA4 Event tags

Trong GTM UI, tao cac tags sau:

### 1a. `generate_lead` event tag

- **Tag type:** Google Analytics: GA4 Event
- **Configuration Tag:** [GA4 config tag tu S5D-A1]
- **Event Name:** `generate_lead`
- **Event Parameters:**
  - `lead_type` → `{{dlv - lead_type}}`
  - `page_type` → `{{dlv - page_type}}`
  - `submission_method` → `{{dlv - submission_method}}`
  - `time_to_submit_ms` → `{{dlv - time_to_submit_ms}}`
- **Trigger:** Custom Event, event name = `generate_lead`

### 1b. `cta_click` event tag

- **Tag type:** GA4 Event
- **Event Name:** `cta_click`
- **Event Parameters:**
  - `cta_name` → `{{dlv - cta_name}}`
  - `cta_location` → `{{dlv - cta_location}}`
  - `page_type` → `{{dlv - page_type}}`
- **Trigger:** Custom Event, event name = `cta_click`

### 1c. `form_start` event tag

- **Tag type:** GA4 Event
- **Event Name:** `form_start`
- **Trigger:** Custom Event, event name = `form_start`

### 1d. `form_abandon` event tag

- **Tag type:** GA4 Event
- **Event Name:** `form_abandon`
- **Event Parameters:**
  - `last_focused_field` → `{{dlv - last_focused_field}}`
- **Trigger:** Custom Event, event name = `form_abandon`

---

## Buoc 2 — GTM: Tao Data Layer Variables

Cho moi parameter can truyen, tao **Data Layer Variable** trong GTM:

| Variable Name | Data Layer Variable Name |
|---------------|-------------------------|
| `dlv - lead_type` | `lead_type` |
| `dlv - page_type` | `page_type` |
| `dlv - page_path` | `page_path` |
| `dlv - cta_name` | `cta_name` |
| `dlv - cta_location` | `cta_location` |
| `dlv - submission_method` | `submission_method` |
| `dlv - time_to_submit_ms` | `time_to_submit_ms` |
| `dlv - last_focused_field` | `last_focused_field` |

---

## Buoc 3 — GA4: Mark conversion event

Trong GA4 Admin → Events → danh dau `generate_lead` la **conversion event**.

Day la event quan trong nhat — do so luong lead thuc te tu website.

---

## Buoc 4 — Test conversion funnel

### 4a. Test trong GTM Preview mode

1. Mo GTM Preview mode
2. Truy cap homepage
3. Click CTA "Dang ky hoc thu" → thay `cta_click` event fire
4. Dien form → thay `form_start` event
5. Submit form → thay `generate_lead` event
6. Tat ca events co dung params

### 4b. Test trong GA4 Realtime

1. Mo GA4 → Realtime report
2. Lam lai flow tren
3. Events hien trong Realtime voi dung event names va params

---

## Buoc 5 — GA4: Tao conversion funnel report

Trong GA4 → Explore → Funnel Exploration:

**Funnel steps:**
1. Page view (homepage)
2. `cta_click` (cta_location = hero hoac pricing)
3. `form_start`
4. `generate_lead`

**Metrics:** Completion rate, drop-off rate, time between steps.

Report nay cho biet user drop off o dau — key insight de optimize.

---

## Cach verify

1. GTM Preview → tat ca events fire dung
2. GA4 Realtime → events hien voi params
3. GA4 Events → `generate_lead` marked as conversion
4. GA4 Explore → Funnel report tao duoc, hien data
5. **Khong can deploy code moi** — toan bo cau hinh trong GTM/GA4 UI
