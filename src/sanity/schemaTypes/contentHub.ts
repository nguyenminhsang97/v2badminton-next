import { defineField, defineType } from "sanity";
import { slugifyValue } from "./shared";
import { contentBodyBlock, defineFullPathField } from "./contentShared";
import { QuickAnswerInput } from "../components/QuickAnswerInput";

/**
 * content_hub — top-level content portal (e.g. /ky-thuat-cau-long/).
 *
 * Phase 1: minimal field set. Seeded per milestone (Decision 3 — `ky-thuat-cau-long`
 * first). Rich portal fields (featured articles, layout, CTA, nav) are deferred to
 * the owning milestone, NOT speculatively. Money pages are NOT hubs and keep their
 * own frozen file-system routes (Decision 1); a hub links OUT to them.
 */
export const contentHub = defineType({
  name: "content_hub",
  title: "Hub nội dung",
  type: "document",
  groups: [
    { name: "overview", title: "Tổng quan", default: true },
    { name: "structure", title: "Cấu trúc & URL" },
    { name: "body", title: "Nội dung" },
    { name: "seo", title: "SEO & AEO" },
  ],
  initialValue: {
    isIndexed: true,
  },
  fields: [
    defineField({
      name: "title",
      title: "Tên hub",
      type: "string",
      group: "overview",
      description: "VD: Kỹ thuật cầu lông. Hiển thị làm tiêu đề trang hub.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isIndexed",
      title: "Cho phép Google index?",
      type: "boolean",
      group: "overview",
      description:
        "Tắt để hub bị noindex và bị loại khỏi sitemap (cùng với nội dung con).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (đoạn URL của hub)",
      type: "slug",
      group: "structure",
      description:
        "Đoạn URL gốc của hub, không có dấu /. VD: ky-thuat-cau-long → website.com/ky-thuat-cau-long/",
      options: {
        source: "title",
        slugify: slugifyValue,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineFullPathField({ group: "structure" }),
    defineField({
      name: "quickAnswer",
      title: "Câu trả lời nhanh (AEO)",
      type: "text",
      rows: 3,
      group: "body",
      description:
        "Đoạn trả lời ngắn, trực tiếp cho câu hỏi cốt lõi của hub. Dùng cho AI/Answer Engine.",
      components: { input: QuickAnswerInput },
    }),
    defineField({
      name: "intro",
      title: "Đoạn giới thiệu",
      type: "array",
      group: "body",
      description: "Đoạn mở đầu ngắn hiển thị trên trang hub. Có thể để trống.",
      of: [contentBodyBlock],
    }),
    defineField({
      name: "seoTitle",
      title: "Tiêu đề SEO",
      type: "string",
      group: "seo",
      description:
        "Hiển thị trên tab trình duyệt và kết quả Google. Tối đa ~60 ký tự.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "seoDescription",
      title: "Mô tả SEO",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Mô tả ngắn dưới tiêu đề trên Google. Tối đa 160 ký tự.",
      validation: (Rule) => Rule.required().max(160),
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
