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
  title: "Schedule Block",
  type: "document",
  initialValue: {
    isActive: true,
  },
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Suggested pattern: location-timeslotid-daygroup. The initial value is generated from location, timeSlotId, and dayGroup.",
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
      title: "Location",
      type: "reference",
      to: [{ type: "location" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dayGroup",
      title: "Day Group",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "timeLabel",
      title: "Time Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "timeSlotId",
      title: "Time Slot ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "levels",
      title: "Levels",
      type: "array",
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
      title: "Order",
      type: "number",
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
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
