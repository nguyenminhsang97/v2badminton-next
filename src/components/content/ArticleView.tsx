import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponentProps } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { toPlainText } from "@portabletext/toolkit";
import { FaqList } from "@/components/blocks/FaqList";
import { loadSiteChromeSettings } from "@/components/layout/siteSettings";
import { getContentArticle } from "@/lib/sanity";
import { slugifyValue } from "@/sanity/schemaTypes/shared";
import { ArticleByline } from "./ArticleByline";
import { ContentBreadcrumbs } from "./ContentBreadcrumbs";
import { ContentStructuredData } from "./ContentStructuredData";

type ArticleViewProps = {
  id: string;
  path: string;
};

export async function ArticleView({ id, path }: ArticleViewProps) {
  const [article, siteSettings] = await Promise.all([
    getContentArticle(id),
    loadSiteChromeSettings(),
  ]);

  if (!article) {
    notFound();
  }

  const { cmsUiStrings } = siteSettings;

  // Heading anchor IDs — de-duped: repeat slugs get -2, -3, etc.
  const seenSlugs: Record<string, number> = {};
  function makeHeadingId(value: PortableTextBlock): string {
    const base = slugifyValue(toPlainText(value));
    const count = (seenSlugs[base] = (seenSlugs[base] ?? 0) + 1);
    return count === 1 ? base : `${base}-${count}`;
  }

  const portableTextComponents = {
    block: {
      h2: ({ children, value }: PortableTextComponentProps<PortableTextBlock>) => (
        <h2 id={makeHeadingId(value)}>{children}</h2>
      ),
      h3: ({ children, value }: PortableTextComponentProps<PortableTextBlock>) => (
        <h3 id={makeHeadingId(value)}>{children}</h3>
      ),
    },
  };

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
            <ArticleByline
              author={article.author}
              publishedAt={article.publishedAt}
              updatedAt={article.updatedAt}
              reviewer={article.reviewer}
              lastReviewed={article.lastReviewed}
            />
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
              <p className="quick-answer__label">{cmsUiStrings.quickAnswerLabel}</p>
              <p className="quick-answer__body">{article.quickAnswer}</p>
            </div>
          ) : null}
          {article.excerpt ? (
            <p className="section__desc">{article.excerpt}</p>
          ) : null}
          <div className="blog-post__body">
            <PortableText
              value={article.body as PortableTextBlock[]}
              components={portableTextComponents}
            />
          </div>
        </section>

        {article.relatedFaqs.length > 0 ? (
          <section
            className="blog-post__content-shell"
            aria-label={cmsUiStrings.faqTitle}
          >
            <p className="section__eyebrow">{cmsUiStrings.faqEyebrow}</p>
            <h2 className="section__title">{cmsUiStrings.faqTitle}</h2>
            <FaqList faqs={article.relatedFaqs} />
          </section>
        ) : null}

        {article.relatedMoneyPageSlug ? (
          <aside className="blog-post__related">
            <p className="blog-post__related-label">{cmsUiStrings.articleAsideLabel}</p>
            <h2 className="section__title">{cmsUiStrings.articleAsideTitle}</h2>
            <p className="section__desc">
              Áp dụng kỹ thuật này nhanh hơn với lộ trình có hướng dẫn trực tiếp.
              Xem học phí, lịch tập và sân tại trang lớp học phù hợp.
            </p>
            <Link
              href={`/${article.relatedMoneyPageSlug}/`}
              className="btn btn--primary"
              data-track-event="cms_article_cta_click"
              data-article-slug={article.slug}
              data-article-hub={article.hubSlug}
              data-target-money-page={article.relatedMoneyPageSlug}
              data-page-path={path}
            >
              {cmsUiStrings.articleAsideCta}
            </Link>
          </aside>
        ) : null}
      </article>
    </>
  );
}
