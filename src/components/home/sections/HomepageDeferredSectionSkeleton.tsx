type HomepageDeferredSectionVariant =
  | "testimonials"
  | "schedule"
  | "contact";

type HomepageDeferredSectionSkeletonProps = {
  variant: HomepageDeferredSectionVariant;
};

function SkeletonHeader() {
  return (
    <div className="section__header">
      <span className="skeleton skeleton--eyebrow deferred-section-skeleton__eyebrow" />
      <span className="skeleton skeleton--heading deferred-section-skeleton__heading" />
      <span className="skeleton skeleton--text deferred-section-skeleton__text" />
      <span className="skeleton skeleton--text skeleton--text-short deferred-section-skeleton__text deferred-section-skeleton__text--short" />
    </div>
  );
}

function TestimonialsSkeleton() {
  return (
    <>
      <SkeletonHeader />
      <div className="deferred-section-skeleton__cards">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`testimonial-skeleton-${index}`}
            className="deferred-section-skeleton__card"
          >
            <span className="skeleton deferred-section-skeleton__line deferred-section-skeleton__line--stars" />
            <span className="skeleton deferred-section-skeleton__line deferred-section-skeleton__line--quote" />
            <span className="skeleton deferred-section-skeleton__line deferred-section-skeleton__line--quote-short" />
            <div className="deferred-section-skeleton__person">
              <span className="skeleton deferred-section-skeleton__avatar" />
              <div className="deferred-section-skeleton__person-copy">
                <span className="skeleton deferred-section-skeleton__line deferred-section-skeleton__line--name" />
                <span className="skeleton deferred-section-skeleton__line deferred-section-skeleton__line--meta" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="deferred-section-skeleton__footer">
        <span className="skeleton deferred-section-skeleton__pill deferred-section-skeleton__pill--cta" />
      </div>
    </>
  );
}

function ScheduleSkeleton() {
  return (
    <>
      <SkeletonHeader />
      <div className="deferred-section-skeleton__pill-row">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={`schedule-pill-${index}`}
            className="skeleton deferred-section-skeleton__pill"
          />
        ))}
      </div>
      <div className="deferred-section-skeleton__table">
        <div className="deferred-section-skeleton__table-head">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={`schedule-head-${index}`}
              className="skeleton deferred-section-skeleton__line deferred-section-skeleton__line--table-head"
            />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div
            key={`schedule-row-${rowIndex}`}
            className="deferred-section-skeleton__table-row"
          >
            <span className="skeleton deferred-section-skeleton__line deferred-section-skeleton__line--cell-long" />
            <span className="skeleton deferred-section-skeleton__pill deferred-section-skeleton__pill--time" />
            <span className="skeleton deferred-section-skeleton__line deferred-section-skeleton__line--cell-mid" />
            <span className="skeleton deferred-section-skeleton__line deferred-section-skeleton__line--cell-mid" />
            <div className="deferred-section-skeleton__level-row">
              <span className="skeleton deferred-section-skeleton__pill deferred-section-skeleton__pill--level" />
              <span className="skeleton deferred-section-skeleton__pill deferred-section-skeleton__pill--level" />
            </div>
          </div>
        ))}
      </div>
      <div className="deferred-section-skeleton__footer">
        <span className="skeleton skeleton--text skeleton--text-short deferred-section-skeleton__note" />
      </div>
    </>
  );
}

function ContactSkeleton() {
  return (
    <>
      <SkeletonHeader />
      <div className="contact-form-shell deferred-section-skeleton__contact-shell">
        <div className="contact-form-shell__header">
          <span className="skeleton skeleton--eyebrow deferred-section-skeleton__eyebrow" />
          <span className="skeleton deferred-section-skeleton__line deferred-section-skeleton__line--contact-title" />
        </div>
        <div className="contact-form__grid">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={`contact-primary-${index}`}
              className="deferred-section-skeleton__field"
            >
              <span className="skeleton deferred-section-skeleton__line deferred-section-skeleton__line--label" />
              <span className="skeleton deferred-section-skeleton__input" />
            </div>
          ))}
        </div>
        <div className="deferred-section-skeleton__optional">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={`contact-optional-${index}`}
              className="deferred-section-skeleton__field"
            >
              <span className="skeleton deferred-section-skeleton__line deferred-section-skeleton__line--label" />
              <span className="skeleton deferred-section-skeleton__input" />
            </div>
          ))}
        </div>
        <div className="deferred-section-skeleton__field">
          <span className="skeleton deferred-section-skeleton__line deferred-section-skeleton__line--label" />
          <span className="skeleton deferred-section-skeleton__textarea" />
        </div>
        <div className="deferred-section-skeleton__actions">
          <span className="skeleton deferred-section-skeleton__button" />
          <span className="skeleton deferred-section-skeleton__line deferred-section-skeleton__line--hint" />
        </div>
      </div>
    </>
  );
}

export function HomepageDeferredSectionSkeleton({
  variant,
}: HomepageDeferredSectionSkeletonProps) {
  const sectionClassName = `section deferred-section-skeleton deferred-section-skeleton--${variant}`;

  if (variant === "testimonials") {
    return (
      <section
        className={`${sectionClassName} testimonials-section`}
        aria-hidden="true"
      >
        <TestimonialsSkeleton />
      </section>
    );
  }

  if (variant === "schedule") {
    return (
      <section
        className={`${sectionClassName} schedule-section`}
        aria-hidden="true"
      >
        <ScheduleSkeleton />
      </section>
    );
  }

  return (
    <section
      className={`${sectionClassName} contact-section`}
      aria-hidden="true"
    >
      <ContactSkeleton />
    </section>
  );
}
