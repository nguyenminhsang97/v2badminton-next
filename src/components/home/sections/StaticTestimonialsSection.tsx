import Image from "next/image";
import { StarIcon } from "@/components/ui/BrandIcons";
import { HOME_SECTION_IDS } from "@/lib/anchors";
import type { HomepageTestimonialsSectionProps } from "./sectionProps";

const DEFAULT_VISIBLE_COUNT = 3;

function getGroupLabel(
  group: HomepageTestimonialsSectionProps["testimonials"][number]["studentGroup"],
): string {
  switch (group) {
    case "tre_em":
      return "Phụ huynh & trẻ em";
    case "nguoi_moi":
      return "Người mới bắt đầu";
    case "nguoi_di_lam":
      return "Người đi làm";
    case "doanh_nghiep":
      return "Doanh nghiệp";
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function StaticTestimonialsSection({
  testimonials,
}: HomepageTestimonialsSectionProps) {
  const canExpand = testimonials.length > DEFAULT_VISIBLE_COUNT;
  const displayedTestimonials = testimonials.slice(0, DEFAULT_VISIBLE_COUNT);

  return (
    <section className="section testimonials-section" id={HOME_SECTION_IDS.testimonials}>
      <div className="section__header">
        <p className="section__eyebrow">Cảm nhận học viên</p>
        <h2 className="section__title">
          Học viên nói gì về{" "}
          <span className="testimonials-section__accent">V2 Badminton?</span>
        </h2>
        <p className="section__desc">
          Phản hồi ngắn từ phụ huynh, người mới và người đi làm sau vài tuần đầu.
        </p>
      </div>

      <div className="testimonials-grid">
        {displayedTestimonials.map((testimonial) => {
          const quote = testimonial.shortQuote ?? testimonial.content;
          const rating = Math.max(0, Math.min(testimonial.rating, 5));
          const context =
            testimonial.contextLabel || getGroupLabel(testimonial.studentGroup);

          return (
            <blockquote
              key={testimonial.id}
              className="testimonial-card"
              draggable={false}
            >
              {rating > 0 ? (
                <div
                  className="testimonial-card__stars"
                  role="img"
                  aria-label={`Đánh giá ${rating} sao`}
                >
                  {Array.from({ length: rating }).map((_, index) => (
                    <StarIcon
                      key={`${testimonial.id}-star-${index}`}
                      className="testimonial-card__star"
                    />
                  ))}
                </div>
              ) : null}

              <p className="testimonial-card__content">“{quote}”</p>

              <footer className="testimonial-card__footer">
                {testimonial.avatarUrl ? (
                  <span className="testimonial-card__avatar testimonial-card__avatar--image">
                    <Image
                      src={testimonial.avatarUrl}
                      alt={testimonial.avatarAlt ?? testimonial.studentName}
                      draggable={false}
                      fill
                      className="testimonial-card__avatar-image"
                      sizes="46px"
                    />
                  </span>
                ) : (
                  <span className="testimonial-card__avatar">
                    {getInitials(testimonial.studentName)}
                  </span>
                )}
                <span className="testimonial-card__person">
                  <strong className="testimonial-card__name">
                    {testimonial.studentName}
                  </strong>
                  {context ? (
                    <span className="testimonial-card__context">{context}</span>
                  ) : null}
                </span>
              </footer>
            </blockquote>
          );
        })}
      </div>

      {canExpand ? (
        <div className="testimonials-section__footer" aria-hidden="true">
          <span className="testimonials-section__toggle">
            Xem thêm {testimonials.length - DEFAULT_VISIBLE_COUNT} phản hồi
          </span>
        </div>
      ) : null}
    </section>
  );
}
