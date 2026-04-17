"use client";

import { useEffect } from "react";
import { useHomepageScrollCoordination } from "./HomepageConversionProvider";

function isEmptyField(element: HTMLElement): boolean {
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    return element.value.trim() === "";
  }

  if (element instanceof HTMLSelectElement) {
    return element.value.trim() === "";
  }

  return false;
}

function focusFirstEmptyField(form: HTMLElement) {
  const fields = Array.from(
    form.querySelectorAll<HTMLElement>("[data-field-name]"),
  ).filter((field) => {
    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLSelectElement ||
      field instanceof HTMLTextAreaElement
    ) {
      return !field.disabled && field.type !== "hidden";
    }

    return false;
  });

  const targetField =
    fields.find((field) => isEmptyField(field)) ??
    fields.find((field) => field instanceof HTMLTextAreaElement) ??
    fields[0];

  if (
    targetField instanceof HTMLInputElement ||
    targetField instanceof HTMLSelectElement ||
    targetField instanceof HTMLTextAreaElement
  ) {
    targetField.focus({ preventScroll: true });
  }
}

export function HomepageScrollCoordinator() {
  const { scrollTarget, consumeScrollTarget } = useHomepageScrollCoordination();

  useEffect(() => {
    if (scrollTarget === null) {
      return undefined;
    }

    const { target, shouldFocus } = consumeScrollTarget();
    if (target === null) {
      return undefined;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";

    if (target === "schedule") {
      document
        .getElementById("lich-hoc")
        ?.scrollIntoView({ behavior, block: "start" });
      return undefined;
    }

    const form = document.getElementById("contact-form");
    if (!(form instanceof HTMLElement)) {
      return undefined;
    }

    form
      .querySelector<HTMLDetailsElement>("[data-optional-fields='true']")
      ?.setAttribute("open", "");

    form.scrollIntoView({ behavior, block: "start" });

    if (!shouldFocus) {
      return undefined;
    }

    const rafId = requestAnimationFrame(() => focusFirstEmptyField(form));
    return () => cancelAnimationFrame(rafId);
  }, [consumeScrollTarget, scrollTarget]);

  return null;
}
