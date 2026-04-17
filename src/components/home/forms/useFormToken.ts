"use client";

import { useEffect, useState } from "react";

export function useFormToken() {
  const [formToken, setFormToken] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadFormToken() {
      try {
        const response = await fetch("/api/form-token", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { token?: unknown };
        if (!cancelled && typeof data.token === "string") {
          setFormToken(data.token);
        }
      } catch (error) {
        console.error("Failed to load form token", error);
      }
    }

    void loadFormToken();

    return () => {
      cancelled = true;
    };
  }, []);

  return formToken;
}
