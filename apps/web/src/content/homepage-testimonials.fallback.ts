import type { SanityTestimonial } from "@/lib/sanity";

// Không dùng testimonial giả trong fallback. Nếu Sanity không có testimonial
// đã xác minh, section sẽ tự ẩn (xem StaticTestimonialsSection).
export const HOMEPAGE_TESTIMONIAL_FALLBACKS: SanityTestimonial[] = [];
