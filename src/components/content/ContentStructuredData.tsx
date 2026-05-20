import { JsonLd } from "@/components/ui/JsonLd";
import { canonicalUrl } from "@/lib/routes";
import type { SanityContentArticle, SanityFaq } from "@/lib/sanity";
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
} from "@/lib/schema";

type BreadcrumbTrailItem = { label: string; href?: string };

type ContentStructuredDataProps = {
  path: string;
  breadcrumbTrail: BreadcrumbTrailItem[];
  article?: SanityContentArticle;
  faqs?: SanityFaq[];
};

export function ContentStructuredData({
  path,
  breadcrumbTrail,
  article,
  faqs = [],
}: ContentStructuredDataProps) {
  const breadcrumbItems = breadcrumbTrail.map((item) => ({
    name: item.label,
    ...(item.href ? { item: canonicalUrl(item.href) } : {}),
  }));

  const hasSchemaFaqs = faqs.some((faq) => faq.includeInSchema);

  return (
    <>
      <JsonLd
        id={`content-breadcrumb-${path.replace(/\//g, "-")}`}
        data={buildBreadcrumbSchema(breadcrumbItems)}
      />
      {article ? (
        <JsonLd
          id={`content-article-${article.id}`}
          data={{
            // Phase 1: always emit Article. HowTo requires a step[] array which
            // our portable-text body does not produce; emitting HowTo without
            // steps is invalid. Articles tagged `how_to` are still rendered as
            // Article JSON-LD — the contentFormat affects on-page UX, not the
            // schema type. Revisit when body gains structured step blocks.
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.seoDescription,
            datePublished: article.publishedAt ?? undefined,
            dateModified: article.updatedAt ?? undefined,
            ...(article.coverImageUrl
              ? { image: article.coverImageUrl }
              : {}),
            url: canonicalUrl(path),
          }}
        />
      ) : null}
      {hasSchemaFaqs ? (
        <JsonLd
          id={`content-faq-${path.replace(/\//g, "-")}`}
          data={buildFaqPageSchema(faqs)}
        />
      ) : null}
    </>
  );
}
