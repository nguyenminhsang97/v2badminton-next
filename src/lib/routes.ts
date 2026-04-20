import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export type PageType =
  | "homepage"
  | "seo_local"
  | "seo_service"
  | "seo_support";

export type CoreRoutePath =
  | "/"
  | "/hoc-cau-long-cho-nguoi-moi/"
  | "/lop-cau-long-binh-thanh/"
  | "/lop-cau-long-thu-duc/"
  | "/lop-cau-long-tre-em/"
  | "/lop-cau-long-cho-nguoi-di-lam/"
  | "/cau-long-doanh-nghiep/"
  | "/lop-he-cau-long-tphcm/"
  | "/hoc-cau-long-1-kem-1/"
  | "/lop-cau-long-cuoi-tuan/"
  | "/lop-cau-long-buoi-toi/"
  | "/gia-hoc-cau-long-tphcm/"
  | "/team-building-cau-long/";

export type RouteMetadataEntry = {
  path: CoreRoutePath;
  pageType: PageType;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage: string;
  navLabel: string;
  summary: string;
};

export const coreRoutes: readonly RouteMetadataEntry[] = [
  {
    path: "/",
    pageType: "homepage",
    title: "V2 Badminton — Dạy Cầu Lông Bình Thạnh & Thủ Đức | HCM",
    description:
      "V2 Badminton — Lớp dạy cầu lông chuyên nghiệp tại Bình Thạnh & Thủ Đức, TP.HCM. Dành cho người mới bắt đầu, nhân viên văn phòng và doanh nghiệp. Đăng ký học thử miễn phí!",
    ogTitle: "V2 Badminton — Dạy Cầu Lông Bình Thạnh & Thủ Đức",
    ogDescription:
      "Lớp dạy cầu lông chuyên nghiệp cho người mới bắt đầu, nhân viên văn phòng và doanh nghiệp tại TP.HCM.",
    ogImage: siteConfig.defaultOgImagePath,
    navLabel: "Trang chủ",
    summary:
      "Landing chính cần giữ parity cho hero, schedule cards, form prefill, tracking và conversion flow.",
  },
  {
    path: "/hoc-cau-long-cho-nguoi-moi/",
    pageType: "seo_service",
    title: "Học Cầu Lông Cho Người Mới Bắt Đầu Tại TP.HCM | V2 Badminton",
    description:
      "Chưa biết chơi cầu lông vẫn học được tại V2 Badminton. Khóa cơ bản dạy từ zero, lớp nhỏ 2-6 người hoặc kèm 1:1 tại TP.HCM.",
    ogImage: siteConfig.defaultOgImagePath,
    navLabel: "Người mới",
    summary:
      "Trang SEO mạnh nhất hiện tại, sau này sẽ là template tham chiếu cho service/support pages.",
  },
  {
    path: "/lop-cau-long-binh-thanh/",
    pageType: "seo_local",
    title: "Lớp Cầu Lông Bình Thạnh | Sân Green | V2 Badminton",
    description:
      "Tìm lớp cầu lông tại Bình Thạnh? V2 Badminton nhận học viên tại sân Green, có lớp chiều tối trong tuần và lịch cuối tuần cho người mới bắt đầu.",
    ogImage: siteConfig.defaultOgImagePath,
    navLabel: "Bình Thạnh",
    summary:
      "Local page cho sân Green và decision-support content theo intent khu vực Bình Thạnh.",
  },
  {
    path: "/lop-cau-long-thu-duc/",
    pageType: "seo_local",
    title:
      "Lớp Cầu Lông Thủ Đức | Huệ Thiên, Khang Sport, Phúc Lộc | V2 Badminton",
    description:
      "Học cầu lông tại Thủ Đức với V2 Badminton. Có sân Huệ Thiên, Khang Sport (Bình Triệu) và Phúc Lộc, lịch chiều tối trong tuần và cuối tuần linh hoạt.",
    ogImage: siteConfig.defaultOgImagePath,
    navLabel: "Thủ Đức",
    summary:
      "Local page cho cụm Huệ Thiên, Khang Sport, Phúc Lộc cùng schema và decision-support content.",
  },
  {
    path: "/lop-cau-long-tre-em/",
    pageType: "seo_service",
    title: "Lớp Cầu Lông Trẻ Em Tại TP.HCM | V2 Badminton",
    description:
      "Lớp cầu lông trẻ em tại TP.HCM với nhịp độ dễ theo, ưu tiên nền tảng vận động, phản xạ và cảm giác cầu trước khi tăng kỹ thuật.",
    ogImage: siteConfig.defaultOgImagePath,
    navLabel: "Trẻ em",
    summary:
      "Money page dành cho phụ huynh đang tìm lớp cầu lông nền tảng, dễ theo và phù hợp giai đoạn đầu cho trẻ.",
  },
  {
    path: "/lop-cau-long-cho-nguoi-di-lam/",
    pageType: "seo_service",
    title: "Lớp Cầu Lông Cho Người Đi Làm Tại TP.HCM | V2 Badminton",
    description:
      "Lớp cầu lông cho người đi làm với lịch tối hoặc cuối tuần, phù hợp để duy trì tập luyện đều tại Bình Thạnh và Thủ Đức.",
    ogImage: siteConfig.defaultOgImagePath,
    navLabel: "Người đi làm",
    summary:
      "Money page cho học viên cần lịch học linh hoạt sau giờ làm và muốn giữ nhịp tập ổn định dài hạn.",
  },
  {
    path: "/cau-long-doanh-nghiep/",
    pageType: "seo_support",
    title: "Chương Trình Cầu Lông Doanh Nghiệp Tại TP.HCM | V2 Badminton",
    description:
      "Giải pháp cầu lông cho doanh nghiệp: lớp nội bộ, hoạt động gắn kết và chương trình theo mục tiêu, ngân sách của từng team.",
    ogImage: siteConfig.defaultOgImagePath,
    navLabel: "Doanh nghiệp+",
    summary:
      "Money page B2B cho nhu cầu lớp nội bộ, team building thể thao và chương trình cầu lông theo mục tiêu doanh nghiệp.",
  },
  {
    path: "/lop-he-cau-long-tphcm/",
    pageType: "seo_service",
    title: "Lớp Hè Cầu Lông Tại TP.HCM | V2 Badminton",
    description:
      "Lớp cầu lông hè cho trẻ em và người mới bắt đầu tại TP.HCM. Lịch linh hoạt, lớp nhỏ, sân tại Bình Thạnh và Thủ Đức.",
    ogImage: siteConfig.defaultOgImagePath,
    navLabel: "Lớp hè",
    summary:
      "V2 Badminton đang chuẩn bị nội dung chi tiết cho chương trình hè. Phụ huynh và học viên có thể để lại thông tin để nhận thông báo khi lớp hè mở đăng ký.",
  },
  {
    path: "/hoc-cau-long-1-kem-1/",
    pageType: "seo_service",
    title: "Học Cầu Lông 1 Kèm 1 Tại TP.HCM | V2 Badminton",
    description:
      "Chương trình cầu lông 1 kèm 1 tại TP.HCM cho học viên cần HLV theo sát, lộ trình cá nhân hóa và lịch linh hoạt.",
    ogImage: siteConfig.defaultOgImagePath,
    navLabel: "1 kèm 1",
    summary:
      "Chương trình kèm riêng 1:1 giúp học viên tiến bộ nhanh với lộ trình cá nhân hóa và HLV theo sát từng buổi.",
  },
  {
    path: "/lop-cau-long-cuoi-tuan/",
    pageType: "seo_service",
    title: "Lớp Cầu Lông Cuối Tuần Tại TP.HCM | V2 Badminton",
    description:
      "Lớp cầu lông cuối tuần cho người bận trong tuần, lịch linh hoạt tại Bình Thạnh và Thủ Đức.",
    ogImage: siteConfig.defaultOgImagePath,
    navLabel: "Cuối tuần",
    summary:
      "Khung lịch thứ 7 và chủ nhật phù hợp cho người đi làm, sinh viên hoặc bất kỳ ai muốn giữ nhịp tập mà không ảnh hưởng giờ hành chính.",
  },
  {
    path: "/lop-cau-long-buoi-toi/",
    pageType: "seo_service",
    title: "Lớp Cầu Lông Buổi Tối Tại TP.HCM | V2 Badminton",
    description:
      "Lớp cầu lông buổi tối cho người đi làm, phù hợp với giờ sau giờ hành chính tại Bình Thạnh và Thủ Đức.",
    ogImage: siteConfig.defaultOgImagePath,
    navLabel: "Buổi tối",
    summary:
      "V2 Badminton có các khung giờ sau giờ làm để bạn duy trì tập luyện đều đặn mà không cần hy sinh lịch cá nhân ban ngày.",
  },
  {
    path: "/gia-hoc-cau-long-tphcm/",
    pageType: "seo_support",
    title: "Giá Học Cầu Lông Tại TP.HCM 2026 | V2 Badminton",
    description:
      "Tổng hợp giá học cầu lông tại TP.HCM: lớp nhóm, kèm riêng và chương trình doanh nghiệp tại V2 Badminton.",
    ogImage: siteConfig.defaultOgImagePath,
    navLabel: "Giá học",
    summary:
      "Trang này giúp học viên so sánh nhanh các mô hình học phí để chọn phương án phù hợp với mục tiêu và ngân sách.",
  },
  {
    path: "/team-building-cau-long/",
    pageType: "seo_support",
    title: "Team Building Cầu Lông Cho Doanh Nghiệp | V2 Badminton",
    description:
      "Giải pháp team building cầu lông cho doanh nghiệp tại TP.HCM với format linh hoạt, gắn kết và có thể tùy biến theo team.",
    ogImage: siteConfig.defaultOgImagePath,
    navLabel: "Team building",
    summary:
      "V2 Badminton thiết kế chương trình team building qua cầu lông để doanh nghiệp có một hoạt động thể thao dùng được vào đúng mục tiêu gắn kết.",
  },
] as const;

