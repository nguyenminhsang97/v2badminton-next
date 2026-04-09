import { defineArrayMember, defineField, defineType } from "sanity";
import { FAQ_PAGE_OPTIONS } from "./shared";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  initialValue: {
    includeInSchema: true,
  },
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
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
      name: "pages",
      title: "Pages",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
          options: {
            list: [...FAQ_PAGE_OPTIONS],
          },
        }),
      ],
      options: {
        layout: "tags",
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "includeInSchema",
      title: "Include In Schema",
      type: "boolean",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],
  preview: {
    select: {
      title: "question",
      pages: "pages",
    },
    prepare({ title, pages }) {
      const pageList = Array.isArray(pages) ? pages.join(", ") : pages;
      return {
        title,
        subtitle: pageList || "No page tags",
      };
    },
  },
});
