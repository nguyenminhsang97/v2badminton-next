import * as Sentry from "@sentry/nextjs";

type MonitoringContext = {
  tags?: Record<string, string>;
  extras?: Record<string, unknown>;
};

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return error;
  }

  return new Error(typeof error === "string" ? error : "Unknown error");
}

export function captureException(
  error: unknown,
  context: MonitoringContext = {},
) {
  const normalizedError = normalizeError(error);

  Sentry.withScope((scope) => {
    for (const [key, value] of Object.entries(context.tags ?? {})) {
      scope.setTag(key, value);
    }

    for (const [key, value] of Object.entries(context.extras ?? {})) {
      scope.setExtra(key, value);
    }

    Sentry.captureException(normalizedError);
  });
}
