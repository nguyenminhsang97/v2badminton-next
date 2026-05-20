import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { getContentHub } from "@/lib/sanity";
import { ContentBreadcrumbs } from "./ContentBreadcrumbs";
import { ContentStructuredData } from "./ContentStructuredData";

type HubPortalProps = {
  id: string;
  path: string;
};

export async function HubPortal({ id, path }: HubPortalProps) {
  const hub = await getContentHub(id);

  if (!hub) {
    notFound();
  }

  const trail = [
    { label: "Trang chủ", href: "/" },
    { label: hub.title },
  ];

  return (
    <>
      <ContentStructuredData path={path} breadcrumbTrail={trail} />

      <div className="content-hub">
        <ContentBreadcrumbs trail={trail} />

        <h1 className="content-hub__title">{hub.title}</h1>

        {hub.quickAnswer ? (
          <div className="quick-answer">
            <p className="quick-answer__label">Tóm tắt nhanh</p>
            <p className="quick-answer__body">{hub.quickAnswer}</p>
          </div>
        ) : null}

        {hub.intro.length > 0 ? (
          <div className="content-hub__intro">
            <PortableText value={hub.intro as PortableTextBlock[]} />
          </div>
        ) : null}

        {hub.directArticles.length > 0 ? (
          <section className="content-hub__articles">
            <h2>Bài viết</h2>
            <ul className="content-card-list">
              {hub.directArticles.map((article) => (
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

        {hub.directNodes.length > 0 ? (
          <section className="content-hub__subnodes">
            <h2>Chuyên mục con</h2>
            <ul className="content-node-list">
              {hub.directNodes.map((node) => (
                <li key={node.id} className="content-node-item">
                  <Link href={node.fullPath} className="content-node-item__title">
                    {node.title}
                  </Link>
                  {node.quickAnswer ? (
                    <p className="content-node-item__desc">{node.quickAnswer}</p>
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
