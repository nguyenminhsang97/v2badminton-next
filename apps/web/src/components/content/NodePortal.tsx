import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { loadSiteChromeSettings } from "@/components/layout/siteSettings";
import { getContentNode, getCourtsInArea } from "@/lib/sanity";
import { sanityImageLoader } from "@/lib/sanity/image";
import type { SanityCourtCard } from "@/lib/sanity";
import { ContentBreadcrumbs } from "./ContentBreadcrumbs";
import { ContentStructuredData } from "./ContentStructuredData";

type NodePortalProps = {
  id: string;
  path: string;
};

export async function NodePortal({ id, path }: NodePortalProps) {
  const [node, siteSettings] = await Promise.all([
    getContentNode(id),
    loadSiteChromeSettings(),
  ]);

  if (!node) {
    notFound();
  }

  const isCourtArea = node.parentHubSlug === "san-cau-long";
  const courts: SanityCourtCard[] = isCourtArea
    ? await getCourtsInArea(node.id)
    : [];

  const { cmsUiStrings } = siteSettings;

  const trail = [
    { label: "Trang chủ", href: "/" },
    { label: node.parentHubTitle, href: node.parentHubFullPath },
    ...(node.parentNodeTitle && node.parentNodeFullPath
      ? [{ label: node.parentNodeTitle, href: node.parentNodeFullPath }]
      : []),
    { label: node.title },
  ];

  const articleCount = node.directArticles.length;
  const subNodeCount = node.directNodes.length;
  const description = node.seoDescription ?? node.quickAnswer ?? undefined;

  return (
    <>
      <ContentStructuredData path={path} breadcrumbTrail={trail} />

      <div className="blog-list">
        <ContentBreadcrumbs trail={trail} />

        <section className="blog-list__hero">
          <div className="section__header">
            <p className="section__eyebrow">{node.parentHubTitle}</p>
            <h1 className="section__title">{node.title}</h1>
            {description ? (
              <p className="section__desc">{description}</p>
            ) : null}
          </div>
          <div className="blog-list__hero-meta">
            {isCourtArea ? (
              courts.length > 0 ? (
                <span className="blog-list__hero-chip">
                  {courts.length} sân
                </span>
              ) : null
            ) : (
              articleCount > 0 ? (
                <span className="blog-list__hero-chip">
                  {articleCount} bài viết
                </span>
              ) : null
            )}
            {subNodeCount > 0 ? (
              <span className="blog-list__hero-chip">
                {subNodeCount} chuyên mục con
              </span>
            ) : null}
          </div>
        </section>

        {node.quickAnswer || node.intro.length > 0 ? (
          <section className="blog-post__content-shell">
            {node.quickAnswer ? (
              <div className="quick-answer">
                <p className="quick-answer__label">{cmsUiStrings.quickAnswerLabel}</p>
                <p className="quick-answer__body">{node.quickAnswer}</p>
              </div>
            ) : null}
            {node.intro.length > 0 ? (
              <div className="blog-post__body">
                <PortableText value={node.intro as PortableTextBlock[]} />
              </div>
            ) : null}
          </section>
        ) : null}

        {isCourtArea ? (
          courts.length > 0 ? (
            <section className="blog-list__grid" aria-label="Danh sách sân">
              {courts.map((court) => (
                <article key={court.id} className="blog-card">
                  <Link href={court.fullPath} className="blog-card__media">
                    {court.coverImageUrl ? (
                      <Image
                        src={court.coverImageUrl}
                        alt={court.coverImageAlt ?? court.name}
                        className="blog-card__cover"
                        width={720}
                        height={405}
                        sizes="(max-width: 960px) calc(100vw - 32px), 360px"
                        loader={sanityImageLoader}
                      />
                    ) : (
                      <div
                        className="blog-card__cover blog-card__cover--placeholder"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                  <div className="blog-card__body">
                    <span className="blog-card__category">{node.title}</span>
                    <Link
                      href={court.fullPath}
                      className="blog-card__title-link"
                    >
                      <h2 className="blog-card__title">{court.shortName}</h2>
                    </Link>
                    {court.quickAnswer ? (
                      <p className="blog-card__excerpt">{court.quickAnswer}</p>
                    ) : null}
                    <Link href={court.fullPath} className="blog-card__cta">
                      Xem chi tiết sân
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <section className="blog-post__content-shell">
              <p className="section__desc">
                Đang cập nhật danh sách sân tại khu vực này.
              </p>
            </section>
          )
        ) : null}

        {!isCourtArea && articleCount > 0 ? (
          <section className="blog-list__grid" aria-label="Danh sách bài viết">
            {node.directArticles.map((article) => (
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
                      loader={sanityImageLoader}
                    />
                  ) : (
                    <div
                      className="blog-card__cover blog-card__cover--placeholder"
                      aria-hidden="true"
                    />
                  )}
                </Link>
                <div className="blog-card__body">
                  <span className="blog-card__category">{node.title}</span>
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

        {!isCourtArea && subNodeCount > 0 ? (
          <section className="blog-list__grid" aria-label="Chuyên mục con">
            {node.directNodes.map((childNode) => (
              <article key={childNode.id} className="blog-card">
                <div className="blog-card__body">
                  <span className="blog-card__category">Chuyên mục</span>
                  <Link
                    href={childNode.fullPath}
                    className="blog-card__title-link"
                  >
                    <h2 className="blog-card__title">{childNode.title}</h2>
                  </Link>
                  {childNode.quickAnswer ? (
                    <p className="blog-card__excerpt">{childNode.quickAnswer}</p>
                  ) : null}
                  <Link href={childNode.fullPath} className="blog-card__cta">
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
