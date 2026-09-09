/**
 * ContentOpsTable — Studio Phase 2, PR 4A.
 *
 * Sortable multi-column table of every routable document with at-a-glance
 * readiness signals.  Read-only; no mutations on any interaction.
 *
 * Data flow:
 *   CONTENT_OPS_QUERY (dashboardQueries.ts)
 *     → raw rows (published + drafts.* twins)
 *     → groupRows() (contentOpsStatus.ts)
 *     → one ContentOpsRow per logical document
 *     → rendered table
 *
 * Columns: Tiêu đề | Loại | Trạng thái | SEO | Cover | Cập nhật | ↗ | ✎
 * Controls: Type filter | Status filter | Title search | Click-header sort
 *
 * No pagination (200-row cap from the query; current corpus ~30 docs).
 * No virtualization (plain <table> with overflow-y auto).
 * No bulk actions — this surface is presentational.
 */

import React, { useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";
import { CONTENT_OPS_QUERY } from "./dashboardQueries";
import {
  groupRows,
  buildEditIntent,
  resolveOpsPath,
  type ContentOpsRow,
  type RawOpsRow,
  type StatusChip,
} from "../lib/contentOpsStatus";
import { SITE_URL } from "../lib/resolvePath";

// ─── Data-fetch hook ──────────────────────────────────────────────────────

const API_VERSION = "2026-04-09";

type OpsLoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; rows: ContentOpsRow[] };

