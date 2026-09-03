import { defineArrayMember, defineField, defineType } from "sanity";
import { slugifyValue } from "./shared";
import {
  CONTENT_STATUS_OPTIONS,
  contentBodyBlock,
  defineFullPathField,
} from "./contentShared";
import { QuickAnswerInput } from "../components/QuickAnswerInput";
import { SerpPreviewInput } from "../components/SerpPreviewInput";

/**
 * court — public court directory entry for the /san-cau-long/ hub.
 *
 * Phase 2 locked spec: .claude/CMS/v2badminton-cms-phase-2-locked-spec.md
 *
 * Concept-separated from `location` (V2's own training venues). `court` is an
 * editorial review entry for any badminton court in HCMC. Schema.org type:
 * SportsActivityLocation (see PR3 buildSportsActivityLocationSchema).
 *
 * Publish-blocking validation at the document level enforces spec §8 required
 * fields — early-return when status !== "published" allows draft saves to pass.
 */

type PortableTextBlock = {
  _type: string;
  children?: Array<{ text?: string }>;
};

type CourtDoc = {
  status?: string;
  name?: string;
  shortName?: string;
  slug?: { current?: string };
  parentHub?: { _ref?: string };
  parentNode?: { _ref?: string };
  fullPath?: { current?: string };
  addressText?: string;
  mapsUrl?: string;
  coverImage?: { asset?: { _ref?: string }; alt?: string };
  reviewSummary?: PortableTextBlock[];
  lastReviewedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  quickAnswer?: string;
};

