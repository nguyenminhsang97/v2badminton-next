import { defineArrayMember, defineField, defineType } from "sanity";
import { FAQ_PAGE_OPTIONS } from "./shared";

export const faq = defineType({
  name: "faq",
  title: "Câu hỏi thường gặp",
  type: "document",
  initialValue: {
    includeInSchema: true,
  },
  fields: [
    defineField({
      name: "question",
      title: "Câu hỏi",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Trả lời",
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
      title: "Hiển thị ở trang",
      type: "array",
      description:
        "Chọn trang để câu hỏi này xuất hiện. Một câu hỏi có thể xuất hiện ở nhiều trang.",
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
      title: "Hiển thị trong Google FAQ?",
      type: "boolean",
      description:
        "Bật để câu hỏi này xuất hiện trong kết quả tìm kiếm Google dạng FAQ (rich result).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Thứ tự hiển thị",
      type: "number",
      description: "Số nhỏ hơn hiển thị trước. VD: 1 hiển thị trước 2.",
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
