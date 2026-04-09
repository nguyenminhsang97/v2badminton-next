import { defineField, defineType } from "sanity";

export const coach = defineType({
  name: "coach",
  title: "Coach",
  type: "document",
  initialValue: {
    isActive: true,
  },
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "photoAlt",
      title: "Photo Alt",
      type: "string",
      hidden: ({ document }) => !document?.photo,
    }),
    defineField({
      name: "teachingGroup",
      title: "Teaching Group",
      type: "string",
      description: "VD: Lop co ban cho nguoi moi",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "approach",
      title: "Approach",
      type: "text",
      rows: 3,
      description: "1 cau mo ta phuong phap day",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "photo",
      subtitle: "teachingGroup",
    },
    prepare({ title, media, subtitle }) {
      return {
        title,
        media,
        subtitle,
      };
    },
  },
});
