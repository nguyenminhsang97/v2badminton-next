# S1-D1 Runbook

## Preflight

Project:

- Project ID: `w58s0f53`
- Dataset: `production`

Current baseline:

- `site_settings`: 1
- `location`: 4
- `pricing_tier`: 5
- `schedule_block`: 15
- `faq`: 21
- Total valid documents: 46

Current project members on 2026-04-09:

- `nguyenminhsang97` -> `Administrator`

Note:

- Hien chua co operator account rieng. Neu can strict acceptance theo vai tro "operator", hay invite them 1 user khong lam dev.
- Neu can chot Sprint 1 nhanh, owner hien tai co the dong vai operator va tu chay acceptance flow.

## Start Studio

Trong repo `D:\V2\v2badminton-next`:

```powershell
npm run sanity:dev
```

Mo:

- `http://localhost:3000/studio`

## Test 1: Pricing Tier Edit

Muc tieu:

- Xac nhan operator tim duoc document pricing va save duoc thay doi.

Document:

- `Pricing Tier`
- `3 buoi / tuan`

Gia tri hien tai:

- `Price Per Month = 1300000`

Thao tac:

1. Mo `Pricing Tier`.
2. Chon document `3 buoi / tuan`.
3. Sua `Price Per Month` thanh `1350000`.
4. Save / Publish.
5. Kiem tra Studio bao save thanh cong.
6. Sua lai `Price Per Month` ve `1300000`.
7. Save / Publish lai.

Pass khi:

- Operator tu tim duoc document.
- Save thanh cong ca 2 lan.
- Gia tri cuoi cung tro lai `1300000`.

## Test 2: FAQ Edit

Muc tieu:

- Xac nhan operator sua duoc Portable Text field.

Document:

- `FAQ`
- `Toi chua bao gio choi cau long, co hoc duoc khong?`

Thao tac:

1. Mo `FAQ`.
2. Chon cau hoi tren.
3. O field `Answer`, them chuoi ` (test)` vao cuoi doan text.
4. Save / Publish.
5. Kiem tra thay doi da duoc luu.
6. Xoa chuoi ` (test)`.
7. Save / Publish lai.

Pass khi:

- Operator sua duoc field `Answer`.
- Save thanh cong ca 2 lan.
- Noi dung cuoi cung tro lai ban goc.

## Test 3: Create And Delete Location

Muc tieu:

- Xac nhan operator tao moi va xoa document duoc.

Gia tri de nhap:

- `Name = San Test`
- `Slug = san-test`
- `Short Name = Test`
- `District = Binh Thanh`
- `Address Text = 123 Test Street, Binh Thanh, Ho Chi Minh`
- `Maps URL = https://example.com/test-location`
- `Geo Latitude = 10.8`
- `Geo Longitude = 106.7`
- `Order = 999`
- `Is Active = false`

Thao tac:

1. Mo `Location`.
2. Tao document moi.
3. Nhap cac field tren.
4. Save / Publish.
5. Xac nhan document duoc tao.
6. Xoa document `San Test`.

Pass khi:

- Operator tu tao document moi duoc.
- Khong gap validation error.
- Document test duoc xoa sau khi kiem tra.

## Test 4: Reference Navigation

Muc tieu:

- Xac nhan operator hieu reference field va navigate duoc.

Document goi y:

- `Schedule Block`
- `hue-thien-toi-18-20-t2-t4-t6`

Thao tac:

1. Mo `Schedule Block`.
2. Chon document tren.
3. Click vao field `Location`.
4. Kiem tra document duoc mo la `San Hue Thien`.
5. Quay lai `Schedule Block`.

Pass khi:

- Reference mo dung document target.
- Operator hieu reference la link toi document khac.

## Post-Test Check

Sau khi operator xong, chay:

```powershell
npx sanity@latest documents validate --project-id w58s0f53 --dataset production --level error --yes
```

Expected:

- `Valid: 46 documents`
- `Errors: 0`

Neu muon kiem tra nhanh doc counts:

```powershell
npx sanity@latest documents query "*[]{_type}" --project-id w58s0f53 --dataset production --api-version 2026-04-09
```

## Done Signal

S1-D1 duoc xem la pass khi operator co the noi duoc mot cau don gian:

- `Toi edit duoc, toi hieu cach tim document, save, va xoa test data trong Studio.`
