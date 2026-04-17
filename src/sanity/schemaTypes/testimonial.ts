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
      name: "avatar",
      title: "Ảnh đại diện",
      type: "image",
      description:
        "Ảnh nhỏ hiển thị ở footer testimonial. Nếu để trống, frontend sẽ fallback về initials.",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "avatarAlt",
      title: "Mô tả ảnh đại diện (alt text)",
      type: "string",
      hidden: ({ document }) => !document?.avatar,
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
      name: "kicker",
      title: "Kicker hiển thị",
      type: "string",
      description:
        'Dòng nhỏ phía trên quote. VD: "Phụ huynh & trẻ em". Nếu để trống, frontend sẽ tự suy ra từ nhóm học viên.',
    }),
    defineField({
      name: "rating",
      title: "Số sao",
      type: "number",
      initialValue: 5,
      description: "Từ 1 đến 5 sao. Để trống hoặc 0 để ẩn dải sao.",
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: "contextLabel",
      title: "Ghi chú hiển thị",
      type: "string",
      description:
        "Dòng nhỏ hiển thị dưới tên học viên trên trang chủ. VD: Phụ huynh học viên lớp hè",
    }),
    defineField({
      name: "shortQuote",
      title: "Quote ngắn",
      type: "text",
      rows: 3,
      description:
        "Phiên bản ngắn gọn cho homepage. Nếu để trống, frontend sẽ dùng nội dung đánh giá chính.",
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
