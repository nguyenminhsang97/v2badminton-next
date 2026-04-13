import { defineField, defineType } from "sanity";
import { DISTRICT_LABEL_BY_VALUE, DISTRICT_OPTIONS, slugifyValue } from "./shared";

export const location = defineType({
  name: "location",
  title: "Location",
  type: "document",
  initialValue: {
    isActive: true,
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
      name: "shortName",
      title: "Short Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "district",
      title: "District",
      type: "string",
      options: {
        list: [...DISTRICT_OPTIONS],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "addressText",
      title: "Address Text",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mapsUrl",
      title: "Maps URL",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "imageAlt",
      title: "Image Alt",
      type: "string",
      hidden: ({ document }) => !document?.image,
    }),
    defineField({
      name: "geoLat",
      title: "Geo Latitude",
      type: "number",
      validation: (Rule) => Rule.min(-90).max(90),
    }),
    defineField({
      name: "geoLng",
      title: "Geo Longitude",
      type: "number",
      validation: (Rule) => Rule.min(-180).max(180),
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
      title: "name",
      district: "district",
      media: "image",
    },
    prepare({ title, district, media }) {
      return {
        title,
        subtitle: DISTRICT_LABEL_BY_VALUE[district] ?? district ?? "Unknown district",
        media,
      };
    },
  },
});
