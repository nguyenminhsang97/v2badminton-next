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
 */
import { LaunchIcon } from "@sanity/icons";
import type { DocumentActionComponent, SanityDocument } from "sanity";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "https://v2badminton.com"
).replace(/\/+$/, "");

const ROUTABLE_TYPES = new Set([
  "homepage_content",
  "content_hub",
  "content_node",
  "content_article",
  "money_page",
  "static_page",
  "post",
]);

type SlugValue = { current?: string };

type RoutableDoc = SanityDocument & {
  slug?: SlugValue;
  fullPath?: SlugValue;
};

function ensureLeadingSlash(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

function ensureTrailingSlash(path: string): string {
  if (path === "/") return path;
  return path.endsWith("/") ? path : `${path}/`;
}

/**
 * Resolve a published-route path from a document. Returns null when the doc
 * type is routable but required slug/fullPath fields are empty.
 * Caller must check ROUTABLE_TYPES.has(type) before deciding to render.
 */
function resolvePath(
  schemaType: string,
  doc: RoutableDoc | null,
): string | null {
  if (!doc) return null;

  switch (schemaType) {
    case "homepage_content":
      return "/";

    case "content_hub":
    case "content_node":
    case "content_article": {
      const fullPath = doc.fullPath?.current?.trim();
      if (!fullPath) return null;
      return ensureTrailingSlash(ensureLeadingSlash(fullPath));
    }

    case "money_page":
    case "static_page": {
      const slug = doc.slug?.current?.trim();
      if (!slug) return null;
      return `/${slug}/`;
    }

    case "post": {
      const slug = doc.slug?.current?.trim();
      if (!slug) return null;
      return `/blog/${slug}/`;
    }

    default:
      return null;
  }
}

export const openLivePageAction: DocumentActionComponent = (props) => {
  const { type, published, draft } = props;
  const doc = (published ?? draft) as RoutableDoc | null;

  const path = resolvePath(type, doc);
  const url = path ? `${SITE_URL}${path}` : null;

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
