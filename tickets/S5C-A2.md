# S5C-A2 · Blog listing + detail pages

**Muc tieu:** Tao blog listing page (`/blog/`) va detail page (`/blog/[slug]/`). Them blog vao navigation, sitemap, va structured data.

**Thoi gian uoc luong:** 3 gio

**Phu thuoc:** S5C-A1 (can queries va types)

**Rui ro:** Trung binh. Tao route moi voi dynamic segments. Can test slug routing, 404 handling, va SEO metadata.

---

## Context cho junior

Blog la route **khong nam trong `CoreRoutePath`** — no la dynamic route (`/blog/[slug]/`). Khong follow money page pattern. Follow Next.js App Router convention cho dynamic routes.

`/blog/` prefix da duoc reserved trong `reservedRoutePrefixes` (routes.ts dong 131).

---

## Files can tao/sua

1. `src/app/(site)/blog/page.tsx` — listing page
2. `src/app/(site)/blog/[slug]/page.tsx` — detail page
3. `src/app/(site)/blog/layout.tsx` — optional, shared blog layout
4. `src/app/globals.css` — blog styles
5. `src/lib/routes.ts` — blog metadata helper
6. `src/app/(site)/sitemap.ts` — them blog posts vao sitemap
7. `src/components/layout/Nav.tsx` — them blog link

---

## Buoc 1 — Blog listing page

