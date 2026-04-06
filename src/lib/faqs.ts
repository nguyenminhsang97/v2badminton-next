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
    question: "Tôi chưa bao giờ chơi cầu lông, có học được không?",
    answerText:
      "Hoàn toàn được. Khóa cơ bản của V2 thiết kế cho người bắt đầu từ zero. HLV sẽ hướng dẫn từ cách cầm vợt, tư thế đứng, di chuyển chân đến phát cầu và đánh cơ bản để bạn tiến bộ rõ rệt sau vài buổi đầu.",
    schemaEligible: true,
  },
  {
    id: "home-locations",
    page: "homepage",
    order: 2,
    question: "V2 Badminton dạy ở đâu?",
    answerText:
      "V2 giảng dạy tại 4 sân ở TP.HCM: Sân Huệ Thiên, Sân Green, Sân Khang Sport (Bình Triệu) và Sân Phúc Lộc. Bạn có thể chọn sân gần nhà hoặc gần nơi làm việc và xem địa chỉ chi tiết ngay trong phần 4 sân tập.",
    schemaEligible: true,
  },
  {
    id: "home-pricing",
    page: "homepage",
    order: 3,
    question: "Học phí và lịch học như thế nào?",
    answerText:
      "Học phí hiện tại gồm: lớp cơ bản 3 ngày mỗi tuần 1.300.000 VNĐ một tháng, lớp nâng cao 3 ngày mỗi tuần 1.500.000 VNĐ một tháng, lớp 2 ngày mỗi tuần 1.000.000 VNĐ một tháng, 1 kèm 1 là 400.000 VNĐ mỗi giờ mỗi học viên và học viên tự lo sân. Chương trình doanh nghiệp có giá thương lượng. Lịch học có các khung sáng, chiều, tối và cả cuối tuần.",
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
      "Bạn có thể gọi điện, nhắn Zalo hoặc inbox Facebook cho V2 Badminton. Chỉ cần gửi số lượng người, thời gian mong muốn và ngân sách dự kiến, đội ngũ sẽ tư vấn chương trình phù hợp.",
    schemaEligible: true,
  },
  {
    id: "nguoi-moi-zero",
    page: "nguoi_moi",
    order: 1,
    question: "Chưa biết gì có học được không?",
    answerText:
      "Có. Khóa cơ bản của V2 Badminton được thiết kế cho người bắt đầu từ zero, nên bạn không cần biết chơi trước khi đăng ký.",
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
      "Thông thường sau khoảng 8 đến 12 buổi, học viên mới đã có thể tự đánh rally cơ bản và di chuyển đúng hơn trên sân.",
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
      "Người mới có thể bắt đầu với lớp cơ bản 3 buổi mỗi tuần giá 1.300.000 VNĐ một tháng hoặc lớp 2 buổi mỗi tuần giá 1.000.000 VNĐ một tháng. Nếu muốn học riêng, hình thức 1 kèm 1 là 400.000 VNĐ mỗi giờ mỗi học viên và học viên tự lo sân.",
    schemaEligible: true,
  },
  {
    id: "binh-thanh-where",
    page: "binh_thanh",
    order: 1,
    question: "V2 dạy ở sân nào tại Bình Thạnh?",
    answerText:
      "V2 Badminton hiện nhận học viên khu vực Bình Thạnh tại Sân Green. Đây là điểm tập chính của V2 cho người học muốn ưu tiên khu vực Bình Thạnh.",
    schemaEligible: true,
  },
  {
    id: "binh-thanh-schedule",
    page: "binh_thanh",
    order: 2,
    question: "Lịch học tại Bình Thạnh thế nào?",
    answerText:
      "Sân Green có khung 08:00-10:00 cuối tuần, 14:00-15:30 vào T3-T5-T7, 18:00-20:00 và 20:00-22:00 vào T3-T5. Đây là nhóm lịch phù hợp cho cả người mới bắt đầu và người đi làm.",
    schemaEligible: true,
  },
  {
    id: "binh-thanh-night",
    page: "binh_thanh",
    order: 3,
    question: "Có lớp buổi tối ở Bình Thạnh không?",
    answerText:
      "Có. Sân Green có lớp tối 18:00-20:00 và 20:00-22:00 vào T3-T5, phù hợp cho người học sau giờ làm.",
    schemaEligible: true,
  },
  {
    id: "binh-thanh-fit",
    page: "binh_thanh",
    order: 4,
    question: "Nếu tôi ở Bình Thạnh thì sân Green có phù hợp không?",
    answerText:
      "Có, nếu bạn ưu tiên đi lại thuận tiện ở Bình Thạnh và muốn học cố định tại Sân Green. Nếu bạn cần thêm lựa chọn sân gần Hiệp Bình hoặc lịch khác, V2 vẫn có thể tư vấn các sân thuộc cụm Thủ Đức.",
    schemaEligible: true,
  },
  {
    id: "binh-thanh-time",
    page: "binh_thanh",
    order: 5,
    question: "Người đi làm ở Bình Thạnh nên chọn khung giờ nào?",
    answerText:
      "Nếu bạn đi làm giờ hành chính, khung 18:00-20:00 hoặc 20:00-22:00 vào T3-T5 là lựa chọn thuận tiện nhất. Nếu bạn muốn học nhẹ hơn, có thể chọn khung sáng cuối tuần 08:00-10:00.",
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
      "Sân Huệ Thiên ở 520 Quốc Lộ 13, Hiệp Bình Phước, Hiệp Bình, Hồ Chí Minh. Sân Khang Sport (Bình Triệu) ở 8 Đường số 20, Hiệp Bình Chánh, Hiệp Bình, Hồ Chí Minh. Sân Phúc Lộc ở 103/11B Đường số 20, Hiệp Bình Chánh, Hiệp Bình, Hồ Chí Minh.",
    schemaEligible: true,
  },
  {
    id: "thu-duc-night",
    page: "thu_duc",
    order: 3,
    question: "Có lớp buổi tối ở Thủ Đức không?",
    answerText:
      "Có. Huệ Thiên có các khung tối 18:00-20:00 và 20:00-22:00 trong tuần. Phúc Lộc cũng có lớp 18:00-20:00 và 20:00-22:00 vào T2-T4-T6, phù hợp cho người đi làm.",
    schemaEligible: true,
  },
  {
    id: "thu-duc-weekend",
    page: "thu_duc",
    order: 4,
    question: "Cuối tuần có lớp ở Thủ Đức không?",
    answerText:
      "Có. Huệ Thiên có lớp sáng cuối tuần 07:00-09:00, 09:00-11:00 và 17:00-18:00. Khang Sport có khung 11:30-13:00 thứ 7 và 12:00-14:00 vào T7-CN.",
    schemaEligible: true,
  },
  {
    id: "thu-duc-which-court",
    page: "thu_duc",
    order: 5,
    question: "Nếu học tại Thủ Đức thì nên chọn sân nào?",
    answerText:
      "Nếu bạn cần nhiều khung giờ nhất thì nên chọn Huệ Thiên. Nếu ưu tiên cuối tuần hoặc khu Bình Triệu thì Khang Sport phù hợp hơn. Nếu muốn cố định lịch T2-T4-T6, đặc biệt cho lớp chiều và tối, Phúc Lộc là lựa chọn dễ theo lâu dài.",
    schemaEligible: true,
  },
] as const;

export function getFaqsForPage(page: FaqPageId) {
  return faqs
    .filter((faq) => faq.page === page)
    .sort((left, right) => left.order - right.order);
}
