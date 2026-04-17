import { defineField, defineType } from "sanity";
import { STUDENT_GROUP_OPTIONS } from "./shared";

export const testimonial = defineType({
  name: "testimonial",
  title: "Đánh giá học viên",
  type: "document",
  initialValue: {
    isActive: true,
    featured: false,
    rating: 5,
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
        'Dòng nhỏ phía trên quote. VD: "Phụ huynh & trẻ em". Để trống nếu muốn frontend tự suy ra.',
    }),
    defineField({
      name: "rating",
      title: "Số sao",
      type: "number",
      initialValue: 5,
      description: "Từ 0 đến 5. Để 0 nếu muốn ẩn dải sao.",
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: "contextLabel",
      title: "Ghi chú hiển thị",
      type: "string",
      description:
        "Dòng nhỏ hiển thị dưới tên học viên trên homepage. VD: Phụ huynh học viên lớp hè.",
    }),
    defineField({
      name: "shortQuote",
      title: "Quote ngắn",
      type: "text",
      rows: 3,
      description:
        "Phiên bản ngắn gọn cho homepage. Để trống nếu muốn frontend dùng content.",
    }),
    defineField({
      name: "content",
      title: "Nội dung đánh giá",
      type: "text",
      rows: 5,
      description:
        "Trích dẫn đầy đủ từ học viên hoặc phụ huynh. Hiển thị trên website.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Hiển thị trên homepage?",
      type: "boolean",
      initialValue: false,
      description:
        "Bật để testimonial này được ưu tiên hiển thị trong block homepage.",
    }),
    defineField({
      name: "homepageOrder",
      title: "Thứ tự trên homepage",
      type: "number",
      description:
        "Số nhỏ hơn hiển thị trước trong block testimonial homepage.",
      hidden: ({ document }) => !document?.featured,
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "order",
      title: "Thứ tự hiển thị",
      type: "number",
      description:
        "Số nhỏ hơn hiển thị trước trong danh sách đầy đủ và fallback homepage.",
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
