import { defineField, defineType } from "sanity";
import { AUDIENCE_OPTIONS, slugifyValue } from "./shared";

const CAMPAIGN_STATUS_OPTIONS = [
  { title: "Nháp", value: "draft" },
  { title: "Đang chạy", value: "active" },
  { title: "Đã kết thúc", value: "ended" },
] as const;

const STATUS_LABEL: Record<string, string> = {
  draft: "Nháp",
  active: "Đang chạy",
  ended: "Đã kết thúc",
};

export const campaign = defineType({
  name: "campaign",
  title: "Chiến dịch",
  type: "document",
  initialValue: {
    status: "draft",
  },
  fields: [
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      description: "Tự động tạo từ tên chiến dịch.",
      options: {
        source: "name",
        slugify: slugifyValue,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Tên chiến dịch",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Trạng thái",
      type: "string",
      description: 'Chỉ chiến dịch "Đang chạy" mới hiển thị trên homepage.',
      options: {
        list: [...CAMPAIGN_STATUS_OPTIONS],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "Ngày bắt đầu",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "Ngày kết thúc",
      type: "date",
      validation: (Rule) =>
        Rule.required().custom((endDate, context) => {
          const startDate = context.document?.startDate as string | undefined;
          if (typeof endDate === "string" && startDate && endDate <= startDate) {
            return "Ngày kết thúc phải sau ngày bắt đầu.";
          }
          return true;
        }),
    }),
    defineField({
      name: "badgeText",
      title: "Dòng badge trên hero",
      type: "string",
      description:
        "VD: Lớp hè đang mở đăng ký. Hiển thị dạng tag nhỏ trên hero homepage.",
    }),
    defineField({
      name: "heroTitle",
      title: "Tiêu đề hero (thay thế)",
      type: "string",
      description:
        "Nếu có: thay thế tiêu đề chính trên hero homepage trong suốt chiến dịch.",
    }),
    defineField({
      name: "heroDescription",
      title: "Mô tả hero (thay thế)",
      type: "text",
      rows: 3,
      description:
        "Nếu có: thay thế đoạn mô tả dưới tiêu đề hero homepage.",
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "Nút CTA chính — nội dung",
      type: "string",
      description:
        'VD: Đăng ký lớp hè →. Thay thế nút "Đăng ký học thử" trên hero.',
    }),
    defineField({
      name: "primaryCtaUrl",
      title: "Nút CTA chính — link",
      type: "string",
      description:
        "Cho phép internal path như /lop-he-cau-long-tphcm/ hoặc anchor #lien-he.",
    }),
    defineField({
      name: "secondaryCtaLabel",
      title: "Nút CTA phụ — nội dung",
      type: "string",
      description: "VD: Xem lịch lớp hè",
    }),
    defineField({
      name: "secondaryCtaUrl",
      title: "Nút CTA phụ — link",
      type: "string",
      description: "Cho phép internal path như /lop-he-cau-long-tphcm/ hoặc anchor #lien-he.",
    }),
    defineField({
      name: "featuredAudience",
      title: "Đối tượng ưu tiên",
      type: "string",
      description:
        "Dùng để tùy chỉnh trải nghiệm form theo đối tượng (nếu có).",
      options: {
        list: [...AUDIENCE_OPTIONS],
      },
    }),
    defineField({
      name: "linkedPage",
      title: "Trang nội dung liên kết",
      type: "reference",
      description:
        "Trang money page gắn với chiến dịch này. VD: trang Lớp hè.",
      to: [{ type: "money_page" }],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "status",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: STATUS_LABEL[subtitle] ?? subtitle,
      };
    },
  },
});
