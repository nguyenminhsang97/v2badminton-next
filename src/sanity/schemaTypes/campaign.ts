import { defineField, defineType } from "sanity";
import { AUDIENCE_OPTIONS, slugifyValue } from "./shared";

const CAMPAIGN_STATUS_OPTIONS = [
  { title: "Draft", value: "draft" },
  { title: "Active", value: "active" },
  { title: "Ended", value: "ended" },
] as const;

export const campaign = defineType({
  name: "campaign",
  title: "Campaign",
  type: "document",
  initialValue: {
    status: "draft",
  },
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        slugify: slugifyValue,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [...CAMPAIGN_STATUS_OPTIONS],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
      validation: (Rule) =>
        Rule.required().custom((endDate, context) => {
          const startDate = context.document?.startDate as string | undefined;
          if (typeof endDate === "string" && startDate && endDate <= startDate) {
            return "End date must be after start date";
          }
          return true;
        }),
    }),
    defineField({
      name: "badgeText",
      title: "Badge Text",
      type: "string",
      description: "VD: Lop he dang mo dang ky",
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title Override",
      type: "string",
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description Override",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "Primary CTA Label",
      type: "string",
    }),
    defineField({
      name: "primaryCtaUrl",
      title: "Primary CTA URL",
      type: "string",
      description: "Cho phep internal path nhu /lop-he-2026 hoac absolute URL",
    }),
    defineField({
      name: "secondaryCtaLabel",
      title: "Secondary CTA Label",
      type: "string",
    }),
    defineField({
      name: "secondaryCtaUrl",
      title: "Secondary CTA URL",
      type: "string",
      description: "Cho phep internal path nhu /lop-he-2026 hoac absolute URL",
    }),
    defineField({
      name: "featuredAudience",
      title: "Featured Audience",
      type: "string",
      options: {
        list: [...AUDIENCE_OPTIONS],
      },
    }),
    defineField({
      name: "linkedPage",
      title: "Linked Page",
      type: "reference",
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
        subtitle,
      };
    },
  },
});
