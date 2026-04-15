import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { canonicalUrl } from "@/lib/routes";
import {
  getPublishedPosts,
  type SanityPostCategory,
} from "@/lib/sanity";

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

export const metadata: Metadata = {
  title: {
    absolute: "Blog | V2 Badminton",
  },
  description:
    "Tips cầu lông, hướng dẫn kỹ thuật và cẩm nang cho người mới bắt đầu tại TP.HCM.",
  alternates: {
    canonical: canonicalUrl("/blog/"),
  },
};

export default async function BlogListPage({
  searchParams,
}: BlogListPageProps) {
  const params = await searchParams;
  const selectedCategory = BLOG_CATEGORY_OPTIONS.some(
    (option) => option.value === params.category,
  )
    ? (params.category as SanityPostCategory)
    : "all";

  const posts = await getPublishedPosts();
  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="blog-list">
      <div className="section__header">
        <p className="section__eyebrow">Nội dung chuyên sâu</p>
        <h1 className="section__title">Blog V2 Badminton</h1>
        <p className="section__desc">
          Tips, hướng dẫn và cẩm nang cầu lông cho người mới bắt đầu, người đi
          làm và phụ huynh đang tìm lộ trình phù hợp tại TP.HCM.
        </p>
      </div>

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
        <p className="blog-list__empty">
          Chưa có bài viết nào trong chủ đề này. Mình sẽ cập nhật sớm.
        </p>
      ) : (
        <div className="blog-list__grid">
          {filteredPosts.map((post) => (
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
                  sizes="(max-width: 960px) calc(100vw - 32px), 360px"
                />
              ) : (
                <div className="blog-card__cover blog-card__cover--placeholder" />
              )}
              <div className="blog-card__body">
                <span className="blog-card__category">
                  {getCategoryLabel(post.category)}
                </span>
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

function getCategoryLabel(category: SanityPostCategory): string {
  switch (category) {
    case "tips":
      return "Tips";
    case "how-to":
      return "Hướng dẫn";
    case "beginner":
      return "Người mới";
    case "campaign":
      return "Chiến dịch";
  }
}
