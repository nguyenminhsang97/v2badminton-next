import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCategoryLabel } from "@/lib/blogUtils";
import { getGeneratedBlogCategoryImage } from "@/lib/generatedImages";
import { canonicalUrl } from "@/lib/routes";
import {
  getPublishedPosts,
  type SanityPostCategory,
  type SanityPostListItem,
} from "@/lib/sanity";
import { siteConfig } from "@/lib/site";

const BLOG_CATEGORY_OPTIONS: ReadonlyArray<{
  value: "all" | SanityPostCategory;
  label: string;
}> = [
  { value: "all", label: "Tất cả" },
  { value: "tips", label: "Tips" },
  { value: "how-to", label: "Hướng dẫn" },
  { value: "beginner", label: "Người mới" },
  { value: "campaign", label: "Chiến dịch" },
] as const;

type BlogListPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

const blogMetadata: Metadata = {
  title: {
    absolute: "Blog | V2 Badminton",
  },
  description:
    "Tips cầu lông, hướng dẫn kỹ thuật và cẩm nang cho người mới bắt đầu tại TP.HCM.",
  alternates: {
    canonical: canonicalUrl("/blog/"),
  },
  openGraph: {
    title: "Blog | V2 Badminton",
    description:
      "Tips cầu lông, hướng dẫn kỹ thuật và cẩm nang cho người mới bắt đầu tại TP.HCM.",
    url: canonicalUrl("/blog/"),
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    type: "website",
    images: [canonicalUrl(siteConfig.defaultOgImagePath)],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | V2 Badminton",
    description:
      "Tips cầu lông, hướng dẫn kỹ thuật và cẩm nang cho người mới bắt đầu tại TP.HCM.",
    images: [canonicalUrl(siteConfig.defaultOgImagePath)],
  },
};

function resolveSelectedCategory(category: string | undefined) {
  return BLOG_CATEGORY_OPTIONS.some((option) => option.value === category)
    ? (category as SanityPostCategory)
    : "all";
}

function filterPostsByCategory(
  posts: SanityPostListItem[],
  selectedCategory: "all" | SanityPostCategory,
) {
  return selectedCategory === "all"
    ? posts
    : posts.filter((post) => post.category === selectedCategory);
}

export async function generateMetadata({
  searchParams,
}: BlogListPageProps): Promise<Metadata> {
  const params = await searchParams;
  const selectedCategory = resolveSelectedCategory(params.category);
  const posts = await getPublishedPosts();
  const filteredPosts = filterPostsByCategory(posts, selectedCategory);

  if (filteredPosts.length > 0) {
    return blogMetadata;
  }

  return {
    ...blogMetadata,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function BlogListPage({
  searchParams,
}: BlogListPageProps) {
  const params = await searchParams;
  const selectedCategory = resolveSelectedCategory(params.category);
  const posts = await getPublishedPosts();
  const filteredPosts = filterPostsByCategory(posts, selectedCategory);

  return (
    <div className="blog-list">
      <section className="blog-list__hero">
        <div className="section__header">
          <p className="section__eyebrow">Nội dung chuyên sâu</p>
          <h1 className="section__title">Blog V2 Badminton</h1>
          <p className="section__desc">
            Tips, hướng dẫn và cẩm nang cầu lông cho người mới bắt đầu, người đi
            làm và phụ huynh đang tìm lộ trình phù hợp tại TP.HCM.
          </p>
        </div>
        <div className="blog-list__hero-meta">
          <span className="blog-list__hero-chip">
            {filteredPosts.length} bài viết hiển thị
          </span>
          <span className="blog-list__hero-chip">
            Chuẩn bị cho người mới và phụ huynh
          </span>
        </div>
      </section>

      <div className="blog-filter" aria-label="Lọc bài viết theo chủ đề">
        {BLOG_CATEGORY_OPTIONS.map((option) => {
          const isActive = option.value === selectedCategory;
          const href =
            option.value === "all"
              ? "/blog/"
              : `/blog/?category=${option.value}`;

          return (
            <Link
              key={option.value}
              href={href}
              className={`btn ${isActive ? "btn--primary" : "btn--outline"} blog-filter__button`}
              aria-current={isActive ? "page" : undefined}
            >
              {option.label}
            </Link>
          );
        })}
      </div>

      {filteredPosts.length === 0 ? (
        <section className="blog-list__empty-card">
          <p className="page-kicker">Sắp cập nhật</p>
          <h2 className="section__title">Chưa có bài viết trong chủ đề này</h2>
          <p className="section__desc">
            V2 sẽ bổ sung thêm nội dung khi có bài viết mới phù hợp với chủ đề
            bạn đang xem.
          </p>
        </section>
      ) : (
        <section className="blog-list__grid" aria-label="Danh sách bài viết">
          {filteredPosts.map((post) => {
            const coverImageUrl =
              post.coverImageUrl ?? getGeneratedBlogCategoryImage();
            const coverAlt = post.coverImageUrl
              ? post.title
              : `Ảnh minh họa bài viết ${getCategoryLabel(post.category)}`;

            return (
              <article key={post.id} className="blog-card">
                <Link href={`/blog/${post.slug}/`} className="blog-card__media">
                  <Image
                    src={coverImageUrl}
                    alt={coverAlt}
                    className="blog-card__cover"
                    width={720}
                    height={405}
                    sizes="(max-width: 960px) calc(100vw - 32px), 360px"
                  />
                </Link>
                <div className="blog-card__body">
                  <span className="blog-card__category">
                    {getCategoryLabel(post.category)}
                  </span>
                  <Link
                    href={`/blog/${post.slug}/`}
                    className="blog-card__title-link"
                  >
                    <h2 className="blog-card__title">{post.title}</h2>
                  </Link>
                  {post.excerpt ? (
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                  ) : null}
                  <Link href={`/blog/${post.slug}/`} className="blog-card__cta">
                    Đọc bài viết →
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
