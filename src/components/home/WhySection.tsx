const DIFFERENTIATORS = [
  {
    title: "GIÁO TRÌNH BÀI BẢN",
    description:
      "Lộ trình rõ ràng theo từng cấp độ. Từ cầm vợt, di chuyển chân đến kỹ thuật đập cầu, cắt cầu — mỗi buổi đều có mục tiêu cụ thể.",
  },
  {
    title: "KÈM RIÊNG & NHÓM NHỎ",
    description:
      "Lớp 1 kèm 1 hoặc nhóm nhỏ (2–6 người) để HLV theo sát từng học viên. Không đông đúc, không bỏ sót.",
  },
  {
    title: "4 SÂN TIỆN LỢI",
    description:
      "Phủ sóng Bình Thạnh & Thủ Đức. Bạn chọn sân gần nhà hoặc gần công ty — linh hoạt thời gian tối đa.",
  },
  {
    title: "LINH HOẠT LỊCH HỌC",
    description:
      "Sáng, chiều, tối — kể cả cuối tuần. Phù hợp cho nhân viên văn phòng, sinh viên và người đi làm bận rộn.",
  },
  {
    title: "CHƯƠNG TRÌNH DOANH NGHIỆP",
    description:
      "Team building bằng cầu lông, tổ chức giải đấu nội bộ — gắn kết đội ngũ theo cách năng động, khỏe mạnh.",
  },
  {
    title: "KHÔNG CẦN KINH NGHIỆM",
    description:
      "Chưa bao giờ chơi cầu lông? Hoàn toàn OK. Khóa cơ bản thiết kế cho người bắt đầu từ zero.",
  },
] as const;

export function WhySection() {
  return (
    <section className="section" id="gioi-thieu">
      <div className="section__header">
        <p className="section__eyebrow">Tại sao chọn V2</p>
        <h2 className="section__title">KHÁC BIỆT CỦA V2 BADMINTON</h2>
        <p className="section__desc">
          Không chỉ dạy đánh cầu — V2 xây dựng nền tảng kỹ thuật đúng từ đầu, giúp bạn tiến bộ nhanh và tránh chấn thương.
        </p>
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
