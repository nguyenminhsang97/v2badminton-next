# S1-A1 Runbook: Init Sanity Project

## Muc tieu

Hoan thanh ticket `S1-A1` bang cach tao 1 Sanity project moi cho V2 Badminton, co dataset `production`, owner truy cap duoc, va san sang ban giao sang `S1-A2`.

Ticket nay chi lam 3 viec:

- Tao project
- Tao hoac xac nhan dataset `production`
- Ghi lai `project ID` va quyen truy cap

Khong lam trong ticket nay:

- Khong embed Sanity Studio vao Next.js
- Khong install Sanity packages vao repo
- Khong tao schema
- Khong tao API token cho frontend

## Nguon tham chieu da doi chieu

- Sanity CLI `init` reference, cap nhat ngay March 24, 2026
- Sanity CLI `datasets` reference
- Sanity docs ve Growth plan trial, cap nhat ngay February 26, 2026
- Sanity docs ve deploy/invite collaborators

## Luu y quan trong ve plan va role

Tinh den ngay `2026-04-09`:

- Moi project moi deu duoc mo `Growth plan trial` tu dong
- Trial giu usage limits giong Free plan, nhung mo them role va paid features
- Role `Editor` nam trong nhom Growth/Enterprise
- Neu trial het han ma khong upgrade, user non-admin co the bi chuyen thanh `Viewer`

Noi cach khac: neu ban can invite operator voi role `Editor`, viec nay hop le trong giai doan trial. Neu ve sau trial ket thuc, can kiem tra lai plan.

## Cach lam de xuat

Dung Sanity CLI o che do `--bare` de chi tao project + dataset, khong scaffold Studio som. Cach nay phu hop voi scope cua `S1-A1` va khong chen vao cong viec `S1-A2`.

## Buoc 1: Dang nhap Sanity

Mo terminal tai root repo:

```powershell
cd D:\V2\v2badminton-next
npx sanity@latest login
```

Neu CLI mo browser de dang nhap, hoan tat dang nhap roi quay lai terminal.

## Buoc 2: Tao project moi

Chay lenh:

```powershell
npx sanity@latest init --bare --project-name "v2-badminton" --dataset-default
```

Ky vong:

- CLI tao project moi
- CLI tao dataset public mac dinh ten `production`
- CLI in ra `project ID`

Neu ten `v2-badminton` da trung, dung:

```powershell
npx sanity@latest init --bare --project-name "v2-badminton-cms" --dataset-default
```

## Buoc 3: Ghi lai project ID

Ngay sau khi tao xong, ghi lai:

- `projectId`
- `dataset = production`
- email owner da tao project
- ngay tao project

Khuyen nghi luu tam vao `.env.local` de `S1-A2` dung luon:

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
```

Khong commit `.env.local` len git.

## Buoc 4: Verify bang CLI

Thay `YOUR_PROJECT_ID` bang project ID vua tao:

```powershell
npx sanity@latest datasets list --project-id YOUR_PROJECT_ID
npx sanity@latest datasets visibility get production --project-id YOUR_PROJECT_ID
```

Ket qua can thay:

- Dataset `production` co ton tai
- Visibility cua `production` la `public`

## Buoc 5: Verify bang dashboard

Mo:

- `https://sanity.io/manage`

Check lan luot:

1. Thay project moi trong danh sach
2. Mo project do
3. Vao `Datasets` va xac nhan co dataset `production`
4. Vao `Members` va xac nhan owner dang co quyen admin

## Buoc 6: Invite operator neu can

Neu da co nguoi can vao CMS de nhap/sua content, vao:

- `Sanity Manage`
- Chon project
- `Members`
- Invite them

Hoac dung CLI:

```powershell
npx sanity@latest users invite operator@example.com --project-id YOUR_PROJECT_ID --role editor
npx sanity@latest users list --project-id YOUR_PROJECT_ID --invitations
```

Role nen dung trong sprint nay:

- `Administrator` cho owner/chu du an
- `Editor` cho operator content

Khong can cap `Administrator` cho operator neu ho chi sua content.

## Buoc 7: Chot acceptance

Ticket `S1-A1` duoc xem la xong khi ca 4 diem duoi day deu dung:

1. `sanity.io/manage` hien project `v2-badminton` hoac ten fallback tuong duong
2. Project co dataset `production`
3. Owner login duoc va co full access
4. `project ID` da duoc ghi lai trong `.env.local` hoac note noi bo

## Command checklist

Copy-paste theo thu tu:

```powershell
cd D:\V2\v2badminton-next
npx sanity@latest login
npx sanity@latest init --bare --project-name "v2-badminton" --dataset-default
npx sanity@latest datasets list --project-id YOUR_PROJECT_ID
npx sanity@latest datasets visibility get production --project-id YOUR_PROJECT_ID
```

## Handoff sang S1-A2

Sau khi xong `S1-A1`, can chuyen 2 gia tri sau sang `S1-A2`:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET=production`

Va nho rang `S1-A2` moi la ticket:

- install package
- tao studio config
- them `sanity:dev`
- them env placeholders vao `.env.example`
- cau hinh local studio trong repo
