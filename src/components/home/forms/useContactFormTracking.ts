"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import type { SubmissionMethod, FormFieldName } from "@/lib/tracking";
import { trackEvent } from "@/lib/tracking";
import type { FormErrors, FormValues, ContactFormServerState } from "./contactForm.shared";
import { buildLeadType } from "./contactForm.shared";

type UseContactFormTrackingParams = {
  pathname: string;
  serverState: ContactFormServerState;
  formToken: string;
  values: FormValues;
  businessMode: boolean;
  setDirtySinceServer: (value: boolean) => void;
  setErrors: (value: FormErrors) => void;
  setSubmitMessage: (value: string | null) => void;
  setValues: (updater: (previous: FormValues) => FormValues) => void;
};

export function useContactFormTracking({
  pathname,
  serverState,
  formToken,
  values,
  businessMode,
  setDirtySinceServer,
  setErrors,
  setSubmitMessage,
  setValues,
}: UseContactFormTrackingParams) {
  const startedAtRef = useRef<number | null>(null);
  const hasTrackedStartRef = useRef(false);
  const hasSubmittedRef = useRef(false);
  const lastFocusedFieldRef = useRef<FormFieldName | null>(null);
  const lastHandledServerStateRef = useRef<string | null>(null);
  const lastTrackedServerErrorRef = useRef<string | null>(null);
  const lastTrackedSuccessRef = useRef<string | null>(null);

  const applyServerActionState = useEffectEvent(() => {
    setDirtySinceServer(false);
    setErrors(serverState.errors);
    setSubmitMessage(serverState.message);
    setValues((prev) => ({
      ...prev,
      ...serverState.values,
      _gotcha: "",
    }));

    if (serverState.success) {
      hasSubmittedRef.current = true;

      if (
        !serverState.deduped &&
        lastTrackedSuccessRef.current !== serverState.submittedAt
      ) {
        lastTrackedSuccessRef.current = serverState.submittedAt;
        const elapsed = startedAtRef.current
          ? performance.now() - startedAtRef.current
          : 0;
        const submissionMethod =
          serverState.submissionMethod ?? (formToken ? "js" : "no_js");

        trackEvent("time_to_submit", {
          time_to_submit_ms: elapsed,
          page_type: "homepage",
          page_path: pathname || "/",
        });
        trackEvent("generate_lead", {
          page_type: "homepage",
          page_path: pathname || "/",
          lead_type: buildLeadType(values.level, businessMode),
          has_court_preference: values.court !== "",
          has_time_preference: values.time_slot !== "",
          submission_method: submissionMethod as SubmissionMethod,
          time_to_submit_ms: elapsed,
        });
      }

      return;
    }

    if (
      serverState.error &&
      serverState.error !== "validation" &&
      lastTrackedServerErrorRef.current !== serverState.submittedAt
    ) {
      lastTrackedServerErrorRef.current = serverState.submittedAt;
      trackEvent("form_error", {
        error_code: serverState.error,
        page_type: "homepage",
        page_path: pathname || "/",
      });
    }
  });

  useEffect(() => {
    return () => {
      if (hasTrackedStartRef.current && !hasSubmittedRef.current) {
        trackEvent("form_abandon", {
          last_focused_field: lastFocusedFieldRef.current ?? undefined,
          page_type: "homepage",
          page_path: pathname || "/",
        });
      }
    };
  }, [pathname]);

  useEffect(() => {
    if (
      !serverState.submittedAt ||
      lastHandledServerStateRef.current === serverState.submittedAt
    ) {
      return;
    }

    lastHandledServerStateRef.current = serverState.submittedAt;
    applyServerActionState();
  }, [serverState.submittedAt]);

  function handleFocus(fieldName: FormFieldName) {
    lastFocusedFieldRef.current = fieldName;

    if (!hasTrackedStartRef.current) {
      hasTrackedStartRef.current = true;
      startedAtRef.current = performance.now();
      trackEvent("form_start", {
        page_type: "homepage",
        page_path: pathname || "/",
      });
    }

    trackEvent("form_field_focus", {
      field_name: fieldName,
      page_type: "homepage",
      page_path: pathname || "/",
    });
  }

  return {
    handleFocus,
  };
}