export const coreRouteMap = Object.fromEntries(
  coreRoutes.map((route) => [route.path, route]),
) as Record<CoreRoutePath, RouteMetadataEntry>;

export const routeCards = coreRoutes.map((route) => ({
  href: route.path,
  title: route.navLabel,
  summary: route.summary,
})) as readonly {
  href: CoreRoutePath;
  title: string;
  summary: string;
}[];

export const reservedRoutePrefixes = [
  "/san-pham/",
  "/dich-vu/",
  "/blog/",
  "/khuyen-mai/",
] as const;

export function normalizeRoutePath(path: string): CoreRoutePath {
  if (path === "/" || path === "") {
    return "/";
  }

  const withTrailingSlash = path.endsWith("/") ? path : `${path}/`;
  return withTrailingSlash as CoreRoutePath;
}

export function canonicalUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  const isAssetPath = /\.[a-z0-9]+$/i.test(withLeadingSlash);
  const normalized =
    withLeadingSlash === "/"
      ? "/"
      : isAssetPath
        ? withLeadingSlash
        : withLeadingSlash.endsWith("/")
          ? withLeadingSlash
          : `${withLeadingSlash}/`;

  return `${siteConfig.siteUrl}${normalized}`;
}

export function getRouteMetadata(path: CoreRoutePath): RouteMetadataEntry {
  return coreRouteMap[path];
}

export function buildMetadata(
  path: CoreRoutePath,
  overrides: Partial<Metadata> = {},
): Metadata {
  const route = getRouteMetadata(path);
  const url = canonicalUrl(path);

  const base: Metadata = {
    title: {
      absolute: route.title,
    },
    description: route.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: route.ogTitle ?? route.title,
      description: route.ogDescription ?? route.description,
      url,
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      type: "website",
      images: [canonicalUrl(route.ogImage)],
    },
  };

  return {
    ...base,
    ...overrides,
    alternates: {
      ...base.alternates,
      ...overrides.alternates,
    },
    openGraph: {
      ...base.openGraph,
      ...overrides.openGraph,
    },
  };
}
