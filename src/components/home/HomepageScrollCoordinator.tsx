"use client";

import { useEffect, useEffectEvent } from "react";
import { useHomepageConversion } from "./HomepageConversionProvider";

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

export function HomepageScrollCoordinator() {
  const { scrollTarget, consumeScrollTarget } = useHomepageConversion();

  const focusFirstEmptyField = useEffectEvent((form: HTMLElement) => {
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

    const target =
      fields.find((field) => isEmptyField(field)) ??
      fields.find((field) => field instanceof HTMLTextAreaElement) ??
      fields[0];

    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLSelectElement ||
      target instanceof HTMLTextAreaElement
    ) {
      target.focus({ preventScroll: true });
    }
  });

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

    if (reduceMotion) {
      const rafId = requestAnimationFrame(() => focusFirstEmptyField(form));
      return () => cancelAnimationFrame(rafId);
    }

    let frameId = 0;
    let previousTop = Number.POSITIVE_INFINITY;
    let stableFrames = 0;
    const startedAt = performance.now();

    const checkScrollSettle = () => {
      const currentTop = form.getBoundingClientRect().top;

      if (Math.abs(currentTop - previousTop) <= 4) {
        stableFrames += 1;
      } else {
        stableFrames = 0;
      }

      previousTop = currentTop;

      if (stableFrames >= 2 || performance.now() - startedAt >= 800) {
        focusFirstEmptyField(form);
        return;
      }

      frameId = requestAnimationFrame(checkScrollSettle);
    };

    frameId = requestAnimationFrame(checkScrollSettle);

    return () => cancelAnimationFrame(frameId);
  }, [consumeScrollTarget, scrollTarget]);

  return null;
}
