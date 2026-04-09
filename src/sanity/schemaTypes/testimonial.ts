import { defineField, defineType } from "sanity";

const STUDENT_GROUP_OPTIONS = [
  { title: "Tre em", value: "tre_em" },
  { title: "Nguoi moi", value: "nguoi_moi" },
  { title: "Nguoi di lam", value: "nguoi_di_lam" },
  { title: "Doanh nghiep", value: "doanh_nghiep" },
] as const;

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
