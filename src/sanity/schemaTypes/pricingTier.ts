import { defineArrayMember, defineField, defineType } from "sanity";
import {
  BILLING_MODEL_OPTIONS,
  CTA_ACTION_OPTIONS,
  PRICING_KIND_LABEL_BY_VALUE,
  PRICING_KIND_OPTIONS,
  slugifyValue,
} from "./shared";

function validateBillingModel(kind: unknown, value: unknown) {
  if (typeof value !== "string") {
    return "Hình thức tính phí là bắt buộc.";
  }

  if (kind === "group" && value !== "monthly_package") {
    return "Gói nhóm phải dùng hình thức Gói tháng.";
  }

  if (kind === "private" && value !== "per_hour") {
    return "Gói kèm riêng phải dùng hình thức Theo giờ.";
  }

  if (kind === "enterprise" && value !== "quote") {
    return "Gói doanh nghiệp phải dùng hình thức Báo giá.";
  }

  return true;
}

export const pricingTier = defineType({
  name: "pricing_tier",
  title: "Gói học phí",
  type: "document",
  initialValue: {
    isActive: true,
  },
  fields: [
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: {
        source: "name",
        slugify: slugifyValue,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Tên gói",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortLabel",
      title: "Nhãn ngắn",
      type: "string",
      description: "Nhãn rút gọn hiển thị trên thẻ học phí. VD: Lớp nhóm, Kèm 1:1",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Loại gói",
      type: "string",
      description:
        "Nhóm: lớp 2–6 người. Kèm riêng: 1:1. Doanh nghiệp: báo giá theo yêu cầu.",
      options: {
        list: [...PRICING_KIND_OPTIONS],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "billingModel",
      title: "Hình thức tính phí",
      type: "string",
      options: {
        list: [...BILLING_MODEL_OPTIONS],
      },
      validation: (Rule) =>
        Rule.required().custom((value, context) =>
          validateBillingModel(context.document?.kind, value),
        ),
    }),
    defineField({
      name: "description",
      title: "Mô tả gói",
      type: "text",
      description:
        "Mô tả ngắn hiển thị trên thẻ học phí trang chủ và các trang nội dung.",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "groupSize",
      title: "Sĩ số nhóm",
      type: "string",
      description: "VD: 2–4 người. Hiển thị trên thẻ gói nhóm.",
      hidden: ({ document }) => document?.kind !== "group",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.kind === "group" && typeof value !== "string") {
            return "Sĩ số nhóm là bắt buộc cho gói nhóm.";
          }
          return true;
        }),
    }),
    defineField({
      name: "pricePerMonth",
      title: "Học phí/tháng (số)",
      type: "number",
      description:
        "Nhập số nguyên, không có dấu chấm/phẩy. VD: 800000. Dùng để tính khoảng giá hiển thị.",
      hidden: ({ document }) => document?.kind !== "group",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.kind === "group" && typeof value !== "number") {
            return "Học phí/tháng là bắt buộc cho gói nhóm.";
          }
          return true;
        }),
    }),
    defineField({
      name: "pricePerHour",
      title: "Học phí/giờ (số)",
      type: "number",
      description:
        "Nhập số nguyên. VD: 250000. Dùng để tính khoảng giá hiển thị.",
      hidden: ({ document }) => document?.kind !== "private",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.kind === "private" && typeof value !== "number") {
            return "Học phí/giờ là bắt buộc cho gói kèm riêng.";
          }
          return true;
        }),
    }),
    defineField({
      name: "displayPrice",
      title: "Giá hiển thị",
      type: "string",
      description:
        "Chuỗi hiển thị trực tiếp trên thẻ học phí trang chủ và các trang nội dung. VD: 800.000đ/tháng",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sessionsPerWeek",
      title: "Số buổi/tuần",
      type: "number",
      hidden: ({ document }) => document?.kind !== "group",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.kind === "group" && typeof value !== "number") {
            return "Số buổi/tuần là bắt buộc cho gói nhóm.";
          }
          return true;
        }).integer().min(1),
    }),
    defineField({
      name: "sessionsPerMonth",
      title: "Số buổi/tháng",
      type: "number",
      hidden: ({ document }) => document?.kind !== "group",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.kind === "group" && typeof value !== "number") {
            return "Số buổi/tháng là bắt buộc cho gói nhóm.";
          }
          return true;
        }).integer().min(1),
    }),
    defineField({
      name: "features",
      title: "Quyền lợi / Tính năng",
      type: "array",
      description:
        "Danh sách quyền lợi hiển thị trên thẻ học phí. VD: Sân chuẩn, HLV 1:1, Lịch linh hoạt",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "ctaLabel",
      title: "Nội dung nút đăng ký",
      type: "string",
      description: "VD: Đăng ký học thử, Nhận báo giá",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaAction",
      title: "Hành động nút đăng ký",
      type: "string",
      description:
        "Đăng ký học thử: mở form liên hệ. Nhận báo giá: chuyển sang chế độ doanh nghiệp.",
      options: {
        list: [...CTA_ACTION_OPTIONS],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Thứ tự hiển thị",
      type: "number",
      description: "Số nhỏ hơn hiển thị trước trên trang chủ và các trang nội dung.",
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "isActive",
      title: "Hiển thị trên web?",
      type: "boolean",
      description: "Tắt để ẩn gói này khỏi website mà không cần xóa.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      kind: "kind",
      displayPrice: "displayPrice",
    },
    prepare({ title, kind, displayPrice }) {
      const kindLabel = PRICING_KIND_LABEL_BY_VALUE[kind] ?? kind ?? "Chưa chọn loại";
      return {
        title,
        subtitle: [kindLabel, displayPrice].filter(Boolean).join(" - "),
      };
    },
  },
});
