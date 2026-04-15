import Image from "next/image";

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
] as const;

export function WhySection() {
  return (
    <section className="section why-section" id="gioi-thieu">
      <div className="why-section__layout">
        <div className="why-section__copy">
          <div className="section__header section__header--left">
            <p className="section__eyebrow">Tại sao chọn V2</p>
            <h2 className="section__title">KHÁC BIỆT CỦA V2 BADMINTON</h2>
            <p className="section__desc">
              Không chỉ dạy đánh cầu — V2 xây dựng nền tảng kỹ thuật đúng từ đầu,
              giúp bạn tiến bộ nhanh và tránh chấn thương.
            </p>
          </div>

          <div className="why-grid">
            {DIFFERENTIATORS.map((item, index) => (
              <article key={item.title} className="why-card">
                <span className="why-card__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="why-card__title">{item.title}</h3>
                <p className="why-card__desc">{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="why-section__visual">
          <article className="why-section__stat">
            <span className="why-section__stat-value">98%</span>
            <strong className="why-section__stat-title">
              học viên quay lại sau buổi đầu
            </strong>
            <p className="why-section__stat-copy">
              V2 tập trung vào cảm giác học dễ theo, sửa lỗi rõ và đủ gần để phụ
              huynh hoặc người mới thấy yên tâm ngay từ buổi đầu tiên.
            </p>
          </article>

          <div className="why-section__images">
            <div className="why-section__image-frame why-section__image-frame--large">
              <Image
                src="/images/course-basic.webp"
                alt="Học viên mới bắt đầu đang được hướng dẫn kỹ thuật cơ bản"
                width={720}
                height={540}
                sizes="(max-width: 959px) 100vw, 26vw"
              />
            </div>
            <div className="why-section__image-frame why-section__image-frame--small">
              <Image
                src="/images/course-advanced.webp"
                alt="Nhóm học viên tiếp tục nâng trình trong lớp cầu lông"
                width={720}
                height={540}
                sizes="(max-width: 959px) 100vw, 22vw"
              />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