function useContentOps(): OpsLoadState {
  const client = useClient({ apiVersion: API_VERSION });
  const [state, setState] = useState<OpsLoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    client
      .fetch<RawOpsRow[]>(CONTENT_OPS_QUERY)
      .then((raw) => {
        if (!cancelled) setState({ status: "ready", rows: groupRows(raw) });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message:
              err instanceof Error
                ? err.message
                : "Lỗi khi tải bảng vận hành nội dung.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

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
  if (minutes < 60) return `${minutes} phút`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày`;
  return new Date(iso).toLocaleDateString("vi-VN");
}

type SortKey = keyof Pick<
  ContentOpsRow,
  "_type" | "title" | "statusChip" | "seoStatus" | "coverStatus" | "updatedAt"
>;

function sortRows(
  rows: ContentOpsRow[],
  key: SortKey,
  dir: "asc" | "desc",
): ContentOpsRow[] {
  return [...rows].sort((a, b) => {
    const av = a[key] ?? "";
    const bv = b[key] ?? "";
    const cmp =
      key === "updatedAt"
        ? av < bv
          ? -1
          : av > bv
            ? 1
            : 0
        : String(av).localeCompare(String(bv), "vi");
    return dir === "asc" ? cmp : -cmp;
  });
}

// ─── Chip colours ─────────────────────────────────────────────────────────

const CHIP_STYLE: Record<StatusChip, React.CSSProperties> = {
  "Đã đăng": {
    background: "var(--green-100, #dcfce7)",
    color: "var(--green-700, #15803d)",
  },
  Nháp: {
    background: "var(--yellow-100, #fef9c3)",
    color: "var(--yellow-800, #854d0e)",
  },
  "Ẩn khỏi Google": {
    background: "var(--gray-100, #f3f4f6)",
    color: "var(--gray-600, #4b5563)",
  },
  "Có thay đổi chưa đăng": {
    background: "var(--blue-100, #dbeafe)",
    color: "var(--blue-700, #1d4ed8)",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────

function StatusBadge({ chip }: { chip: StatusChip }) {
  return (
    <span
      style={{
        ...CHIP_STYLE[chip],
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 7px",
        borderRadius: 4,
        whiteSpace: "nowrap",
      }}
    >
      {chip}
    </span>
  );
}

function SortableHeader({
  label,
  sortKey,
  current,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: "asc" | "desc";
  onSort: (key: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      style={{
        padding: "8px 10px",
        textAlign: "left",
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: active
          ? "var(--card-fg-color, #111827)"
          : "var(--card-muted-fg-color, #6b7280)",
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
        borderBottom: "1px solid var(--card-border-color, #e5e7eb)",
        background: "var(--card-bg-color, #ffffff)",
      }}
    >
      {label}
      {active ? (dir === "asc" ? " ▲" : " ▼") : ""}
    </th>
  );
}

const TH_FIXED: React.CSSProperties = {
  padding: "8px 10px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--card-muted-fg-color, #6b7280)",
  whiteSpace: "nowrap",
  borderBottom: "1px solid var(--card-border-color, #e5e7eb)",
  background: "var(--card-bg-color, #ffffff)",
};

const TD: React.CSSProperties = {
  padding: "7px 10px",
  fontSize: 13,
  color: "var(--card-fg-color, #111827)",
  borderBottom: "1px solid var(--card-border-color, #e5e7eb)",
  verticalAlign: "middle",
};

const TD_MUTED: React.CSSProperties = {
  ...TD,
  color: "var(--card-muted-fg-color, #6b7280)",
};

// ─── Main component ───────────────────────────────────────────────────────

export function ContentOpsTable() {
  const loadState = useContentOps();

  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "updatedAt" ? "desc" : "asc");
    }
  }

  const allRows = useMemo(
    () => (loadState.status === "ready" ? loadState.rows : []),
    [loadState],
  );

  // Collect unique type + status values for dropdowns
  const typeOptions = useMemo(() => {
    const seen = new Set<string>();
    for (const r of allRows) seen.add(r._type);
    return [...seen].sort();
  }, [allRows]);

  const statusOptions = useMemo(() => {
    const seen = new Set<string>();
    for (const r of allRows) seen.add(r.statusChip);
    return [...seen].sort();
  }, [allRows]);

  const visibleRows = useMemo(() => {
    let filtered = allRows;
    if (filterType) filtered = filtered.filter((r) => r._type === filterType);
    if (filterStatus)
      filtered = filtered.filter((r) => r.statusChip === filterStatus);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((r) => r.title.toLowerCase().includes(q));
    }
    return sortRows(filtered, sortKey, sortDir);
  }, [allRows, filterType, filterStatus, search, sortKey, sortDir]);

  const isLoading = loadState.status === "loading";
  const isError = loadState.status === "error";

  return (
    <div>
      {/* Controls row */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 14,
          alignItems: "center",
        }}
      >
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={SELECT_STYLE}
          aria-label="Lọc theo loại"
        >
          <option value="">Tất cả loại</option>
          {typeOptions.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t] ?? t}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={SELECT_STYLE}
          aria-label="Lọc theo trạng thái"
        >
          <option value="">Tất cả trạng thái</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          type="search"
          placeholder="Tìm theo tiêu đề…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...SELECT_STYLE, flex: "1 1 180px", maxWidth: 280 }}
          aria-label="Tìm kiếm tiêu đề"
        />

        {loadState.status === "ready" && (
          <span
            style={{
              fontSize: 11,
              color: "var(--card-muted-fg-color, #6b7280)",
              marginLeft: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {visibleRows.length}/{allRows.length} tài liệu
          </span>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
            background: "var(--card-bg-color, #ffffff)",
            border: "1px solid var(--card-border-color, #e5e7eb)",
            borderRadius: 6,
          }}
        >
          <thead>
            <tr>
              <SortableHeader
                label="Tiêu đề"
                sortKey="title"
                current={sortKey}
                dir={sortDir}
                onSort={handleSort}
              />
              <SortableHeader
                label="Loại"
                sortKey="_type"
                current={sortKey}
                dir={sortDir}
                onSort={handleSort}
              />
              <SortableHeader
                label="Trạng thái"
                sortKey="statusChip"
                current={sortKey}
                dir={sortDir}
                onSort={handleSort}
              />
              <SortableHeader
                label="SEO"
                sortKey="seoStatus"
                current={sortKey}
                dir={sortDir}
                onSort={handleSort}
              />
              <SortableHeader
                label="Cover"
                sortKey="coverStatus"
                current={sortKey}
                dir={sortDir}
                onSort={handleSort}
              />
              <SortableHeader
                label="Cập nhật"
                sortKey="updatedAt"
                current={sortKey}
                dir={sortDir}
                onSort={handleSort}
              />
              <th style={TH_FIXED}>Trang</th>
              <th style={TH_FIXED}>Sửa</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={8} style={{ ...TD_MUTED, textAlign: "center", padding: 24 }}>
                  Đang tải…
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td
                  colSpan={8}
                  style={{ ...TD, textAlign: "center", padding: 24, color: "var(--red-400, #f87171)" }}
                >
                  {(loadState as { status: "error"; message: string }).message}
                </td>
              </tr>
            )}
            {!isLoading && !isError && visibleRows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ ...TD_MUTED, textAlign: "center", padding: 24 }}>
                  Không tìm thấy tài liệu nào.
                </td>
              </tr>
            )}
            {visibleRows.map((row) => (
              <OpsRow key={row.baseId} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const SELECT_STYLE: React.CSSProperties = {
  fontSize: 12,
  padding: "5px 8px",
  border: "1px solid var(--card-border-color, #e5e7eb)",
  borderRadius: 4,
  background: "var(--card-bg-color, #ffffff)",
  color: "var(--card-fg-color, #111827)",
  cursor: "pointer",
};

function OpsRow({ row }: { row: ContentOpsRow }) {
  const title =
    row.title.length > 50 ? `${row.title.slice(0, 48)}…` : row.title;
  const liveUrl = (() => {
    const p = resolveOpsPath(row);
    return p ? `${SITE_URL}${p}` : null;
  })();
  const editUrl = buildEditIntent(row.baseId, row._type);

  return (
    <tr
      style={{
        transition: "background 0.1s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLTableRowElement).style.background =
          "var(--card-hover-bg, #f9fafb)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLTableRowElement).style.background = "";
      }}
    >
      {/* Tiêu đề */}
      <td style={TD} title={row.title}>
        {title}
      </td>

      {/* Loại */}
      <td style={TD_MUTED}>{TYPE_LABELS[row._type] ?? row._type}</td>

      {/* Trạng thái */}
      <td style={{ ...TD, whiteSpace: "nowrap" }}>
        <StatusBadge chip={row.statusChip} />
      </td>

      {/* SEO */}
      <td
        style={{
          ...TD,
          color:
            row.seoStatus === "✓"
              ? "var(--green-600, #16a34a)"
              : "var(--yellow-600, #d97706)",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        {row.seoStatus}
      </td>

      {/* Cover */}
      <td
        style={{
          ...TD,
          color:
            row.coverStatus === "✓"
              ? "var(--green-600, #16a34a)"
              : row.coverStatus === "—"
                ? "var(--yellow-600, #d97706)"
                : "var(--card-muted-fg-color, #6b7280)",
          fontWeight: row.coverStatus === "Không áp dụng" ? 400 : 600,
          textAlign: "center",
          fontSize: row.coverStatus === "Không áp dụng" ? 11 : 13,
        }}
      >
        {row.coverStatus}
      </td>

      {/* Cập nhật */}
      <td
        style={{ ...TD_MUTED, whiteSpace: "nowrap" }}
        title={new Date(row.updatedAt).toLocaleString("vi-VN")}
      >
        {relativeVi(row.updatedAt)}
      </td>

      {/* Mở trang trực tiếp ↗ */}
      <td style={{ ...TD, textAlign: "center" }}>
        {liveUrl ? (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={liveUrl}
            style={{
              color: "var(--card-fg-color, #111827)",
              textDecoration: "none",
              fontSize: 15,
              opacity: 0.75,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = "0.75";
            }}
          >
            ↗
          </a>
        ) : (
          <span
            style={{
              color: "var(--card-muted-fg-color, #6b7280)",
              fontSize: 13,
            }}
            title="Chưa có slug/fullPath"
          >
            —
          </span>
        )}
      </td>

      {/* Mở trong Studio ✎ */}
      <td style={{ ...TD, textAlign: "center" }}>
        <a
          href={editUrl}
          title="Mở trong Studio"
          style={{
            color: "var(--card-fg-color, #111827)",
            textDecoration: "none",
            fontSize: 14,
            opacity: 0.75,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.opacity = "0.75";
          }}
        >
          ✎
        </a>
      </td>
    </tr>
  );
}
