import type { CoreRoutePath } from "@/lib/routes";
import type {
  SanityAudience,
  SanityMoneyPage,
  SanityPortableTextBlock,
} from "@/lib/sanity";

export type PublishedMoneyPagePath = Extract<
  CoreRoutePath,
  | "/lop-cau-long-tre-em/"
  | "/lop-cau-long-cho-nguoi-di-lam/"
  | "/cau-long-doanh-nghiep/"
  | "/lop-he-cau-long-tphcm/"
  | "/hoc-cau-long-1-kem-1/"
  | "/lop-cau-long-cuoi-tuan/"
  | "/lop-cau-long-buoi-toi/"
  | "/gia-hoc-cau-long-tphcm/"
  | "/team-building-cau-long/"
>;

type PublishedMoneyPageFallbackConfig = {
  slug: string;
  audience: SanityAudience;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  body: string;
  ctaLabel: string;
};

const MONEY_PAGE_FALLBACKS: Record<
  PublishedMoneyPagePath,
  PublishedMoneyPageFallbackConfig
> = {
  "/lop-cau-long-tre-em/": {
    slug: "lop-cau-long-tre-em",
    audience: "tre_em",
    metaTitle: "Lớp Cầu Lông Trẻ Em Tại TP.HCM | V2 Badminton",
    metaDescription:
      "Lớp cầu lông trẻ em tại TP.HCM với nhịp độ dễ theo, ưu tiên nền tảng vận động, phản xạ và cảm giác cầu trước khi tăng kỹ thuật.",
    h1: "Lớp cầu lông trẻ em tại TP.HCM",
    intro:
      "V2 Badminton đang cập nhật nội dung chi tiết cho lộ trình trẻ em. Phụ huynh vẫn có thể để lại thông tin để nhận tư vấn về độ tuổi phù hợp, lịch học và sân tập gần nhất.",
    body:
      "Chúng tôi thiết kế lớp theo nhịp độ dễ theo, ưu tiên nền tảng vận động, phản xạ và cảm giác cầu trước khi tăng kỹ thuật. Nội dung chi tiết đang được cập nhật và sẽ hiển thị đầy đủ trong thời gian sớm nhất.",
    ctaLabel: "Nhận tư vấn cho phụ huynh",
  },
  "/lop-cau-long-cho-nguoi-di-lam/": {
    slug: "lop-cau-long-cho-nguoi-di-lam",
    audience: "nguoi_di_lam",
    metaTitle: "Lớp Cầu Lông Cho Người Đi Làm Tại TP.HCM | V2 Badminton",
    metaDescription:
      "Lớp cầu lông cho người đi làm với lịch tối hoặc cuối tuần, phù hợp để duy trì tập luyện đều tại Bình Thạnh và Thủ Đức.",
    h1: "Lớp cầu lông cho người đi làm tại TP.HCM",
    intro:
      "V2 Badminton đang cập nhật nội dung chi tiết cho nhóm học viên đi làm. Bạn vẫn có thể để lại thông tin để được gợi ý lịch tối hoặc cuối tuần phù hợp.",
    body:
      "Các lớp hiện được thiết kế để giữ nhịp tập đều, dễ quay lại sau giờ làm và phù hợp cả người mới bắt đầu lẫn người cần duy trì thể lực. Nội dung chi tiết đang được cập nhật và sẽ hiển thị đầy đủ trong thời gian sớm nhất.",
    ctaLabel: "Nhận tư vấn lịch học",
  },
  "/cau-long-doanh-nghiep/": {
    slug: "cau-long-doanh-nghiep",
    audience: "doanh_nghiep",
    metaTitle: "Chương Trình Cầu Lông Doanh Nghiệp Tại TP.HCM | V2 Badminton",
    metaDescription:
      "Giải pháp cầu lông cho doanh nghiệp: lớp nội bộ, hoạt động gắn kết và chương trình theo mục tiêu, ngân sách của từng team.",
    h1: "Chương trình cầu lông doanh nghiệp tại TP.HCM",
    intro:
      "V2 Badminton đang cập nhật nội dung chi tiết cho gói doanh nghiệp. Doanh nghiệp vẫn có thể gửi nhu cầu để nhận tư vấn về mục tiêu, ngân sách và hình thức triển khai phù hợp.",
    body:
      "Chương trình có thể bao gồm lớp nội bộ, hoạt động gắn kết hoặc mô hình huấn luyện theo mục tiêu riêng của từng team. Nội dung chi tiết đang được cập nhật và sẽ hiển thị đầy đủ trong thời gian sớm nhất.",
    ctaLabel: "Nhận tư vấn cho doanh nghiệp",
  },
  "/lop-he-cau-long-tphcm/": {
    slug: "lop-he-cau-long-tphcm",
    audience: "tre_em",
    metaTitle: "Lớp Hè Cầu Lông Tại TP.HCM | V2 Badminton",
    metaDescription:
      "Lớp cầu lông hè cho trẻ em và người mới bắt đầu tại TP.HCM. Lịch linh hoạt, lớp nhỏ, sân tại Bình Thạnh và Thủ Đức.",
    h1: "Lớp cầu lông hè tại TP.HCM",
    intro:
      "V2 Badminton đang chuẩn bị nội dung chi tiết cho chương trình hè. Phụ huynh và học viên có thể để lại thông tin để nhận thông báo khi lớp hè mở đăng ký.",
    body:
      "Chương trình hè được thiết kế cho trẻ em và người mới bắt đầu, với lịch học linh hoạt và lớp nhỏ tại các sân ở Bình Thạnh và Thủ Đức. Nội dung chi tiết đang được cập nhật và sẽ hiển thị đầy đủ trong thời gian sớm nhất.",
    ctaLabel: "Nhận thông báo lớp hè",
  },
  "/hoc-cau-long-1-kem-1/": {
    slug: "hoc-cau-long-1-kem-1",
    audience: "nguoi_moi",
    metaTitle: "Học Cầu Lông 1 Kèm 1 Tại TP.HCM | V2 Badminton",
    metaDescription:
      "Chương trình cầu lông 1 kèm 1 tại TP.HCM cho học viên cần HLV theo sát, lộ trình cá nhân hóa và lịch linh hoạt.",
    h1: "Học cầu lông 1 kèm 1 tại TP.HCM",
    intro:
      "Chương trình kèm riêng 1:1 giúp học viên tiến bộ nhanh với lộ trình cá nhân hóa và HLV theo sát từng buổi.",
    body:
      "V2 Badminton thiết kế buổi học linh hoạt theo mục tiêu của từng học viên: sửa kỹ thuật cơ bản, nâng trình các pha cầu hoặc giữ nhịp tập ổn định. Nội dung chi tiết đang được cập nhật.",
    ctaLabel: "Đăng ký kèm riêng",
  },
  "/lop-cau-long-cuoi-tuan/": {
    slug: "lop-cau-long-cuoi-tuan",
    audience: "nguoi_di_lam",
    metaTitle: "Lớp Cầu Lông Cuối Tuần Tại TP.HCM | V2 Badminton",
    metaDescription:
      "Lớp cầu lông cuối tuần cho người bận trong tuần, lịch linh hoạt tại Bình Thạnh và Thủ Đức.",
    h1: "Lớp cầu lông cuối tuần tại TP.HCM",
    intro:
      "Khung lịch thứ 7 và chủ nhật phù hợp cho người đi làm, sinh viên hoặc bất kỳ ai muốn giữ nhịp tập mà không ảnh hưởng giờ hành chính.",
    body:
      "V2 Badminton mở lớp cuối tuần tại các sân ở Bình Thạnh và Thủ Đức, giữ nhịp buổi học gọn và dễ theo. Nội dung chi tiết đang được cập nhật.",
    ctaLabel: "Xem lịch cuối tuần",
  },
  "/lop-cau-long-buoi-toi/": {
    slug: "lop-cau-long-buoi-toi",
    audience: "nguoi_di_lam",
    metaTitle: "Lớp Cầu Lông Buổi Tối Tại TP.HCM | V2 Badminton",
    metaDescription:
      "Lớp cầu lông buổi tối cho người đi làm, phù hợp với giờ sau giờ hành chính tại Bình Thạnh và Thủ Đức.",
    h1: "Lớp cầu lông buổi tối tại TP.HCM",
    intro:
      "V2 Badminton có các khung giờ sau giờ làm để bạn duy trì tập luyện đều đặn mà không cần hy sinh lịch cá nhân ban ngày.",
    body:
      "Lịch buổi tối phù hợp cho người cần tập sau giờ hành chính, với lộ trình linh hoạt và nhịp tập ổn định. Nội dung chi tiết đang được cập nhật.",
    ctaLabel: "Xem lịch buổi tối",
  },
  "/gia-hoc-cau-long-tphcm/": {
    slug: "gia-hoc-cau-long-tphcm",
    audience: "nguoi_moi",
    metaTitle: "Giá Học Cầu Lông Tại TP.HCM 2026 | V2 Badminton",
    metaDescription:
      "Tổng hợp giá học cầu lông tại TP.HCM: lớp nhóm, kèm riêng và chương trình doanh nghiệp tại V2 Badminton.",
    h1: "Giá học cầu lông tại TP.HCM 2026",
    intro:
      "Trang này giúp học viên so sánh nhanh các mô hình học phí để chọn phương án phù hợp với mục tiêu và ngân sách.",
    body:
      "V2 Badminton có nhiều gợi ý học phí từ lớp nhóm, kèm riêng đến chương trình doanh nghiệp. Nội dung chi tiết đang được cập nhật để bạn so sánh dễ hơn.",
    ctaLabel: "Xem bảng giá",
  },
  "/team-building-cau-long/": {
    slug: "team-building-cau-long",
    audience: "doanh_nghiep",
    metaTitle: "Team Building Cầu Lông Cho Doanh Nghiệp | V2 Badminton",
    metaDescription:
      "Giải pháp team building cầu lông cho doanh nghiệp tại TP.HCM với format linh hoạt, gắn kết và có thể tùy biến theo team.",
    h1: "Team building cầu lông cho doanh nghiệp",
    intro:
      "V2 Badminton thiết kế chương trình team building qua cầu lông để doanh nghiệp có một hoạt động thể thao dùng được vào đúng mục tiêu gắn kết.",
    body:
      "Chương trình có thể bao gồm buổi làm quen, mini game, giải đấu nội bộ hoặc format theo đội nhóm. Nội dung chi tiết đang được cập nhật.",
    ctaLabel: "Nhận báo giá team building",
  },
};

function toPortableTextBlocks(text: string): SanityPortableTextBlock[] {
  return [
    {
      _key: "money-page-fallback-block",
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [
        {
          _key: "money-page-fallback-span",
          _type: "span",
          text,
          marks: [],
        },
      ],
    },
  ];
}

export function buildPublishedMoneyPageFallback(
  path: PublishedMoneyPagePath,
): SanityMoneyPage {
  const config = MONEY_PAGE_FALLBACKS[path];

  return {
    id: `fallback:${config.slug}`,
    updatedAt: null,
    slug: config.slug,
    audience: config.audience,
    h1: config.h1,
    metaTitle: config.metaTitle,
    metaDescription: config.metaDescription,
    intro: toPortableTextBlocks(config.intro),
    body: toPortableTextBlocks(config.body),
    heroImageUrl: null,
    relatedLocations: [],
    relatedPricing: [],
    relatedFaqs: [],
    ctaLabel: config.ctaLabel,
  };
}
