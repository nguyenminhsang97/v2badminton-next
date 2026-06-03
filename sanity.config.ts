"use client";

import { defineConfig, type DocumentBadgeComponent } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { DashboardIcon } from "@sanity/icons";
import { openLivePageAction } from "./src/sanity/actions/openLivePageAction";
import {
  draftStatusBadge,
  missingCoachPhotoBadge,
  missingCoverImageBadge,
  missingHeroImageBadge,
  missingMetaDescriptionBadge,
} from "./src/sanity/badges/readinessBadges";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { singletonActions, singletonTypes, structure } from "./src/sanity/structure";
import { DashboardTool } from "./src/sanity/tools/DashboardTool";

const BADGES_BY_TYPE: Record<string, DocumentBadgeComponent[]> = {
  content_article: [missingCoverImageBadge, draftStatusBadge],
  money_page: [missingHeroImageBadge, missingMetaDescriptionBadge],
  coach: [missingCoachPhotoBadge],
  post: [draftStatusBadge],
};

const SANITY_API_VERSION = "2026-04-09";

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
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: SANITY_API_VERSION }),
  ],
  // Register the dashboard as the first tool in the toolbar.
  // `prev` already contains the tools contributed by the plugins above
  // (structure + vision). Prepending keeps them all intact.
  tools: (prev) => [
    {
      name: "dashboard",
      title: "Bảng điều khiển",
      icon: DashboardIcon,
      component: DashboardTool,
    },
    ...prev,
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) => !schemaType || !singletonTypes.has(schemaType),
      ),
  },
  document: {
    actions: (input, context) => {
      const base = singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input;
      return [...base, openLivePageAction];
    },
    badges: (prev, context) => {
      const extra = BADGES_BY_TYPE[context.schemaType] ?? [];
      return [...prev, ...extra];
    },
  },
});
