import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { loadSiteChromeSettings } from "@/components/layout/siteSettings";
import { getContentHub } from "@/lib/sanity";
import { ContentBreadcrumbs } from "./ContentBreadcrumbs";
import { ContentStructuredData } from "./ContentStructuredData";

type HubPortalProps = {
  id: string;
  path: string;
};

export async function HubPortal({ id, path }: HubPortalProps) {
  const [hub, siteSettings] = await Promise.all([
    getContentHub(id),
    loadSiteChromeSettings(),
  ]);

  if (!hub) {
    notFound();
  }

  const { cmsUiStrings } = siteSettings;

  const trail = [
    { label: "Trang chủ", href: "/" },
    { label: hub.title },
  ];

  const articleCount = hub.directArticles.length;
  const subNodeCount = hub.directNodes.length;
  const description =
    hub.seoDescription ?? hub.quickAnswer ?? undefined;

  return (
    <>
      <ContentStructuredData path={path} breadcrumbTrail={trail} />

      <div className="blog-list">
        <ContentBreadcrumbs trail={trail} />

        <section className="blog-list__hero">
          <div className="section__header">
            <p className="section__eyebrow">{cmsUiStrings.hubEyebrow}</p>
            <h1 className="section__title">{hub.title}</h1>
            {description ? (
              <p className="section__desc">{description}</p>
            ) : null}
          </div>
          <div className="blog-list__hero-meta">
            {articleCount > 0 ? (
              <span className="blog-list__hero-chip">
                {articleCount} bài viết
              </span>
            ) : null}
            {subNodeCount > 0 ? (
              <span className="blog-list__hero-chip">
                {subNodeCount} chuyên mục con
              </span>
            ) : null}
          </div>
        </section>

        {hub.quickAnswer || hub.intro.length > 0 ? (
          <section className="blog-post__content-shell">
            {hub.quickAnswer ? (
              <div className="quick-answer">
                <p className="quick-answer__label">{cmsUiStrings.quickAnswerLabel}</p>
                <p className="quick-answer__body">{hub.quickAnswer}</p>
              </div>
            ) : null}
            {hub.intro.length > 0 ? (
              <div className="blog-post__body">
                <PortableText value={hub.intro as PortableTextBlock[]} />
              </div>
            ) : null}
          </section>
        ) : null}

        {articleCount > 0 ? (
          <section className="blog-list__grid" aria-label="Danh sách bài viết">
            {hub.directArticles.map((article) => (
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
                  <span className="blog-card__category">{hub.title}</span>
                  <Link
                    href={article.fullPath}
                    className="blog-card__title-link"
                  >
                    <h2 className="blog-card__title">{article.title}</h2>
                  </Link>
                  {article.excerpt ? (
                    <p className="blog-card__excerpt">{article.excerpt}</p>
                  ) : null}
                  <Link href={article.fullPath} className="blog-card__cta">
                    {cmsUiStrings.readArticleCta}
                  </Link>
                </div>
              </article>
            ))}
          </section>
        ) : null}

        {subNodeCount > 0 ? (
          <section className="blog-list__grid" aria-label="Chuyên mục con">
            {hub.directNodes.map((node) => (
              <article key={node.id} className="blog-card">
                <div className="blog-card__body">
                  <span className="blog-card__category">Chuyên mục</span>
                  <Link href={node.fullPath} className="blog-card__title-link">
                    <h2 className="blog-card__title">{node.title}</h2>
                  </Link>
                  {node.quickAnswer ? (
                    <p className="blog-card__excerpt">{node.quickAnswer}</p>
                  ) : null}
                  <Link href={node.fullPath} className="blog-card__cta">
                    {cmsUiStrings.exploreNodeCta}
                  </Link>
                </div>
              </article>
            ))}
          </section>
        ) : null}
      </div>
    </>
  );
}
