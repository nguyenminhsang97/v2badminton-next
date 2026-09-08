import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

export function GoogleAnalytics() {
  if (!GA_ID) {
    return null;
  }

  return (
    <>
      {/*
        The library is the expensive half — 167 KiB transferred and ~460 ms of
        main-thread blocking measured on production, the single heaviest
        third-party on the page. `lazyOnload` moves that off the critical path
        to browser idle time after load.

        No events are lost by doing this, because the shim below still runs at
        `afterInteractive`. It defines `window.gtag` as a dataLayer push in
        gtag's own command format, so every trackEvent() and Web Vital fired
        before the library arrives is queued and replayed once it loads. That is
        exactly why Google's own snippet declares the shim inline and separately
        from the async <script>. Do not merge these two back together, and do
        not move the shim to lazyOnload — either change silently drops early
        events (CTA clicks in the first seconds, TTFB and FCP vitals).
      */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `,
        }}
      />
    </>
  );
}
