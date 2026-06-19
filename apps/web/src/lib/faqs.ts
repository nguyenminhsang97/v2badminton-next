/**
 * SPRINT 2 STATUS: Fallback-only.
 * Imported exclusively by src/lib/sanity/queries.ts for getFallbackFaqs().
 * Not imported directly by any page or component.
 * Do not delete - fallback is required while Sanity dataset may be empty or unreachable.
 * Scheduled for removal in Sprint 5 after production Sanity data is validated.
 */
export type FaqPageId = "homepage" | "nguoi_moi" | "binh_thanh" | "thu_duc";

export type FaqItem = {
  id: string;
  page: FaqPageId;
  order: number;
  question: string;
  answerText: string;
  answerHtml?: string;
  schemaEligible: boolean;
};

export const faqs: readonly FaqItem[] = [
  {
    id: "home-zero",
    page: "homepage",
    order: 1,
    question: "Người mới hoàn toàn có học được không?",
    answerText:
      "Hoàn toàn được. Khóa cơ bản của V2 thiết kế cho người bắt đầu từ con số 0. HLV sẽ hướng dẫn từ cách cầm vợt, tư thế đứng, di chuyển chân đến phát cầu và đánh cơ bản để bạn tiến bộ rõ rệt sau vài buổi đầu.",
    schemaEligible: true,
  },
  {
    id: "home-locations",
    page: "homepage",
    order: 2,
    question: "V2 Badminton dạy ở đâu?",
    answerText:
      "V2 có 4 sân ở TP.HCM: Sân Green (Bình Thạnh); Sân Huệ Thiên, Sân Khang Sport (Bình Triệu) và Sân Phúc Lộc (cùng ở phường Hiệp Bình, Thủ Đức cũ). Bạn có thể chọn sân gần nhà hoặc gần nơi làm việc, địa chỉ chi tiết ở phần Sân tập phía trên.",
    schemaEligible: true,
  },
  {
    id: "home-pricing",
    page: "homepage",
    order: 3,
    question: "Học phí và lịch học như thế nào?",
    answerText:
      "Học phí gồm: lớp nhóm 2 buổi/tuần 1.000.000 đ/tháng; lớp nhóm 3 buổi/tuần 1.300.000 đ/tháng (cơ bản) hoặc 1.500.000 đ/tháng (nâng cao); 1 kèm 1 là 400.000 đ/giờ/học viên (chưa gồm phí thuê sân — V2 sẽ hỗ trợ đặt sân thuận tiện); chương trình doanh nghiệp tư vấn theo quy mô. Lịch học mở các khung sáng, chiều, tối và cuối tuần — chi tiết ở phần Lịch học.",
    schemaEligible: true,
  },
  {
    id: "home-prep",
    page: "homepage",
    order: 4,
    question: "Tôi cần chuẩn bị gì khi đến học?",
    answerText:
      "Bạn chỉ cần mang giày thể thao đế không trơn, quần áo thoải mái và nước uống. Nếu chưa có vợt, bạn vẫn có thể đăng ký để được V2 tư vấn trước khi bắt đầu.",
    schemaEligible: true,
  },
  {
    id: "home-business",
    page: "homepage",
    order: 5,
    question: "Công ty tôi muốn tổ chức team building, liên hệ thế nào?",
    answerText:
      "Bạn có thể gọi điện, nhắn Zalo hoặc inbox Facebook cho V2 Badminton. Chỉ cần gửi số lượng người, thời gian mong muốn và ngân sách dự kiến, đội ngũ sẽ tư vấn chương trình phù hợp. Bạn cũng có thể xem trang Cầu lông doanh nghiệp để biết các gói team building và lớp nội bộ V2 đã triển khai.",
    schemaEligible: true,
  },
  {
    id: "nguoi-moi-zero",
    page: "nguoi_moi",
    order: 1,
    question: "Chưa biết gì có học được không?",
    answerText:
      "Có. Khóa cơ bản của V2 Badminton được thiết kế cho người bắt đầu từ con số 0, nên bạn không cần biết chơi trước khi đăng ký.",
    schemaEligible: true,
  },
  {
    id: "nguoi-moi-first-session",
    page: "nguoi_moi",
    order: 2,
    question: "Buổi đầu học những gì?",
    answerText:
      "Buổi đầu thường học cách cầm vợt, tư thế đứng, di chuyển chân cơ bản và phát cầu nền tảng để làm quen đúng kỹ thuật.",
    schemaEligible: true,
  },
  {
    id: "nguoi-moi-gear",
    page: "nguoi_moi",
    order: 3,
    question: "Cần mang theo gì khi đến học?",
    answerText:
      "Bạn nên mang giày thể thao đế không trơn, quần áo thoải mái và nước uống. Nếu chưa có vợt, bạn vẫn có thể đăng ký để được V2 tư vấn trước.",
    schemaEligible: true,
  },
  {
    id: "nguoi-moi-progress",
    page: "nguoi_moi",
    order: 4,
    question: "Học bao lâu thì chơi được?",
    answerText:
      "Thông thường sau khoảng 8 đến 12 buổi (≈ 4–6 tuần với lịch 2 buổi/tuần), học viên mới đã có thể tự đánh rally cơ bản và di chuyển đúng hơn trên sân.",
    schemaEligible: true,
  },
  {
    id: "nguoi-moi-group-size",
    page: "nguoi_moi",
    order: 5,
    question: "Lớp học mấy người?",
    answerText:
      "V2 có lớp nhóm nhỏ từ 2 đến 6 người và cả hình thức 1 kèm 1 nếu bạn muốn được theo sát hơn.",
    schemaEligible: true,
  },
  {
    id: "nguoi-moi-pricing",
    page: "nguoi_moi",
    order: 6,
    question: "Học phí cho người mới bắt đầu là bao nhiêu?",
    answerText:
      "Người mới có thể bắt đầu với lớp cơ bản 3 buổi/tuần giá 1.300.000 đ/tháng hoặc lớp 2 buổi/tuần giá 1.000.000 đ/tháng. Nếu muốn học riêng, hình thức 1 kèm 1 là 400.000 đ/giờ/học viên (chưa gồm phí thuê sân — V2 sẽ hỗ trợ đặt sân thuận tiện).",
    schemaEligible: true,
  },
  {
    id: "binh-thanh-where",
    page: "binh_thanh",
    order: 1,
    question: "V2 dạy ở sân nào tại Bình Thạnh?",
    answerText:
      "V2 Badminton hiện nhận học viên khu vực Bình Thạnh tại Sân Green. Đây là điểm tập của V2 ở khu vực Bình Thạnh, phù hợp với người học muốn đi lại thuận tiện trong quận.",
    schemaEligible: true,
  },
  {
    id: "binh-thanh-schedule",
    page: "binh_thanh",
    order: 2,
    question: "Lịch học tại Bình Thạnh thế nào?",
    answerText:
      "Sân Green mở các khung sáng cuối tuần, chiều giữa tuần và buổi tối T3–T5, phù hợp cả người mới bắt đầu và người đi làm. Lịch chi tiết và slot còn trống có ở phần Lịch học trên trang.",
    schemaEligible: true,
  },
  {
    id: "binh-thanh-night",
    page: "binh_thanh",
    order: 3,
    question: "Có lớp buổi tối ở Bình Thạnh không?",
    answerText:
      "Có. Sân Green mở các khung tối T3–T5 sau giờ làm. Khung giờ chính xác có thể thay đổi nhẹ theo sĩ số — bạn xem ở phần Lịch học hoặc để lại thông tin để V2 gợi ý slot phù hợp.",
    schemaEligible: true,
  },
  {
    id: "binh-thanh-fit",
    page: "binh_thanh",
    order: 4,
    question: "Nếu tôi ở Bình Thạnh thì sân Green có phù hợp không?",
    answerText:
      "Có, nếu bạn ưu tiên đi lại thuận tiện ở Bình Thạnh và muốn học cố định tại Sân Green. Nếu cần thêm lựa chọn sân gần phường Hiệp Bình (Thủ Đức cũ) hoặc khung giờ khác, V2 vẫn có thể tư vấn các sân thuộc cụm Thủ Đức.",
    schemaEligible: true,
  },
  {
    id: "binh-thanh-time",
    page: "binh_thanh",
    order: 5,
    question: "Người đi làm ở Bình Thạnh nên chọn khung giờ nào?",
    answerText:
      "Nếu bạn đi làm giờ hành chính, các khung tối T3–T5 ở Sân Green là lựa chọn thuận tiện nhất. Nếu muốn học nhẹ nhàng hơn, có thể chọn khung sáng cuối tuần. Slot cụ thể có ở phần Lịch học.",
    schemaEligible: true,
  },
  {
    id: "thu-duc-where",
    page: "thu_duc",
    order: 1,
    question: "V2 dạy ở sân nào tại Thủ Đức?",
    answerText:
      "V2 Badminton hiện có 3 lựa chọn tại khu vực Thủ Đức là Sân Huệ Thiên, Sân Khang Sport (Bình Triệu) và Sân Phúc Lộc, đều có link Google Maps để xem đường đi.",
    schemaEligible: true,
  },
  {
    id: "thu-duc-address",
    page: "thu_duc",
    order: 2,
    question: "Sân Huệ Thiên, Khang Sport (Bình Triệu) và Phúc Lộc ở đâu?",
    answerText:
      "Cả 3 sân đều thuộc phường Hiệp Bình (Thủ Đức cũ), TP.HCM. Cụ thể: Sân Huệ Thiên ở 520 Quốc Lộ 13; Sân Khang Sport (Bình Triệu) ở 8 Đường số 20; Sân Phúc Lộc ở 103/11B Đường số 20. Mỗi sân đều có link Google Maps trong phần Sân tập.",
    schemaEligible: true,
  },
  {
    id: "thu-duc-night",
    page: "thu_duc",
    order: 3,
    question: "Có lớp buổi tối ở Thủ Đức không?",
    answerText:
      "Có. Huệ Thiên mở các khung tối trong tuần. Phúc Lộc có lớp tối T2–T4–T6 cố định — phù hợp cho người đi làm muốn theo lịch đều đặn. Slot cụ thể xem ở phần Lịch học.",
    schemaEligible: true,
  },
  {
    id: "thu-duc-weekend",
    page: "thu_duc",
    order: 4,
    question: "Cuối tuần có lớp ở Thủ Đức không?",
    answerText:
      "Có. Huệ Thiên mở nhiều khung sáng và chiều cuối tuần. Khang Sport có khung trưa T7 và cuối tuần. Bạn xem chi tiết ở phần Lịch học và bấm “Chọn lịch này” để V2 tự điền sân/giờ vào form.",
    schemaEligible: true,
  },
  {
    id: "thu-duc-which-court",
    page: "thu_duc",
    order: 5,
    question: "Nếu học tại Thủ Đức thì nên chọn sân nào?",
    answerText:
      "Nếu cần nhiều khung giờ nhất, chọn Huệ Thiên. Nếu ưu tiên cuối tuần hoặc khu Bình Triệu, Khang Sport phù hợp hơn. Nếu muốn cố định lịch T2–T4–T6 (đặc biệt cho lớp chiều và tối), Phúc Lộc là lựa chọn dễ theo lâu dài.",
    schemaEligible: true,
  },
] as const;

export function getFaqsForPage(page: FaqPageId) {
  return faqs
    .filter((faq) => faq.page === page)
    .sort((left, right) => left.order - right.order);
}
