/**
 * "Xem bản nháp" — opens the document's page on the live site with draft mode on,
 * so an editor can see unpublished changes before publishing.
 *
 * Sits next to "Mở trang trực tiếp" (openLivePageAction), which always opens the
 * *published* URL. The two answer different questions: "what does the world see"
 * versus "what am I about to show them".
 *
 * How the hand-off works: the Studio and the site are separate origins
 * (cms.v2badminton.com and v2badminton.com), so there is no shared session and a
 * static secret baked into this bundle would be public. Instead
 * `createPreviewSecret` writes a short-lived secret into Sanity and returns it;
 * the site's /api/draft-mode/enable validates it against the same dataset. The
 * secret is single-use and expires on its own.
 *
 * Non-routable types get no action, same rule as openLivePageAction.
 */
import { EyeOpenIcon } from "@sanity/icons";
import { createPreviewSecret } from "@sanity/preview-url-secret/create-secret";
import { useCallback, useState } from "react";
import type { DocumentActionComponent } from "sanity";
import { useClient, useCurrentUser } from "sanity";
import { resolvePath, ROUTABLE_TYPES, SITE_URL } from "../lib/resolvePath";
import type { RoutableDoc } from "../lib/resolvePath";

// Capitalised on purpose, unlike its sibling openLivePageAction. Sanity invokes
// a document action as a React component, so this one may use hooks — but
// react-hooks/rules-of-hooks decides what is a component from the name alone,
// and a lowercase one makes it reject every hook below.
export const OpenDraftPreviewAction: DocumentActionComponent = (props) => {
  const { type, published, draft } = props;
  const client = useClient({ apiVersion: "2024-10-01" });
  const currentUser = useCurrentUser();
  const [isPending, setIsPending] = useState(false);

  // Prefer the draft: previewing is only interesting when there are unpublished
  // edits, and a draft's path may differ from the published one.
  const doc = (draft ?? published) as RoutableDoc | null;
  const path = resolvePath(type, doc);

  const handle = useCallback(async () => {
    if (!path) {
      return;
    }

    setIsPending(true);

    try {
      const { secret } = await createPreviewSecret(
        client,
        "v2badminton-studio",
        typeof window === "undefined" ? "" : window.location.href,
        currentUser?.id,
      );

      const url = new URL("/api/draft-mode/enable", SITE_URL);
      url.searchParams.set("sanity-preview-secret", secret);
      url.searchParams.set("sanity-preview-pathname", path);

      if (typeof window !== "undefined") {
        window.open(url.toString(), "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("[studio] Could not start a draft preview.", error);
    } finally {
      setIsPending(false);
      props.onComplete?.();
    }
  }, [client, currentUser?.id, path, props]);

  if (!ROUTABLE_TYPES.has(type)) {
    return null;
  }

  if (!path) {
    return {
      label: "Xem bản nháp",
      icon: EyeOpenIcon,
      disabled: true,
      title: "Chưa có slug — lưu tài liệu trước khi xem bản nháp.",
      onHandle: () => {
        props.onComplete?.();
      },
    };
  }

  return {
    label: isPending ? "Đang mở bản nháp…" : "Xem bản nháp",
    icon: EyeOpenIcon,
    disabled: isPending,
    onHandle: handle,
  };
};

OpenDraftPreviewAction.displayName = "OpenDraftPreviewAction";
