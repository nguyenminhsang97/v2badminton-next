"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { singletonActions, singletonTypes, structure } from "./src/sanity/structure";

const envProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const envDataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();

export const isSanityStudioConfigured = Boolean(envProjectId && envDataset);

const projectId = envProjectId ?? "missing-project-id";
const dataset = envDataset ?? "production";

export default defineConfig({
  name: "default",
  title: "V2 Badminton CMS",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) => !schemaType || !singletonTypes.has(schemaType),
      ),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
});