Tao `src/app/(site)/blog/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/sanity";
import { canonicalUrl } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Blog | V2 Badminton",
  description: "Tips cau long, huong dan ky thuat va cam nang cho nguoi moi bat dau tai TP.HCM.",
  alternates: {
    canonical: canonicalUrl("/blog/"),
  },
};

export default async function BlogListPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="blog-list">
      <div className="section__header">
        <h1 className="section__title">Blog V2 Badminton</h1>
        <p className="section__desc">
          Tips, huong dan va cam nang cau long cho nguoi moi bat dau.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="blog-list__empty">
          Chua co bai viet nao. Quay lai sau nhe!
        </p>
      ) : (
        <div className="blog-list__grid">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}/`}
              className="blog-card"
            >
              {post.coverImageUrl ? (
                <Image
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="blog-card__cover"
                  width={400}
                  height={225}
                />
              ) : (
                <div className="blog-card__cover blog-card__cover--placeholder" />
              )}
              <div className="blog-card__body">
                <span className="blog-card__category">{post.category}</span>
                <h2 className="blog-card__title">{post.title}</h2>
                {post.excerpt ? (
                  <p className="blog-card__excerpt">{post.excerpt}</p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Buoc 2 — Blog detail page

Tao `src/app/(site)/blog/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { getPostBySlug, getPublishedPosts } from "@/lib/sanity";
import { canonicalUrl, coreRouteMap, type CoreRoutePath } from "@/lib/routes";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt ?? "";

  return {
    title: { absolute: `${title} | V2 Badminton` },
    description,
    alternates: {
      canonical: canonicalUrl(`/blog/${post.slug}/`),
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPageRoute = post.relatedMoneyPageSlug
    ? coreRouteMap[`/${post.relatedMoneyPageSlug}/` as CoreRoutePath]
    : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    image: post.coverImageUrl ?? undefined,
  };

  return (
    <article className="blog-post">
      <JsonLd id="article-schema" data={articleSchema} />

      <header className="blog-post__header">
        <Link href="/blog/" className="blog-post__back">
          ← Blog
        </Link>
        <span className="blog-post__category">{post.category}</span>
        <h1 className="blog-post__title">{post.title}</h1>
        {post.publishedAt ? (
          <time className="blog-post__date" dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        ) : null}
      </header>

      {post.coverImageUrl ? (
        <Image
          src={post.coverImageUrl}
          alt={post.title}
          className="blog-post__cover"
          width={1120}
          height={630}
          priority
        />
      ) : null}

      <div className="blog-post__body">
        <PortableText value={post.body as PortableTextBlock[]} />
      </div>

      {relatedPageRoute ? (
        <aside className="blog-post__related">
          <p className="blog-post__related-label">Bai viet lien quan</p>
          <Link href={relatedPageRoute.path} className="btn btn--outline">
            {relatedPageRoute.navLabel} →
          </Link>
        </aside>
      ) : null}
    </article>
  );
}
```

**`generateStaticParams()`:** Next.js pre-render cac slugs da biet tai build time. Posts moi publish sau build duoc render on-demand (ISR).

**`relatedMoneyPage`:** Neu post co link ve money page, hien CTA cuoi bai.

---

## Buoc 3 — Blog CSS

Them vao `globals.css`:

```css
/* Blog listing */
.blog-list {
  display: grid;
  gap: 32px;
  padding: 48px 0;
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
}

.blog-list__empty {
  color: var(--v2-muted);
  text-align: center;
  padding: 48px 0;
}

.blog-list__grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.blog-card {
  display: grid;
  gap: 0;
  border: 1px solid var(--v2-border);
  background: rgba(20, 20, 20, 0.92);
  overflow: hidden;
  transition: border-color 0.2s ease;
}

.blog-card:hover {
  border-color: rgba(200, 245, 66, 0.35);
}

.blog-card__cover {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.blog-card__cover--placeholder {
  background: rgba(255, 255, 255, 0.03);
}

.blog-card__body {
  display: grid;
  gap: 8px;
  padding: 16px 20px 20px;
}

.blog-card__category {
  color: var(--v2-lime);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.blog-card__title {
  color: var(--v2-white);
  font-size: 1.15rem;
  line-height: 1.35;
}

.blog-card__excerpt {
  color: var(--v2-muted);
  font-size: 0.92rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Blog detail */
.blog-post {
  display: grid;
  gap: 32px;
  padding: 48px 0;
  width: min(720px, calc(100% - 32px));
  margin: 0 auto;
}

.blog-post__header {
  display: grid;
  gap: 12px;
}

.blog-post__back {
  color: var(--v2-muted);
  font-size: 0.92rem;
  transition: color 0.2s ease;
}

.blog-post__back:hover {
  color: var(--v2-lime);
}

.blog-post__category {
  color: var(--v2-lime);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.blog-post__title {
  color: var(--v2-white);
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  line-height: 1.15;
}

.blog-post__date {
  color: var(--v2-muted);
  font-size: 0.92rem;
}

.blog-post__cover {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.blog-post__body {
  color: var(--v2-light);
  line-height: 1.85;
  font-size: 1.05rem;
}

.blog-post__body h2 {
  color: var(--v2-white);
  font-size: 1.5rem;
  margin-top: 32px;
  margin-bottom: 12px;
}

.blog-post__body h3 {
  color: var(--v2-white);
  font-size: 1.2rem;
  margin-top: 24px;
  margin-bottom: 8px;
}

.blog-post__body ul,
.blog-post__body ol {
  padding-left: 24px;
  display: grid;
  gap: 8px;
}

.blog-post__body a {
  color: var(--v2-lime);
  border-bottom: 1px solid rgba(200, 245, 66, 0.35);
}

.blog-post__body a:hover {
  border-bottom-color: var(--v2-lime);
}

.blog-post__related {
  display: grid;
  gap: 12px;
  padding: 24px;
  border: 1px solid var(--v2-border);
  background: rgba(20, 20, 20, 0.92);
}

.blog-post__related-label {
  color: var(--v2-muted);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
```

---

## Buoc 4 — Them blog vao sitemap

Mo `src/app/(site)/sitemap.ts` (hoac `src/app/sitemap.ts`). Them blog posts:

```ts
import { getPublishedPosts } from "@/lib/sanity";

// ... existing code

export default async function sitemap() {
  const posts = await getPublishedPosts();

  const blogEntries = posts.map((post) => ({
    url: canonicalUrl(`/blog/${post.slug}/`),
    lastModified: post.publishedAt ?? new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...existingEntries, // cac core routes da co
    // Blog listing
    {
      url: canonicalUrl("/blog/"),
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...blogEntries,
  ];
}
```

---

## Buoc 5 — Them blog vao Nav

Mo `src/components/layout/Nav.tsx`. Them link blog vao desktop va mobile nav:

Desktop nav: them truoc CTA button:
```tsx
<a href="/blog/" className="site-nav__link">Blog</a>
```

Mobile nav: them truoc mobile CTA:
```tsx
<a href="/blog/" className="site-nav__mobile-link">Blog</a>
```

---

## Cach verify

1. `npm run lint` — pass
2. `npm run build` — pass
3. `/blog/` → listing page hien (empty state neu chua co posts)
4. Tao 1 test post trong Sanity Studio, publish, cho ISR
5. `/blog/` → post hien trong grid
6. Click post → `/blog/[slug]/` → detail hien voi body, cover, date, category
7. Back button "← Blog" → ve listing
8. Related money page CTA hien neu post co `relatedMoneyPage`
9. Sitemap.xml → co `/blog/` va `/blog/[slug]/`
10. Nav → co link "Blog"
