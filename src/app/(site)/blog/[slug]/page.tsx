import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { JsonLd } from "@/components/ui/JsonLd";
import { canonicalUrl, coreRouteMap, type CoreRoutePath } from "@/lib/routes";
import { siteConfig } from "@/lib/site";
import { getPostBySlug, getPublishedPosts } from "@/lib/sanity";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt ?? "";

  return {
    title: {
      absolute: `${title} | ${siteConfig.name}`,
    },
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPath = post.relatedMoneyPageSlug
    ? (`/${post.relatedMoneyPageSlug}/` as CoreRoutePath)
    : null;
  const relatedRoute =
    relatedPath && Object.prototype.hasOwnProperty.call(coreRouteMap, relatedPath)
      ? coreRouteMap[relatedPath]
      : null;

  const articleSchema = {
    "@context": "https://schema.org" as const,
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
      url: siteConfig.siteUrl,
    },
    mainEntityOfPage: canonicalUrl(`/blog/${post.slug}/`),
    image: post.coverImageUrl ?? undefined,
  };

  return (
    <article className="blog-post">
      <JsonLd id="blog-article-schema" data={articleSchema} />

      <header className="blog-post__hero">
        <div className="blog-post__hero-copy">
          <Link href="/blog/" className="blog-post__back">
            ← Blog
          </Link>
          <span className="blog-post__category">{getCategoryLabel(post.category)}</span>
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
        </div>

        {post.coverImageUrl ? (
          <div className="blog-post__hero-media">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              className="blog-post__cover"
              width={1120}
              height={630}
              priority
              sizes="(max-width: 959px) calc(100vw - 32px), 42vw"
            />
          </div>
        ) : null}
      </header>

      <section className="blog-post__content-shell">
        <div className="blog-post__body">
          <PortableText value={post.body as PortableTextBlock[]} />
        </div>
      </section>

      {relatedRoute ? (
        <aside className="blog-post__related">
          <p className="section__eyebrow">Liên kết phù hợp</p>
          <h2 className="section__title">Tiếp tục với trang phù hợp nhất</h2>
          <p className="section__desc">
            Nếu bạn đang tìm lộ trình cụ thể hơn, chuyển sang trang dịch vụ tương
            ứng để xem học phí, sân tập và câu hỏi thường gặp.
          </p>
          <Link href={relatedRoute.path} className="btn btn--primary">
            {relatedRoute.navLabel}
          </Link>
        </aside>
      ) : null}
    </article>
  );
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case "tips":
      return "Tips";
    case "how-to":
      return "Hướng dẫn";
    case "beginner":
      return "Người mới";
    case "campaign":
      return "Chiến dịch";
    default:
      return "Blog";
  }
}
