const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Lazy handle — set once Sentry loads; undefined until then.
let _captureRouterTransitionStart: ((href: string, navigationType: string) => void) | undefined;

// Next.js reads this export from instrumentation-client to hook router transitions.
// We delegate to Sentry once it has been lazily initialised. Transitions that
// happen in the first ~1–2 s (before the idle callback fires) are not captured —
// accepted tradeoff for removing ~200 KB from the initial JS critical path.
export function onRouterTransitionStart(href: string, navigationType: string) {
  _captureRouterTransitionStart?.(href, navigationType);
}

if (sentryDsn) {
  const initSentry = async () => {
    const { init, captureRouterTransitionStart } = await import("@sentry/nextjs");
    init({
      dsn: sentryDsn,
      enabled: true,
      ignoreErrors: ["TurnstileError: [Cloudflare Turnstile] Error: 110200."],
      tracesSampleRate: process.env.NODE_ENV === "development" ? 1 : 0.1,
    });
    _captureRouterTransitionStart = captureRouterTransitionStart;
  };

  if (typeof window !== "undefined") {
    // requestIdleCallback defers until the browser has finished its current
    // work queue. The 3 s timeout ensures Sentry loads even on a busy tab.
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => void initSentry(), { timeout: 3000 });
    } else {
      // Safari < 16 fallback
      setTimeout(() => void initSentry(), 1500);
    }
  }
}
