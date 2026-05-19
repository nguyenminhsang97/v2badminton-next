import { defineField, defineType } from "sanity";
import { slugifyValue } from "./shared";
import {
  CONTENT_FORMAT_OPTIONS,
  CONTENT_STATUS_OPTIONS,
  contentBodyBlock,
  defineFullPathField,
} from "./contentShared";

/**
 * content_article — the single article model for the whole platform.
 *
 * `contentFormat` is the discriminator (Phase 1: guide / how_to / explainer).
 * `relatedMoneyPage` is the portal → money-page bridge: technique articles link
 * to the relevant commercial money page (Decision 1 — money pages stay frozen
 * at their own file-system routes; the hub/articles link OUT to them).
 *
 * Required SEO + cover-alt fields replace a Phase 1 Content Ops dashboard
 * (schema-level enforcement instead of a monitoring view).
 */
export const contentArticle = defineType({
  name: "content_article",
  title: "Bài viết",
  type: "document",
  initialValue: {
    status: "draft",
    contentFormat: "guide",
  },
  fields: [
    defineField({
      name: "title",
      title: "Tiêu đề bài viết (H1)",
      type: "string",
      description: "Tiêu đề lớn nhất của bài. Cần unique và chứa từ khóa SEO.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (đoạn URL của bài)",
      type: "slug",
      description:
        "Một đoạn URL, không có dấu /. VD: cach-cam-vot-cau-long. Đường dẫn đầy đủ ghép từ hub/nhánh.",
      options: {
        source: "title",
        slugify: slugifyValue,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "parentHub",
      title: "Thuộc hub",
      type: "reference",
      to: [{ type: "content_hub" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "parentNode",
      title: "Thuộc nhánh (tuỳ chọn)",
      type: "reference",
      to: [{ type: "content_node" }],
      description:
        "Để trống nếu bài nằm trực tiếp dưới hub. Chọn nhánh để bài nằm sâu hơn.",
    }),
    defineFullPathField({ warnDepth: true }),
    defineField({
      name: "contentFormat",
      title: "Định dạng nội dung",
      type: "string",
      description:
        "Quyết định cấu trúc dữ liệu hiển thị và JSON-LD (Article/HowTo).",
      options: {
        list: [...CONTENT_FORMAT_OPTIONS],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Trạng thái",
      type: "string",
      options: {
        list: [...CONTENT_STATUS_OPTIONS],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Ngày đăng",
      type: "datetime",
      hidden: ({ document }) => document?.status !== "published",
    }),
    defineField({
      name: "excerpt",
      title: "Tóm tắt ngắn",
      type: "text",
      rows: 3,
      description: "Tóm tắt 1–2 câu, dùng cho danh sách và mạng xã hội.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Ảnh bìa",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Mô tả ảnh (alt)",
          type: "string",
          description: "Bắt buộc cho SEO và trợ năng. Mô tả nội dung ảnh.",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Nội dung chính",
      type: "array",
      of: [contentBodyBlock],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "seoTitle",
      title: "Tiêu đề SEO",
      type: "string",
      description: "Tối đa ~60 ký tự.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "seoDescription",
      title: "Mô tả SEO",
      type: "text",
      rows: 3,
      description: "Tối đa 160 ký tự.",
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "quickAnswer",
      title: "Câu trả lời nhanh (AEO)",
      type: "text",
      rows: 3,
      description:
        "Đoạn trả lời ngắn, trực tiếp cho câu hỏi của bài. Dùng cho AI/Answer Engine.",
    }),
    defineField({
      name: "relatedMoneyPage",
      title: "Trang dịch vụ liên quan (money page)",
      type: "reference",
      to: [{ type: "money_page" }],
      description:
        "Liên kết tới trang bán lớp học liên quan. Quan trọng cho SEO và chuyển đổi — hub/bài viết dẫn về money page.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      subtitle: "fullPath.current",
      media: "coverImage",
    },
    prepare({ title, status, subtitle, media }) {
      const statusLabel = status === "published" ? "Đã đăng" : "Nháp";
      return {
        title,
        subtitle: `[${statusLabel}] ${subtitle ?? "Chưa Generate đường dẫn"}`,
        media,
      };
    },
  },
});
