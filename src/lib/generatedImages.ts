export const generatedImages = {
  heroTraining: "/images/v2-ai/hero-training.webp",
  kidsClass: "/images/v2-ai/kids-class.webp",
  adultBeginner: "/images/v2-ai/adult-beginner.webp",
  afterWorkClass: "/images/v2-ai/after-work-class.webp",
  privateCoaching: "/images/v2-ai/private-coaching.webp",
  businessTeamBuilding: "/images/v2-ai/business-team-building.webp",
  summerClass: "/images/v2-ai/summer-class.webp",
  localBinhThanh: "/images/v2-ai/local-binh-thanh.webp",
  localThuDuc: "/images/v2-ai/local-thu-duc.webp",
  pricingOptions: "/images/v2-ai/pricing-options.webp",
  blogLearning: "/images/v2-ai/blog-learning.webp",
} as const;

const generatedRouteImages: Record<string, string> = {
  "/": generatedImages.heroTraining,
  "/hoc-cau-long-cho-nguoi-moi/": generatedImages.adultBeginner,
  "/lop-cau-long-binh-thanh/": generatedImages.localBinhThanh,
  "/lop-cau-long-thu-duc/": generatedImages.localThuDuc,
  "/lop-cau-long-tre-em/": generatedImages.kidsClass,
  "/lop-cau-long-cho-nguoi-di-lam/": generatedImages.afterWorkClass,
  "/cau-long-doanh-nghiep/": generatedImages.businessTeamBuilding,
  "/lop-he-cau-long-tphcm/": generatedImages.summerClass,
  "/hoc-cau-long-1-kem-1/": generatedImages.privateCoaching,
  "/lop-cau-long-cuoi-tuan/": generatedImages.afterWorkClass,
  "/lop-cau-long-buoi-toi/": generatedImages.afterWorkClass,
  "/gia-hoc-cau-long-tphcm/": generatedImages.pricingOptions,
  "/team-building-cau-long/": generatedImages.businessTeamBuilding,
};

export function getGeneratedRouteImage(path?: string | null): string {
  return path
    ? generatedRouteImages[path] ?? generatedImages.heroTraining
    : generatedImages.heroTraining;
}

export function getGeneratedBlogCategoryImage(): string {
  return generatedImages.blogLearning;
}

export function getGeneratedLocationImage(district?: string | null): string {
  return district === "binh_thanh"
    ? generatedImages.localBinhThanh
    : generatedImages.localThuDuc;
}
