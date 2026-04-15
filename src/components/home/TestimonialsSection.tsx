import type { HomepageTestimonialsSectionProps } from "./sectionProps";

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

export function TestimonialsSection({
  testimonials,
}: HomepageTestimonialsSectionProps) {
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="section" id="hoc-vien-noi-gi">
      <div className="section__header">
        <p className="section__eyebrow">Phản hồi học viên</p>
        <h2 className="section__title">HỌC VIÊN NÓI GÌ</h2>
        <p className="section__desc">
          Những chia sẻ ngắn từ học viên và phụ huynh sau quá trình tập luyện
          cùng V2 Badminton.
        </p>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <blockquote key={testimonial.id} className="testimonial-card">
            <div className="testimonial-card__stars" aria-hidden="true">
              ★★★★★
            </div>
            <span className="testimonial-card__kicker">
              {getGroupLabel(testimonial.studentGroup)}
            </span>
            <p className="testimonial-card__content">{testimonial.content}</p>
            <footer className="testimonial-card__footer">
              <span className="testimonial-card__avatar">
                {getInitials(testimonial.studentName)}
              </span>
              <span className="testimonial-card__person">
                <strong className="testimonial-card__name">
                  {testimonial.studentName}
                </strong>
                {testimonial.contextLabel ? (
                  <span className="testimonial-card__context">
                    {testimonial.contextLabel}
                  </span>
                ) : null}
              </span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
