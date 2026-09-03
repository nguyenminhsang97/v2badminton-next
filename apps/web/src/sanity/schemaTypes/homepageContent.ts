import { defineArrayMember, defineField, defineType } from "sanity";

const SECTION_ICON_OPTIONS = [
  { title: "Users (nhóm học viên)", value: "users" },
  { title: "Trophy (thành tích)", value: "trophy" },
  { title: "Shuttle (cầu)", value: "shuttle" },
  { title: "Calendar (lịch)", value: "calendar" },
  { title: "Map pin (sân)", value: "mapPin" },
  { title: "Arrow right (mũi tên)", value: "arrowRight" },
] as const;

// ─── Reusable inline helpers (no group — used inside inline objects) ──────────

function eyebrowField() {
  return defineField({
    name: "eyebrow",
    title: "Eyebrow (tag nhỏ trên tiêu đề)",
    type: "string",
  });
}

function titleField() {
  return defineField({
    name: "title",
    title: "Tiêu đề section",
    type: "string",
  });
}

function descriptionField() {
  return defineField({
    name: "description",
    title: "Mô tả ngắn",
    type: "text",
    rows: 3,
  });
}

// ─── Schema ──────────────────────────────────────────────────────────────────

export const homepageContent = defineType({
  name: "homepage_content",
  title: "Nội dung trang chủ",
  type: "document",

  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "stats", title: "Stats & Lý do chọn V2" },
    { name: "courses", title: "Khóa học" },
    { name: "sections", title: "Microcopy các section" },
  ],

  fields: [
    // ── Hero ─────────────────────────────────────────────────────────────────
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "statusLabel",
          title: "Status label (chip nhỏ trên heading)",
          description: 'Ví dụ: "Khai giảng tháng 6 · Bình Thạnh & Thủ Đức"',
          type: "string",
        }),
        defineField({
          name: "subheading",
          title: "Subheading",
          description: "Dòng mô tả ngắn dưới heading chính.",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "primaryCtaLabel",
          title: "Primary CTA label",
          description: 'Ví dụ: "Đăng ký học thử"',
          type: "string",
        }),
        defineField({
          name: "secondaryCtaLabel",
          title: "Secondary CTA label",
          description: 'Ví dụ: "Xem khóa học"',
          type: "string",
        }),
        defineField({
          name: "heroImageAlt",
          title: "Hero image alt text",
          description: "Alt text cho ảnh hero (SEO + accessibility).",
          type: "string",
        }),
      ],
    }),

    // ── Stats bar ─────────────────────────────────────────────────────────────
    defineField({
      name: "statsBar",
      title: "Stats bar",
      type: "object",
      group: "stats",
      fields: [
        defineField({
          name: "items",
          title: "Stat items",
          type: "array",
          of: [
            defineArrayMember({
              name: "statItem",
              title: "Stat item",
              type: "object",
              fields: [
                defineField({
                  name: "value",
                  title: "Giá trị (số/text)",
                  description: 'Ví dụ: "500+", "98%"',
                  type: "string",
                }),
                defineField({
                  name: "label",
                  title: "Nhãn",
                  description: 'Ví dụ: "Học viên đã đào tạo"',
                  type: "string",
                }),
                defineField({
                  name: "icon",
                  title: "Icon",
                  type: "string",
                  options: {
                    list: SECTION_ICON_OPTIONS.map((o) => ({
                      title: o.title,
                      value: o.value,
                    })),
                    layout: "dropdown",
                  },
                }),
              ],
              preview: {
                select: { value: "value", label: "label" },
                prepare({ value, label }: { value?: string; label?: string }) {
                  return { title: value ?? "—", subtitle: label };
                },
              },
            }),
          ],
          validation: (r) => r.max(6),
        }),
      ],
    }),

    // ── Why section ───────────────────────────────────────────────────────────
    defineField({
      name: "whySection",
      title: "Lý do chọn V2",
      type: "object",
      group: "stats",
      fields: [
        eyebrowField(),
        titleField(),
        descriptionField(),
        defineField({
          name: "proofStat",
          title: "Proof stat (số liệu nổi bật)",
          type: "object",
          fields: [
            defineField({ name: "value", title: "Giá trị", type: "string" }),
            defineField({ name: "statTitle", title: "Tiêu đề nhỏ", type: "string" }),
            defineField({ name: "statDescription", title: "Mô tả", type: "string" }),
          ],
        }),
        defineField({
          name: "differentiators",
          title: "Điểm khác biệt",
          type: "array",
          of: [
            defineArrayMember({
              name: "differentiator",
              title: "Điểm khác biệt",
              type: "object",
              fields: [
                defineField({ name: "title", title: "Tiêu đề", type: "string" }),
                defineField({ name: "description", title: "Mô tả", type: "text", rows: 2 }),
                defineField({
                  name: "icon",
                  title: "Icon",
                  type: "string",
                  options: {
                    list: SECTION_ICON_OPTIONS.map((o) => ({
                      title: o.title,
                      value: o.value,
                    })),
                    layout: "dropdown",
                  },
                }),
              ],
              preview: {
                select: { title: "title" },
                prepare({ title }: { title?: string }) {
                  return { title: title ?? "—" };
                },
              },
            }),
          ],
          validation: (r) => r.max(6),
        }),
      ],
    }),

    // ── Course section ────────────────────────────────────────────────────────
    defineField({
      name: "courseSection",
      title: "Section khóa học",
      type: "object",
      group: "courses",
      fields: [
        eyebrowField(),
        titleField(),
        defineField({
          name: "cards",
          title: "Course cards",
          type: "array",
          of: [
            defineArrayMember({
              name: "courseCard",
              title: "Course card",
              type: "object",
              fields: [
                defineField({ name: "categoryBadge", title: "Category badge", type: "string" }),
                defineField({ name: "levelChip", title: "Level chip", type: "string" }),
                defineField({ name: "title", title: "Tiêu đề", type: "string" }),
                defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
                defineField({ name: "description", title: "Mô tả", type: "text", rows: 3 }),
                defineField({ name: "amount", title: "Học phí hiển thị", type: "string" }),
                defineField({ name: "meta", title: "Meta (thông tin phụ)", type: "string" }),
                defineField({ name: "imageAlt", title: "Image alt text", type: "string" }),
                defineField({
                  name: "linkedMoneyPage",
                  title: "Liên kết trang đăng ký",
                  description: "Chọn money page tương ứng với khóa học này.",
                  type: "reference",
                  to: [{ type: "money_page" }],
                  options: { disableNew: true },
                }),
              ],
              preview: {
                select: { title: "title", subtitle: "levelChip" },
                prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
                  return { title: title ?? "—", subtitle };
                },
              },
            }),
          ],
        }),
      ],
    }),

    // ── Section microcopy (group: sections) ───────────────────────────────────
    defineField({
      name: "locationsSection",
      title: "Section địa điểm",
      type: "object",
      group: "sections",
      fields: [eyebrowField(), titleField(), descriptionField()],
    }),

    defineField({
      name: "faqSection",
      title: "Section FAQ",
      type: "object",
      group: "sections",
      fields: [eyebrowField(), titleField()],
    }),

    defineField({
      name: "pricingStrip",
      title: "Pricing strip",
      type: "object",
      group: "sections",
      fields: [
        eyebrowField(),
        titleField(),
        defineField({
          name: "secondary",
          title: "Secondary text",
          description: "Dòng chữ phụ dưới tiêu đề pricing.",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "scheduleSection",
      title: "Section lịch học",
      type: "object",
      group: "sections",
      fields: [eyebrowField(), titleField(), descriptionField()],
    }),

    defineField({
      name: "coachSection",
      title: "Section HLV",
      type: "object",
      group: "sections",
      fields: [eyebrowField(), titleField(), descriptionField()],
    }),

    defineField({
      name: "testimonialsSection",
      title: "Section học viên nói gì",
      type: "object",
      group: "sections",
      fields: [eyebrowField(), titleField()],
    }),

    defineField({
      name: "enterpriseTeaser",
      title: "Enterprise teaser",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "badge", title: "Badge", type: "string" }),
        titleField(),
        descriptionField(),
        defineField({
          name: "ctaLabel",
          title: "CTA label",
          type: "string",
        }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return {
        title: "Nội dung trang chủ",
        subtitle: "Singleton — copy cho homepage",
      };
    },
  },
});
