/**
 * DashboardTool — Studio Phase 2, PR 2: GROQ health queries.
 *
 * Replaces the static placeholder counts from PR 1 with live read-only data:
 *   - "Bản nháp"     — editorial draft count (content_article + post)
 *   - "Đã đăng"      — live content count (articles/posts published + pages/hubs)
 *   - "Thiếu SEO"    — docs with missing/short SEO description
 *   - "Thiếu ảnh bìa" — content_article without coverImage
 *   - "Mới cập nhật"  — top 8 recently-updated docs, cross-type
 *
 * Loading → shows "—" with a subtle animation class.
 * Error   → shows "—" with an error tooltip.
 * Empty   → shows "0" (a real count, not a placeholder).
 *
 * All fetches are read-only.  No mutations.  No links/actions added beyond PR 1.
 * Static placeholder sections (Lối tắt sửa nhanh / Nhóm nội dung / Mở trang
 * trực tiếp) are unchanged — those get interactive in PR 3.
 *
 * Companion spec: .claude/CMS/v2badminton-studio-ui-ux-phase-2-dashboard-plan.md
 * Query spec:     src/sanity/tools/dashboardQueries.ts
 */

import React, { useEffect, useState } from "react";
import { useClient } from "sanity";
import type { Tool } from "sanity";
import {
  DASHBOARD_API_VERSION,
  DASHBOARD_QUERY,
  type DashboardQueryResult,
  type DashboardRecentItem,
} from "./dashboardQueries";

// ─── Data-fetch hook ──────────────────────────────────────────────────────────

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: DashboardQueryResult };

function useDashboardData(): LoadState {
  const client = useClient({ apiVersion: DASHBOARD_API_VERSION });
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    client
      .fetch<DashboardQueryResult>(DASHBOARD_QUERY)
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message:
              err instanceof Error
                ? err.message
                : "Lỗi khi tải dữ liệu dashboard.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // NOTE: `client` is intentionally excluded from deps — it is stable for the
  // lifetime of the Studio session (same reference from useClient) and re-adding
  // it would trigger an unnecessary refetch on every render cycle.

  return state;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Human-readable Vietnamese labels for each Sanity type. */
const TYPE_LABELS: Record<string, string> = {
  content_article: "Bài viết",
  content_hub: "Hub",
  content_node: "Node",
  money_page: "Money page",
  static_page: "Trang tĩnh",
  post: "Blog post",
};

/** Relative time in Vietnamese, falls back to dd/mm/yyyy. */
function relativeVi(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 2) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  return new Date(iso).toLocaleDateString("vi-VN");
}

// ─── Sub-components ───────────────────────────────────────────────────────────
// Plain HTML + CSS custom-properties so the component inherits the Studio theme
// without a direct @sanity/ui import (that package is nested inside
// sanity/node_modules, not the project root).

type StatTileProps = {
  label: string;
  tone?: "default" | "caution" | "critical";
  value: string | number;
  /** Optional clarifying description shown below the count when data is ready. */
  description?: string;
  loading?: boolean;
  errorMessage?: string;
};

