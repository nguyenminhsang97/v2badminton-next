import { defineArrayMember, defineField, defineType } from "sanity";
import { slugifyValue } from "./shared";

const POST_CATEGORY_OPTIONS = [
  { title: "Tips", value: "tips" },
  { title: "How-to", value: "how-to" },
  { title: "Beginner", value: "beginner" },
  { title: "Campaign", value: "campaign" },
] as const;

const POST_STATUS_OPTIONS = [
  { title: "Draft", value: "draft" },
  { title: "Published", value: "published" },
] as const;

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  initialValue: {
    status: "draft",
  },
  groups: [
    { name: "overview", title: "Tổng quan", default: true },
    { name: "body", title: "Nội dung" },
    { name: "seo", title: "SEO" },
    { name: "references", title: "Liên kết" },
  ],
  orderings: [
    {
      title: "Ngày đăng — mới nhất (mặc định)",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Trạng thái + tiêu đề",
      name: "statusTitle",
      by: [
        { field: "status", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
    {
      title: "Tiêu đề A → Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "overview",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "overview",
      options: {
        source: "title",
        slugify: slugifyValue,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "overview",
      options: {
        list: [...POST_STATUS_OPTIONS],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "overview",
      options: {
        list: [...POST_CATEGORY_OPTIONS],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "overview",
      hidden: ({ document }) => document?.status !== "published",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      group: "overview",
      rows: 3,
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      group: "overview",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "body",
      of: [
        defineArrayMember({
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
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      group: "seo",
      rows: 3,
    }),
    defineField({
      name: "relatedMoneyPage",
      title: "Related Money Page",
      description: "Internal link ve money page lien quan - quan trong cho SEO",
      type: "reference",
      group: "references",
      to: [{ type: "money_page" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "status",
      media: "coverImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle,
        media,
      };
    },
  },
});
