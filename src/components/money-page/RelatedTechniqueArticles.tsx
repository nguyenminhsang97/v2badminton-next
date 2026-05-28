import Image from "next/image";
import Link from "next/link";
import type { SanityContentArticleCard } from "@/lib/sanity";

type RelatedTechniqueArticlesProps = {
  articles: SanityContentArticleCard[];
  eyebrow?: string;
  title?: string;
  category?: string;
  readCta?: string;
};

/**
 * RelatedTechniqueArticles — renders a "Tài liệu kỹ thuật" section on a
 * money page listing CMS articles that link to it via `relatedMoneyPage`.
 *
 * Returns null when there are no articles (money pages without linked content
 * show nothing — no empty state needed).
 *
 * Reuses blog-list__grid + blog-card classes (no new CSS).
 */
export function RelatedTechniqueArticles({
  articles,
  eyebrow = "Tài liệu kỹ thuật",
  title = "Bài viết kỹ thuật liên quan",
  category = "Kỹ thuật cầu lông",
  readCta = "Đọc bài viết →",
}: RelatedTechniqueArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="money-page__section">
      <div className="money-page__section-header">
        <p className="section__eyebrow">{eyebrow}</p>
        <h2 className="section__title">{title}</h2>
      </div>
      <div className="blog-list__grid" aria-label="Bài viết kỹ thuật">
        {articles.map((article) => (
          <article key={article.id} className="blog-card">
            <Link href={article.fullPath} className="blog-card__media">
              {article.coverImageUrl ? (
                <Image
                  src={article.coverImageUrl}
                  alt={article.coverImageAlt ?? article.title}
                  className="blog-card__cover"
                  width={720}
                  height={405}
                  sizes="(max-width: 960px) calc(100vw - 32px), 360px"
                />
              ) : (
                <div
                  className="blog-card__cover blog-card__cover--placeholder"
                  aria-hidden="true"
                />
              )}
            </Link>
            <div className="blog-card__body">
              <span className="blog-card__category">{category}</span>
              <Link href={article.fullPath} className="blog-card__title-link">
                <h2 className="blog-card__title">{article.title}</h2>
              </Link>
              {article.excerpt ? (
                <p className="blog-card__excerpt">{article.excerpt}</p>
              ) : null}
              <Link href={article.fullPath} className="blog-card__cta">
                {readCta}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
