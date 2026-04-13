import { getRouteMetadata, type CoreRoutePath } from "@/lib/routes";
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
>;

type PublishedMoneyPageFallbackConfig = {
  slug: string;
  audience: SanityAudience;
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
    h1: "Lớp cầu lông trẻ em tại TP.HCM",
    intro:
      "V2 Badminton đang cập nhật nội dung chi tiết cho lộ trình trẻ em. Phụ huynh vẫn có thể để lại thông tin để nhận tư vấn về độ tuổi phù hợp, lịch học và sân tập gần nhất.",
    body:
      "Chúng tôi thiết kế lớp theo nhịp độ dễ theo, ưu tiên nền tảng vận động, phản xạ và cảm giác cầu trước khi tăng kỹ thuật. Khi nội dung đầy đủ từ Sanity sẵn sàng, trang này sẽ tự hiển thị phiên bản hoàn chỉnh mà không cần đổi route.",
    ctaLabel: "Nhận tư vấn cho phụ huynh",
  },
  "/lop-cau-long-cho-nguoi-di-lam/": {
    slug: "lop-cau-long-cho-nguoi-di-lam",
    audience: "nguoi_di_lam",
    h1: "Lớp cầu lông cho người đi làm tại TP.HCM",
    intro:
      "V2 Badminton đang cập nhật nội dung chi tiết cho nhóm học viên đi làm. Bạn vẫn có thể để lại thông tin để được gợi ý lịch tối hoặc cuối tuần phù hợp.",
    body:
      "Các lớp hiện được thiết kế để giữ nhịp tập đều, dễ quay lại sau giờ làm và phù hợp cả người mới bắt đầu lẫn người cần duy trì thể lực. Khi dữ liệu Sanity sẵn sàng trở lại, trang sẽ tự hiển thị nội dung hoàn chỉnh.",
    ctaLabel: "Nhận tư vấn lịch học",
  },
  "/cau-long-doanh-nghiep/": {
    slug: "cau-long-doanh-nghiep",
    audience: "doanh_nghiep",
    h1: "Chương trình cầu lông doanh nghiệp tại TP.HCM",
    intro:
      "V2 Badminton đang cập nhật nội dung chi tiết cho gói doanh nghiệp. Doanh nghiệp vẫn có thể gửi nhu cầu để nhận tư vấn về mục tiêu, ngân sách và hình thức triển khai phù hợp.",
    body:
      "Chương trình có thể bao gồm lớp nội bộ, hoạt động gắn kết hoặc mô hình huấn luyện theo mục tiêu riêng của từng team. Khi kết nối Sanity ổn định, trang này sẽ tự hiển thị lại toàn bộ nội dung chi tiết.",
    ctaLabel: "Nhận tư vấn cho doanh nghiệp",
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
  const route = getRouteMetadata(path);
  const config = MONEY_PAGE_FALLBACKS[path];

  return {
    id: `fallback:${config.slug}`,
    slug: config.slug,
    audience: config.audience,
    h1: config.h1,
    metaTitle: route.title,
    metaDescription: route.description,
    intro: toPortableTextBlocks(config.intro),
    body: toPortableTextBlocks(config.body),
    heroImageUrl: null,
    relatedLocations: [],
    relatedPricing: [],
    relatedFaqs: [],
    ctaLabel: config.ctaLabel,
  };
}
