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
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
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
      options: {
        list: [...POST_STATUS_OPTIONS],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [...POST_CATEGORY_OPTIONS],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      hidden: ({ document }) => document?.status !== "published",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
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
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "relatedMoneyPage",
      title: "Related Money Page",
      description: "Internal link ve money page lien quan - quan trong cho SEO",
      type: "reference",
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
