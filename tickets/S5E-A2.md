# S5E-A2 - Blog listing + detail pages

**Muc tieu:** Xay `/blog/` va `/blog/[slug]/` theo design system moi, co metadata, sitemap, nav link, Article schema.

**Thoi gian uoc luong:** 1.5 gio

**Phu thuoc:** `S5E-A1`

**Rui ro:** Trung binh. Dynamic route + metadata + sitemap can dung.

## Files chinh

- `src/app/(site)/blog/page.tsx`
- `src/app/(site)/blog/[slug]/page.tsx`
- `src/app/sitemap.ts`
- `src/components/layout/Nav.tsx`
- `src/app/globals.css`

## Scope

1. Listing page
2. Detail page
3. Article structured data
4. Sitemap entries
5. Nav exposure

## Acceptance criteria

1. Blog dung chung design system Sprint 5, khong tach theme rieng
2. Listing / detail / 404 flow dung
3. Sitemap co `/blog/` va published posts

## Implementation notes

### Listing page layout (`/blog/`)

```
[Nav]
[Page kicker: "Blog"]
[H1: "Bài viết từ V2 Badminton"]
[Grid 2-3 col desktop, 1 col mobile]
  [Card: image + title + excerpt + date + "Đọc tiếp" link]
  [Card: ...]
[Footer]
```

- Fetch: `getPublishedPosts()` — return array sorted by publishedAt desc
- Empty state: "Chưa có bài viết nào." message
- Metadata: title "Blog | V2 Badminton", description generic

### Detail page layout (`/blog/[slug]/`)

```
[Nav]
[Breadcrumb: Trang chủ → Blog → {post.title}]
[Article]
  [H1: post.title]
  [Meta: date + author nếu có]
  [PortableText body]
[Footer]
```

- Fetch: `getPostBySlug(slug)` — return null if not found → `notFound()`
- Structured data: `Article` JSON-LD schema (headline, datePublished, author)
- Metadata: dynamic `generateMetadata` tu post title + excerpt

### Nav link

- Them "Blog" vao `primaryLinks` trong Nav — **da co san** (href="/blog/", label="Blog")
