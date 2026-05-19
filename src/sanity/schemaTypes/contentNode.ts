import { defineField, defineType } from "sanity";
import { slugifyValue } from "./shared";
import { contentBodyBlock, defineFullPathField } from "./contentShared";

/**
 * content_node — a section/branch inside a hub (e.g. /ky-thuat-cau-long/danh-don/).
 *
 * `parentNode` is OPTIONAL and self-referential → the schema supports an
 * arbitrary-depth tree from day 1 (resolves the review-vs-counterargument
 * tension). A soft validation warning fires past depth 3; the schema itself
 * never blocks depth, so deeper structure later needs no migration.
 *
 * Milestone 1 (5 flat technique articles) may create zero nodes; the type still
 * ships so later milestones don't require a schema change.
 */
export const contentNode = defineType({
  name: "content_node",
  title: "Nhánh nội dung",
  type: "document",
  initialValue: {
    isIndexed: true,
  },
  fields: [
    defineField({
      name: "title",
      title: "Tên nhánh",
      type: "string",
      description: "VD: Đánh đơn. Hiển thị làm tiêu đề trang nhánh.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (đoạn URL của nhánh)",
      type: "slug",
      description:
        "Một đoạn URL, không có dấu /. VD: danh-don. Đường dẫn đầy đủ ghép từ hub + nhánh cha.",
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
      description: "Hub gốc chứa nhánh này.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "parentNode",
      title: "Nhánh cha (tuỳ chọn)",
      type: "reference",
      to: [{ type: "content_node" }],
      description:
        "Để trống nếu nhánh nằm trực tiếp dưới hub. Chọn nhánh cha để tạo cấu trúc sâu hơn.",
    }),
    defineFullPathField({ warnDepth: true }),
    defineField({
      name: "seoTitle",
      title: "Tiêu đề SEO",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "seoDescription",
      title: "Mô tả SEO",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "quickAnswer",
      title: "Câu trả lời nhanh (AEO)",
      type: "text",
      rows: 3,
      description:
        "Đoạn trả lời ngắn, trực tiếp cho câu hỏi cốt lõi của nhánh. Dùng cho AI/Answer Engine.",
    }),
    defineField({
      name: "intro",
      title: "Đoạn giới thiệu",
      type: "array",
      of: [contentBodyBlock],
    }),
    defineField({
      name: "isIndexed",
      title: "Cho phép Google index?",
      type: "boolean",
      description:
        "Tắt để nhánh bị noindex và bị loại khỏi sitemap. Nhánh không có nội dung không nên index.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "fullPath.current",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? subtitle : "Chưa Generate đường dẫn",
      };
    },
  },
});