function StatTile({
  label,
  tone = "default",
  value,
  description,
  loading = false,
  errorMessage,
}: StatTileProps) {
  const borderVar =
    tone === "critical"
      ? "var(--red-400, #f87171)"
      : tone === "caution"
        ? "var(--yellow-400, #fbbf24)"
        : "var(--card-border-color, #e5e7eb)";

  const displayValue = loading ? "—" : String(value);
  const subLabel = errorMessage
    ? "Lỗi tải dữ liệu"
    : loading
      ? "Đang tải…"
      : (description ?? null);

  return (
    <div
      style={{
        border: `1px solid ${borderVar}`,
        borderRadius: 6,
        padding: "16px 20px",
        background: "var(--card-bg-color, #ffffff)",
        opacity: loading ? 0.7 : 1,
        transition: "opacity 0.2s",
      }}
      title={errorMessage}
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
        {displayValue}
      </p>
      {subLabel ? (
        <p
          style={{
            fontSize: 11,
            color: errorMessage
              ? "var(--red-400, #f87171)"
              : "var(--card-muted-fg-color, #6b7280)",
            margin: 0,
          }}
        >
          {subLabel}
        </p>
      ) : null}
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
};

function PlaceholderCard({ label, description }: PlaceholderCardProps) {
  return (
    <div
      style={{
        border: "1px solid var(--card-border-color, #e5e7eb)",
        borderRadius: 6,
        padding: "12px 16px",
        background: "var(--card-bg-color, #ffffff)",
        opacity: 0.65,
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

/** Recently-updated list item (PR 2: display-only, no edit links until PR 3). */
function RecentItem({ item }: { item: DashboardRecentItem }) {
  const typeLabel = TYPE_LABELS[item._type] ?? item._type;
  const title = item.title.length > 50
    ? `${item.title.slice(0, 48)}…`
    : item.title;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 12,
        padding: "8px 0",
        borderBottom: "1px solid var(--card-border-color, #e5e7eb)",
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <span
          style={{
            fontSize: 13,
            color: "var(--card-fg-color, #111827)",
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: 11,
            color: "var(--card-muted-fg-color, #6b7280)",
          }}
        >
          {typeLabel}
        </span>
      </div>
      <span
        style={{
          fontSize: 11,
          color: "var(--card-muted-fg-color, #6b7280)",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {relativeVi(item._updatedAt)}
      </span>
    </div>
  );
}

// ─── Main tool component ──────────────────────────────────────────────────────

// PR 1: shell only — the `tool` prop is required by the Studio API but not
// consumed yet.  It will carry routing options when we add deep-links in PR 3.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DashboardTool(_props: { tool: Tool }) {
  const loadState = useDashboardData();

  const isLoading = loadState.status === "loading";
  const isError = loadState.status === "error";
  const errorMessage = isError ? loadState.message : undefined;
  const data = loadState.status === "ready" ? loadState.data : null;

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

      {/* ── Content health tiles ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <SectionHeading>Tình trạng nội dung</SectionHeading>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12,
          }}
        >
          <StatTile
            label="Nháp biên tập"
            value={data?.draftCount ?? "—"}
            description="Bài viết/post có trạng thái draft"
            loading={isLoading}
            errorMessage={errorMessage}
          />
          <StatTile
            label="Đã đăng"
            value={data?.publishedCount ?? "—"}
            loading={isLoading}
            errorMessage={errorMessage}
          />
          <StatTile
            label="Thiếu SEO"
            tone="critical"
            value={data?.missingSeoCount ?? "—"}
            loading={isLoading}
            errorMessage={errorMessage}
          />
          <StatTile
            label="Thiếu ảnh bìa"
            tone="caution"
            value={data?.missingCoverCount ?? "—"}
            loading={isLoading}
            errorMessage={errorMessage}
          />
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
        {/* Recently updated — live in PR 2 */}
        <div>
          <SectionHeading>Mới cập nhật</SectionHeading>
          <div
            style={{
              border: "1px solid var(--card-border-color, #e5e7eb)",
              borderRadius: 6,
              background: "var(--card-bg-color, #ffffff)",
              padding: "4px 16px 4px",
              minHeight: 80,
            }}
          >
            {isLoading ? (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--card-muted-fg-color, #6b7280)",
                  margin: "16px 0",
                  textAlign: "center",
                }}
              >
                Đang tải…
              </p>
            ) : isError ? (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--red-400, #f87171)",
                  margin: "16px 0",
                  textAlign: "center",
                }}
              >
                Không thể tải danh sách.
              </p>
            ) : data && data.recentlyUpdated.length > 0 ? (
              <>
                {data.recentlyUpdated.map((item) => (
                  <RecentItem key={item._id} item={item} />
                ))}
              </>
            ) : (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--card-muted-fg-color, #6b7280)",
                  margin: "16px 0",
                  textAlign: "center",
                }}
              >
                Chưa có nội dung nào.
              </p>
            )}
          </div>
        </div>

        {/* Quick-edit shortcuts — placeholders until PR 3 */}
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

      {/* ── Content groups — placeholders until PR 3 ────────────────────── */}
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

      {/* ── Open-live-page quick links — placeholders until PR 3 ────────── */}
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
          Liên kết trực tiếp và bảng vận hành nội dung sẽ được bổ sung trong
          bản cập nhật tiếp theo.
        </p>
      </div>
    </div>
  );
}
