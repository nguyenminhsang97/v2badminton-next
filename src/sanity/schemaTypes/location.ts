import { defineField, defineType } from "sanity";
import { DISTRICT_LABEL_BY_VALUE, DISTRICT_OPTIONS, slugifyValue } from "./shared";

export const location = defineType({
  name: "location",
  title: "Địa điểm / Sân tập",
  type: "document",
  initialValue: {
    isActive: true,
  },
  groups: [
    { name: "identity", title: "Thông tin sân", default: true },
    { name: "address", title: "Địa chỉ & bản đồ" },
    { name: "media", title: "Ảnh" },
    { name: "display", title: "Hiển thị" },
  ],
  orderings: [
    {
      title: "Quận, thứ tự (mặc định)",
      name: "districtOrder",
      by: [
        { field: "district", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
    {
      title: "Đang hiển thị trước",
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
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "identity",
      description: "Tự động tạo từ tên sân. Không thay đổi sau khi đã publish.",
      options: {
        source: "name",
        slugify: slugifyValue,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Tên sân",
      type: "string",
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortName",
      title: "Tên ngắn",
      type: "string",
      group: "identity",
      description: "Tên rút gọn hiển thị trên bảng lịch học trang chủ. VD: Green, Huệ Thiên",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "district",
      title: "Quận / Khu vực",
      type: "string",
      group: "identity",
      options: {
        list: [...DISTRICT_OPTIONS],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "addressText",
      title: "Địa chỉ",
      type: "text",
      group: "address",
      description:
        "Địa chỉ đầy đủ hiển thị trên thẻ sân tập trang chủ và các trang địa phương.",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mapsUrl",
      title: "Link Google Maps",
      type: "url",
      group: "address",
      description:
        "Link chỉ đường trên Google Maps. Bấm 'Chia sẻ' → 'Sao chép link' trong Google Maps.",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "image",
      title: "Ảnh sân",
      type: "image",
      group: "media",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "imageAlt",
      title: "Mô tả ảnh (alt text)",
      type: "string",
      group: "media",
      description: "Mô tả ngắn cho ảnh, dùng cho SEO và accessibility.",
      hidden: ({ document }) => !document?.image,
    }),
    defineField({
      name: "geoLat",
      title: "Vĩ độ (Latitude)",
      type: "number",
      group: "address",
      description: "Lấy từ Google Maps: chuột phải vào địa điểm → số đầu tiên.",
      validation: (Rule) => Rule.min(-90).max(90),
    }),
    defineField({
      name: "geoLng",
      title: "Kinh độ (Longitude)",
      type: "number",
      group: "address",
      description: "Lấy từ Google Maps: chuột phải vào địa điểm → số thứ hai.",
      validation: (Rule) => Rule.min(-180).max(180),
    }),
    defineField({
      name: "order",
      title: "Thứ tự hiển thị",
      type: "number",
      group: "display",
      description: "Số nhỏ hơn hiển thị trước trên trang chủ và trang địa phương.",
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "isActive",
      title: "Hiển thị trên web?",
      type: "boolean",
      group: "display",
      description: "Tắt để ẩn sân này khỏi website mà không cần xóa.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      district: "district",
      media: "image",
    },
    prepare({ title, district, media }) {
      return {
        title,
        subtitle: DISTRICT_LABEL_BY_VALUE[district] ?? district ?? "Chưa chọn khu vực",
        media,
      };
    },
  },
});
