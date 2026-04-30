# Sanity seed content

Placeholder content cho `/huan-luyen-vien/` và `/blog/` để bridge gap khi chưa có content thật.

**Tất cả documents được seed ở trạng thái không hiển thị trên website**:
- Coaches: `isActive: false` → query `getCoaches()` filter ra
- Posts: `status: "draft"` → query `getPublishedPosts()` filter ra

User review trong Sanity Studio (`/studio`), bổ sung ảnh, sửa nội dung, rồi flip toggle khi sẵn sàng.

## Files

| File | Documents | Schema |
|---|---|---|
| `coaches.ndjson` | 4 coach drafts | `coach` |
| `posts.ndjson` | 6 blog post drafts | `post` |

## Import vào Sanity dataset

Cần một Sanity API token có quyền write. Tạo tại https://www.sanity.io/manage → project → API → Add API token (Editor role).

```bash
# Set token cho session hiện tại
export SANITY_AUTH_TOKEN="<your-write-token>"

# Import từ project root
npx sanity dataset import seed/sanity/coaches.ndjson production
npx sanity dataset import seed/sanity/posts.ndjson production
```

Nếu dataset là `development` hoặc tên khác, đổi `production` thành dataset name (xem `NEXT_PUBLIC_SANITY_DATASET` trong `.env.local`).

### Nếu muốn replace (xóa rồi import lại):

```bash
npx sanity dataset import --replace seed/sanity/posts.ndjson production
```

⚠️ `--replace` chỉ áp dụng cho documents có cùng `_id`. Documents khác trong dataset không bị xóa.

## Sau khi import

### Coach checklist

1. Mở Studio → "Huấn luyện viên" → mỗi coach:
   - Upload ảnh thật vào field `Ảnh HLV` (4:5 hoặc vuông, chất lượng cao)
   - Sửa tên thật (đang là "Coach An/Bình/Chi/Dũng" placeholder)
   - Verify credential tags (chứng chỉ, năm kinh nghiệm) đúng với HLV thật
   - Verify quote, focus line phản ánh đúng phong cách HLV
   - Bật `Hiển thị trên web?` (`isActive: true`)
   - 3 trên 4 coach mặc định `featured: true` để hiển thị homepage. Adjust theo nhu cầu.

### Post checklist

1. Mở Studio → "Post" → mỗi post:
   - Đọc lại body, edit cho match brand voice
   - Upload `Cover Image` (16:9, ≥1200x630px cho OG)
   - Set `Related Money Page` reference (rất quan trọng cho SEO internal linking) → chọn trang phù hợp:
     - Post 1, 2 → `/hoc-cau-long-cho-nguoi-moi/`
     - Post 3 → `/lop-cau-long-cho-nguoi-di-lam/`
     - Post 4 → `/gia-hoc-cau-long-tphcm/`
     - Post 5 → `/lop-cau-long-tre-em/`
     - Post 6 → `/cau-long-doanh-nghiep/`
   - Set `Published At` về thời điểm publish thực tế
   - Đổi `status` từ `draft` sang `published`

## Rollback

Nếu muốn xóa hết drafts đã import:

```bash
npx sanity documents query "*[_id in path('coach-*-draft') || _id in path('post-*-draft')] | order(_id)" --apply='delete()'
```

Hoặc xóa từng cái trong Studio.

## Notes

- Nội dung là placeholder generated, **không reflect HLV và chính sách thực tế** của V2 Badminton.
- Tên coach (An/Bình/Chi/Dũng) là tên Việt phổ biến — nên thay bằng tên thật.
- Số liệu trong post (vd "320+ học viên nhí", "200+ học viên đi làm") là placeholder.
- Body của post tránh claim cụ thể có thể sai sự thật, tập trung vào framework và phương pháp.

Liên quan: GitHub issue [#9](../../../../issues/9).
