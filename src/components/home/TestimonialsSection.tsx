import type { HomepageTestimonialsSectionProps } from "./sectionProps";

const FALLBACK_TESTIMONIALS = [
  {
    id: "fallback-parent",
    studentGroup: "tre_em" as const,
    content:
      "Con đi học khá hào hứng vì được HLV chỉ rất sát và buổi nào cũng có mục tiêu rõ. Phụ huynh nhìn vào cũng thấy yên tâm hơn hẳn.",
    studentName: "Chị Linh",
    contextLabel: "Phụ huynh học viên thiếu nhi",
    order: 90,
  },
  {
    id: "fallback-beginner",
    studentGroup: "nguoi_moi" as const,
    content:
      "Mình bắt đầu từ con số 0 nhưng vẫn theo kịp vì lớp nhỏ, sửa lỗi nhanh và lịch học dễ bám theo. Sau vài tuần đã thấy tự tin vào sân hơn.",
    studentName: "Anh Huy",
    contextLabel: "Học viên người mới",
    order: 91,
  },
  {
    id: "fallback-working",
    studentGroup: "nguoi_di_lam" as const,
    content:
      "Mình cần lớp buổi tối gần công ty và V2 xếp đúng lịch mong muốn. Không khí học rất vừa phải, không áp lực mà vẫn lên trình đều.",
    studentName: "Chị Trâm",
    contextLabel: "Học viên lớp tối",
    order: 92,
  },
] satisfies HomepageTestimonialsSectionProps["testimonials"];

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
  const visibleTestimonials =
    testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;

  return (
    <section className="section testimonials-section" id="hoc-vien-noi-gi">
      <div className="section__header">
        <p className="section__eyebrow">Cảm nhận sau khi bắt đầu</p>
        <h2 className="section__title">
          Điều học viên và phụ huynh thấy <span className="testimonials-section__accent">dễ theo nhất</span>
        </h2>
        <p className="section__desc">
          Đây là những phản hồi về cảm giác học thực tế: có dễ bám lịch không, có theo kịp buổi
          đầu không và có thấy tự tin hơn sau vài tuần đầu hay chưa.
        </p>
      </div>
      <div className="testimonials-grid">
        {visibleTestimonials.map((testimonial) => (
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
