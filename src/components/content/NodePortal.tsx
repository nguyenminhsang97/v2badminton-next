import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { getContentNode } from "@/lib/sanity";
import { ContentBreadcrumbs } from "./ContentBreadcrumbs";
import { ContentStructuredData } from "./ContentStructuredData";

type NodePortalProps = {
  id: string;
  path: string;
};

export async function NodePortal({ id, path }: NodePortalProps) {
  const node = await getContentNode(id);

  if (!node) {
    notFound();
  }

  const trail = [
    { label: "Trang chủ", href: "/" },
    { label: node.parentHubTitle, href: node.parentHubFullPath },
    ...(node.parentNodeTitle && node.parentNodeFullPath
      ? [{ label: node.parentNodeTitle, href: node.parentNodeFullPath }]
      : []),
    { label: node.title },
  ];

  return (
    <>
      <ContentStructuredData path={path} breadcrumbTrail={trail} />

      <div className="content-node">
        <ContentBreadcrumbs trail={trail} />

        <h1 className="content-node__title">{node.title}</h1>

        {node.quickAnswer ? (
          <div className="quick-answer">
            <p className="quick-answer__label">Tóm tắt nhanh</p>
            <p className="quick-answer__body">{node.quickAnswer}</p>
          </div>
        ) : null}

        {node.intro.length > 0 ? (
          <div className="content-node__intro">
            <PortableText value={node.intro as PortableTextBlock[]} />
          </div>
        ) : null}

        {node.directArticles.length > 0 ? (
          <section className="content-node__articles">
            <h2>Bài viết</h2>
            <ul className="content-card-list">
              {node.directArticles.map((article) => (
                <li key={article.id} className="content-card">
                  {article.coverImageUrl ? (
                    <Link href={article.fullPath}>
                      <Image
                        src={article.coverImageUrl}
                        alt={article.coverImageAlt ?? article.title}
                        width={400}
                        height={225}
                      />
                    </Link>
                  ) : null}
                  <div className="content-card__body">
                    <Link href={article.fullPath} className="content-card__title">
                      {article.title}
                    </Link>
                    {article.excerpt ? (
                      <p className="content-card__excerpt">{article.excerpt}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {node.directNodes.length > 0 ? (
          <section className="content-node__subnodes">
            <h2>Chuyên mục con</h2>
            <ul className="content-node-list">
              {node.directNodes.map((childNode) => (
                <li key={childNode.id} className="content-node-item">
                  <Link href={childNode.fullPath} className="content-node-item__title">
                    {childNode.title}
                  </Link>
                  {childNode.quickAnswer ? (
                    <p className="content-node-item__desc">{childNode.quickAnswer}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
