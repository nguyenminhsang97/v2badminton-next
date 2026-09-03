import { useEffect, useState } from "react";
import { useClient, useFormValue } from "sanity";
import type { SlugInputProps } from "sanity";

/**
 * FullPathPreviewInput — custom Sanity Studio input for the `fullPath` slug field.
 *
 * Renders above the default Generate-button widget:
 * 1. A color-segmented URL breadcrumb showing the predicted full path
 *    (hub segment = green, node segments = blue, own slug = dark/bold).
 * 2. A live route-uniqueness status line ("✓ Route unique" / "⚠ Conflicts with…").
 *
 * Wired via `components: { input: FullPathPreviewInput }` in defineFullPathField()
 * in contentShared.ts — applies to content_hub, content_node, content_article.
 *
 * Constants are intentionally inlined here to avoid a circular import with
 * contentShared.ts (which defines findPathConflict and also calls defineField
 * with this component).
 */

const API_VERSION = "2026-04-09";
const ROUTABLE_TYPES = [
  "content_hub",
  "content_node",
  "content_article",
  "court",
] as const;

function normalizePath(input: string): string {
  const trimmed = (input ?? "").trim().toLowerCase().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}/` : "/";
}

type ParentDoc = {
  _id?: string;
  slug?: { current?: string };
  parentHub?: { _ref?: string };
  parentNode?: { _ref?: string };
};

type ConflictStatus =
  | { state: "idle" }
  | { state: "ok" }
  | { state: "conflict"; name: string }
  | { state: "error" };

export function FullPathPreviewInput(props: SlugInputProps) {
  const client = useClient({ apiVersion: API_VERSION });
  const doc = useFormValue([]) as ParentDoc;

  const currentSlug = doc?.slug?.current ?? "";
  const parentHubRef = doc?.parentHub?._ref;
  const parentNodeRef = doc?.parentNode?._ref;
  const docId = doc?._id?.replace(/^drafts\./, "") ?? "";

  const [parentPath, setParentPath] = useState("/");
  const [status, setStatus] = useState<ConflictStatus>({ state: "idle" });

  // Resolve parent fullPath (hub OR nearest node) from Sanity.
  // Uses Promise.resolve("/") for the no-parent (hub) case to keep all
  // setState calls inside async callbacks — avoids react-hooks/set-state-in-effect.
  useEffect(() => {
    const parentRef = parentNodeRef ?? parentHubRef;
    let cancelled = false;

    const resolvePath: Promise<string> = parentRef
      ? client
          .fetch<{ fullPath?: { current?: string } } | null>(
            `*[_id in [$id, $draftId]][0]{fullPath}`,
            { id: parentRef, draftId: `drafts.${parentRef}` },
          )
          .then((parent) => parent?.fullPath?.current ?? "/")
          .catch(() => "/")
      : Promise.resolve("/");

    resolvePath.then((path) => {
      if (!cancelled) setParentPath(path);
    });

    return () => {
      cancelled = true;
    };
  }, [client, parentHubRef, parentNodeRef]);

  // Compute predicted full path from resolved parent + own slug
  const predictedPath = currentSlug
    ? normalizePath(`${parentPath.replace(/\/$/, "")}/${currentSlug}`)
    : null;

  // Check route uniqueness whenever predicted path changes.
  // All setState calls are inside Promise callbacks — avoids react-hooks/set-state-in-effect.
  // No "checking" intermediate state; status jumps directly to the final result.
  useEffect(() => {
    let cancelled = false;

    const resolveStatus: Promise<ConflictStatus> = predictedPath
      ? client
          .fetch<Array<{ title?: string }>>(
            `*[
              !(_id in [$id, $draftId]) && (
                (_type in $types && fullPath.current == $path) ||
                (_type == "route_redirect" && fromPath == $path)
              )
            ][0...1]{title}`,
            {
              path: predictedPath,
              id: docId,
              draftId: `drafts.${docId}`,
              types: [...ROUTABLE_TYPES],
            },
          )
          .then((rows): ConflictStatus => {
            if (rows.length === 0) return { state: "ok" };
            return {
              state: "conflict",
              name: rows[0].title ?? "tài liệu khác",
            };
          })
          .catch((): ConflictStatus => ({ state: "error" }))
      : Promise.resolve<ConflictStatus>({ state: "idle" });

    resolveStatus.then((newStatus) => {
      if (!cancelled) setStatus(newStatus);
    });

    return () => {
      cancelled = true;
    };
  }, [client, predictedPath, docId]);

  // Split path into segments for color coding
  const segments = predictedPath
    ? predictedPath.replace(/^\/|\/$/g, "").split("/")
    : [];

  return (
    <div>
      {predictedPath && segments.length > 0 && (
        <div style={{ marginBottom: "8px" }}>
          {/* Color-segmented URL preview */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1px",
              fontFamily: "monospace",
              fontSize: "13px",
              background: "#f4f4f5",
              borderRadius: "5px",
              padding: "5px 10px",
              marginBottom: "5px",
            }}
          >
            <span style={{ color: "#999" }}>v2badminton.com</span>
            <span style={{ color: "#999" }}>/</span>
            {segments.map((seg, i) => {
              const isLast = i === segments.length - 1;
              const isFirst = i === 0;
              // Hub = green, intermediate nodes = blue, own slug = dark bold
              const color = isLast ? "#1a1a2e" : isFirst ? "#1a9e6f" : "#2276fc";
              const weight = isLast ? 700 : 500;
              return (
                <span key={i} style={{ color, fontWeight: weight }}>
                  {seg}
                  <span style={{ color: "#999", fontWeight: 400 }}>/</span>
                </span>
              );
            })}
          </div>

          {/* Route uniqueness status line */}
          <div style={{ fontSize: "12px" }}>
            {status.state === "ok" && (
              <span style={{ color: "#1a9e6f", fontWeight: 500 }}>
                ✓ Route unique — OK to publish
              </span>
            )}
            {status.state === "conflict" && (
              <span style={{ color: "#b45309", fontWeight: 500 }}>
                ⚠ Conflicts with &ldquo;{status.name}&rdquo;
              </span>
            )}
            {status.state === "error" && (
              <span style={{ color: "#999" }}>Could not check for conflicts</span>
            )}
          </div>
        </div>
      )}

      {/* Default Generate button + slug widget */}
      {props.renderDefault(props)}
    </div>
  );
}
