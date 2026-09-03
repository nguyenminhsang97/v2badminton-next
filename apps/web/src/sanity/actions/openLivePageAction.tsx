/**
 * "Mở trang trực tiếp" — opens the document's live production URL in a new tab.
 *
 * Wired into sanity.config.ts via document.actions resolver. Returns null for
 * non-routable document types (the action simply doesn't appear). For routable
 * types with an unsaved slug/fullPath, the action shows but is disabled.
 *
 * Always opens the PUBLISHED URL (no preview system in this project). For docs
 * with draft-only content, the live page will show the previous published
 * version or the fallback JSX until the draft is published.
 *
 * URL resolution is delegated to the shared util in
 * src/sanity/lib/resolvePath.ts so this action and the dashboard both use
 * the same resolver (Phase 2 PR 3 refactor — behaviour unchanged).
 */
import { LaunchIcon } from "@sanity/icons";
import type { DocumentActionComponent } from "sanity";
import {
  resolveFullUrl,
  ROUTABLE_TYPES,
} from "../lib/resolvePath";
import type { RoutableDoc } from "../lib/resolvePath";

export const openLivePageAction: DocumentActionComponent = (props) => {
  const { type, published, draft } = props;
  const doc = (published ?? draft) as RoutableDoc | null;

  const url = resolveFullUrl(type, doc);

  // Non-routable doc types: action does not appear at all.
  if (!ROUTABLE_TYPES.has(type)) {
    return null;
  }

  // Routable type but no slug/fullPath yet: show a disabled hint.
  if (!url) {
    return {
      label: "Mở trang trực tiếp",
      icon: LaunchIcon,
      disabled: true,
      title: "Chưa có slug — lưu tài liệu trước khi mở trang.",
      onHandle: () => {
        props.onComplete?.();
      },
    };
  }

  return {
    label: "Mở trang trực tiếp",
    icon: LaunchIcon,
    onHandle: () => {
      if (typeof window !== "undefined") {
        window.open(url, "_blank", "noopener,noreferrer");
      }
      props.onComplete?.();
    },
  };
};

openLivePageAction.displayName = "OpenLivePageAction";
