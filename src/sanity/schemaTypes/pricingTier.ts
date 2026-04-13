import { defineArrayMember, defineField, defineType } from "sanity";
import {
  BILLING_MODEL_OPTIONS,
  CTA_ACTION_OPTIONS,
  PRICING_KIND_LABEL_BY_VALUE,
  PRICING_KIND_OPTIONS,
  slugifyValue,
} from "./shared";

function validateBillingModel(kind: unknown, value: unknown) {
  if (typeof value !== "string") {
    return "Billing model is required.";
  }

  if (kind === "group" && value !== "monthly_package") {
    return "Group tiers must use monthly_package.";
  }

  if (kind === "private" && value !== "per_hour") {
    return "Private tiers must use per_hour.";
  }

  if (kind === "enterprise" && value !== "quote") {
    return "Enterprise tiers must use quote.";
  }

  return true;
}

export const pricingTier = defineType({
  name: "pricing_tier",
  title: "Pricing Tier",
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
      name: "shortLabel",
      title: "Short Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: {
        list: [...PRICING_KIND_OPTIONS],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "billingModel",
      title: "Billing Model",
      type: "string",
      options: {
        list: [...BILLING_MODEL_OPTIONS],
      },
      validation: (Rule) =>
        Rule.required().custom((value, context) =>
          validateBillingModel(context.document?.kind, value),
        ),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "groupSize",
      title: "Group Size",
      type: "string",
      hidden: ({ document }) => document?.kind !== "group",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.kind === "group" && typeof value !== "string") {
            return "Group size is required for group tiers.";
          }
          return true;
        }),
    }),
    defineField({
      name: "pricePerMonth",
      title: "Price Per Month",
      type: "number",
      hidden: ({ document }) => document?.kind !== "group",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.kind === "group" && typeof value !== "number") {
            return "Price per month is required for group tiers.";
          }
          return true;
        }),
    }),
    defineField({
      name: "pricePerHour",
      title: "Price Per Hour",
      type: "number",
      hidden: ({ document }) => document?.kind !== "private",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.kind === "private" && typeof value !== "number") {
            return "Price per hour is required for private tiers.";
          }
          return true;
        }),
    }),
    defineField({
      name: "displayPrice",
      title: "Display Price",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sessionsPerWeek",
      title: "Sessions Per Week",
      type: "number",
      hidden: ({ document }) => document?.kind !== "group",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.kind === "group" && typeof value !== "number") {
            return "Sessions per week is required for group tiers.";
          }
          return true;
        }).integer().min(1),
    }),
    defineField({
      name: "sessionsPerMonth",
      title: "Sessions Per Month",
      type: "number",
      hidden: ({ document }) => document?.kind !== "group",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.kind === "group" && typeof value !== "number") {
            return "Sessions per month is required for group tiers.";
          }
          return true;
        }).integer().min(1),
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaAction",
      title: "CTA Action",
      type: "string",
      options: {
        list: [...CTA_ACTION_OPTIONS],
      },
      validation: (Rule) => Rule.required(),
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
      kind: "kind",
      displayPrice: "displayPrice",
    },
    prepare({ title, kind, displayPrice }) {
      const kindLabel = PRICING_KIND_LABEL_BY_VALUE[kind] ?? kind ?? "Unknown kind";
      return {
        title,
        subtitle: [kindLabel, displayPrice].filter(Boolean).join(" - "),
      };
    },
  },
});
