import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type ContentBreadcrumbsProps = {
  trail: BreadcrumbItem[];
};

export function ContentBreadcrumbs({ trail }: ContentBreadcrumbsProps) {
  if (trail.length === 0) return null;

  return (
    <div className="breadcrumb-block">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol className="breadcrumb__list">
          {trail.map((item, index) => {
            const isCurrent = index === trail.length - 1;
            return (
              <li
                key={index}
                className={
                  isCurrent
                    ? "breadcrumb__item breadcrumb__item--current"
                    : "breadcrumb__item"
                }
                aria-current={isCurrent ? "page" : undefined}
              >
                {isCurrent || !item.href ? (
                  item.label
                ) : (
                  <Link href={item.href} className="breadcrumb__link">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
