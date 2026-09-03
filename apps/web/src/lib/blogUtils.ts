import type { SanityPostCategory } from "@/lib/sanity";

export function getCategoryLabel(category: SanityPostCategory): string {
  switch (category) {
    case "tips":
      return "Tips";
    case "how-to":
      return "Hướng dẫn";
    case "beginner":
      return "Người mới";
    case "campaign":
      return "Chiến dịch";
  }
}
