import type { SanityTestimonial } from "@/lib/sanity";

export const HOMEPAGE_TESTIMONIAL_FALLBACKS: SanityTestimonial[] = [
  {
    id: "fallback-parent",
    avatarUrl: null,
    avatarAlt: null,
    studentGroup: "tre_em",
    kicker: "Phụ huynh & trẻ em",
    rating: 5,
    shortQuote:
      "Con đi học hào hứng hơn, buổi nào cũng có mục tiêu rõ nên phụ huynh nhìn vào thấy yên tâm hơn.",
    content:
      "Con đi học hào hứng hơn vì được HLV kèm sát và buổi nào cũng có mục tiêu rõ. Phụ huynh nhìn vào cũng thấy yên tâm hơn hẳn.",
    studentName: "Chị Linh",
    contextLabel: "Phụ huynh học viên thiếu nhi",
    featured: false,
    homepageOrder: 90,
    order: 90,
  },
  {
    id: "fallback-beginner",
    avatarUrl: null,
    avatarAlt: null,
    studentGroup: "nguoi_moi",
    kicker: "Người mới bắt đầu",
    rating: 5,
    shortQuote:
      "Mình bắt đầu từ con số 0 nhưng vẫn theo kịp lớp nhỏ, sửa lỗi nhanh và thấy tự tin hơn sau vài tuần.",
    content:
      "Mình bắt đầu từ con số 0 nhưng vẫn theo kịp vì lớp nhỏ, sửa lỗi nhanh và lịch học dễ bám theo. Sau vài tuần đã thấy tự tin vào sân hơn.",
    studentName: "Anh Huy",
    contextLabel: "Học viên người mới",
    featured: false,
    homepageOrder: 91,
    order: 91,
  },
  {
    id: "fallback-working",
    avatarUrl: null,
    avatarAlt: null,
    studentGroup: "nguoi_di_lam",
    kicker: "Người đi làm",
    rating: 5,
    shortQuote:
      "Lớp buổi tối đúng lịch mong muốn, không khí vừa phải nên mình vẫn theo được đều mà không áp lực.",
    content:
      "Mình cần lớp buổi tối gần công ty và V2 xếp đúng lịch mong muốn. Không khí học rất vừa phải, không áp lực mà vẫn lên trình đều.",
    studentName: "Chị Trâm",
    contextLabel: "Học viên lớp tối",
    featured: false,
    homepageOrder: 92,
    order: 92,
  },
];
