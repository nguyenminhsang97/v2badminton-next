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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SchedulePrefill = {
  courtId: CourtId;
  timeSlotId: TimeSlotId;
  message: string;
  /** Set only when the slot is basic-only, so the form can pre-select level. */
  levelHint?: ScheduleLevel;
};

export type ScrollTarget = "form" | "schedule" | null;

export type ConversionState = {
  selectedSchedulePrefill: SchedulePrefill | null;
  selectedCourseIntent: ScheduleLevel | null;
  businessMode: boolean;
  /**
   * Tracks the last message that was auto-injected by a prefill action.
   * - `null` means no auto-prefill has happened yet (field is user-controlled).
   * - A string value means the form message was set to this value by an action.
   * - `"__user_edited__"` means the user has manually edited the message, so
   *   future auto-prefills must not overwrite it.
   */
  autoPrefilledMessage: string | null;
  scrollTarget: ScrollTarget;
  focusAfterScroll: boolean;
};

export type ConversionActions = {
  setPrefill: (prefill: SchedulePrefill) => void;
  setCourseIntent: (level: ScheduleLevel) => void;
  enterBusinessMode: () => void;
  clearBusinessMode: () => void;
  clearPrefill: () => void;
  setAutoPrefilledMessage: (message: string | null) => void;
  setScrollTarget: (target: ScrollTarget) => void;
  setFocusAfterScroll: (value: boolean) => void;
  /**
   * Mark the message field as user-edited so future auto-prefills skip it.
   * Should be called by ContactForm when it detects manual input in the
   * message field that diverges from `autoPrefilledMessage`.
   */
  markMessageUserEdited: () => void;
  /**
   * Consume (and clear) the current scroll target. This is called by the
   * component that performs the scroll so the target is not re-consumed on
   * re-renders.
   */
  consumeScrollTarget: () => { target: ScrollTarget; shouldFocus: boolean };
};

type ConversionContextValue = ConversionState & ConversionActions;

// ---------------------------------------------------------------------------
// Sentinel
// ---------------------------------------------------------------------------

/** Sentinel value indicating the user has manually edited the message field. */
const USER_EDITED_SENTINEL = "__user_edited__" as const;

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ConversionContext = createContext<ConversionContextValue | null>(null);

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Access the shared homepage conversion controller.
 *
 * Must be used inside `<HomepageConversionProvider>`.
 *
 * Rules enforced by this architecture:
 * - ScheduleSection dispatches `setPrefill` — it does NOT own prefill state.
 * - CourseSection dispatches `setCourseIntent` / `enterBusinessMode`.
 * - ContactForm reads state and calls `markMessageUserEdited` when the user
 *   types in the message field.
 * - No component may maintain a second source of truth for the same semantics.
 */
export function useHomepageConversion(): ConversionContextValue {
  const ctx = useContext(ConversionContext);
  if (ctx === null) {
    throw new Error(
      "useHomepageConversion must be used inside <HomepageConversionProvider>",
    );
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Helper: should auto-overwrite message?
// ---------------------------------------------------------------------------

/**
 * Decide whether an incoming auto-prefill message should overwrite the current
 * form message value.
 *
 * Returns `true` when:
 * - No auto-prefill has happened yet (`autoPrefilledMessage` is null).
 * - The current field value still matches the last auto-prefilled message
 *   (user has not manually edited it).
 *
 * Returns `false` when:
 * - The user has edited the message field (`USER_EDITED_SENTINEL`).
 */
export function shouldAutoOverwriteMessage(
  autoPrefilledMessage: string | null,
): boolean {
  if (autoPrefilledMessage === null) return true;
  if (autoPrefilledMessage === USER_EDITED_SENTINEL) return false;
  // If autoPrefilledMessage is a real string, the form still holds the auto
  // value — safe to overwrite with a newer auto value.
  return true;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

const INITIAL_STATE: ConversionState = {
  selectedSchedulePrefill: null,
  selectedCourseIntent: null,
  businessMode: false,
  autoPrefilledMessage: null,
  scrollTarget: null,
  focusAfterScroll: false,
};

export function HomepageConversionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useState<ConversionState>(INITIAL_STATE);

  // -- Actions ---------------------------------------------------------------

  const setPrefill = useCallback((prefill: SchedulePrefill) => {
    setState((prev) => ({
      ...prev,
      selectedSchedulePrefill: prefill,
      selectedCourseIntent: null,
      businessMode: false,
      autoPrefilledMessage: shouldAutoOverwriteMessage(prev.autoPrefilledMessage)
        ? prefill.message
        : prev.autoPrefilledMessage,
      scrollTarget: "form",
      focusAfterScroll: true,
    }));
  }, []);

  const setCourseIntent = useCallback((level: ScheduleLevel) => {
    setState((prev) => ({
      ...prev,
      selectedCourseIntent: level,
      businessMode: false,
      scrollTarget: "schedule",
      focusAfterScroll: false,
    }));
  }, []);

  const enterBusinessMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedSchedulePrefill: null,
      selectedCourseIntent: null,
      businessMode: true,
      scrollTarget: "form",
      focusAfterScroll: true,
    }));
  }, []);

  const clearBusinessMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      businessMode: false,
    }));
  }, []);

  const clearPrefill = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedSchedulePrefill: null,
      autoPrefilledMessage: null,
    }));
  }, []);

  const setScrollTarget = useCallback((target: ScrollTarget) => {
    setState((prev) => ({ ...prev, scrollTarget: target }));
  }, []);

  const setAutoPrefilledMessage = useCallback((message: string | null) => {
    setState((prev) => ({ ...prev, autoPrefilledMessage: message }));
  }, []);

  const setFocusAfterScroll = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, focusAfterScroll: value }));
  }, []);

  const markMessageUserEdited = useCallback(() => {
    setState((prev) => ({
      ...prev,
      autoPrefilledMessage: USER_EDITED_SENTINEL,
    }));
  }, []);

  const consumeScrollTarget = useCallback(() => {
    let snapshot: { target: ScrollTarget; shouldFocus: boolean } = {
      target: null,
      shouldFocus: false,
    };
    setState((prev) => {
      snapshot = { target: prev.scrollTarget, shouldFocus: prev.focusAfterScroll };
      return {
        ...prev,
        scrollTarget: null,
        focusAfterScroll: false,
      };
    });
    return snapshot;
  }, []);

  // -- Memoized value --------------------------------------------------------

  const value = useMemo<ConversionContextValue>(
    () => ({
      ...state,
      setPrefill,
      setCourseIntent,
      enterBusinessMode,
      clearBusinessMode,
      clearPrefill,
      setAutoPrefilledMessage,
      setScrollTarget,
      setFocusAfterScroll,
      markMessageUserEdited,
      consumeScrollTarget,
    }),
    [
      state,
      setPrefill,
      setCourseIntent,
      enterBusinessMode,
      clearBusinessMode,
      clearPrefill,
      setAutoPrefilledMessage,
      setScrollTarget,
      setFocusAfterScroll,
      markMessageUserEdited,
      consumeScrollTarget,
    ],
  );

  return (
    <ConversionContext.Provider value={value}>
      {children}
    </ConversionContext.Provider>
  );
}
