import { defineField, defineType } from "sanity";
import { STUDENT_GROUP_OPTIONS } from "./shared";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  initialValue: {
    isActive: true,
  },
  fields: [
    defineField({
      name: "studentName",
      title: "Student Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "studentGroup",
      title: "Student Group",
      type: "string",
      options: {
        list: [...STUDENT_GROUP_OPTIONS],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contextLabel",
      title: "Context Label",
      type: "string",
      description: "VD: Phu huynh hoc vien lop he",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      rows: 5,
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
      title: "studentName",
      subtitle: "contextLabel",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle,
      };
    },
  },
});
