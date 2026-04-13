import type { HomepageTestimonialsSectionProps } from "./sectionProps";

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
            <p className="testimonial-card__content">{testimonial.content}</p>
            <footer className="testimonial-card__footer">
              <strong className="testimonial-card__name">
                {testimonial.studentName}
              </strong>
              {testimonial.contextLabel ? (
                <span className="testimonial-card__context">
                  {testimonial.contextLabel}
                </span>
              ) : null}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
