import type { PageType } from "@/lib/routes";

export type TrackingEvent =
  | "cta_click"
  | "contact_click"
  | "map_click"
  | "form_start"
  | "generate_lead"
  | "form_error"
  | "form_field_focus"
  | "form_abandon"
  | "time_to_submit";

export type CtaName =
  | "dang_ky_ngay"
  | "dang_ky_hoc_thu"
  | "xem_khoa_hoc"
  | "campaign_primary"
  | "campaign_secondary"
  | "nhan_bao_gia"
  | "nhan_zalo_tu_van";

export type CtaLocation =
  | "nav"
  | "hero"
  | "pricing"
  | "course_cards"
  | "business"
  | "seo_cta_block"
  | "location_cards"
  | (string & {});

export type ContactMethod = "zalo" | "phone" | "messenger";
export type MapLocation = "hue_thien" | "green" | "khang_sport" | "phuc_loc";
export type FormFieldName = "name" | "phone" | "level" | "court" | "time_slot" | "message";
export type SubmissionMethod = "js" | "no_js";

const CTA_NAMES: ReadonlySet<CtaName> = new Set([
  "dang_ky_ngay",
  "dang_ky_hoc_thu",
  "xem_khoa_hoc",
  "campaign_primary",
  "campaign_secondary",
  "nhan_bao_gia",
  "nhan_zalo_tu_van",
]);

const PAGE_TYPES: ReadonlySet<PageType> = new Set([
  "homepage",
  "seo_local",
  "seo_service",
  "seo_support",
]);

type EventParams = {
  cta_click: {
    cta_name: CtaName;
    cta_location: CtaLocation;
    page_type?: PageType;
    page_path?: string;
  };
  contact_click: {
    method: ContactMethod;
    page_type?: PageType;
    page_path?: string;
  };
  map_click: {
    location: MapLocation;
    page_type?: PageType;
    page_path?: string;
  };
  form_start: {
    page_type?: PageType;
    page_path?: string;
  };
  generate_lead: {
    page_type?: PageType;
    page_path?: string;
    lead_type?: "individual" | "corporate";
    has_court_preference?: boolean;
    has_time_preference?: boolean;
    submission_method?: SubmissionMethod;
    time_to_submit_ms?: number;
  };
  form_error: {
    field_name?: FormFieldName;
    error_code?: string;
    page_type?: PageType;
    page_path?: string;
  };
  form_field_focus: {
    field_name: FormFieldName;
    page_type?: PageType;
    page_path?: string;
  };
  form_abandon: {
    last_focused_field?: FormFieldName;
    page_type?: PageType;
    page_path?: string;
  };
  time_to_submit: {
    time_to_submit_ms: number;
    page_type?: PageType;
    page_path?: string;
  };
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    v2TrackEvent?: <TEvent extends TrackingEvent>(
      eventName: TEvent,
      params?: EventParams[TEvent],
    ) => void;
  }
}

export function trackEvent<TEvent extends TrackingEvent>(
  eventName: TEvent,
  params?: EventParams[TEvent],
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...(params ?? {}),
  });
}

export function registerGlobalTracker(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.v2TrackEvent = trackEvent;
}

export function registerDelegatedTracking(): () => void {
  if (typeof document === "undefined") {
    return () => undefined;
  }

  const handleClick = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const trackedElement = event.target.closest<HTMLElement>(
      '[data-track-event="cta_click"][data-cta-name][data-cta-location]',
    );

    if (!trackedElement) {
      return;
    }

    const ctaName = trackedElement.dataset.ctaName;
    const ctaLocation = trackedElement.dataset.ctaLocation;
    const pagePath = trackedElement.dataset.pagePath;
    const pageType = trackedElement.dataset.pageType;

    if (!ctaName || !CTA_NAMES.has(ctaName as CtaName) || !ctaLocation) {
      return;
    }

    trackEvent("cta_click", {
      cta_name: ctaName as CtaName,
      cta_location: ctaLocation,
      page_path: pagePath,
      page_type:
        pageType && PAGE_TYPES.has(pageType as PageType)
          ? (pageType as PageType)
          : undefined,
    });
  };

  document.addEventListener("click", handleClick);

  return () => {
    document.removeEventListener("click", handleClick);
  };
}
