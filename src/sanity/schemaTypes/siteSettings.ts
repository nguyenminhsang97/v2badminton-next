import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "site_settings",
  title: "Cài đặt website",
  type: "document",
  fields: [
    // ─── Contact & identity ─────────────────────────────────────────────────
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

    // ─── Navigation ─────────────────────────────────────────────────────────
    defineField({
      name: "nav",
      title: "Điều hướng",
      type: "object",
      description: "Tuỳ chỉnh nhãn nút CTA trong thanh điều hướng.",
      fields: [
        defineField({
          name: "ctaLabel",
          title: "Nhãn nút CTA",
          type: "string",
          description: 'Mặc định: "Đăng ký học thử". Hiển thị ở header desktop và mobile.',
        }),
      ],
    }),

    // ─── Footer ─────────────────────────────────────────────────────────────
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      description: "Văn bản thương hiệu và tiêu đề cột trong footer.",
      fields: [
        defineField({
          name: "brandSubtitle",
          title: "Phụ đề thương hiệu",
          type: "string",
          description: 'Hiển thị dưới tên thương hiệu. Mặc định: "Bình Thạnh · Thủ Đức".',
        }),
        defineField({
          name: "brandCopy",
          title: "Mô tả ngắn thương hiệu",
          type: "string",
          description: "Dòng mô tả ngắn bên dưới logo footer.",
        }),
        defineField({
          name: "col1Heading",
          title: "Tiêu đề cột 1",
          type: "string",
          description: 'Cột lộ trình nổi bật. Mặc định: "Lộ trình nổi bật".',
        }),
        defineField({
          name: "col2Heading",
          title: "Tiêu đề cột 2",
          type: "string",
          description: 'Cột khám phá. Mặc định: "Khám phá".',
        }),
        defineField({
          name: "col3Heading",
          title: "Tiêu đề cột 3",
          type: "string",
          description: 'Cột liên hệ. Mặc định: "Liên hệ nhanh".',
        }),
      ],
    }),

    // ─── CMS UI Strings ─────────────────────────────────────────────────────
    defineField({
      name: "cmsUiStrings",
      title: "Chuỗi giao diện CMS",
      type: "object",
      description: "Nhãn và tiêu đề dùng chung trên trang bài viết và lộ trình.",
      fields: [
        // Shared
        defineField({
          name: "quickAnswerLabel",
          title: "Nhãn tóm tắt nhanh",
          type: "string",
          description: 'Mặc định: "Tóm tắt nhanh". Hiển thị trên bài viết, hub và trang lộ trình.',
        }),
        defineField({
          name: "readArticleCta",
          title: "Nhãn CTA đọc bài viết",
          type: "string",
          description: 'Mặc định: "Đọc bài viết →".',
        }),
        defineField({
          name: "exploreNodeCta",
          title: "Nhãn CTA khám phá chuyên mục",
          type: "string",
          description: 'Mặc định: "Khám phá chuyên mục →".',
        }),
        // Hub portal
        defineField({
          name: "hubEyebrow",
          title: "Eyebrow trang hub",
          type: "string",
          description: 'Mặc định: "Trung tâm nội dung".',
        }),
        // Article FAQ section
        defineField({
          name: "faqEyebrow",
          title: "Eyebrow phần FAQ (bài viết)",
          type: "string",
          description: 'Mặc định: "Hỏi & đáp".',
        }),
        defineField({
          name: "faqTitle",
          title: "Tiêu đề phần FAQ (bài viết)",
          type: "string",
          description: 'Mặc định: "Câu hỏi thường gặp".',
        }),
        // Article aside (related money page)
        defineField({
          name: "articleAsideLabel",
          title: "Nhãn aside bài viết",
          type: "string",
          description: 'Mặc định: "Lớp học liên quan".',
        }),
        defineField({
          name: "articleAsideTitle",
          title: "Tiêu đề aside bài viết",
          type: "string",
          description: 'Mặc định: "Sẵn sàng học cùng huấn luyện viên?".',
        }),
        defineField({
          name: "articleAsideCta",
          title: "CTA aside bài viết",
          type: "string",
          description: 'Mặc định: "Xem lớp học phù hợp".',
        }),
        // Tech docs section (money page)
        defineField({
          name: "techDocEyebrow",
          title: "Eyebrow phần tài liệu kỹ thuật",
          type: "string",
          description: 'Mặc định: "Tài liệu kỹ thuật".',
        }),
        defineField({
          name: "techDocTitle",
          title: "Tiêu đề phần tài liệu kỹ thuật",
          type: "string",
          description: 'Mặc định: "Bài viết kỹ thuật liên quan".',
        }),
        defineField({
          name: "techDocCategory",
          title: "Nhãn thể loại bài viết kỹ thuật",
          type: "string",
          description: 'Mặc định: "Kỹ thuật cầu lông".',
        }),
        // Money page sections
        defineField({
          name: "moneyPricingEyebrow",
          title: "Eyebrow phần học phí (trang lộ trình)",
          type: "string",
          description: 'Mặc định: "Chi phí rõ ràng".',
        }),
        defineField({
          name: "moneyPricingTitle",
          title: "Tiêu đề phần học phí (trang lộ trình)",
          type: "string",
          description: 'Mặc định: "Chọn gói học phù hợp".',
        }),
        defineField({
          name: "moneyLocationsEyebrow",
          title: "Eyebrow phần địa điểm (trang lộ trình)",
          type: "string",
          description: 'Mặc định: "Địa điểm tập".',
        }),
        defineField({
          name: "moneyLocationsTitle",
          title: "Tiêu đề phần địa điểm (trang lộ trình)",
          type: "string",
          description: 'Mặc định: "Chọn sân gần bạn nhất".',
        }),
        defineField({
          name: "moneyFaqEyebrow",
          title: "Eyebrow phần FAQ (trang lộ trình)",
          type: "string",
          description: 'Mặc định: "Giải đáp trước khi đăng ký".',
        }),
        defineField({
          name: "moneyFaqTitle",
          title: "Tiêu đề phần FAQ (trang lộ trình)",
          type: "string",
          description: 'Mặc định: "Câu hỏi thường gặp".',
        }),
        defineField({
          name: "moneyRelatedPagesEyebrow",
          title: "Eyebrow phần lộ trình liên quan",
          type: "string",
          description: 'Mặc định: "Lộ trình liên quan".',
        }),
        defineField({
          name: "moneyRelatedPagesTitle",
          title: "Tiêu đề phần lộ trình liên quan",
          type: "string",
          description: 'Mặc định: "Lớp khác bạn có thể quan tâm".',
        }),
        defineField({
          name: "moneyCtaEyebrow",
          title: "Eyebrow phần CTA cuối trang lộ trình",
          type: "string",
          description: 'Mặc định: "Tư vấn nhanh".',
        }),
        defineField({
          name: "moneyCtaTitle",
          title: "Tiêu đề phần CTA cuối trang lộ trình",
          type: "string",
          description: 'Mặc định: "Nhận lộ trình phù hợp với nhu cầu của bạn".',
        }),
      ],
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
