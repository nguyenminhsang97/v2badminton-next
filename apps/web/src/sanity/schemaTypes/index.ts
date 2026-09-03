import { campaign } from "./campaign";
import { coach } from "./coach";
import { contentArticle } from "./contentArticle";
import { court } from "./court";
import { contentHub } from "./contentHub";
import { contentNode } from "./contentNode";
import { faq } from "./faq";
import { homepageContent } from "./homepageContent";
import { location } from "./location";
import { moneyPage } from "./moneyPage";
import { post } from "./post";
import { pricingTier } from "./pricingTier";
import { routeRedirect } from "./routeRedirect";
import { scheduleBlock } from "./scheduleBlock";
import { siteSettings } from "./siteSettings";
import { staticPage } from "./staticPage";
import { testimonial } from "./testimonial";

export const schemaTypes = [
  siteSettings,
  homepageContent,
  staticPage,
  location,
  pricingTier,
  scheduleBlock,
  faq,
  coach,
  testimonial,
  moneyPage,
  campaign,
  post,
  // Content platform (Phase 1 — locked spec: .claude/CMS/v2badminton-cms-phase-1-locked-spec.md; Phase 2 — locked spec: .claude/CMS/v2badminton-cms-phase-2-locked-spec.md)
  contentHub,
  contentNode,
  contentArticle,
  court,
  routeRedirect,
];
