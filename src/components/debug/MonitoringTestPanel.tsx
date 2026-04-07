"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export function MonitoringTestPanel() {
  const [serverResult, setServerResult] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function triggerClientCapture() {
    const error = new Error("Monitoring test client error");
    Sentry.captureException(error, {
      tags: {
        area: "monitoring_test_client",
      },
    });
    setServerResult("Client error sent to Sentry. Check preview issues.");
  }

  async function triggerServerCapture() {
    setIsSubmitting(true);
    setServerResult(null);

    try {
      const response = await fetch("/api/monitoring-test", {
        method: "POST",
        cache: "no-store",
      });
      const data = (await response.json()) as { status?: string; message?: string };
      setServerResult(
        data.message ??
          `Server route responded with ${response.status}. Check Sentry for the captured issue.`,
      );
    } catch (error) {
      setServerResult(
        error instanceof Error ? error.message : "Monitoring test request failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="monitoring-test">
      <div className="monitoring-test__card">
        <p className="monitoring-test__eyebrow">Internal QA Only</p>
        <h1>Monitoring Test Controls</h1>
        <p>
          Use these controls on preview after enabling the monitoring test env flag.
          This route is not linked publicly and should stay noindex.
        </p>

        <div className="monitoring-test__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={triggerClientCapture}
          >
            Trigger client capture
          </button>
          <button
            type="button"
            className="btn btn--outline"
            onClick={triggerServerCapture}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Triggering..." : "Trigger server capture"}
          </button>
        </div>

        {serverResult ? (
          <p className="monitoring-test__status" role="status">
            {serverResult}
          </p>
        ) : null}
      </div>
    </section>
  );
}
