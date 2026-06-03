/**
 * DashboardTool — Studio Phase 2, PR 1: static shell / navigation skeleton.
 *
 * This is the first tier of the "Bảng điều khiển" (Dashboard) custom Studio
 * tool.  PR 1 ships the layout skeleton, Vietnamese section headings, and
 * placeholder cards only — no GROQ queries, no live counts, no mutations.
 *
 * PR 2 will wire the content-health GROQ queries into the stat tiles.
 * PR 3 will add the quick-links / "Mở trang trực tiếp" section.
 *
 * Companion spec: .claude/CMS/v2badminton-studio-ui-ux-phase-2-dashboard-plan.md
 */

import React from "react";
import type { Tool } from "sanity";

// ─── Sub-components (plain HTML + CSS custom-properties) ─────────────────────
// We deliberately avoid @sanity/ui primitives here because that package is
// nested inside sanity's own node_modules and not directly addressable from
// this project's root.  Using CSS custom-properties means we inherit the
// Studio's active theme (light / dark) automatically.

type StatTileProps = {
  label: string;
  tone?: "default" | "caution" | "critical";
};

function StatTile({ label, tone = "default" }: StatTileProps) {
  const borderVar =
    tone === "critical"
      ? "var(--red-400, #f87171)"
      : tone === "caution"
        ? "var(--yellow-400, #fbbf24)"
        : "var(--card-border-color, #e5e7eb)";

  return (
    <div
      style={{
        border: `1px solid ${borderVar}`,
        borderRadius: 6,
        padding: "16px 20px",
        background: "var(--card-bg-color, #ffffff)",
      }}
    >
      <p
        style={{
          fontSize: 11,
          color: "var(--card-muted-fg-color, #6b7280)",
          margin: "0 0 8px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontWeight: 600,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 28,
          fontWeight: 700,
          margin: "0 0 4px",
          color: "var(--card-fg-color, #111827)",
          lineHeight: 1,
        }}
      >
        —
      </p>
      <p
        style={{
          fontSize: 11,
          color: "var(--card-muted-fg-color, #6b7280)",
          margin: 0,
        }}
      >
        Chưa có dữ liệu
      </p>
    </div>
  );
}

type SectionHeadingProps = { children: React.ReactNode };

function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2
      style={{
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "var(--card-muted-fg-color, #6b7280)",
        margin: "0 0 12px",
      }}
    >
      {children}
    </h2>
  );
}

type PlaceholderCardProps = {
  label: string;
  description?: string;
  disabled?: boolean;
};

function PlaceholderCard({
  label,
  description,
  disabled = true,
}: PlaceholderCardProps) {
  return (
    <div
      style={{
        border: "1px solid var(--card-border-color, #e5e7eb)",
        borderRadius: 6,
        padding: "12px 16px",
        background: "var(--card-bg-color, #ffffff)",
        opacity: disabled ? 0.65 : 1,
      }}
    >
      <p
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--card-fg-color, #111827)",
          margin: "0 0 2px",
        }}
      >
        {label}
      </p>
      {description ? (
        <p
          style={{
            fontSize: 11,
            color: "var(--card-muted-fg-color, #6b7280)",
            margin: 0,
          }}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

// ─── Main tool component ──────────────────────────────────────────────────────

// PR 1: shell only — the `tool` prop is required by the Studio API but not
// consumed yet.  It will carry routing options when we add deep-links in PR 3.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DashboardTool(_props: { tool: Tool }) {
  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        boxSizing: "border-box",
        background: "var(--card-bg-color, #f9fafb)",
        padding: "28px 32px",
      }}
    >
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            margin: "0 0 4px",
            color: "var(--card-fg-color, #111827)",
          }}
        >
          Bảng điều khiển
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "var(--card-muted-fg-color, #6b7280)",
            margin: 0,
          }}
        >
          V2 Badminton CMS — tổng quan trạng thái website
        </p>
      </div>

      {/* ── Content health ──────────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <SectionHeading>Tình trạng nội dung</SectionHeading>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12,
          }}
        >
          <StatTile label="Bản nháp" />
          <StatTile label="Đã đăng" />
          <StatTile label="Thiếu SEO" tone="critical" />
          <StatTile label="Thiếu ảnh bìa" tone="caution" />
        </div>
      </div>

      {/* ── Two-column: recently updated + quick-edit shortcuts ─────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 32,
        }}
      >
        {/* Recently updated */}
        <div>
          <SectionHeading>Mới cập nhật</SectionHeading>
          <div
            style={{
              border: "1px solid var(--card-border-color, #e5e7eb)",
              borderRadius: 6,
              background: "var(--card-bg-color, #ffffff)",
              padding: "20px 16px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "var(--card-muted-fg-color, #6b7280)",
                margin: 0,
              }}
            >
              Danh sách nội dung mới cập nhật sẽ xuất hiện ở đây.
            </p>
          </div>
        </div>

        {/* Quick-edit shortcuts (non-functional in PR 1) */}
        <div>
          <SectionHeading>Lối tắt sửa nhanh</SectionHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <PlaceholderCard
              label="Nội dung trang chủ"
              description="Hero, stats bar, các section"
            />
            <PlaceholderCard
              label="Cài đặt website"
              description="Liên hệ, nav, footer, microcopy"
            />
            <PlaceholderCard
              label="Bài viết kỹ thuật"
              description="Hub kỹ thuật cầu lông"
            />
            <PlaceholderCard label="Money pages" description="9 trang dịch vụ" />
          </div>
        </div>
      </div>

      {/* ── Content groups ──────────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <SectionHeading>Nhóm nội dung</SectionHeading>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          <PlaceholderCard label="Bài viết" description="content_article" />
          <PlaceholderCard label="Money pages" description="money_page" />
          <PlaceholderCard label="Trang tĩnh" description="static_page" />
          <PlaceholderCard label="Cài đặt website" description="site_settings" />
        </div>
      </div>

      {/* ── Open-live-page quick links ───────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <SectionHeading>Mở trang trực tiếp</SectionHeading>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          <PlaceholderCard label="Trang chủ" description="v2badminton.com/" />
          <PlaceholderCard
            label="Kỹ thuật cầu lông"
            description="v2badminton.com/ky-thuat-cau-long/"
          />
          <PlaceholderCard
            label="Giới thiệu"
            description="v2badminton.com/gioi-thieu/"
          />
        </div>
      </div>

      {/* ── Footer note ─────────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid var(--card-border-color, #e5e7eb)",
          paddingTop: 16,
          marginTop: 8,
        }}
      >
        <p
          style={{
            fontSize: 11,
            color: "var(--card-muted-fg-color, #6b7280)",
            margin: 0,
            textAlign: "center",
          }}
        >
          Số liệu thực, liên kết trực tiếp và bảng vận hành nội dung sẽ được bổ
          sung trong các bản cập nhật tiếp theo.
        </p>
      </div>
    </div>
  );
}
