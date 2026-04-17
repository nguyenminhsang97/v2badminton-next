import { defineField, defineType } from "sanity";

export const coach = defineType({
  name: "coach",
  title: "Huấn luyện viên",
  type: "document",
  initialValue: {
    isActive: true,
  },
  fields: [
    defineField({
      name: "name",
      title: "Họ tên HLV",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Ảnh HLV",
      type: "image",
      description:
        "Ảnh hiển thị trên thẻ HLV trang chủ. Kích thước khuyến nghị: vuông 400×400px.",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "photoAlt",
      title: "Mô tả ảnh (alt text)",
      type: "string",
      hidden: ({ document }) => !document?.photo,
    }),
    defineField({
      name: "teachingGroup",
      title: "Nhóm học viên phụ trách",
      type: "string",
      description: "VD: Lớp cơ bản người mới. Hiển thị dưới tên HLV trên trang chủ.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "roleBadge",
      title: "Badge vai trò",
      type: "string",
      description:
        'Dòng badge nhỏ trên ảnh. VD: "HLV phụ trách", "Trưởng bộ môn". Để trống nếu không cần hiển thị.',
    }),
    defineField({
      name: "credentialTags",
      title: "Credential tags",
      type: "array",
      description:
        "Tối đa 3 chip ngắn hiển thị dưới ảnh. VD: HLV cấp quốc gia, 8 năm kinh nghiệm.",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: "approach",
      title: "Phương pháp giảng dạy",
      type: "text",
      rows: 3,
      description: "1 câu mô tả cách dạy. Hiển thị trên thẻ HLV trang chủ.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "quote",
      title: "Quote hiển thị",
      type: "text",
      rows: 3,
      description:
        "Câu quote ngắn trong hộp highlight. Nếu để trống, frontend sẽ dùng phương pháp giảng dạy hiện tại.",
    }),
    defineField({
      name: "focusLine",
      title: "Focus line",
      type: "string",
      description:
        "1 dòng ngắn tóm tắt điểm mạnh của HLV. Hiển thị ở phần footer card nếu có.",
    }),
    defineField({
      name: "proofLabel",
      title: "Proof label",
      type: "string",
      description:
        'Dòng proof nhỏ cạnh stars. VD: "320+ học viên", "8 năm kinh nghiệm". Để trống nếu không cần.',
    }),
    defineField({
      name: "showStars",
      title: "Hiện stars?",
      type: "boolean",
      initialValue: true,
      description: "Bật để hiển thị dải sao ở footer card.",
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
      description: "Tắt để ẩn HLV này khỏi website mà không cần xóa.",
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
