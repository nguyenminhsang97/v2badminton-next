import { defineArrayMember, defineField, defineType } from "sanity";
import { SCHEDULE_LEVEL_OPTIONS, slugifyValue } from "./shared";

type ScheduleSlugDocument = {
  dayGroup?: string;
  timeSlotId?: string;
  location?: {
    _ref?: string;
  };
};

type ScheduleSlugContext = {
  document?: ScheduleSlugDocument;
  getClient: (options: { apiVersion: string }) => {
    fetch: <T>(
      query: string,
      params?: Record<string, string>,
    ) => Promise<T>;
  };
};

type ScheduleSlugLocation = {
  name?: string;
  slug?: {
    current?: string;
  };
};

async function slugifyScheduleBlock(
  input: string,
  _schemaType: unknown,
  context: ScheduleSlugContext,
) {
  const document = context.document;
  const timeSlotId = document?.timeSlotId ?? "";
  const dayGroup = document?.dayGroup ?? "";
  const locationRef = document?.location?._ref;

  if (!locationRef) {
    return slugifyValue(input || [timeSlotId, dayGroup].filter(Boolean).join(" "));
  }

  const client = context.getClient({ apiVersion: "2026-04-09" });
  const location = await client.fetch<ScheduleSlugLocation | null>(
    '*[_id in [$id, $draftId]][0]{name, slug}',
    { id: locationRef, draftId: `drafts.${locationRef}` },
  );

  return slugifyValue(
    [location?.slug?.current ?? location?.name, timeSlotId, dayGroup]
      .filter(Boolean)
      .join(" "),
  );
}

export const scheduleBlock = defineType({
  name: "schedule_block",
  title: "Lịch học",
  type: "document",
  initialValue: {
    isActive: true,
  },
  fields: [
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      description:
        "Tự động tạo từ sân tập, mã ca và nhóm ngày. Không thay đổi sau khi đã publish.",
      options: {
        source: (document) => {
          const scheduleDocument = document as ScheduleSlugDocument | undefined;
          return [
            scheduleDocument?.location?._ref,
            scheduleDocument?.timeSlotId,
            scheduleDocument?.dayGroup,
          ]
            .filter(Boolean)
            .join(" ");
        },
        slugify: slugifyScheduleBlock,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Sân tập",
      type: "reference",
      to: [{ type: "location" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dayGroup",
      title: "Nhóm ngày",
      type: "string",
      description:
        "VD: Thứ 2–4–6, Cuối tuần. Hiển thị trên bảng lịch học trang chủ.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "timeLabel",
      title: "Ca học",
      type: "string",
      description:
        "VD: 17:00 – 18:30. Hiển thị trên bảng lịch học trang chủ.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "timeSlotId",
      title: "Mã ca học",
      type: "string",
      description:
        "Mã liên kết ca học với form đăng ký khi user chọn lịch. VD: sang-thu-2-4-6",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "levels",
      title: "Trình độ",
      type: "array",
      description:
        "Trình độ phù hợp cho ca học này. Hiển thị dưới dạng tag trên bảng lịch trang chủ.",
      of: [
        defineArrayMember({
          type: "string",
          options: {
            list: [...SCHEDULE_LEVEL_OPTIONS],
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "order",
      title: "Thứ tự hiển thị",
      type: "number",
      description: "Số nhỏ hơn hiển thị trước trên bảng lịch trang chủ.",
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "isActive",
      title: "Hiển thị trên web?",
      type: "boolean",
      description: "Tắt để ẩn ca học này khỏi website mà không cần xóa.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "timeLabel",
      subtitle: "dayGroup",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle,
      };
    },
  },
});
