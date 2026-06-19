"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import type { SchedulePrefill } from "../conversion/HomepageConversionProvider";
import type { ContactFormServerState, FormErrors, FormValues } from "./contactForm.shared";
import { BUSINESS_MESSAGE } from "./contactForm.shared";

type UseContactFormEffectsParams = {
  selectedSchedulePrefill: SchedulePrefill | null;
  autoPrefilledMessage: string | null;
  canAutoOverwriteMessage: boolean;
  businessMode: boolean;
  serverState: ContactFormServerState;
  setAutoPrefilledMessage: (message: string | null) => void;
  setOptionalOpen: (value: boolean) => void;
  setDirtySinceServer: (value: boolean) => void;
  setValues: (updater: (previous: FormValues) => FormValues) => void;
  setErrors: (updater: (previous: FormErrors) => FormErrors) => void;
  setSubmitMessage: (value: string | null) => void;
};

export function useContactFormEffects({
  selectedSchedulePrefill,
  autoPrefilledMessage,
  canAutoOverwriteMessage,
  businessMode,
  serverState,
  setAutoPrefilledMessage,
  setOptionalOpen,
  setDirtySinceServer,
  setValues,
  setErrors,
  setSubmitMessage,
}: UseContactFormEffectsParams) {
  const lastAppliedPrefillKeyRef = useRef<string | null>(null);
  const lastBusinessModeRef = useRef(false);

  const applySelectedSchedulePrefill = useEffectEvent(() => {
    if (selectedSchedulePrefill === null) {
      return;
    }

    setOptionalOpen(true);
    setDirtySinceServer(true);

    setValues((prev) => {
      const nextValues: FormValues = {
        ...prev,
        court: selectedSchedulePrefill.courtId,
        time_slot: selectedSchedulePrefill.timeSlotId,
      };

      if (prev.level === "" && selectedSchedulePrefill.levelHint) {
        nextValues.level = selectedSchedulePrefill.levelHint;
      }

      if (
        autoPrefilledMessage === null ||
        autoPrefilledMessage === prev.message
      ) {
        nextValues.message = selectedSchedulePrefill.message;
      }

      return nextValues;
    });

    if (canAutoOverwriteMessage) {
      setAutoPrefilledMessage(selectedSchedulePrefill.message);
    }

    setErrors((prev) => ({
      ...prev,
      court: undefined,
      time_slot: undefined,
      level: undefined,
      message: undefined,
    }));
    setSubmitMessage(null);
  });

  const applyBusinessMode = useEffectEvent(() => {
    setOptionalOpen(true);
    setDirtySinceServer(true);

    setValues((prev) => {
      const nextValues: FormValues = {
        ...prev,
        level: "doanh_nghiep",
        court: "",
        time_slot: "",
      };

      if (
        autoPrefilledMessage === null ||
        autoPrefilledMessage === prev.message
      ) {
        nextValues.message = BUSINESS_MESSAGE;
      }

      return nextValues;
    });

    if (canAutoOverwriteMessage) {
      setAutoPrefilledMessage(BUSINESS_MESSAGE);
    }

    setErrors((prev) => ({
      ...prev,
      court: undefined,
      time_slot: undefined,
      level: undefined,
      message: undefined,
    }));
    setSubmitMessage(null);
  });

  useEffect(() => {
    if (selectedSchedulePrefill === null) {
      return;
    }

    const nextKey = [
      selectedSchedulePrefill.courtId,
      selectedSchedulePrefill.timeSlotId,
      selectedSchedulePrefill.message,
      selectedSchedulePrefill.levelHint ?? "",
    ].join("|");

    if (lastAppliedPrefillKeyRef.current === nextKey) {
      return;
    }

    lastAppliedPrefillKeyRef.current = nextKey;
    applySelectedSchedulePrefill();
  }, [selectedSchedulePrefill]);

  useEffect(() => {
    if (!businessMode || lastBusinessModeRef.current) {
      lastBusinessModeRef.current = businessMode;
      return;
    }

    lastBusinessModeRef.current = true;
    applyBusinessMode();
  }, [businessMode]);

  useEffect(() => {
    if (!businessMode) {
      lastBusinessModeRef.current = false;
    }
  }, [businessMode]);

  useEffect(() => {
    if (serverState.success) {
      lastAppliedPrefillKeyRef.current = null;
    }
  }, [serverState.success]);
}
