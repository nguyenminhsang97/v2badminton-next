import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "site_settings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phoneDisplay",
      title: "Phone Display",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phoneE164",
      title: "Phone E.164",
      type: "string",
      description: "Example: +84907911886",
      validation: (Rule) =>
        Rule.required().regex(/^\+[1-9]\d{7,14}$/, {
          name: "E.164 phone number",
        }),
    }),
    defineField({
      name: "zaloNumber",
      title: "Zalo Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook URL",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default OG Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
        subtitle: "Singleton document",
      };
    },
  },
});
