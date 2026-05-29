import { defineField, defineType } from "sanity";

export const coach = defineType({
  name: "coach",
  title: "Huấn luyện viên",
  type: "document",
  initialValue: {
    isActive: true,
    featured: false,
    showStars: true,
  },
  groups: [
    { name: "overview", title: "Tổng quan", default: true },
    { name: "bio", title: "Giới thiệu" },
    { name: "display", title: "Hiển thị" },
  ],
  orderings: [
    {
      title: "Nổi bật, thứ tự (mặc định)",
      name: "featuredOrder",
      by: [
        { field: "featured", direction: "desc" },
        { field: "order", direction: "asc" },
      ],
    },
    {
      title: "Đang dạy trước",
      name: "activeFirst",
      by: [
        { field: "isActive", direction: "desc" },
        { field: "order", direction: "asc" },
      ],
    },
    {
      title: "Tên A → Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Họ tên HLV",
      type: "string",
      group: "overview",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Ảnh HLV",
      type: "image",
      group: "overview",
      description:
        "Ảnh hiển thị trên thẻ HLV trang chủ. Kích thước khuyến nghị: dọc 4:5 hoặc vuông chất lượng cao.",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "photoAlt",
      title: "Mô tả ảnh (alt text)",
      type: "string",
      group: "overview",
      hidden: ({ document }) => !document?.photo,
    }),
    defineField({
      name: "teachingGroup",
      title: "Nhóm học viên phụ trách",
      type: "string",
      group: "overview",
      description:
        "VD: Lớp cơ bản người mới, lớp thiếu nhi, lớp tối người đi làm.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "roleBadge",
      title: "Badge vai trò",
      type: "string",
      group: "overview",
      description:
        'Dòng badge nhỏ trên ảnh. VD: "Trưởng bộ môn", "HLV phụ trách". Để trống nếu không cần.',
    }),
    defineField({
      name: "credentialTags",
      title: "Credential tags",
      type: "array",
      group: "overview",
      description:
        "Tối đa 3 chip ngắn hiển thị dưới ảnh. VD: HLV cấp quốc gia, 8 năm kinh nghiệm.",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: "approach",
      title: "Phương pháp giảng dạy",
      type: "text",
      group: "bio",
      rows: 3,
      description:
        "1 câu mô tả cách dạy. Được dùng làm fallback nếu chưa có quote riêng.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "quote",
      title: "Quote hiển thị",
      type: "text",
      group: "bio",
      rows: 3,
      description:
        "Câu quote ngắn trong hộp highlight. Để trống nếu muốn frontend dùng approach làm fallback.",
    }),
    defineField({
      name: "focusLine",
      title: "Focus line",
      type: "string",
      group: "bio",
      description:
        "1 dòng ngắn tóm tắt điểm mạnh của HLV. Hiển thị ở footer card nếu có.",
    }),
    defineField({
      name: "proofLabel",
      title: "Proof label",
      type: "string",
      group: "bio",
      description:
        'Dòng proof nhỏ cạnh stars. VD: "320+ học viên", "12 năm kinh nghiệm".',
    }),
    defineField({
      name: "showStars",
      title: "Hiện stars?",
      type: "boolean",
      group: "display",
      initialValue: true,
      description: "Bật để hiển thị dải sao ở footer card.",
    }),
    defineField({
      name: "featured",
      title: "Hiển thị trên homepage?",
      type: "boolean",
      group: "display",
      initialValue: false,
      description:
        "Bật để HLV này được ưu tiên hiển thị trong block đội ngũ trên trang chủ.",
    }),
    defineField({
      name: "homepageOrder",
      title: "Thứ tự trên homepage",
      type: "number",
      group: "display",
      description:
        "Số nhỏ hơn hiển thị trước trong block đội ngũ trang chủ.",
      hidden: ({ document }) => !document?.featured,
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "order",
      title: "Thứ tự hiển thị",
      type: "number",
      group: "display",
      description:
        "Số nhỏ hơn hiển thị trước trong danh sách đầy đủ và fallback homepage.",
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "isActive",
      title: "Hiển thị trên web?",
      type: "boolean",
      group: "display",
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
