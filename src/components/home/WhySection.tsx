const DIFFERENTIATORS = [
  {
    title: "Lớp nhóm nhỏ 2-6 người",
    description:
      "HLV theo sát từng học viên, không bị lẫn vào lớp 15-20 người.",
  },
  {
    title: "HLV chuyên nghiệp, có kinh nghiệm thi đấu",
    description:
      "Không phải người chơi giỏi tự dạy. HLV V2 có chứng chỉ và kinh nghiệm giảng dạy thực tế.",
  },
  {
    title: "4 sân tại Bình Thạnh & Thủ Đức",
    description:
      "Bạn chọn sân gần nhà hoặc nơi làm việc, chúng tôi xếp lịch phù hợp.",
  },
  {
    title: "Lịch linh hoạt, có lớp buổi tối và cuối tuần",
    description:
      "Dành cho người đi làm giờ hành chính muốn tập sau giờ làm hoặc cuối tuần.",
  },
  {
    title: "Thiết kế riêng cho doanh nghiệp",
    description:
      "Team building, lớp nội bộ, lịch theo ngân sách và mục tiêu của công ty bạn.",
  },
] as const;

export function WhySection() {
  return (
    <section className="section" id="khac-biet">
      <div className="section__header">
        <h2 className="section__title">Khác biệt của V2</h2>
      </div>
      <div className="why-grid">
        {DIFFERENTIATORS.map((item) => (
          <article key={item.title} className="why-card">
            <h3 className="why-card__title">{item.title}</h3>
            <p className="why-card__desc">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
