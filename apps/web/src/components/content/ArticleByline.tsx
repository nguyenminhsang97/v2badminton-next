import Link from "next/link";
import type { SanityArticleAuthor, SanityArticleCoachByline } from "@/lib/sanity/types";

type ArticleBylineProps = {
  author: SanityArticleAuthor;
  publishedAt: string | null;
  updatedAt: string | null;
  reviewer: SanityArticleCoachByline | null;
  lastReviewed: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function authorLabel(author: SanityArticleAuthor): string {
  if (author.kind === "coach") {
    return author.coach.name;
  }
  return "Đội ngũ V2 Badminton";
}

function authorCredentials(author: SanityArticleAuthor): string[] {
  if (author.kind === "coach" && author.coach.credentialTags.length > 0) {
    return author.coach.credentialTags;
  }
  return [];
}

function isStaleUpdate(publishedAt: string | null, updatedAt: string | null): boolean {
  if (!publishedAt || !updatedAt) return false;
  const diffMs = new Date(updatedAt).getTime() - new Date(publishedAt).getTime();
  return diffMs > 24 * 60 * 60 * 1000;
}

export function ArticleByline({
  author,
  publishedAt,
  updatedAt,
  reviewer,
  lastReviewed,
}: ArticleBylineProps) {
  const credentials = authorCredentials(author);
  const showUpdated = isStaleUpdate(publishedAt, updatedAt);

  return (
    <div className="blog-post__byline">
      <div className="blog-post__byline-author">
        <span className="blog-post__byline-label">Tác giả:</span>{" "}
        <span className="blog-post__byline-name">{authorLabel(author)}</span>
        {credentials.length > 0 && (
          <span className="blog-post__byline-credentials">
            {" · "}
            {credentials.join(" · ")}
          </span>
        )}
      </div>

      <div className="blog-post__byline-dates">
        {publishedAt && (
          <time className="blog-post__byline-date" dateTime={publishedAt}>
            Đăng: {formatDate(publishedAt)}
          </time>
        )}
        {showUpdated && updatedAt && (
          <time className="blog-post__byline-date" dateTime={updatedAt}>
            {" · "}Cập nhật: {formatDate(updatedAt)}
          </time>
        )}
      </div>

      {reviewer && lastReviewed && (
        <div className="blog-post__byline-reviewer">
          <span className="blog-post__byline-label">Review chuyên môn:</span>{" "}
          <span className="blog-post__byline-name">{reviewer.name}</span>
          {reviewer.credentialTags.length > 0 && (
            <span className="blog-post__byline-credentials">
              {" · "}
              {reviewer.credentialTags.join(" · ")}
            </span>
          )}
          {" · "}
          <time className="blog-post__byline-date" dateTime={lastReviewed}>
            Review lần cuối: {formatDate(lastReviewed)}
          </time>
        </div>
      )}

      <div className="blog-post__byline-policy">
        <Link href="/chinh-sach-bien-tap/" className="blog-post__byline-policy-link">
          Chính sách biên tập
        </Link>
      </div>
    </div>
  );
}
