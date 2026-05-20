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

  return (
    <>
      <ContentStructuredData
        path={path}
        breadcrumbTrail={trail}
        article={article}
        faqs={article.relatedFaqs}
      />

      <article className="content-article">
        <ContentBreadcrumbs trail={trail} />

        <h1 className="content-article__title">{article.title}</h1>

        {article.excerpt ? (
          <p className="content-article__lead">{article.excerpt}</p>
        ) : null}

        {article.coverImageUrl ? (
          <div className="content-article__cover">
            <Image
              src={article.coverImageUrl}
              alt={article.coverImageAlt ?? article.title}
              width={800}
              height={450}
              priority
            />
          </div>
        ) : null}

        {article.quickAnswer ? (
          <div className="quick-answer">
            <p className="quick-answer__label">Tóm tắt nhanh</p>
            <p className="quick-answer__body">{article.quickAnswer}</p>
          </div>
        ) : null}

        <div className="content-article__body">
          <PortableText value={article.body as PortableTextBlock[]} />
        </div>

        {article.relatedFaqs.length > 0 ? (
          <section className="content-article__faqs">
            <h2>Câu hỏi thường gặp</h2>
            <FaqList faqs={article.relatedFaqs} />
          </section>
        ) : null}

        {article.relatedMoneyPageSlug ? (
          <div className="content-article__cta">
            <Link href={`/${article.relatedMoneyPageSlug}/`} className="btn btn--primary">
              Đăng ký lớp học ngay
            </Link>
          </div>
        ) : null}
      </article>
    </>
  );
}
