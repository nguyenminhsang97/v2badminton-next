export const HOME_SECTION_IDS = {
  hero: "hero",
  courses: "khoa-hoc",
  pricing: "hoc-phi",
  enterprise: "doanh-nghiep",
  why: "gioi-thieu",
  coaches: "hlv",
  testimonials: "hoc-vien-noi-gi",
  schedule: "lich-hoc",
  locations: "dia-diem",
  faq: "hoi-dap",
  contact: "lien-he",
} as const;

export type HomeSectionAnchorId =
  (typeof HOME_SECTION_IDS)[keyof typeof HOME_SECTION_IDS];

export function toHash(anchorId: HomeSectionAnchorId): `#${string}` {
  return `#${anchorId}`;
}

export function toHomepageHash(anchorId: HomeSectionAnchorId): `/${string}` {
  return `/${toHash(anchorId)}`;
}
