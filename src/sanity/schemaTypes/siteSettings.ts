import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "site_settings",
  title: "Cài đặt website",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Tên website",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phoneDisplay",
      title: "Số điện thoại (hiển thị trên web)",
      type: "string",
      description: "Định dạng đẹp để hiển thị trực tiếp. VD: 0907 911 886",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phoneE164",
      title: "Số điện thoại (link gọi/Zalo tự động)",
      type: "string",
      description:
        "Định dạng quốc tế, bắt đầu bằng +84. VD: +84907911886. Dùng cho nút gọi điện và link Zalo tự động.",
      validation: (Rule) =>
        Rule.required().regex(/^\+[1-9]\d{7,14}$/, {
          name: "E.164 phone number",
        }),
    }),
    defineField({
      name: "zaloNumber",
      title: "Số Zalo",
      type: "string",
      description: "Số điện thoại Zalo, không có dấu cách. VD: 0907911886",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "facebookUrl",
      title: "Link Facebook",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "defaultOgImage",
      title: "Ảnh mặc định khi chia sẻ",
      type: "image",
      description:
        "Ảnh hiển thị khi chia sẻ link website lên Facebook, Zalo. Kích thước khuyến nghị: 1200×630px.",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Cài đặt website",
        subtitle: "Singleton document",
      };
    },
  },
});
