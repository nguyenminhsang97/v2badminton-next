import Link from "next/link";
import { moneyPages, routeCards } from "@/lib/site";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: "1120px",
        margin: "0 auto",
        padding: "64px 24px 96px",
        display: "grid",
        gap: "40px",
      }}
    >
      <section
        style={{
          display: "grid",
          gap: "18px",
          padding: "32px",
          background: "rgba(30,30,30,0.72)",
          border: "1px solid rgba(200,245,66,0.12)",
        }}
      >
        <p
          style={{
            color: "var(--v2-lime)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontSize: "0.8rem",
            fontWeight: 700,
          }}
        >
          Migration Sandbox
        </p>
        <h1
          style={{
            fontSize: "clamp(2.2rem, 6vw, 4.4rem)",
            lineHeight: 1.05,
            color: "var(--v2-white)",
          }}
        >
          V2 Badminton
          <br />
          Next.js Baseline
        </h1>
        <p style={{ color: "var(--v2-muted)", maxWidth: "780px", lineHeight: 1.7 }}>
          Đây là repo/app mới để rebuild website V2 Badminton bằng Next.js App Router
          trên Vercel. Bản này chưa thay thế production hiện tại; mục tiêu của giai đoạn
          đầu là giữ parity cho SEO, tracking, và conversion flow trước khi cutover.
        </p>
      </section>

      <section style={{ display: "grid", gap: "16px" }}>
        <h2 style={{ fontSize: "1.5rem", color: "var(--v2-white)" }}>Routes cần giữ nguyên</h2>
        <div
          style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {routeCards.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              style={{
                display: "grid",
                gap: "10px",
                padding: "20px",
                background: "rgba(20,20,20,0.92)",
                border: "1px solid rgba(200,245,66,0.1)",
              }}
            >
              <span style={{ color: "var(--v2-lime)", fontSize: "0.85rem", fontWeight: 700 }}>
                {route.href}
              </span>
              <strong style={{ color: "var(--v2-white)", fontSize: "1.05rem" }}>
                {route.title}
              </strong>
              <span style={{ color: "var(--v2-muted)", lineHeight: 1.6 }}>{route.summary}</span>
            </Link>
          ))}
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gap: "14px",
          padding: "28px",
          background: "rgba(20,20,20,0.92)",
          border: "1px solid rgba(200,245,66,0.1)",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", color: "var(--v2-white)" }}>
          Acceptance Criteria Trước Khi Cutover
        </h2>
        <ul style={{ display: "grid", gap: "10px", color: "var(--v2-light)", paddingLeft: "20px" }}>
          <li>Preserve schedule -&gt; form prefill -&gt; scroll -&gt; focus.</li>
          <li>Preserve current GTM/GA4/Meta tracking semantics.</li>
          <li>Form có server-side fallback qua <code>/api/lead</code>.</li>
          <li>Zalo mobile dùng deeplink, desktop có fallback rõ ràng.</li>
          <li>Location cards có cả Google Maps link và local deep link.</li>
          <li>Schema, sitemap, robots, canonical parity với bản production hiện tại.</li>
        </ul>
      </section>

      <section style={{ display: "grid", gap: "16px" }}>
        <h2 style={{ fontSize: "1.5rem", color: "var(--v2-white)" }}>
          Money Pages Mở Rộng Sau Replatform
        </h2>
        <div
          style={{
            display: "grid",
            gap: "12px",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          {moneyPages.map((page) => (
            <article
              key={page.slug}
              style={{
                padding: "18px",
                border: "1px solid rgba(200,245,66,0.08)",
                background: "rgba(20,20,20,0.82)",
              }}
            >
              <strong style={{ color: "var(--v2-white)" }}>{page.title}</strong>
              <p style={{ color: "var(--v2-muted)", marginTop: "8px", lineHeight: 1.6 }}>
                {page.intent}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
