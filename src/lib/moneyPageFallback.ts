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
