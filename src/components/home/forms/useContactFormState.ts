"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import type {
  FormErrors,
  FormValues,
  ContactFormServerState,
  SubmitState,
} from "./contactForm.shared";
import { INITIAL_VALUES } from "./contactForm.shared";

type UseContactFormStateParams = {
  serverState: ContactFormServerState;
  isPending: boolean;
  autoPrefilledMessage: string | null;
  markMessageUserEdited: () => void;
};

export function useContactFormState({
  serverState,
  isPending,
  autoPrefilledMessage,
  markMessageUserEdited,
}: UseContactFormStateParams) {
  const [values, setValues] = useState<FormValues>(() => ({
    ...INITIAL_VALUES,
    ...serverState.values,
  }));
  const [errors, setErrors] = useState<FormErrors>(serverState.errors);
  const [optionalOpen, setOptionalOpen] = useState(
    Boolean(
      serverState.values.level ||
        serverState.values.court ||
        serverState.values.time_slot ||
        serverState.values.message,
    ),
  );
  const [submitMessage, setSubmitMessage] = useState<string | null>(
    serverState.message,
  );
  const [dirtySinceServer, setDirtySinceServer] = useState(false);

  const submitState: SubmitState = useMemo(
    () =>
      isPending
        ? "submitting"
        : serverState.success && !dirtySinceServer
          ? "success"
          : submitMessage || Object.keys(errors).length > 0
            ? "error"
            : "idle",
    [dirtySinceServer, errors, isPending, serverState.success, submitMessage],
  );

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setDirtySinceServer(true);
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitMessage(null);

    if (
      field === "message" &&
      autoPrefilledMessage !== null &&
      value !== autoPrefilledMessage
    ) {
      markMessageUserEdited();
    }
  }

  function handleMessageChange(event: ChangeEvent<HTMLTextAreaElement>) {
    updateField("message", event.currentTarget.value);
  }

  return {
    values,
    setValues,
    errors,
    setErrors,
    optionalOpen,
    setOptionalOpen,
    submitMessage,
    setSubmitMessage,
    dirtySinceServer,
    setDirtySinceServer,
    submitState,
    updateField,
    handleMessageChange,
  };
}
