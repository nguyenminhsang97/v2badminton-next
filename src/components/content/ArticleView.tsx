import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { FaqList } from "@/components/blocks/FaqList";
import { getContentArticle } from "@/lib/sanity";
import { ContentBreadcrumbs } from "./ContentBreadcrumbs";
import { ContentStructuredData } from "./ContentStructuredData";

type ArticleViewProps = {
  id: string;
  path: string;
};

export async function ArticleView({ id, path }: ArticleViewProps) {
  const article = await getContentArticle(id);

  if (!article) {
    notFound();
  }

  const trail = [
    { label: "Trang chủ", href: "/" },
    { label: article.hubTitle, href: article.hubFullPath },
    ...(article.nodeTitle && article.nodeFullPath
      ? [{ label: article.nodeTitle, href: article.nodeFullPath }]
      : []),
    { label: article.title },
  ];

  const categoryLabel = article.nodeTitle ?? article.hubTitle;

  return (
    <>
      <ContentStructuredData
        path={path}
        breadcrumbTrail={trail}
        article={article}
        faqs={article.relatedFaqs}
      />

      <article className="blog-post">
        <ContentBreadcrumbs trail={trail} />

        <header className="blog-post__hero">
          <div className="blog-post__hero-copy">
            <span className="blog-post__category">{categoryLabel}</span>
            <h1 className="blog-post__title">{article.title}</h1>
            {article.publishedAt ? (
              <time
                className="blog-post__date"
                dateTime={article.publishedAt}
              >
                {new Date(article.publishedAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            ) : null}
          </div>

          {article.coverImageUrl ? (
            <div className="blog-post__hero-media">
              <Image
                src={article.coverImageUrl}
                alt={article.coverImageAlt ?? article.title}
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
          {article.quickAnswer ? (
            <div className="quick-answer">
              <p className="quick-answer__label">Tóm tắt nhanh</p>
              <p className="quick-answer__body">{article.quickAnswer}</p>
            </div>
          ) : null}
          {article.excerpt ? (
            <p className="section__desc">{article.excerpt}</p>
          ) : null}
          <div className="blog-post__body">
            <PortableText value={article.body as PortableTextBlock[]} />
          </div>
        </section>

        {article.relatedFaqs.length > 0 ? (
          <section
            className="blog-post__content-shell"
            aria-label="Câu hỏi thường gặp"
          >
            <p className="section__eyebrow">Hỏi & đáp</p>
            <h2 className="section__title">Câu hỏi thường gặp</h2>
            <FaqList faqs={article.relatedFaqs} />
          </section>
        ) : null}

        {article.relatedMoneyPageSlug ? (
          <aside className="blog-post__related">
            <p className="blog-post__related-label">Lớp học liên quan</p>
            <h2 className="section__title">Sẵn sàng học cùng huấn luyện viên?</h2>
            <p className="section__desc">
              Áp dụng kỹ thuật này nhanh hơn với lộ trình có hướng dẫn trực tiếp.
              Xem học phí, lịch tập và sân tại trang lớp học phù hợp.
            </p>
            <Link
              href={`/${article.relatedMoneyPageSlug}/`}
              className="btn btn--primary"
            >
              Xem lớp học phù hợp
            </Link>
          </aside>
        ) : null}
      </article>
    </>
  );
}