export const court = defineType({
  name: "court",
  title: "Sân cầu lông",
  type: "document",
  groups: [
    { name: "overview", title: "Tổng quan", default: true },
    { name: "structure", title: "URL & vị trí" },
    { name: "facts", title: "Thông tin sân" },
    { name: "review", title: "Đánh giá" },
    { name: "seo", title: "SEO & AEO" },
    { name: "publish", title: "Xuất bản" },
  ],
  initialValue: {
    status: "draft",
    isIndexed: true,
  },
  orderings: [
    {
      title: "Ngày cập nhật — mới nhất (mặc định)",
      name: "updatedDesc",
      by: [{ field: "_updatedAt", direction: "desc" }],
    },
    {
      title: "Trạng thái + tên",
      name: "statusName",
      by: [
        { field: "status", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
    {
      title: "Tên A → Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  // Document-level publish-blocking validation (spec §8).
  // Early-return when not publishing so draft saves are always free.
  validation: (Rule) =>
    Rule.custom((doc) => {
      const d = doc as CourtDoc | undefined;
      if (!d || d.status !== "published") return true;

      const errors: string[] = [];

      if (!d.name?.trim())
        errors.push("Tên sân (tab Tổng quan) là bắt buộc khi đăng.");
      if (!d.shortName?.trim())
        errors.push("Tên ngắn (tab Tổng quan) là bắt buộc khi đăng.");
      if (!d.slug?.current?.trim())
        errors.push("Slug URL (tab URL & vị trí) là bắt buộc khi đăng.");
      if (!d.parentHub?._ref)
        errors.push("Thuộc hub (tab URL & vị trí) là bắt buộc khi đăng.");
      if (!d.parentNode?._ref)
        errors.push("Thuộc khu vực (tab URL & vị trí) là bắt buộc khi đăng.");
      if (!d.fullPath?.current?.trim())
        errors.push(
          "Đường dẫn đầy đủ (tab URL & vị trí) chưa được tạo — bấm Generate.",
        );
      if (!d.addressText?.trim())
        errors.push("Địa chỉ (tab Thông tin sân) là bắt buộc khi đăng.");
      if (!d.mapsUrl?.trim())
        errors.push("Link Google Maps (tab Thông tin sân) là bắt buộc khi đăng.");

      if (!d.coverImage?.asset?._ref) {
        errors.push("Ảnh bìa (tab Tổng quan) là bắt buộc khi đăng.");
      } else if (!d.coverImage?.alt?.trim()) {
        errors.push(
          "Mô tả ảnh bìa (alt text, tab Tổng quan) là bắt buộc khi đăng.",
        );
      }

      if (!d.reviewSummary?.length) {
        errors.push(
          "Nhận xét tổng quan (tab Đánh giá) là bắt buộc khi đăng.",
        );
      } else {
        const plaintext = d.reviewSummary
          .filter((block) => block._type === "block")
          .flatMap((block) => block.children ?? [])
          .map((span) => span.text ?? "")
          .join("")
          .trim();
        if (plaintext.length < 50) {
          errors.push(
            "Nhận xét tổng quan cần ít nhất 50 ký tự (tab Đánh giá).",
          );
        }
      }

      if (!d.lastReviewedAt)
        errors.push(
          "Ngày khảo sát gần nhất (tab Đánh giá) là bắt buộc khi đăng.",
        );
      if (!d.seoTitle?.trim())
        errors.push("Tiêu đề SEO (tab SEO & AEO) là bắt buộc khi đăng.");
      if (!d.seoDescription?.trim())
        errors.push("Mô tả SEO (tab SEO & AEO) là bắt buộc khi đăng.");
      if (!d.quickAnswer?.trim())
        errors.push(
          "Câu trả lời nhanh (tab SEO & AEO) là bắt buộc khi đăng.",
        );

      if (errors.length === 0) return true;
      return errors.join("\n");
    }),
  fields: [
    // ── 1C: Identity ───────────────────────────────────────────────────────
    defineField({
      name: "name",
      title: "Tên sân",
      type: "string",
      group: "overview",
      description:
        "Tên đầy đủ của sân cầu lông. VD: Sân cầu lông Green Nguyễn Xí.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortName",
      title: "Tên ngắn",
      type: "string",
      group: "overview",
      description:
        "Tên rút gọn dùng cho slug URL và thẻ hiển thị. VD: Green Nguyễn Xí.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (đoạn URL của sân)",
      type: "slug",
      group: "structure",
      description:
        "Tự động tạo từ tên ngắn. Không sửa tay sau khi đã publish.",
      options: {
        source: "shortName",
        slugify: slugifyValue,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "parentHub",
      title: "Thuộc hub",
      type: "reference",
      group: "structure",
      to: [{ type: "content_hub" }],
      description: "Chọn hub san-cau-long. Bắt buộc.",
      options: {
        filter: 'isIndexed == true && slug.current == "san-cau-long"',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "parentNode",
      title: "Thuộc khu vực",
      type: "reference",
      group: "structure",
      to: [{ type: "content_node" }],
      description:
        "Chọn node khu vực (quận) trong hub san-cau-long. Bắt buộc.",
      options: {
        filter: "parentHub._ref == ^.parentHub._ref && isIndexed == true",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineFullPathField({ warnDepth: true, group: "structure" }),

    // ── 1D: Factual fields ─────────────────────────────────────────────────
    defineField({
      name: "addressText",
      title: "Địa chỉ",
      type: "text",
      group: "facts",
      rows: 3,
      description:
        "Địa chỉ đầy đủ của sân. VD: 123 Nguyễn Xí, Phường 26, Bình Thạnh, TP.HCM.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mapsUrl",
      title: "Link Google Maps",
      type: "url",
      group: "facts",
      description:
        "Link chỉ đường Google Maps. Bấm 'Chia sẻ' → 'Sao chép link' trong Google Maps.",
      validation: (Rule) =>
        Rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "geoLat",
      title: "Vĩ độ (Latitude)",
      type: "number",
      group: "facts",
      description:
        "Lấy từ Google Maps: chuột phải vào địa điểm → số đầu tiên.",
      validation: (Rule) => Rule.min(-90).max(90),
    }),
    defineField({
      name: "geoLng",
      title: "Kinh độ (Longitude)",
      type: "number",
      group: "facts",
      description:
        "Lấy từ Google Maps: chuột phải vào địa điểm → số thứ hai.",
      validation: (Rule) => Rule.min(-180).max(180),
    }),
    defineField({
      name: "courtCount",
      title: "Số sân",
      type: "number",
      group: "facts",
      description: "Tổng số sân cầu lông tại địa điểm.",
      validation: (Rule) => Rule.integer().min(1),
    }),
    defineField({
      name: "surfaceType",
      title: "Loại mặt sân",
      type: "string",
      group: "facts",
      options: {
        list: [
          { title: "Gỗ", value: "wood" },
          { title: "Tổng hợp (synthetic)", value: "synthetic" },
          { title: "Acrylic", value: "acrylic" },
          { title: "Bê tông", value: "concrete" },
          { title: "Khác", value: "other" },
        ],
      },
    }),
    defineField({
      name: "lighting",
      title: "Ánh sáng",
      type: "string",
      group: "facts",
      options: {
        list: [
          { title: "Rất tốt", value: "excellent" },
          { title: "Tốt", value: "good" },
          { title: "Đủ", value: "adequate" },
          { title: "Kém", value: "poor" },
        ],
      },
    }),
    defineField({
      name: "parking",
      title: "Bãi đỗ xe",
      type: "string",
      group: "facts",
      options: {
        list: [
          { title: "Miễn phí", value: "free" },
          { title: "Có phí", value: "paid" },
          { title: "Đỗ đường phố", value: "street_only" },
          { title: "Không có", value: "none" },
        ],
      },
    }),
    defineField({
      name: "priceRangeText",
      title: "Giá thuê sân",
      type: "string",
      group: "facts",
      description: "Mô tả giá thuê. VD: 80.000–120.000 VND/giờ.",
    }),
    defineField({
      name: "openingHours",
      title: "Giờ mở cửa",
      type: "object",
      group: "facts",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "monday",
          title: "Thứ 2",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: [
            defineField({
              name: "open",
              title: "Mở cửa",
              type: "string",
              description: "VD: 06:00",
            }),
            defineField({
              name: "close",
              title: "Đóng cửa",
              type: "string",
              description: "VD: 22:00",
            }),
          ],
        }),
        defineField({
          name: "tuesday",
          title: "Thứ 3",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: [
            defineField({
              name: "open",
              title: "Mở cửa",
              type: "string",
              description: "VD: 06:00",
            }),
            defineField({
              name: "close",
              title: "Đóng cửa",
              type: "string",
              description: "VD: 22:00",
            }),
          ],
        }),
        defineField({
          name: "wednesday",
          title: "Thứ 4",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: [
            defineField({
              name: "open",
              title: "Mở cửa",
              type: "string",
              description: "VD: 06:00",
            }),
            defineField({
              name: "close",
              title: "Đóng cửa",
              type: "string",
              description: "VD: 22:00",
            }),
          ],
        }),
        defineField({
          name: "thursday",
          title: "Thứ 5",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: [
            defineField({
              name: "open",
              title: "Mở cửa",
              type: "string",
              description: "VD: 06:00",
            }),
            defineField({
              name: "close",
              title: "Đóng cửa",
              type: "string",
              description: "VD: 22:00",
            }),
          ],
        }),
        defineField({
          name: "friday",
          title: "Thứ 6",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: [
            defineField({
              name: "open",
              title: "Mở cửa",
              type: "string",
              description: "VD: 06:00",
            }),
            defineField({
              name: "close",
              title: "Đóng cửa",
              type: "string",
              description: "VD: 22:00",
            }),
          ],
        }),
        defineField({
          name: "saturday",
          title: "Thứ 7",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: [
            defineField({
              name: "open",
              title: "Mở cửa",
              type: "string",
              description: "VD: 06:00",
            }),
            defineField({
              name: "close",
              title: "Đóng cửa",
              type: "string",
              description: "VD: 22:00",
            }),
          ],
        }),
        defineField({
          name: "sunday",
          title: "Chủ nhật",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: [
            defineField({
              name: "open",
              title: "Mở cửa",
              type: "string",
              description: "VD: 06:00",
            }),
            defineField({
              name: "close",
              title: "Đóng cửa",
              type: "string",
              description: "VD: 22:00",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "contactInfo",
      title: "Thông tin liên hệ",
      type: "object",
      group: "facts",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "phone",
          title: "Số điện thoại",
          type: "string",
          description: "VD: 0901 234 567",
        }),
        defineField({
          name: "facebookUrl",
          title: "Facebook",
          type: "url",
          validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
        }),
        defineField({
          name: "bookingUrl",
          title: "Link đặt sân",
          type: "url",
          description: "Link đặt sân trực tuyến (nếu có).",
          validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
        }),
      ],
    }),

    // ── 1E: Editorial fields ───────────────────────────────────────────────
    defineField({
      name: "reviewSummary",
      title: "Nhận xét tổng quan",
      type: "array",
      group: "review",
      description:
        "Nhận xét của V2 về sân này. Bắt buộc khi đăng — ít nhất 50 ký tự.",
      of: [contentBodyBlock],
    }),
    defineField({
      name: "lastReviewedAt",
      title: "Ngày khảo sát gần nhất",
      type: "datetime",
      group: "review",
      description:
        "Ngày V2 khảo sát hoặc liên hệ xác nhận thông tin sân. Bắt buộc khi đăng.",
    }),
    defineField({
      name: "pros",
      title: "Ưu điểm",
      type: "array",
      group: "review",
      description: "Tối đa 5 điểm mạnh của sân.",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.max(5),
    }),
    defineField({
      name: "cons",
      title: "Nhược điểm",
      type: "array",
      group: "review",
      description: "Tối đa 5 điểm yếu của sân.",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.max(5),
    }),
    defineField({
      name: "bestFor",
      title: "Phù hợp nhất với",
      type: "array",
      group: "review",
      description: "Chọn đối tượng phù hợp với sân này.",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Người mới", value: "beginner" },
          { title: "Trung cấp", value: "intermediate" },
          { title: "Nâng cao", value: "advanced" },
          { title: "Thiếu nhi", value: "kids" },
          { title: "Chơi tối", value: "evening_play" },
          { title: "Chơi sáng", value: "morning_play" },
          { title: "Tập luyện thi đấu", value: "tournament_practice" },
        ],
      },
    }),
    defineField({
      name: "v2PartnerNote",
      title: "Ghi chú đối tác V2",
      type: "string",
      group: "review",
      description:
        "Bắt buộc nếu V2 dạy/hợp tác/tổ chức lớp tại sân này. VD: 'V2 Badminton tổ chức lớp học tại sân này.' Bỏ trống nếu sân hoàn toàn độc lập.",
    }),

    // ── 1F: Media ──────────────────────────────────────────────────────────
    defineField({
      name: "coverImage",
      title: "Ảnh bìa",
      type: "image",
      group: "overview",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Mô tả ảnh (alt text)",
          type: "string",
          description: "Bắt buộc cho SEO và trợ năng. Mô tả nội dung ảnh.",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Thư viện ảnh",
      type: "array",
      group: "review",
      description: "Tối đa 8 ảnh bổ sung. Mỗi ảnh cần có mô tả (alt text).",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Mô tả ảnh (alt text)",
              type: "string",
              description: "Bắt buộc cho SEO và trợ năng.",
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.max(8),
    }),

    // ── 1G: SEO / AEO ──────────────────────────────────────────────────────
    defineField({
      name: "seoTitle",
      title: "Tiêu đề SEO",
      type: "string",
      group: "seo",
      description: "Tối đa ~60 ký tự.",
      components: { input: SerpPreviewInput },
    }),
    defineField({
      name: "seoDescription",
      title: "Mô tả SEO",
      type: "text",
      group: "seo",
      rows: 3,
      description: "Tối đa 160 ký tự.",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "quickAnswer",
      title: "Câu trả lời nhanh (AEO)",
      type: "text",
      group: "seo",
      rows: 3,
      description:
        "Câu trả lời ngắn cho 'Sân này có tốt không? Giá bao nhiêu?'",
      components: { input: QuickAnswerInput },
    }),
    defineField({
      name: "relatedFaqs",
      title: "Câu hỏi thường gặp liên quan",
      type: "array",
      group: "seo",
      description:
        "Hiển thị ở cuối trang. Dùng cho JSON-LD FAQPage. Tuỳ chọn.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "faq" }] })],
    }),
    defineField({
      name: "relatedMoneyPage",
      title: "Trang dịch vụ liên quan (money page)",
      type: "reference",
      group: "seo",
      to: [{ type: "money_page" }],
      description:
        "Liên kết tới trang đăng ký lớp học liên quan. Quan trọng cho chuyển đổi.",
    }),

    // ── 1H: Publish controls ───────────────────────────────────────────────
    defineField({
      name: "status",
      title: "Trạng thái",
      type: "string",
      group: "publish",
      options: {
        list: [...CONTENT_STATUS_OPTIONS],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isIndexed",
      title: "Cho phép Google lập chỉ mục?",
      type: "boolean",
      group: "publish",
      description: "Tắt để ẩn sân này khỏi Google và sitemap.",
    }),
    defineField({
      name: "publishedAt",
      title: "Ngày đăng",
      type: "datetime",
      group: "publish",
      hidden: ({ document }) => document?.status !== "published",
    }),
  ],
  // ── 1J: Preview config ──────────────────────────────────────────────────
  preview: {
    select: {
      title: "name",
      status: "status",
      subtitle: "fullPath.current",
      media: "coverImage",
    },
    prepare({ title, status, subtitle, media }) {
      const statusLabel = status === "published" ? "Đã đăng" : "Nháp";
      return {
        title,
        subtitle: `[${statusLabel}] ${subtitle ?? "Chưa tạo URL"}`,
        media,
      };
    },
  },
});
