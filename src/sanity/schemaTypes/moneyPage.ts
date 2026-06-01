import { defineArrayMember, defineField, defineType } from "sanity";
import { AUDIENCE_OPTIONS, slugifyValue } from "./shared";
import { SerpPreviewInput } from "../components/SerpPreviewInput";

const bodyBlockField = defineArrayMember({
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "H2", value: "h2" },
    { title: "H3", value: "h3" },
  ],
  lists: [
    { title: "Bullet", value: "bullet" },
    { title: "Numbered", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" },
    ],
    annotations: [
      {
        name: "link",
        title: "Link",
        type: "object",
        fields: [
          defineField({
            name: "href",
            title: "URL",
            type: "url",
            validation: (Rule) =>
              Rule.required().uri({ scheme: ["http", "https", "mailto", "tel"] }),
          }),
        ],
      },
    ],
  },
});

export const moneyPage = defineType({
  name: "money_page",
  title: "Trang nội dung",
  type: "document",
  groups: [
    { name: "overview", title: "Tổng quan", default: true },
    { name: "body", title: "Nội dung" },
    { name: "references", title: "Liên kết" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "overview",
      description:
        "Phải khớp với URL trang, không có dấu /. VD: lop-cau-long-tre-em → website.com/lop-cau-long-tre-em/",
      options: {
        source: "h1",
        slugify: slugifyValue,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "audience",
      title: "Đối tượng",
      type: "string",
      group: "overview",
      description:
        "Đối tượng học viên mục tiêu. Ảnh hưởng đến hành động nút CTA: doanh nghiệp sẽ dẫn đến form báo giá.",
      options: {
        list: [...AUDIENCE_OPTIONS],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "h1",
      title: "Tiêu đề chính (H1)",
      type: "string",
      group: "overview",
      description:
        "Tiêu đề lớn nhất trên trang. Cần unique và chứa từ khóa SEO chính của trang.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Ảnh tiêu đề",
      type: "image",
      group: "overview",
      description:
        "Ảnh lớn đầu trang và dùng làm ảnh khi chia sẻ Facebook/Zalo. Kích thước khuyến nghị: 1200×630px.",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "ctaLabel",
      title: "Nội dung nút kêu gọi",
      type: "string",
      group: "overview",
      description:
        "Nội dung nút lớn ở cuối trang. VD: Nhận tư vấn miễn phí",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Đoạn giới thiệu",
      type: "array",
      group: "body",
      description: "Đoạn mở đầu hiển thị ngay dưới tiêu đề H1. Có thể để trống.",
      of: [bodyBlockField],
    }),
    defineField({
      name: "body",
      title: "Nội dung chính",
      type: "array",
      group: "body",
      description:
        "Nội dung chính của trang: lợi ích, lộ trình, thông tin chi tiết.",
      of: [bodyBlockField],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "relatedLocations",
      title: "Sân tập liên quan",
      type: "array",
      group: "references",
      description: "Sân hiển thị trong phần bản đồ của trang này.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "location" }] })],
    }),
    defineField({
      name: "relatedPricing",
      title: "Gói học phí liên quan",
      type: "array",
      group: "references",
      description: "Gói học phí hiển thị trong phần bảng giá của trang này.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "pricing_tier" }] })],
    }),
    defineField({
      name: "relatedFaqs",
      title: "Câu hỏi thường gặp liên quan",
      type: "array",
      group: "references",
      description: "Câu hỏi hiển thị ở cuối trang này.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "faq" }] })],
    }),
    defineField({
      name: "metaTitle",
      title: "Tiêu đề SEO",
      type: "string",
      group: "seo",
      description:
        "Hiển thị trên tab trình duyệt và kết quả tìm kiếm Google. Tối đa ~60 ký tự.",
      components: { input: SerpPreviewInput },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "metaDescription",
      title: "Mô tả SEO",
      type: "text",
      rows: 3,
      group: "seo",
      description:
        "Mô tả ngắn hiển thị dưới tiêu đề trên Google. Tối đa 160 ký tự.",
      validation: (Rule) => Rule.required().max(160),
    }),
  ],
  preview: {
    select: {
      title: "h1",
      subtitle: "slug.current",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `/${subtitle}` : "Chưa có slug",
      };
    },
  },
});
