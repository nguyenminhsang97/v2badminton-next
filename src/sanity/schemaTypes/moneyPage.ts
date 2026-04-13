import { defineArrayMember, defineField, defineType } from "sanity";
import { AUDIENCE_OPTIONS, slugifyValue } from "./shared";

const bodyBlockField = defineArrayMember({
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "H2", value: "h2" },
    { title: "H3", value: "h3" },
  ],
  lists: [
    { title: "Bullet", value: "bullet" },
    { title: "Numbered", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" },
    ],
    annotations: [
      {
        name: "link",
        title: "Link",
        type: "object",
        fields: [
          defineField({
            name: "href",
            title: "URL",
            type: "url",
            validation: (Rule) =>
              Rule.required().uri({ scheme: ["http", "https", "mailto", "tel"] }),
          }),
        ],
      },
    ],
  },
});

export const moneyPage = defineType({
  name: "money_page",
  title: "Money Page",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Khong co leading/trailing slash. VD: lop-cau-long-tre-em",
      options: {
        source: "h1",
        slugify: slugifyValue,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      options: {
        list: [...AUDIENCE_OPTIONS],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "h1",
      title: "H1",
      type: "string",
      description: "H1 chuan SEO - unique per page, chua local intent",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "array",
      of: [bodyBlockField],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [bodyBlockField],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "relatedLocations",
      title: "Related Locations",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "location" }] })],
    }),
    defineField({
      name: "relatedPricing",
      title: "Related Pricing",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "pricing_tier" }] })],
    }),
    defineField({
      name: "relatedFaqs",
      title: "Related FAQs",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "faq" }] })],
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "h1",
      subtitle: "slug.current",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `/${subtitle}` : "No slug",
      };
    },
  },
});
