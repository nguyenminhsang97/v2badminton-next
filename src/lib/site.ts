export const siteConfig = {
  name: "V2 Badminton",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://v2badminton.com",
  defaultOgImagePath: "/og-image.jpg",
  language: "vi-VN",
  locale: "vi_VN",
  phoneDisplay: "0907 911 886",
  phoneE164: "+84907911886",
  zaloNumber: "0907911886",
  facebookUrl: "https://www.facebook.com/v2badmintonhcm/",
  privacyPolicyPath: "/chinh-sach-bao-mat/",
} as const;

export const moneyPages = [
  {
    slug: "/hoc-cau-long-1-kem-1/",
    title: "Học cầu lông 1 kèm 1",
    intent: "High-intent page cho người muốn HLV theo sát và cần lịch linh hoạt.",
  },
  {
    slug: "/lop-cau-long-cuoi-tuan/",
    title: "Lớp cầu lông cuối tuần",
    intent: "Money page cho user không rảnh buổi tối hoặc giờ hành chính.",
  },
  {
    slug: "/lop-cau-long-buoi-toi/",
    title: "Lớp cầu lông buổi tối",
    intent: "Money page cho người đi làm cần học sau giờ hành chính.",
  },
  {
    slug: "/gia-hoc-cau-long-tphcm/",
    title: "Giá học cầu lông TP.HCM",
    intent: "Commercial page cho user đang so giá và chuẩn bị ra quyết định.",
  },
  {
    slug: "/team-building-cau-long/",
    title: "Team building cầu lông",
    intent: "Page riêng cho doanh nghiệp với CTA, pricing logic, và proof khác hẳn B2C.",
  },
] as const;
