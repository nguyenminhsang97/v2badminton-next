import { defineField, defineType } from "sanity";
import { STUDENT_GROUP_OPTIONS } from "./shared";

export const testimonial = defineType({
  name: "testimonial",
  title: "Đánh giá học viên",
  type: "document",
  initialValue: {
    isActive: true,
  },
  fields: [
    defineField({
      name: "studentName",
      title: "Tên học viên",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "studentGroup",
      title: "Nhóm học viên",
      type: "string",
      options: {
        list: [...STUDENT_GROUP_OPTIONS],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contextLabel",
      title: "Ghi chú hiển thị",
      type: "string",
      description:
        "Dòng nhỏ hiển thị dưới tên học viên trên trang chủ. VD: Phụ huynh học viên lớp hè",
    }),
    defineField({
      name: "content",
      title: "Nội dung đánh giá",
      type: "text",
      rows: 5,
      description: "Trích dẫn ngắn từ học viên hoặc phụ huynh. Hiển thị trên trang chủ.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Thứ tự hiển thị",
      type: "number",
      description: "Số nhỏ hơn hiển thị trước trên trang chủ.",
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "isActive",
      title: "Hiển thị trên web?",
      type: "boolean",
      description: "Tắt để ẩn đánh giá này khỏi website mà không cần xóa.",
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
