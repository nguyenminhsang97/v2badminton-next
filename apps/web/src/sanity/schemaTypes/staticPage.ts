import { defineField, defineType } from "sanity";
import { slugifyValue } from "./shared";
import { contentBodyBlock } from "./contentShared";
import { SerpPreviewInput } from "../components/SerpPreviewInput";

/**
 * static_page — collection of editorial pages whose URL is owned by a file-route
 * (W3 strategy, Audit §3.2). Each doc is identified by `slug.current` and looked
 * up in W3b by the route's page.tsx (e.g. `getStaticPage("gioi-thieu")`).
 *
 * W3a ships the schema and Studio editor only. No public route reads this type.
 * No query, helper, or type is added to src/lib/sanity in W3a — those land in W3b.
 *
 * Reuses:
 * - `slugifyValue` from ./shared (Vietnamese-aware slug helper used by
 *   content_article and money_page).
 * - `contentBodyBlock` from ./contentShared (canonical shared Portable Text block;
 *   same block used by content_article / content_hub / content_node).
 *
 * Slug uniqueness is Sanity's per-type default (no custom async validator in W3a).
 *
 * Spec: .claude/CMS/v2badminton-cms-w3a-static-page-schema-ticket.md
 */
export const staticPage = defineType({
  name: "static_page",
  title: "Trang nội dung tĩnh",
  type: "document",

  groups: [
    { name: "overview", title: "Tổng quan", default: true },
    { name: "content", title: "Nội dung" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    // ─── Overview ─────────────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Tiêu đề trang",
      type: "string",
      group: "overview",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (đoạn URL của trang)",
      description:
        'Khớp với đường dẫn route. VD: "gioi-thieu" cho /gioi-thieu/. KHÔNG đổi sau khi xuất bản.',
      type: "slug",
      group: "overview",
      options: {
        source: "title",
        slugify: slugifyValue,
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "breadcrumbLabel",
      title: "Nhãn breadcrumb (tùy chọn)",
      description: 'Nếu để trống, breadcrumb dùng "title".',
      type: "string",
      group: "overview",
    }),

    // ─── Content ──────────────────────────────────────────────────────────
    defineField({
      name: "eyebrow",
      title: "Eyebrow (tag nhỏ trên tiêu đề)",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "lead",
      title: "Mô tả mở đầu",
      description: "Đoạn văn ngắn hiển thị dưới tiêu đề.",
      type: "text",
      rows: 3,
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Thân bài",
      description: "Nội dung chính. Hỗ trợ H2/H3, danh sách, in đậm/nghiêng, link.",
      type: "array",
      group: "content",
      of: [contentBodyBlock],
    }),

    // ─── SEO ──────────────────────────────────────────────────────────────
    defineField({
      name: "seoTitle",
      title: "Tiêu đề SEO (<title>)",
      description: "Nếu để trống, dùng tiêu đề trang.",
      type: "string",
      group: "seo",
      components: { input: SerpPreviewInput },
    }),
    defineField({
      name: "seoDescription",
      title: "Mô tả SEO (meta description)",
      type: "text",
      rows: 2,
      group: "seo",
    }),
    defineField({
      name: "ogImage",
      title: "Ảnh chia sẻ (OG image — tùy chọn)",
      description:
        "Ghi đè ảnh mặc định trong Cài đặt website cho riêng trang này. Khuyến nghị 1200×630px.",
      type: "image",
      group: "seo",
      options: { hotspot: true },
    }),

    // No `status` / `isIndexed` / publish controls in W3a (per ticket D5).
    // A "Xuất bản" tab will be reintroduced in W3b when a real field exists.
  ],

  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare({ title, slug }: { title?: string; slug?: string }) {
      return {
        title: title ?? "(chưa đặt tiêu đề)",
        subtitle: slug ? `/${slug}/` : "(chưa đặt slug)",
      };
    },
  },
});
