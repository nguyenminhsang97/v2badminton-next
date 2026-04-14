# S5C-A1 · Blog queries + types

**Muc tieu:** Them Sanity GROQ queries va TypeScript types cho blog system. Sau ticket nay co the fetch posts tu Sanity — nhung chua co route/UI (do la S5C-A2).

**Thoi gian uoc luong:** 30 phut

**Phu thuoc:** Khong (blog schema `post.ts` da co tu Sprint 1)

**Rui ro:** Thap. Them queries moi, khong sua code hien tai.

---

## Context cho junior

Schema `post.ts` da co day du fields: title, slug, status, category, publishedAt, excerpt, coverImage, body, metaTitle, metaDescription, relatedMoneyPage.

Pattern follow: xem cach `getMoneyPage()` trong `src/lib/sanity/queries.ts` — dung `cache()` + `sanityFetchOrFallback()`. Blog queries cung lam y vay.

**Khac biet voi money pages:** Blog co list page (nhieu posts) va detail page (1 post). Can 2 queries: `getPublishedPosts()` va `getPostBySlug()`.

---

## File can sua

`src/lib/sanity/queries.ts`

---

## Buoc 1 — Them `SanityPost` type

Dat sau `SanityActiveCampaign` type:

```ts
export type SanityPost = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  category: "tips" | "how-to" | "beginner" | "campaign";
  publishedAt: string | null;
  excerpt: string | null;
  coverImageUrl: string | null;
  body: unknown[];
  metaTitle: string | null;
  metaDescription: string | null;
  relatedMoneyPageSlug: string | null;
};

export type SanityPostListItem = Pick<
  SanityPost,
  "id" | "slug" | "title" | "category" | "publishedAt" | "excerpt" | "coverImageUrl"
>;
```

**Tai sao 2 types?** `SanityPostListItem` cho listing page (khong can body, meta fields). `SanityPost` cho detail page (can tat ca).

---

## Buoc 2 — Them GROQ queries

### 2a. Published posts list query

```ts
const PUBLISHED_POSTS_QUERY = defineQuery(`
  *[
    _type == "post" &&
    status == "published" &&
    ${PUBLISHED_ONLY_FILTER}
  ]
  | order(publishedAt desc){
    "id": _id,
    "slug": slug.current,
    title,
    category,
    publishedAt,
    "excerpt": coalesce(excerpt, null),
    "coverImageUrl": coverImage.asset->url
  }
`);
```

### 2b. Single post by slug query

```ts
const POST_BY_SLUG_QUERY = defineQuery(`
  *[
    _type == "post" &&
    slug.current == $slug &&
    status == "published" &&
    ${PUBLISHED_ONLY_FILTER}
  ][0]{
    "id": _id,
    "slug": slug.current,
    title,
    status,
    category,
    publishedAt,
    "excerpt": coalesce(excerpt, null),
    "coverImageUrl": coverImage.asset->url,
    body,
    "metaTitle": coalesce(metaTitle, null),
    "metaDescription": coalesce(metaDescription, null),
    "relatedMoneyPageSlug": relatedMoneyPage->slug.current
  }
`);
```

---

## Buoc 3 — Them fetch functions

### 3a. `getPublishedPosts()`

```ts
export const getPublishedPosts = cache(
  async (): Promise<SanityPostListItem[]> => {
    return sanityFetchOrFallback<SanityPostListItem[]>({
      query: PUBLISHED_POSTS_QUERY,
      fallback: [],
      tags: ["sanity:post"],
    });
  },
);
```

### 3b. `getPostBySlug()`

```ts
export const getPostBySlug = cache(
  async (slug: string): Promise<SanityPost | null> => {
    return sanityFetchOrFallback<SanityPost>({
      query: POST_BY_SLUG_QUERY,
      params: { slug },
      fallback: null,
      tags: ["sanity:post"],
    });
  },
);
```

**Tai sao `fallback: []` cho list va `fallback: null` cho detail?** List page hien empty state khi Sanity down. Detail page hien 404 khi post khong tim thay.

---

## Buoc 4 — Verify exports

`src/lib/sanity/index.ts` dung wildcard `export * from "./queries"` — tu dong export. Khong can sua file nay.

---

## Cach verify

1. `npm run lint` — pass
2. `npm run build` — pass
3. Test nhanh (tam, xoa sau):
   - Them vao homepage `page.tsx`: `import { getPublishedPosts } from "@/lib/sanity"; const posts = await getPublishedPosts(); console.log("posts:", posts.length);`
   - Dev server → terminal: `posts: 0` (chua co published posts)
   - Xoa test code
