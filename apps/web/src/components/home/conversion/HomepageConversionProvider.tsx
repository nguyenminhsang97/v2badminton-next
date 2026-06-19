"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CourtId } from "@/lib/locations";
import type { ScheduleLevel, TimeSlotId } from "@/lib/schedule";

export type SchedulePrefill = {
  courtId: CourtId;
  timeSlotId: TimeSlotId;
  message: string;
  levelHint?: ScheduleLevel;
};

export type ScrollTarget = "form" | "schedule" | null;

type ScrollRequest = {
  target: ScrollTarget;
  shouldFocus: boolean;
} | null;

type ConversionIntentContextValue = {
  selectedSchedulePrefill: SchedulePrefill | null;
  selectedCourseIntent: ScheduleLevel | null;
  autoPrefilledMessage: string | null;
  setPrefill: (prefill: SchedulePrefill) => void;
  setCourseIntent: (level: ScheduleLevel) => void;
  clearCourseIntent: () => void;
  setAutoPrefilledMessage: (message: string | null) => void;
  markMessageUserEdited: () => void;
};

type BusinessModeContextValue = {
  businessMode: boolean;
  enterBusinessMode: () => void;
};

type ScrollCoordinationContextValue = {
  scrollTarget: ScrollTarget;
  consumeScrollTarget: () => { target: ScrollTarget; shouldFocus: boolean };
};

const USER_EDITED_SENTINEL = "__user_edited__" as const;

const ConversionIntentContext =
  createContext<ConversionIntentContextValue | null>(null);
const BusinessModeContext = createContext<BusinessModeContextValue | null>(null);
const ScrollCoordinationContext =
  createContext<ScrollCoordinationContextValue | null>(null);

export function shouldAutoOverwriteMessage(
  autoPrefilledMessage: string | null,
): boolean {
  if (autoPrefilledMessage === null) return true;
  if (autoPrefilledMessage === USER_EDITED_SENTINEL) return false;
  return true;
}

export function useHomepageConversionIntent(): ConversionIntentContextValue {
  const ctx = useContext(ConversionIntentContext);
  if (ctx === null) {
    throw new Error(
      "useHomepageConversionIntent must be used inside <HomepageConversionProvider>",
    );
  }
  return ctx;
}

export function useHomepageBusinessMode(): BusinessModeContextValue {
  const ctx = useContext(BusinessModeContext);
  if (ctx === null) {
    throw new Error(
      "useHomepageBusinessMode must be used inside <HomepageConversionProvider>",
    );
  }
  return ctx;
}

export function useHomepageScrollCoordination(): ScrollCoordinationContextValue {
  const ctx = useContext(ScrollCoordinationContext);
  if (ctx === null) {
    throw new Error(
      "useHomepageScrollCoordination must be used inside <HomepageConversionProvider>",
    );
  }
  return ctx;
}

export function HomepageConversionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedSchedulePrefill, setSelectedSchedulePrefill] =
    useState<SchedulePrefill | null>(null);
  const [selectedCourseIntent, setSelectedCourseIntent] =
    useState<ScheduleLevel | null>(null);
  const [businessMode, setBusinessMode] = useState(false);
  const [autoPrefilledMessage, setAutoPrefilledMessageState] = useState<
    string | null
  >(null);
  const [scrollRequest, setScrollRequest] = useState<ScrollRequest>(null);

  const setPrefill = useCallback((prefill: SchedulePrefill) => {
    setSelectedSchedulePrefill(prefill);
    setSelectedCourseIntent(null);
    setBusinessMode(false);
    setScrollRequest({ target: "form", shouldFocus: true });
  }, []);

  const setCourseIntent = useCallback((level: ScheduleLevel) => {
    setSelectedCourseIntent(level);
    setBusinessMode(false);
    setScrollRequest({ target: "schedule", shouldFocus: false });
  }, []);

  const clearCourseIntent = useCallback(() => {
    setSelectedCourseIntent(null);
    setScrollRequest(null);
  }, []);

  const enterBusinessMode = useCallback(() => {
    setSelectedSchedulePrefill(null);
    setSelectedCourseIntent(null);
    setBusinessMode(true);
    setScrollRequest({ target: "form", shouldFocus: true });
  }, []);

  const setAutoPrefilledMessage = useCallback((message: string | null) => {
    setAutoPrefilledMessageState(message);
  }, []);

  const markMessageUserEdited = useCallback(() => {
    setAutoPrefilledMessageState(USER_EDITED_SENTINEL);
  }, []);

  const consumeScrollTarget = useCallback(() => {
    const snapshot = scrollRequest ?? { target: null, shouldFocus: false };
    setScrollRequest(null);
    return snapshot;
  }, [scrollRequest]);

  const intentValue = useMemo<ConversionIntentContextValue>(
    () => ({
      selectedSchedulePrefill,
      selectedCourseIntent,
      autoPrefilledMessage,
      setPrefill,
      setCourseIntent,
      clearCourseIntent,
      setAutoPrefilledMessage,
      markMessageUserEdited,
    }),
    [
      selectedSchedulePrefill,
      selectedCourseIntent,
      autoPrefilledMessage,
      setPrefill,
      setCourseIntent,
      clearCourseIntent,
      setAutoPrefilledMessage,
      markMessageUserEdited,
    ],
  );

  const businessValue = useMemo<BusinessModeContextValue>(
    () => ({
      businessMode,
      enterBusinessMode,
    }),
    [businessMode, enterBusinessMode],
  );

  const scrollValue = useMemo<ScrollCoordinationContextValue>(
    () => ({
      scrollTarget: scrollRequest?.target ?? null,
      consumeScrollTarget,
    }),
    [scrollRequest, consumeScrollTarget],
  );

  return (
    <BusinessModeContext.Provider value={businessValue}>
      <ConversionIntentContext.Provider value={intentValue}>
        <ScrollCoordinationContext.Provider value={scrollValue}>
          {children}
        </ScrollCoordinationContext.Provider>
      </ConversionIntentContext.Provider>
    </BusinessModeContext.Provider>
  );
}
